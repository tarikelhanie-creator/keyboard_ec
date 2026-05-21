import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  Cpu,
  Store,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
];

const AdminSidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="glass-sidebar w-full lg:w-64 flex-shrink-0 flex flex-col min-h-screen lg:min-h-0 lg:sticky lg:top-0 lg:h-screen">
      <div className="p-6 border-b border-white/5">
        <Link to="/admin" className="flex items-center gap-3 group">
          <div className="p-2 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/25">
            <Cpu className="h-6 w-6 text-cyber-cyan" />
          </div>
          <div>
            <p className="font-display font-extrabold text-lg tracking-widest text-slate-100">
              ADMIN<span className="text-cyber-cyan">//</span>OS
            </p>
            <p className="text-[10px] text-slate-500 font-display tracking-widest uppercase">
              Control Terminal
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-display text-sm font-semibold tracking-wider transition-all ${
                isActive
                  ? 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/25 shadow-[0_0_20px_rgba(0,240,255,0.08)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
              }`
            }
          >
            <Icon className="h-4.5 w-4.5" />
            {label}
            <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-40" />
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:text-cyber-cyan hover:bg-white/5 font-display text-xs tracking-widest uppercase transition-colors"
        >
          <Store className="h-4 w-4" />
          View Storefront
        </Link>

        <div className="glass-panel rounded-xl p-3">
          <p className="text-[10px] text-slate-500 font-display uppercase tracking-widest">Operator</p>
          <p className="text-sm font-display font-bold text-slate-200 truncate mt-0.5">{user?.name}</p>
          <p className="text-[10px] text-cyber-magenta font-mono truncate">{user?.email}</p>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-cyber-magenta hover:border-cyber-magenta/30 font-display text-xs tracking-widest uppercase cursor-pointer transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Disconnect
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
