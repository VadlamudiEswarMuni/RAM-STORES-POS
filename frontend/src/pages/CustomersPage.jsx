import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export default function CustomersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await api.get('/customers');
      return response.data.customers;
    },
  });

  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Customers</h2>
        <button className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white">Add Customer</button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-50 text-left text-sm text-slate-600">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">GST</th>
              <th className="px-4 py-3">Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-slate-500">Loading customers...</td>
              </tr>
            ) : (
              (data || []).map((customer) => (
                <tr key={customer.id} className="text-sm text-slate-700">
                  <td className="px-4 py-3 font-medium">{customer.customer_name}</td>
                  <td className="px-4 py-3">{customer.phone}</td>
                  <td className="px-4 py-3">{customer.email || '—'}</td>
                  <td className="px-4 py-3">{customer.gst_number || '—'}</td>
                  <td className="px-4 py-3">{customer.address || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
