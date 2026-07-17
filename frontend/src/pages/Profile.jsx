import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const { tasks } = useSelector((state) => state.tasks);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = tasks.filter((t) => t.status === 'pending').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white border border-slate-200/85 rounded-3xl p-8 shadow-sm">
        
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-500 mb-8 transition-colors">
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>

        {/* User Card */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-8 border-b border-slate-100">
          <div className="w-20 h-20 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-2xl font-black flex items-center justify-center shadow-inner">
            {getInitials(user?.name)}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-black text-slate-900 leading-none">{user?.name}</h2>
            <p className="text-slate-400 text-sm mt-2">{user?.email}</p>
            <span className="inline-block bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-[10px] font-black uppercase mt-3.5 tracking-wider">
              MERN Stack Client
            </span>
          </div>
        </div>

        {/* Stats Summary Panel */}
        <div className="pt-8">
          <h3 className="text-base font-black text-slate-900 mb-5">Workspace Analytics</h3>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wide">Total</span>
              <p className="text-2xl font-black text-slate-950 mt-1">{total}</p>
            </div>
            <div className="bg-amber-50/50 p-4 border border-amber-100/50 rounded-2xl">
              <span className="text-amber-600/80 text-xs font-bold uppercase tracking-wide">Pending</span>
              <p className="text-2xl font-black text-amber-700 mt-1">{pending}</p>
            </div>
            <div className="bg-emerald-50/50 p-4 border border-emerald-100/50 rounded-2xl">
              <span className="text-emerald-600/80 text-xs font-bold uppercase tracking-wide">Done</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">{completed}</p>
            </div>
          </div>

          {/* Graphical Progress Bar */}
          <div className="mt-8 bg-slate-50 border border-slate-100 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wide">Completion Rate</span>
              <span className="text-sm font-black text-indigo-700">{completionRate}%</span>
            </div>
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3">
              Keep checking off items regularly to maintain a balanced task output.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;