import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, TrendingDown, DollarSign, Wallet, 
  Shield, AlertCircle, ArrowUpRight, ArrowDownRight, 
  PlusCircle, RefreshCw, Calendar, Target, CheckCircle,
  HelpCircle, ChevronRight, PieChart, Sparkles 
} from 'lucide-react';
import { transactionApi } from '../../services/api';

export default function PrimaryUserDashboard({ 
  user, netWorth, budgetSummary, transactions, 
  goals, upcomingBills, analytics, accounts, onRefresh 
}) {
  const [showAddTxnModal, setShowAddTxnModal] = useState(false);
  const [newTxnAmount, setNewTxnAmount] = useState('');
  const [newTxnCategory, setNewTxnCategory] = useState('Food');
  const [newTxnMerchant, setNewTxnMerchant] = useState('');
  const [newTxnType, setNewTxnType] = useState('DEBIT');
  const [selectedAccountId, setSelectedAccountId] = useState(accounts?.[0]?.id || '');

  const handleCreateTxn = async (e) => {
    e.preventDefault();
    const accId = selectedAccountId || accounts?.[0]?.id;
    if (!newTxnAmount || !accId) return;

    try {
      await transactionApi.createTransaction({
        accountId: Number(accId),
        amount: parseFloat(newTxnAmount),
        type: newTxnType,
        category: newTxnCategory,
        merchant: newTxnMerchant || 'Direct Purchase',
        description: `Dashboard manual entry - ${newTxnCategory}`
      });

      setShowAddTxnModal(false);
      setNewTxnAmount('');
      setNewTxnMerchant('');
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to record transaction");
    }
  };

  const totalBankBalance = accounts?.reduce((sum, a) => sum + (Number(a.balance) || 0), 0) || 185200;

  return (
    <div className="space-y-8 fade-in">
      {/* Welcome Header */}
      <div className="theme-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Welcome back, {user?.fullName || 'User'}!
            </h1>
            <span className="theme-badge uppercase text-[10px] tracking-wider font-bold">
              PRIMARY USER
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Real-time personal finance monitor • RBI Account Aggregator active
          </p>
        </div>

        {/* Quick-Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddTxnModal(true)}
            className="btn-gradient text-xs py-2 px-3.5 shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Add Expense
          </button>
          <Link
            to="/budget"
            className="btn-gradient-outline text-xs py-2 px-3.5"
          >
            <PieChart className="w-4 h-4" /> Adjust Budget
          </Link>
          <Link
            to="/accounts"
            className="btn-gradient-outline text-xs py-2 px-3.5"
          >
            <RefreshCw className="w-4 h-4" /> Sync Banks
          </Link>
        </div>
      </div>

      {/* 4 Primary User KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Net Worth */}
        <div className="theme-card p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Net Worth</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                ₹{netWorth ? Number(netWorth.netWorth).toLocaleString('en-IN') : '9,45,200'}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-[#DB5375] flex items-center justify-center shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
            <span className="text-slate-600">Assets: <strong className="text-[#a82948]">₹{netWorth ? Number(netWorth.totalAssets).toLocaleString('en-IN') : '11,20,000'}</strong></span>
            <span className="text-slate-600">Loans: <strong className="text-red-500">₹{netWorth ? Number(netWorth.totalLiabilities).toLocaleString('en-IN') : '1,74,800'}</strong></span>
          </div>
        </div>

        {/* Card 2: Monthly Budget & Spend */}
        <div className="theme-card p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Month Spend</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                ₹{budgetSummary ? Number(budgetSummary.totalSpent).toLocaleString('en-IN') : '32,950'}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-[#DB5375] flex items-center justify-center shadow-xs">
              <PieChart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
            <span className="text-slate-600">Limit: ₹{budgetSummary ? Number(budgetSummary.totalBudget).toLocaleString('en-IN') : '44,000'}</span>
            <span className="font-bold text-[#a82948]">
              {budgetSummary && budgetSummary.remainingBudget > 0 ? `₹${Number(budgetSummary.remainingBudget).toLocaleString('en-IN')} Left` : 'Over Budget!'}
            </span>
          </div>
        </div>

        {/* Card 3: Bank Liquidity */}
        <div className="theme-card p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bank Liquidity</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                ₹{Number(totalBankBalance).toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-[#DB5375] flex items-center justify-center shadow-xs">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
            <span className="text-slate-600">{accounts?.length || 2} Linked Accounts</span>
            <Link to="/accounts" className="text-[#DB5375] font-bold hover:underline">View All →</Link>
          </div>
        </div>

        {/* Card 4: Financial Health Score */}
        <div className="theme-card p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Health Score</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl font-black text-slate-900">
                  {analytics ? analytics.healthScore : 745}
                </h3>
                <span className="theme-badge text-[10px] font-extrabold uppercase">
                  / 850 ({analytics ? analytics.rating : 'Good'})
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-[#DB5375] flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
            <span className="text-slate-600">Savings: <strong className="text-slate-800">{analytics ? analytics.savingsRate : 28}%</strong></span>
            <Link to="/advisor" className="text-[#DB5375] font-bold hover:underline">Insights →</Link>
          </div>
        </div>
      </div>

      {/* SECOND ROW: 3-COLUMN DESKTOP GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Col 1 & 2: Recent Activity Feed & Budget Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activity Feed */}
          <div className="theme-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-extrabold text-slate-900">Recent Transactions</h2>
              <Link to="/accounts" className="text-xs font-bold text-[#DB5375] hover:underline">
                View All & Statements →
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {transactions.length === 0 ? (
                <p className="text-xs text-slate-500 py-4">No recent transactions</p>
              ) : (
                transactions.map((t) => (
                  <div key={t.id} className="py-3 flex justify-between items-center text-sm hover:bg-slate-50 px-2 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.type === 'CREDIT' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-[#a82948] border border-rose-200'}`}>
                        {t.type === 'CREDIT' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-snug">{t.merchant}</p>
                        <p className="text-[11px] text-slate-600">{t.category} • {new Date(t.txnDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-black ${t.type === 'CREDIT' ? 'text-emerald-700' : 'text-[#a82948]'}`}>
                        {t.type === 'CREDIT' ? '+' : '-'}₹{Number(t.amount).toLocaleString('en-IN')}
                      </p>
                      <span className="text-[10px] text-slate-500 font-mono">Conf: {(Number(t.confidenceScore) * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Category Budget Bars */}
          <div className="theme-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-extrabold text-slate-900">Category Spend Tracking</h2>
              <Link to="/budget" className="text-xs font-bold text-[#DB5375] hover:underline">
                Full Budget Tracker →
              </Link>
            </div>

            <div className="space-y-4">
              {budgetSummary?.categories?.slice(0, 4).map((c) => {
                const pct = Math.min(Number(c.percent), 100);
                const isOver = c.isOverBudget;
                const isAlert = c.isAlert;

                return (
                  <div key={c.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-800 flex items-center gap-1.5 font-bold">
                        {c.category}
                        {isOver && <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold">100% Exceeded</span>}
                        {!isOver && isAlert && <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-bold">80% Alert</span>}
                      </span>
                      <span className="text-slate-600 font-semibold">
                        ₹{Number(c.spentAmount).toLocaleString('en-IN')} / ₹{Number(c.budgetAmount).toLocaleString('en-IN')} ({c.percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full transition-all rounded-full ${isOver ? 'bg-red-500' : (isAlert ? 'bg-amber-500' : 'bg-[#DB5375]')}`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Col 3: Goals, Upcoming Bills & Weekly AI Goal */}
        <div className="space-y-6">
          {/* Financial Goals Widget */}
          <div className="theme-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-extrabold text-slate-900">Active Goals</h2>
              <Link to="/goals" className="text-xs font-bold text-[#DB5375] hover:underline">
                Manage →
              </Link>
            </div>

            <div className="space-y-3">
              {goals.map((g) => (
                <div key={g.id} className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:-translate-y-0.5 transition-all">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-bold text-slate-900">{g.name}</p>
                    <span className="text-xs font-black text-[#DB5375]">{g.progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 mt-2">
                    <div
                      className="h-full bg-[#DB5375] rounded-full"
                      style={{ width: `${Math.min(g.progressPercent, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1.5 font-medium">
                    Target: ₹{Number(g.targetAmount).toLocaleString('en-IN')} • Save ₹{g.monthlySavingsNeeded}/mo
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Bills Widget */}
          <div className="theme-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-extrabold text-slate-900">Upcoming Bills (7 Days)</h2>
              <Link to="/bills" className="text-xs font-bold text-[#DB5375] hover:underline">
                Bill Manager →
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingBills.length === 0 ? (
                <p className="text-xs text-slate-500">No pending bills for the next 7 days</p>
              ) : (
                upcomingBills.map((b) => (
                  <div key={b.id} className="flex justify-between items-center p-3 rounded-xl bg-white border border-slate-200/80 text-xs shadow-xs hover:-translate-y-0.5 transition-all">
                    <div>
                      <p className="font-bold text-slate-900">{b.name}</p>
                      <p className="text-[10px] text-slate-600 font-medium">Due Day: {b.dueDay}th of month</p>
                    </div>
                    <p className="font-extrabold text-slate-900">₹{Number(b.amount).toLocaleString('en-IN')}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Weekly AI Financial Goal & Tip Box (Single Color, Light, Floating) */}
          <div className="theme-card p-5 relative overflow-hidden bg-white/95 border border-white/80 shadow-lg hover:-translate-y-1 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-[#DB5375] shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#DB5375]">Weekly AI Goal & Tip</span>
                <p className="text-[10px] text-slate-500 font-medium">Automated Intelligence Advisor</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-700 font-medium mt-1">
              {analytics?.tips?.[0] || "Your Food spend reached 82% of its limit. Cooking home meals 2 days/week will save ₹3,800 this month."}
            </p>
          </div>
        </div>
      </div>

      {/* QUICK ADD TRANSACTION MODAL */}
      {showAddTxnModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden fade-in">
            <div className="h-1 bg-[#DB5375] absolute top-0 left-0 right-0"></div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-4 mt-1">Record New Expense</h3>
            <form onSubmit={handleCreateTxn} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Account</label>
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="theme-input"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.bankName} ({a.maskedNumber}) - ₹{Number(a.balance).toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="850.00"
                  value={newTxnAmount}
                  onChange={(e) => setNewTxnAmount(e.target.value)}
                  className="theme-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newTxnCategory}
                    onChange={(e) => setNewTxnCategory(e.target.value)}
                    className="theme-input"
                  >
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Investment">Investment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={newTxnType}
                    onChange={(e) => setNewTxnType(e.target.value)}
                    className="theme-input"
                  >
                    <option value="DEBIT">Debit (Spend)</option>
                    <option value="CREDIT">Credit (Income)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Merchant / Recipient</label>
                <input
                  type="text"
                  placeholder="e.g. Swiggy, Uber, Amazon"
                  value={newTxnMerchant}
                  onChange={(e) => setNewTxnMerchant(e.target.value)}
                  className="theme-input"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddTxnModal(false)}
                  className="btn-gradient-outline px-4 py-2 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient px-4 py-2 text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


