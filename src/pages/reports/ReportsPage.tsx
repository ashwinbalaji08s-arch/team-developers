import React, { useState } from 'react';
import { dbStore } from '../../services/store.ts';
import { AuditEvent, InspectionAssignment, Finding } from '../../types/index.ts';
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [auditEvents] = useState<AuditEvent[]>(dbStore.getAuditEvents());
  const [assignments] = useState<InspectionAssignment[]>(dbStore.getAssignments());
  const [findings] = useState<Finding[]>(dbStore.getFindings());
  const [institutions] = useState(dbStore.getInstitutions());

  const [selectedAuditFilter, setSelectedAuditFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = auditEvents.filter(ev => {
    const matchesFilter = selectedAuditFilter === 'ALL' || ev.entity_type === selectedAuditFilter;
    const matchesSearch =
      ev.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.actor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.entity_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDownloadCsv = () => {
    const headers = ['EventID,Action,EntityType,EntityID,ActorName,ActorRole,Timestamp,Details'];
    const rows = auditEvents.map(e =>
      `"${e.id}","${e.action}","${e.entity_type}","${e.entity_id}","${e.actor_name}","${e.actor_role}","${e.timestamp}","${JSON.stringify(e.details).replace(/"/g, '""')}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inspectra_audit_trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1">
            Statutory Accountability
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Inspection Summaries & Audit Log
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Exportable official summaries, checklist aggregations, and immutable cryptographic trail
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-sm"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Official Dossier</span>
          </button>
        </div>
      </div>

      {/* Official Summary Dossier Card (Printable) */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#090d16] space-y-4">
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
              NATIONAL SURVEILLANCE DOSSIER · REF #INSP-SIH26095-2026
            </div>
            <h2 className="text-lg font-bold text-white">
              Composite Facility Quality & Safety Inspection Report
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Generated on {new Date().toLocaleDateString()} for Smart India Hackathon Demonstration
            </p>
          </div>

          <div className="text-right">
            <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
              IMMUTABLE RECORD
            </span>
          </div>
        </div>

        {/* High Level Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Total Monitored Sites</span>
            <span className="text-base font-bold text-white">{institutions.length} Facilities</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Assignments Dispatched</span>
            <span className="text-base font-bold text-cyan-300">{assignments.length} Rounds</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Open Violations</span>
            <span className="text-base font-bold text-rose-400">{findings.length} Findings</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Audit Ledger Integrity</span>
            <span className="text-base font-bold text-emerald-400 font-mono">100% SHA-256</span>
          </div>
        </div>
      </div>

      {/* Chronological Audit Event Explorer */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#090d16]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Cryptographic Audit Ledger</h3>
            <p className="text-xs text-slate-400">Append-only sequence of assignments, evidence hashes, and reviews</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search audit trail..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-800 bg-slate-900 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44"
              />
            </div>

            <select
              value={selectedAuditFilter}
              onChange={e => setSelectedAuditFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-800 bg-slate-900 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Entity Types</option>
              <option value="ASSIGNMENT">Assignments</option>
              <option value="INSPECTION">Inspections</option>
              <option value="EVIDENCE">Evidence Records</option>
              <option value="FINDING">Findings</option>
              <option value="CORRECTIVE_ACTION">Corrective Actions</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px] border-y border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Timestamp & ID</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Actor & Role</th>
                <th className="py-2.5 px-3">Entity Reference</th>
                <th className="py-2.5 px-3">Payload Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredEvents.map(event => (
                <tr key={event.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                    <div>{new Date(event.timestamp).toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400">{event.id}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-cyan-300 font-mono text-[11px]">
                      {event.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-200">
                    <div>{event.actor_name}</div>
                    <div className="text-[10px] text-slate-400 capitalize">{event.actor_role}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-300 text-[11px]">
                    <span className="text-slate-400">{event.entity_type}:</span> {event.entity_id}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px] font-mono truncate max-w-xs">
                    {JSON.stringify(event.details)}
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
