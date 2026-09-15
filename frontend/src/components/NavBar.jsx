import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Wallet, LogOut, Bell, CheckCircle2, Trash2, X, CheckCheck
} from 'lucide-react';
import { notificationApi } from '../services/api';

export default function NavBar() {
  const { user, isAuthenticated, logoutUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      notificationApi.getNotifications()
        .then(res => setNotifications(Array.isArray(res.data) ? res.data : []))
        .catch(err => {
          console.error("Error loading notifications:", err);
          setNotifications([]);
        });
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated, user?.userId, user?.role]);

  // Click outside to close notification dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const isUnread = (n) => !(n.isRead === true || n.read === true);
  const unreadCount = notifications.filter(isUnread).length;

  const markNotificationRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true, read: true } : n));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const deleteNotification = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await notificationApi.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await notificationApi.clearAll();
      setNotifications([]);
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  const isActive = (path) => location.pathname === path;

  const role = user?.role || 'USER';

  const getRoleBadgeLabel = (r) => {
    switch (r) {
      case 'FAMILY_MEMBER': return 'Family Member';
      case 'FINANCIAL_ADVISOR': return 'Financial Advisor';
      case 'SUPPORT': return 'Support Agent';
      case 'ADMIN': return 'System Admin';
      default: return 'Primary User';
    }
  };

  return (
    <header className="bg-[#F0FDFF]/92 backdrop-blur-md border-b-2 border-[#BAE6FD]/80 sticky top-0 z-50 shadow-md">
      <div className="h-1.5 w-full bg-[#0E7490]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="nav-brand">
              <div className="w-10 h-10 rounded-xl bg-[#0E7490] flex items-center justify-center text-white shadow-md border border-[#BAE6FD]/50">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="text-lg font-extrabold text-[#082F49] tracking-tight hidden sm:inline">
                Personal Finance Application
              </span>
              <span className="text-lg font-extrabold text-[#082F49] tracking-tight sm:hidden">
                FinanceApp
              </span>
            </Link>
          </div>

          {/* Role-Based Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link to="/" className={`nav-link ${isActive('/') ? 'nav-active' : ''}`}>
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'nav-active' : ''}`}>
                  Dashboard
                </Link>

                {/* Primary User Links */}
                {(role === 'USER' || role === 'ADMIN') && (
                  <>
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
                )}

                {/* Family Member Specific Links */}
                {role === 'FAMILY_MEMBER' && (
                  <>
                    <Link to="/budget" className={`nav-link ${isActive('/budget') ? 'nav-active' : ''}`}>
                      Shared Budget
                    </Link>
                    <Link to="/bills" className={`nav-link ${isActive('/bills') ? 'nav-active' : ''}`}>
                      Household Bills
                    </Link>
                    <Link to="/family" className={`nav-link ${isActive('/family') ? 'nav-active' : ''}`}>
                      Expense Split & Family
                    </Link>
                  </>
                )}

                {/* Financial Advisor Specific Links */}
                {role === 'FINANCIAL_ADVISOR' && (
                  <>
                    <Link to="/investments" className={`nav-link ${isActive('/investments') ? 'nav-active' : ''}`}>
                      Client Portfolio
                    </Link>
                    <Link to="/advisor" className={`nav-link ${isActive('/advisor') ? 'nav-active' : ''}`}>
                      Advisory Insights
                    </Link>
                    <Link to="/goals" className={`nav-link ${isActive('/goals') ? 'nav-active' : ''}`}>
                      Goal Projections
                    </Link>
                  </>
                )}

                {/* Support Agent Specific Links */}
                {role === 'SUPPORT' && (
                  <>
                    <Link to="/accounts" className={`nav-link ${isActive('/accounts') ? 'nav-active' : ''}`}>
                      Masked Accounts Verification
                    </Link>
                  </>
                )}
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
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-[#082F49] hover:text-[#0E7490] hover:bg-[#BAE6FD]/30 rounded-xl relative transition-all border border-transparent hover:border-[#BAE6FD] cursor-pointer"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5 text-[#0E7490]" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#0E7490] text-white text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center shadow-md animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#F0FDFF]/95 backdrop-blur-md border-2 border-[#BAE6FD] rounded-2xl shadow-2xl z-50 overflow-hidden fade-in">
                      <div className="px-4 py-3 bg-[#BAE6FD]/30 border-b border-[#BAE6FD]/60 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-[#082F49]">Notifications</span>
                          {unreadCount > 0 ? (
                            <span className="theme-badge-rose text-[10px] font-bold px-2 py-0.5">{unreadCount} new</span>
                          ) : (
                            <span className="theme-badge-mint text-[10px] font-bold px-2 py-0.5">All read</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllRead}
                              className="text-[11px] text-[#0E7490] hover:text-[#082F49] font-bold flex items-center gap-1 cursor-pointer"
                              title="Mark all as read"
                            >
                              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                            </button>
                          )}
                          {notifications.length > 0 && (
                            <button
                              onClick={clearAllNotifications}
                              className="text-[11px] text-slate-500 hover:text-red-600 font-semibold flex items-center gap-1 cursor-pointer"
                              title="Clear all"
                            >
                              <Trash2 className="w-3 h-3" /> Clear
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-[#BAE6FD]/30">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-[#082F49]/70 space-y-1">
                            <p className="font-bold text-[#082F49]">You're all caught up!</p>
                            <p className="text-[11px] text-slate-500">No new alerts or notifications at this time.</p>
                          </div>
                        ) : (
                          notifications.map((n) => {
                            const unread = isUnread(n);
                            return (
                              <div 
                                key={n.id} 
                                className={`p-3.5 text-xs hover:bg-[#BAE6FD]/20 transition-all ${unread ? 'bg-[#BAE6FD]/30 border-l-4 border-[#0E7490]' : 'bg-[#F0FDFF]'}`}
                              >
                                <div className="flex justify-between items-start gap-2">
                                  <div className="flex items-center gap-1.5 flex-1">
                                    {unread && (
                                      <span className="w-2 h-2 rounded-full bg-[#0E7490] flex-shrink-0" />
                                    )}
                                    <span className="font-extrabold text-[#082F49] leading-snug">{n.title}</span>
                                  </div>
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    {unread && (
                                      <button 
                                        onClick={() => markNotificationRead(n.id)}
                                        className="text-[10px] text-[#0E7490] hover:text-[#082F49] font-extrabold px-1.5 py-0.5 rounded bg-white border border-[#BAE6FD] cursor-pointer"
                                      >
                                        Mark read
                                      </button>
                                    )}
                                    <button
                                      onClick={(e) => deleteNotification(n.id, e)}
                                      className="text-slate-400 hover:text-red-500 p-0.5 rounded cursor-pointer"
                                      title="Dismiss"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                                <p className="text-[#082F49]/80 font-medium mt-1 text-[11px] leading-relaxed">{n.message}</p>
                                {n.type && (
                                  <span className="mt-1.5 inline-block text-[9px] font-bold text-[#0E7490] uppercase tracking-wider">
                                    {n.type.replace('_', ' ')}
                                  </span>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Role Badge & Logout */}
                <div className="hidden sm:flex items-center gap-3 border-l-2 border-[#BAE6FD]/80 pl-3">
                  <div className="text-right">
                    <p className="text-xs font-extrabold text-[#082F49] leading-tight">{user?.fullName || 'User'}</p>
                    <span className="theme-badge uppercase text-[10px] tracking-wider font-extrabold">
                      {getRoleBadgeLabel(role)}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-[#082F49] hover:text-[#0E7490] hover:bg-[#BAE6FD]/30 rounded-xl transition-colors cursor-pointer"
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
                  className="px-4 py-2 text-xs font-extrabold text-[#082F49] hover:text-[#0E7490] transition-colors"
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
