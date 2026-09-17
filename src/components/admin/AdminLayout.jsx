import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-extrabold text-[#486E3F]">پنل مدیریت</h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink to="/admin" end className={linkClass}>
            داشبورد
          </NavLink>
          <NavLink to="/admin/products/new" className={linkClass}>
            افزودن محصول
          </NavLink>
          <a
            href={PUBLIC_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            مشاهده سایت
          </a>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-2">
            وارد شده به عنوان <strong>{user?.username}</strong>
          </p>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
          >
            خروج
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}