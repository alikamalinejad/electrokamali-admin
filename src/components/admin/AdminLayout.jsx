import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';

const PUBLIC_SITE_URL = import.meta.env.VITE_PUBLIC_SITE_URL || 'http://localhost:5173';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? 'bg-[#486E3F] text-white'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
    }`;

  return (
    <div dir="rtl" className="min-h-screen bg-surface dark:bg-gray-900 flex transition-colors">
      <aside className="w-64 bg-surface-card dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-extrabold text-[#486E3F] dark:text-green-400">
            پنل مدیریت
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink to="/admin" end className={linkClass}>داشبورد</NavLink>
          <NavLink to="/admin/products/new" className={linkClass}>افزودن محصول</NavLink>
          <a
            href={PUBLIC_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            مشاهده سایت
          </a>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
          <ThemeToggle />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            وارد شده به عنوان <strong>{user?.username}</strong>
          </p>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
          >
            خروج
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
