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
      <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 overflow-hidden">
        <div className="h-1.5 w-full bg-[#DB5375]" />
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Sign in to your account</h2>
            <p className="text-xs text-slate-500 mt-1">Access your consolidated financial dashboard</p>
          </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-xs font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email / Username</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DB5375] focus:border-[#DB5375] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DB5375] focus:border-[#DB5375] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#DB5375] hover:bg-[#c53e61] text-white text-sm font-bold rounded-lg shadow-md shadow-[#DB5375]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider text-center mb-3">
            Quick Demo Accounts (Click to Fill)
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => fillDemo('john@example.com', 'Password@123')}
              className="p-2 bg-rose-50 hover:bg-rose-100 text-slate-900 rounded font-bold text-left border border-rose-200"
            >
              Primary User
              <span className="block text-[10px] text-[#DB5375] font-semibold">Full Financials</span>
            </button>
            <button
              onClick={() => fillDemo('advisor@example.com', 'Password@123')}
              className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded font-medium text-left border border-blue-200"
            >
              Financial Advisor
              <span className="block text-[10px] text-blue-600 font-normal">Read-only Portfolio</span>
            </button>
            <button
              onClick={() => fillDemo('support@example.com', 'Password@123')}
              className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded font-medium text-left border border-amber-200"
            >
              Support Agent
              <span className="block text-[10px] text-amber-600 font-normal">Masked Data Access</span>
            </button>
            <button
              onClick={() => fillDemo('sarah@example.com', 'Password@123')}
              className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded font-medium text-left border border-purple-200"
            >
              Family Member
              <span className="block text-[10px] text-purple-600 font-normal">Shared Budget Access</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#DB5375] hover:text-[#aa2f4e] font-semibold">
            Register now
          </Link>
        </div>
      </div>
    </div>
  </div>
  );
}
