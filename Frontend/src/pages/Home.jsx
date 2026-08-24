import React from 'react';

import { useNavigate } from 'react-router-dom';
import {
  Code,
  BookOpen,
  Bot,
  Target,
  ArrowRight,
  Flame,
  CheckCircle2,
  Trophy,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';

export default function Home() {
  const { user } = useAuth();
  const { stats, goals } = useData();
  const navigate = useNavigate();

  const userName =
    user?.username ||
    user?.name ||
    (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '') ||
    (user?.email ? user.email.split('@')[0] : 'User');

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
          Welcome back, {userName}! 👋
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Let's continue your preparation journey. You're one step closer to your goals.
        </p>
      </div>

      {/* Main 4 Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
        {/* Competitive Programming Card */}
        <Card
          onClick={() => navigate('/competitive')}
          className="flex flex-col justify-between hover:border-blue-200 dark:hover:border-blue-800 group"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold shrink-0">
                <Code className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-base">Competitive Programming</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 my-2 p-3 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">GFG Solved</span>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.gfgSolved}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Current POTD Streak</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-2xl font-bold text-amber-500">{stats.currentStreak}</span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Card>

        {/* Progress Card */}
        <Card
          onClick={() => navigate('/progress')}
          className="flex flex-col justify-between hover:border-emerald-200 dark:hover:border-emerald-800 group"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                <BookOpen className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-base">Progress</h2>
            </div>

            <div className="my-2 p-3 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Completed Topics</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.completedTopicsCount}</span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Across {stats.totalSubjects} Subjects</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Card>

        {/* AI Assistant Card */}
        <Card
          onClick={() => navigate('/assistant')}
          className="flex flex-col justify-between hover:border-purple-200 dark:hover:border-purple-800 group"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-bold shrink-0">
                <Bot className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-base">AI Assistant</h2>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 my-2 leading-relaxed">
              Ask anything about DSA, OS, DBMS and more. Get instant structured answers and comparisons.
            </p>
          </div>

          <div className="mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/assistant');
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Ask Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>

        {/* Goals Card */}
        <Card
          onClick={() => navigate('/goals')}
          className="flex flex-col justify-between hover:border-amber-200 dark:hover:border-amber-800 group"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-bold shrink-0">
                <Target className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-base">Goals</h2>
            </div>

            <div className="my-2 p-3 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Active Goals</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.activeGoalsCount}</span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Keep pushing forward!</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
            <span>View Goals</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Card>
      </div>

      {/* Quick Stats Banner */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">Quick Stats</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Total Problems Solved</span>
              <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{stats.totalProblems}</span>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">AI Tests Taken</span>
              <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{stats.aiTestsTaken}</span>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Topics Tested</span>
              <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{stats.topicsTested}</span>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Current POTD Streak</span>
              <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{stats.currentStreak} days</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Upcoming Milestones */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Upcoming Milestones</h3>
          <button
            onClick={() => navigate('/goals')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            View All
          </button>
        </div>

        <div className="space-y-3">
          {goals.map((goal) => (
            <Card key={goal.id} className="p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{goal.title}</h4>
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{goal.percentage}%</span>
              </div>

              <ProgressBar value={goal.current} max={goal.target} color={goal.color} height="h-2" />

              <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                <span>{goal.current} / {goal.target}</span>
                <span>Target: {goal.targetDate ? String(goal.targetDate).split('T')[0] : '31 Dec 2026'}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
