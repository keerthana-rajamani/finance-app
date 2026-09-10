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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Financial Goals & SIP Planning</h1>
            <p className="text-xs text-slate-500 mt-1">
              Circular progress rings, monthly savings needed calculator, and mutual fund SIP recommendations
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 btn-gradient text-xs font-bold rounded-lg shadow-md transition-all"
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
              <div key={g.id} className="bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg flex flex-col justify-between hover:shadow-xl transition-shadow">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-base text-slate-900">{g.name}</h3>
                      <span className={`inline-block mt-1 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                        g.priority === 'HIGH' ? 'bg-[#DB5375]/15 text-[#DB5375] border border-[#DB5375]/30' : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {g.priority} Priority
                      </span>
                    </div>

                    {/* Animated Circular Progress Ring (FR7) with Theme Gradient */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <defs>
                          <linearGradient id={`goalGrad-${g.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#DB5375" />
                            <stop offset="100%" stopColor="#B3FFB3" />
                          </linearGradient>
                        </defs>
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
                          stroke={`url(#goalGrad-${g.id})`}
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
                    <div className="flex justify-between text-slate-800 bg-[#B3FFB3]/30 border border-[#B3FFB3]/60 p-2.5 rounded-lg font-bold">
                      <span>Monthly Savings Needed:</span>
                      <span className="text-[#a82948]">₹{Number(g.monthlySavingsNeeded).toLocaleString('en-IN')}/mo</span>
                    </div>
                  </div>

                  {/* SIP Recommendation (FR7) */}
                  <div className="mt-3 p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600 border border-slate-100">
                    <p className="font-semibold text-slate-800 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-[#DB5375]" /> Suggested SIP Vehicle:
                    </p>
                    <p className="mt-0.5 text-slate-600">{g.sipRecommendation}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3">
                  <button
                    onClick={() => {
                      setSelectedGoal(g);
                      setShowFundsModal(true);
                    }}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Create Financial Goal</h3>
            {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded mb-3">{error}</p>}
            <form onSubmit={handleCreateGoal} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dream House, Higher Education, Tesla"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Target Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="500000.00"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Current Savings (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="50000.00"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Target Date</label>
                <input
                  type="date"
                  required
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
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
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 btn-gradient rounded-lg text-xs font-bold shadow-md"
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">Contribute to {selectedGoal.name}</h3>
            <p className="text-xs text-slate-500 mb-4">
              Current: ₹{Number(selectedGoal.currentAmount).toLocaleString('en-IN')} / ₹{Number(selectedGoal.targetAmount).toLocaleString('en-IN')}
            </p>
            <form onSubmit={handleAddFunds} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Contribution Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="10000.00"
                  value={addFundsAmount}
                  onChange={(e) => setAddFundsAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFundsModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 btn-gradient rounded-lg text-xs font-bold shadow-md"
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
