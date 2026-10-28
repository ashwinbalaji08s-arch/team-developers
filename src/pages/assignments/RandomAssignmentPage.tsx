import React, { useState } from 'react';
import { dbStore } from '../../services/store.ts';
import { InspectionAssignment, UserProfile, Institution } from '../../types/index.ts';
import {
  Shuffle,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Calendar,
  User,
  Building2,
  Clock,
  Sliders,
  Sparkles,
  Info,
} from 'lucide-react';

export const RandomAssignmentPage: React.FC = () => {
  const [assignments, setAssignments] = useState<InspectionAssignment[]>(dbStore.getAssignments());
  const [inspectors] = useState<UserProfile[]>(dbStore.getProfiles().filter(p => p.role === 'inspector'));
  const [institutions] = useState<Institution[]>(dbStore.getInstitutions());
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Configurable algorithm parameters
  const [targetDeadlineDays, setTargetDeadlineDays] = useState(7);
  const [selectedInstId, setSelectedInstId] = useState<string>('AUTO');

  const handleGenerate = () => {
    setIsGenerating(true);
    setStatusMessage(null);

    setTimeout(() => {
      const result = dbStore.generateRandomAssignment({
        preferredInstitutionId: selectedInstId === 'AUTO' ? undefined : selectedInstId,
        targetDeadlineDays,
      });

      setIsGenerating(false);
      setAssignments(dbStore.getAssignments());

      if (result.success) {
        setStatusMessage({ type: 'success', text: result.message });
      } else {
        setStatusMessage({ type: 'error', text: result.message });
      }
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1">
            Fair Allocation Engine
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Randomized Duty Assignment
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic & conflict-of-interest assignment preventing collusion and bias
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
        >
          <Shuffle className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Evaluating Constraints...' : 'Generate Random Assignment'}</span>
        </button>
      </div>

      {/* Result Status Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
            statusMessage.type === 'success'
              ? 'border-emerald-800/80 bg-emerald-950/40 text-emerald-200'
              : 'border-rose-800/80 bg-rose-950/40 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            )}
            <span className="font-medium">{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-white font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Configuration & Rule Verification Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl border border-slate-800 bg-[#090d16]">
          <div className="flex items-center gap-2 mb-3 text-cyan-400 font-semibold text-xs">
            <Sliders className="h-4 w-4" />
            <span>Algorithm Parameters</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Facility Pool</label>
              <select
                value={selectedInstId}
                onChange={e => setSelectedInstId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="AUTO">Automated Priority (Lowest Score / Longest Overdue)</option>
                {institutions.map(inst => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name} ({inst.district})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Inspection Deadline Window ({targetDeadlineDays} Days)
              </label>
              <input
                type="range"
                min="3"
                max="21"
                value={targetDeadlineDays}
                onChange={e => setTargetDeadlineDays(parseInt(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>3 Days (Urgent)</span>
                <span>7 Days (Standard)</span>
                <span>21 Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conflict-of-Interest Filter Rules */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-[#090d16]">
          <div className="flex items-center gap-2 mb-3 text-teal-400 font-semibold text-xs">
            <ShieldCheck className="h-4 w-4" />
            <span>Active Constraint Filters</span>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-teal-400 font-bold">1.</span>
              <span><strong>Workload Balance:</strong> Prioritizes inspectors with fewer active assignments to prevent fatigue.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-400 font-bold">2.</span>
              <span><strong>90-Day Cooling Off:</strong> Prevents re-assigning an inspector to the same facility within a 3-month window.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-400 font-bold">3.</span>
              <span><strong>Concealed Reveal:</strong> Inspectors only receive unannounced itinerary 48 hours prior to inspection day.</span>
            </li>
          </ul>
        </div>

        {/* Current Available Inspector Roster */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-[#090d16]">
          <div className="flex items-center justify-between mb-3 text-slate-300 font-semibold text-xs">
            <span>Inspector Workload Roster</span>
            <span className="text-slate-400 font-mono text-[10px]">Active Pool</span>
          </div>

          <div className="space-y-2 text-xs">
            {inspectors.map(insp => (
              <div
                key={insp.id}
                className="p-2.5 rounded-lg border border-slate-800/80 bg-slate-900/40 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-200">{insp.full_name}</div>
                  <div className="text-[10px] text-slate-400">{insp.department}</div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      insp.is_available
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        : 'bg-rose-950 text-rose-300 border border-rose-800/60'
                    }`}
                  >
                    {insp.is_available ? `${insp.workload_count || 0} Active` : 'Busy'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assignments History & Audit Table */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#090d16]">
        <h3 className="text-sm font-bold text-white mb-1">Generated Inspection Assignments</h3>
        <p className="text-xs text-slate-400 mb-4">Complete immutable history of algorithmic allocations</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px] border-y border-slate-800">
              <tr>
                <th className="py-3 px-3">Assignment ID</th>
                <th className="py-3 px-3">Target Institution</th>
                <th className="py-3 px-3">Assigned Inspector</th>
                <th className="py-3 px-3">Schedule Window</th>
                <th className="py-3 px-3">Algorithm</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {assignments.map(a => (
                <tr key={a.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-mono text-cyan-400 font-semibold">
                    {a.id}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-200">{a.institution_name}</div>
                    <div className="text-[10px] text-slate-400">{a.district}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-medium">
                    {a.inspector_name}
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    <span className="font-mono text-slate-200">{a.scheduled_date}</span> to{' '}
                    <span className="font-mono text-slate-200">{a.deadline_date}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-800">
                      {a.assignment_algorithm}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase font-mono ${
                        a.status === 'completed'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                          : a.status === 'in_progress'
                          ? 'bg-sky-950 text-sky-300 border border-sky-800/60'
                          : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
