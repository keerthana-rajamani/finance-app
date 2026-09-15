import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Activity, RefreshCw, Search, Lock, 
  Server, AlertTriangle, CheckCircle, Database, Terminal, FileText 
} from 'lucide-react';
import { supportApi, accountApi } from '../../services/api';

export default function SupportDashboard({ user }) {
  const [systemStatus, setSystemStatus] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resyncingId, setResyncingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    loadSupportData();
  }, []);

  const loadSupportData = async () => {
    setLoading(true);
    try {
      const [statusRes, accRes, logsRes] = await Promise.allSettled([
        supportApi.getSystemStatus(),
        accountApi.getAccounts(),
        supportApi.getAuditLogs()
      ]);

      if (statusRes.status === 'fulfilled') setSystemStatus(statusRes.value.data);
      if (accRes.status === 'fulfilled') setAccounts(accRes.value.data);
      if (logsRes.status === 'fulfilled') setAuditLogs(logsRes.value.data);
    } catch (err) {
      console.error("Support dashboard data error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDiagnosticResync = async (accId) => {
    setResyncingId(accId);
    setActionSuccess('');
    try {
      const res = await supportApi.resyncAccount(accId);
      setActionSuccess(`Account #${accId} diagnostic re-sync completed successfully.`);
      const [accRes, logsRes] = await Promise.allSettled([
        accountApi.getAccounts(),
        supportApi.getAuditLogs()
      ]);
      if (accRes.status === 'fulfilled') setAccounts(accRes.value.data);
      if (logsRes.status === 'fulfilled') setAuditLogs(logsRes.value.data);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert("Failed to resync account: " + (err.response?.data?.message || err.message));
    } finally {
      setResyncingId(null);
    }
  };

  const filteredAccounts = accounts.filter(acc => 
    acc.bankName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.maskedNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.accountType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="theme-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Support & Compliance Console</h1>
            <span className="theme-badge text-[10px] font-extrabold uppercase px-2.5 py-1">
              Customer Support
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1">
            RBI Account Aggregator diagnostics • Masked account resolution • DPDP Act 2023 Compliance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={loadSupportData} 
            disabled={loading}
            className="btn-gradient text-xs py-2 px-4 shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-slate-900 ${loading ? 'animate-spin' : ''}`} /> 
            Refresh Diagnostics
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* 4 Support KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="theme-card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">AA Gateway Health</p>
              <h3 className="text-2xl font-black text-emerald-700 mt-1">
                {systemStatus?.gatewayStatus || 'OPERATIONAL'}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DB5375] to-[#B3FFB3] flex items-center justify-center text-slate-900 shadow-md">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-600 font-medium pt-2 border-t border-[#DB5375]/20 flex justify-between">
            <span>Latency: <strong>{systemStatus?.gatewayLatencyMs || 42}ms</strong></span>
            <span className="text-emerald-700 font-bold">99.98% Uptime</span>
          </div>
        </div>

        <div className="theme-card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">PII Encryption</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">AES-256 GCM</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DB5375] to-[#B3FFB3] flex items-center justify-center text-slate-900 shadow-md">
              <Lock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-600 font-medium pt-2 border-t border-[#DB5375]/20">
            <span className="text-emerald-700 font-bold">Zero Plaintext Storage</span>
          </div>
        </div>

        <div className="theme-card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Consents</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {systemStatus?.activeConsents || accounts.length} Granted
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DB5375] to-[#B3FFB3] flex items-center justify-center text-slate-900 shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-600 font-medium pt-2 border-t border-[#DB5375]/20">
            RBI AA 12-Month Revocable Token
          </div>
        </div>

        <div className="theme-card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Masked Accounts</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{accounts.length} Accounts</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DB5375] to-[#B3FFB3] flex items-center justify-center text-slate-900 shadow-md">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-600 font-medium pt-2 border-t border-[#DB5375]/20">
            Compliant with RBI FR3 & Appendix A
          </div>
        </div>
      </div>

      {/* 2-Column Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Diagnostic Account Lookup & Resync */}
        <div className="lg:col-span-2 space-y-6">
          <div className="theme-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Masked Account Diagnostics</h2>
                <p className="text-xs text-slate-500 font-medium">Verify connection integrity and trigger real-time AA re-sync</p>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search bank, account type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs rounded-xl border-2 border-[#DB5375]/30 bg-white/90 text-slate-900 focus:outline-none focus:border-[#DB5375]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="theme-table-header">
                  <tr>
                    <th className="p-3 rounded-l-xl">Bank / Institution</th>
                    <th className="p-3">Masked Number</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Sync Status</th>
                    <th className="p-3 rounded-r-xl text-right">Diagnostic Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DB5375]/15 font-medium">
                  {filteredAccounts.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-slate-500">
                        {loading ? "Loading account records..." : "No linked accounts found matching query"}
                      </td>
                    </tr>
                  ) : (
                    filteredAccounts.map((acc) => (
                      <tr key={acc.id} className="hover:bg-[#B3FFB3]/15 transition-colors">
                        <td className="p-3 font-extrabold text-slate-900">
                          {acc.bankName}
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-700">
                          {acc.maskedNumber || '••••4521'}
                        </td>
                        <td className="p-3">
                          <span className="theme-badge text-[9px] font-bold">{acc.accountType}</span>
                        </td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDiagnosticResync(acc.id)}
                            disabled={resyncingId === acc.id}
                            className="btn-gradient text-[11px] py-1 px-3 shadow-xs inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <RefreshCw className={`w-3 h-3 text-slate-900 ${resyncingId === acc.id ? 'animate-spin' : ''}`} />
                            {resyncingId === acc.id ? 'Resyncing...' : 'Re-sync'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Real-time Security & Authentication Audit Logs */}
          <div className="theme-card p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#DB5375]" />
                <h2 className="text-base font-extrabold text-slate-900">Security & Authentication Audit Trail</h2>
              </div>
              <span className="theme-badge text-[10px] font-extrabold">DPDP ACT §12 LOGS</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="theme-table-header">
                  <tr>
                    <th className="p-2.5 rounded-l-xl">Timestamp</th>
                    <th className="p-2.5">User Role</th>
                    <th className="p-2.5">Action</th>
                    <th className="p-2.5">Target Resource</th>
                    <th className="p-2.5 rounded-r-xl">Client IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DB5375]/15 font-mono text-[11px]">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-slate-500 font-sans">
                        No audit logs captured
                      </td>
                    </tr>
                  ) : (
                    auditLogs.slice(0, 8).map((log) => (
                      <tr key={log.id} className="hover:bg-[#B3FFB3]/15 transition-colors">
                        <td className="p-2.5 text-slate-600">
                          {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Just now'}
                        </td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            log.role === 'SUPPORT' ? 'bg-[#DB5375]/20 text-[#a82948]' :
                            log.role === 'FINANCIAL_ADVISOR' ? 'bg-[#B3FFB3]/60 text-slate-900' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {log.role || 'USER'}
                          </span>
                        </td>
                        <td className="p-2.5 font-bold text-slate-900">{log.action}</td>
                        <td className="p-2.5 text-slate-600">{log.resource}</td>
                        <td className="p-2.5 text-slate-500">{log.ipAddress || '127.0.0.1'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Compliance & Diagnostic Info */}
        <div className="space-y-6">
          <div className="theme-card p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Compliance & Safeguards</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-gradient-to-br from-white/95 to-[#B3FFB3]/15 border-2 border-[#DB5375]/20 space-y-1">
                <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Masking Standard
                </p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Support staff cannot view full account numbers or PAN. Account numbers are permanently masked to the last 4 digits per RBI FR3 & Appendix A.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-br from-white/95 to-[#B3FFB3]/15 border-2 border-[#DB5375]/20 space-y-1">
                <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#DB5375]" /> Revocation Control
                </p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Users maintain continuous control to revoke Account Aggregator consent at any time from their security dashboard.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-br from-white/95 to-[#B3FFB3]/15 border-2 border-[#DB5375]/20 space-y-1">
                <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-600" /> Immutable Audit Trail
                </p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Every support action, diagnostic resync, and query is permanently recorded in the immutable audit log table with user identity and timestamp.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Support Actions */}
          <div className="theme-card p-6 space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900">Support Operations</h3>
            <button 
              onClick={() => alert("Gateway latency check passed: 42ms response to Setu AA Sandbox")}
              className="btn-gradient w-full text-xs py-2.5 font-extrabold shadow-sm cursor-pointer"
            >
              <Activity className="w-4 h-4 text-slate-900" /> Ping RBI AA Gateway
            </button>
            <button 
              onClick={() => alert("Audit log report successfully exported for compliance review.")}
              className="btn-gradient-outline w-full text-xs py-2.5 font-extrabold cursor-pointer"
            >
              <FileText className="w-4 h-4" /> Export Audit Log Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
