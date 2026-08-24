import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  Monitor,
  ChevronRight,
  Shield,
  Trash2,
  X,
  AlertTriangle,
} from 'lucide-react';
import Card from '../components/Card';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import UserAvatar from '../components/UserAvatar';
import settingService from '../services/settingService';

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { settings, setSettings } = useData();

  const theme = settings.appearance || 'Light';
  const setTheme = (newTheme) => {
    setSettings((prev) => ({
      ...prev,
      appearance: newTheme,
    }));
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError('');
    setDeleteLoading(true);
    try {
      await settingService.deleteAccount({ password: deletePassword });
      setShowDeleteModal(false);
      logout();
      navigate('/login');
    } catch (err) {
      setDeleteError(err?.response?.data?.message || 'Failed to delete account. Please verify password.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Customize your experience and preferences.
          </p>
        </div>

        <UserAvatar user={user} size="md" />
      </div>

      {/* Appearance Card */}
      <Card className="p-6 border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5 mb-1">
          <Sun className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Appearance</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Choose your preferred theme</p>

        <div className="grid grid-cols-3 gap-3">
          {[
            { name: 'Light', icon: Sun },
            { name: 'Dark', icon: Moon },
            { name: 'System', icon: Monitor },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = theme === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setTheme(item.name)}
                className={`py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Account Card */}
      <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5 mb-1">
          <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Account Security</h2>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <div
            onClick={() => navigate('/profile')}
            className="py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 px-1 rounded-lg"
          >
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Change Password</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div
            onClick={() => setShowDeleteModal(true)}
            className="py-3 flex items-center justify-between cursor-pointer hover:bg-red-50/50 dark:hover:bg-red-950/30 px-1 rounded-lg text-red-600 dark:text-red-400"
          >
            <div>
              <span className="text-xs font-bold block">Delete Account</span>
              <span className="text-[11px] text-red-400 dark:text-red-400">Permanently delete your account and all data</span>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400" />
          </div>
        </div>
      </Card>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Delete Account</h3>
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              This action cannot be undone. All your progress, goals, and history will be permanently deleted.
            </p>

            {deleteError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 rounded-xl text-xs">
                {deleteError}
              </div>
            )}

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Enter your password to confirm
                </label>
                <input
                  type="password"
                  required
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Your account password"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleteLoading || !deletePassword}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl shadow-xs disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{deleteLoading ? 'Deleting...' : 'Delete Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
