import React from 'react';
import { Menu, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserAvatar from './UserAvatar';

export default function Topbar({ onOpenMobileSidebar }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const fullName =
    user?.username ||
    user?.name ||
    (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '') ||
    (user?.email ? user.email.split('@')[0] : 'User');

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 sm:px-8 sticky top-0 z-20 flex items-center justify-between shrink-0 shadow-xs">
      {/* Mobile view branding and menu toggle */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Layers className="w-4.5 h-4.5" />
          </div>
          <span className="font-bold text-slate-800 dark:text-white text-lg tracking-tight">PrepFlow</span>
        </div>
      </div>

      {/* Right Corner Actions: Profile */}
      <div className="flex items-center space-x-4 ml-auto">
        <div
          onClick={() => navigate('/profile')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {fullName}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              {user?.targetRole || user?.email || 'Student'}
            </p>
          </div>
          <UserAvatar user={user} name={fullName} size="md" />
        </div>
      </div>
    </header>
  );
}
