import React, { useState, useEffect } from 'react';
import { accountApi, transactionApi } from '../services/api';
import { 
  Building, RefreshCw, PlusCircle, Trash2, Download, 
  Search, ShieldCheck, CheckCircle, AlertCircle, FileSpreadsheet 
} from 'lucide-react';

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Link Account Modal (RBI Account Aggregator simulation)
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountType, setAccountType] = useState('SAVINGS');
  const [accountNumber, setAccountNumber] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [consentAgreed, setConsentAgreed] = useState(false);

  // Filter states
  const [searchCategory, setSearchCategory] = useState('');
  const [searchMerchant, setSearchMerchant] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [accRes, txnRes] = await Promise.all([
        accountApi.getAccounts(),
        transactionApi.getTransactions()
      ]);
      setAccounts(accRes.data || []);
      setTransactions(txnRes.data || []);
    } catch (e) {
      console.error("Failed to load accounts:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkAccount = async (e) => {
    e.preventDefault();
    if (!consentAgreed) {
      alert("Please check the Account Aggregator Consent box to proceed.");
      return;
    }

    try {
      await accountApi.linkAccount({
        bankName,
        accountType,
        accountNumber: accountNumber || '8832',
        initialBalance: initialBalance ? parseFloat(initialBalance) : 50000.00
      });
      setShowLinkModal(false);
      setAccountNumber('');
      setInitialBalance('');
      setConsentAgreed(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to link account");
    }
  };

  const handleSync = async (id) => {
    try {
      await accountApi.syncAccount(id);
      loadData();
    } catch (e) {
      alert("Sync error");
    }
  };

  const handleUnlink = async (id) => {
    if (window.confirm("Are you sure you want to unlink this account? Consent will be revoked and cached data cleared.")) {
      try {
        await accountApi.unlinkAccount(id);
        loadData();
      } catch (e) {
        alert("Failed to unlink account");
      }
    }
  };

  const handleDownloadCsv = () => {
    // Generate CSV string of transactions (FR4 & Appendix H)
    let csv = "ID,BankReference,Date,Merchant,Category,Type,Amount,Confidence\n";
    transactions.forEach(t => {
      csv += `"${t.id}","${t.bankReference}","${t.txnDate}","${t.merchant}","${t.category}","${t.type}","${t.amount}","${t.confidenceScore}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bank_statement_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTxns = transactions.filter(t => {
    const matchCat = !searchCategory || t.category.toLowerCase() === searchCategory.toLowerCase();
    const matchMerch = !searchMerchant || t.merchant.toLowerCase().includes(searchMerchant.toLowerCase());
    return matchCat && matchMerch;
  });

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
            <h1 className="text-2xl font-extrabold text-[#082F49]">Linked Accounts & Aggregation</h1>
            <p className="text-xs text-[#082F49]/70 mt-1 font-medium">
              Multi-bank sync via RBI Account Aggregator framework with 6-hour automated polling
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadCsv}
              className="btn-gradient-outline text-xs px-3.5 py-2.5"
            >
              <Download className="w-4 h-4" /> Download Statement (CSV)
            </button>
            <button
              onClick={() => setShowLinkModal(true)}
              className="btn-gradient text-xs py-2.5 px-4 shadow-md"
            >
              <PlusCircle className="w-4 h-4 text-white" /> Link Bank via AA
            </button>
          </div>
        </div>

        {/* Linked Accounts Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {accounts.map((acc) => (
            <div key={acc.id} className="theme-card p-5 relative flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="theme-badge text-[10px] font-extrabold">
                      {acc.accountType}
                    </span>
                    <h3 className="font-extrabold text-[#082F49] mt-2 text-sm">{acc.bankName}</h3>
                    <p className="text-xs font-mono text-[#082F49]/70 mt-0.5 font-semibold">{acc.maskedNumber}</p>
                  </div>
                  <button
                    onClick={() => handleUnlink(acc.id)}
                    className="text-[#082F49]/40 hover:text-red-600 transition-colors p-1"
                    title="Unlink Account"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-[#BAE6FD]/60">
                  <span className="text-[11px] text-[#082F49]/70 uppercase font-bold">Available Balance</span>
                  <p className="text-xl font-black text-[#082F49] mt-0.5">
                    ₹{Number(acc.balance).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#BAE6FD]/60 flex justify-between items-center text-[10px] text-[#082F49]/70 font-medium">
                <span>Synced: {new Date(acc.lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <button
                  onClick={() => handleSync(acc.id)}
                  className="text-[#0E7490] hover:text-[#082F49] font-extrabold flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Sync
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Consolidated Transaction Ledger (Appendix I) */}
        <div className="theme-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-base font-extrabold text-[#082F49]">Aggregated Transactions & ML Predictions</h2>
            {/* Search and Category Filter */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="w-3.5 h-3.5 text-[#0E7490] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter merchant..."
                  value={searchMerchant}
                  onChange={(e) => setSearchMerchant(e.target.value)}
                  className="pl-8 pr-3 py-1.5 border border-[#BAE6FD] rounded-xl text-xs w-full sm:w-44 focus:outline-none focus:border-[#0E7490] bg-[#F0FDFF] text-[#082F49] font-medium"
                />
              </div>
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="px-3 py-1.5 border border-[#BAE6FD] rounded-xl text-xs bg-[#F0FDFF] text-[#082F49] font-medium focus:outline-none focus:border-[#0E7490]"
              >
                <option value="">All Categories</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Utilities">Utilities</option>
                <option value="Shopping">Shopping</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Income">Income</option>
                <option value="Investment">Investment</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#BAE6FD]/70">
            <table className="w-full text-left text-xs text-[#082F49]">
              <thead className="theme-table-header">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Merchant / Narration</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Ref #</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#BAE6FD]/40 bg-[#F0FDFF]/50">
                {filteredTxns.map((t) => (
                  <tr key={t.id} className="hover:bg-[#BAE6FD]/15 transition-colors">
                    <td className="py-3 px-4 font-medium">{new Date(t.txnDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4 font-bold text-[#082F49]">{t.merchant}</td>
                    <td className="py-3 px-4">
                      <span className="theme-badge text-[10px]">
                        {t.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                        Number(t.confidenceScore) >= 0.9 ? 'bg-[#22C55E]/15 text-[#15803d] border border-[#22C55E]/30' : 'bg-[#BAE6FD]/40 text-[#0E7490] border border-[#BAE6FD]'
                      }`}>
                        {(Number(t.confidenceScore) * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#082F49]/60">{t.bankReference}</td>
                    <td className={`py-3 px-4 text-right font-black ${t.type === 'CREDIT' ? 'text-[#22C55E]' : 'text-[#082F49]'}`}>
                      {t.type === 'CREDIT' ? '+' : '-'}₹{Number(t.amount).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RBI AA LINK MODAL */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#F0FDFF] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#BAE6FD] relative overflow-hidden fade-in floating-card">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0E7490]"></div>
            <div className="flex items-center gap-2 mb-2 text-[#0E7490] mt-1">
              <ShieldCheck className="w-5 h-5 text-[#0E7490]" />
              <h3 className="text-lg font-extrabold text-[#082F49]">RBI Account Aggregator Consent</h3>
            </div>
            <p className="text-xs text-[#082F49]/70 mb-4 font-medium">
              Securely authenticate and delegate read-only data access for 12 months under RBI regulatory guidelines.
            </p>

            <form onSubmit={handleLinkAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#082F49] mb-1">Select Financial Institution</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#BAE6FD] rounded-xl text-xs bg-[#F0FDFF] text-[#082F49] font-medium focus:outline-none focus:border-[#0E7490]"
                >
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  <option value="Zerodha Broking (CDSL)">Zerodha Broking (CDSL)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#082F49] mb-1">Account Classification</label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-full px-3 py-2 border border-[#BAE6FD] rounded-xl text-xs bg-[#F0FDFF] text-[#082F49] font-medium focus:outline-none focus:border-[#0E7490]"
                >
                  <option value="SAVINGS">Savings Account</option>
                  <option value="CURRENT">Current Account</option>
                  <option value="CREDIT">Credit Card Liability</option>
                  <option value="DEMAT">DEMAT Securities Account</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#082F49] mb-1">Last 4 Digits of Account Number</label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  placeholder="8832"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3.5 py-2 border border-[#BAE6FD] rounded-xl text-sm font-mono bg-[#F0FDFF] text-[#082F49] font-medium focus:outline-none focus:border-[#0E7490]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#082F49] mb-1">Initial Synced Balance (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="50000.00"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value)}
                  className="w-full px-3.5 py-2 border border-[#BAE6FD] rounded-xl text-sm bg-[#F0FDFF] text-[#082F49] font-medium focus:outline-none focus:border-[#0E7490]"
                />
              </div>

              <div className="p-3.5 bg-[#BAE6FD]/20 border border-[#BAE6FD]/70 rounded-xl space-y-2">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={consentAgreed}
                    onChange={(e) => setConsentAgreed(e.target.checked)}
                    className="mt-0.5 rounded text-[#0E7490] focus:ring-[#0E7490]"
                  />
                  <label htmlFor="consent" className="text-[11px] text-[#082F49] font-medium leading-tight">
                    I grant explicit consent to fetch account balances and transaction history for 12 months with 6-hour automatic synchronisation.
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="btn-gradient-outline px-4 py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient px-4 py-2 text-xs font-bold shadow-md"
                >
                  Confirm & Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
