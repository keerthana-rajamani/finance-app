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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0E7490]"></div>
      </div>
    );
  }

  // Days in month simulation for 30-day bill calendar
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="theme-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#082F49]">Recurring Bill Manager & Calendar</h1>
            <p className="text-xs text-[#082F49]/70 mt-1 font-medium">
              Automated 3-day and 1-day reminders with 1-tap payment settlement and credit score impact tracking
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-gradient text-xs py-2.5 px-4 shadow-md"
          >
            <PlusCircle className="w-4 h-4 text-white" /> Add Recurring Bill
          </button>
        </div>

        {/* 30-Day Monthly Calendar View (FR8) */}
        <div className="theme-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#0E7490]" />
            <h2 className="text-base font-extrabold text-[#082F49]">30-Day Upcoming Bill Calendar</h2>
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
                        ? 'bg-[#BAE6FD]/40 border-2 border-[#0E7490] font-black text-[#0E7490] shadow-xs'
                        : 'bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#15803d] font-extrabold'
                      : 'bg-[#F0FDFF] border border-[#BAE6FD]/70 text-[#082F49]/70'
                  }`}
                >
                  <span className="text-xs block font-bold">{day}</span>
                  {dayBills.length > 0 && (
                    <div className="mt-1">
                      <span className={`inline-block w-2 h-2 rounded-full ${hasPending ? 'bg-[#0E7490]' : 'bg-[#22C55E]'}`}></span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bills List */}
        <div className="theme-card p-6 space-y-4">
          <h2 className="text-base font-extrabold text-[#082F49]">All Configured Recurring Bills</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bills.map((b) => {
              const isPaid = b.status === 'PAID';

              return (
                <div key={b.id} className="theme-card p-5 flex flex-col justify-between shadow-md floating-card hover:-translate-y-1 transition-all">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-extrabold text-sm text-[#082F49]">{b.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isPaid ? 'theme-badge-mint' : 'theme-badge-rose'
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1 text-xs text-[#082F49]/80">
                      <p>Category: <strong className="text-[#082F49]">{b.category}</strong></p>
                      <p>Due Day: <strong className="text-[#082F49]">{b.dueDay}th of month</strong> ({b.recurrence})</p>
                      <p className="text-lg font-black text-[#082F49] mt-2">
                        ₹{Number(b.amount).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#BAE6FD]/40">
                    {!isPaid ? (
                      <button
                        onClick={() => handlePayBill(b.id)}
                        className="w-full py-2 btn-gradient rounded-lg text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4 text-white" /> Mark as Paid (Auto-Debit)
                      </button>
                    ) : (
                      <span className="block text-center text-xs text-[#15803d] font-bold py-1 bg-[#22C55E]/15 rounded-lg border border-[#22C55E]/30">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#F0FDFF] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#BAE6FD] relative overflow-hidden fade-in floating-card">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0E7490]"></div>
            <h3 className="text-lg font-extrabold text-[#082F49] mb-4 mt-1">Add Recurring Bill</h3>
            {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded mb-3 border border-red-200">{error}</p>}
            <form onSubmit={handleAddBill} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#082F49] mb-1">Bill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bescom Electricity, Airtel Fiber, Gym"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-[#BAE6FD] rounded-xl text-sm bg-[#F0FDFF] text-[#082F49] font-medium focus:outline-none focus:border-[#0E7490]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#082F49] mb-1">Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="1450.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2 border border-[#BAE6FD] rounded-xl text-sm bg-[#F0FDFF] text-[#082F49] font-medium focus:outline-none focus:border-[#0E7490]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#082F49] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-[#BAE6FD] rounded-xl text-xs bg-[#F0FDFF] text-[#082F49] font-medium focus:outline-none focus:border-[#0E7490]"
                  >
                    <option value="Utilities">Utilities</option>
                    <option value="Subscription">Subscription</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Rent">Rent</option>
                    <option value="Insurance">Insurance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#082F49] mb-1">Due Day (1-31)</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={dueDay}
                    onChange={(e) => setDueDay(e.target.value)}
                    className="w-full px-3.5 py-2 border border-[#BAE6FD] rounded-xl text-sm bg-[#F0FDFF] text-[#082F49] font-medium focus:outline-none focus:border-[#0E7490]"
                  />
                </div>
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
