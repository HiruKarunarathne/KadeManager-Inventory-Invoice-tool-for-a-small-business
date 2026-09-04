import React from 'react';
import Navbar from './components/shared/Navbar';
import AppRoutes from './routes/AppRoutes';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      {/* Show Navbar when user is logged in */}
      {isAuthenticated && <Navbar />}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AppRoutes />
      </main>

      <footer className="py-4 border-t border-gray-200 text-center text-xs text-gray-400">
        Perera Stores © {new Date().getFullYear()} — Kade Manager Inventory & POS
      </footer>
    </div>
  );
}
