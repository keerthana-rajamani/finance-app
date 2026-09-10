import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Wallet, LayoutDashboard, PieChart, Target, CreditCard, 
  Receipt, TrendingUp, ShieldCheck, Sparkles, Users, 
  LogOut, LogIn, UserPlus, Bell, ChevronDown, CheckCircle
} from 'lucide-react';
import { notificationApi } from '../services/api';

export default function NavBar() {
  const { user, isAuthenticated, logoutUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      notificationApi.getNotifications()
        .then(res => setNotifications(res.data || []))
        .catch(err => console.error("Error loading notifications:", err));
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markNotificationRead = (id) => {
    notificationApi.markAsRead(id).then(() => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white/85 backdrop-blur-md border-b border-white/40 sticky top-0 z-50 shadow-sm">
      <div className="h-1 w-full bg-gradient-to-r from-[#DB5375] via-[#ff7c9b] to-[#B3FFB3]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="nav-brand">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DB5375] to-[#B3FFB3] flex items-center justify-center text-slate-900 shadow-md">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight hidden sm:inline">
                Personal Finance and Budget Management Application
              </span>
              <span className="text-lg font-bold text-slate-900 tracking-tight sm:hidden">
                FinanceApp
              </span>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link to="/" className={`nav-link ${isActive('/') ? 'nav-active' : ''}`}>
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'nav-active' : ''}`}>
                  Dashboard
                </Link>
                <Link to="/budget" className={`nav-link ${isActive('/budget') ? 'nav-active' : ''}`}>
                  Budget
                </Link>
                <Link to="/goals" className={`nav-link ${isActive('/goals') ? 'nav-active' : ''}`}>
                  Goals
                </Link>
                <Link to="/accounts" className={`nav-link ${isActive('/accounts') ? 'nav-active' : ''}`}>
                  Accounts
                </Link>
                <Link to="/bills" className={`nav-link ${isActive('/bills') ? 'nav-active' : ''}`}>
                  Bills
                </Link>
                <Link to="/investments" className={`nav-link ${isActive('/investments') ? 'nav-active' : ''}`}>
                  Investments
                </Link>
                <Link to="/tax" className={`nav-link ${isActive('/tax') ? 'nav-active' : ''}`}>
                  Tax
                </Link>
                <Link to="/advisor" className={`nav-link ${isActive('/advisor') ? 'nav-active' : ''}`}>
                  AI Advisor
                </Link>
                <Link to="/family" className={`nav-link ${isActive('/family') ? 'nav-active' : ''}`}>
                  Family
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className={`nav-link ${isActive('/login') ? 'nav-active' : ''}`}>
                  Login
                </Link>
                <Link to="/register" className={`nav-link ${isActive('/register') ? 'nav-active' : ''}`}>
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* User Status / Notification Menu */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Notifications Bell */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-full relative transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                        <span className="font-semibold text-sm text-slate-800">Notifications</span>
                        <span className="text-xs text-emerald-600 font-medium">{unreadCount} new</span>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-500">No notifications</div>
                        ) : (
                          notifications.map((n) => (
                            <div key={n.id} className={`p-3 text-xs hover:bg-slate-50 transition-colors ${!n.isRead ? 'bg-emerald-50/40' : ''}`}>
                              <div className="flex justify-between items-start gap-2">
                                <span className="font-bold text-slate-800">{n.title}</span>
                                {!n.isRead && (
                                  <button 
                                    onClick={() => markNotificationRead(n.id)}
                                    className="text-emerald-600 hover:text-emerald-800 font-semibold"
                                  >
                                    Mark read
                                  </button>
                                )}
                              </div>
                              <p className="text-slate-600 mt-1">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Role Badge & Logout */}
                <div className="hidden sm:flex items-center gap-3 border-l border-slate-200/60 pl-3">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-900 leading-tight">{user?.fullName || 'User'}</p>
                    <span className="theme-badge uppercase text-[10px] tracking-wider font-bold">
                      {user?.role || 'USER'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-[#DB5375] transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="btn-gradient text-xs py-2 px-4 shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
