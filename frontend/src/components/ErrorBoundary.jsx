import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-transparent p-6">
          <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/60 max-w-md w-full text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">!</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Something went wrong</h2>
            <p className="text-sm text-slate-600 mb-6">A runtime exception occurred. Please refresh or return to the dashboard.</p>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-5 py-2.5 btn-gradient rounded-lg text-sm font-bold shadow-md transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
