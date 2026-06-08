import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const ResaleMarketplacePage = () => {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/resale/listings').then(r => { setListings(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const doSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    api.get('/resale/listings', { params: { search } }).then(r => { setListings(r.data.data); setLoading(false); });
  };

  const imgUrl = (img) => img?.path?.startsWith('http') ? img.path : `http://127.0.0.1:8000/storage/${img.path}`;

  return (
    <div className="min-h-screen bg-cyber-bg">
      <div className="bg-cyber-dark/60 border-b border-cyber-cyan/10">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="font-display text-4xl font-bold uppercase tracking-wider text-slate-100">Resale <span className="text-cyber-cyan">Marketplace</span></h1>
          <p className="text-slate-500 text-sm mt-2 font-mono">Buy and sell used items with other users</p>
          <form onSubmit={doSearch} className="mt-4 flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search listings..."
              className="flex-1 bg-slate-900/80 border border-slate-700 focus:border-cyber-cyan text-slate-200 text-sm px-4 py-2.5 focus:outline-none admin-input"
            />
            <button type="submit" className="px-6 py-2.5 bg-cyber-cyan text-cyber-bg font-display font-bold uppercase tracking-widest text-sm hover:bg-cyber-cyan/90">Search</button>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="animate-pulse bg-slate-900/80 border border-slate-800 clip-cyber-corner h-64" />)}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16 text-slate-600 font-mono text-sm">No listings found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(l => (
              <Link key={l.id} to={`/resale/${l.id}`} className="group">
                <div className="bg-cyber-dark/85 border border-cyber-cyan/20 hover:border-cyber-cyan clip-cyber-corner overflow-hidden transition-all duration-500 hover:-translate-y-2">
                  <div className="h-48 bg-slate-900 overflow-hidden">
                    {l.images?.[0] ? <img src={imgUrl(l.images[0])} alt={l.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="flex items-center justify-center h-full text-slate-700">No Image</div>}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-200 group-hover:text-cyber-cyan line-clamp-2">{l.title}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-display text-xl font-bold text-cyber-cyan">${parseFloat(l.price).toFixed(2)}</span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">{l.condition?.replace(/_/g, ' ')}</span>
                    </div>
                    {l.location && <p className="text-[10px] font-mono text-slate-500 mt-2">{l.location}</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResaleMarketplacePage;
