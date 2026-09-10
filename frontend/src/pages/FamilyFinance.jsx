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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Family Finance & Shared Budgets</h1>
            <p className="text-xs text-slate-500 mt-1">
              Household multi-user collaboration (up to 5 family members) with granular role-based permissions
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 btn-gradient text-xs font-bold rounded-lg shadow-md transition-all"
          >
            <UserPlus className="w-4 h-4 text-slate-900" /> Invite Family Member
          </button>
        </div>

        {/* Family Members Grid */}
        <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg space-y-4">
          <h2 className="text-base font-bold text-slate-900">Active Family Member Access</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {members.map((m) => (
              <div key={m.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{m.memberName}</h3>
                      <p className="text-xs text-slate-500">{m.memberEmail}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      m.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {m.status}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-slate-600">
                    <p>Relationship: <strong className="text-slate-800">{m.relationship}</strong></p>
                    <p>Permission Scope: <strong className="text-emerald-700">{m.accessScope}</strong></p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200">
                  {m.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleRevoke(m.id)}
                      className="w-full py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
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
        <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg space-y-4">
          <h2 className="text-base font-bold text-slate-900">Family Expense Split Calculator</h2>
          <form onSubmit={calculateSplit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs items-end">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Total Expense Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="4500.00"
                value={splitAmount}
                onChange={(e) => setSplitAmount(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Number of People</label>
              <input
                type="number"
                min="2"
                max="10"
                value={splitCount}
                onChange={(e) => setSplitCount(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-4 btn-gradient rounded-lg font-bold text-xs shadow-md transition-all"
            >
              Compute Equitable Share
            </button>
          </form>

          {splitResult && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
              Each member's equal share is: <strong className="text-base text-emerald-900">₹{splitResult}</strong>
            </div>
          )}
        </div>
      </div>

      {/* INVITE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Invite Family Member</h3>
            <form onSubmit={handleInvite} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Sarah Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="sarah@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Relationship</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="SPOUSE">Spouse</option>
                    <option value="CHILD">Child / Dependent</option>
                    <option value="PARENT">Parent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Access Scope</label>
                  <select
                    value={accessScope}
                    onChange={(e) => setAccessScope(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="SHARED_BUDGET">Shared Budget Only</option>
                    <option value="VIEW_ONLY">View-Only All Accounts</option>
                    <option value="FULL">Full Co-Owner</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 btn-gradient rounded-lg text-xs font-bold shadow-md"
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
