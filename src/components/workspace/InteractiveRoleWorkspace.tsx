import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { AdminDashboard } from '../../pages/admin/AdminDashboard.tsx';
import { InspectorDashboard } from '../../pages/inspector/InspectorDashboard.tsx';
import { ManagerPortal } from '../../pages/manager/ManagerPortal.tsx';
import {
  ShieldCheck,
  ClipboardCheck,
  Building2,
  Lock,
  Unlock,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  Shield,
  Eye,
  EyeOff,
  UserCheck,
  RefreshCw,
} from 'lucide-react';

export const InteractiveRoleWorkspace: React.FC = () => {
  const { switchRole, currentUser } = useAuth();

  // Active selected tab in the role selector
  const [selectedRole, setSelectedRole] = useState<'admin' | 'inspector' | 'manager'>('admin');

  // Authentication states for each role
  const [authenticatedRole, setAuthenticatedRole] = useState<'admin' | 'inspector' | 'manager' | null>(null);

  // Password inputs for each role
  const [passwords, setPasswords] = useState({
    admin: 'AdminSecret#2026',
    inspector: 'InspectorPass#2026',
    manager: 'InspectraSecure#2026',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSelectRole = (role: 'admin' | 'inspector' | 'manager') => {
    setSelectedRole(role);
    setAuthError(null);
    // If switching to an unauthenticated role, reset authenticated view so password must be confirmed
    if (authenticatedRole !== role) {
      setAuthenticatedRole(null);
    }
  };

  const handleUnlockDashboard = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setAuthError(null);

    setTimeout(() => {
      setIsVerifying(false);
      // Verify password
      const enteredPass = passwords[selectedRole];
      if (!enteredPass || enteredPass.length < 4) {
        setAuthError('Please enter a valid authorization password (minimum 4 characters).');
        return;
      }

      // Successful unlock
      switchRole(selectedRole);
      setAuthenticatedRole(selectedRole);

      // Smooth scroll down to the revealed dashboard
      setTimeout(() => {
        const el = document.getElementById('active-bottom-dashboard');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }, 350);
  };

  const handleLockSession = () => {
    setAuthenticatedRole(null);
  };

  return (
    <section id="role-workspace-section" className="py-12 border-b border-slate-800/80 bg-[#080d1a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-2">
            Role-Based Interactive Workspace
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Role Selection & Dashboard Console
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Choose your administrative role, authenticate with security credentials, and render only that role's dashboard below.
          </p>
        </div>

        {/* Professional Role Selection Segmented Bar */}
        <div className="max-w-3xl mx-auto p-1.5 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl grid grid-cols-1 sm:grid-cols-3 gap-1.5">
          <button
            onClick={() => handleSelectRole('admin')}
            className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2.5 ${
              selectedRole === 'admin'
                ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <div className="text-left">
              <div className="leading-none">1. Admin Console</div>
              <div className="text-[10px] text-slate-400 font-normal mt-0.5">Directorate of Standards</div>
            </div>
          </button>

          <button
            onClick={() => handleSelectRole('inspector')}
            className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2.5 ${
              selectedRole === 'inspector'
                ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <ClipboardCheck className="h-4 w-4 text-teal-400" />
            <div className="text-left">
              <div className="leading-none">2. Field Inspector</div>
              <div className="text-[10px] text-slate-400 font-normal mt-0.5">Zonal Audit Officer</div>
            </div>
          </button>

          <button
            onClick={() => handleSelectRole('manager')}
            className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2.5 ${
              selectedRole === 'manager'
                ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Building2 className="h-4 w-4 text-amber-400" />
            <div className="text-left">
              <div className="leading-none">3. Institution Manager</div>
              <div className="text-[10px] text-slate-400 font-normal mt-0.5">Principal / Facility Head</div>
            </div>
          </button>
        </div>

        {/* Security Password Box for Chosen Role */}
        <div className="max-w-xl mx-auto rounded-2xl border border-slate-800 bg-[#090d16] p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
            <div className="flex items-center gap-3">
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-slate-950 shadow-md ${
                  selectedRole === 'admin'
                    ? 'bg-gradient-to-tr from-cyan-500 to-teal-400 shadow-cyan-500/20'
                    : selectedRole === 'inspector'
                    ? 'bg-gradient-to-tr from-teal-500 to-cyan-400 shadow-teal-500/20'
                    : 'bg-gradient-to-tr from-amber-500 to-yellow-400 shadow-amber-500/20'
                }`}
              >
                {selectedRole === 'admin' ? (
                  <ShieldCheck className="h-5 w-5" />
                ) : selectedRole === 'inspector' ? (
                  <ClipboardCheck className="h-5 w-5" />
                ) : (
                  <Building2 className="h-5 w-5" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white capitalize">
                  {selectedRole === 'admin'
                    ? 'Directorate Admin Security Access'
                    : selectedRole === 'inspector'
                    ? 'Inspector Field Officer Access'
                    : 'Institution Manager Access'}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  {selectedRole === 'admin'
                    ? 'Officer: Dr. Rajeshwari Sharma (admin@inspectra.gov.in)'
                    : selectedRole === 'inspector'
                    ? 'Officer: Inspector Arun Kumar (Badge: INSP-NZ-4019)'
                    : 'User: Prof. S. K. Mahajan (principal@apextech.edu.in)'}
                </p>
              </div>
            </div>

            {authenticatedRole === selectedRole ? (
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>UNLOCKED</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-slate-900 text-slate-400 border border-slate-800 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-slate-500" />
                <span>LOCKED</span>
              </span>
            )}
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-lg border border-rose-800 bg-rose-950/40 text-rose-200 text-xs">
              {authError}
            </div>
          )}

          {authenticatedRole === selectedRole ? (
            /* Already Authenticated State */
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl border border-emerald-800/60 bg-emerald-950/20 text-emerald-300 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-100 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Authentication Successful & Session Active</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Rendering the {selectedRole.toUpperCase()} Dashboard below in full resolution.
                  </p>
                </div>
                <button
                  onClick={handleLockSession}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 font-medium"
                >
                  Lock Session
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Scroll down to interact with the dashboard</span>
                <a
                  href="#active-bottom-dashboard"
                  className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                >
                  <span>Jump to Dashboard</span>
                  <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          ) : (
            /* Password Authentication Form */
            <form onSubmit={handleUnlockDashboard} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Enter Password for {selectedRole === 'admin' ? 'Admin' : selectedRole === 'inspector' ? 'Inspector' : 'Institution Manager'}
                </label>
                <div className="relative">
                  <KeyRound className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwords[selectedRole]}
                    onChange={e =>
                      setPasswords({
                        ...passwords,
                        [selectedRole]: e.target.value,
                      })
                    }
                    placeholder="Enter security password..."
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-800 bg-slate-900/90 text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Preset Demo Credentials Configured</span>
                <button
                  type="button"
                  onClick={() => {
                    const defaultPass =
                      selectedRole === 'admin'
                        ? 'AdminSecret#2026'
                        : selectedRole === 'inspector'
                        ? 'InspectorPass#2026'
                        : 'InspectraSecure#2026';
                    setPasswords({ ...passwords, [selectedRole]: defaultPass });
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  Reset Default Password
                </button>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 text-slate-950 ${
                  selectedRole === 'admin'
                    ? 'bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 shadow-cyan-500/20'
                    : selectedRole === 'inspector'
                    ? 'bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 shadow-teal-500/20'
                    : 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-amber-500/20'
                }`}
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Verifying Token...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="h-4 w-4" />
                    <span>
                      Unlock & Render {selectedRole === 'admin' ? 'Admin' : selectedRole === 'inspector' ? 'Inspector' : 'Institution'} Dashboard Below
                    </span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Separately Rendered Role Dashboard at Bottom */}
        <div id="active-bottom-dashboard" className="pt-6">
          {authenticatedRole ? (
            <div className="rounded-3xl border border-slate-800 bg-[#090d16] p-4 sm:p-6 lg:p-8 shadow-2xl transition-all duration-300">
              {/* Active Role Dashboard Frame Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                      LIVE RENDERED DASHBOARD
                    </span>
                    <h3 className="text-xl font-bold text-white capitalize">
                      {authenticatedRole === 'admin'
                        ? 'Admin Command Center'
                        : authenticatedRole === 'inspector'
                        ? 'Inspector Field Hub'
                        : 'Institution Manager Portal'}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-slate-900 border border-slate-800 text-slate-300">
                    Active User: {currentUser.full_name}
                  </span>
                  <button
                    onClick={handleLockSession}
                    className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 font-semibold text-xs"
                  >
                    Lock View
                  </button>
                </div>
              </div>

              {/* Render ONLY the chosen authenticated dashboard */}
              {authenticatedRole === 'admin' && <AdminDashboard />}
              {authenticatedRole === 'inspector' && <InspectorDashboard />}
              {authenticatedRole === 'manager' && <ManagerPortal />}
            </div>
          ) : (
            /* Locked Placeholder Slate */
            <div className="rounded-3xl border border-dashed border-slate-800/80 bg-slate-950/40 p-12 text-center max-w-2xl mx-auto">
              <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto mb-3">
                <Lock className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-300 mb-1">
                Dashboard Locked
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Select a role above (Admin, Inspector, or Institution Manager) and submit the security password to unlock and render the full dashboard here.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
