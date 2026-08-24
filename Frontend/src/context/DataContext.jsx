import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import goalService from '../services/goalService';
import progressService from '../services/progressService';
import cpService from '../services/cpService';
import profileService from '../services/profileService';

const DataContext = createContext();

export function DataProvider({ children }) {
  const { isAuthenticated, user, updateUser } = useAuth();

  const [goals, setGoals] = useState([]);
  const [progress, setProgress] = useState([]);
  const [progressSummary, setProgressSummary] = useState(null);
  const [gfgStats, setGfgStats] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('prepflow_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
      }
    }
    return {
      appearance: 'Light',
      language: 'English',
      goalReminders: true,
      aiTestReminders: true,
      connectedAccounts: {
        gfg: { username: '', connected: false, lastSynced: 'Never' },
      },
    };
  });

  useEffect(() => {
    if (settings.appearance === 'Dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('prepflow_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (user?.gfgName) {
      setSettings((prev) => ({
        ...prev,
        connectedAccounts: {
          ...prev.connectedAccounts,
          gfg: {
            username: user.gfgName,
            connected: true,
            lastSynced: prev.connectedAccounts?.gfg?.lastSynced || 'Recently',
          },
        },
      }));
    }
  }, [user?.gfgName]);

  const fetchGoals = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await goalService.getAllGoals();
      if (res.goals && Array.isArray(res.goals)) {
        let cachedColors = {};
        try {
          cachedColors = JSON.parse(localStorage.getItem('prepflow_goal_colors') || '{}');
        } catch {}

        const mapped = res.goals.map((g) => {
          const completedNum = Number(g.currentValue ?? g.completed ?? 0);
          const targetNum = Number(g.targetValue ?? g.target ?? 100);
          const percentage = Math.min(100, Math.round((completedNum / Math.max(1, targetNum)) * 100));
          const isCompleted = g.status === 'Completed' || percentage >= 100 || completedNum >= targetNum;
          
          let parsedColor = g.color;
          if (!parsedColor && g.description) {
            const match = g.description.match(/\[color:(blue|orange|green|amber|purple|indigo|sky)\]/i);
            if (match) parsedColor = match[1].toLowerCase();
          }
          if (!parsedColor && (cachedColors[g._id] || cachedColors[g.id])) {
            parsedColor = cachedColors[g._id] || cachedColors[g.id];
          }
          if (!parsedColor) {
            parsedColor = g.unit === 'Concepts' ? 'orange' : g.unit === 'Hours' ? 'blue' : 'green';
          }

          const cleanDesc = g.description
            ? g.description.replace(/\[color:(blue|orange|green|amber|purple|indigo|sky)\]/gi, '').trim()
            : '';

          let rawTargetDate = g.targetDate || '31 Dec 2026';
          if (typeof rawTargetDate === 'string' && rawTargetDate.includes('T')) {
            rawTargetDate = rawTargetDate.split('T')[0];
          }

          return {
            id: g._id,
            _id: g._id,
            title: g.title || g.goalName || 'Untitled Goal',
            description: cleanDesc,
            unit: g.unit || 'Problems',
            current: completedNum,
            completed: completedNum,
            currentValue: completedNum,
            target: targetNum,
            targetValue: targetNum,
            targetDate: rawTargetDate,
            status: g.status || (isCompleted ? 'Completed' : 'Active'),
            color: parsedColor,
            percentage,
            completedStatus: isCompleted,
          };
        });
        setGoals(mapped);
      } else {
        setGoals([]);
      }
    } catch (err) {
      console.warn('Failed to fetch goals:', err);
    }
  }, [isAuthenticated]);

  const fetchProgress = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const [allRes, summaryRes] = await Promise.allSettled([
        progressService.getAllProgress(),
        progressService.getSummary(),
      ]);

      if (allRes.status === 'fulfilled' && allRes.value) {
        const resVal = allRes.value;
        if (resVal.data && typeof resVal.data === 'object' && !Array.isArray(resVal.data)) {
          const list = Object.entries(resVal.data).map(([subjectName, subjData]) => ({
            subject: subjectName,
            completedCount: subjData.completedCount || subjData.topics?.length || 0,
            topics: subjData.topics || [],
          }));
          setProgress(list);
        } else if (Array.isArray(resVal.progress)) {
          setProgress(resVal.progress);
        } else if (Array.isArray(resVal.data)) {
          setProgress(resVal.data);
        } else if (Array.isArray(resVal)) {
          setProgress(resVal);
        }
      }

      if (summaryRes.status === 'fulfilled' && summaryRes.value) {
        setProgressSummary(summaryRes.value.summary || summaryRes.value);
      }
    } catch (err) {
      console.warn('Failed to fetch progress:', err);
    }
  }, [isAuthenticated]);

  const fetchGfgStats = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await cpService.getGfgData();
      const rawData = res.gfgData || res.data || res;
      if (rawData) {
        setGfgStats(rawData);
        setSettings((prev) => ({
          ...prev,
          connectedAccounts: {
            ...prev.connectedAccounts,
            gfg: {
              ...prev.connectedAccounts?.gfg,
              username: rawData.username || prev.connectedAccounts?.gfg?.username,
              lastSynced: 'Just now',
              connected: true,
            },
          },
        }));
      }
    } catch (err) {
      console.warn('Failed to fetch GFG stats:', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      setLoadingData(true);
      Promise.allSettled([fetchGoals(), fetchProgress(), fetchGfgStats()]).finally(() => {
        setLoadingData(false);
      });
    } else {
      setGoals([]);
      setProgress([]);
      setProgressSummary(null);
      setGfgStats(null);
    }
  }, [isAuthenticated, fetchGoals, fetchProgress, fetchGfgStats]);

  const addGoal = async (newGoal) => {
    try {
      const selectedColor = newGoal.color || 'green';
      const descWithColor = newGoal.description
        ? `${newGoal.description} [color:${selectedColor}]`
        : `[color:${selectedColor}]`;

      const payload = {
        title: newGoal.title || newGoal.goalName,
        description: descWithColor,
        color: selectedColor,
        unit: newGoal.unit || 'Problems',
        currentValue: Number(newGoal.currentValue ?? newGoal.current ?? newGoal.completed ?? 0),
        targetValue: Number(newGoal.targetValue ?? newGoal.target ?? 100),
        targetDate: newGoal.targetDate || '31 Dec 2026',
        status: newGoal.status || (Number(newGoal.currentValue ?? newGoal.current ?? 0) >= Number(newGoal.targetValue ?? newGoal.target ?? 100) ? 'Completed' : 'Active'),
      };
      const res = await goalService.createGoal(payload);
      const createdGoal = res.Goal || res.goal;
      const createdId = createdGoal?._id || createdGoal?.id;

      if (createdId) {
        try {
          const cachedColors = JSON.parse(localStorage.getItem('prepflow_goal_colors') || '{}');
          cachedColors[createdId] = selectedColor;
          localStorage.setItem('prepflow_goal_colors', JSON.stringify(cachedColors));
        } catch {}
      }

      await fetchGoals();
      return createdGoal;
    } catch (err) {
      console.error('Failed to create goal:', err);
      throw err;
    }
  };

  const updateGoal = async (id, updatedFields) => {
    try {
      let desc = updatedFields.description;
      if (updatedFields.color) {
        const baseDesc = desc ? desc.replace(/\[color:(blue|orange|green|amber|purple|indigo|sky)\]/gi, '').trim() : '';
        desc = baseDesc ? `${baseDesc} [color:${updatedFields.color}]` : `[color:${updatedFields.color}]`;

        try {
          const cachedColors = JSON.parse(localStorage.getItem('prepflow_goal_colors') || '{}');
          cachedColors[id] = updatedFields.color;
          localStorage.setItem('prepflow_goal_colors', JSON.stringify(cachedColors));
        } catch {}
      }

      const payload = {
        title: updatedFields.title || updatedFields.goalName,
        description: desc,
        color: updatedFields.color,
        unit: updatedFields.unit,
        currentValue: updatedFields.currentValue !== undefined
          ? Number(updatedFields.currentValue)
          : updatedFields.current !== undefined
          ? Number(updatedFields.current)
          : updatedFields.completed !== undefined
          ? Number(updatedFields.completed)
          : undefined,
        targetValue: updatedFields.targetValue !== undefined
          ? Number(updatedFields.targetValue)
          : updatedFields.target !== undefined
          ? Number(updatedFields.target)
          : undefined,
        targetDate: updatedFields.targetDate || '31 Dec 2026',
        status: updatedFields.status,
      };
      const res = await goalService.updateGoal(id, payload);
      await fetchGoals();
      return res.Goal || res.goal;
    } catch (err) {
      console.error('Failed to update goal:', err);
      throw err;
    }
  };

  const deleteGoal = async (id) => {
    try {
      await goalService.deleteGoal(id);
      setGoals((prev) => prev.filter((g) => g.id !== id && g._id !== id));
    } catch (err) {
      console.error('Failed to delete goal:', err);
      throw err;
    }
  };

  const deleteAllGoals = async () => {
    try {
      await goalService.deleteAllGoals();
      setGoals([]);
    } catch (err) {
      console.error('Failed to delete all goals:', err);
      throw err;
    }
  };

  const markGoalCompleted = async (id) => {
    const goal = goals.find((g) => g.id === id || g._id === id);
    if (!goal) return;
    await updateGoal(id, {
      ...goal,
      currentValue: goal.target || goal.targetValue || 100,
      status: 'Completed',
    });
  };

  const toggleGoal = async (id) => {
    const goal = goals.find((g) => g.id === id || g._id === id);
    if (!goal) return;
    const isCompleted = (goal.current ?? 0) >= (goal.target ?? 1) || goal.status === 'Completed';
    const newStatus = isCompleted ? 'Active' : 'Completed';
    const newCompleted = isCompleted ? 0 : (goal.target || goal.targetValue || 100);
    await updateGoal(id, {
      ...goal,
      currentValue: newCompleted,
      status: newStatus,
    });
  };

  // --- Progress Actions ---
  const addTopic = async (subject, topic) => {
    try {
      const res = await progressService.addTopicManually({ subject, topic });
      await fetchProgress();
      return res;
    } catch (err) {
      console.error('Failed to add topic:', err);
      throw err;
    }
  };

  const deleteTopic = async (progressId, subject) => {
    try {
      if (progressId && typeof progressId === 'string' && progressId.length > 5) {
        await progressService.deleteProgress(progressId);
      } else if (subject) {
        await progressService.deleteSubject(subject);
      }
      await fetchProgress();
    } catch (err) {
      console.error('Failed to delete topic:', err);
      throw err;
    }
  };

  const deleteSubject = async (subject) => {
    try {
      await progressService.deleteSubject(subject);
      await fetchProgress();
    } catch (err) {
      console.error('Failed to delete subject progress:', err);
      throw err;
    }
  };

  const deleteAllProgress = async () => {
    try {
      await progressService.deleteAllProgress();
      await fetchProgress();
    } catch (err) {
      console.error('Failed to delete all progress:', err);
      throw err;
    }
  };

  const updateConnectedAccount = async (platform, username) => {
    try {
      if (platform === 'gfg') {
        await profileService.updateProfile({ gfgName: username });
        updateUser({ gfgName: username });
        setSettings((prev) => ({
          ...prev,
          connectedAccounts: {
            ...prev.connectedAccounts,
            gfg: {
              username,
              connected: !!username,
              lastSynced: 'Just now',
            },
          },
        }));
        await fetchGfgStats();
      }
    } catch (err) {
      console.error('Failed to update platform handle:', err);
      throw err;
    }
  };

  const totalCompletedTopics =
    progressSummary?.totalCompletedTopics ??
    progress.reduce((acc, curr) => acc + (curr.topics?.length || 0), 0);

  const totalSubjectsCount =
    progressSummary?.totalSubjects ?? (progress.length || 0);

  const gfgSolvedCount = Number(
    gfgStats?.totalProblemsSolved ||
    gfgStats?.totalSolved ||
    gfgStats?.total_problems_solved ||
    0
  );
  const currentStreakCount = Number(
    gfgStats?.currentStreak ||
    gfgStats?.streak ||
    gfgStats?.pod_solved_current_streak ||
    0
  );

  const stats = {
    totalProblems: gfgSolvedCount,
    gfgSolved: gfgSolvedCount,
    currentStreak: currentStreakCount,
    completedTopicsCount: totalCompletedTopics,
    totalSubjects: totalSubjectsCount,
    activeGoalsCount: goals.filter((g) => !g.completedStatus).length,
    aiTestsTaken: progress.reduce(
      (acc, s) => acc + (s.topics?.filter((t) => t.isTestTaken)?.length || 0),
      0
    ),
    topicsTested: totalCompletedTopics,
  };

  const otherGoals = [
    { id: 'og1', title: 'Daily Coding Streak', completed: stats.currentStreak || 0, total: 30, icon: 'trophy' },
    { id: 'og2', title: 'GFG Problem Target', completed: stats.gfgSolved || 0, total: 500, icon: 'target' },
    { id: 'og3', title: 'Revision Milestones', completed: stats.completedTopicsCount || 0, total: 50, icon: 'calendar' },
  ];

  return (
    <DataContext.Provider
      value={{
        goals,
        otherGoals,
        addGoal,
        updateGoal,
        deleteGoal,
        deleteAllGoals,
        markGoalCompleted,
        toggleGoal,
        reloadGoals: fetchGoals,

        progress,
        progressSummary,
        addTopic,
        deleteTopic,
        deleteSubject,
        deleteAllProgress,
        reloadProgress: fetchProgress,

        gfgStats,
        reloadGfgStats: fetchGfgStats,

        stats,
        settings,
        setSettings,
        updateConnectedAccount,
        loadingData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
