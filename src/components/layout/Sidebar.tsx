import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { getDatabaseConnectionStatus } from '../../services/supabase.ts';
import {
  LayoutDashboard,
  Building2,
  Shuffle,
  ClipboardCheck,
  Camera,
  AlertTriangle,
  Video,
  FileText,
  ShieldCheck,
  Database,
  User,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { currentUser, activeRole, switchRole, allProfiles } = useAuth();
  const dbStatus = getDatabaseConnectionStatus();

  const navigation = [
    {
      name: activeRole === 'admin' ? 'Admin Overview' : activeRole === 'inspector' ? 'Inspector Duties' : 'Institution Hub',
      href: activeRole === 'admin' ? '/admin' : activeRole === 'inspector' ? '/inspector' : '/manager',
      icon: LayoutDashboard,
      roles: ['admin', 'inspector', 'manager'],
    },
    {
      name: 'Institutions',
      href: '/institutions',
      icon: Building2,
      roles: ['admin', 'inspector'],
    },
    {
      name: 'Random Assignment',
      href: '/assignments',
      icon: Shuffle,
      roles: ['admin'],
    },
    {
      name: 'Digital Checklist',
      href: '/checklist',
      icon: ClipboardCheck,
      roles: ['admin', 'inspector'],
    },
    {
      name: 'Evidence Verification',
      href: '/verification',
      icon: Camera,
      roles: ['admin', 'inspector', 'manager'],
    },
    {
      name: 'Findings & Actions',
      href: '/findings',
      icon: AlertTriangle,
      roles: ['admin', 'inspector', 'manager'],
    },
    {
      name: 'Live Video Stream',
      href: '/video-inspection',
      icon: Video,
      roles: ['admin', 'inspector'],
    },
    {
      name: 'Audit & Reports',
      href: '/reports',
      icon: FileText,
      roles: ['admin', 'manager'],
    },
  ];

  const filteredNav = navigation.filter(item => item.roles.includes(activeRole));

  return (
    <aside className="flex flex-col h-full w-64 bg-[#090d16] border-r border-slate-800/80 text-slate-300">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800/80 gap-3">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-600 to-teal-400 text-slate-950 font-bold shadow-sm shadow-cyan-500/20">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-white tracking-tight leading-none">
              Inspectra <span className="text-cyan-400">AI</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider mt-0.5">
              SIH26095 · V2.4
            </span>
          </div>
        </Link>
      </div>

      {/* Role Switcher Pill Bar */}
      <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-950/40">
        <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5 px-1">
          Active Workspace Persona
        </div>
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => switchRole('admin')}
            className={`py-1 text-center rounded-md font-medium transition-colors ${
              activeRole === 'admin'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => switchRole('inspector')}
            className={`py-1 text-center rounded-md font-medium transition-colors ${
              activeRole === 'inspector'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Inspector
          </button>
          <button
            onClick={() => switchRole('manager')}
            className={`py-1 text-center rounded-md font-medium transition-colors ${
              activeRole === 'manager'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Manager
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-3 mb-2">
          Platform Modules
        </div>
        {filteredNav.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Database State Banner */}
      <div className="p-3 m-3 rounded-lg border border-slate-800/80 bg-slate-900/60 text-xs">
        <div className="flex items-center gap-2 mb-1">
          <Database className="h-3.5 w-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-200">
            {dbStatus.isConfigured ? 'Supabase Cloud' : 'Active Local Store'}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">
          {dbStatus.isConfigured
            ? 'Connected with Row Level Security & Storage'
            : 'Synchronized with indexed client storage and full CRUD engine'}
        </p>
      </div>

      {/* Current User Profile Card */}
      <div className="p-4 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-300 font-bold text-xs shrink-0">
            {currentUser.full_name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">
              {currentUser.full_name}
            </p>
            <p className="text-[11px] text-slate-400 capitalize truncate">
              {currentUser.role} · {currentUser.department?.split(' ')[0] || 'Official'}
            </p>
          </div>
        </div>
        <Link
          to="/"
          title="Return to Home"
          className="p-1.5 text-slate-400 hover:text-slate-200 rounded-md hover:bg-slate-800/60 transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  );
};
