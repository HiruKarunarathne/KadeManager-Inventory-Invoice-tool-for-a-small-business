// src/pages/NewInvoicePage.jsx
// Create a new sale invoice — both owner and staff can use this.
// Member 3 owns this page.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../api/inventoryApi';
import { createInvoice } from '../api/invoiceApi';
import Loader from '../components/shared/Loader';
import ErrorBanner from '../components/shared/ErrorBanner';

const NewInvoicePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: 1 }]);

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data.data))
      .catch(() => setError('Failed to load products for invoice'))
      .finally(() => setLoadingProducts(false));
  }, []);

  const addItem = () => setItems((prev) => [...prev, { productId: '', quantity: 1 }]);
  const removeItem = (i) => setItems((prev) => prev.filter((_, idx) => idx !== i));
  const updateItem = (i, field, value) =>
    setItems((prev) => prev.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)));

  // Compute running total from selected products
  const total = items.reduce((sum, item) => {
    const product = products.find((p) => p._id === item.productId);
    return sum + (product ? product.unitPrice * Number(item.quantity) : 0);
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createInvoice({ customerName, items });
      navigate('/invoices');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create invoice');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProducts) return <Loader message="Loading products..." />;

  return (
    <div className="page">
      <div className="page-header">
        <h1>New Invoice</h1>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      <form onSubmit={handleSubmit} className="invoice-form">
        <div className="form-group">
          <label htmlFor="customerName">Customer Name</label>
          <input
            id="customerName"
            name="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Walk-in Customer"
          />
        </div>

        <div className="invoice-items">
          <h2>Items</h2>
          {items.map((item, i) => (
            <div key={i} className="invoice-item-row">
              <select
                id={`item-product-${i}`}
                value={item.productId}
                onChange={(e) => updateItem(i, 'productId', e.target.value)}
                required
              >
                <option value="">— Select product —</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} — LKR {p.unitPrice}/{p.unit}
                  </option>
                ))}
              </select>

              <input
                id={`item-qty-${i}`}
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateItem(i, 'quantity', e.target.value)}
                required
                className="qty-input"
              />

              <span className="item-subtotal">
                LKR{' '}
                {(
                  (products.find((p) => p._id === item.productId)?.unitPrice || 0) *
                  Number(item.quantity)
                ).toLocaleString()}
              </span>

              {items.length > 1 && (
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => removeItem(i)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button type="button" className="btn btn-outline" onClick={addItem}>
            + Add Item
          </button>
        </div>

        <div className="invoice-total">
          <strong>Total: LKR {total.toLocaleString()}</strong>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/invoices')}>
            Cancel
          </button>
          <button
            id="create-invoice-btn"
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Creating Invoice...' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewInvoicePage;
