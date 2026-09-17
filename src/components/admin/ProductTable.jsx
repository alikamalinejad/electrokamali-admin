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
      <div className="text-center py-12 text-gray-400">
        هنوز محصولی اضافه نشده است
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 text-gray-600 text-sm">
          <tr>
            <th className="text-right px-4 py-3 font-medium">تصویر</th>
            <th className="text-right px-4 py-3 font-medium">نام</th>
            <th className="text-right px-4 py-3 font-medium">قیمت</th>
            <th className="text-right px-4 py-3 font-medium">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                {p.imageUrl ? (
                  <img
                    src={api.imageUrl(p.imageUrl)}
                    alt={p.title}
                    className="w-14 h-14 rounded-lg object-cover border border-gray-100"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                    بدون عکس
                  </div>
                )}
              </td>
              <td className="px-4 py-3 text-gray-800 font-medium">{p.title}</td>
              <td className="px-4 py-3 text-[#486E3F] font-bold">
                {formatPrice(p.price)}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Link
                    to={`/admin/products/${p.id}/edit`}
                    className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-sm hover:bg-blue-100 transition-colors"
                  >
                    ویرایش
                  </Link>
                  <button
                    onClick={() => handleDelete(p)}
                    className="px-3 py-1 rounded-lg bg-red-50 text-red-600 text-sm hover:bg-red-100 transition-colors"
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