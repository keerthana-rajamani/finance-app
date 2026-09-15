import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Award, Sparkles, TrendingUp, Info, ShieldCheck, FileText, RefreshCw } from 'lucide-react';

export default function FinancialAdvisorDashboard({ user, netWorth, analytics, investments, goals }) {
  const totalAssetsVal = netWorth?.totalAssets || 485000;
  const netWorthVal = netWorth?.netWorth || 410200;
  const portfolioXirr = 14.50;

  return (
    <div className="space-y-8 fade-in">
      {/* Welcome Header */}
      <div className="theme-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Wealth & Portfolio Advisory Console</h1>
            <span className="theme-badge-mint text-[10px] font-extrabold uppercase px-2.5 py-1">
              Financial Advisor
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Client: John Doe • Read-Only Certified Portfolio & Asset Allocation Advisory (FR9 & FR10)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/investments" className="btn-gradient text-xs py-2 px-4 shadow-sm">
            <TrendingUp className="w-4 h-4" /> Full Holdings Matrix
          </Link>
          <Link to="/advisor" className="btn-gradient-outline text-xs py-2 px-4">
            <Sparkles className="w-4 h-4" /> AI Advisory Models
          </Link>
        </div>
      </div>

      {/* 4 Advisor KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="theme-card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Client Assets Under Advisory</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">₹{Number(totalAssetsVal).toLocaleString('en-IN')}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#DB5375] shadow-xs">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
            Liquid Cash, Equity DEMAT & Mutual Funds
          </div>
        </div>

        <div className="theme-card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Portfolio XIRR Return</p>
              <h3 className="text-2xl font-black text-emerald-700 mt-1">+{portfolioXirr}% p.a.</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#DB5375] shadow-xs">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
            Benchmark Nifty 50: <strong className="text-slate-900">+11.8%</strong> (+2.7% Alpha)
          </div>
        </div>

        <div className="theme-card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Client Health Score</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{analytics?.healthScore || 745} / 850</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#DB5375] shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
            Grade: <strong className="text-[#a82948]">{analytics?.rating || 'Excellent'}</strong> (50-30-20 Compliant)
          </div>
        </div>

        <div className="theme-card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Consolidated Net Worth</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">₹{Number(netWorthVal).toLocaleString('en-IN')}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#DB5375] shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
            Debt-to-Asset Ratio: <strong className="text-slate-900">{netWorth?.debtToAssetRatio || '15.6'}%</strong> (Safe)
          </div>
        </div>
      </div>

      {/* 2-Column Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Asset Allocation Model & Performance Matrix */}
        <div className="lg:col-span-2 space-y-6">
          {/* Asset Allocation vs Recommended Target Model */}
          <div className="theme-card p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-extrabold text-slate-900">Asset Allocation vs Advisor Target Model</h2>
              <span className="theme-badge text-[10px] font-bold">FR9 Balanced Mix</span>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-extrabold mb-1">
                  <span className="text-slate-800">Equity & Stock Holdings</span>
                  <span className="text-[#a82948]">Actual: 55% | Target: 50% (+5% Overweight)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="h-full bg-[#DB5375] rounded-full" style={{ width: '55%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-extrabold mb-1">
                  <span className="text-slate-800">Debt & Fixed Income Funds</span>
                  <span className="text-amber-700">Actual: 15% | Target: 25% (-10% Underweight - Rebalance!)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-extrabold mb-1">
                  <span className="text-slate-800">Gold & Sovereign Gold Bonds (SGB)</span>
                  <span className="text-slate-700">Actual: 10% | Target: 10% (Optimal)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-extrabold mb-1">
                  <span className="text-slate-800">Liquid Savings & Cash Buffer</span>
                  <span className="text-slate-700">Actual: 20% | Target: 15% (Healthy Emergency Buffer)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-2xl text-xs text-slate-800 flex items-start gap-2">
              <Info className="w-4 h-4 text-[#DB5375] flex-shrink-0 mt-0.5" />
              <span>
                <strong>Advisor Rebalancing Advice:</strong> Client is slightly overweight in high-beta equity. Recommend systematic transfer plan (STP) of ₹25,000 from liquid cash into High-Yield Corporate Debt funds to lock in 7.8% yield.
              </span>
            </div>
          </div>

          {/* Client Holdings Performance Table */}
          <div className="theme-card p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-extrabold text-slate-900">Client Holdings & XIRR Matrix</h2>
              <Link to="/investments" className="text-xs font-bold text-[#DB5375] hover:underline">
                Full Holdings View →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="theme-table-header">
                  <tr>
                    <th className="p-2.5 rounded-l-xl">Asset Name</th>
                    <th className="p-2.5">Type</th>
                    <th className="p-2.5">Units</th>
                    <th className="p-2.5">Current NAV</th>
                    <th className="p-2.5">Total Value</th>
                    <th className="p-2.5 rounded-r-xl">XIRR Return</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {investments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-slate-500">No client holdings recorded</td>
                    </tr>
                  ) : (
                    investments.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50 transition-colors font-medium">
                        <td className="p-2.5 font-extrabold text-slate-900">{inv.assetName}</td>
                        <td className="p-2.5">
                          <span className="theme-badge text-[9px]">{inv.assetType}</span>
                        </td>
                        <td className="p-2.5 text-slate-700">{inv.units}</td>
                        <td className="p-2.5 text-slate-700">₹{Number(inv.currentNav).toLocaleString('en-IN')}</td>
                        <td className="p-2.5 font-bold text-slate-900">₹{Number(inv.totalValue).toLocaleString('en-IN')}</td>
                        <td className="p-2.5 text-emerald-700 font-extrabold">+{inv.xirr || '14.2'}%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Goal Trajectory & Action Panel */}
        <div className="space-y-6">
          {/* Goal Trajectory & SIP Advice */}
          <div className="theme-card p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Goal Trajectory & SIP Analysis</h3>
            <div className="space-y-3">
              {goals.length === 0 ? (
                <p className="text-xs text-slate-500 py-2">No goals currently configured for client</p>
              ) : (
                goals.map((g) => {
                  const pct = Math.min(100, Math.round((Number(g.currentAmount) / Number(g.targetAmount)) * 100));
                  return (
                    <div key={g.id} className="p-3.5 rounded-xl border border-slate-200/80 bg-white space-y-1.5 text-xs shadow-xs hover:-translate-y-0.5 transition-all">
                      <div className="flex justify-between font-extrabold text-slate-900">
                        <span>{g.name}</span>
                        <span className="text-[#a82948]">{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-[#DB5375] rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                        <span>Target: ₹{Number(g.targetAmount).toLocaleString('en-IN')}</span>
                        <span className="font-bold text-[#89233c]">SIP: ₹{g.monthlySavingsNeeded || '3,500'}/mo</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Advisory Action Center */}
          <div className="theme-card p-6 space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900">Advisory Action Hub</h3>
            <button 
              onClick={() => alert("Quarterly wealth analysis generated and archived.")}
              className="btn-gradient w-full text-xs py-2.5 font-extrabold shadow-sm cursor-pointer"
            >
              <FileText className="w-4 h-4" /> Export Client Wealth Report
            </button>
            <button 
              onClick={() => alert("Rebalancing recommendation dispatched to client via notification center.")}
              className="btn-gradient-outline w-full text-xs py-2.5 font-extrabold cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Send Rebalance Notification
            </button>
          </div>

          {/* Read-Only Governance Notice */}
          <div className="theme-card p-4 rounded-2xl border border-white/80 bg-white/95 text-xs text-slate-700 space-y-1 shadow-md">
            <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Certified Read-Only Advisory
            </p>
            <p className="text-[11px] leading-relaxed text-slate-600">
              Advisors have read-only analytics visibility into client holdings and asset allocations. Account credentials, debit transactions, and tax filings are shielded by primary client ownership.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
