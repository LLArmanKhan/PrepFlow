import React, { useState } from 'react';

import {
  Target,
  Plus,
  MoreVertical,
  BookOpen,
  Flame,
  CheckCircle2,
  X,
  Trophy,
  Pencil,
  TrendingUp,
  Trash2,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';

export default function Goals() {
  const {
    goals = [],
    addGoal,
    updateGoal,
    deleteGoal,
    markGoalCompleted,
  } = useData();
  const [activeTab, setActiveTab] = useState('Active');

  const [openMenuId, setOpenMenuId] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [updatingProgressGoal, setUpdatingProgressGoal] = useState(null);
  const [deletingGoal, setDeletingGoal] = useState(null);

  const [title, setTitle] = useState('');
  const [targetVal, setTargetVal] = useState('300');
  const [currentVal, setCurrentVal] = useState('0');
  const [unit, setUnit] = useState('Problems');
  const [targetDate, setTargetDate] = useState('31 Dec 2026');
  const [color, setColor] = useState('green');

  const [editTitle, setEditTitle] = useState('');
  const [editTargetVal, setEditTargetVal] = useState('300');
  const [editCurrentVal, setEditCurrentVal] = useState('0');
  const [editUnit, setEditUnit] = useState('Problems');
  const [editTargetDate, setEditTargetDate] = useState('31 Dec 2026');
  const [editColor, setEditColor] = useState('green');

  const [progressVal, setProgressVal] = useState('');

  const safeGoals = Array.isArray(goals) ? goals : [];

  const filteredGoals = safeGoals.filter((g) => {
    if (!g) return false;
    const isGoalCompleted =
      g.status === 'Completed' ||
      g.status === 'completed' ||
      g.completedStatus ||
      (Number(g.percentage) || 0) >= 100 ||
      ((Number(g.current) || 0) >= (Number(g.target) || 1) && Number(g.target) > 0);
    return activeTab === 'Active' ? !isGoalCompleted : isGoalCompleted;
  });

  const formatGoalDate = (dateStr) => {
    if (!dateStr) return '31 Dec 2026';
    const str = String(dateStr).trim();
    if (str.includes('T')) {
      return str.split('T')[0];
    }
    if (str.includes(' ') && str.includes(':')) {
      return str.split(' ')[0];
    }
    return str;
  };

  const handleAddGoalSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const current = parseInt(currentVal, 10) || 0;
    const target = parseInt(targetVal, 10) || 100;
    const isCompleted = current >= target;

    await addGoal({
      title: title.trim(),
      description: '',
      unit: unit || 'Problems',
      currentValue: current,
      targetValue: target,
      targetDate: targetDate || '31 Dec 2026',
      status: isCompleted ? 'Completed' : 'Active',
      color,
    });

    // Reset form
    setTitle('');
    setCurrentVal('0');
    setTargetVal('300');
    setTargetDate('31 Dec 2026');
    setColor('green');
    setUnit('Problems');
    setShowAddModal(false);
  };

  const handleOpenEditModal = (goal) => {
    setEditingGoal(goal);
    setEditTitle(goal.title || '');
    setEditCurrentVal(String(goal.current ?? goal.currentValue ?? 0));
    setEditTargetVal(String(goal.target ?? goal.targetValue ?? 100));
    setEditUnit(goal.unit || 'Problems');
    setEditTargetDate(goal.targetDate ? formatGoalDate(goal.targetDate) : '31 Dec 2026');
    setEditColor(goal.color || 'green');
  };

  const handleEditGoalSubmit = async (e) => {
    e.preventDefault();
    if (!editingGoal || !editTitle.trim()) return;

    const current = parseInt(editCurrentVal, 10) || 0;
    const target = parseInt(editTargetVal, 10) || 1;
    const isCompleted = current >= target;

    await updateGoal(editingGoal.id || editingGoal._id, {
      title: editTitle.trim(),
      currentValue: current,
      targetValue: target,
      targetDate: editTargetDate || '31 Dec 2026',
      unit: editUnit,
      color: editColor,
      status: isCompleted ? 'Completed' : 'Active',
    });

    setEditingGoal(null);
  };

  const handleOpenProgressModal = (goal) => {
    setUpdatingProgressGoal(goal);
    setProgressVal(String(goal.current ?? goal.currentValue ?? 0));
  };

  const handleUpdateProgressSubmit = async (e) => {
    e.preventDefault();
    if (!updatingProgressGoal) return;

    const current = parseInt(progressVal, 10) || 0;
    const target = updatingProgressGoal.target || updatingProgressGoal.targetValue || 1;
    const isCompleted = current >= target;

    await updateGoal(updatingProgressGoal.id || updatingProgressGoal._id, {
      currentValue: current,
      status: isCompleted ? 'Completed' : 'Active',
    });

    setUpdatingProgressGoal(null);
  };

  const handleMarkCompleted = async (goal) => {
    await markGoalCompleted(goal.id || goal._id);
  };

  const handleDeleteConfirm = async () => {
    if (deletingGoal) {
      await deleteGoal(deletingGoal.id || deletingGoal._id);
      setDeletingGoal(null);
    }
  };

  const getGoalIcon = (iconName, colorStyle) => {
    const c = (colorStyle || '').toLowerCase();
    if (c === 'orange' || c === 'amber' || iconName === 'book') {
      return (
        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
      );
    }
    if (c === 'blue' || c === 'sky' || iconName === 'flame') {
      return (
        <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 shrink-0">
          <Flame className="w-5 h-5" />
        </div>
      );
    }
    if (c === 'purple') {
      return (
        <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 shrink-0">
          <Trophy className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
        <Target className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Goals</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Set your goals and track your progress
          </p>
        </div>

        {activeTab === 'Active' && (
          <button
            id="goals-new-goal-btn"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-xs shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Goal</span>
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex gap-8">
        {['Active', 'Completed'].map((tab) => (
          <button
            key={tab}
            id={`goals-tab-${tab.toLowerCase()}`}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer ${
              activeTab === tab
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 font-bold'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Goals List (Full Width, other goals removed) */}
      <div className="space-y-4">
        {filteredGoals.map((goal) => (
          <Card key={goal.id} className="p-5 space-y-3 border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {getGoalIcon(goal.icon, goal.color)}
                <div>
                  <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">{goal.title}</h2>
                </div>
              </div>

              <div className="flex items-center gap-2 relative">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{goal.percentage}%</span>

                {/* Three-dot menu trigger */}
                <button
                  type="button"
                  id={`goal-menu-trigger-${goal.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === goal.id ? null : goal.id);
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Goal options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {openMenuId === goal.id && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setOpenMenuId(null)}
                    />
                    <div className="absolute right-0 top-8 z-30 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-1 text-xs animate-in fade-in zoom-in-95 duration-150">
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          handleOpenEditModal(goal);
                        }}
                        className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <Pencil className="w-3.5 h-3.5 text-slate-400" />
                        <span>Edit Goal</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          handleOpenProgressModal(goal);
                        }}
                        className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                        <span>Update Progress</span>
                      </button>

                      {goal.status !== 'completed' && goal.current < goal.target && (
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuId(null);
                            handleMarkCompleted(goal);
                          }}
                          className="w-full px-3 py-2 text-left text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-2 cursor-pointer font-medium"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Mark as Completed</span>
                        </button>
                      )}

                      <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          setDeletingGoal(goal);
                        }}
                        className="w-full px-3 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        <span>Delete Goal</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <ProgressBar value={goal.current} max={goal.target} color={goal.color || 'green'} height="h-2.5" />

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {goal.current} / {goal.target} {goal.unit || ''}
              </span>
              <span>Target: {formatGoalDate(goal.targetDate)}</span>
            </div>
          </Card>
        ))}

        {filteredGoals.length === 0 && (
          <Card className="p-8 text-center text-slate-400 text-xs border-slate-200 dark:border-slate-800">
            No {activeTab.toLowerCase()} goals. Click "+ New Goal" to set one!
          </Card>
        )}
      </div>

      {/* New Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Create New Goal</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGoalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master System Design Concepts"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Current</label>
                  <input
                    type="number"
                    value={currentVal}
                    onChange={(e) => setCurrentVal(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target</label>
                  <input
                    type="number"
                    value={targetVal}
                    onChange={(e) => setTargetVal(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Date</label>
                  <input
                    type="text"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    placeholder="31 Dec 2026"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Color Accent</label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                    <option value="orange">Orange</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl hover:bg-blue-700 cursor-pointer shadow-xs"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Goal Modal */}
      {editingGoal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Edit Goal</h3>
              <button
                onClick={() => setEditingGoal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditGoalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Current</label>
                  <input
                    type="number"
                    value={editCurrentVal}
                    onChange={(e) => setEditCurrentVal(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target</label>
                  <input
                    type="number"
                    value={editTargetVal}
                    onChange={(e) => setEditTargetVal(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Date</label>
                  <input
                    type="text"
                    value={editTargetDate}
                    onChange={(e) => setEditTargetDate(e.target.value)}
                    placeholder="31 Dec 2026"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Color Accent</label>
                  <select
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                    <option value="orange">Orange</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingGoal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl hover:bg-blue-700 cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Progress Modal */}
      {updatingProgressGoal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Update Progress</h3>
              <button
                onClick={() => setUpdatingProgressGoal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 truncate font-medium">
              {updatingProgressGoal.title}
            </p>

            <form onSubmit={handleUpdateProgressSubmit} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Current Progress
                  </label>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    Target: {updatingProgressGoal.target} {updatingProgressGoal.unit || ''}
                  </span>
                </div>
                <input
                  type="number"
                  required
                  autoFocus
                  value={progressVal}
                  onChange={(e) => setProgressVal(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setUpdatingProgressGoal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl hover:bg-blue-700 cursor-pointer shadow-xs"
                >
                  Update Progress
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingGoal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Delete Goal</h3>
              <button
                onClick={() => setDeletingGoal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
              Are you sure you want to delete <strong className="text-slate-800 dark:text-slate-100 font-bold">"{deletingGoal.title}"</strong>? This goal will be permanently removed.
            </p>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingGoal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs"
              >
                Delete Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
