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
              <ShieldCheck className="w-4 h-4 text-[#0E7490]" />
              RBI Account Aggregator & AES-256 Enabled
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#082F49] tracking-tight leading-tight">
              Master Your Money with <span className="text-[#0E7490]">AI-Powered</span> Financial Clarity
            </h1>
            <p className="mt-6 text-lg text-[#082F49]/80 leading-relaxed font-medium">
              Consolidate your bank accounts, automate expense categorization, monitor monthly budgets in real-time, track investment portfolios (XIRR), and optimize income tax deductions.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-gradient px-7 py-3.5 text-base shadow-lg shadow-[#0E7490]/20"
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="btn-gradient-outline px-7 py-3.5 text-base"
              >
                Sign In with Demo Accounts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-[#F0FDFF]/92 backdrop-blur-md border-2 border-[#BAE6FD] mx-4 sm:mx-6 lg:mx-8 rounded-3xl shadow-xl mb-12 fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#082F49]">
              Enterprise Personal Finance Architecture
            </h2>
            <p className="mt-3 text-[#082F49]/70 text-sm">
              Comprehensive capabilities engineered strictly according to bank-grade regulatory specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="theme-card p-6 floating-card">
              <div className="w-12 h-12 rounded-xl bg-[#BAE6FD]/40 border border-[#BAE6FD] text-[#0E7490] flex items-center justify-center mb-4 shadow-xs">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#082F49] mb-2">Account Aggregation</h3>
              <p className="text-[#082F49]/70 text-sm leading-relaxed">
                Connect up to 10 bank accounts via RBI Account Aggregator framework with 6-hour auto-synchronization and deduplication.
              </p>
            </div>

            <div className="theme-card p-6 floating-card">
              <div className="w-12 h-12 rounded-xl bg-[#BAE6FD]/40 border border-[#BAE6FD] text-[#0E7490] flex items-center justify-center mb-4 shadow-xs">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#082F49] mb-2">Real-Time Budgets</h3>
              <p className="text-[#082F49]/70 text-sm leading-relaxed">
                Dynamic category spend tracking with instant 80% and 100% threshold notifications, month-end variance, and rollover support.
              </p>
            </div>

            <div className="theme-card p-6 floating-card">
              <div className="w-12 h-12 rounded-xl bg-[#BAE6FD]/40 border border-[#BAE6FD] text-[#0E7490] flex items-center justify-center mb-4 shadow-xs">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#082F49] mb-2">Financial Goals & SIPs</h3>
              <p className="text-[#082F49]/70 text-sm leading-relaxed">
                Animated circular progress rings with monthly savings needed calculation and intelligent mutual fund SIP scheme suggestions.
              </p>
            </div>

            <div className="theme-card p-6 floating-card">
              <div className="w-12 h-12 rounded-xl bg-[#BAE6FD]/40 border border-[#BAE6FD] text-[#0E7490] flex items-center justify-center mb-4 shadow-xs">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#082F49] mb-2">Portfolio & Net Worth</h3>
              <p className="text-[#082F49]/70 text-sm leading-relaxed">
                DEMAT equity and Mutual Fund tracking with true XIRR metrics, 5-asset allocation breakdowns, and consolidated net worth trends.
              </p>
            </div>

            <div className="theme-card p-6 floating-card">
              <div className="w-12 h-12 rounded-xl bg-[#BAE6FD]/40 border border-[#BAE6FD] text-[#0E7490] flex items-center justify-center mb-4 shadow-xs">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#082F49] mb-2">AI Financial Advisor</h3>
              <p className="text-[#082F49]/70 text-sm leading-relaxed">
                Personalized 0–850 financial wellness score, 50-30-20 budget models, debt avalanche/snowball simulators, and natural language Q&A.
              </p>
            </div>

            <div className="theme-card p-6 floating-card">
              <div className="w-12 h-12 rounded-xl bg-[#BAE6FD]/40 border border-[#BAE6FD] text-[#0E7490] flex items-center justify-center mb-4 shadow-xs">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#082F49] mb-2">Tax Filing Assistance</h3>
              <p className="text-[#082F49]/70 text-sm leading-relaxed">
                Automated LTCG/STCG capital gains calculation, Section 80C deduction trackers (₹1.5L ceiling), and quarterly advance tax dates.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
