import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const CONDITIONS = ['new', 'like_new', 'excellent', 'good', 'fair', 'for_parts'];

const ResaleCreateListingPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', price: '', condition: 'good', location: '', phone_number: '', resale_category_id: '' });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (!token) navigate('/login'); }, [token]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const onImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v !== '') fd.append(k, v); });
    images.forEach(img => fd.append('images[]', img));
    try {
      const res = await api.post('/resale/listings', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate(`/resale/${res.data.id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create listing');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-cyber-bg">
      <div className="bg-cyber-dark/60 border-b border-cyber-cyan/10">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <Link to="/resale" className="text-[10px] font-mono text-slate-500 hover:text-cyber-cyan mb-2 inline-block">← Marketplace</Link>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wider text-slate-100">Sell an Item</h1>
        </div>
      </div>

      <form onSubmit={submit} className="max-w-2xl mx-auto px-6 py-8 space-y-5">
        <div className="bg-cyber-dark/85 border border-cyber-cyan/20 clip-cyber-corner p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Title *</label>
            <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} required maxLength={255} className="w-full bg-slate-900/80 border border-slate-700 focus:border-cyber-cyan text-slate-200 text-sm px-4 py-2.5 focus:outline-none admin-input" />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Description *</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} required rows="4" className="w-full bg-slate-900/80 border border-slate-700 focus:border-cyber-cyan text-slate-200 text-sm px-4 py-2.5 focus:outline-none admin-input resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Price ($) *</label>
              <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} required className="w-full bg-slate-900/80 border border-slate-700 focus:border-cyber-cyan text-slate-200 text-sm px-4 py-2.5 focus:outline-none admin-input" />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Condition *</label>
              <select value={form.condition} onChange={(e) => set('condition', e.target.value)} className="w-full bg-slate-900/80 border border-slate-700 focus:border-cyber-cyan text-slate-200 text-sm px-4 py-2.5 focus:outline-none admin-input appearance-none">
                {CONDITIONS.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Location *</label>
            <input type="text" value={form.location} onChange={(e) => set('location', e.target.value)} required placeholder="City or area" className="w-full bg-slate-900/80 border border-slate-700 focus:border-cyber-cyan text-slate-200 text-sm px-4 py-2.5 focus:outline-none admin-input" />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Your Phone Number (for buyers to reach you) *</label>
            <input type="text" value={form.phone_number} onChange={(e) => set('phone_number', e.target.value)} required placeholder="+1 555-0123" className="w-full bg-slate-900/80 border border-slate-700 focus:border-cyber-cyan text-slate-200 text-sm px-4 py-2.5 focus:outline-none admin-input" />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Photos (optional, up to 8)</label>
            <input type="file" accept="image/*" multiple onChange={onImages} className="w-full text-slate-400 text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:font-mono file:uppercase file:bg-cyber-cyan/10 file:text-cyber-cyan hover:file:bg-cyber-cyan/20 cursor-pointer" />
            {previews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative w-20 h-20 border border-cyber-cyan/30 clip-cyber-corner overflow-hidden">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => { setImages(images.filter((_, j) => j !== i)); setPreviews(previews.filter((_, j) => j !== i)); }} className="absolute top-1 right-1 w-5 h-5 bg-cyber-magenta text-white text-xs flex items-center justify-center">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={submitting} className="w-full py-3 bg-cyber-cyan text-cyber-bg font-display font-bold uppercase tracking-widest text-sm hover:bg-cyber-cyan/90 disabled:opacity-50 transition-all">
            {submitting ? 'Listing...' : 'List for Sale'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResaleCreateListingPage;
