// ═══════════════════════════════════════════════════════
//  NEW INVOICE PAGE  —  Member 3 owns this file
// ═══════════════════════════════════════════════════════
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../api/inventoryApi';
import { createInvoice } from '../api/invoiceApi';
import Loader from '../components/shared/Loader';
import ErrorBanner from '../components/shared/ErrorBanner';
import styles from './NewInvoicePage.module.css';

const NewInvoicePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([{ product: '', quantity: 1 }]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data.data.products))
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  const addItem = () => setItems([...items, { product: '', quantity: 1 }]);

  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));

  const updateItem = (idx, field, value) => {
    setItems(items.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  };

  const getTotal = () => {
    return items.reduce((sum, item) => {
      const prod = products.find((p) => p._id === item.product);
      return sum + (prod ? prod.unitPrice * Number(item.quantity) : 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.some((i) => !i.product)) {
      setError('Please select a product for each line item');
      return;
    }
    try {
      setSubmitting(true);
      const res = await createInvoice({ customerName, items, notes });
      navigate(`/invoices`, { state: { created: res.data.data.invoice.invoiceNumber } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create invoice');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader message="Loading products..." />;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🧾 New Invoice</h1>

      <ErrorBanner message={error} onClose={() => setError(null)} />

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Customer Name</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Walk-in Customer"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Items</h2>
          {items.map((item, idx) => {
            const prod = products.find((p) => p._id === item.product);
            return (
              <div key={idx} className={styles.itemRow}>
                <select
                  className={styles.select}
                  value={item.product}
                  onChange={(e) => updateItem(idx, 'product', e.target.value)}
                  required
                >
                  <option value="">— Select product —</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} (LKR {p.unitPrice} / {p.unit})
                    </option>
                  ))}
                </select>
                <input
                  className={styles.qtyInput}
                  type="number"
                  min={1}
                  max={prod?.quantity ?? 9999}
                  value={item.quantity}
                  onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                  required
                />
                <span className={styles.subtotal}>
                  LKR {prod ? (prod.unitPrice * Number(item.quantity)).toLocaleString() : '—'}
                </span>
                {items.length > 1 && (
                  <button type="button" className={styles.removeBtn} onClick={() => removeItem(idx)}>✕</button>
                )}
              </div>
            );
          })}
          <button type="button" className={styles.addItemBtn} onClick={addItem}>
            + Add Item
          </button>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Notes (optional)</label>
          <textarea
            className={styles.input}
            rows={2}
            placeholder="Any special notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Total</span>
          <span className={styles.totalAmount}>LKR {getTotal().toLocaleString()}</span>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={submitting}>
          {submitting ? 'Creating...' : '✓ Create Invoice'}
        </button>
      </form>
    </div>
  );
};

export default NewInvoicePage;
