// src/App.jsx

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/shared/Navbar';
import { useAuth } from './context/AuthContext';
import './index.css';

// Inner component so it can consume AuthContext
const AppLayout = () => {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
      <main className="main-content">
        <AppRoutes />
      </main>
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
