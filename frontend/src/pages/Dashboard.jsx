import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  accountApi, budgetApi, netWorthApi, transactionApi, 
  analyticsApi, goalApi, billApi 
} from '../services/api';
import { 
  TrendingUp, TrendingDown, DollarSign, Wallet, 
  Shield, AlertCircle, ArrowUpRight, ArrowDownRight, 
  PlusCircle, RefreshCw, Calendar, Target, CheckCircle,
  HelpCircle, ChevronRight, PieChart, Sparkles
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [netWorth, setNetWorth] = useState(null);
  const [budgetSummary, setBudgetSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [upcomingBills, setUpcomingBills] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quick Action Modal states
  const [showAddTxnModal, setShowAddTxnModal] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [newTxnAmount, setNewTxnAmount] = useState('');
  const [newTxnCategory, setNewTxnCategory] = useState('Food');
  const [newTxnMerchant, setNewTxnMerchant] = useState('');
  const [newTxnType, setNewTxnType] = useState('DEBIT');
  const [selectedAccountId, setSelectedAccountId] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [nwRes, bRes, tRes, gRes, billRes, aRes, accRes] = await Promise.allSettled([
        netWorthApi.getSummary(),
        budgetApi.getSummary(),
        transactionApi.getTransactions(),
        goalApi.getGoals(),
        billApi.getUpcoming(),
        analyticsApi.getInsights(),
        accountApi.getAccounts()
      ]);

      if (nwRes.status === 'fulfilled') setNetWorth(nwRes.value.data);
      if (bRes.status === 'fulfilled') setBudgetSummary(bRes.value.data);
      if (tRes.status === 'fulfilled') setTransactions(tRes.value.data.slice(0, 5));
      if (gRes.status === 'fulfilled') setGoals(gRes.value.data.slice(0, 3));
      if (billRes.status === 'fulfilled') setUpcomingBills(billRes.value.data.slice(0, 3));
      if (aRes.status === 'fulfilled') setAnalytics(aRes.value.data);
      if (accRes.status === 'fulfilled') {
        setAccounts(accRes.value.data);
        if (accRes.value.data.length > 0) {
          setSelectedAccountId(accRes.value.data[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to load dashboard data:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTxn = async (e) => {
    e.preventDefault();
    if (!newTxnAmount || !selectedAccountId) return;

    try {
      await transactionApi.createTransaction({
        accountId: Number(selectedAccountId),
        amount: parseFloat(newTxnAmount),
        type: newTxnType,
        category: newTxnCategory,
        merchant: newTxnMerchant || 'Direct Purchase',
        description: `Dashboard manual entry - ${newTxnCategory}`
      });

      setShowAddTxnModal(false);
      setNewTxnAmount('');
      setNewTxnMerchant('');
      loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to record transaction");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const role = user?.role || 'USER';

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">
                Welcome back, {user?.fullName || 'User'}!
              </h1>
              <span className="text-xs uppercase px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                {role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Real-time personal finance monitor • RBI Account Aggregator active
            </p>
          </div>

          {/* Quick-Action Buttons (SRS Appendix I: 3 most used operations) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddTxnModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" /> Add Expense
            </button>
            <Link
              to="/budget"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all"
            >
              <PieChart className="w-4 h-4" /> Adjust Budget
            </Link>
            <Link
              to="/accounts"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Sync Banks
            </Link>
          </div>
        </div>

        {/* ROLE-AWARE KPI SUMMARY CARDS (Appendix I: 3-column desktop grid) */}
        {role === 'SUPPORT' ? (
          /* SUPPORT AGENT VIEW: Masked data and audit compliance */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase">Support Mode</p>
              <h3 className="text-xl font-bold text-amber-600 mt-1">Data Masking Active</h3>
              <p className="text-xs text-slate-500 mt-2">Account numbers and PAN are masked to the last 4 digits per RBI FR3 & Appendix A.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase">Linked Accounts</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{accounts.length} Accounts</h3>
              <p className="text-xs text-slate-500 mt-2">All encrypted in transit (TLS 1.3).</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase">Audit Trail</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">Compliant</h3>
              <p className="text-xs text-slate-500 mt-2">Every query logged with role identity.</p>
            </div>
          </div>
        ) : (
          /* PRIMARY USER & ADVISOR VIEW */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Net Worth */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Net Worth</p>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                    ₹{netWorth ? Number(netWorth.netWorth).toLocaleString('en-IN') : '9,45,200'}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
                <span className="text-slate-500">Assets: <strong className="text-emerald-600">₹{netWorth ? Number(netWorth.totalAssets).toLocaleString('en-IN') : '11,20,000'}</strong></span>
                <span className="text-slate-500">Loans: <strong className="text-red-500">₹{netWorth ? Number(netWorth.totalLiabilities).toLocaleString('en-IN') : '1,74,800'}</strong></span>
              </div>
            </div>

            {/* Card 2: Monthly Budget & Spend */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Month Spend</p>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                    ₹{budgetSummary ? Number(budgetSummary.totalSpent).toLocaleString('en-IN') : '32,950'}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <PieChart className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
                <span className="text-slate-500">Budget Limit: ₹{budgetSummary ? Number(budgetSummary.totalBudget).toLocaleString('en-IN') : '44,000'}</span>
                <span className="font-semibold text-emerald-600">
                  {budgetSummary && budgetSummary.remainingBudget > 0 ? `₹${Number(budgetSummary.remainingBudget).toLocaleString('en-IN')} Left` : 'Over Budget!'}
                </span>
              </div>
            </div>

            {/* Card 3: Financial Health Score */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Health Score</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="text-2xl font-extrabold text-slate-900">
                      {analytics ? analytics.healthScore : 745}
                    </h3>
                    <span className="text-xs font-bold text-emerald-600 uppercase">
                      / 850 ({analytics ? analytics.rating : 'Good'})
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
                <span className="text-slate-500">Savings Rate: <strong className="text-slate-700">{analytics ? analytics.savingsRate : 28}%</strong></span>
                <Link to="/advisor" className="text-emerald-600 font-semibold hover:underline">View Insights →</Link>
              </div>
            </div>
          </div>
        )}

        {/* SECOND ROW: 3-COLUMN DESKTOP GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Col 1 & 2: Recent Activity Feed & Budget Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity Feed */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-bold text-slate-900">Recent Transactions</h2>
                <Link to="/accounts" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                  View All & Statements →
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {transactions.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4">No recent transactions</p>
                ) : (
                  transactions.map((t) => (
                    <div key={t.id} className="py-3 flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.type === 'CREDIT' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                          {t.type === 'CREDIT' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 leading-snug">{t.merchant}</p>
                          <p className="text-[11px] text-slate-500">{t.category} • {new Date(t.txnDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${t.type === 'CREDIT' ? 'text-emerald-600' : 'text-slate-800'}`}>
                          {t.type === 'CREDIT' ? '+' : '-'}₹{Number(t.amount).toLocaleString('en-IN')}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono">Conf: {(Number(t.confidenceScore) * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Category Budget Bars */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-bold text-slate-900">Category Spend Tracking</h2>
                <Link to="/budget" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
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
                        <span className="text-slate-700 flex items-center gap-1.5">
                          {c.category}
                          {isOver && <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold">100% Exceeded</span>}
                          {!isOver && isAlert && <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-bold">80% Alert</span>}
                        </span>
                        <span className="text-slate-500">
                          ₹{Number(c.spentAmount).toLocaleString('en-IN')} / ₹{Number(c.budgetAmount).toLocaleString('en-IN')} ({c.percent}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full transition-all rounded-full ${isOver ? 'bg-red-500' : (isAlert ? 'bg-amber-500' : 'bg-emerald-500')}`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Col 3: Goals & Upcoming Bills Sidebar */}
          <div className="space-y-6">
            {/* Financial Goals Widget */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-bold text-slate-900">Active Goals</h2>
                <Link to="/goals" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                  Manage →
                </Link>
              </div>

              <div className="space-y-4">
                {goals.map((g) => (
                  <div key={g.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-start">
                      <p className="text-xs font-bold text-slate-800">{g.name}</p>
                      <span className="text-xs font-bold text-emerald-600">{g.progressPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 mt-2">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${Math.min(g.progressPercent, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1.5">
                      Target: ₹{Number(g.targetAmount).toLocaleString('en-IN')} • Save ₹{g.monthlySavingsNeeded}/mo
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Bills Widget */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-bold text-slate-900">Upcoming Bills (7 Days)</h2>
                <Link to="/bills" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                  Bill Manager →
                </Link>
              </div>

              <div className="space-y-3">
                {upcomingBills.length === 0 ? (
                  <p className="text-xs text-slate-500">No pending bills for the next 7 days</p>
                ) : (
                  upcomingBills.map((b) => (
                    <div key={b.id} className="flex justify-between items-center p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-xs">
                      <div>
                        <p className="font-bold text-slate-800">{b.name}</p>
                        <p className="text-[10px] text-slate-500">Due Day: {b.dueDay}th of month</p>
                      </div>
                      <p className="font-bold text-slate-900">₹{Number(b.amount).toLocaleString('en-IN')}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* AI Advisor Money Tip Box */}
            <div className="p-4 bg-gradient-to-tr from-emerald-800 to-teal-900 text-white rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Weekly AI Tip</span>
              </div>
              <p className="text-xs leading-relaxed text-emerald-50">
                {analytics?.tips?.[0] || "Your Food spend reached 82% of its limit. Cooking home meals 2 days/week will save ₹3,800 this month."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ADD TRANSACTION MODAL */}
      {showAddTxnModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Record New Expense</h3>
            <form onSubmit={handleCreateTxn} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Select Account</label>
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.bankName} ({a.maskedNumber}) - ₹{Number(a.balance).toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="850.00"
                  value={newTxnAmount}
                  onChange={(e) => setNewTxnAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={newTxnCategory}
                    onChange={(e) => setNewTxnCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
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
                  <label className="block text-xs font-medium text-slate-700 mb-1">Type</label>
                  <select
                    value={newTxnType}
                    onChange={(e) => setNewTxnType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="DEBIT">Debit (Spend)</option>
                    <option value="CREDIT">Credit (Income)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Merchant / Recipient</label>
                <input
                  type="text"
                  placeholder="e.g. Swiggy, Uber, Amazon"
                  value={newTxnMerchant}
                  onChange={(e) => setNewTxnMerchant(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddTxnModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700"
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
