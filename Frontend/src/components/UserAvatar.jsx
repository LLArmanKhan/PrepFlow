import React, { useState } from 'react';

const AVATAR_COLORS = [
  'bg-blue-600 text-white',
  'bg-emerald-600 text-white',
  'bg-indigo-600 text-white',
  'bg-violet-600 text-white',
  'bg-teal-600 text-white',
  'bg-rose-600 text-white',
  'bg-amber-600 text-white',
  'bg-cyan-600 text-white',
];

export function getInitials(name) {
  if (!name || typeof name !== 'string') return 'U';
  const cleaned = name.trim();
  if (!cleaned) return 'U';

  if (cleaned.includes('@')) {
    const prefix = cleaned.split('@')[0];
    const letters = prefix.replace(/^[\d_.-]+/, '').replace(/[^a-zA-Z]/g, '');
    if (letters.length >= 2) {
      return letters.slice(0, 2).toUpperCase();
    } else if (letters.length === 1) {
      return letters.toUpperCase();
    }
  }

  const parts = cleaned.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    const firstClean = parts[0].replace(/^[\d_.-]+/, '').replace(/[^a-zA-Z]/g, '');
    const lastClean = parts[parts.length - 1].replace(/^[\d_.-]+/, '').replace(/[^a-zA-Z]/g, '');
    const firstChar = firstClean[0] || parts[0][0] || '';
    const lastChar = lastClean[0] || parts[parts.length - 1][0] || '';
    if (firstChar && lastChar) {
      return `${firstChar}${lastChar}`.toUpperCase();
    }
  }

  const lettersOnly = cleaned.replace(/^[\d_.-]+/, '').replace(/[^a-zA-Z]/g, '');
  if (lettersOnly.length >= 2) {
    return lettersOnly.slice(0, 2).toUpperCase();
  } else if (lettersOnly.length === 1) {
    return lettersOnly.toUpperCase();
  }

  return cleaned.slice(0, Math.min(2, cleaned.length)).toUpperCase();
}

export function getAvatarColor(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export default function UserAvatar({
  user,
  name,
  src,
  size = 'md',
  className = '',
  colorClass,
  showBorder = true,
  onClick,
}) {
  const [imgError, setImgError] = useState(false);

  const resolvedName =
    name ||
    user?.username ||
    user?.name ||
    (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '') ||
    user?.email ||
    'User';

  const initials = getInitials(resolvedName);
  const avatarSrc = src || user?.avatarUrl;
  const bgClass = colorClass || getAvatarColor(resolvedName);

  const sizeClasses = {
    xs: 'w-7 h-7 text-[11px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-xl font-bold',
    '2xl': 'w-24 h-24 text-2xl sm:text-3xl font-bold',
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;
  const borderClass = showBorder ? 'border-2 border-white dark:border-slate-700 shadow-xs' : '';

  if (avatarSrc && !imgError) {
    return (
      <div
        onClick={onClick}
        className={`rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 ${currentSizeClass} ${borderClass} ${className}`}
      >
        <img
          src={avatarSrc}
          alt={resolvedName}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`rounded-full shrink-0 flex items-center justify-center font-bold select-none tracking-wide ${bgClass} ${currentSizeClass} ${borderClass} ${className}`}
      title={resolvedName}
    >
      <span>{initials}</span>
    </div>
  );
}
