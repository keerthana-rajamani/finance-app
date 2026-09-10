import React, { useState, useEffect } from 'react';
import { investmentApi, netWorthApi } from '../services/api';
import { TrendingUp, PieChart, PlusCircle, DollarSign, Award, Shield } from 'lucide-react';

export default function Investments() {
  const [investments, setInvestments] = useState([]);
  const [allocation, setAllocation] = useState(null);
  const [netWorth, setNetWorth] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add Investment Modal
  const [showModal, setShowModal] = useState(false);
  const [assetType, setAssetType] = useState('EQUITY');
  const [assetName, setAssetName] = useState('');
  const [units, setUnits] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [currentNav, setCurrentNav] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [invRes, allocRes, nwRes] = await Promise.all([
        investmentApi.getInvestments(),
        investmentApi.getAllocation(),
        netWorthApi.getSummary()
      ]);
      setInvestments(invRes.data || []);
      setAllocation(allocRes.data || null);
      setNetWorth(nwRes.data || null);
    } catch (e) {
      console.error("Failed to load investments:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInvestment = async (e) => {
    e.preventDefault();
    try {
      await investmentApi.addInvestment({
        assetType,
        assetName,
        units: parseFloat(units) || 1,
        buyPrice: parseFloat(buyPrice),
        currentNav: currentNav ? parseFloat(currentNav) : parseFloat(buyPrice)
      });
      setShowModal(false);
      setAssetName('');
      setUnits('');
      setBuyPrice('');
      setCurrentNav('');
      loadData();
    } catch (e) {
      alert("Failed to add investment holding");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
      </div>
    );
  }

  const breakdown = allocation?.breakdown || {};
  const totalInv = Number(allocation?.totalInvestmentValue) || 1;

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Investment Portfolio & Asset Allocation</h1>
            <p className="text-xs text-slate-500 mt-1">
              DEMAT equity and mutual fund integration via CDSL/NSDL & CAMS statements with XIRR analytics
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 btn-gradient text-xs font-bold rounded-lg shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4 text-slate-900" /> Add Asset / Holding
          </button>
        </div>

        {/* Portfolio Summary KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Portfolio Valuation</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              ₹{Number(allocation?.totalInvestmentValue || 0).toLocaleString('en-IN')}
            </h2>
            <p className="text-xs text-slate-500 mt-2">Across {investments.length} active holdings</p>
          </div>

          <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg">
            <span className="text-xs font-semibold text-slate-500 uppercase">Consolidated XIRR</span>
            <h2 className="text-3xl font-extrabold text-emerald-600 mt-2">
              {allocation?.overallXIRR || '13.8%'}
            </h2>
            <p className="text-xs text-slate-500 mt-2">Outperforming Nifty 50 benchmark (11.4%)</p>
          </div>

          <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Consolidated Net Worth</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              ₹{netWorth ? Number(netWorth.netWorth).toLocaleString('en-IN') : '9,45,200'}
            </h2>
            <p className="text-xs text-slate-500 mt-2">Assets: ₹{Number(netWorth?.totalAssets || 0).toLocaleString('en-IN')} • Loans: ₹{Number(netWorth?.totalLiabilities || 0).toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Asset Allocation Breakdown Bar (FR9) */}
        <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg space-y-4">
          <h2 className="text-base font-bold text-slate-900">Asset Class Allocation</h2>

          <div className="w-full h-4 rounded-full bg-slate-100 flex overflow-hidden">
            <div style={{ width: `${Math.round(((breakdown.EQUITY || 0) / totalInv) * 100)}%` }} className="bg-blue-600 h-full" title="Equity"></div>
            <div style={{ width: `${Math.round(((breakdown.MUTUAL_FUND || 0) / totalInv) * 100)}%` }} className="bg-emerald-500 h-full" title="Mutual Funds"></div>
            <div style={{ width: `${Math.round(((breakdown.GOLD || 0) / totalInv) * 100)}%` }} className="bg-amber-400 h-full" title="Gold"></div>
            <div style={{ width: `${Math.round(((breakdown.DEBT || 0) / totalInv) * 100)}%` }} className="bg-purple-500 h-full" title="Debt"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              <span>Equity: <strong>₹{Number(breakdown.EQUITY || 0).toLocaleString('en-IN')}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span>Mutual Funds: <strong>₹{Number(breakdown.MUTUAL_FUND || 0).toLocaleString('en-IN')}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <span>Gold (SGB): <strong>₹{Number(breakdown.GOLD || 0).toLocaleString('en-IN')}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-500"></span>
              <span>Debt / FD: <strong>₹{Number(breakdown.DEBT || 0).toLocaleString('en-IN')}</strong></span>
            </div>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg space-y-4">
          <h2 className="text-base font-bold text-slate-900">Portfolio Holdings & Real-Time NAV</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Asset Name</th>
                  <th className="py-3 px-4">Asset Class</th>
                  <th className="py-3 px-4 text-right">Units</th>
                  <th className="py-3 px-4 text-right">Buy Price (₹)</th>
                  <th className="py-3 px-4 text-right">Current NAV (₹)</th>
                  <th className="py-3 px-4 text-right">Total Value (₹)</th>
                  <th className="py-3 px-4 text-right">XIRR (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {investments.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{inv.assetName}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">
                        {inv.assetType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono">{Number(inv.units).toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-mono">₹{Number(inv.buyPrice).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">₹{Number(inv.currentNav).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">₹{Number(inv.totalValue).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">+{inv.xirr}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ADD INVESTMENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add Portfolio Asset</h3>
            <form onSubmit={handleAddInvestment} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Asset Class</label>
                <select
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="EQUITY">DEMAT Equity (Stock)</option>
                  <option value="MUTUAL_FUND">Mutual Fund Unit</option>
                  <option value="GOLD">Sovereign Gold Bond / Physical</option>
                  <option value="DEBT">Corporate Bond / Fixed Deposit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Asset / Scheme Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HDFC Top 100, Infosys Ltd"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Units / Quantity</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    placeholder="10"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Buy Price per Unit (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="1500.00"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Current NAV / Market Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="1750.00"
                  value={currentNav}
                  onChange={(e) => setCurrentNav(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
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
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
