import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { switchRole, loginWithEmail } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@inspectra.gov.in');
  const [password, setPassword] = useState('AdminSecret#2026');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      loginWithEmail(email);
      switchRole('admin');
      navigate('/admin');
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-cyan-500/10 to-teal-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-white">
          National Directorate Portal
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Central Directorate of Quality & Standards · Administrative Access
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
                Directorate Officer Email
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@inspectra.gov.in"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Root Security Password
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Authorizing Administrative Token...' : 'Enter Admin Command Center'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Quick Demo Credentials Pill */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
              <span className="font-semibold text-slate-300">Hackathon Lead Official</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-800/80 bg-slate-900/60 text-[11px] font-mono text-slate-300">
              <div>Email: admin@inspectra.gov.in</div>
              <div className="text-slate-400">User: Dr. Rajeshwari Sharma (Director)</div>
            </div>
          </div>

          <div className="mt-5 flex justify-between text-xs text-slate-400">
            <Link to="/login/institution" className="text-amber-400 hover:text-amber-300">
              ← Institution Login
            </Link>
            <Link to="/login/inspector" className="text-teal-400 hover:text-teal-300">
              Inspector Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
