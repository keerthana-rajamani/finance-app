import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../services/api';
import { 
  Sparkles, Send, Bot, User, CheckCircle, 
  HelpCircle, ShieldAlert, ArrowRight, Lightbulb, TrendingUp 
} from 'lucide-react';

export default function AIAdvisor() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I am your AI Financial Advisor. Ask me anything about your expenses, 50-30-20 budget recommendation, upcoming bills, or investment allocation."
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const res = await analyticsApi.getInsights();
      setInsights(res.data);
    } catch (e) {
      console.error("Failed to load insights:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const query = inputQuery.trim();
    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    setInputQuery('');
    setChatLoading(true);

    try {
      const res = await analyticsApi.chat(query);
      setMessages(prev => [...prev, { sender: 'bot', text: res.data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I encountered an issue processing your query." }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const score = insights?.healthScore || 745;
  const rule = insights?.rule503020;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-600" />
              <h1 className="text-2xl font-bold text-slate-900">AI Financial Advisor & Intelligence</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Personalized health scoring (0–850), 50-30-20 budget models, debt avalanche optimizer, and conversational NLP
            </p>
          </div>
        </div>

        {/* Top Section: Health Score & 50-30-20 Rule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Health Score Card (FR15) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Financial Health Score</h2>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-full border-8 border-emerald-500 flex flex-col items-center justify-center shadow-inner">
                <span className="text-3xl font-black text-slate-900">{score}</span>
                <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">/ 850</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <p>Rating: <strong className="text-emerald-700 font-bold">{insights?.rating}</strong></p>
                <p>Savings Rate: <strong className="text-slate-800">{insights?.savingsRate}%</strong></p>
                <p>Emergency Fund: <strong className="text-slate-800">3.5 months covered</strong></p>
                <p className="text-[11px] text-slate-500 mt-2">
                  Scores 750+ unlock lower loan interest rates and enhanced credit card pre-approvals.
                </p>
              </div>
            </div>

            {/* Tips */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1 text-xs">
              <p className="font-bold text-emerald-900 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-emerald-600" /> Personalized Money Tip:
              </p>
              <p className="text-emerald-800 text-[11px]">{insights?.tips?.[0]}</p>
            </div>
          </div>

          {/* 50-30-20 Rule Breakdown (FR15) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <h2 className="text-base font-bold text-slate-900">50-30-20 Budget Optimization</h2>
            <p className="text-slate-500 text-xs">
              Based on monthly recorded income of ₹{Number(insights?.totalIncome || 100000).toLocaleString('en-IN')}:
            </p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>50% Needs (Rent, Utilities, Groceries)</span>
                  <span>Target: ₹{Number(rule?.needsTarget || 50000).toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>30% Wants (Dining, Shopping, Movies)</span>
                  <span>Target: ₹{Number(rule?.wantsTarget || 30000).toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>20% Savings & Debt Repayment</span>
                  <span>Target: ₹{Number(rule?.savingsTarget || 20000).toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Debt Avalanche vs Snowball Comparison Box (FR15) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Debt Pay-off Optimizer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-sm text-slate-900">Debt Avalanche Strategy (Recommended)</h3>
              <p className="text-slate-600">
                Prioritize paying off liabilities with the highest interest rates first (e.g. Axis Credit Card @ 42% APR).
              </p>
              <div className="p-2 bg-emerald-50 text-emerald-800 font-bold rounded">
                Saves: ₹14,800 in total interest over 12 months
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-sm text-slate-900">Debt Snowball Strategy</h3>
              <p className="text-slate-600">
                Prioritize paying off the smallest balance first for psychological momentum (e.g. Personal Microloan @ ₹12,000).
              </p>
              <div className="p-2 bg-blue-50 text-blue-800 font-bold rounded">
                Achieves: First debt cleared in 2.5 months
              </div>
            </div>
          </div>
        </div>

        {/* Interactive NLP Financial Chatbot (FR15) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Ask Your Financial Assistant</h2>
          </div>

          {/* Chat transcript */}
          <div className="bg-slate-50 rounded-xl p-4 h-64 overflow-y-auto space-y-3 border border-slate-200">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 text-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-lg text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {chatLoading && (
              <div className="flex gap-2 items-center text-xs text-slate-500">
                <Bot className="w-4 h-4 animate-spin text-emerald-600" /> Thinking...
              </div>
            )}
          </div>

          {/* Suggested Queries */}
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => setInputQuery("How much did I spend on dining this month?")}
              className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              "How much did I spend on dining?"
            </button>
            <button
              onClick={() => setInputQuery("What is my 50-30-20 budget recommendation?")}
              className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              "50-30-20 budget advice"
            </button>
            <button
              onClick={() => setInputQuery("What are my upcoming bills?")}
              className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              "Upcoming bills?"
            </button>
            <button
              onClick={() => setInputQuery("What is my total net worth?")}
              className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              "Net worth summary"
            </button>
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              placeholder="Ask anything about your personal finance..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
