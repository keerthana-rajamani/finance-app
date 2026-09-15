import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';
import { User, Mail, Phone, Lock, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Register() {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('USER');
  const [password, setPassword] = useState('');
  const [panNumber, setPanNumber] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    setError('');

    // Validation rules from Appendix C:
    // Name: Required, alphabetic characters and spaces only, 2-100 characters
    if (!fullName || !/^[a-zA-Z\s]{2,100}$/.test(fullName.trim())) {
      setError("Name must not contain numbers or special characters");
      return;
    }

    // Phone: Required, exactly 10 consecutive numeric digits
    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber.trim())) {
      setError("Phone Number must be exactly 10 digits long");
      return;
    }

    setStep(2);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Password validation: minimum 8 chars with uppercase, lowercase, digit, special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must meet security requirements (at least 8 characters, uppercase, lowercase, digit, and special symbol)");
      return;
    }

    setLoading(true);

    try {
      await authApi.register({
        fullName: fullName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        password,
        role,
        panNumber: panNumber ? panNumber.trim().toUpperCase() : null
      });

      setSuccess("Registration successful! Please verify your email.");
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please review your details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-transparent px-4 py-12">
      <div className="theme-card max-w-md w-full overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#DB5375] via-[#ff7c9b] to-[#B3FFB3]" />
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900">Create an Account</h2>
            <p className="text-xs text-slate-600 font-medium mt-1">Multi-step secure onboarding with banking standards</p>
            <div className="flex justify-center items-center gap-2 mt-4">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${step >= 1 ? 'bg-gradient-to-r from-[#DB5375] to-[#B3FFB3] text-slate-900 shadow-sm border border-white/60' : 'bg-slate-200 text-slate-600'}`}>1</span>
              <span className="w-10 h-0.5 bg-[#DB5375]/30"></span>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${step === 2 ? 'bg-gradient-to-r from-[#DB5375] to-[#B3FFB3] text-slate-900 shadow-sm border border-white/60' : 'bg-slate-200 text-slate-600'}`}>2</span>
            </div>
          </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-[#B3FFB3]/40 border-2 border-[#DB5375]/30 rounded-xl flex items-center gap-2 text-slate-900 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#DB5375]" />
            <span>{success}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleNext} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Full Name (Alphabetic only)</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#DB5375] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="theme-input pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#DB5375] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="theme-input pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Phone Number (10 digits)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#DB5375] absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="9876543210"
                  className="theme-input pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="theme-input"
              >
                <option value="USER">Primary User</option>
                <option value="FAMILY_MEMBER">Family Member</option>
                <option value="FINANCIAL_ADVISOR">Financial Advisor</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn-gradient w-full py-3 text-sm font-extrabold"
            >
              Continue to Step 2
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#DB5375] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 chars, Uppercase, Digit & Symbol"
                  className="theme-input pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">PAN Number (Optional for Tax Features)</label>
              <div className="relative">
                <FileText className="w-4 h-4 text-[#DB5375] absolute left-3 top-3" />
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  className="theme-input pl-9 uppercase"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Stored as a one-way SHA-256 hash according to data protection rules.</p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-gradient-outline w-1/3 py-2.5 text-xs font-bold"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-gradient w-2/3 py-2.5 text-xs font-extrabold disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Register"}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-slate-600 font-medium">
          Already registered?{' '}
          <Link to="/login" className="text-[#a82948] hover:text-[#DB5375] font-extrabold underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  </div>
  );
}
