import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { dbStore } from '../../services/store.ts';
import {
  InspectionAssignment,
  Institution,
  ChecklistItemResponse,
  EvidenceRecord,
  Finding,
  CorrectiveAction,
} from '../../types/index.ts';
import { verifyGeofenceProximity } from '../../services/crypto.ts';
import {
  ClipboardCheck,
  Camera,
  MapPin,
  Calendar,
  Clock,
  User,
  Building2,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Send,
  Eye,
  Sliders,
  History,
  Compass,
  Play,
  RotateCcw,
  Check,
  X,
  FileCheck2,
  ExternalLink,
} from 'lucide-react';

export const InspectorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    | 'duties'
    | 'profile'
    | 'institution-details'
    | 'live-inspection'
    | 'evidence-gps'
    | 'corrective-tracking'
    | 'history'
  >('duties');

  // Inspector profile availability toggle
  const [isAvailable, setIsAvailable] = useState(currentUser.is_available ?? true);
  const [profileNotice, setProfileNotice] = useState<string | null>(null);

  // Inspector assignments
  const [assignments, setAssignments] = useState<InspectionAssignment[]>(() => {
    const all = dbStore.getAssignments();
    const mine = all.filter(
      a => a.inspector_id === currentUser.id || a.inspector_name?.includes(currentUser.full_name)
    );
    return mine.length > 0 ? mine : all;
  });

  const [selectedAssignment, setSelectedAssignment] = useState<InspectionAssignment>(assignments[0]);
  const targetInstitution: Institution =
    dbStore.getInstitution(selectedAssignment?.institution_id) || dbStore.getInstitutions()[0];

  // Institution documents for inspection reference
  const institutionDocs = dbStore.getDocuments(targetInstitution.id);

  // Checklist items for selected assignment
  const [checklistItems, setChecklistItems] = useState<ChecklistItemResponse[]>(
    dbStore.getChecklistResponses(selectedAssignment.id)
  );

  // Evidence records
  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>(
    dbStore.getEvidenceRecords(selectedAssignment.id)
  );

  // Findings and corrective action tracking
  const [findings, setFindings] = useState<Finding[]>(dbStore.getFindings(targetInstitution.id));
  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction[]>(
    dbStore.getCorrectiveActions()
  );

  // GPS Verification simulation
  const [currentGps, setCurrentGps] = useState<{ lat: number; lon: number } | null>({
    lat: targetInstitution.latitude + 0.0001,
    lon: targetInstitution.longitude + 0.0002,
  });

  const geofenceResult = currentGps
    ? verifyGeofenceProximity(
        currentGps.lat,
        currentGps.lon,
        targetInstitution.latitude,
        targetInstitution.longitude,
        500
      )
    : null;

  // New Issue reporting state
  const [newIssueTitle, setNewIssueTitle] = useState('');
  const [newIssueCategory, setNewIssueCategory] = useState('Safety & Accessibility');
  const [newIssueSeverity, setNewIssueSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [newIssueDesc, setNewIssueDesc] = useState('');
  const [issueNotice, setIssueNotice] = useState<string | null>(null);

  const handleToggleAvailability = () => {
    const updated = !isAvailable;
    setIsAvailable(updated);
    dbStore.updateProfile(currentUser.id, { is_available: updated });
    setProfileNotice(`Availability status updated: ${updated ? 'Active for Random Allocation' : 'Temporarily Unavailable'}`);
    setTimeout(() => setProfileNotice(null), 3000);
  };

  const handleChecklistChange = (itemId: string, status: 'PASS' | 'FAIL' | 'NA') => {
    const updated = checklistItems.map(it => (it.id === itemId ? { ...it, status } : it));
    setChecklistItems(updated);
    dbStore.saveChecklistResponses(selectedAssignment.id, updated);
  };

  const handleReportNewViolation = (e: React.FormEvent) => {
    e.preventDefault();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (newIssueSeverity === 'CRITICAL' ? 3 : 10));

    const created = dbStore.addFinding({
      institution_id: targetInstitution.id,
      institution_name: targetInstitution.name,
      inspection_id: selectedAssignment.id,
      checklist_item_id: 'FIELD-OBS-' + Date.now().toString().slice(-4),
      category: newIssueCategory as any,
      severity: newIssueSeverity,
      title: newIssueTitle,
      description: newIssueDesc,
      due_date: dueDate.toISOString().split('T')[0],
      status: 'OPEN',
    });

    setFindings(dbStore.getFindings(targetInstitution.id));
    setIssueNotice(`Deficiency ${created.id} registered into facility violation record.`);
    setNewIssueTitle('');
    setNewIssueDesc('');
    setTimeout(() => setIssueNotice(null), 3000);
  };

  const handleReviewAction = (
    actionId: string,
    decision: 'APPROVED' | 'REJECTED' | 'REINSPECTION_SCHEDULED'
  ) => {
    dbStore.reviewCorrectiveAction(
      actionId,
      decision,
      `Inspector assessment decision: ${decision} by ${currentUser.full_name}`,
      currentUser.id
    );
    setCorrectiveActions(dbStore.getCorrectiveActions());
    setFindings(dbStore.getFindings(targetInstitution.id));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs uppercase tracking-wider text-teal-400 font-semibold mb-1">
            Inspector Field Command
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {currentUser.full_name}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Badge: <span className="font-mono text-cyan-300">INSP-NZ-4019</span> · {currentUser.department} · {assignments.length} Assigned Duties
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleAvailability}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              isAvailable
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                : 'bg-rose-950/60 text-rose-300 border-rose-800'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isAvailable ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            <span>{isAvailable ? 'Available for Allocation' : 'Unavailable (Duty Capped)'}</span>
          </button>

          <Link
            to={`/checklist?inspectionId=${selectedAssignment?.id}`}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 transition-colors shadow-sm"
          >
            <ClipboardCheck className="h-3.5 w-3.5" />
            <span>Open Checklist</span>
          </Link>
        </div>
      </div>

      {profileNotice && (
        <div className="p-3 rounded-lg border border-teal-800 bg-teal-950/40 text-teal-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
          <span>{profileNotice}</span>
        </div>
      )}

      {/* Module Navigation Tabs */}
      <div className="flex flex-wrap gap-1 p-1 rounded-xl border border-slate-800 bg-[#090d16] text-xs">
        {[
          { key: 'duties', label: 'Assigned Duties & Scheduling', icon: Calendar },
          { key: 'profile', label: 'Inspector Profile', icon: User },
          { key: 'institution-details', label: 'Target Facility & NOCs', icon: Building2 },
          { key: 'live-inspection', label: 'Live Inspection & Checklist', icon: ClipboardCheck },
          { key: 'evidence-gps', label: 'GPS Geofence & Evidence', icon: Compass },
          { key: 'corrective-tracking', label: 'Remediation Review', icon: AlertTriangle },
          { key: 'history', label: 'Inspection History & Reports', icon: History },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-colors ${
                isActive
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ASSIGNED INSPECTIONS & SCHEDULING */}
      {activeTab === 'duties' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-[#090d16]">
              <span className="text-xs text-slate-400 block mb-1">Assigned Active Inspections</span>
              <div className="text-3xl font-bold font-mono text-white tabular-nums">
                {assignments.filter(a => a.status !== 'completed').length}
              </div>
              <span className="text-[11px] text-teal-400 mt-1 block">Scheduled for field review</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-[#090d16]">
              <span className="text-xs text-slate-400 block mb-1">Completed Inspections</span>
              <div className="text-3xl font-bold font-mono text-emerald-400 tabular-nums">
                {assignments.filter(a => a.status === 'completed').length}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Audits finalized and signed</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-[#090d16]">
              <span className="text-xs text-slate-400 block mb-1">Workload Quota</span>
              <div className="text-3xl font-bold font-mono text-cyan-400 tabular-nums">
                {currentUser.workload_count || 2} / 5
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Balanced by random algorithm</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-[#090d16] text-xs space-y-4">
            <h3 className="text-sm font-bold text-white">Active Duty Roster</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignments.map(a => {
                const isSelected = selectedAssignment?.id === a.id;
                const isCompleted = a.status === 'completed';
                return (
                  <div
                    key={a.id}
                    onClick={() => setSelectedAssignment(a)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-teal-500/60 bg-teal-950/20 shadow-sm'
                        : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-cyan-400 text-[10px] font-semibold">
                          #{a.id} · Algorithm: {a.assignment_algorithm}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                            isCompleted
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {a.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white mb-1">{a.institution_name}</h4>
                      <div className="text-[11px] text-slate-400 space-y-1 mb-3">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-slate-500" />
                          <span>{a.district}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-slate-500" />
                          <span>Window: {a.scheduled_date} to {a.deadline_date}</span>
                        </div>
                      </div>

                      {a.notes && (
                        <p className="text-[11px] text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                          {a.notes}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800 mt-4 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {isSelected ? '✓ Active Selection' : 'Click to select'}
                      </span>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedAssignment(a);
                          setActiveTab('live-inspection');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
                      >
                        Enter Field Mode
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INSPECTOR PROFILE */}
      {activeTab === 'profile' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#090d16] text-xs max-w-3xl space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Inspector Professional Credentials</h3>
              <p className="text-slate-400 mt-0.5">Official registration and zonal deployment details</p>
            </div>
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-teal-950 text-teal-300 border border-teal-800">
              Active Field Officer
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
              <span className="text-slate-400 block text-[11px] mb-1">Full Name</span>
              <span className="text-sm font-bold text-white">{currentUser.full_name}</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
              <span className="text-slate-400 block text-[11px] mb-1">Official Email</span>
              <span className="text-sm font-bold text-white truncate block">{currentUser.email}</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
              <span className="text-slate-400 block text-[11px] mb-1">Field Badge ID</span>
              <span className="text-sm font-bold font-mono text-cyan-300">INSP-NZ-4019</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
              <span className="text-slate-400 block text-[11px] mb-1">Zonal Division</span>
              <span className="text-sm font-bold text-white">{currentUser.department}</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
              <span className="text-slate-400 block text-[11px] mb-1">Contact Mobile</span>
              <span className="text-sm font-bold text-white">{currentUser.phone || '+91 98200 23456'}</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
              <span className="text-slate-400 block text-[11px] mb-1">Conflict Clearance</span>
              <span className="text-sm font-bold text-emerald-400">90-Day Separation Verified</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30">
            <h4 className="font-bold text-slate-200 mb-2">Statutory Inspection Certifications</h4>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                National Fire Safety Auditor (NFSA)
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Public Health & Sanitation Inspector
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                CPWD Structural Safety Reviewer
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INSTITUTION DETAILS & DOCUMENTS */}
      {activeTab === 'institution-details' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#090d16] text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="font-mono text-cyan-400 uppercase text-[10px] font-semibold">
                  Facility Code: {targetInstitution.code}
                </span>
                <h3 className="text-lg font-bold text-white">{targetInstitution.name}</h3>
                <p className="text-slate-400">{targetInstitution.address} · {targetInstitution.district}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase">Prior Compliance</span>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  {targetInstitution.overall_compliance_score}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/50">
              <div>
                <span className="text-slate-400 block text-[11px]">Contact Officer</span>
                <span className="font-bold text-slate-100">{targetInstitution.contact_person}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Contact Phone</span>
                <span className="font-bold text-slate-100">{targetInstitution.contact_phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Category</span>
                <span className="font-bold text-slate-100">{targetInstitution.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Funding</span>
                <span className="font-bold text-slate-100">{targetInstitution.funding_category}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                Mandatory Uploaded Documents & Certificates
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {institutionDocs.map(doc => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-200">{doc.document_type}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Expires: {doc.expiry_date} · {doc.status}
                      </div>
                    </div>
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      <span>View</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE INSPECTION & CHECKLIST */}
      {activeTab === 'live-inspection' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#090d16] text-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Live On-Site Checklist Execution</h3>
                <p className="text-slate-400">
                  Record real-time pass/fail observations for {targetInstitution.name}
                </p>
              </div>

              <button
                onClick={() => navigate(`/checklist?inspectionId=${selectedAssignment.id}`)}
                className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold"
              >
                Open Full Screen Checklist View
              </button>
            </div>

            <div className="space-y-3">
              {checklistItems.slice(0, 5).map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-1.5 py-0.2 rounded bg-slate-800 font-mono text-[10px] text-cyan-400 font-bold">
                        {item.item_code}
                      </span>
                      <span className="text-slate-400 text-[11px]">{item.category}</span>
                    </div>
                    <div className="font-bold text-slate-100">{item.question}</div>
                    <div className="text-[11px] text-slate-400 mt-1 italic">{item.comments}</div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleChecklistChange(item.id, 'PASS')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                        item.status === 'PASS'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      PASS
                    </button>
                    <button
                      onClick={() => handleChecklistChange(item.id, 'FAIL')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                        item.status === 'FAIL'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      FAIL
                    </button>
                    <button
                      onClick={() => handleChecklistChange(item.id, 'NA')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                        item.status === 'NA'
                          ? 'bg-slate-700/40 text-slate-200 border border-slate-600'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      N/A
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Record Violation Form */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
                Quick Report Facility Violation / Hazard
              </h4>

              {issueNotice && (
                <div className="mb-3 p-3 rounded-lg border border-teal-800 bg-teal-950/40 text-teal-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-400" />
                  <span>{issueNotice}</span>
                </div>
              )}

              <form onSubmit={handleReportNewViolation} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Violation Headline</label>
                    <input
                      type="text"
                      required
                      value={newIssueTitle}
                      onChange={e => setNewIssueTitle(e.target.value)}
                      placeholder="e.g. Block C exit stairwell blocked"
                      className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Category</label>
                    <select
                      value={newIssueCategory}
                      onChange={e => setNewIssueCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100"
                    >
                      <option value="Food & Drinking Water">Food & Drinking Water</option>
                      <option value="Toilets & Sanitation">Toilets & Sanitation</option>
                      <option value="Accommodation & Living">Accommodation & Living</option>
                      <option value="Safety & Accessibility">Safety & Accessibility</option>
                      <option value="Maintenance & Facilities">Maintenance & Facilities</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Severity Rating</label>
                    <select
                      value={newIssueSeverity}
                      onChange={e => setNewIssueSeverity(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100"
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                      <option value="CRITICAL">CRITICAL</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Detailed Description</label>
                  <textarea
                    rows={2}
                    required
                    value={newIssueDesc}
                    onChange={e => setNewIssueDesc(e.target.value)}
                    placeholder="Provide exact location, hazards noted, and immediate instructions..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold"
                  >
                    Log Defect Finding
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GPS GEOFENCE & EVIDENCE */}
      {activeTab === 'evidence-gps' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#090d16] text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Spatial Geofence Telemetry</h3>
                <p className="text-slate-400">Verifying inspector proximity to {targetInstitution.name}</p>
              </div>

              <Link
                to="/verification"
                className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5"
              >
                <Camera className="h-3.5 w-3.5" />
                <span>Launch Camera & Hash</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/50">
              <div>
                <span className="text-slate-400 block text-[11px] mb-1">Target Facility Anchor</span>
                <span className="font-mono text-cyan-300 font-bold block">
                  {targetInstitution.latitude.toFixed(4)}° N, {targetInstitution.longitude.toFixed(4)}° E
                </span>
                <span className="text-[10px] text-slate-400">Institutional Geofence Origin</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-1">Inspector Current Fix</span>
                <span className="font-mono text-slate-200 font-bold block">
                  {currentGps ? `${currentGps.lat.toFixed(4)}° N, ${currentGps.lon.toFixed(4)}° E` : 'Acquiring...'}
                </span>
                <span className="text-[10px] text-slate-400">Browser Geolocation GPS Sensor</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-1">Geofence Compliance</span>
                {geofenceResult?.withinRange ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Within Boundary ({geofenceResult.distanceMeters}m away)
                  </span>
                ) : (
                  <span className="text-rose-400 font-bold">Outside Geofence Tolerance</span>
                )}
                <span className="text-[10px] text-slate-400 block mt-0.5">Tolerance: 500 meters</span>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                Captured Photo Records for this Audit ({evidenceList.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {evidenceList.map(evi => (
                  <div
                    key={evi.id}
                    className="p-3 rounded-xl border border-slate-800 bg-slate-900/40 flex gap-3"
                  >
                    <img
                      src={evi.file_url}
                      alt={evi.file_name}
                      className="h-16 w-20 object-cover rounded-lg border border-slate-800 bg-slate-950"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-cyan-400 font-bold text-[10px]">{evi.id}</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-teal-950 text-teal-300 border border-teal-800 font-bold">
                          {evi.is_live_capture ? 'LIVE' : 'UPLOAD'}
                        </span>
                      </div>
                      <div className="font-bold text-slate-200 truncate mt-0.5">{evi.file_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        SHA-256: {evi.sha256_hash.slice(0, 16)}...
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CORRECTIVE ACTION TRACKING */}
      {activeTab === 'corrective-tracking' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#090d16] text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Institution Remediation Tracking & Signoff</h3>
              <span className="text-slate-400 font-mono text-[11px]">
                {correctiveActions.length} Submissions
              </span>
            </div>

            <div className="space-y-4">
              {correctiveActions.map(action => (
                <div
                  key={action.id}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-cyan-400 font-bold text-[10px]">
                        Action #{action.id} · Finding #{action.finding_id}
                      </span>
                      <h4 className="font-bold text-slate-100 text-sm mt-0.5">
                        {action.action_summary}
                      </h4>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold ${
                        action.status === 'APPROVED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {action.status}
                    </span>
                  </div>

                  <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    {action.detailed_notes}
                  </p>

                  {action.evidence_urls && action.evidence_urls.length > 0 && (
                    <div className="flex gap-2">
                      {action.evidence_urls.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt="Proof"
                          className="h-16 w-24 object-cover rounded-lg border border-slate-700 bg-slate-900"
                        />
                      ))}
                    </div>
                  )}

                  {action.status === 'PENDING_APPROVAL' && (
                    <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                      <button
                        onClick={() => handleReviewAction(action.id, 'REINSPECTION_SCHEDULED')}
                        className="px-3 py-1.5 rounded-lg border border-amber-700 text-amber-300 hover:bg-amber-950/40 font-bold"
                      >
                        Request Re-Inspection
                      </button>
                      <button
                        onClick={() => handleReviewAction(action.id, 'APPROVED')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                      >
                        Approve & Close Defect
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: INSPECTION HISTORY */}
      {activeTab === 'history' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#090d16] text-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Completed Inspection History</h3>
              <p className="text-slate-400 mt-0.5">Historical surveillance audit records submitted by officer</p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold flex items-center gap-1.5"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Print Officer Log</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px] border-y border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Duty ID</th>
                  <th className="py-2.5 px-3">Target Institution</th>
                  <th className="py-2.5 px-3">District</th>
                  <th className="py-2.5 px-3">Scheduled</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {assignments.map(a => (
                  <tr key={a.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-cyan-400 font-semibold">{a.id}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-200">{a.institution_name}</td>
                    <td className="py-2.5 px-3 text-slate-300">{a.district}</td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono">{a.scheduled_date}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-slate-300 border border-slate-800">
                        {a.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedAssignment(a);
                          setActiveTab('live-inspection');
                        }}
                        className="text-cyan-400 hover:text-cyan-300 font-medium"
                      >
                        Review Audit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
