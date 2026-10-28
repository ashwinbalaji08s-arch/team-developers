import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { Menu, X, Shield, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { currentUser, activeRole } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'pending'>('synced');

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus('synced');
    }, 600);
  };

  // Build clean breadcrumb path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const pageTitle = pathSegments.length > 0
    ? pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1).replace('-', ' ')
    : 'Overview';

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0b1120] text-slate-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 z-50 w-72 bg-[#090d16]"
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Sidebar onCloseMobile={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 shrink-0 border-b border-slate-800/80 bg-[#090d16]/70 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-800"
              aria-label="Open sidebar menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb Trail */}
            <div className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-slate-400 hover:text-slate-200">
                Inspectra AI
              </Link>
              <span className="text-slate-600">/</span>
              <span className="font-semibold text-slate-100">{pageTitle}</span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Sync State Badge */}
            <button
              onClick={handleManualSync}
              title="Click to trigger data sync"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 transition-colors"
            >
              <RefreshCw className={`h-3 w-3 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Encrypted Sync: Active'}</span>
            </button>

            {/* Active Role Tag */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300">
              <span className="capitalize">{activeRole}</span>
              <span className="text-slate-500 font-mono">· ID: {currentUser.id.slice(-4)}</span>
            </div>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
