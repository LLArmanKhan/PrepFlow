import React from 'react';

import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home as HomeIcon,
  Code,
  BookOpen,
  Bot,
  Target,
  User,
  Settings as SettingsIcon,
  LogOut,
  Layers,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserAvatar from './UserAvatar';

export default function Sidebar({ onCloseMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/home', icon: HomeIcon },
    { name: 'Competitive Programming', path: '/competitive', icon: Code },
    { name: 'Progress', path: '/progress', icon: BookOpen },
    { name: 'AI Assistant', path: '/assistant', icon: Bot },
    { name: 'Goals', path: '/goals', icon: Target },
  ];

  const handleLinkClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen flex flex-col justify-between shrink-0 select-none sticky top-0 z-30">
      {/* Top Header & Navigation */}
      <div className="p-5 flex flex-col h-full overflow-y-auto no-scrollbar">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Layers className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
            PrepFlow
          </span>
        </div>

        {/* Main Navigation Links */}
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 stroke-[2]" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Menu Items: Profile, Settings */}
        <div className="pt-4 mt-auto border-t border-slate-100 dark:border-slate-800 space-y-1">
          <NavLink
            to="/profile"
            onClick={handleLinkClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
          >
            <User className="w-4 h-4 shrink-0 stroke-[2]" />
            <span>Profile</span>
          </NavLink>

          <NavLink
            to="/settings"
            onClick={handleLinkClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
          >
            <SettingsIcon className="w-4 h-4 shrink-0 stroke-[2]" />
            <span>Settings</span>
          </NavLink>
        </div>

        {/* User Info Bar & Logout */}
        {(() => {
          const displayName =
            user?.username ||
            user?.name ||
            (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '') ||
            (user?.email ? user.email.split('@')[0] : 'User');

          return (
            <div className="mt-6 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between px-1">
              <div
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2.5 cursor-pointer group min-w-0 flex-1 mr-2"
              >
                <UserAvatar user={user} name={displayName} size="md" />
                <div className="overflow-hidden min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {displayName}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                    {user?.targetRole || user?.email || 'Student'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Logout"
                className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          );
        })()}
      </div>
    </aside>
  );
}
