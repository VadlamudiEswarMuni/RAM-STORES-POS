import { useQuery } from '@tanstack/react-query';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../lib/api';

const statCards = [
  { label: 'Today Sales', key: 'today_sales', prefix: '₹' },
  { label: 'Weekly Sales', key: 'weekly_sales', prefix: '₹' },
  { label: 'Customers', key: 'total_customers', prefix: '' },
  { label: 'Products', key: 'total_products', prefix: '' },
];

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await api.get('/dashboard');
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="rounded-2xl bg-white p-8 text-slate-500 shadow-soft">Loading dashboard...</div>;
  }

  const summary = data?.summary || {};
  const chartData = (data?.salesByDay || []).map((item) => ({
    ...item,
    total: Number(item.total || 0),
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.key} className="rounded-2xl bg-white p-5 shadow-soft">
            <div className="text-sm text-slate-500">{card.label}</div>
            <div className="mt-3 text-3xl font-bold text-slate-900">
              {card.prefix}
              {Number(summary[card.key] || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="rounded-2xl bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Revenue Overview</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" style={{ fontSize: 12 }} />
                <YAxis style={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Sales']} />
                <Area type="monotone" dataKey="total" stroke="#0ea5e9" fill="url(#salesFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-soft">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Top Selling Products</h2>
          <div className="space-y-3">
            {(data?.topProducts || []).map((product, index) => (
              <div key={product.name} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <div>
                  <div className="font-medium text-slate-800">{index + 1}. {product.name}</div>
                  <div className="text-xs text-slate-500">Units sold</div>
                </div>
                <div className="text-lg font-bold text-brand-600">{product.units_sold}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
