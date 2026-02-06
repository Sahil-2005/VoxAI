import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateBot from './pages/CreateBot';
import BotDetails from './pages/BotDetails';
import Settings from './pages/Settings';

import './App.css';

// Page transition wrapper
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

// Public route wrapper - redirects to dashboard if already logged in
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// App Routes component
const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={
          <PublicRoute>
            <PageWrapper><Landing /></PageWrapper>
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <PageWrapper><Login /></PageWrapper>
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <PageWrapper><Register /></PageWrapper>
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PageWrapper><Dashboard /></PageWrapper>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PageWrapper><Settings /></PageWrapper>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bots/create"
          element={
            <ProtectedRoute>
              <PageWrapper><CreateBot /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bots/edit/:id"
          element={
            <ProtectedRoute>
              <PageWrapper><CreateBot /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bots/:id"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PageWrapper><BotDetails /></PageWrapper>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
