import React, { useState, useEffect, useRef } from 'react';
import { analyticsApi } from '../services/api';
import { 
  Sparkles, Send, Bot, User, CheckCircle, 
  HelpCircle, ShieldAlert, ArrowRight, Lightbulb, TrendingUp,
  RotateCcw, ShieldCheck, Zap
} from 'lucide-react';

export default function AIAdvisor() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I am your AI Financial Advisor. I have synchronized with your bank accounts, budget categories, and investment portfolio in PostgreSQL.\n\nAsk me anything about your spending trends, 50-30-20 budget recommendations, Section 80C tax optimization, upcoming bills, or financial goals!"
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    loadInsights();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatLoading]);

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

  const submitQuery = async (queryText) => {
    if (!queryText || !queryText.trim()) return;

    const query = queryText.trim();
    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    setInputQuery('');
    setChatLoading(true);

    try {
      const res = await analyticsApi.chat(query);
      const botResponse = res.data?.answer || "I have analyzed your request. Please check your financial dashboard for updated numbers.";
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    } catch (err) {
      setMessages(prev => [
        ...prev, 
        { sender: 'bot', text: "I encountered an error retrieving data. Please check your backend connection or try again." }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    submitQuery(inputQuery);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitQuery(inputQuery);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        sender: 'bot',
        text: "Conversation refreshed. How can I assist with your personal finances today?"
      }
    ]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
      </div>
    );
  }

  const score = insights?.healthScore || 745;
  const rule = insights?.rule503020;

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#DB5375]" />
              <h1 className="text-2xl font-bold text-slate-900">AI Financial Advisor & Intelligence</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Personalized health scoring (0–850), 50-30-20 budget models, debt avalanche optimizer, and conversational NLP
            </p>
          </div>
        </div>

        {/* Top Section: Health Score & 50-30-20 Rule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Health Score Card (FR15) */}
          <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg space-y-4">
            <h2 className="text-base font-bold text-slate-900">Financial Health Score</h2>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-full border-8 border-[#DB5375] flex flex-col items-center justify-center shadow-inner">
                <span className="text-3xl font-black text-slate-900">{score}</span>
                <span className="text-[10px] uppercase font-bold text-[#DB5375] tracking-wider">/ 850</span>
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
              <p className="text-slate-700 leading-relaxed">
                {insights?.tips?.[0] || "Maintain at least 3 months of essential fixed expenses in an instant-access liquid fund."}
              </p>
            </div>
          </div>

          {/* 50-30-20 Rule Breakdown (FR15) */}
          <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg space-y-4 text-xs">
            <h2 className="text-base font-bold text-slate-900">50-30-20 Budget Optimization</h2>
            <p className="text-slate-500 text-xs">
              Based on monthly recorded income of ₹{Number(insights?.totalIncome || 125000).toLocaleString('en-IN')}:
            </p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>50% Needs (Rent, Utilities, Groceries)</span>
                  <span>Target: ₹{Number(rule?.needsTarget || 62500).toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>30% Wants (Dining, Shopping, Movies)</span>
                  <span>Target: ₹{Number(rule?.wantsTarget || 37500).toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>20% Savings & Debt Repayment</span>
                  <span>Target: ₹{Number(rule?.savingsTarget || 25000).toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Debt Avalanche vs Snowball Comparison Box (FR15) */}
        <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg space-y-4">
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
        <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-[#DB5375]" />
              <h2 className="text-base font-bold text-slate-900">Interactive AI Financial Assistant</h2>
            </div>
            <button
              onClick={clearChat}
              className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 transition-colors"
              title="Reset Chat"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear History
            </button>
          </div>

          {/* Chat transcript */}
          <div className="bg-slate-50 rounded-xl p-4 h-80 overflow-y-auto space-y-3 border border-slate-200">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-[#B3FFB3]/40 text-[#DB5375] flex items-center justify-center flex-shrink-0 text-xs shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-xl text-xs leading-relaxed whitespace-pre-line ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-[#DB5375] to-[#ff7c9b] text-white rounded-br-none shadow-sm font-medium'
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
              <div className="flex gap-2 items-center text-xs text-emerald-600 font-medium bg-emerald-50/50 p-2 rounded-lg w-fit">
                <Bot className="w-4 h-4 animate-spin" /> Analyzing your financial data...
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick-Prompt Chips */}
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Suggested Financial Queries (Click to Ask):
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => submitQuery("Analyze my food and dining expenses")}
                className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 transition-all text-[11px]"
              >
                🍔 Food & Dining Spend
              </button>
              <button
                onClick={() => submitQuery("What is my 50-30-20 budget recommendation?")}
                className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 transition-all text-[11px]"
              >
                📊 50-30-20 Budget Rule
              </button>
              <button
                onClick={() => submitQuery("How can I save tax under Section 80C?")}
                className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 transition-all text-[11px]"
              >
                💡 Section 80C Tax Headroom
              </button>
              <button
                onClick={() => submitQuery("Review my investment portfolio and XIRR")}
                className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 transition-all text-[11px]"
              >
                📈 Portfolio & XIRR
              </button>
              <button
                onClick={() => submitQuery("What are my active goals and required monthly savings?")}
                className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 transition-all text-[11px]"
              >
                🎯 Goal Savings Plan
              </button>
              <button
                onClick={() => submitQuery("What are my upcoming recurring bills?")}
                className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 transition-all text-[11px]"
              >
                ⚡ Upcoming Bills
              </button>
              <button
                onClick={() => submitQuery("Should I use Debt Avalanche or Snowball to pay off my loans?")}
                className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 transition-all text-[11px]"
              >
                ⚖️ Debt Avalanche Strategy
              </button>
              <button
                onClick={() => submitQuery("How much should I keep in my emergency fund?")}
                className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 transition-all text-[11px]"
              >
                🛡️ Emergency Fund Adequacy
              </button>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleFormSubmit} className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Ask anything about your personal finance..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={chatLoading || !inputQuery.trim()}
              className="px-5 py-2.5 btn-gradient rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-slate-900" /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
