import React from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  color = 'blue',
  height = 'h-2',
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const colorMap = {
    blue: 'bg-blue-600',
    sky: 'bg-sky-500',
    green: 'bg-emerald-500',
    emerald: 'bg-emerald-500',
    orange: 'bg-amber-500',
    amber: 'bg-amber-500',
    indigo: 'bg-indigo-600',
    purple: 'bg-purple-600',
  };

  const bgStyle = colorMap[color] || 'bg-blue-600';

  return (
    <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${height} ${className}`}>
      <div
        className={`${bgStyle} h-full rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
