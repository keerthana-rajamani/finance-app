import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BudgetTracker from './pages/BudgetTracker';
import Goals from './pages/Goals';
import Accounts from './pages/Accounts';
import Bills from './pages/Bills';
import Investments from './pages/Investments';
import TaxSummary from './pages/TaxSummary';
import AIAdvisor from './pages/AIAdvisor';
import FamilyFinance from './pages/FamilyFinance';
import CompliancePrivacy from './pages/CompliancePrivacy';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-transparent text-slate-900 font-sans">
            <NavBar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/compliance" element={<CompliancePrivacy />} />
                <Route path="/privacy" element={<CompliancePrivacy />} />

                {/* Protected Routes (Appendix I & FR1 - FR3) */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/budget"
                  element={
                    <ProtectedRoute allowedRoles={['USER', 'FAMILY_MEMBER', 'ADMIN']}>
                      <BudgetTracker />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/goals"
                  element={
                    <ProtectedRoute allowedRoles={['USER', 'FINANCIAL_ADVISOR', 'ADMIN']}>
                      <Goals />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/accounts"
                  element={
                    <ProtectedRoute allowedRoles={['USER', 'SUPPORT', 'ADMIN']}>
                      <Accounts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bills"
                  element={
                    <ProtectedRoute allowedRoles={['USER', 'FAMILY_MEMBER', 'ADMIN']}>
                      <Bills />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/investments"
                  element={
                    <ProtectedRoute allowedRoles={['USER', 'FINANCIAL_ADVISOR', 'ADMIN']}>
                      <Investments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tax"
                  element={
                    <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                      <TaxSummary />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/advisor"
                  element={
                    <ProtectedRoute allowedRoles={['USER', 'FINANCIAL_ADVISOR', 'ADMIN']}>
                      <AIAdvisor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/family"
                  element={
                    <ProtectedRoute allowedRoles={['USER', 'FAMILY_MEMBER', 'ADMIN']}>
                      <FamilyFinance />
                    </ProtectedRoute>
                  }
                />

                {/* Catch all fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
