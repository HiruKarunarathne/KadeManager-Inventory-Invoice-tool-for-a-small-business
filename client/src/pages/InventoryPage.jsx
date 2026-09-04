// ═══════════════════════════════════════════════════════
//  INVENTORY PAGE  —  Member 2 owns this file
// ═══════════════════════════════════════════════════════
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProducts, deleteProduct } from '../api/inventoryApi';
import Loader from '../components/shared/Loader';
import ErrorBanner from '../components/shared/ErrorBanner';
import styles from './InventoryPage.module.css';

/**
 * InventoryPage
 * ─ Both roles: view products, add product, edit product
 * ─ Owner only: delete product button visible
 *
 * ROLE GATING EXAMPLE:
 *   {user.role === 'owner' && <button onClick={() => handleDelete(p._id)}>Delete</button>}
 */
const InventoryPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      setProducts(res.data.data.products);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove "${name}" from inventory?`)) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <Loader message="Loading inventory..." />;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>📦 Inventory</h1>
        {/* TODO Member 2: Add ProductFormModal here */}
        <button className={styles.addBtn}>+ Add Product</button>
      </div>

      <ErrorBanner message={error} onClose={() => setError(null)} />

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Unit</th>
              <th>Qty</th>
              <th>Unit Price (LKR)</th>
              <th>Stock Status</th>
              {/* Hide Actions column header from staff since they won't see delete */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className={p.isLowStock ? styles.lowStockRow : ''}>
                <td className={styles.productName}>{p.name}</td>
                <td><span className={styles.categoryTag}>{p.category}</span></td>
                <td>{p.unit}</td>
                <td className={p.isLowStock ? styles.lowQty : ''}>{p.quantity}</td>
                <td>{p.unitPrice.toLocaleString()}</td>
                <td>
                  {p.isLowStock
                    ? <span className={styles.badge + ' ' + styles.low}>Low</span>
                    : <span className={styles.badge + ' ' + styles.ok}>OK</span>
                  }
                </td>
                <td className={styles.actions}>
                  <button className={styles.editBtn}>Edit</button>
                  {/* ── ROLE GATE: Delete only visible to owner ── */}
                  {user.role === 'owner' && (
                    <button
                      className={styles.deleteBtn}
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
        {products.length === 0 && (
          <p className={styles.emptyState}>No products found. Add your first product!</p>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
