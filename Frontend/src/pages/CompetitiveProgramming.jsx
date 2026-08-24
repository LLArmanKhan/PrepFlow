import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, Flame, ArrowRight, TrendingUp, Pencil, Check, Code2, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';

export default function CompetitiveProgramming() {
  const { user } = useAuth();
  const { gfgStats, reloadGfgStats, settings, updateConnectedAccount } = useData();
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [isEditingHandle, setIsEditingHandle] = useState(false);
  const currentGfgUsername = user?.gfgName || settings.connectedAccounts?.gfg?.username || '';
  const [handleInput, setHandleInput] = useState(currentGfgUsername);

  const handleRefresh = async () => {
    setSyncing(true);
    setErrorMsg('');
    try {
      await reloadGfgStats();
      setSyncMsg('Synced successfully!');
      setTimeout(() => setSyncMsg(''), 3000);
    } catch (e) {
      setErrorMsg('Failed to sync GFG data. Please check username.');
    } finally {
      setSyncing(false);
    }
  };

  const handleSaveHandle = async (e) => {
    e.preventDefault();
    if (!handleInput.trim()) return;
    setSyncing(true);
    setErrorMsg('');
    try {
      await updateConnectedAccount('gfg', handleInput.trim());
      setIsEditingHandle(false);
      setSyncMsg('GeeksforGeeks handle saved and synced!');
      setTimeout(() => setSyncMsg(''), 3000);
    } catch (e) {
      setErrorMsg('Failed to update GFG handle.');
    } finally {
      setSyncing(false);
    }
  };

  const solvedTotal = Number(
    gfgStats?.totalProblemsSolved ??
    gfgStats?.totalSolved ??
    gfgStats?.total_problems_solved ??
    0
  );
  const easySolved = Number(
    gfgStats?.problemsOverview?.easy ??
    gfgStats?.easy ??
    gfgStats?.easy_problems_solved ??
    0
  );
  const mediumSolved = Number(
    gfgStats?.problemsOverview?.medium ??
    gfgStats?.medium ??
    gfgStats?.medium_problems_solved ??
    0
  );
  const hardSolved = Number(
    gfgStats?.problemsOverview?.hard ??
    gfgStats?.hard ??
    gfgStats?.hard_problems_solved ??
    0
  );
  const streakDays = Number(
    gfgStats?.currentStreak ??
    gfgStats?.streak ??
    gfgStats?.pod_solved_current_streak ??
    0
  );
  const codingScore = Number(gfgStats?.codingScore ?? 0);

  const topics = gfgStats?.topics || [
    { name: 'Arrays & Strings', count: Math.round(solvedTotal * 0.35) },
    { name: 'Dynamic Programming', count: Math.round(solvedTotal * 0.25) },
    { name: 'Trees & Graphs', count: Math.round(solvedTotal * 0.2) },
    { name: 'Searching & Sorting', count: Math.round(solvedTotal * 0.12) },
    { name: 'Recursion & Backtracking', count: Math.round(solvedTotal * 0.08) },
  ];

  const getLatest5Submissions = () => {
    if (!currentGfgUsername) return [];

    const rawList =
      Array.isArray(gfgStats?.solvedProblems) && gfgStats.solvedProblems.length > 0
        ? gfgStats.solvedProblems
        : Array.isArray(gfgStats?.recentSubmissions) && gfgStats.recentSubmissions.length > 0
        ? gfgStats.recentSubmissions
        : Array.isArray(gfgStats?.submissions) && gfgStats.submissions.length > 0
        ? gfgStats.submissions
        : Array.isArray(gfgStats?.recentActivity) && gfgStats.recentActivity.length > 0
        ? gfgStats.recentActivity
        : [];

    if (rawList.length === 0) return [];

    const parseTime = (item) => {
      const t =
        item.user_subtime ||
        item.subtime ||
        item.submission_time ||
        item.submissionTime ||
        item.submittedAt ||
        item.date ||
        item.createdAt ||
        item.time;
      if (!t) return 0;
      if (typeof t === 'number') return t;
      const parsed = Date.parse(String(t).replace(/-/g, '/'));
      if (!isNaN(parsed)) return parsed;
      const directParsed = new Date(t).getTime();
      return isNaN(directParsed) ? 0 : directParsed;
    };

    const sorted = [...rawList].sort((a, b) => {
      const timeA = parseTime(a);
      const timeB = parseTime(b);
      if (timeA !== 0 && timeB !== 0) {
        return timeB - timeA;
      }
      if (timeB !== 0) return 1;
      if (timeA !== 0) return -1;
      return 0;
    });

    return sorted.slice(0, 5).map((p, idx) => ({
      id: p.id || p._id || idx,
      title: p.pname || p.problemName || p.title || p.slug || 'Problem Solved',
      difficulty: p.difficulty || p.diff || 'Solved',
      time: p.user_subtime || p.subtime || p.submittedAt || p.date || p.time || 'Recently',
    }));
  };

  const recentActivity = getLatest5Submissions();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Competitive Programming
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your progress on GeeksforGeeks (GFG) and sync your solved problems
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={syncing}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shrink-0 self-start sm:self-auto shadow-xs cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-emerald-600 dark:text-emerald-400' : ''}`} />
          <span>{syncing ? 'Syncing...' : 'Sync GFG Data'}</span>
        </button>
      </div>

      {syncMsg && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{syncMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* GeeksforGeeks Active Handle Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 font-bold text-sm">
              <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>GeeksforGeeks (GFG)</span>
            </div>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              currentGfgUsername
                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}>
              {currentGfgUsername ? 'Connected' : 'Handle Not Configured'}
            </span>
          </div>

          {/* Active GFG Username Display */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Profile:</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
              @{currentGfgUsername || 'not_set'}
            </span>
            <button
              onClick={() => {
                setHandleInput(currentGfgUsername);
                setIsEditingHandle(!isEditingHandle);
              }}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 ml-1 cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>{isEditingHandle ? 'Cancel' : 'Edit Username'}</span>
            </button>
          </div>
        </div>

        {/* Inline Edit Form if toggled */}
        {isEditingHandle && (
          <form onSubmit={handleSaveHandle} className="flex items-center gap-2 pt-1 animate-in fade-in">
            <div className="relative flex-1 max-w-sm">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">@</span>
              <input
                type="text"
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
                placeholder="Enter GFG username (e.g. arjun_28)"
                className="w-full pl-7 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              disabled={syncing}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Handle</span>
            </button>
          </form>
        )}
      </div>

      {/* Grid Layout: Overall Stats & Topic Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Statistics Card */}
        <Card className="flex flex-col justify-between p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                GeeksforGeeks Statistics
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              User: @{currentGfgUsername || 'guest'}
            </span>
          </div>

          <div className="text-center my-6">
            <div className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {solvedTotal}
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
              Problems Solved
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="bg-emerald-50/60 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-100/60 dark:border-emerald-900/40">
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 block">{easySolved}</span>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Easy</span>
            </div>
            <div className="bg-amber-50/60 dark:bg-amber-950/40 p-3 rounded-2xl border border-amber-100/60 dark:border-amber-900/40">
              <span className="text-xl font-bold text-amber-600 dark:text-amber-400 block">{mediumSolved}</span>
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Medium</span>
            </div>
            <div className="bg-red-50/60 dark:bg-red-950/40 p-3 rounded-2xl border border-red-100/60 dark:border-red-900/40">
              <span className="text-xl font-bold text-red-600 dark:text-red-400 block">{hardSolved}</span>
              <span className="text-xs font-semibold text-red-700 dark:text-red-300">Hard</span>
            </div>
          </div>
        </Card>

        {/* Topic-wise Breakdown Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Topic-wise Breakdown</h2>
            </div>
          </div>

          <div className="space-y-4">
            {topics.map((topic) => (
              <div key={topic.name} className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300 w-44 truncate">{topic.name}</span>
                <div className="flex-1 mx-4 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, (topic.count / Math.max(1, solvedTotal)) * 100)}%` }}
                  />
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 w-6 text-right">{topic.count}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Overall Score: <strong className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{codingScore}</strong></span>
            {currentGfgUsername && (
              <span className="text-[11px] text-slate-400">
                Synced from GFG
              </span>
            )}
          </div>
        </Card>
      </div>

      {/* Grid Layout: Recent Activity & Streak */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Card */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Recent Solved Submissions</h2>
            {recentActivity.length > 0 && (
              <span className="text-[11px] text-slate-400 font-medium">{recentActivity.length} recent</span>
            )}
          </div>

          {!currentGfgUsername ? (
            <div className="text-center py-8 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                No GeeksforGeeks handle linked. Add your GFG username above to view your recent solved submissions.
              </p>
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="text-center py-8 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                No recent submissions found for @{currentGfgUsername}. Solve a problem on GFG or click "Sync GFG Data".
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id || activity.title}
                  className="flex items-center justify-between p-3.5 bg-slate-50/80 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800"
                >
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">{activity.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          activity.difficulty === 'Easy'
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                            : activity.difficulty === 'Medium'
                            ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                            : activity.difficulty === 'Hard'
                            ? 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {activity.difficulty}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">• {activity.time}</span>
                    </div>
                  </div>

                  <div className="text-emerald-500">
                    <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-white" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Streak Card */}
        <Card className="p-6 flex flex-col justify-between border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Current POTD Streak</h2>
            </div>

            <div className="my-4">
              <span className="text-3xl font-extrabold text-slate-800 dark:text-white block">
                {streakDays} {streakDays === 1 ? 'day' : 'days'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {streakDays > 0 ? 'Consistency is key — keep it up!' : 'Solve a problem today to start a streak!'}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
