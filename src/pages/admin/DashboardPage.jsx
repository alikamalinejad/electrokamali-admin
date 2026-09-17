import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductTable from '../../components/admin/ProductTable';
import { api } from '../../lib/api';

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.listProducts()
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleDeleted(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">مدیریت محصولات</h1>
        <Link
          to="/admin/products/new"
          className="px-4 py-2 rounded-lg bg-[#486E3F] text-white font-bold hover:bg-[#3d5c36] transition-colors"
        >
          + افزودن محصول
        </Link>
      </div>

      {loading && <p className="text-gray-400">در حال بارگذاری...</p>}
      {error && <p className="text-red-500">خطا: {error}</p>}
      {!loading && !error && (
        <ProductTable products={products} onDeleted={handleDeleted} />
      )}
    </AdminLayout>
  );
}
