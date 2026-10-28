import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  Building2,
  ClipboardCheck,
  ShieldCheck,
  ArrowRight,
  Lock,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';

export const LoginPortal: React.FC = () => {
  const { switchRole } = useAuth();
  const navigate = useNavigate();

  const handleFastDemoLogin = (role: 'admin' | 'inspector' | 'manager') => {
    switchRole(role);
    if (role === 'admin') navigate('/admin');
    else if (role === 'inspector') navigate('/inspector');
    else navigate('/manager');
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-teal-500/10 to-amber-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto w-full relative z-10">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Inspectra AI Authentication Gateways
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
            Select your specialized administrative role or use dedicated login credentials for separate dashboards
          </p>
        </div>

        {/* 3 Dedicated Gateways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1: Institution Manager */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#090d16] hover:border-amber-500/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold mb-4 group-hover:scale-105 transition-transform">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Institution Portal</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                For Principals, Wardens & Managers. Manage facility profile, schedule, NOC document uploads, and corrective action proofs.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800">
              <Link
                to="/login/institution"
                className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors flex items-center justify-center gap-2"
              >
                <span>Institution Login</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => handleFastDemoLogin('manager')}
                className="w-full py-1.5 text-center text-[11px] text-amber-400 hover:text-amber-300 font-medium"
              >
                Instant 1-Click Demo
              </button>
            </div>
          </div>

          {/* Card 2: Inspector */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#090d16] hover:border-teal-500/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold mb-4 group-hover:scale-105 transition-transform">
                <ClipboardCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Inspector Field Hub</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                For Field Officers & Auditors. View assigned institutions, live checklist execution, camera SHA-256 evidence, and GPS geofence checks.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800">
              <Link
                to="/login/inspector"
                className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-teal-500 hover:bg-teal-400 text-slate-950 transition-colors flex items-center justify-center gap-2"
              >
                <span>Inspector Login</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => handleFastDemoLogin('inspector')}
                className="w-full py-1.5 text-center text-[11px] text-teal-400 hover:text-teal-300 font-medium"
              >
                Instant 1-Click Demo
              </button>
            </div>
          </div>

          {/* Card 3: Admin */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#090d16] hover:border-cyan-500/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold mb-4 group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Directorate Admin</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Central Quality & Standards Directorate. National KPIs, algorithmic random assignment engine, Leaflet GIS map, and statutory audit trail.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800">
              <Link
                to="/login/admin"
                className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center justify-center gap-2"
              >
                <span>Admin Login</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => handleFastDemoLogin('admin')}
                className="w-full py-1.5 text-center text-[11px] text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Instant 1-Click Demo
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          <Link to="/" className="text-slate-400 hover:text-slate-200">
            ← Return to Public Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
