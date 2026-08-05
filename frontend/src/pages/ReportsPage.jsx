import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export default function ReportsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const response = await api.get('/reports', { params: { type: 'daily' } });
      return response.data.data;
    },
  });

  if (isLoading) {
    return <div className="rounded-2xl bg-white p-8 text-slate-500 shadow-soft">Loading reports...</div>;
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Sales Reports</h2>
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-50 text-left text-sm text-slate-600">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Invoices</th>
              <th className="px-4 py-3">Sales</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(data || []).map((row) => (
              <tr key={row.period} className="text-sm text-slate-700">
                <td className="px-4 py-3">{row.period}</td>
                <td className="px-4 py-3">{row.total_invoices || 0}</td>
                <td className="px-4 py-3">₹{Number(row.total_sales || 0).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
