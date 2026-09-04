import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../api/dashboardApi';
import Loader from '../components/shared/Loader';
import ErrorBanner from '../components/shared/ErrorBanner';

export default function DashboardPage() {
  const { user, role, hasRole } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Only fetch financial analytics if the user is an owner
    if (hasRole('owner')) {
      setLoading(true);
      getDashboardStats()
        .then((res) => {
          setStats(res.stats);
        })
        .catch((err) => {
          setError(err.message || 'Failed to fetch sales statistics');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [hasRole]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Logged in as <span className="font-semibold capitalize">{role}</span> at Perera Stores.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/invoices/new"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
          >
            + Create New Invoice
          </Link>
          <Link
            to="/inventory"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold rounded-lg transition"
          >
            View Inventory
          </Link>
        </div>
      </div>

      <ErrorBanner message={error} onClose={() => setError('')} />

      {/* Role-Gated View: OWNER ANALYTICS */}
      {hasRole('owner') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Owner Sales Summary</h2>
            <span className="text-xs bg-purple-100 text-purple-800 font-semibold px-2.5 py-1 rounded-full">
              Confidential — Owner Only
            </span>
          </div>

          {loading ? (
            <Loader message="Loading business stats..." />
          ) : stats ? (
            <>
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Total Revenue
                  </span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-emerald-600">
                      LKR {Number(stats.totalRevenue || 0).toLocaleString()}
                    </span>
                    <span className="text-2xl">💰</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Today's Revenue
                  </span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      LKR {Number(stats.todayRevenue || 0).toLocaleString()}
                    </span>
                    <span className="text-2xl">📅</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Total Invoices Issued
                  </span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      {stats.totalInvoices || 0}
                    </span>
                    <span className="text-2xl">🧾</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Low Stock Alerts
                  </span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span
                      className={`text-2xl font-bold ${
                        stats.lowStockCount > 0 ? 'text-red-600' : 'text-gray-900'
                      }`}
                    >
                      {stats.lowStockCount || 0}
                    </span>
                    <span className="text-2xl">⚠️</span>
                  </div>
                </div>
              </div>

              {/* Top Selling Products List */}
              {stats.topProducts && stats.topProducts.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                    Top Selling Products
                  </h3>
                  <div className="divide-y divide-gray-100">
                    {stats.topProducts.map((p, idx) => (
                      <div key={p._id || idx} className="py-3 flex justify-between items-center text-sm">
                        <span className="font-medium text-gray-800">
                          {idx + 1}. {p.name}
                        </span>
                        <span className="bg-amber-100 text-amber-900 font-semibold px-2.5 py-0.5 rounded-full text-xs">
                          {p.totalSold} sold
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500">No stats recorded yet.</p>
          )}
        </div>
      )}

      {/* Role-Gated View: STAFF QUICK ACTIONS */}
      {!hasRole('owner') && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Staff Quick Portal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/invoices/new"
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-amber-400 hover:shadow-md transition group"
            >
              <div className="text-3xl mb-2">🧾</div>
              <h3 className="font-bold text-gray-900 group-hover:text-amber-700">
                New Billing & Invoicing
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Scan or add Sri Lankan products to cart and issue an invoice.
              </p>
            </Link>

            <Link
              to="/inventory"
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-amber-400 hover:shadow-md transition group"
            >
              <div className="text-3xl mb-2">📦</div>
              <h3 className="font-bold text-gray-900 group-hover:text-amber-700">
                Inventory & Stock Lookup
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Search live stock levels, check items nearing low-stock thresholds.
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
