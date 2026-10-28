import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { dbStore } from '../../services/store.ts';
import { Institution, Finding, InstitutionDocument, NotificationItem } from '../../types/index.ts';
import { Link } from 'react-router-dom';
import {
  Building2,
  Calendar,
  Clock,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Bell,
  FileText,
  Download,
  Edit,
  Save,
  Plus,
  Trash2,
  Eye,
  Send,
  X,
  FileCheck2,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  User,
  ExternalLink,
} from 'lucide-react';

export const ManagerPortal: React.FC = () => {
  const { currentUser } = useAuth();
  const institutions = dbStore.getInstitutions();

  // Active Institution for this manager
  const [institution, setInstitution] = useState<Institution>(() => {
    return institutions.find(i => i.id === currentUser.institution_id) || institutions[0];
  });

  const [activeTab, setActiveTab] = useState<
    'overview' | 'profile' | 'schedule' | 'documents' | 'issues' | 'notifications' | 'reports'
  >('overview');

  // Institution Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    contact_person: institution.contact_person,
    contact_email: institution.contact_email,
    contact_phone: institution.contact_phone,
    address: institution.address,
    student_capacity: institution.student_capacity,
  });
  const [profileNotice, setProfileNotice] = useState<string | null>(null);

  // Documents state
  const [documents, setDocuments] = useState<InstitutionDocument[]>(
    dbStore.getDocuments(institution.id)
  );
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docType, setDocType] = useState<InstitutionDocument['document_type']>('Fire Safety Certificate');
  const [docFileName, setDocFileName] = useState('');
  const [docExpiry, setDocExpiry] = useState('2027-12-31');
  const [docNotes, setDocNotes] = useState('');

  // Findings & Corrective actions
  const [findings, setFindings] = useState<Finding[]>(dbStore.getFindings(institution.id));
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(findings[0] || null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionSummary, setActionSummary] = useState('');
  const [actionNotes, setActionNotes] = useState('');
  const [actionEvidenceUrl, setActionEvidenceUrl] = useState('');

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    dbStore.getNotifications('manager', institution.id)
  );

  // Assignments & Reports
  const assignments = dbStore.getAssignments().filter(a => a.institution_id === institution.id);

  // Profile update handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = dbStore.updateInstitution(institution.id, profileForm);
    if (updated) {
      setInstitution(updated);
      setIsEditingProfile(false);
      setProfileNotice('Institution profile updated successfully in official registry.');
      setTimeout(() => setProfileNotice(null), 3000);
    }
  };

  // Document upload handler
  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const created = dbStore.addDocument({
      institution_id: institution.id,
      document_type: docType,
      file_name: docFileName || `${docType.replace(/\s+/g, '_')}_NOC.pdf`,
      file_url: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&auto=format&fit=crop&q=80',
      file_size_bytes: 2150000,
      expiry_date: docExpiry,
      status: 'PENDING_VERIFICATION',
      notes: docNotes,
    });
    setDocuments(dbStore.getDocuments(institution.id));
    setShowUploadModal(false);
    setDocFileName('');
    setDocNotes('');
  };

  const handleDeleteDocument = (id: string) => {
    dbStore.deleteDocument(id);
    setDocuments(dbStore.getDocuments(institution.id));
  };

  // Corrective Action submission
  const handleSubmitAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFinding) return;

    dbStore.submitCorrectiveAction({
      finding_id: selectedFinding.id,
      institution_id: institution.id,
      submitted_by_id: currentUser.id,
      action_summary: actionSummary,
      detailed_notes: actionNotes,
      evidence_urls: actionEvidenceUrl
        ? [actionEvidenceUrl]
        : ['https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80'],
      evidence_hashes: ['e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'],
    });

    setFindings(dbStore.getFindings(institution.id));
    setShowActionModal(false);
    setActionSummary('');
    setActionNotes('');
    setActionEvidenceUrl('');
  };

  const handleMarkNotifRead = (id: string) => {
    dbStore.markNotificationRead(id);
    setNotifications(dbStore.getNotifications('manager', institution.id));
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Institution Hub Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-1">
            Institutional Management Hub
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {institution.name}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Facility Code: <span className="font-mono text-cyan-300">{institution.code}</span> · {institution.district}, {institution.state}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-slate-900 border border-slate-800 text-slate-300">
            Manager: {currentUser.full_name}
          </span>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm shadow-amber-500/20"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload Certificate</span>
          </button>
        </div>
      </div>

      {profileNotice && (
        <div className="p-3 rounded-lg border border-emerald-800 bg-emerald-950/40 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{profileNotice}</span>
        </div>
      )}

      {/* Primary Module Navigation Tabs */}
      <div className="flex flex-wrap gap-1 p-1 rounded-xl border border-slate-800 bg-[#090d16] text-xs">
        {[
          { key: 'overview', label: 'Overview', icon: Building2 },
          { key: 'profile', label: 'Institution Profile', icon: Edit },
          { key: 'schedule', label: 'Inspection Schedule & Status', icon: Calendar },
          { key: 'documents', label: 'Document Upload & NOCs', icon: FileCheck2 },
          { key: 'issues', label: 'Issue Management & Actions', icon: AlertTriangle },
          { key: 'notifications', label: `Notifications (${unreadNotifsCount})`, icon: Bell },
          { key: 'reports', label: 'Inspection Reports', icon: FileText },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-colors ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-[#090d16]">
              <span className="text-xs text-slate-400 block mb-1">Overall Compliance Score</span>
              <div className="text-3xl font-bold font-mono text-emerald-400 tabular-nums">
                {institution.overall_compliance_score}%
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Rating across 5 domains</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-[#090d16]">
              <span className="text-xs text-slate-400 block mb-1">Active Deficiencies</span>
              <div className="text-3xl font-bold font-mono text-rose-400 tabular-nums">
                {findings.filter(f => f.status !== 'CLOSED').length}
              </div>
              <span className="text-[11px] text-rose-300 mt-1 block">Remediation action required</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-[#090d16]">
              <span className="text-xs text-slate-400 block mb-1">Valid Statutory NOCs</span>
              <div className="text-3xl font-bold font-mono text-cyan-400 tabular-nums">
                {documents.filter(d => d.status === 'VALID').length} / {documents.length}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Uploaded certificates</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-[#090d16]">
              <span className="text-xs text-slate-400 block mb-1">Inspection Duty Window</span>
              <div className="text-xl font-bold font-mono text-amber-300">
                {assignments[0]?.status === 'in_progress' ? 'IN PROGRESS' : 'Oct 30 - Nov 05'}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Unannounced surveillance</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Issues List */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#090d16] text-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white">Pending Deficiencies Requiring Action</h3>
                <button
                  onClick={() => setActiveTab('issues')}
                  className="text-amber-400 hover:text-amber-300 font-semibold text-xs"
                >
                  Manage All →
                </button>
              </div>

              {findings.filter(f => f.status !== 'CLOSED').length === 0 ? (
                <div className="p-4 text-center text-emerald-400 bg-emerald-950/20 rounded-xl border border-emerald-900/40">
                  <CheckCircle2 className="h-6 w-6 mx-auto mb-1 text-emerald-400" />
                  <span>All reported findings are resolved and signed off!</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {findings
                    .filter(f => f.status !== 'CLOSED')
                    .slice(0, 3)
                    .map(f => (
                      <div
                        key={f.id}
                        className="p-3 rounded-xl border border-slate-800 bg-slate-900/50 flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-cyan-400 font-bold">{f.id}</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-950 text-rose-300 border border-rose-800">
                              {f.severity}
                            </span>
                          </div>
                          <div className="font-bold text-slate-200">{f.title}</div>
                          <div className="text-[11px] text-slate-400">Due Date: {f.due_date}</div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedFinding(f);
                            setShowActionModal(true);
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                        >
                          Submit Proof
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Quick Document Status */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#090d16] text-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white">Mandatory Compliance Certificates</h3>
                <button
                  onClick={() => setActiveTab('documents')}
                  className="text-amber-400 hover:text-amber-300 font-semibold text-xs"
                >
                  Upload New →
                </button>
              </div>

              <div className="space-y-2">
                {documents.slice(0, 4).map(doc => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl border border-slate-800 bg-slate-900/50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-200">{doc.document_type}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Expires: {doc.expiry_date} · {doc.file_name}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        doc.status === 'VALID'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INSTITUTION PROFILE */}
      {activeTab === 'profile' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#090d16] text-xs max-w-4xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Facility Master Information</h3>
              <p className="text-slate-400 mt-0.5">
                Keep administrative contact information and emergency coordinates current
              </p>
            </div>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 font-semibold"
              >
                <Edit className="h-3.5 w-3.5 text-amber-400" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Facility Name (Official)</label>
                <input
                  type="text"
                  disabled
                  value={institution.name}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Registration Code</label>
                <input
                  type="text"
                  disabled
                  value={institution.code}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 font-mono cursor-not-allowed uppercase"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Category & Funding</label>
                <input
                  type="text"
                  disabled
                  value={`${institution.category} (${institution.funding_category})`}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Authorized Contact Officer</label>
                <input
                  type="text"
                  required
                  disabled={!isEditingProfile}
                  value={profileForm.contact_person}
                  onChange={e => setProfileForm({ ...profileForm, contact_person: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border text-slate-100 ${
                    isEditingProfile
                      ? 'border-cyan-500 bg-slate-900'
                      : 'border-slate-800 bg-slate-950 text-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  disabled={!isEditingProfile}
                  value={profileForm.contact_email}
                  onChange={e => setProfileForm({ ...profileForm, contact_email: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border text-slate-100 ${
                    isEditingProfile
                      ? 'border-cyan-500 bg-slate-900'
                      : 'border-slate-800 bg-slate-950 text-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Official Phone</label>
                <input
                  type="text"
                  required
                  disabled={!isEditingProfile}
                  value={profileForm.contact_phone}
                  onChange={e => setProfileForm({ ...profileForm, contact_phone: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border text-slate-100 ${
                    isEditingProfile
                      ? 'border-cyan-500 bg-slate-900'
                      : 'border-slate-800 bg-slate-950 text-slate-300'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Physical Address</label>
              <textarea
                rows={2}
                disabled={!isEditingProfile}
                value={profileForm.address}
                onChange={e => setProfileForm({ ...profileForm, address: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border text-slate-100 ${
                  isEditingProfile
                    ? 'border-cyan-500 bg-slate-900'
                    : 'border-slate-800 bg-slate-950 text-slate-300'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Student / Resident Capacity</label>
                <input
                  type="number"
                  disabled={!isEditingProfile}
                  value={profileForm.student_capacity}
                  onChange={e =>
                    setProfileForm({ ...profileForm, student_capacity: parseInt(e.target.value) || 0 })
                  }
                  className={`w-full px-3 py-2 rounded-lg border text-slate-100 font-mono ${
                    isEditingProfile
                      ? 'border-cyan-500 bg-slate-900'
                      : 'border-slate-800 bg-slate-950 text-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">GPS Geofence Anchor (Fixed)</label>
                <input
                  type="text"
                  disabled
                  value={`${institution.latitude.toFixed(4)}° N, ${institution.longitude.toFixed(4)}° E`}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-cyan-400 font-mono cursor-not-allowed"
                />
              </div>
            </div>

            {isEditingProfile && (
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Profile Updates</span>
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* TAB 3: INSPECTION SCHEDULE & STATUS */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#090d16] text-xs">
            <h3 className="text-sm font-bold text-white mb-1">Inspection Duty Schedule & Progress Tracker</h3>
            <p className="text-slate-400 mb-5">
              Live tracking of upcoming, ongoing, and completed surveillance cycles
            </p>

            <div className="space-y-4">
              {assignments.map(a => {
                const isCompleted = a.status === 'completed';
                const isInProgress = a.status === 'in_progress';
                return (
                  <div
                    key={a.id}
                    className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-mono text-cyan-400 uppercase font-semibold">
                          Assignment #{a.id} · Algorithm: {a.assignment_algorithm}
                        </span>
                        <h4 className="text-base font-bold text-white mt-0.5">
                          Assigned Inspector: {a.inspector_name}
                        </h4>
                        <div className="text-slate-400 mt-0.5">
                          Scheduled: <strong className="text-slate-200">{a.scheduled_date}</strong> · Deadline: <strong className="text-slate-200">{a.deadline_date}</strong>
                        </div>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase ${
                          isCompleted
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : isInProgress
                            ? 'bg-sky-950 text-sky-300 border border-sky-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {a.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Progress tracker bar */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Stage 1: Randomized Dispatch</span>
                        <span>Stage 2: On-Site Audit</span>
                        <span>Stage 3: Evidence Hash Verification</span>
                        <span>Stage 4: Final Signoff</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isCompleted ? 'w-full bg-emerald-500' : isInProgress ? 'w-2/3 bg-sky-500' : 'w-1/3 bg-amber-500'
                          }`}
                        />
                      </div>
                    </div>

                    {a.notes && (
                      <p className="text-[11px] text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        <strong>Inspector Special Focus:</strong> {a.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DOCUMENT UPLOAD */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#090d16] text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-5">
              <div>
                <h3 className="text-base font-bold text-white">Statutory Facility Documents & NOCs</h3>
                <p className="text-slate-400 mt-0.5">
                  Upload mandatory certificates for fire safety, potable water tests, and structural NOCs
                </p>
              </div>

              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Upload New Certificate</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map(doc => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] text-cyan-400 uppercase font-semibold">
                        {doc.id}
                      </span>
                      <h4 className="text-sm font-bold text-slate-100">{doc.document_type}</h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{doc.file_name}</p>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        doc.status === 'VALID'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 space-y-1">
                    <div>Expiry Date: <strong className="text-slate-200">{doc.expiry_date}</strong></div>
                    <div>Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}</div>
                    {doc.notes && <div className="text-slate-400 italic">{doc.notes}</div>}
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View File</span>
                    </a>

                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="text-rose-400 hover:text-rose-300 p-1 rounded"
                      title="Delete document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ISSUE MANAGEMENT & CORRECTIVE ACTIONS */}
      {activeTab === 'issues' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#090d16] text-xs">
            <h3 className="text-base font-bold text-white mb-1">Inspection Findings & Corrective Action Portal</h3>
            <p className="text-slate-400 mb-5">
              Review deficiencies raised by inspectors and file formal remediation evidence with photographs
            </p>

            <div className="space-y-4">
              {findings.map(finding => {
                const isClosed = finding.status === 'CLOSED';
                return (
                  <div
                    key={finding.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isClosed
                        ? 'border-emerald-900/40 bg-emerald-950/10'
                        : 'border-slate-800 bg-slate-900/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-cyan-400 font-semibold">{finding.id}</span>
                          <span className="text-slate-500">·</span>
                          <span className="text-slate-300">{finding.category}</span>
                          <span className="text-slate-500">·</span>
                          <span className="text-slate-400">Due: {finding.due_date}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-100">{finding.title}</h4>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            finding.severity === 'CRITICAL'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {finding.severity}
                        </span>

                        <span
                          className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase font-mono ${
                            isClosed
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : finding.status === 'CORRECTION_SUBMITTED'
                              ? 'bg-sky-950 text-sky-300 border border-sky-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {finding.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-300 leading-relaxed mb-4 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                      <strong>Inspector Observation:</strong> {finding.description}
                    </p>

                    <div className="flex justify-end gap-3 pt-2">
                      {!isClosed && (
                        <button
                          onClick={() => {
                            setSelectedFinding(finding);
                            setShowActionModal(true);
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors"
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span>Submit Action Proof</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#090d16] text-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Official Notices & Surveillance Reminders</h3>
            <span className="text-slate-400 font-mono text-[11px]">{unreadNotifsCount} Unread Alerts</span>
          </div>

          <div className="space-y-3">
            {notifications.map(n => (
              <div
                key={n.id}
                onClick={() => handleMarkNotifRead(n.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  n.read ? 'border-slate-800 bg-slate-900/30' : 'border-amber-500/50 bg-amber-950/20'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-100">{n.title}</span>
                    {!n.read && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500 text-slate-950 font-bold">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300">{n.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1.5 block font-mono">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="shrink-0">
                  <CheckCircle2 className={`h-4 w-4 ${n.read ? 'text-slate-600' : 'text-amber-400'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: INSPECTION REPORTS */}
      {activeTab === 'reports' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#090d16] text-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Official Facility Inspection Reports</h3>
              <p className="text-slate-400 mt-0.5">
                Download compiled audit certificates and compliance breakdown sheets
              </p>
            </div>
            <Link
              to="/reports"
              className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Full Audit Ledger</span>
            </Link>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">
                  Annual Standards Inspection Dossier — 2026 Cycle
                </h4>
                <p className="text-[11px] text-slate-400">
                  Conducted by Directorate of Quality & Standards · Overall Score: {institution.overall_compliance_score}%
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 font-semibold"
              >
                Download PDF Summary
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-[11px]">
              <div>
                <span className="text-slate-400 block">Food & Drinking Water</span>
                <span className="font-bold text-emerald-400">88% Compliant</span>
              </div>
              <div>
                <span className="text-slate-400 block">Toilets & Sanitation</span>
                <span className="font-bold text-emerald-400">92% Compliant</span>
              </div>
              <div>
                <span className="text-slate-400 block">Safety & Accessibility</span>
                <span className="font-bold text-amber-400">68% (Remediation in Progress)</span>
              </div>
              <div>
                <span className="text-slate-400 block">Accommodation & Living</span>
                <span className="font-bold text-emerald-400">82% Compliant</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#090d16] border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white">Upload Statutory Certificate</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUploadDocument} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Document Type</label>
                <select
                  value={docType}
                  onChange={e => setDocType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="Fire Safety Certificate">Fire Safety Certificate</option>
                  <option value="Water Potability Report">Water Potability Report</option>
                  <option value="Building Safety NOC">Building Safety NOC</option>
                  <option value="Food Safety / FSSAI License">Food Safety / FSSAI License</option>
                  <option value="Sanitation Certificate">Sanitation Certificate</option>
                  <option value="Electrical Safety Audit">Electrical Safety Audit</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">File Name</label>
                <input
                  type="text"
                  required
                  value={docFileName}
                  onChange={e => setDocFileName(e.target.value)}
                  placeholder="e.g. Fire_NOC_2026_Renewal.pdf"
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Expiry / Renewal Date</label>
                <input
                  type="date"
                  required
                  value={docExpiry}
                  onChange={e => setDocExpiry(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Issuing Authority / Notes</label>
                <textarea
                  rows={2}
                  value={docNotes}
                  onChange={e => setDocNotes(e.target.value)}
                  placeholder="Issued by State Fire Department, Inspector seal verified..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Commit Document Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Corrective Action Modal */}
      {showActionModal && selectedFinding && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#090d16] border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white">Submit Action Taken Proof</h3>
              <button onClick={() => setShowActionModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAction} className="space-y-4 text-xs">
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60">
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                  Resolving Finding: {selectedFinding.id}
                </span>
                <div className="font-bold text-slate-200 mt-0.5">{selectedFinding.title}</div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Action Summary</label>
                <input
                  type="text"
                  required
                  value={actionSummary}
                  onChange={e => setActionSummary(e.target.value)}
                  placeholder="e.g. Replaced defective fire extinguishers and cleaned hall"
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Rectification Details & Contractor Receipt</label>
                <textarea
                  rows={3}
                  required
                  value={actionNotes}
                  onChange={e => setActionNotes(e.target.value)}
                  placeholder="Explain repair contractor details, purchase receipt numbers, test results..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Supporting Photographic Proof URL</label>
                <input
                  type="url"
                  value={actionEvidenceUrl}
                  onChange={e => setActionEvidenceUrl(e.target.value)}
                  placeholder="https://... photo url"
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowActionModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Submit Remediation Proof
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
