import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Wallet, PieChart, Target, Zap, 
  ArrowRight, CheckCircle2, TrendingUp, Cpu, Lock
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="theme-badge mb-6 py-1.5 px-4 backdrop-blur-sm shadow-sm font-bold uppercase tracking-wider text-xs gap-2">
              <ShieldCheck className="w-4 h-4 text-[#DB5375]" />
              RBI Account Aggregator & AES-256 Enabled
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Master Your Money with <span className="bg-gradient-to-r from-[#DB5375] via-[#a32d4b] to-[#14532d] bg-clip-text text-transparent">AI-Powered</span> Financial Clarity
            </h1>
            <p className="mt-6 text-lg text-slate-700 leading-relaxed font-medium">
              Consolidate your bank accounts, automate expense categorization, monitor monthly budgets in real-time, track investment portfolios (XIRR), and optimize income tax deductions.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-gradient px-7 py-3.5 text-base shadow-lg shadow-[#DB5375]/30 hover:scale-[1.02]"
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white/90 border border-white/60 text-slate-800 font-bold shadow-md hover:bg-white transition-all backdrop-blur-sm"
              >
                Sign In with Demo Accounts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-white/90 backdrop-blur-md border-y border-white/50 mx-4 sm:mx-6 lg:mx-8 rounded-3xl shadow-xl mb-12">
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
            <div className="theme-card p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#DB5375]/20 to-[#B3FFB3]/50 text-[#DB5375] flex items-center justify-center mb-4 shadow-sm">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Account Aggregation</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Connect up to 10 bank accounts via RBI Account Aggregator framework with 6-hour auto-synchronization and deduplication.
              </p>
            </div>

            <div className="theme-card p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#DB5375]/20 to-[#B3FFB3]/50 text-[#DB5375] flex items-center justify-center mb-4 shadow-sm">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Real-Time Budgets</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Dynamic category spend tracking with instant 80% and 100% threshold notifications, month-end variance, and rollover support.
              </p>
            </div>

            <div className="theme-card p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#DB5375]/20 to-[#B3FFB3]/50 text-[#DB5375] flex items-center justify-center mb-4 shadow-sm">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Financial Goals & SIPs</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Animated circular progress rings with monthly savings needed calculation and intelligent mutual fund SIP scheme suggestions.
              </p>
            </div>

            <div className="theme-card p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#DB5375]/20 to-[#B3FFB3]/50 text-[#DB5375] flex items-center justify-center mb-4 shadow-sm">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Portfolio & Net Worth</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                DEMAT equity and Mutual Fund tracking with true XIRR metrics, 5-asset allocation breakdowns, and consolidated net worth trends.
              </p>
            </div>

            <div className="theme-card p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#DB5375]/20 to-[#B3FFB3]/50 text-[#DB5375] flex items-center justify-center mb-4 shadow-sm">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">AI Financial Advisor</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Personalized 0–850 financial wellness score, 50-30-20 budget models, debt avalanche/snowball simulators, and natural language Q&A.
              </p>
            </div>

            <div className="theme-card p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#DB5375]/20 to-[#B3FFB3]/50 text-[#DB5375] flex items-center justify-center mb-4 shadow-sm">
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
