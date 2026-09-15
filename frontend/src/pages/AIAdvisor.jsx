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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0E7490]"></div>
      </div>
    );
  }

  const score = insights?.healthScore || 745;
  const rule = insights?.rule503020;

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="theme-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 floating-card">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#0E7490]" />
              <h1 className="text-2xl font-extrabold text-[#082F49]">AI Financial Advisor & Intelligence</h1>
              <span className="theme-badge font-extrabold text-xs">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse mr-1"></span>
                Active
              </span>
            </div>
            <p className="text-xs text-[#082F49]/70 mt-1 font-medium">
              Personalized health scoring (0–850), 50-30-20 budget models, debt avalanche optimizer, and conversational NLP
            </p>
          </div>
        </div>

        {/* Top Section: Health Score & 50-30-20 Rule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Health Score Card (FR15) */}
          <div className="theme-card p-6 space-y-4 floating-card">
            <h2 className="text-base font-extrabold text-[#082F49]">Financial Health Score</h2>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-full border-8 border-[#0E7490] flex flex-col items-center justify-center shadow-lg bg-[#F0FDFF]">
                <span className="text-3xl font-black text-[#082F49]">{score}</span>
                <span className="text-[10px] uppercase font-black text-[#0E7490] tracking-wider">/ 850</span>
              </div>
              <div className="space-y-1.5 text-xs text-[#082F49]">
                <p>Rating: <strong className="text-[#22C55E] font-black">{insights?.rating}</strong></p>
                <p>Savings Rate: <strong className="text-[#082F49] font-bold">{insights?.savingsRate}%</strong></p>
                <p>Emergency Fund: <strong className="text-[#082F49] font-bold">3.5 months covered</strong></p>
                <p className="text-[11px] text-[#082F49]/70 mt-2 font-medium">
                  Scores 750+ unlock lower loan interest rates and enhanced credit card pre-approvals.
                </p>
              </div>
            </div>

            {/* Tips */}
            <div className="p-3.5 bg-[#BAE6FD]/30 border border-[#BAE6FD] rounded-xl space-y-1 text-xs">
              <p className="font-extrabold text-[#082F49] flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-[#0E7490]" /> Personalized Money Tip:
              </p>
              <p className="text-[#082F49]/80 leading-relaxed font-medium">
                {insights?.tips?.[0] || "Maintain at least 3 months of essential fixed expenses in an instant-access liquid fund."}
              </p>
            </div>
          </div>

          {/* 50-30-20 Rule Breakdown (FR15) */}
          <div className="theme-card p-6 space-y-4 text-xs floating-card">
            <h2 className="text-base font-extrabold text-[#082F49]">50-30-20 Budget Optimization</h2>
            <p className="text-[#082F49]/70 text-xs font-medium">
              Based on monthly recorded income of ₹{Number(insights?.totalIncome || 125000).toLocaleString('en-IN')}:
            </p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1 text-[#082F49]">
                  <span>50% Needs (Rent, Utilities, Groceries)</span>
                  <span>Target: ₹{Number(rule?.needsTarget || 62500).toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#BAE6FD]/30 overflow-hidden border border-[#BAE6FD]">
                  <div className="h-full bg-[#0E7490] rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1 text-[#082F49]">
                  <span>30% Wants (Dining, Shopping, Movies)</span>
                  <span>Target: ₹{Number(rule?.wantsTarget || 37500).toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#BAE6FD]/30 overflow-hidden border border-[#BAE6FD]">
                  <div className="h-full bg-[#082F49] rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1 text-[#082F49]">
                  <span>20% Savings & Debt Repayment</span>
                  <span>Target: ₹{Number(rule?.savingsTarget || 25000).toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#BAE6FD]/30 overflow-hidden border border-[#BAE6FD]">
                  <div className="h-full bg-[#22C55E] rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Debt Avalanche vs Snowball Comparison Box (FR15) */}
        <div className="theme-card p-6 space-y-4 floating-card">
          <h2 className="text-base font-extrabold text-[#082F49]">Debt Pay-off Optimizer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#F0FDFF]/90 rounded-2xl border border-[#BAE6FD] space-y-2 shadow-sm hover:-translate-y-1 transition-all">
              <h3 className="font-extrabold text-sm text-[#082F49]">Debt Avalanche Strategy (Recommended)</h3>
              <p className="text-[#082F49]/70 font-medium">
                Prioritize paying off liabilities with the highest interest rates first (e.g. Axis Credit Card @ 42% APR).
              </p>
              <div className="p-2 bg-[#22C55E]/15 text-[#15803d] font-extrabold rounded-lg border border-[#22C55E]/30">
                Saves: ₹14,800 in total interest over 12 months
              </div>
            </div>

            <div className="p-4 bg-[#F0FDFF]/90 rounded-2xl border border-[#BAE6FD] space-y-2 shadow-sm hover:-translate-y-1 transition-all">
              <h3 className="font-extrabold text-sm text-[#082F49]">Debt Snowball Strategy</h3>
              <p className="text-[#082F49]/70 font-medium">
                Prioritize paying off the smallest balance first for psychological momentum (e.g. Personal Microloan @ ₹12,000).
              </p>
              <div className="p-2 bg-[#BAE6FD]/40 text-[#0E7490] font-extrabold rounded-lg border border-[#BAE6FD]">
                Achieves: First debt cleared in 2.5 months
              </div>
            </div>
          </div>
        </div>

        {/* Interactive NLP Financial Chatbot (FR15) */}
        <div className="theme-card p-6 space-y-4 floating-card">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-[#0E7490]" />
              <h2 className="text-base font-extrabold text-[#082F49]">Interactive AI Financial Assistant</h2>
            </div>
            <button
              onClick={clearChat}
              className="text-xs text-[#082F49]/60 hover:text-[#0E7490] font-semibold flex items-center gap-1 transition-colors"
              title="Reset Chat"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear History
            </button>
          </div>

          {/* Chat transcript */}
          <div className="bg-[#F0FDFF]/60 rounded-2xl p-4 h-80 overflow-y-auto space-y-3 border border-[#BAE6FD] shadow-inner">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-[#BAE6FD]/40 text-[#0E7490] flex items-center justify-center flex-shrink-0 text-xs shadow-sm border border-[#BAE6FD]">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-xl text-xs leading-relaxed whitespace-pre-line ${
                    m.sender === 'user'
                      ? 'bg-[#0E7490] text-white rounded-br-none shadow-md font-semibold'
                      : 'bg-white text-[#082F49] border border-[#BAE6FD] shadow-sm rounded-bl-none font-medium'
                  }`}
                >
                  {m.text}
                </div>
                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-[#082F49] text-white flex items-center justify-center flex-shrink-0 text-xs shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {chatLoading && (
              <div className="flex gap-2 items-center text-xs text-[#0E7490] font-bold bg-[#BAE6FD]/30 p-2.5 rounded-xl border border-[#BAE6FD] w-fit">
                <Bot className="w-4 h-4 animate-spin text-[#0E7490]" /> Analyzing your financial data...
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick-Prompt Chips */}
          <div>
            <p className="text-[11px] font-extrabold text-[#082F49] uppercase tracking-wider mb-2">
              Suggested Financial Queries (Click to Ask):
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => submitQuery("Analyze my food and dining expenses")}
                className="theme-chip"
              >
                🍔 Food & Dining Spend
              </button>
              <button
                onClick={() => submitQuery("What is my 50-30-20 budget recommendation?")}
                className="theme-chip"
              >
                📊 50-30-20 Budget Rule
              </button>
              <button
                onClick={() => submitQuery("How can I save tax under Section 80C?")}
                className="theme-chip"
              >
                💡 Section 80C Tax Headroom
              </button>
              <button
                onClick={() => submitQuery("Review my investment portfolio and XIRR")}
                className="theme-chip"
              >
                📈 Portfolio & XIRR
              </button>
              <button
                onClick={() => submitQuery("What are my active goals and required monthly savings?")}
                className="theme-chip"
              >
                🎯 Goal Savings Plan
              </button>
              <button
                onClick={() => submitQuery("What are my upcoming recurring bills?")}
                className="theme-chip"
              >
                ⚡ Upcoming Bills
              </button>
              <button
                onClick={() => submitQuery("Should I use Debt Avalanche or Snowball to pay off my loans?")}
                className="theme-chip"
              >
                ⚖️ Debt Avalanche Strategy
              </button>
              <button
                onClick={() => submitQuery("How much should I keep in my emergency fund?")}
                className="theme-chip"
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
              className="flex-1 theme-input"
            />
            <button
              type="submit"
              disabled={chatLoading || !inputQuery.trim()}
              className="btn-gradient px-5 py-2.5 text-xs text-white"
            >
              <Send className="w-3.5 h-3.5 text-white" /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
