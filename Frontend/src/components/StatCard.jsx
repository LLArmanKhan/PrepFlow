import React from 'react';

export default function StatCard({
  icon: Icon,
  iconColor = 'text-blue-600 dark:text-blue-400',
  iconBg = 'bg-blue-50 dark:bg-blue-950/50',
  title,
  value,
  subtitle,
  onClick,
  linkText,
  className = '',
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs p-5 transition-all flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-md' : ''
      } ${className}`}
    >
      <div>
        <div className="flex items-center gap-2.5 mb-3">
          {Icon && (
            <div className={`p-2 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          <span className="font-semibold text-slate-800 dark:text-slate-200 text-base">{title}</span>
        </div>

        {value !== undefined && (
          <div className="text-2xl font-bold text-slate-900 dark:text-white my-1">{value}</div>
        )}

        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{subtitle}</p>}
      </div>

      {linkText && (
        <div className="mt-4 pt-2 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
          <span>{linkText}</span>
        </div>
      )}
    </div>
  );
}
