import React, { useState, useEffect } from 'react';
import { billApi } from '../services/api';
import { Calendar as CalendarIcon, PlusCircle, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Bills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Utilities');
  const [amount, setAmount] = useState('');
  const [dueDay, setDueDay] = useState(15);
  const [recurrence, setRecurrence] = useState('MONTHLY');
  const [error, setError] = useState('');

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    setLoading(true);
    try {
      const res = await billApi.getAll();
      setBills(res.data || []);
    } catch (e) {
      console.error("Failed to load bills:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBill = async (e) => {
    e.preventDefault();
    setError('');

    const amt = parseFloat(amount);
    // SRS Validation: Bill Amount Required, positive decimal number ("Bill amount must be a positive number")
    if (isNaN(amt) || amt <= 0) {
      setError("Bill amount must be a positive number");
      return;
    }

    try {
      await billApi.addBill({
        name,
        category,
        amount: amt,
        dueDay: parseInt(dueDay, 10),
        recurrence
      });
      setShowModal(false);
      setName('');
      setAmount('');
      loadBills();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add bill");
    }
  };

  const handlePayBill = async (id) => {
    try {
      await billApi.payBill(id);
      loadBills();
    } catch (err) {
      alert("Failed to record bill payment");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
      </div>
    );
  }

  // Days in month simulation for 30-day bill calendar
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Recurring Bill Manager & Calendar</h1>
            <p className="text-xs text-slate-500 mt-1">
              Automated 3-day and 1-day reminders with 1-tap payment settlement and credit score impact tracking
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#DB5375] hover:bg-[#c53e61] text-white text-xs font-semibold rounded-lg shadow-md shadow-[#DB5375]/25 transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Add Recurring Bill
          </button>
        </div>

        {/* 30-Day Monthly Calendar View (FR8) */}
        <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">30-Day Upcoming Bill Calendar</h2>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-7 lg:grid-cols-10 gap-2">
            {daysInMonth.map((day) => {
              const dayBills = bills.filter(b => b.dueDay === day);
              const hasPending = dayBills.some(b => b.status === 'PENDING');

              return (
                <div
                  key={day}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    dayBills.length > 0
                      ? hasPending
                        ? 'bg-amber-50 border-amber-300 font-bold text-amber-900 shadow-sm'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-slate-50 border-slate-100 text-slate-400'
                  }`}
                >
                  <span className="text-xs block">{day}</span>
                  {dayBills.length > 0 && (
                    <div className="mt-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bills List */}
        <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg space-y-4">
          <h2 className="text-base font-bold text-slate-900">All Configured Recurring Bills</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bills.map((b) => {
              const isPaid = b.status === 'PAID';

              return (
                <div key={b.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-sm text-slate-900">{b.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1 text-xs text-slate-600">
                      <p>Category: <strong className="text-slate-800">{b.category}</strong></p>
                      <p>Due Day: <strong className="text-slate-800">{b.dueDay}th of month</strong> ({b.recurrence})</p>
                      <p className="text-lg font-extrabold text-slate-900 mt-2">
                        ₹{Number(b.amount).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200">
                    {!isPaid ? (
                      <button
                        onClick={() => handlePayBill(b.id)}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4" /> Mark as Paid (Auto-Debit)
                      </button>
                    ) : (
                      <span className="block text-center text-xs text-emerald-700 font-semibold py-1">
                        ✓ Paid for this cycle
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ADD BILL MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add Recurring Bill</h3>
            {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded mb-3">{error}</p>}
            <form onSubmit={handleAddBill} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Bill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bescom Electricity, Airtel Fiber, Gym"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="1450.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Utilities">Utilities</option>
                    <option value="Subscription">Subscription</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Rent">Rent</option>
                    <option value="Insurance">Insurance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Due Day (1-31)</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={dueDay}
                    onChange={(e) => setDueDay(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
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
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700"
                >
                  Save Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
