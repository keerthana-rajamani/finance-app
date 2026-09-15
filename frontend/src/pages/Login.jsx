import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import { Lock, Mail, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login({ email, password });
      loginUser(response.data);

      // Redirect to role-specific dashboard from JWT role claim (Appendix I)
      navigate('/dashboard');
    } catch (err) {
      // SRS specified exact error: "Invalid credentials. Please check your email and password."
      setError("Invalid credentials. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-transparent px-4 py-12">
      <div className="theme-card max-w-md w-full overflow-hidden fade-in floating-card">
        <div className="h-1.5 w-full bg-[#DB5375]" />
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900">Sign in to your account</h2>
            <p className="text-xs text-slate-600 font-medium mt-1">Access your consolidated financial dashboard</p>
          </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Email / Username</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#DB5375] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="theme-input pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#DB5375] absolute left-3 top-3" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="theme-input pl-9 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gradient w-full py-3 text-sm font-extrabold"
          >
            {loading ? "Authenticating..." : (
              <>
                <LogIn className="w-4 h-4 text-white" /> Login
              </>
            )}
          </button>
        </form>

        {/* Demo Role Switcher */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <p className="text-xs font-extrabold text-[#DB5375] uppercase tracking-wider text-center mb-3">
            Quick Demo Accounts (Click to Fill)
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => fillDemo('john@example.com', 'Password@123')}
              className="p-2.5 bg-white/95 hover:bg-rose-50 text-slate-900 rounded-xl font-bold text-left border border-slate-200 hover:border-[#DB5375]/40 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              Primary User
              <span className="block text-[10px] text-[#DB5375] font-semibold">Full Financials</span>
            </button>
            <button
              onClick={() => fillDemo('advisor@example.com', 'Password@123')}
              className="p-2.5 bg-white/95 hover:bg-rose-50 text-slate-900 rounded-xl font-bold text-left border border-slate-200 hover:border-[#DB5375]/40 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              Financial Advisor
              <span className="block text-[10px] text-[#DB5375] font-semibold">Read-only Portfolio</span>
            </button>
            <button
              onClick={() => fillDemo('support@example.com', 'Password@123')}
              className="p-2.5 bg-white/95 hover:bg-rose-50 text-slate-900 rounded-xl font-bold text-left border border-slate-200 hover:border-[#DB5375]/40 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              Support Agent
              <span className="block text-[10px] text-[#DB5375] font-semibold">Masked Data Access</span>
            </button>
            <button
              onClick={() => fillDemo('sarah@example.com', 'Password@123')}
              className="p-2.5 bg-white/95 hover:bg-rose-50 text-slate-900 rounded-xl font-bold text-left border border-slate-200 hover:border-[#DB5375]/40 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              Family Member
              <span className="block text-[10px] text-[#DB5375] font-semibold">Shared Budget Access</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-600 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#a82948] hover:text-[#DB5375] font-extrabold underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  </div>
  );
}
