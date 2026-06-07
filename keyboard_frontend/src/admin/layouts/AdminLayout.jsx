import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const pageTitles = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/categories': 'Categories',
  '/admin/orders': 'Orders',
};

const AdminLayout = () => {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] ?? 'Admin';

  return (
    <div className="min-h-screen bg-cyber-bg text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,240,255,0.06),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,0,127,0.04),transparent_50%)] pointer-events-none" />
      <div className="cyber-grid absolute inset-0 opacity-40 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        <AdminSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="glass-panel-strong border-b border-white/5 px-6 py-4 lg:px-8 sticky top-0 z-20">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-display text-slate-500 uppercase tracking-[0.2em]">
                  CyberKeys Command
                </p>
                <h1 className="font-display font-extrabold text-2xl uppercase tracking-wider text-slate-100">
                  {title}
                </h1>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-[10px] font-display tracking-widest text-cyber-cyan uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
                Systems Online
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
