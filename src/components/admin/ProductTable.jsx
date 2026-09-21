import React from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { formatPrice } from '../../lib/format';

export default function ProductTable({ products, onDeleted }) {
  async function handleDelete(product) {
    if (!confirm(`حذف "${product.title}"؟`)) return;
    try {
      await api.deleteProduct(product.id);
      onDeleted(product.id);
    } catch (err) {
      alert(`خطا در حذف: ${err.message}`);
    }
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-500">
        هنوز محصولی اضافه نشده است
      </div>
    );
  }

  return (
    <div className="bg-surface-card dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
      <table className="w-full">
        <thead className="bg-surface-muted dark:bg-gray-900/50 text-gray-600 dark:text-gray-300 text-sm">
          <tr>
            <th className="text-right px-4 py-3 font-medium">تصویر</th>
            <th className="text-right px-4 py-3 font-medium">نام</th>
            <th className="text-right px-4 py-3 font-medium">قیمت</th>
            <th className="text-right px-4 py-3 font-medium">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-surface-muted dark:hover:bg-gray-700/50">
              <td className="px-4 py-3">
                {p.imageUrl ? (
                  <img
                    src={api.imageUrl(p.imageUrl)}
                    alt={p.title}
                    className="w-14 h-14 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-surface-muted dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-500 text-xs">
                    بدون عکس
                  </div>
                )}
              </td>
              <td className="px-4 py-3 text-gray-900 dark:text-gray-100 font-medium">{p.title}</td>
              <td className="px-4 py-3 text-[#486E3F] dark:text-green-400 font-bold">
                {formatPrice(p.price)}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Link
                    to={`/admin/products/${p.id}/edit`}
                    className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    ویرایش
                  </Link>
                  <button
                    onClick={() => handleDelete(p)}
                    className="px-3 py-1 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                  >
                    حذف
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
