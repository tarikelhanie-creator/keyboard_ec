import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Clock,
  Users,
  AlertTriangle,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import AnalyticsCard from '../components/AnalyticsCard';
import GlassPanel from '../components/GlassPanel';
import { fetchAdminStats } from '../../services/adminService';

const statusColors = {
  pending: 'text-cyber-yellow border-cyber-yellow/30 bg-cyber-yellow/10',
  processing: 'text-cyber-cyan border-cyber-cyan/30 bg-cyber-cyan/10',
  shipped: 'text-cyber-purple border-cyber-purple/30 bg-cyber-purple/10',
  delivered: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  cancelled: 'text-cyber-magenta border-cyber-magenta/30 bg-cyber-magenta/10',
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchAdminStats();
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-10 w-10 text-cyber-cyan animate-spin" />
      </div>
    );
  }

  if (error) {
    return <p className="text-cyber-magenta font-display">{error}</p>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnalyticsCard
          label="Total Revenue"
          value={`$${Number(stats.total_revenue).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          subtext="Excluding cancelled orders"
          icon={DollarSign}
          accent="cyan"
        />
        <AnalyticsCard
          label="Total Orders"
          value={stats.total_orders}
          subtext={`${stats.pending_orders} pending`}
          icon={ShoppingBag}
          accent="magenta"
        />
        <AnalyticsCard
          label="Products"
          value={stats.total_products}
          subtext={`${stats.low_stock_products} low stock`}
          icon={Package}
          accent="purple"
        />
        <AnalyticsCard
          label="Pending Orders"
          value={stats.pending_orders}
          icon={Clock}
          accent="yellow"
        />
        <AnalyticsCard
          label="Registered Users"
          value={stats.total_users}
          icon={Users}
          accent="cyan"
        />
        <AnalyticsCard
          label="Low Stock Alert"
          value={stats.low_stock_products}
          subtext="Products with stock under 10"
          icon={AlertTriangle}
          accent="yellow"
        />
      </div>

      <GlassPanel
        title="Recent Orders"
        action={
          <Link
            to="/admin/orders"
            className="text-xs font-display text-cyber-cyan hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        }
      >
        {stats.recent_orders?.length === 0 ? (
          <p className="text-slate-500 text-sm">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-display uppercase tracking-widest text-slate-500 border-b border-white/5">
                  <th className="pb-3 pr-4">Order</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Total</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_orders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 admin-table-row">
                    <td className="py-3 pr-4 font-mono text-slate-300">#{order.id}</td>
                    <td className="py-3 pr-4 text-slate-400">{order.user?.name ?? '—'}</td>
                    <td className="py-3 pr-4 font-mono text-slate-200">
                      ${parseFloat(order.total_price).toFixed(2)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-display uppercase border ${
                          statusColors[order.status] ?? statusColors.pending
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassPanel>
    </div>
  );
};

export default AdminDashboard;
