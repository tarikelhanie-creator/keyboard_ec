import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Search } from 'lucide-react';
import Button from '../../components/Button';
import GlassPanel from '../components/GlassPanel';
import ProductFormModal from '../components/ProductFormModal';
import {
  fetchProducts,
  fetchCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../services/adminService';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchProducts({ per_page: 50, search: search || undefined });
      setProducts(res.data.data ?? res.data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const timer = setTimeout(loadProducts, 300);
    return () => clearTimeout(timer);
  }, [loadProducts]);

  const handleCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditing(product);
    setModalOpen(true);
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    try {
      await deleteProduct(product.id);
      loadProducts();
    } catch {
      setError('Failed to delete product');
    }
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    setError(null);
    try {
      if (editing) {
        await updateProduct(editing.id, formData);
      } else {
        await createProduct(formData);
      }
      setModalOpen(false);
      loadProducts();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors ?? {}).flat().join(' ') ||
        'Save failed';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-10"
          />
        </div>
        <Button variant="primary" onClick={handleCreate} className="font-display shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {error && <p className="text-sm text-cyber-magenta font-display">{error}</p>}

      <GlassPanel>
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 text-cyber-cyan animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-12">No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-display uppercase tracking-widest text-slate-500 border-b border-white/5">
                  <th className="pb-3 pr-4">Product</th>
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 pr-4">Price</th>
                  <th className="pb-3 pr-4">Stock</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-white/5 admin-table-row">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt=""
                            className="h-10 w-10 rounded-lg object-cover border border-white/10"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10" />
                        )}
                        <div>
                          <p className="font-display font-bold text-slate-200 uppercase tracking-wide">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-slate-500">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-slate-400">{product.category?.name ?? '—'}</td>
                    <td className="py-4 pr-4 font-mono text-slate-200">
                      ${parseFloat(product.price).toFixed(2)}
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`font-mono ${
                          product.stock < 10 ? 'text-cyber-yellow' : 'text-slate-300'
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 rounded-lg text-slate-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10 cursor-pointer"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="p-2 rounded-lg text-slate-400 hover:text-cyber-magenta hover:bg-cyber-magenta/10 cursor-pointer"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassPanel>

      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        product={editing}
        categories={categories}
        saving={saving}
      />
    </div>
  );
};

export default AdminProducts;
