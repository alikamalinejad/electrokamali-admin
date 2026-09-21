import React, { useRef, useState } from 'react';
import { api } from '../../lib/api';

export default function ImageUploader({ value, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);
    try {
      const res = await api.uploadImage(file);
      onChange(res.data.url);
    } catch (err) {
      setError(err.message || 'خطا در آپلود');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function handleClear() {
    onChange('');
  }

  return (
    <div>
      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
        تصویر محصول
      </label>

      {value ? (
        <div className="relative inline-block">
          <img
            src={api.imageUrl(value)}
            alt="پیش‌نمایش"
            className="w-40 h-40 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1 left-1 w-7 h-7 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600"
            title="حذف تصویر"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="w-40 h-40 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-500 text-sm">
          {uploading ? 'در حال آپلود...' : 'بدون تصویر'}
        </div>
      )}

      <div className="mt-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFile}
          disabled={uploading}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm hover:bg-surface-muted dark:hover:bg-gray-700 disabled:opacity-50"
        >
          {uploading ? 'لطفا صبر کنید...' : value ? 'تغییر تصویر' : 'انتخاب تصویر'}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
