import { BarChart3, Boxes, CreditCard, LayoutDashboard, LogOut, Package2, Settings, ShoppingCart, Users } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package2 },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/billing', label: 'Billing', icon: CreditCard },
  { to: '/inventory', label: 'Inventory', icon: Boxes },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col bg-slate-900 p-5 text-white lg:flex">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 font-bold text-white">R</div>
            <div>
              <div className="text-lg font-bold">RAM STORES</div>
              <div className="text-xs text-slate-300">Billing System</div>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive ? 'bg-brand-500 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-xl bg-slate-800 p-4">
            <div className="text-sm font-medium">{user?.full_name || 'Manager'}</div>
            <div className="text-xs text-slate-400">{user?.role_name || 'admin'}</div>
            <button
              type="button"
              onClick={logout}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-6">
          <header className="mb-6 flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-soft">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Operations</div>
              <h1 className="text-xl font-bold text-slate-800">RAM STORES</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 md:block">
                {user?.email || 'admin@ramstores.in'}
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700">
                {user?.full_name?.[0] || 'A'}
              </div>
            </div>
          </header>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
