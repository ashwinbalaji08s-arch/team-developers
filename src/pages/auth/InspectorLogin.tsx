import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { ClipboardCheck, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export const InspectorLogin: React.FC = () => {
  const { switchRole, loginWithEmail } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('arun.kumar@inspectra.gov.in');
  const [badgeId, setBadgeId] = useState('INSP-NZ-4019');
  const [password, setPassword] = useState('InspectorPass#2026');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      loginWithEmail(email);
      switchRole('inspector');
      navigate('/inspector');
      setIsLoading(false);
    }, 400);
  };

  const handleQuickDemoFill = (inspectorEmail: string, badge: string) => {
    setEmail(inspectorEmail);
    setBadgeId(badge);
    setPassword('InspectorPass#2026');
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-teal-500/10 to-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 font-bold shadow-lg shadow-teal-500/20">
            <ClipboardCheck className="h-6 w-6" />
          </div>
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-white">
          Inspector Duty Portal
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Zonal Field Inspection Officers · Directorate of Quality & Standards
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-[#090d16] py-8 px-6 sm:px-8 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-4 p-3 rounded-lg border border-rose-800 bg-rose-950/40 text-xs text-rose-200 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Official Inspector Email
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="inspector.name@inspectra.gov.in"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Field Officer Badge ID
              </label>
              <div className="relative">
                <UserCheck className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={badgeId}
                  onChange={e => setBadgeId(e.target.value)}
                  placeholder="INSP-NZ-4019"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-400 uppercase font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Field Clearance Password
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-slate-950 transition-all shadow-md shadow-teal-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Authenticating Zonal ID...' : 'Access Inspector Field Hub'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Quick Demo Credentials Pill */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
              <span className="font-semibold text-slate-300">Hackathon Field Officers</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('arun.kumar@inspectra.gov.in', 'INSP-NZ-4019')}
                className="p-2 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-left transition-colors"
              >
                <div className="font-bold text-teal-300">Arun Kumar</div>
                <div className="text-[10px] text-slate-400">Team North · 2 duties</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('priya.nair@inspectra.gov.in', 'INSP-SZ-8820')}
                className="p-2 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-left transition-colors"
              >
                <div className="font-bold text-teal-300">Priya Nair</div>
                <div className="text-[10px] text-slate-400">Team South · 1 duty</div>
              </button>
            </div>
          </div>

          <div className="mt-5 text-center text-xs text-slate-400">
            Institution Manager?{' '}
            <Link to="/login/institution" className="text-amber-400 hover:text-amber-300 font-semibold">
              Institution Portal Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
