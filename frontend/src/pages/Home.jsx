import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Wallet, PieChart, Target, Zap, 
  ArrowRight, CheckCircle2, TrendingUp, Cpu, Lock
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#DB5375]/[0.08] via-white to-slate-50 pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#DB5375]/15 to-[#B3FFB3]/40 text-slate-900 border border-[#DB5375]/30 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#DB5375]" />
              RBI Account Aggregator & AES-256 Enabled
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Master Your Money with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DB5375] via-[#e56787] to-[#15803d]">AI-Powered</span> Financial Clarity
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              Consolidate your bank accounts, automate expense categorization, monitor monthly budgets in real-time, track investment portfolios (XIRR), and optimize income tax deductions.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#DB5375] to-[#B3FFB3] text-slate-900 font-bold shadow-lg shadow-[#DB5375]/25 hover:opacity-95 hover:shadow-xl transition-all"
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold shadow-sm hover:bg-slate-50 transition-all"
              >
                Sign In with Demo Accounts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Enterprise Personal Finance Architecture
            </h2>
            <p className="mt-3 text-slate-600 text-sm">
              Comprehensive capabilities engineered strictly according to bank-grade regulatory specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Account Aggregation</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Connect up to 10 bank accounts via RBI Account Aggregator framework with 6-hour auto-synchronization and deduplication.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Real-Time Budgets</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Dynamic category spend tracking with instant 80% and 100% threshold notifications, month-end variance, and rollover support.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Financial Goals & SIPs</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Animated circular progress rings with monthly savings needed calculation and intelligent mutual fund SIP scheme suggestions.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Portfolio & Net Worth</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                DEMAT equity and Mutual Fund tracking with true XIRR metrics, 5-asset allocation breakdowns, and consolidated net worth trends.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">AI Financial Advisor</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Personalized 0–850 financial wellness score, 50-30-20 budget models, debt avalanche/snowball simulators, and natural language Q&A.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Tax Filing Assistance</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Automated LTCG/STCG capital gains calculation, Section 80C deduction trackers (₹1.5L ceiling), and quarterly advance tax dates.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
