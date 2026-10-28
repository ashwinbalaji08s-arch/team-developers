import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { Shield, Sparkles, UserCheck, ChevronRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, switchRole, activeRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b1120]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <Link to="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-600 to-teal-400 text-slate-950 shadow-sm shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
            <Shield className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-100">
            Inspectra <span className="text-cyan-400">AI</span>
          </span>
        </Link>

        {/* Zone 2: Navigation Links (4-5 clean single-line text links) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <Link to="/" className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 ${isLanding ? 'text-cyan-400' : ''}`}>
            Overview
          </Link>
          <Link to="/admin" className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 ${location.pathname.startsWith('/admin') ? 'text-cyan-400' : ''}`}>
            Admin Console
          </Link>
          <Link to="/inspector" className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 ${location.pathname.startsWith('/inspector') ? 'text-cyan-400' : ''}`}>
            Inspector Field Hub
          </Link>
          <Link to="/manager" className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 ${location.pathname.startsWith('/manager') ? 'text-cyan-400' : ''}`}>
            Institution Portal
          </Link>
          <Link to="/verification" className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 ${location.pathname.startsWith('/verification') ? 'text-cyan-400' : ''}`}>
            Evidence Audit
          </Link>
          <Link to="/login" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            Login Portals
          </Link>
        </nav>

        {/* Zone 3: 1 Primary Action & Role Selector */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/login"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <span>Role Logins</span>
          </Link>

          <Link
            to={activeRole === 'admin' ? '/admin' : activeRole === 'inspector' ? '/inspector' : '/manager'}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-cyan-400/20"
          >
            <span>Launch Workspace</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
};
