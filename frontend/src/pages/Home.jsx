import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50/40 flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-3xl text-center space-y-6">
        
        {/* Animated Feature Tag */}
        <span className="inline-flex items-center px-3.5 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-150 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
          Simple, Secure, and Productive
        </span>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
          Streamline Your Daily Workflow with <span className="text-indigo-600 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">TaskFlow</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
          A minimalist task workspace designed to keep you focused. Manage your items with strict data isolation, dynamic tracking, and real-time completion metrics.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started for Free
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-8 py-3.5 rounded-2xl font-black text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;