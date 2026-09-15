import React, { useState, useEffect } from 'react';
import { budgetApi } from '../services/api';
import { 
  PieChart, AlertTriangle, CheckCircle, PlusCircle, 
  TrendingUp, ArrowRight, ShieldAlert, Sparkles 
} from 'lucide-react';

export default function BudgetTracker() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState('Food');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [alertAtPercent, setAlertAtPercent] = useState(80);
  const [carryForward, setCarryForward] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBudget();
  }, []);

  const loadBudget = async () => {
    setLoading(true);
    try {
      const res = await budgetApi.getSummary();
      setSummary(res.data);
    } catch (err) {
      console.error("Failed to load budget:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    setError('');

    const amt = parseFloat(budgetAmount);
    // SRS Validation: Budget Amount Required, positive decimal number ("Budget must be a positive number")
    if (isNaN(amt) || amt <= 0) {
      setError("Budget must be a positive number");
      return;
    }

    try {
      await budgetApi.saveBudget({
        category,
        budgetAmount: amt,
        alertAtPercent: parseInt(alertAtPercent, 10),
        carryForward
      });
      setShowModal(false);
      setBudgetAmount('');
      loadBudget();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update budget");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0E7490]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="theme-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#082F49]">Category Budget Tracker</h1>
            <p className="text-xs text-[#082F49]/70 mt-1 font-medium">
              Real-time spend monitoring with automated 80% and 100% threshold alerts
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-gradient text-xs py-2.5 px-4 shadow-md"
          >
            <PlusCircle className="w-4 h-4 text-white" /> Add / Edit Category Budget
          </button>
        </div>

        {/* Budget Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="theme-card p-6">
            <span className="text-xs font-semibold text-[#082F49]/70 uppercase">Total Budget Cap</span>
            <h2 className="text-3xl font-black text-[#082F49] mt-2">
              ₹{summary ? Number(summary.totalBudget).toLocaleString('en-IN') : 0}
            </h2>
            <p className="text-xs text-[#082F49]/70 mt-2 font-medium">Allocated across {summary?.categories?.length || 0} active categories</p>
          </div>

          <div className="theme-card p-6">
            <span className="text-xs font-semibold text-[#082F49]/70 uppercase">Total Recorded Spend</span>
            <h2 className="text-3xl font-black text-[#082F49] mt-2">
              ₹{summary ? Number(summary.totalSpent).toLocaleString('en-IN') : 0}
            </h2>
            <p className="text-xs text-[#082F49]/70 mt-2 font-medium">Updated live with every debit transaction</p>
          </div>

          <div className="theme-card p-6">
            <span className="text-xs font-semibold text-[#082F49]/70 uppercase">Remaining Balance</span>
            <h2 className={`text-3xl font-black mt-2 ${summary && summary.remainingBudget < 0 ? 'text-red-600' : 'text-[#0E7490]'}`}>
              ₹{summary ? Number(summary.remainingBudget).toLocaleString('en-IN') : 0}
            </h2>
            <p className="text-xs text-[#082F49]/70 mt-2 font-medium">
              {summary && summary.remainingBudget < 0 ? 'Monthly limit exceeded' : 'Available for current month'}
            </p>
          </div>
        </div>

        {/* Category Budget Detail Grid */}
        <div className="theme-card p-6">
          <h2 className="text-base font-extrabold text-[#082F49] mb-6">Category Spend Progress & Variance</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {summary?.categories?.map((c) => {
              const pct = Number(c.percent);
              const isOver = c.isOverBudget;
              const isAlert = c.isAlert && !isOver;

              return (
                <div key={c.id} className="theme-card p-5 space-y-3 floating-card hover:-translate-y-1 transition-all shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-[#082F49] text-sm">{c.category}</h3>
                      <p className="text-[11px] text-[#082F49]/60">Alert Threshold: {c.alertAtPercent}% • Rollover: {c.carryForward ? 'Enabled' : 'Disabled'}</p>
                    </div>
                    {isOver ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                        <ShieldAlert className="w-3 h-3" /> Over Budget
                      </span>
                    ) : isAlert ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <AlertTriangle className="w-3 h-3" /> 80% Warning
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#22C55E]/15 text-[#15803d] border border-[#22C55E]/30">
                        <CheckCircle className="w-3 h-3" /> On Track
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 rounded-full bg-[#BAE6FD]/40 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-red-500' : (isAlert ? 'bg-amber-500' : 'bg-[#0E7490]')}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#082F49]">
                      Spent: ₹{Number(c.spentAmount).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[#082F49]/70">
                      Limit: ₹{Number(c.budgetAmount).toLocaleString('en-IN')} ({pct}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#F0FDFF] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#BAE6FD] relative overflow-hidden fade-in floating-card">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0E7490]"></div>
            <h3 className="text-lg font-extrabold text-[#082F49] mb-4 mt-1">Configure Category Budget</h3>
            {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded mb-3 border border-red-200">{error}</p>}
            <form onSubmit={handleSaveBudget} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#082F49] mb-1">Expense Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-[#BAE6FD] rounded-xl text-xs bg-[#F0FDFF] text-[#082F49] font-medium focus:outline-none focus:border-[#0E7490]"
                >
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Education">Education</option>
                  <option value="Investment">Investment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#082F49] mb-1">Monthly Budget (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="12000.00"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  className="w-full px-3.5 py-2 border border-[#BAE6FD] rounded-xl text-sm bg-[#F0FDFF] text-[#082F49] font-medium focus:outline-none focus:border-[#0E7490]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#082F49] mb-1">Alert Threshold (%)</label>
                <input
                  type="number"
                  value={alertAtPercent}
                  onChange={(e) => setAlertAtPercent(e.target.value)}
                  className="w-full px-3.5 py-2 border border-[#BAE6FD] rounded-xl text-sm bg-[#F0FDFF] text-[#082F49] font-medium focus:outline-none focus:border-[#0E7490]"
                  min="50"
                  max="100"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="carryForward"
                  checked={carryForward}
                  onChange={(e) => setCarryForward(e.target.checked)}
                  className="rounded text-[#0E7490] focus:ring-[#0E7490]"
                />
                <label htmlFor="carryForward" className="text-xs text-[#082F49] font-bold">
                  Carry forward unused budget to next month
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-gradient-outline px-4 py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient px-4 py-2 text-xs font-bold shadow-md"
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
