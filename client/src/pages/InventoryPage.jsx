// src/pages/InventoryPage.jsx
// Member 2 owns this page.
//
// ROLE GATING EXAMPLE:
//   - Add / Edit products → owner + staff
//   - Delete product button → OWNER ONLY (hidden from staff)

import { useState, useEffect } from 'react';
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
  category: '',
  unit: '',
  quantity: '',
  unitPrice: '',
  lowStockThreshold: 5,
};

const InventoryPage = () => {
  const { isOwner } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      setProducts(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); };
  const openEdit = (product) => {
    setForm({ ...product });
    setEditingId(product._id);
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);
    try {
      if (editingId) {
        await updateProduct(editingId, form);
      } else {
        await createProduct(form);
      }
      closeForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  if (loading) return <Loader message="Loading inventory..." />;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Inventory</h1>
        <button id="add-product-btn" className="btn btn-primary" onClick={openAdd}>
          + Add Product
        </button>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      {/* ── Product form modal ── */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit} className="product-form">
              {['name', 'category', 'unit'].map((field) => (
                <div className="form-group" key={field}>
                  <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    id={field}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
              {['quantity', 'unitPrice', 'lowStockThreshold'].map((field) => (
                <div className="form-group" key={field}>
                  <label htmlFor={field}>
                    {field === 'unitPrice'
                      ? 'Unit Price (LKR)'
                      : field === 'lowStockThreshold'
                      ? 'Low Stock Alert Threshold'
                      : 'Quantity'}
                  </label>
                  <input
                    id={field}
                    name={field}
                    type="number"
                    min="0"
                    value={form[field]}
                    onChange={handleChange}
                    required={field !== 'lowStockThreshold'}
                  />
                </div>
              ))}
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                  {formLoading ? 'Saving...' : editingId ? 'Update' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Product table ── */}
      {products.length === 0 ? (
        <p className="empty-state">No products yet. Add your first product!</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Price (LKR)</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className={p.isLowStock ? 'row--warning' : ''}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.quantity}</td>
                <td>{p.unit}</td>
                <td>{p.unitPrice.toLocaleString()}</td>
                <td>
                  {p.isLowStock ? (
                    <span className="badge badge--warning">Low</span>
                  ) : (
                    <span className="badge badge--ok">OK</span>
                  )}
                </td>
                <td className="actions-cell">
                  <button
                    id={`edit-product-${p._id}`}
                    className="btn btn-sm btn-outline"
                    onClick={() => openEdit(p)}
                  >
                    Edit
                  </button>

                  {/* ── DELETE: OWNER ONLY ── */}
                  {isOwner() && (
                    <button
                      id={`delete-product-${p._id}`}
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(p._id, p.name)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InventoryPage;
