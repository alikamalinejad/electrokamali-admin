import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'خطا در ورود');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-surface dark:bg-gray-900 px-4 transition-colors">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-surface-card dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8"
      >
        <h1 className="text-2xl font-extrabold text-center text-[#486E3F] dark:text-green-400 mb-2">
          ورود به پنل مدیریت
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-6">ژنراتور و موتور برق</p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <label className="block mb-4">
          <span className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">نام کاربری</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:border-[#486E3F] focus:outline-none"
            required
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">رمز عبور</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:border-[#486E3F] focus:outline-none"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-[#486E3F] text-white font-bold hover:bg-[#3d5c36] transition-colors disabled:opacity-50"
        >
          {loading ? 'در حال ورود...' : 'ورود'}
        </button>
      </form>
    </div>
  );
}
