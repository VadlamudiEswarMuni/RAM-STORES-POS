import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../lib/api';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['products', search],
    queryFn: async () => {
      const response = await api.get('/products', { params: { search } });
      return response.data.products;
    },
  });

  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-bold text-slate-900">Products</h2>
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-brand-500"
          />
          <button className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white">Add Product</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-50 text-left text-sm text-slate-600">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Barcode</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-slate-500">Loading products...</td>
              </tr>
            ) : (
              (data || []).map((product) => (
                <tr key={product.id} className="text-sm text-slate-700">
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3">{product.barcode || '—'}</td>
                  <td className="px-4 py-3">{product.category_name || '—'}</td>
                  <td className="px-4 py-3">{product.current_stock ?? 0}</td>
                  <td className="px-4 py-3">₹{Number(product.selling_price || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                      {product.status || 'active'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
