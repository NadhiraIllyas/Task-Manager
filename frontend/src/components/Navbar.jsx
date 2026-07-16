import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { tasks } = useSelector((state) => state.tasks);

  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Helper to extract first and last initials
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <nav className="bg-white border-b border-slate-100 py-3 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:h-14">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-sm shadow-indigo-100 group-hover:bg-indigo-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-black text-slate-900 tracking-tight block">TaskFlow</span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Task Management</span>
            </div>
          </Link>

          {/* Center: Realtime Stats Pills */}
          {isAuthenticated && (
            <div className="flex items-center space-x-3">
              <span className="flex items-center px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-xs font-bold space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>{pendingCount} pending</span>
              </span>
              <span className="flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-bold space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{completedCount} completed</span>
              </span>
            </div>
          )}

          {/* Right: Profile Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Profile Card Trigger */}
                <Link to="/profile" className="flex items-center space-x-3 hover:bg-slate-50 p-1.5 rounded-xl transition-all">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm shadow-sm">
                    {getInitials(user?.name)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <span className="text-sm font-bold text-slate-900 block leading-none">{user?.name}</span>
                    <span className="text-xs text-slate-400 block mt-1">{user?.email}</span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all"
                >
                  <svg className="w-4 h-4 mr-1.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log out
                </button>
              </>
            ) : (
              <div className="space-x-2">
                <Link to="/login" className="text-xs font-bold text-slate-600 hover:text-slate-900">Login</Link>
                <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm">Register</Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;