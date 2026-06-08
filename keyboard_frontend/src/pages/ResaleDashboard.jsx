import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Eye,
  Package,
  TrendingUp,
  Loader2,
  ArrowRight,
  Plus,
} from 'lucide-react';
import AnalyticsCard from '../admin/components/AnalyticsCard';
import GlassPanel from '../admin/components/GlassPanel';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const ResaleDashboardPage = () => {
  const { token } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api.get('/resale/my-listings').then(r => {
      setListings(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token]);

  const imgUrl = (img) => img?.path?.startsWith('http') ? img.path : `http://127.0.0.1:8000/storage/${img.path}`;

  const active = listings.filter(l => l.status === 'active');
  const sold = listings.filter(l => l.status === 'sold');
  const revenue = sold.reduce((sum, l) => sum + parseFloat(l.price), 0);
  const views = listings.reduce((sum, l) => sum + (l.views || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-10 w-10 text-cyber-cyan animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AnalyticsCard
          label="Active Listings"
          value={active.length}
          subtext="Currently for sale"
          icon={Package}
          accent="cyan"
        />
        <AnalyticsCard
          label="Sold Items"
          value={sold.length}
          subtext={`${listings.length} total listings`}
          icon={ShoppingBag}
          accent="magenta"
        />
        <AnalyticsCard
          label="Revenue"
          value={`$${revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtext="From completed sales"
          icon={DollarSign}
          accent="purple"
        />
        <AnalyticsCard
          label="Total Views"
          value={views}
          subtext="Across all listings"
          icon={Eye}
          accent="yellow"
        />
      </div>

      {/* My Listings */}
      <GlassPanel
        title="My Listings"
        action={
          <Link
            to="/resale/create"
            className="text-xs font-display text-cyber-cyan hover:underline flex items-center gap-1"
          >
            <Plus className="h-3 w-3" /> New Listing
          </Link>
        }
      >
        {listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-sm font-mono mb-4">No listings yet.</p>
            <Link to="/resale/create" className="inline-block px-6 py-2.5 bg-cyber-cyan text-cyber-bg font-display font-bold uppercase tracking-widest text-xs hover:bg-cyber-cyan/90">
              Create Your First Listing
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-display uppercase tracking-widest text-slate-500 border-b border-white/5">
                  <th className="pb-3 pr-4">Item</th>
                  <th className="pb-3 pr-4">Price</th>
                  <th className="pb-3 pr-4">Condition</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Views</th>
                  <th className="pb-3">Location</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id} className="border-b border-white/5 admin-table-row">
                    <td className="py-3 pr-4">
                      <Link to={`/resale/${listing.id}`} className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-slate-900 border border-slate-800 flex-shrink-0 overflow-hidden">
                          {listing.images?.[0]
                            ? <img src={imgUrl(listing.images[0])} alt="" className="w-full h-full object-cover" />
                            : <div className="flex items-center justify-center h-full text-slate-700 text-[8px] font-mono">NO IMG</div>
                          }
                        </div>
                        <span className="font-display text-slate-200 group-hover:text-cyber-cyan transition-colors truncate max-w-[200px] block">
                          {listing.title}
                        </span>
                      </Link>
                    </td>
                    <td className="py-3 pr-4 font-mono text-cyber-cyan font-bold">
                      ${parseFloat(listing.price).toFixed(2)}
                    </td>
                    <td className="py-3 pr-4 text-slate-400 text-xs uppercase">
                      {listing.condition?.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-display uppercase border ${
                        listing.status === 'active'
                          ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'
                          : 'text-cyber-magenta border-cyber-magenta/30 bg-cyber-magenta/10'
                      }`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-400 font-mono text-xs">
                      {listing.views || 0}
                    </td>
                    <td className="py-3 text-slate-500 text-xs">
                      {listing.location}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassPanel>

      {/* Recent Sold / Orders Overview */}
      {sold.length > 0 && (
        <GlassPanel
          title="Recent Sales"
          action={
            <Link
              to="/resale"
              className="text-xs font-display text-cyber-cyan hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-display uppercase tracking-widest text-slate-500 border-b border-white/5">
                  <th className="pb-3 pr-4">Buyer Phone</th>
                  <th className="pb-3 pr-4">Buyer Location</th>
                  <th className="pb-3 pr-4">Item</th>
                  <th className="pb-3">Sold For</th>
                </tr>
              </thead>
              <tbody>
                {sold.slice(0, 5).map((listing) => (
                  <tr key={listing.id} className="border-b border-white/5 admin-table-row">
                    <td className="py-3 pr-4 font-mono text-slate-300">{listing.phone_number || '—'}</td>
                    <td className="py-3 pr-4 text-slate-400 text-xs">{listing.buyer_location || listing.location}</td>
                    <td className="py-3 pr-4 text-slate-300">{listing.title}</td>
                    <td className="py-3 font-mono text-cyber-magenta font-bold">${parseFloat(listing.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      )}
    </div>
  );
};

export default ResaleDashboardPage;
