import React from 'react';
import { Shield, Lock, FileText, HelpCircle, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white/90 backdrop-blur-md text-slate-600 mt-auto border-t border-white/60 shadow-xl">
      <div className="h-1 w-full bg-[#DB5375]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-sm">
          <div>
            <h3 className="text-slate-900 font-extrabold mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#DB5375]" /> Bank-Grade Security
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              AES-256 encryption at rest, TLS 1.3 in transit, and RBI-regulated Account Aggregator compliance protect your financial data.
            </p>
          </div>
          <div>
            <h3 className="text-slate-900 font-extrabold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-xs">
              <li><a href="/dashboard" className="text-slate-600 hover:text-[#DB5375] font-semibold transition-colors">Dashboard</a></li>
              <li><a href="/budget" className="text-slate-600 hover:text-[#DB5375] font-semibold transition-colors">Budget Tracker</a></li>
              <li><a href="/goals" className="text-slate-600 hover:text-[#DB5375] font-semibold transition-colors">Financial Goals</a></li>
              <li><a href="/tax" className="text-slate-600 hover:text-[#DB5375] font-semibold transition-colors">Tax Summary (80C)</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-slate-900 font-extrabold mb-3">Compliance & Privacy</h3>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="text-slate-600 hover:text-[#DB5375] font-semibold transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-600 hover:text-[#DB5375] font-semibold transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-slate-600 hover:text-[#DB5375] font-semibold transition-colors">RBI Account Aggregator Consent</a></li>
              <li><a href="#" className="text-slate-600 hover:text-[#DB5375] font-semibold transition-colors">Security Audit Logs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-slate-900 font-extrabold mb-3">Support & Help</h3>
            <p className="text-xs text-slate-500 mb-2 font-medium">Need assistance with your linked accounts or budgets?</p>
            <span className="inline-block bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs text-[#DB5375] font-mono font-bold shadow-xs">
              support@personalfinance.app
            </span>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 font-medium">
          <p>© 2024 Personal Finance and Budget Management Application. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            Built with Spring Boot 3 & React.js
          </p>
        </div>
      </div>
    </footer>
  );
}
