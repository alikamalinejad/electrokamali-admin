import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export default function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  const options = [
    { value: 'light',  label: 'روشن',  icon: '☀️' },
    { value: 'dark',   label: 'تاریک', icon: '🌙' },
    { value: 'system', label: 'سیستم', icon: '💻' },
  ];

  return (
    <div
      className="inline-flex items-center gap-1 p-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
      role="group"
      aria-label="انتخاب تم"
    >
      {options.map((opt) => {
        const active = preference === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setPreference(opt.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              active
                ? 'bg-surface-muted dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            title={opt.label}
            aria-pressed={active}
          >
            <span className="ml-1">{opt.icon}</span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
