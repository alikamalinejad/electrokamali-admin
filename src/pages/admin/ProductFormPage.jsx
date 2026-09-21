import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import ImageUploader from '../../components/admin/ImageUploader';
import { api } from '../../lib/api';
import { formatPrice, parsePrice } from '../../lib/format';

// Initial state for a fresh product
const EMPTY = {
  title: '',
  brand: '',
  model: '',
  price: '',
  imageUrl: '',
  shortDescription: '',
  description: '',
  powerKva: '',
  powerKw: '',
  voltage: '',
  frequency: '',
  fuelType: '',
  specs: [],   // [{ key: '', value: '' }, ...]
};

export default function ProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Load existing product
  useEffect(() => {
    if (!isEdit) return;
    api.getProduct(id)
      .then((res) => {
        const p = res.data;
        setForm({
          title: p.title || '',
          brand: p.brand || '',
          model: p.model || '',
          price: parsePrice(p.price),
          imageUrl: p.imageUrl || '',
          shortDescription: p.shortDescription || '',
          description: p.description || '',
          powerKva: p.powerKva || '',
          powerKw: p.powerKw || '',
          voltage: p.voltage || '',
          frequency: p.frequency || '',
          fuelType: p.fuelType || '',
          specs: Array.isArray(p.specs)
            ? p.specs
            : (p.specs && typeof p.specs === 'object'
              ? Object.entries(p.specs).map(([key, value]) => ({ key, value }))
              : []),
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  // Generic field updater
  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // ── Custom specs helpers ─────────────────────────
  function addSpec() {
    setForm((prev) => ({
      ...prev,
      specs: [...prev.specs, { key: '', value: '' }],
    }));
  }

  function updateSpec(index, field, value) {
    setForm((prev) => {
      const next = [...prev.specs];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, specs: next };
    });
  }

  function removeSpec(index) {
    setForm((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      // Convert specs array → object, dropping empty rows
      const specsObject = {};
      for (const { key, value } of form.specs) {
        const k = (key || '').trim();
        const v = (value || '').trim();
        if (k && v) specsObject[k] = v;
      }

      const payload = {
        title: form.title,
        brand: form.brand || null,
        model: form.model || null,
        price: formatPrice(form.price),
        imageUrl: form.imageUrl || null,
        shortDescription: form.shortDescription || null,
        description: form.description || null,
        powerKva: form.powerKva || null,
        powerKw: form.powerKw || null,
        voltage: form.voltage || null,
        frequency: form.frequency || null,
        fuelType: form.fuelType || null,
        specs: Object.keys(specsObject).length ? specsObject : null,
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

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-gray-500 dark:text-gray-400">در حال بارگذاری...</p>
      </AdminLayout>
    );
  }

  const inputClass =
    'w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:border-[#486E3F] focus:outline-none';

  const labelClass = 'block text-sm text-gray-700 dark:text-gray-300 mb-1';

  return (
    <AdminLayout>
      <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-8">
        {isEdit ? 'ویرایش محصول' : 'افزودن محصول جدید'}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl bg-surface-card dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 space-y-8 transition-colors"
      >
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* ── Section: اطلاعات پایه ───────────────── */}
        <section className="space-y-5">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
            اطلاعات پایه
          </h2>

          <label className="block">
            <span className={labelClass}>نام محصول *</span>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              required
              className={inputClass}
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className={labelClass}>برند</span>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setField('brand', e.target.value)}
                placeholder="مثلاً هوندا"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>مدل</span>
              <input
                type="text"
                value={form.model}
                onChange={(e) => setField('model', e.target.value)}
                placeholder="مثلاً EU22i"
                className={inputClass}
              />
            </label>
          </div>

          <label className="block">
            <span className={labelClass}>قیمت (فقط عدد) *</span>
            <input
              type="text"
              inputMode="numeric"
              value={form.price}
              onChange={(e) => setField('price', parsePrice(e.target.value))}
              required
              placeholder="12500000"
              dir="ltr"
              className={inputClass}
            />
            {form.price && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                پیش‌نمایش:{' '}
                <span className="text-[#486E3F] dark:text-green-400 font-bold">
                  {formatPrice(form.price)}
                </span>
              </p>
            )}
          </label>

          <ImageUploader
            value={form.imageUrl}
            onChange={(v) => setField('imageUrl', v)}
          />
        </section>

        {/* ── Section: توضیحات ────────────────────── */}
        <section className="space-y-5">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
            توضیحات
          </h2>

          <label className="block">
            <span className={labelClass}>توضیحات کوتاه (برای کارت محصول)</span>
            <input
              type="text"
              value={form.shortDescription}
              onChange={(e) => setField('shortDescription', e.target.value)}
              placeholder="مثلاً: موتور برق بنزینی ۲ کیلوواتی مناسب مصارف خانگی"
              maxLength={200}
              className={inputClass}
            />
            <p className="text-xs text-gray-400 mt-1">
              {form.shortDescription.length} / 200
            </p>
          </label>

          <label className="block">
            <span className={labelClass}>توضیحات کامل</span>
            <textarea
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              rows={6}
              placeholder="توضیحات کامل محصول، کاربردها، ویژگی‌ها..."
              className={`${inputClass} resize-y`}
            />
          </label>
        </section>

        {/* ── Section: مشخصات فنی ─────────────────── */}
        <section className="space-y-5">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
            مشخصات فنی
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className={labelClass}>توان (kVA)</span>
              <input
                type="text"
                value={form.powerKva}
                onChange={(e) => setField('powerKva', e.target.value)}
                placeholder="مثلاً 18"
                dir="ltr"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>توان (kW)</span>
              <input
                type="text"
                value={form.powerKw}
                onChange={(e) => setField('powerKw', e.target.value)}
                placeholder="مثلاً 14.4"
                dir="ltr"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>ولتاژ</span>
              <input
                type="text"
                value={form.voltage}
                onChange={(e) => setField('voltage', e.target.value)}
                placeholder="مثلاً 400V"
                dir="ltr"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>فرکانس</span>
              <input
                type="text"
                value={form.frequency}
                onChange={(e) => setField('frequency', e.target.value)}
                placeholder="مثلاً 50 Hz"
                dir="ltr"
                className={inputClass}
              />
            </label>

            <label className="block md:col-span-2">
              <span className={labelClass}>نوع سوخت</span>
              <select
                value={form.fuelType}
                onChange={(e) => setField('fuelType', e.target.value)}
                className={inputClass}
              >
                <option value="">— انتخاب کنید —</option>
                <option value="دیزلی">دیزلی</option>
                <option value="بنزینی">بنزینی</option>
                <option value="گازسوز">گازسوز</option>
                <option value="دوگانه‌سوز">دوگانه‌سوز</option>
                <option value="برقی">برقی</option>
              </select>
            </label>
          </div>
        </section>

        {/* ── Section: مشخصات اضافی (key-value) ───── */}
        <section className="space-y-5">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              مشخصات اضافی
            </h2>
            <button
              type="button"
              onClick={addSpec}
              className="text-sm px-3 py-1.5 rounded-lg bg-[#486E3F] text-white hover:bg-[#3d5c36] transition-colors"
            >
              + افزودن مشخصه
            </button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            هر مشخصه‌ای که می‌خواهید اضافه کنید (مثلاً وزن، ابعاد، مدل موتور، برند آلترناتور و ...).
          </p>

          {form.specs.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
              مشخصه‌ای اضافه نشده است
            </p>
          ) : (
            <div className="space-y-3">
              {form.specs.map((spec, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) => updateSpec(i, 'key', e.target.value)}
                    placeholder="عنوان (مثلاً وزن)"
                    className={`${inputClass} flex-1`}
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => updateSpec(i, 'value', e.target.value)}
                    placeholder="مقدار (مثلاً 75 کیلوگرم)"
                    className={`${inputClass} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(i)}
                    className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors shrink-0"
                    title="حذف"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Actions ─────────────────────────────── */}
        <div className="flex gap-3 pt-2 border-t border-gray-200 dark:border-gray-700 pt-6">
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
            className="px-5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-surface-muted dark:hover:bg-gray-700"
          >
            انصراف
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}