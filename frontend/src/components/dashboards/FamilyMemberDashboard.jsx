import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, TrendingUp, Scale, Calendar, Users, ShieldCheck } from 'lucide-react';

export default function FamilyMemberDashboard({ user, budgetSummary, upcomingBills, transactions }) {
  const [splitAmount, setSplitAmount] = useState('3600');
  const [splitCount, setSplitCount] = useState(3);
  const [splitDescription, setSplitDescription] = useState('Weekend Groceries');
  const [recentSplits, setRecentSplits] = useState([
    { id: 1, desc: 'Costco Wholesale Groceries', total: 4500, count: 3, share: 1500, paidBy: 'John Doe', date: 'Yesterday' },
    { id: 2, desc: 'Electricity & High-Speed WiFi', total: 2800, count: 2, share: 1400, paidBy: 'Sarah Doe', date: '3 days ago' },
    { id: 3, desc: 'Family Weekend Dining', total: 2100, count: 3, share: 700, paidBy: 'John Doe', date: 'Last Saturday' }
  ]);

  const computedShare = (parseFloat(splitAmount) / splitCount).toFixed(2);
  const totalSharedBudget = budgetSummary?.totalBudget || 45000;
  const totalSharedSpent = budgetSummary?.totalSpent || 28400;
  const budgetPct = Math.min(100, Math.round((totalSharedSpent / totalSharedBudget) * 100));

  const handleAddSharedSplit = (e) => {
    e.preventDefault();
    const tot = parseFloat(splitAmount);
    if (!isNaN(tot) && splitCount > 0) {
      const share = (tot / splitCount).toFixed(2);
      const newEntry = {
        id: Date.now(),
        desc: splitDescription || 'Shared Household Bill',
        total: tot,
        count: splitCount,
        share: parseFloat(share),
        paidBy: user?.fullName || 'Sarah Doe',
        date: 'Just now'
      };
      setRecentSplits([newEntry, ...recentSplits]);
      alert(`Split recorded! Each member's equitable share is ₹${share}`);
    }
  };

  return (
    <div className="space-y-8 fade-in">
      {/* Welcome Header */}
      <div className="theme-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#082F49]">Household Shared Finance</h1>
            <span className="theme-badge-mint text-[10px] font-extrabold uppercase px-2.5 py-1">
              Family Member
            </span>
          </div>
          <p className="text-xs text-[#082F49]/70 font-medium mt-1">
            Collaborative household budget management & equitable expense splitting • Primary User: John Doe
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/budget" className="btn-gradient text-xs py-2 px-4 shadow-sm">
            <PieChart className="w-4 h-4" /> View Shared Budgets
          </Link>
          <Link to="/family" className="btn-gradient-outline text-xs py-2 px-4">
            <Users className="w-4 h-4" /> Family Settings
          </Link>
        </div>
      </div>

      {/* 4 Role-Specific KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="theme-card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-[#082F49]/70 uppercase tracking-wider">Household Budget Pool</p>
              <h3 className="text-2xl font-black text-[#082F49] mt-1">₹{Number(totalSharedBudget).toLocaleString('en-IN')}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#BAE6FD]/40 border border-[#BAE6FD] flex items-center justify-center text-[#0E7490] shadow-xs">
              <PieChart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-[#082F49]/70 font-medium pt-2 border-t border-[#BAE6FD]/50">
            Groceries, Utilities & Household Essentials
          </div>
        </div>

        <div className="theme-card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-[#082F49]/70 uppercase tracking-wider">Month-to-Date Spend</p>
              <h3 className="text-2xl font-black text-[#082F49] mt-1">₹{Number(totalSharedSpent).toLocaleString('en-IN')}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#BAE6FD]/40 border border-[#BAE6FD] flex items-center justify-center text-[#0E7490] shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-[#082F49]/70 font-medium pt-2 border-t border-[#BAE6FD]/50">
            <strong className="text-[#0E7490]">{budgetPct}% utilized</strong> • ₹{Number(totalSharedBudget - totalSharedSpent).toLocaleString('en-IN')} remaining
          </div>
        </div>

        <div className="theme-card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-[#082F49]/70 uppercase tracking-wider">Active Split Expenses</p>
              <h3 className="text-2xl font-black text-[#082F49] mt-1">{recentSplits.length} Pending</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#BAE6FD]/40 border border-[#BAE6FD] flex items-center justify-center text-[#0E7490] shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-[#082F49]/70 font-medium pt-2 border-t border-[#BAE6FD]/50">
            Equitable multi-member split enabled
          </div>
        </div>

        <div className="theme-card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-[#082F49]/70 uppercase tracking-wider">Shared Household Bills</p>
              <h3 className="text-2xl font-black text-[#082F49] mt-1">{upcomingBills.length} Due Soon</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#BAE6FD]/40 border border-[#BAE6FD] flex items-center justify-center text-[#0E7490] shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-[#082F49]/70 font-medium pt-2 border-t border-[#BAE6FD]/50">
            Next: {upcomingBills[0]?.name || 'Bescom Electricity Bill'}
          </div>
        </div>
      </div>

      {/* 2-Column Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Expense Split Calculator & Shared Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Split Expense Calculator */}
          <div className="theme-card p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#0E7490]" />
                <h2 className="text-base font-extrabold text-[#082F49]">Instant Household Expense Splitter</h2>
              </div>
              <span className="theme-badge text-[10px] font-bold">FR12 Fair Share</span>
            </div>

            <form onSubmit={handleAddSharedSplit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs items-end bg-[#F0FDFF]/80 p-4 rounded-2xl border border-[#BAE6FD]/70 shadow-xs">
              <div>
                <label className="block font-bold text-[#082F49] mb-1">Expense Description</label>
                <input
                  type="text"
                  required
                  value={splitDescription}
                  onChange={(e) => setSplitDescription(e.target.value)}
                  placeholder="e.g. Weekend Groceries"
                  className="theme-input"
                />
              </div>
              <div>
                <label className="block font-bold text-[#082F49] mb-1">Total Bill Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={splitAmount}
                  onChange={(e) => setSplitAmount(e.target.value)}
                  placeholder="3600.00"
                  className="theme-input"
                />
              </div>
              <div>
                <label className="block font-bold text-[#082F49] mb-1">Number of People</label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={splitCount}
                  onChange={(e) => setSplitCount(parseInt(e.target.value, 10))}
                  className="theme-input"
                />
              </div>
              <div className="sm:col-span-3 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-xs text-[#082F49]">
                  Each member pays: <strong className="text-base font-black text-[#0E7490]">₹{computedShare}</strong>
                </div>
                <button type="submit" className="btn-gradient text-xs py-2 px-5 font-extrabold cursor-pointer">
                  Record Split & Notify Household
                </button>
              </div>
            </form>

            {/* Recent Shared Splits Stream */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-extrabold text-[#082F49] uppercase tracking-wider">Recent Shared Splits</h3>
              <div className="divide-y divide-[#BAE6FD]/40">
                {recentSplits.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between items-center text-xs hover:bg-[#BAE6FD]/15 px-2 rounded-xl transition-colors">
                    <div>
                      <p className="font-extrabold text-[#082F49]">{item.desc}</p>
                      <p className="text-[11px] text-[#082F49]/70 font-medium">
                        Paid by <strong className="text-[#082F49]">{item.paidBy}</strong> • {item.count} people split • {item.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-[#0E7490]">₹{item.share.toLocaleString('en-IN')} / share</p>
                      <span className="theme-badge-mint text-[10px] font-bold">Total: ₹{item.total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shared Household Spending Stream */}
          <div className="theme-card p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-extrabold text-[#082F49]">Household Expense Ledger</h2>
              <Link to="/budget" className="text-xs font-bold text-[#0E7490] hover:underline">
                View Category Budgets →
              </Link>
            </div>
            <div className="divide-y divide-[#BAE6FD]/40">
              {transactions.length === 0 ? (
                <p className="text-xs text-[#082F49]/70 py-4">No recent household expenses</p>
              ) : (
                transactions.map((t) => (
                  <div key={t.id} className="py-3 flex justify-between items-center text-xs hover:bg-[#BAE6FD]/15 px-2 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#BAE6FD]/40 border border-[#BAE6FD] flex items-center justify-center font-bold text-[#0E7490]">
                        {t.category ? t.category[0] : 'H'}
                      </div>
                      <div>
                        <p className="font-extrabold text-[#082F49]">{t.merchant || t.description}</p>
                        <p className="text-[11px] text-[#082F49]/70 font-medium">{t.category} • {t.txnDate?.substring(0, 10) || 'Recent'}</p>
                      </div>
                    </div>
                    <div className="text-right font-black text-[#082F49]">
                      ₹{Number(t.amount).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Upcoming Bills & Family Privileges */}
        <div className="space-y-6">
          {/* Shared Recurring Bills */}
          <div className="theme-card p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-extrabold text-[#082F49]">Upcoming Shared Bills</h3>
              <Link to="/bills" className="text-xs font-bold text-[#0E7490] hover:underline">All Bills</Link>
            </div>
            <div className="space-y-3">
              {upcomingBills.length === 0 ? (
                <p className="text-xs text-[#082F49]/70 py-2">No bills due in the next 7 days</p>
              ) : (
                upcomingBills.map((b) => (
                  <div key={b.id} className="p-3.5 rounded-xl border border-[#BAE6FD]/70 bg-[#F0FDFF]/80 flex justify-between items-center text-xs shadow-xs hover:-translate-y-0.5 transition-all">
                    <div>
                      <p className="font-extrabold text-[#082F49]">{b.name}</p>
                      <span className="text-[10px] text-[#082F49]/70 font-semibold">Due Day: {b.dueDay} of month</span>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-[#0E7490]">₹{Number(b.amount).toLocaleString('en-IN')}</p>
                      <span className="theme-badge-mint text-[9px] font-bold">Split Available</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Role Security & Privacy Notice */}
          <div className="theme-card p-6 space-y-3 bg-[#F0FDFF]/92 border border-[#BAE6FD] shadow-md">
            <div className="flex items-center gap-2 text-[#082F49]">
              <ShieldCheck className="w-5 h-5 text-[#0E7490]" />
              <h3 className="text-sm font-extrabold">Family Privacy Shield</h3>
            </div>
            <p className="text-xs text-[#082F49]/80 font-medium leading-relaxed">
              As a Family Member, you have access to the shared household budget, equitable expense splitting, and shared recurring bills. Personal investments, bank logins, and tax documents remain privately shielded by the primary user.
            </p>
            <div className="pt-2 border-t border-[#BAE6FD]/40 text-[11px] font-bold text-[#0E7490]">
              Active Scope: SHARED_BUDGET
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
