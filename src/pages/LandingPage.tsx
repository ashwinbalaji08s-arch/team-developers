import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import {
  ShieldCheck,
  Camera,
  MapPin,
  Lock,
  Cpu,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileCheck2,
  Users,
  Eye,
  Activity,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { InteractiveRoleWorkspace } from '../components/workspace/InteractiveRoleWorkspace.tsx';

export const LandingPage: React.FC = () => {
  const { switchRole } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'problem' | 'solution'>('solution');

  const handleLaunchRole = (role: 'admin' | 'inspector' | 'manager') => {
    switchRole(role);
    const el = document.getElementById('role-workspace-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      if (role === 'admin') navigate('/login/admin');
      else if (role === 'inspector') navigate('/login/inspector');
      else navigate('/login/institution');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800/80">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/10 to-teal-500/10 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-600/5 blur-[100px] pointer-events-none rounded-full" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Topic Kicker - Clean unboxed text */}
            <div className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-4">
              SIH26095 · Smart Real-Time Monitoring & Inspection
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
              Inspect Smarter. Verify Faster.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-400">
                Build Accountability.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
              An intelligent, transparent verification architecture designed for public institutes, hostels, and government facilities. Powered by cryptographic SHA-256 evidence hashing, geofencing, and algorithmic random assignment.
            </p>

            {/* Role Launch Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-14">
              <button
                onClick={() => handleLaunchRole('admin')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40"
              >
                <span>Enter as Admin</span>
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleLaunchRole('inspector')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-100 font-semibold text-sm border border-slate-700 hover:border-slate-600 transition-all"
              >
                <span>Inspector Field App</span>
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleLaunchRole('manager')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-100 font-semibold text-sm border border-slate-700 hover:border-slate-600 transition-all"
              >
                <span>Institution Portal</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-cyan-400" /> Web Crypto SHA-256 Proofs
              </span>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-teal-400" /> GPS Geofence Verification
              </span>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <span className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-sky-400" /> Conflict-Free Random Assignment
              </span>
            </div>
          </div>

          {/* Interactive Live Platform Preview Card */}
          <div className="mt-14 rounded-2xl border border-slate-800 bg-[#090d16]/90 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-cyan-400" />
                <span className="text-xs font-mono font-medium text-slate-300">
                  REAL-TIME MONITORING RADAR · DISTRICT COVERAGE
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                ENCRYPTED AUDIT: VERIFIED
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
                <div className="text-xs text-slate-400 mb-1">Assigned Inspector</div>
                <div className="text-base font-bold text-slate-100">Inspector Arun Kumar</div>
                <div className="text-xs text-cyan-400 mt-1">Zonal Inspection Team North</div>
                <div className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800">
                  Workload Score: 2 active · Zero conflict
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
                <div className="text-xs text-slate-400 mb-1">Target Institution</div>
                <div className="text-base font-bold text-slate-100">Apex Institute of Tech</div>
                <div className="text-xs text-teal-400 mt-1">New Delhi Central · Technical</div>
                <div className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800">
                  GPS Anchor: 28.6289° N, 77.2285° E
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
                <div className="text-xs text-slate-400 mb-1">Digital Evidence State</div>
                <div className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Tamper-Proof Hash Match
                </div>
                <div className="text-xs text-slate-400 font-mono mt-1 truncate">
                  SHA-256: 9f86d081884c7d65...
                </div>
                <div className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800">
                  Live Camera Capture · 4.8m GPS Accuracy
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection & Dynamic Bottom Dashboard Section */}
      <InteractiveRoleWorkspace />

      {/* Problem & Solution Comparison Section */}
      <section className="py-16 lg:py-24 border-b border-slate-800/80 bg-slate-950/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
              The Inspection Crisis & The Inspectra Paradigm
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Why traditional manual inspections fail public scrutiny, and how algorithmic verification restores public trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Old Problem */}
            <div className="rounded-2xl border border-rose-900/30 bg-rose-950/10 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-800/50 text-rose-400">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-rose-200">The Problem: Vulnerable Inspections</h3>
              </div>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Predictable Schedules:</strong> Institutions know inspectors weeks in advance, leading to temporary cosmetic cleanups rather than systemic compliance.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Stock/Gallery Photos:</strong> Unverified photographs recycled from internet or older dates submitted as proof of current hygiene and safety.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Paperwork Dead Ends:</strong> Failed items recorded on paper files without closed-loop accountability or verifiable corrective actions.</span>
                </li>
              </ul>
            </div>

            {/* The Inspectra Solution */}
            <div className="rounded-2xl border border-cyan-800/40 bg-cyan-950/10 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-700/50 text-cyan-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-cyan-200">The Solution: Inspectra AI Platform</h3>
              </div>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-cyan-400 font-bold shrink-0">✓</span>
                  <span><strong>Algorithmic Random Assignment:</strong> Inspectors are randomized by workload and conflict-of-interest filters; assignments concealed until 48 hours prior.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-cyan-400 font-bold shrink-0">✓</span>
                  <span><strong>Hardware-Bound Live Evidence:</strong> Direct camera capture with live GPS coordinates, accuracy circle, and client-side SHA-256 cryptographic hashing.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-cyan-400 font-bold shrink-0">✓</span>
                  <span><strong>Automated Corrective Loop:</strong> Failed checklist items automatically spawn tracked findings with escalation timelines and multi-party signoff.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Workflow Pillars */}
      <section className="py-16 lg:py-24 border-b border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-2">
              System Architecture
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              End-to-End Verification Pipeline
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border border-slate-800 bg-[#090d16] hover:border-slate-700 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold mb-4">
                01
              </div>
              <h4 className="text-base font-bold text-white mb-2">Random Allocation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Conflict-checked algorithm matches unannounced inspectors with weighted priority institutions.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-[#090d16] hover:border-slate-700 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold mb-4">
                02
              </div>
              <h4 className="text-base font-bold text-white mb-2">Field Capture & Hash</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inspectors evaluate 5 core facility categories with camera-locked evidence and Web Crypto SHA-256 seals.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-[#090d16] hover:border-slate-700 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold mb-4">
                03
              </div>
              <h4 className="text-base font-bold text-white mb-2">Automated Finding</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Non-compliant checks automatically trigger finding records with severity tiers and due dates.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-[#090d16] hover:border-slate-700 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold mb-4">
                04
              </div>
              <h4 className="text-base font-bold text-white mb-2">Verified Remediation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Institution managers submit photographic remediation proofs; reviewers verify and close findings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Ethical Security Principles */}
      <section className="py-16 border-b border-slate-800/80 bg-slate-950/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-10">
            <h3 className="text-xl font-bold text-white mb-3">Privacy & Evidence Integrity Commitment</h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              In accordance with ethical inspection standards: Inspectra AI explicitly informs inspectors before accessing camera and location sensors. Coordinates and timestamps are cryptographically recorded alongside image hashes, but the platform emphasizes that GPS and metadata alone do not replace human vigilance. Normal gallery photo uploads are strictly distinguished from verified live sensor captures to eliminate spoofed claims.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" /> Transparent Sensor Permission
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" /> Client-Side SHA-256 Before Transfer
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" /> Role-Based PostgreSQL Security Policies
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-[#090d16] text-xs text-slate-400">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">Inspectra AI</span>
            <span>·</span>
            <span>SIH26095 Technical Prototype</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/admin" className="hover:text-slate-200">Admin</Link>
            <Link to="/inspector" className="hover:text-slate-200">Inspector</Link>
            <Link to="/manager" className="hover:text-slate-200">Manager</Link>
            <Link to="/verification" className="hover:text-slate-200">Evidence Audit</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
