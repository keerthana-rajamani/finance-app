import React, { useState, useEffect } from 'react';
import { userApi } from '../services/api';
import { Users, UserPlus, Shield, Trash2, CheckCircle } from 'lucide-react';

export default function FamilyFinance() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('SPOUSE');
  const [accessScope, setAccessScope] = useState('SHARED_BUDGET');

  // Split Expense Calculator state
  const [splitAmount, setSplitAmount] = useState('');
  const [splitCount, setSplitCount] = useState(2);
  const [splitResult, setSplitResult] = useState(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const res = await userApi.getFamily();
      setMembers(res.data || []);
    } catch (e) {
      console.error("Failed to load family members:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await userApi.inviteFamily({
        memberName: name,
        memberEmail: email,
        relationship,
        accessScope
      });
      setShowModal(false);
      setName('');
      setEmail('');
      loadMembers();
    } catch (err) {
      alert("Failed to invite family member");
    }
  };

  const handleRevoke = async (id) => {
    if (window.confirm("Are you sure you want to revoke access? Access is cut off immediately.")) {
      try {
        await userApi.revokeFamily(id);
        loadMembers();
      } catch (err) {
        alert("Failed to revoke access");
      }
    }
  };

  const calculateSplit = (e) => {
    e.preventDefault();
    const total = parseFloat(splitAmount);
    if (!isNaN(total) && splitCount > 0) {
      setSplitResult((total / splitCount).toFixed(2));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="theme-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Family Finance & Shared Budgets</h1>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Household multi-user collaboration (up to 5 family members) with granular role-based permissions
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-gradient text-xs font-extrabold"
          >
            <UserPlus className="w-4 h-4 text-white" /> Invite Family Member
          </button>
        </div>

        {/* Family Members Grid */}
        <div className="theme-card p-6 space-y-4">
          <h2 className="text-base font-extrabold text-slate-900">Active Family Member Access</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {members.map((m) => (
              <div key={m.id} className="theme-card p-5 shadow-sm flex flex-col justify-between floating-card hover:-translate-y-1 transition-all">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">{m.memberName}</h3>
                      <p className="text-xs text-slate-600">{m.memberEmail}</p>
                    </div>
                    <span className={m.status === 'ACTIVE' ? 'theme-badge-mint' : 'theme-badge-rose'}>
                      {m.status}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-700 font-medium">
                    <p>Relationship: <strong className="text-slate-900 font-bold">{m.relationship}</strong></p>
                    <p>Permission Scope: <strong className="text-[#a82948] font-bold">{m.accessScope}</strong></p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  {m.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleRevoke(m.id)}
                      className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-[#a82948] rounded-xl text-xs font-bold border border-rose-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Revoke Immediate Access
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Split Calculator (FR12) */}
        <div className="theme-card p-6 space-y-4">
          <h2 className="text-base font-extrabold text-slate-900">Family Expense Split Calculator</h2>
          <form onSubmit={calculateSplit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs items-end">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Total Expense Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="4500.00"
                value={splitAmount}
                onChange={(e) => setSplitAmount(e.target.value)}
                className="theme-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Number of People</label>
              <input
                type="number"
                min="2"
                max="10"
                value={splitCount}
                onChange={(e) => setSplitCount(parseInt(e.target.value, 10))}
                className="theme-input"
              />
            </div>

            <button
              type="submit"
              className="btn-gradient w-full h-[42px] text-xs font-extrabold"
            >
              Compute Equitable Share
            </button>
          </form>

          {splitResult && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-semibold flex items-center justify-between">
              <span>Each member's equitable share:</span>
              <strong className="text-base font-black text-[#DB5375]">₹{splitResult}</strong>
            </div>
          )}
        </div>
      </div>

      {/* INVITE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-white/95 backdrop-blur-md rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-white/80 overflow-hidden fade-in floating-card">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#DB5375]" />
            <h3 className="text-xl font-extrabold text-slate-900 mb-4">Invite Family Member</h3>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Sarah Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="theme-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="sarah@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="theme-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Relationship</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="theme-input"
                  >
                    <option value="SPOUSE">Spouse</option>
                    <option value="CHILD">Child / Dependent</option>
                    <option value="PARENT">Parent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Access Scope</label>
                  <select
                    value={accessScope}
                    onChange={(e) => setAccessScope(e.target.value)}
                    className="theme-input"
                  >
                    <option value="SHARED_BUDGET">Shared Budget Only</option>
                    <option value="VIEW_ONLY">View-Only All Accounts</option>
                    <option value="FULL">Full Co-Owner</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-gradient-outline text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient text-xs px-5 py-2 font-extrabold"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
