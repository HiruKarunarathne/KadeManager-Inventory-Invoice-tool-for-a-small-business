// src/pages/InventoryPage.jsx
// Member 2 owns this page.
//
// ROLE GATING:
//   - View & Search inventory → owner + staff
//   - Add / Edit products → owner + staff
//   - Delete product button → OWNER ONLY (hidden from staff)

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../api/inventoryApi';
import Loader from '../components/shared/Loader';
import ErrorBanner from '../components/shared/ErrorBanner';

const EMPTY_FORM = {
  name: '',
  category: 'Dry Goods',
  unit: 'kg',
  unitType: 'countable',
  quantity: 10,
  unitPrice: 100,
  lowStockThreshold: 10,
};

const InventoryPage = () => {
  const { isOwner, hasRole } = useAuth();
  const canDelete = isOwner?.() || hasRole?.('owner');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProducts(searchTerm ? { search: searchTerm } : {});
      const list = res.data?.data || res.data?.products || res.data || [];
      setProducts(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (product) => {
    setForm({
      name: product.name || '',
      category: product.category || 'Dry Goods',
      unit: product.unit || 'kg',
      unitType: product.unitType || 'countable',
      quantity: product.quantity ?? 0,
      unitPrice: product.unitPrice ?? 0,
      lowStockThreshold: product.lowStockThreshold ?? 10,
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);

    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      unit: form.unit.trim(),
      unitType: form.unitType,
      quantity: Number(form.quantity),
      unitPrice: Number(form.unitPrice),
      lowStockThreshold: Number(form.lowStockThreshold) || 10,
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        setSuccessMessage('Product updated successfully!');
      } else {
        await createProduct(payload);
        setSuccessMessage('Product created successfully!');
      }
      closeForm();
      fetchProducts();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save product');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(id);
      setSuccessMessage(`"${name}" was deleted successfully.`);
      fetchProducts();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete product');
    }
  };

  const renderStockBadge = (product) => {
    const qty = Number(product.quantity);
    const threshold = Number(product.lowStockThreshold) || 10;

    if (qty === 0) {
      return <span className="badge badge--warning" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--color-danger)' }}>● Out of Stock</span>;
    }
    if (qty <= threshold) {
      return <span className="badge badge--warning">● Low Stock ({qty})</span>;
    }
    return <span className="badge badge--ok">● In Stock ({qty})</span>;
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Inventory Management</h1>
          <p className="page-subtitle">Live stock catalog for Perera Stores</p>
        </div>
        <button id="add-product-btn" className="btn btn-primary" onClick={openAdd}>
          + Add Product
        </button>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      {successMessage && (
        <div
          style={{
            background: 'rgba(34, 197, 94, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            borderRadius: 'var(--radius)',
            padding: '0.75rem 1rem',
            fontSize: '0.9rem',
            color: 'var(--color-success)',
          }}
        >
          ✅ {successMessage}
        </div>
      )}

      {/* ── Search Bar ── */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          background: 'var(--color-surface)',
          padding: '1rem',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--color-border)',
        }}
      >
        <input
          type="text"
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: '400px' }}
        />
        {searchTerm && (
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setSearchTerm('')}
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Product form modal ── */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label htmlFor="name">Product Name</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <input
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Dry Goods, Beverages, Dairy"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="unit">Unit</label>
                  <input
                    id="unit"
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    placeholder="e.g. kg, l, pcs, pack"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="unitType">Sale Type</label>
                  <select
                    id="unitType"
                    name="unitType"
                    value={form.unitType}
                    onChange={handleChange}
                  >
                    <option value="countable">Countable (whole units)</option>
                    <option value="measured">Measured (by weight/volume)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="unitPrice">Unit Price (LKR)</label>
                  <input
                    id="unitPrice"
                    name="unitPrice"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.unitPrice}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">Quantity in Stock</label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    step={form.unitType === 'measured' ? '0.01' : '1'}
                    value={form.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="lowStockThreshold">Low Stock Alert Threshold</label>
                <input
                  id="lowStockThreshold"
                  name="lowStockThreshold"
                  type="number"
                  min="0"
                  value={form.lowStockThreshold}
                  onChange={handleChange}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={closeForm}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={formLoading}
                >
                  {formLoading ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Products Table ── */}
      {loading ? (
        <Loader message="Loading inventory..." />
      ) : products.length === 0 ? (
        <p className="empty-state">No products found matching your criteria.</p>
      ) : (
        <div style={{ overflowX: 'auto', borderRadius: 'var(--radius)' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Stock Level</th>
                <th style={{ textAlign: 'right' }}>Price (LKR)</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const isLow = p.quantity <= (p.lowStockThreshold || 10);

                return (
                  <tr key={p._id} className={isLow ? 'row--warning' : ''}>
                    <td>
                      <strong>{p.name}</strong>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {p.unitType === 'measured' ? '⚖️ Measured' : '📦 Countable'}
                      </span>
                    </td>
                    <td>{p.category}</td>
                    <td>
                      <strong>{p.quantity}</strong> {p.unit}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      LKR {Number(p.unitPrice).toLocaleString()} per {p.unit}
                    </td>
                    <td>{renderStockBadge(p)}</td>
                    <td>
                      <div className="actions-cell" style={{ justifyContent: 'center' }}>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => openEdit(p)}
                        >
                          Edit
                        </button>
                        {canDelete && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(p._id, p.name)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
