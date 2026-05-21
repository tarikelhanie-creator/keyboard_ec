import React, { useCallback, useEffect, useState } from 'react';
import { Loader2, Search, ChevronDown, ChevronUp } from 'lucide-react';
import GlassPanel from '../components/GlassPanel';
import { fetchAdminOrders, updateOrderStatus } from '../../services/adminService';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusColors = {
  pending: 'text-cyber-yellow',
  processing: 'text-cyber-cyan',
  shipped: 'text-cyber-purple',
  delivered: 'text-emerald-400',
  cancelled: 'text-cyber-magenta',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAdminOrders({
        per_page: 30,
        search: search || undefined,
        status: statusFilter || undefined,
      });
      setOrders(res.data.data ?? res.data);
    } catch {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(loadOrders, 300);
    return () => clearTimeout(timer);
  }, [loadOrders]);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const res = await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? res.data : o)));
    } catch {
      setError('Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search orders, customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="admin-input max-w-[180px]"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-cyber-magenta font-display">{error}</p>}

      <GlassPanel>
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 text-cyber-cyan animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-12">No orders found.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const expanded = expandedId === order.id;
              return (
                <div
                  key={order.id}
                  className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 admin-table-row">
                    <button
                      onClick={() => setExpandedId(expanded ? null : order.id)}
                      className="flex items-center gap-3 text-left flex-1 cursor-pointer"
                    >
                      {expanded ? (
                        <ChevronUp className="h-4 w-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                      )}
                      <div>
                        <p className="font-display font-bold text-slate-200">Order #{order.id}</p>
                        <p className="text-xs text-slate-500">
                          {order.user?.name} · {order.user?.email}
                        </p>
                      </div>
                    </button>

                    <div className="font-mono text-slate-200 sm:w-24">
                      ${parseFloat(order.total_price).toFixed(2)}
                    </div>

                    <p className="text-xs text-slate-500 sm:w-32 truncate">{order.city}</p>

                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`admin-input max-w-[140px] text-xs font-display uppercase ${statusColors[order.status]}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {expanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-white/5 space-y-3">
                      <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-400">
                        <p>
                          <span className="text-slate-500">Phone:</span> {order.phone}
                        </p>
                        <p>
                          <span className="text-slate-500">City:</span> {order.city}
                        </p>
                        <p className="sm:col-span-2">
                          <span className="text-slate-500">Address:</span> {order.shipping_address}
                        </p>
                      </div>
                      <ul className="space-y-1 text-sm">
                        {(order.order_items ?? order.orderItems ?? []).map((item) => (
                          <li
                            key={item.id}
                            className="flex justify-between text-slate-400 border-b border-white/5 py-1 last:border-0"
                          >
                            <span>
                              {item.product?.name ?? `Product #${item.product_id}`} × {item.quantity}
                            </span>
                            <span className="font-mono text-slate-300">
                              ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </GlassPanel>
    </div>
  );
};

export default AdminOrders;
