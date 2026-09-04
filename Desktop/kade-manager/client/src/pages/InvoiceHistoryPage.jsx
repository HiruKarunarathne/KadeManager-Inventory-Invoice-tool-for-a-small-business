import React, { useEffect, useState } from 'react';
import { getInvoices } from '../api/invoiceApi';
import Loader from '../components/shared/Loader';
import ErrorBanner from '../components/shared/ErrorBanner';

export default function InvoiceHistoryPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedInvoiceId, setExpandedInvoiceId] = useState(null);

  useEffect(() => {
    getInvoices()
      .then((data) => setInvoices(data.invoices || []))
      .catch((err) => setError(err.message || 'Failed to fetch invoices'))
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (id) => {
    setExpandedInvoiceId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice History</h1>
          <p className="text-sm text-gray-500">All past billing transactions at Perera Stores</p>
        </div>
      </div>

      <ErrorBanner message={error} onClose={() => setError('')} />

      {loading ? (
        <Loader message="Loading transaction logs..." />
      ) : invoices.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
          No invoices have been generated yet.
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map((invoice) => {
            const isExpanded = expandedInvoiceId === invoice._id;
            const dateStr = new Date(invoice.createdAt).toLocaleDateString('en-LK', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={invoice._id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition hover:border-amber-200"
              >
                <div
                  onClick={() => toggleExpand(invoice._id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer bg-white select-none"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">
                        {invoice.customerName || 'Walk-in Customer'}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-mono">
                        #{invoice._id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Issued on {dateStr} by{' '}
                      <span className="font-medium text-gray-600">
                        {invoice.createdBy?.name || 'Staff'}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <span className="text-xs text-gray-400 block">Total</span>
                      <span className="text-lg font-bold text-amber-700">
                        LKR {Number(invoice.totalAmount).toLocaleString()}
                      </span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {/* Expanded Item Breakdown */}
                {isExpanded && (
                  <div className="bg-amber-50/30 border-t border-gray-100 p-4 sm:p-5">
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Billed Line Items ({invoice.items?.length || 0})
                    </h4>
                    <div className="divide-y divide-gray-100 text-xs bg-white rounded-lg border border-gray-100 overflow-hidden">
                      {invoice.items?.map((item, idx) => (
                        <div key={idx} className="p-3 flex justify-between items-center">
                          <div>
                            <span className="font-semibold text-gray-900">{item.name}</span>
                            <span className="text-gray-400 block text-[11px]">
                              {item.quantity} × LKR {Number(item.unitPrice).toLocaleString()}
                            </span>
                          </div>
                          <span className="font-bold text-gray-800">
                            LKR {Number(item.total).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
