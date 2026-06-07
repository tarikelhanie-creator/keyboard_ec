import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Plus, Pencil, Trash2, Loader2, Search, X, Tag, CheckCircle, AlertCircle,
} from 'lucide-react';
import Button from '../../components/Button';
import GlassPanel from '../components/GlassPanel';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../services/adminService';

// ─── Toast Notification ──────────────────────────────────────────────────────
const Toast = ({ toast, onDismiss }) => {
  if (!toast) return null;
  const isSuccess = toast.type === 'success';
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border font-display text-sm tracking-wide transition-all animate-slide-in
        ${isSuccess
          ? 'bg-cyber-dark/95 border-cyber-cyan/40 text-cyber-cyan'
          : 'bg-cyber-dark/95 border-cyber-magenta/40 text-cyber-magenta'
        }`}
    >
      {isSuccess
        ? <CheckCircle className="h-4 w-4 flex-shrink-0" />
        : <AlertCircle className="h-4 w-4 flex-shrink-0" />}
      <span>{toast.message}</span>
      <button onClick={onDismiss} className="ml-2 opacity-60 hover:opacity-100 cursor-pointer">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

// ─── Category Form Modal ─────────────────────────────────────────────────────
const CategoryModal = ({ open, onClose, onSubmit, category, saving, error }) => {
  const [name, setName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setName(category?.name ?? '');
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [open, category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name: name.trim() });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-panel-strong w-full max-w-md rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="font-display font-bold text-lg uppercase tracking-wider text-slate-100">
            {category ? 'Edit Category' : 'New Category'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 cursor-pointer rounded-lg hover:bg-white/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-[10px] font-display uppercase tracking-widest text-slate-500 mb-1.5">
              Category Name
            </label>
            <input
              ref={inputRef}
              type="text"
              required
              maxLength={255}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mechanical Decks"
              className="admin-input"
            />
          </div>

          {/* Auto-slug preview */}
          {name.trim() && (
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
              <Tag className="h-3 w-3" />
              Slug: <span className="text-slate-400">{name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}</span>
            </div>
          )}

          {error && (
            <p className="text-xs text-cyber-magenta font-display">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 justify-center">
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving} className="flex-1 justify-center">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : category ? 'Save Changes' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main AdminCategories Page ────────────────────────────────────────────────
const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState(null);

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      const res = await fetchCategories(params);
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch {
      showToast('Failed to load categories.', 'error');
    } finally {
      setLoading(false);
    }
  }, [search]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(loadCategories, 300);
    return () => clearTimeout(timer);
  }, [loadCategories]);

  const handleCreate = () => {
    setEditing(null);
    setModalError(null);
    setModalOpen(true);
  };

  const handleEdit = (cat) => {
    setEditing(cat);
    setModalError(null);
    setModalOpen(true);
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"?\n\nThis cannot be undone.`)) return;
    try {
      await deleteCategory(cat.id);
      showToast(`"${cat.name}" deleted successfully.`);
      loadCategories();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete category.';
      showToast(msg, 'error');
    }
  };

  const handleSubmit = async (data) => {
    setSaving(true);
    setModalError(null);
    try {
      if (editing) {
        await updateCategory(editing.id, data);
        showToast(`"${data.name}" updated successfully.`);
      } else {
        await createCategory(data);
        showToast(`"${data.name}" created successfully.`);
      }
      setModalOpen(false);
      loadCategories();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors ?? {}).flat().join(' ') ||
        'Save failed.';
      setModalError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-10"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Button variant="primary" onClick={handleCreate} className="font-display shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Table */}
      <GlassPanel>
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 text-cyber-cyan animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Tag className="h-10 w-10 text-slate-700 mx-auto" />
            <p className="text-slate-500 text-sm font-display uppercase tracking-wider">
              {search ? 'No categories matched your search.' : 'No categories yet.'}
            </p>
            {!search && (
              <Button variant="outline" onClick={handleCreate} className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Create First Category
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-display uppercase tracking-widest text-slate-500 border-b border-white/5">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Slug</th>
                  <th className="pb-3 pr-4">Products</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-white/5 admin-table-row">
                    {/* Name */}
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/20">
                          <Tag className="h-3.5 w-3.5 text-cyber-cyan" />
                        </div>
                        <span className="font-display font-bold text-slate-200 uppercase tracking-wide">
                          {cat.name}
                        </span>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="py-4 pr-4">
                      <span className="font-mono text-xs text-slate-500 bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                        {cat.slug ?? '—'}
                      </span>
                    </td>

                    {/* Product Count */}
                    <td className="py-4 pr-4">
                      <span className={`font-mono text-xs px-2 py-0.5 rounded border
                        ${cat.products_count > 0
                          ? 'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/20'
                          : 'text-slate-500 bg-white/5 border-white/5'
                        }`}>
                        {cat.products_count ?? 0} products
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="p-2 rounded-lg text-slate-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10 cursor-pointer transition-colors"
                          aria-label={`Edit ${cat.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          className="p-2 rounded-lg text-slate-400 hover:text-cyber-magenta hover:bg-cyber-magenta/10 cursor-pointer transition-colors"
                          aria-label={`Delete ${cat.name}`}
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

      {/* Modal */}
      <CategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        category={editing}
        saving={saving}
        error={modalError}
      />

      {/* Toast */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
};

export default AdminCategories;
