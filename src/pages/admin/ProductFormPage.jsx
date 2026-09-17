import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import ImageUploader from '../../components/admin/ImageUploader';
import { api } from '../../lib/api';
import { formatPrice, parsePrice } from '../../lib/format';

export default function ProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');          // raw digits only, e.g. "12500000"
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api.getProduct(id)
      .then((res) => {
        const p = res.data;
        setTitle(p.title);
        setPrice(parsePrice(p.price));   // "۱۲,۵۰۰,۰۰۰ تومان" → "12500000"
        setImageUrl(p.imageUrl || '');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  function handlePriceChange(e) {
    // Allow only digits (Western or Persian), strip everything else
    const raw = parsePrice(e.target.value);
    setPrice(raw);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        title,
        price: formatPrice(price),       // "۱۲,۵۰۰,۰۰۰ تومان"
        imageUrl: imageUrl || null,
      };
      if (isEdit) {
        await api.updateProduct(id, payload);
      } else {
        await api.createProduct(payload);
      }
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'خطا در ذخیره');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-8">
        {isEdit ? 'ویرایش محصول' : 'افزودن محصول جدید'}
      </h1>

      {loading ? (
        <p className="text-gray-400">در حال بارگذاری...</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl bg-white rounded-xl border border-gray-100 p-8 space-y-6"
        >
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <label className="block">
            <span className="block text-sm text-gray-700 mb-1">نام محصول</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#486E3F] focus:outline-none text-gray-800"
            />
          </label>

          <label className="block">
            <span className="block text-sm text-gray-700 mb-1">
              قیمت (فقط عدد — مثلاً 12500000)
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={price}
              onChange={handlePriceChange}
              required
              placeholder="12500000"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#486E3F] focus:outline-none text-gray-800"
              dir="ltr"
            />
            {price && (
              <p className="mt-1 text-sm text-gray-500">
                پیش‌نمایش: <span className="text-[#486E3F] font-bold">{formatPrice(price)}</span>
              </p>
            )}
          </label>

          <ImageUploader value={imageUrl} onChange={setImageUrl} />

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-lg bg-[#486E3F] text-white font-bold hover:bg-[#3d5c36] transition-colors disabled:opacity-50"
            >
              {saving ? 'در حال ذخیره...' : isEdit ? 'ذخیره تغییرات' : 'افزودن محصول'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              انصراف
            </button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}