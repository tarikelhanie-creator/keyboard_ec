import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const ResaleListingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/resale/listings/${id}`)
      .then(r => { setListing(r.data); setLoading(false); })
      .catch(() => navigate('/resale'));
  }, [id]);

  const handleBuy = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/resale/listings/${id}/buy`, { buyer_phone: phone, buyer_location: location });
      alert('Purchase request sent! The seller will contact you at ' + phone);
      navigate('/resale');
    } catch (e) {
      alert(e.response?.data?.message || 'Something went wrong');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="min-h-screen bg-cyber-bg flex items-center justify-center text-slate-500 font-mono">Loading...</div>;
  if (!listing) return null;

  const imgUrl = (img) => {
    if (!img?.path) return '/placeholder.png';
    return img.path.startsWith('http') ? img.path : `http://127.0.0.1:8000/storage/${img.path}`;
  };

  const images = listing.images || [];
  const currentImage = images[imageIndex];

  return (
    <div className="min-h-screen bg-cyber-bg">
      <div className="bg-cyber-dark/60 border-b border-cyber-cyan/10">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Link to="/resale" className="text-[10px] font-mono text-slate-500 hover:text-cyber-cyan">← Marketplace</Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="h-80 bg-slate-900 border border-slate-800 clip-cyber-corner overflow-hidden flex items-center justify-center">
              {currentImage ? (
                <img src={imgUrl(currentImage)} alt={listing.title} className="w-full h-full object-contain p-4" />
              ) : (
                <span className="text-slate-600 font-mono text-xs">NO IMAGE</span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImageIndex(i)} className={`w-16 h-16 border-2 overflow-hidden ${imageIndex === i ? 'border-cyber-cyan' : 'border-slate-700'}`}>
                    <img src={imgUrl(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {listing.category && <span className="px-2 py-0.5 bg-cyber-cyan/10 text-[10px] font-mono text-cyber-cyan uppercase border border-cyber-cyan/20">{listing.category.name}</span>}
            <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-slate-100 mt-2">{listing.title}</h1>
            <p className="font-display text-4xl font-bold text-cyber-cyan mt-4">${parseFloat(listing.price).toFixed(2)}</p>

            {listing.condition && <span className="inline-block mt-3 px-3 py-1 bg-cyber-magenta/10 text-[11px] font-mono uppercase text-cyber-magenta border border-cyber-magenta/20">{listing.condition.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>}
            <p className="mt-4 text-slate-400 text-sm whitespace-pre-wrap">{listing.description}</p>

            <div className="mt-4 text-[11px] font-mono text-slate-500">
              <span>{listing.location}</span>
              {listing.phone_number && <span> • {listing.phone_number}</span>}
            </div>

            <div className="mt-6 bg-cyber-dark/60 border border-cyber-cyan/20 clip-cyber-corner p-4">
              <p className="text-sm text-slate-400 font-mono">Seller: <span className="text-slate-200">{listing.user?.name}</span></p>
            </div>

            {listing.status === 'active' && !token ? (
              <Link to="/login" className="block text-center mt-6 py-3.5 bg-cyber-cyan text-cyber-bg font-display font-bold uppercase tracking-widest text-sm hover:bg-cyber-cyan/90 clip-cyber-corner">Login to Buy</Link>
            ) : listing.status === 'active' && token ? (
              showBuyForm ? (
                <form onSubmit={handleBuy} className="mt-6 bg-cyber-dark/85 border border-cyber-cyan/20 clip-cyber-corner p-6 space-y-4">
                  <h3 className="font-display text-lg uppercase tracking-wider text-slate-200">Your Contact Info</h3>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Phone Number *</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="Enter your phone number" className="w-full bg-slate-900 border border-slate-700 focus:border-cyber-cyan text-slate-200 text-sm px-4 py-2.5 focus:outline-none admin-input" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Your Location *</label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="City / Area" className="w-full bg-slate-900 border border-slate-700 focus:border-cyber-cyan text-slate-200 text-sm px-4 py-2.5 focus:outline-none admin-input" />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" disabled={submitting} className="flex-1 py-3 bg-cyber-magenta text-white font-display font-bold uppercase tracking-widest text-sm hover:bg-cyber-magenta/90 disabled:opacity-50">
                      {submitting ? 'Sending...' : 'Buy Now'}
                    </button>
                    <button type="button" onClick={() => setShowBuyForm(false)} className="px-4 py-3 border border-slate-700 text-slate-400 font-display uppercase tracking-widest text-sm">Cancel</button>
                  </div>
                </form>
              ) : (
                <button onClick={() => setShowBuyForm(true)} className="w-full mt-6 py-3.5 bg-cyber-cyan text-cyber-bg font-display font-bold uppercase tracking-widest text-sm hover:bg-cyber-cyan/90 clip-cyber-corner transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                  Buy Now — ${parseFloat(listing.price).toFixed(2)}
                </button>
              )
            ) : (
              <div className="mt-6 py-3.5 text-center border border-slate-700 text-slate-500 font-display uppercase tracking-widest text-sm clip-cyber-corner">Sold</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResaleListingDetailsPage;