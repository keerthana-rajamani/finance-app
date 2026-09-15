import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, Lock, FileText, CheckCircle2, AlertTriangle, 
  ExternalLink, Eye, KeyRound, Server, UserCheck, Scale, ArrowLeft
} from 'lucide-react';

export default function CompliancePrivacy() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(queryTab || 'all');

  useEffect(() => {
    if (queryTab && ['all', 'privacy', 'rbi-aa', 'terms', 'security'].includes(queryTab)) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

  const handleTabSelect = (tabId) => {
    setActiveTab(tabId);
    setSearchParams(tabId === 'all' ? {} : { tab: tabId });
  };

  const tabs = [
    { id: 'all', label: 'Overview & Highlights' },
    { id: 'privacy', label: 'Privacy Policy (DPDP Act)' },
    { id: 'rbi-aa', label: 'RBI Account Aggregator' },
    { id: 'terms', label: 'Terms of Service' },
    { id: 'security', label: 'Security & Encryption' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 mb-6 text-xs text-[#082F49]/80 font-semibold">
        <Link to="/" className="hover:text-[#0E7490] flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <span>/</span>
        <span className="text-[#082F49] font-extrabold">Compliance & Privacy Center</span>
      </div>

      {/* Header Banner */}
      <div className="theme-card p-8 mb-8 relative overflow-hidden floating-card">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0E7490]" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BAE6FD]/40 border border-[#BAE6FD] text-[#0E7490] text-xs font-extrabold mb-3">
              <ShieldCheck className="w-4 h-4 text-[#0E7490]" />
              RBI & DPDP Act 2023 Regulatory Adherence
            </div>
            <h1 className="text-3xl font-black text-[#082F49] tracking-tight">
              Compliance & Data Privacy Center
            </h1>
            <p className="mt-2 text-sm text-[#082F49]/70 max-w-2xl leading-relaxed">
              We uphold bank-grade security, complete transparent consent architecture, and zero plaintext storage. Read how your financial assets and privacy rights are safeguarded.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="theme-badge-mint text-xs font-bold py-1 px-3">
              <CheckCircle2 className="w-3.5 h-3.5" /> AES-256 Active
            </span>
            <span className="theme-badge text-xs font-bold py-1 px-3">
              <KeyRound className="w-3.5 h-3.5" /> RBI NBFC-AA Read-Only
            </span>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-[#BAE6FD]/40">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabSelect(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#0E7490] text-white shadow-md -translate-y-0.5'
                  : 'bg-[#F0FDFF] text-[#082F49] border border-[#BAE6FD] hover:bg-white hover:text-[#0E7490]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Pillars Summary Cards */}
      {(activeTab === 'all') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="theme-card p-6 floating-card">
            <div className="w-10 h-10 rounded-xl bg-[#BAE6FD]/40 border border-[#BAE6FD] text-[#0E7490] flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-[#082F49] mb-1">RBI Account Aggregator</h3>
            <p className="text-xs text-[#082F49]/70 leading-relaxed">
              12-month explicit consent token with instant 1-click user revocation. Zero write or fund-transfer permissions.
            </p>
          </div>

          <div className="theme-card p-6 floating-card">
            <div className="w-10 h-10 rounded-xl bg-[#BAE6FD]/40 border border-[#BAE6FD] text-[#0E7490] flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-[#082F49] mb-1">Bank-Grade Encryption</h3>
            <p className="text-xs text-[#082F49]/70 leading-relaxed">
              AES-256 GCM cryptographic encryption at rest, TLS 1.3 in transit, and SHA-256 one-way hashing for PAN credentials.
            </p>
          </div>

          <div className="theme-card p-6 floating-card">
            <div className="w-10 h-10 rounded-xl bg-[#BAE6FD]/40 border border-[#BAE6FD] text-[#0E7490] flex items-center justify-center mb-3">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-[#082F49] mb-1">DPDP Act 2023 Rights</h3>
            <p className="text-xs text-[#082F49]/70 leading-relaxed">
              Full rights of data access, rectification, portability, and permanent erasure upon account closure.
            </p>
          </div>

          <div className="theme-card p-6 floating-card">
            <div className="w-10 h-10 rounded-xl bg-[#BAE6FD]/40 border border-[#BAE6FD] text-[#0E7490] flex items-center justify-center mb-3">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-[#082F49] mb-1">Immutable Audit Logs</h3>
            <p className="text-xs text-[#082F49]/70 leading-relaxed">
              Every data synchronization, authentication event, and diagnostic check is preserved in tamper-evident logs.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* SECTION 1: Privacy Policy */}
        {(activeTab === 'all' || activeTab === 'privacy') && (
          <section className="theme-card p-8 floating-card space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#BAE6FD]/40">
              <div className="w-10 h-10 rounded-xl bg-[#BAE6FD]/40 border border-[#BAE6FD] text-[#0E7490] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#082F49]">1. Data Privacy Policy & DPDP Act 2023</h2>
                <p className="text-xs text-[#082F49]/70 font-medium">Last updated: September 2026 • Governing Law: Digital Personal Data Protection Act, 2023</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-[#082F49]/80 leading-relaxed">
              <div>
                <h3 className="font-bold text-sm text-[#082F49] mb-1">1.1 Information We Collect</h3>
                <p>
                  To provide automated budget categorization, net worth consolidation, and income tax deduction tracking, we process:
                </p>
                <ul className="list-disc pl-5 mt-1.5 space-y-1 text-[#082F49]/70">
                  <li><strong>Account Identity:</strong> User's name, email address, and 10-digit mobile number for multi-factor authentication.</li>
                  <li><strong>Financial Data:</strong> Bank account balances, transaction records (timestamp, merchant narration, amount, category), DEMAT investment holdings, and recurring bill schedules.</li>
                  <li><strong>Tax Identifiers:</strong> Optional Permanent Account Number (PAN) used solely for Section 80C deduction computations, stored exclusively as a one-way cryptographic SHA-256 hash.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-sm text-[#082F49] mb-1">1.2 Purpose Limitation & Non-Disclosure</h3>
                <p>
                  Personal financial data is collected solely for direct application services: budget monitoring, goal savings projections, and advisory analytics. 
                  <strong> We never sell, rent, or monetize your financial transaction history to third-party ad networks, credit bureaus, or loan brokers.</strong>
                </p>
              </div>

              <div>
                <h3 className="font-bold text-sm text-[#082F49] mb-1">1.3 User Privacy Rights under DPDP Act</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                  <div className="p-3 bg-[#F0FDFF] border border-[#BAE6FD] rounded-xl">
                    <h4 className="font-bold text-[#082F49] mb-1">Right to Access & Export</h4>
                    <p className="text-[11px] text-[#082F49]/70">Export your consolidated transaction ledgers, investment portfolios, and tax records in JSON/CSV formats at any time.</p>
                  </div>
                  <div className="p-3 bg-[#F0FDFF] border border-[#BAE6FD] rounded-xl">
                    <h4 className="font-bold text-[#082F49] mb-1">Right to Erasure</h4>
                    <p className="text-[11px] text-[#082F49]/70">Request permanent deletion of all stored financial data and Account Aggregator tokens with immediate server purge.</p>
                  </div>
                  <div className="p-3 bg-[#F0FDFF] border border-[#BAE6FD] rounded-xl">
                    <h4 className="font-bold text-[#082F49] mb-1">Consent Revocation</h4>
                    <p className="text-[11px] text-[#082F49]/70">Revoke linked bank synchronization with a single click. No residual background queries will be dispatched.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 2: RBI Account Aggregator Framework */}
        {(activeTab === 'all' || activeTab === 'rbi-aa') && (
          <section className="theme-card p-8 floating-card space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#BAE6FD]/40">
              <div className="w-10 h-10 rounded-xl bg-[#BAE6FD]/40 border border-[#BAE6FD] text-[#0E7490] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#082F49]">2. RBI Account Aggregator (AA) Consent Standards</h2>
                <p className="text-xs text-[#082F49]/70 font-medium">Compliance with Reserve Bank of India Master Direction - Non-Banking Financial Company - Account Aggregator (Directions), 2016</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-[#082F49]/80 leading-relaxed">
              <p>
                Our platform interfaces exclusively via regulated Financial Information Providers (FIPs) and Financial Information Users (FIUs) within the RBI Account Aggregator ecosystem (Sahamati framework).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#F0FDFF] border border-[#BAE6FD] rounded-xl space-y-2">
                  <h4 className="font-bold text-[#082F49] text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> Read-Only Data Architecture
                  </h4>
                  <p className="text-[#082F49]/70 text-[11px]">
                    The Account Aggregator pipeline is strictly read-only. The application has zero permission to initiate debits, execute bank transfers, or alter customer mandates. Your internet banking credentials or OTPs are never collected or stored.
                  </p>
                </div>

                <div className="p-4 bg-[#F0FDFF] border border-[#BAE6FD] rounded-xl space-y-2">
                  <h4 className="font-bold text-[#082F49] text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> Granular Consent Parameters
                  </h4>
                  <p className="text-[#082F49]/70 text-[11px]">
                    Consent is granted explicitly by you for defined bank accounts for a maximum duration of 12 months with 6-hour periodic synchronization. You retain the ability to pause or terminate synchronization at any moment.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-[#BAE6FD]/30 border border-[#BAE6FD] rounded-xl flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-[#0E7490] flex-shrink-0" />
                <span className="text-[11px] text-[#082F49] font-medium">
                  <strong>Consent Verification:</strong> Every linked account consent artifact is cryptographically signed with the user's private session key and verified through the RBI AA Central Registry.
                </span>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 3: Terms of Service */}
        {(activeTab === 'all' || activeTab === 'terms') && (
          <section className="theme-card p-8 floating-card space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#BAE6FD]/40">
              <div className="w-10 h-10 rounded-xl bg-[#BAE6FD]/40 border border-[#BAE6FD] text-[#0E7490] flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#082F49]">3. Terms of Service & Disclaimer</h2>
                <p className="text-xs text-[#082F49]/70 font-medium">User Agreement, Responsibilities & Advisory Limitations</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-[#082F49]/80 leading-relaxed">
              <div>
                <h3 className="font-bold text-sm text-[#082F49] mb-1">3.1 Role-Based Access Governance</h3>
                <p>
                  The platform enforces strict boundaries across user roles:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-[#082F49]/70">
                  <li><strong>Primary Users:</strong> Full administrative rights over bank linkages, personal budgets, and account configurations.</li>
                  <li><strong>Family Members:</strong> Shared access strictly limited to designated household budget categories and split expense ledgers without access to private accounts or tax records.</li>
                  <li><strong>Financial Advisors:</strong> Read-only access to portfolio XIRR performance and asset distribution metrics; barred from financial transactions.</li>
                  <li><strong>Support Agents:</strong> Operational diagnostics with fully masked account identifiers (<code className="bg-[#BAE6FD]/40 px-1 py-0.5 rounded font-mono">••••4521</code>) and zero visibility into personal transaction descriptions.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-sm text-[#082F49] mb-1">3.2 AI Financial Advisory Disclaimer</h3>
                <p className="text-[#082F49]/70">
                  Insights generated by the AI Financial Advisor (including the 0–850 financial wellness score, 50-30-20 budget split recommendations, and debt payoff simulations) are automated computational models for educational and planning purposes only. They do not constitute formal investment advice or SEBI-registered portfolio management services.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 4: Security & Audit Logging */}
        {(activeTab === 'all' || activeTab === 'security') && (
          <section className="theme-card p-8 floating-card space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#BAE6FD]/40">
              <div className="w-10 h-10 rounded-xl bg-[#BAE6FD]/40 border border-[#BAE6FD] text-[#0E7490] flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#082F49]">4. Bank-Grade Security & Audit Logging</h2>
                <p className="text-xs text-[#082F49]/70 font-medium">Cryptographic Specifications, Encryption at Rest & Audit Trails</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-[#082F49]/80 leading-relaxed">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#F0FDFF] border border-[#BAE6FD] rounded-xl">
                  <span className="font-mono text-xs font-bold text-[#0E7490] block mb-1">AES-256 GCM</span>
                  <h4 className="font-bold text-[#082F49] mb-1">Encryption at Rest</h4>
                  <p className="text-[11px] text-[#082F49]/70">All database records, transaction amounts, and customer credentials are encrypted with Galois/Counter Mode authentication.</p>
                </div>

                <div className="p-4 bg-[#F0FDFF] border border-[#BAE6FD] rounded-xl">
                  <span className="font-mono text-xs font-bold text-[#0E7490] block mb-1">TLS 1.3 Strict</span>
                  <h4 className="font-bold text-[#082F49] mb-1">Encryption in Transit</h4>
                  <p className="text-[11px] text-[#082F49]/70">Zero cleartext data over wire. Perfect forward secrecy enabled on all API endpoints and WebSocket channels.</p>
                </div>

                <div className="p-4 bg-[#F0FDFF] border border-[#BAE6FD] rounded-xl">
                  <span className="font-mono text-xs font-bold text-[#0E7490] block mb-1">SHA-256 Hash</span>
                  <h4 className="font-bold text-[#082F49] mb-1">One-Way PII Protection</h4>
                  <p className="text-[11px] text-[#082F49]/70">PAN credentials and authentication tokens are irreversible one-way hashed with cryptographically salted digests.</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-[#082F49] mb-1">4.1 Immutable Security Audit Trail</h3>
                <p className="text-[#082F49]/70">
                  In compliance with ISO 27001 and DPDP security guidelines, our backend automatically logs every security-relevant action (timestamp, user role, action type, IP hash, and status) into an append-only audit stream accessible via the Support Console.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Grievance & Support Officer Footer Card */}
      <div className="theme-card p-6 mt-10 floating-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-extrabold text-sm text-[#082F49]">Data Protection Officer & Grievance Redressal</h3>
            <p className="text-xs text-[#082F49]/70 mt-1">
              For privacy requests, data deletion inquiries, or regulatory compliance escalations:
            </p>
            <div className="mt-2 flex flex-wrap gap-4 text-xs font-mono">
              <span className="text-[#082F49]"><strong>Officer:</strong> Grievance Redressal Officer</span>
              <span className="text-[#0E7490] font-bold">dpo@personalfinance.app</span>
              <span className="text-[#082F49]/60">Response turnaround: within 48 business hours</span>
            </div>
          </div>
          <Link
            to="/dashboard"
            className="btn-gradient text-xs py-2.5 px-5 font-bold shadow-md"
          >
            Go to My Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
