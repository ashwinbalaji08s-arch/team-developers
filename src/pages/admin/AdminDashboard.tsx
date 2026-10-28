import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { dbStore } from '../../services/store.ts';
import { InstitutionMap } from '../../components/common/InstitutionMap.tsx';
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertCircle,
  Shuffle,
  Download,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(dbStore.getDashboardMetrics());
  const institutions = dbStore.getInstitutions();
  const assignments = dbStore.getAssignments();
  const auditEvents = dbStore.getAuditEvents();
  const findings = dbStore.getFindings();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedInst, setSelectedInst] = useState(institutions[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [assignmentNotice, setAssignmentNotice] = useState<string | null>(null);

  const handleQuickRandomAssignment = () => {
    setIsGenerating(true);
    setAssignmentNotice(null);
    setTimeout(() => {
      const res = dbStore.generateRandomAssignment();
      setIsGenerating(false);
      setMetrics(dbStore.getDashboardMetrics());
      if (res.success) {
        setAssignmentNotice(res.message);
      } else {
        setAssignmentNotice(res.message);
      }
    }, 400);
  };

  const handleExportCsv = () => {
    const headers = ['ID,Name,Category,District,State,ComplianceScore,LastInspection'];
    const rows = institutions.map(i =>
      `"${i.id}","${i.name}","${i.category}","${i.district}","${i.state}",${i.overall_compliance_score || 0},"${i.last_inspection_date || 'N/A'}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inspectra_institutions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter institutions
  const filteredInstitutions = institutions.filter(inst => {
    const matchesSearch =
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || inst.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1">
            Directorate of Quality & Standards
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            National Inspection Overview
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time compliance monitoring across {metrics.total_institutions} registered institutions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleQuickRandomAssignment}
            disabled={isGenerating}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 shadow-md shadow-cyan-500/20 transition-all disabled:opacity-50"
          >
            <Shuffle className={`h-3.5 w-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Computing...' : 'Generate Random Assignment'}</span>
          </button>
        </div>
      </div>

      {/* Assignment notice toast */}
      {assignmentNotice && (
        <div className="p-3 rounded-lg border border-cyan-800/80 bg-cyan-950/40 text-xs text-cyan-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shuffle className="h-4 w-4 text-cyan-400 shrink-0" />
            <span>{assignmentNotice}</span>
          </div>
          <button
            onClick={() => setAssignmentNotice(null)}
            className="text-cyan-400 hover:text-white font-bold ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Primary KPI Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-[#090d16]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Institutions</span>
            <Building2 className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">
            {metrics.total_institutions}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Verified facilities</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#090d16]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Completed</span>
            <CheckCircle2 className="h-4 w-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-teal-300 tabular-nums">
            {metrics.completed_inspections}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Finalized & signed</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#090d16]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">In Queue</span>
            <Clock className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-sky-300 tabular-nums">
            {metrics.pending_inspections}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Active assignments</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#090d16]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Open Findings</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300 tabular-nums">
            {metrics.open_findings}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Requiring action</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#090d16]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Critical</span>
            <AlertCircle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-300 tabular-nums">
            {metrics.critical_findings}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Safety hazards</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#090d16]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Compliance Avg</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-300 tabular-nums">
            {metrics.compliance_rate_percent}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across 5 domains</div>
        </div>
      </div>

      {/* Main Grid: Leaflet Map & Analytics Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Leaflet Map */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-slate-800 bg-[#090d16] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Geographic Inspection Grid</h3>
              <p className="text-xs text-slate-400">OpenStreetMap view with live status pins across Indian districts</p>
            </div>
            <Link
              to="/institutions"
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
            >
              <span>Manage Facilities</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <InstitutionMap
            institutions={institutions}
            selectedId={selectedInst.id}
            onSelectInstitution={inst => setSelectedInst(inst)}
            heightClass="h-[360px]"
          />

          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" /> High (80%+)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block" /> Moderate (65-79%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500 inline-block" /> Non-Compliant (&lt;65%)
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Selected: {selectedInst.name}
            </span>
          </div>
        </div>

        {/* Right 1 Col: Category Compliance Radar Chart */}
        <div className="p-5 rounded-xl border border-slate-800 bg-[#090d16] flex flex-col">
          <h3 className="text-sm font-bold text-white mb-1">Checklist Category Pass Rate</h3>
          <p className="text-xs text-slate-400 mb-4">Average score across inspected facilities</p>

          <div className="flex-1 min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.category_compliance} layout="vertical" margin={{ left: -10, right: 10, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis dataKey="category" type="category" width={110} tick={{ fill: '#cbd5e1', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  formatter={(val: any) => [`${val}% Pass`, 'Score']}
                />
                <Bar dataKey="passRate" fill="#06b6d4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-snug">
            Safety & Accessibility shows highest failure rate (9 findings). Priority focus for upcoming random cycles.
          </div>
        </div>
      </div>

      {/* Bottom Grid: Institutions Table & Audit Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Filterable Institutions List */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-slate-800 bg-[#090d16]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Registered Institutions Directory</h3>
              <p className="text-xs text-slate-400">Search and monitor facility details</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter name, district..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-800 bg-slate-900 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-800 bg-slate-900 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Categories</option>
                <option value="Technical Institute">Technical Institute</option>
                <option value="Hostel Facility">Hostel Facility</option>
                <option value="Vocational Center">Vocational Center</option>
                <option value="Healthcare Facility">Healthcare Facility</option>
                <option value="Government School">Government School</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px] border-y border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Institution & Code</th>
                  <th className="py-2.5 px-3">District</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredInstitutions.map(inst => {
                  const score = inst.overall_compliance_score || 70;
                  return (
                    <tr
                      key={inst.id}
                      className="hover:bg-slate-800/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedInst(inst)}
                    >
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-200">{inst.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{inst.code}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">
                        {inst.district}, {inst.state}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {inst.category}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`font-mono font-bold tabular-nums ${
                            score >= 80 ? 'text-emerald-400' : score >= 65 ? 'text-amber-400' : 'text-rose-400'
                          }`}
                        >
                          {score}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <Link
                          to={`/institutions?select=${inst.id}`}
                          className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1"
                        >
                          Details <ExternalLink className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Recent Immutable Audit Activity */}
        <div className="p-5 rounded-xl border border-slate-800 bg-[#090d16] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Immutable Audit Log</h3>
            <span className="text-[10px] font-mono text-cyan-400">SHA-256 Verified</span>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[380px] pr-1">
            {auditEvents.slice(0, 6).map(event => (
              <div key={event.id} className="p-3 rounded-lg border border-slate-800 bg-slate-900/40 text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono mb-1">
                  <span>{event.action}</span>
                  <span>{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="text-slate-200 font-medium text-[11px]">
                  {event.actor_name} ({event.actor_role})
                </div>
                <div className="text-[11px] text-slate-400 mt-1 truncate">
                  {JSON.stringify(event.details)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-center">
            <Link to="/reports" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">
              View Complete Audit Trail →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
