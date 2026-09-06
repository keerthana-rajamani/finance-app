import React from 'react';
import { Shield, Lock, FileText, HelpCircle, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-sm">
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" /> Bank-Grade Security
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              AES-256 encryption at rest, TLS 1.3 in transit, and RBI-regulated Account Aggregator compliance protect your financial data.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-xs">
              <li><a href="/dashboard" className="hover:text-emerald-400 transition-colors">Dashboard</a></li>
              <li><a href="/budget" className="hover:text-emerald-400 transition-colors">Budget Tracker</a></li>
              <li><a href="/goals" className="hover:text-emerald-400 transition-colors">Financial Goals</a></li>
              <li><a href="/tax" className="hover:text-emerald-400 transition-colors">Tax Summary (80C)</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Compliance & Privacy</h3>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">RBI Account Aggregator Consent</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Security Audit Logs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Support & Help</h3>
            <p className="text-xs text-slate-400 mb-2">Need assistance with your linked accounts or budgets?</p>
            <span className="inline-block bg-slate-800 px-3 py-1.5 rounded text-xs text-emerald-400 font-mono">
              support@personalfinance.app
            </span>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2024 Personal Finance and Budget Management Application. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            Built with Spring Boot 3 & React.js
          </p>
        </div>
      </div>
    </footer>
  );
}
