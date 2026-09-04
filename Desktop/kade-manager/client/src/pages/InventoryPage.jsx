import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/inventoryApi';
import Loader from '../components/shared/Loader';
import ErrorBanner from '../components/shared/ErrorBanner';

export default function InventoryPage() {
  const { user, hasRole } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State for Add & Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Groceries',
    unit: 'pcs',
    quantity: 10,
    unitPrice: 100,
    lowStockThreshold: 5,
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getProducts({ search: searchTerm });
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message || 'Failed to load inventory from server');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Open modal for Adding a new product
  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setFormData({
      name: '',
      category: 'Groceries',
      unit: 'pcs',
      quantity: 10,
      unitPrice: 100,
      lowStockThreshold: 5,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for Editing an existing product
  const handleOpenEditModal = (product) => {
    setEditingProductId(product._id);
    setFormData({
      name: product.name || '',
      category: product.category || 'Groceries',
      unit: product.unit || 'pcs',
      quantity: product.quantity ?? product.stockQuantity ?? 0,
      unitPrice: product.unitPrice ?? product.price ?? 0,
      lowStockThreshold: product.lowStockThreshold ?? 5,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Frontend Form Validation (prevent empty strings, negative numbers)
  const validateForm = () => {
    if (!formData.name || !formData.name.trim()) {
      return 'Product name cannot be empty.';
    }
    if (!formData.category || !formData.category.trim()) {
      return 'Category cannot be empty.';
    }
    if (!formData.unit || !formData.unit.trim()) {
      return 'Unit cannot be empty.';
    }
    const priceNum = Number(formData.unitPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      return 'Price must be a valid positive number greater than 0.';
    }
    const qtyNum = Number(formData.quantity);
    if (isNaN(qtyNum) || qtyNum < 0) {
      return 'Quantity cannot be a negative number (must be 0 or greater).';
    }
    return null;
  };

  // Submit Handler for Add / Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // 1. Frontend validation before submission
    const validationErr = validateForm();
    if (validationErr) {
      setFormError(validationErr);
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        unit: formData.unit.trim(),
        price: Number(formData.unitPrice),
        unitPrice: Number(formData.unitPrice),
        stockQuantity: Number(formData.quantity),
        quantity: Number(formData.quantity),
        lowStockThreshold: Number(formData.lowStockThreshold) || 5,
      };

      if (editingProductId) {
        await updateProduct(editingProductId, payload);
        setSuccessMessage('Product updated successfully!');
      } else {
        await createProduct(payload);
        setSuccessMessage('Product created successfully!');
      }

      setIsModalOpen(false);
      await fetchInventory();

      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      // 2. Display backend validation error messages gracefully
      setFormError(err.message || 'Server error occurred while saving product');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Handler
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      setError('');
      await deleteProduct(id);
      setSuccessMessage(`"${name}" was deleted successfully.`);
      await fetchInventory();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to delete product from server.');
    }
  };

  // 3. Stock Badges:
  // - Green badge for "In Stock" (quantity > 10)
  // - Yellow badge for "Low Stock" (quantity between 1 and 10)
  // - Red badge for "Out of Stock" (quantity === 0)
  const renderStockBadge = (quantity) => {
    const qty = Number(quantity);
    if (qty === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
          ● Out of Stock
        </span>
      );
    }
    if (qty >= 1 && qty <= 10) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">
          ● Low Stock ({qty})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
        ● In Stock ({qty})
      </span>
    );
  };

  // 4. Role-based UI rendering: Hide 'Edit' and 'Delete' buttons completely if user.role === 'staff'
  const isOwner = hasRole('owner') && user?.role !== 'staff';

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-sm text-gray-500">Live stock catalog for Perera Stores</p>
        </div>

        {/* Owner-only Add Product Button */}
        {isOwner && (
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
          >
            + Add New Product
          </button>
        )}
      </div>

      {/* Backend & Global Error Alert */}
      <ErrorBanner message={error} onClose={() => setError('')} />

      {/* Success Toast / Alert */}
      {successMessage && (
        <div className="rounded-lg bg-emerald-50 p-4 border border-emerald-200 text-emerald-800 text-sm font-semibold flex justify-between items-center animate-fade-in">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage('')}
            className="text-emerald-600 hover:text-emerald-800 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
        <span className="text-gray-400">🔍</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products by name (e.g. Sambol, Munchee, Tea)..."
          className="w-full text-sm outline-none bg-transparent placeholder-gray-400"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs text-gray-400 hover:text-gray-600 font-semibold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Products Table */}
      {loading ? (
        <Loader message="Fetching live stock records..." />
      ) : products.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
          No products found matching "{searchTerm}".
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-semibold tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Product</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-right">Unit Price (LKR)</th>
                  <th className="px-6 py-3 text-right">Quantity</th>
                  <th className="px-6 py-3 text-center">Stock Status</th>
                  {/* Action column header visible only for owner */}
                  {isOwner && (
                    <th className="px-6 py-3 text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {products.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900 whitespace-nowrap">
                      LKR {Number(item.unitPrice ?? item.price ?? 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span className="font-bold text-gray-900">
                        {item.quantity ?? item.stockQuantity ?? 0}
                      </span>{' '}
                      <span className="text-xs text-gray-400 font-normal">{item.unit || 'pcs'}</span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {renderStockBadge(item.quantity ?? item.stockQuantity ?? 0)}
                    </td>

                    {/* ROLE-BASED UI RENDERING: Completely hide Edit and Delete if staff */}
                    {isOwner && (
                      <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="text-xs font-semibold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded transition border border-amber-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id, item.name)}
                          className="text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded transition border border-red-200"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal (Owner Only) */}
      {isModalOpen && isOwner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {editingProductId ? 'Edit Product' : 'Add New Inventory Item'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Error Alert for Validation / Backend Errors */}
            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <span>⚠️</span>
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Anchor Milk Powder 400g"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Dairy / Biscuits"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Unit *
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="pcs / pack / kg"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Quantity (≥ 0) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Price LKR (&gt; 0) *
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="any"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Low Stock Alert
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.lowStockThreshold}
                    onChange={(e) =>
                      setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingProductId ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
