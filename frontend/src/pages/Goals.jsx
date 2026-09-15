import React, { useState, useEffect } from 'react';
import { goalApi } from '../services/api';
import { Target, PlusCircle, TrendingUp, Award, Calendar, CheckCircle2 } from 'lucide-react';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [priority, setPriority] = useState('HIGH');
  const [error, setError] = useState('');

  // Add funds modal
  const [showFundsModal, setShowFundsModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [addFundsAmount, setAddFundsAmount] = useState('');

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    setLoading(true);
    try {
      const res = await goalApi.getGoals();
      setGoals(res.data || []);
    } catch (e) {
      console.error("Failed to load goals:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    setError('');

    const target = parseFloat(targetAmount);
    const cur = currentAmount ? parseFloat(currentAmount) : 0;

    // SRS Validation: Goal Target Positive, must exceed current savings amount ("Target amount must exceed current savings")
    if (isNaN(target) || target <= 0 || target <= cur) {
      setError("Target amount must exceed current savings");
      return;
    }

    try {
      await goalApi.createGoal({
        name,
        targetAmount: target,
        currentAmount: cur,
        targetDate: targetDate || null,
        priority
      });
      setShowModal(false);
      setName('');
      setTargetAmount('');
      setCurrentAmount('');
      loadGoals();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create goal");
    }
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    if (!selectedGoal || !addFundsAmount) return;

    const added = parseFloat(addFundsAmount);
    const newTotal = (Number(selectedGoal.currentAmount) || 0) + added;

    try {
      await goalApi.updateGoal(selectedGoal.id, {
        currentAmount: newTotal
      });
      setShowFundsModal(false);
      setAddFundsAmount('');
      loadGoals();
    } catch (err) {
      alert("Failed to update goal funds");
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
            <h1 className="text-2xl font-extrabold text-slate-900">Financial Goals & SIP Planning</h1>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Circular progress rings, monthly savings needed calculator, and mutual fund SIP recommendations
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-gradient text-xs py-2.5 px-4 shadow-md"
          >
            <PlusCircle className="w-4 h-4 text-slate-900" /> Create New Goal
          </button>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goals.map((g) => {
            const pct = Math.min(Math.round(Number(g.progressPercent)), 100);
            const radius = 45;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (pct / 100) * circumference;

            return (
              <div key={g.id} className="theme-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">{g.name}</h3>
                      <span className={`inline-block mt-1 text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full ${
                        g.priority === 'HIGH' ? 'bg-[#DB5375]/20 text-[#89233c] border border-[#DB5375]/35' : 'bg-[#B3FFB3]/50 text-slate-900 border border-[#B3FFB3]'
                      }`}>
                        {g.priority} Priority
                      </span>
                    </div>

                    {/* Circular Progress Ring with Solid Theme Color */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r={radius}
                          stroke="#f1f5f9"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r={radius}
                          stroke="#DB5375"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-sm font-black text-slate-800">{pct}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Stats */}
                  <div className="space-y-2 py-3 border-y border-slate-100 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Saved so far:</span>
                      <strong className="text-slate-900">₹{Number(g.currentAmount).toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Target Amount:</span>
                      <strong className="text-slate-900">₹{Number(g.targetAmount).toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Target Date:</span>
                      <strong className="text-slate-900">{g.targetDate} ({g.monthsRemaining} mos)</strong>
                    </div>
                    <div className="flex justify-between text-slate-800 bg-rose-50 border border-rose-100 p-2.5 rounded-lg font-bold">
                      <span>Monthly Savings Needed:</span>
                      <span className="text-[#DB5375]">₹{Number(g.monthlySavingsNeeded).toLocaleString('en-IN')}/mo</span>
                    </div>
                  </div>

                  {/* SIP Recommendation (FR7) */}
                  <div className="mt-3 p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600 border border-slate-100">
                    <p className="font-semibold text-slate-800 flex items-center gap-1">
                      <TrendingUp className="w-3 text-[#DB5375]" /> Suggested SIP Vehicle:
                    </p>
                    <p className="mt-0.5 text-slate-600">{g.sipRecommendation}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedGoal(g);
                      setShowFundsModal(true);
                    }}
                    className="w-full py-2 btn-gradient-outline text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" /> Add Savings to Goal
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CREATE GOAL MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-white/80 relative overflow-hidden fade-in floating-card">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#DB5375]"></div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-4 mt-1">Create Financial Goal</h3>
            {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded mb-3 border border-red-200">{error}</p>}
            <form onSubmit={handleCreateGoal} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dream House, Higher Education, Tesla"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 border-2 border-[#DB5375]/30 rounded-xl text-sm bg-white text-slate-900 font-medium focus:outline-none focus:border-[#DB5375]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="500000.00"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full px-3.5 py-2 border-2 border-[#DB5375]/30 rounded-xl text-sm bg-white text-slate-900 font-medium focus:outline-none focus:border-[#DB5375]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Savings (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="50000.00"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  className="w-full px-3.5 py-2 border-2 border-[#DB5375]/30 rounded-xl text-sm bg-white text-slate-900 font-medium focus:outline-none focus:border-[#DB5375]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Date</label>
                <input
                  type="date"
                  required
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3.5 py-2 border-2 border-[#DB5375]/30 rounded-xl text-sm bg-white text-slate-900 font-medium focus:outline-none focus:border-[#DB5375]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-[#DB5375]/30 rounded-xl text-xs bg-white text-slate-900 font-medium focus:outline-none focus:border-[#DB5375]"
                >
                  <option value="HIGH">High Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="LOW">Low Priority</option>
                </select>
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
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD FUNDS MODAL */}
      {showFundsModal && selectedGoal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl max-w-sm w-full p-6 shadow-2xl border-2 border-white/80 relative overflow-hidden fade-in floating-card">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#DB5375]"></div>
            <h3 className="text-base font-extrabold text-slate-900 mb-2 mt-1">Contribute to {selectedGoal.name}</h3>
            <p className="text-xs text-slate-600 mb-4 font-medium">
              Current: ₹{Number(selectedGoal.currentAmount).toLocaleString('en-IN')} / ₹{Number(selectedGoal.targetAmount).toLocaleString('en-IN')}
            </p>
            <form onSubmit={handleAddFunds} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contribution Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="10000.00"
                  value={addFundsAmount}
                  onChange={(e) => setAddFundsAmount(e.target.value)}
                  className="w-full px-3.5 py-2 border-2 border-[#DB5375]/30 rounded-xl text-sm bg-white text-slate-900 font-medium focus:outline-none focus:border-[#DB5375]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFundsModal(false)}
                  className="btn-gradient-outline px-4 py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient px-4 py-2 text-xs font-bold shadow-md"
                >
                  Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
