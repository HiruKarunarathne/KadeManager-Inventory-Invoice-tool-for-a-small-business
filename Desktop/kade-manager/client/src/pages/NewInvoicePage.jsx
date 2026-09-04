import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../api/inventoryApi';
import { createInvoice } from '../api/invoiceApi';
import Loader from '../components/shared/Loader';
import ErrorBanner from '../components/shared/ErrorBanner';

export default function NewInvoicePage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form Fields
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);

  // Cart Line Items
  const [cart, setCart] = useState([]);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data.products || []))
      .catch((err) => setError(err.message || 'Failed to load stock list'))
      .finally(() => setLoadingProducts(false));
  }, []);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!selectedProductId) return;

    const product = products.find((p) => p._id === selectedProductId);
    if (!product) return;

    const requestedQty = Number(itemQuantity);
    if (requestedQty <= 0) return;

    // Check against available stock
    const existingInCart = cart.find((item) => item.productId === product._id);
    const currentQtyInCart = existingInCart ? existingInCart.quantity : 0;
    const totalQtyRequested = currentQtyInCart + requestedQty;

    if (totalQtyRequested > product.quantity) {
      setError(
        `Insufficient stock! Only ${product.quantity} ${product.unit} available for "${product.name}".`
      );
      return;
    }

    setError('');

    if (existingInCart) {
      setCart(
        cart.map((item) =>
          item.productId === product._id
            ? {
                ...item,
                quantity: totalQtyRequested,
                total: totalQtyRequested * product.unitPrice,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product._id,
          name: product.name,
          unit: product.unit,
          unitPrice: product.unitPrice,
          quantity: requestedQty,
          total: requestedQty * product.unitPrice,
        },
      ]);
    }

    // Reset selection
    setSelectedProductId('');
    setItemQuantity(1);
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter((i) => i.productId !== productId));
  };

  const calculateGrandTotal = () => cart.reduce((sum, item) => sum + item.total, 0);

  const handleSubmitInvoice = async () => {
    if (cart.length === 0) {
      setError('Please add at least one item to the invoice.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      await createInvoice({
        customerName: customerName.trim() || 'Walk-in Customer',
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      // Redirect to invoice history after successful invoice issuance
      navigate('/invoices');
    } catch (err) {
      setError(err.message || 'Failed to complete invoice');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProducts) {
    return <Loader message="Loading shop products..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Invoice</h1>
        <p className="text-sm text-gray-500">Perera Stores Point of Sale</p>
      </div>

      <ErrorBanner message={error} onClose={() => setError('')} />

      {/* Customer Info Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
          Customer Name
        </label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Walk-in Customer"
          className="w-full sm:max-w-md px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
        />
      </div>

      {/* Item Adder Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
          Add Products to Bill
        </h2>

        <form onSubmit={handleAddToCart} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-7">
            <label className="block text-xs text-gray-500 mb-1">Select Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white"
            >
              <option value="">-- Choose from stock --</option>
              {products.map((p) => (
                <option key={p._id} value={p._id} disabled={p.quantity <= 0}>
                  {p.name} — LKR {p.unitPrice} ({p.quantity > 0 ? `${p.quantity} ${p.unit} left` : 'Out of stock'})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={!selectedProductId}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-40"
            >
              + Add to Cart
            </button>
          </div>
        </form>
      </div>

      {/* Cart & Billing Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-900 text-sm">Invoice Cart Items ({cart.length})</h3>
          <span className="text-xs font-semibold text-gray-500">Live Totals</span>
        </div>

        {cart.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            Cart is empty. Select products from the dropdown above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase font-semibold">
                <tr>
                  <th className="px-6 py-3 text-left">Item</th>
                  <th className="px-6 py-3 text-right">Unit Price</th>
                  <th className="px-6 py-3 text-right">Qty</th>
                  <th className="px-6 py-3 text-right">Subtotal</th>
                  <th className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {cart.map((line) => (
                  <tr key={line.productId}>
                    <td className="px-6 py-3 font-medium text-gray-900">{line.name}</td>
                    <td className="px-6 py-3 text-right text-gray-600">
                      LKR {line.unitPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-right font-bold text-gray-800">
                      {line.quantity} {line.unit}
                    </td>
                    <td className="px-6 py-3 text-right font-bold text-amber-700">
                      LKR {line.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => handleRemoveFromCart(line.productId)}
                        className="text-red-500 hover:text-red-700 font-semibold text-xs"
                      >
                        ✕ Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Invoice Summary & Checkout Action */}
        <div className="p-6 bg-amber-50/50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-xs text-gray-500 block uppercase font-bold">Total Bill Amount</span>
            <span className="text-3xl font-extrabold text-gray-900">
              LKR {calculateGrandTotal().toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleSubmitInvoice}
            disabled={submitting || cart.length === 0}
            className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow transition disabled:opacity-50 text-sm"
          >
            {submitting ? 'Finalizing Invoice...' : 'Complete & Issue Invoice'}
          </button>
        </div>
      </div>
    </div>
  );
}
