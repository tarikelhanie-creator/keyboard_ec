import React, { useEffect, useState } from 'react';
import { X, Loader2, Upload } from 'lucide-react';
import Button from '../../components/Button';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  stock: '',
  brand: '',
  category_id: '',
};

const ProductFormModal = ({ open, onClose, onSubmit, product, categories, saving }) => {
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!open) return;

    if (product) {
      setForm({
        name: product.name ?? '',
        description: product.description ?? '',
        price: String(product.price ?? ''),
        stock: String(product.stock ?? ''),
        brand: product.brand ?? '',
        category_id: String(product.category_id ?? product.category?.id ?? ''),
      });
      setPreview(product.image_url ?? null);
    } else {
      setForm(emptyForm);
      setPreview(null);
    }
    setImage(null);
  }, [open, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('stock', form.stock);
    if (form.brand) formData.append('brand', form.brand);
    formData.append('category_id', form.category_id);
    if (image) formData.append('image', image);
    onSubmit(formData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-panel-strong w-full max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-white/5 sticky top-0 glass-panel-strong">
          <h3 className="font-display font-bold text-lg uppercase tracking-wider text-slate-100">
            {product ? 'Edit Product' : 'New Product'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 cursor-pointer rounded-lg hover:bg-white/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-[10px] font-display uppercase tracking-widest text-slate-500 mb-1.5">
              Name
            </label>
            <input name="name" required value={form.name} onChange={handleChange} className="admin-input" />
          </div>

          <div>
            <label className="block text-[10px] font-display uppercase tracking-widest text-slate-500 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              className="admin-input resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-display uppercase tracking-widest text-slate-500 mb-1.5">
                Price ($)
              </label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                required
                value={form.price}
                onChange={handleChange}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-[10px] font-display uppercase tracking-widest text-slate-500 mb-1.5">
                Stock
              </label>
              <input
                name="stock"
                type="number"
                min="0"
                required
                value={form.stock}
                onChange={handleChange}
                className="admin-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-display uppercase tracking-widest text-slate-500 mb-1.5">
                Brand
              </label>
              <input name="brand" value={form.brand} onChange={handleChange} className="admin-input" />
            </div>
            <div>
              <label className="block text-[10px] font-display uppercase tracking-widest text-slate-500 mb-1.5">
                Category
              </label>
              <select
                name="category_id"
                required
                value={form.category_id}
                onChange={handleChange}
                className="admin-input"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-display uppercase tracking-widest text-slate-500 mb-1.5">
              Image
            </label>
            <label className="flex flex-col items-center justify-center gap-2 p-6 border border-dashed border-white/10 rounded-xl cursor-pointer hover:border-cyber-cyan/30 transition-colors">
              {preview ? (
                <img src={preview} alt="" className="h-24 w-24 object-cover rounded-lg" />
              ) : (
                <Upload className="h-8 w-8 text-slate-500" />
              )}
              <span className="text-xs text-slate-500">Click to upload</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 justify-center">
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving} className="flex-1 justify-center">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : product ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
