import React, { useState } from 'react';
import { dbStore } from '../../services/store.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { Finding, CorrectiveAction, FindingStatus, SeverityLevel } from '../../types/index.ts';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  RotateCcw,
  ShieldCheck,
  Building2,
  Calendar,
  Send,
  MessageSquare,
  FileCheck,
  ChevronRight,
  X,
} from 'lucide-react';

export const FindingsPage: React.FC = () => {
  const { currentUser, activeRole } = useAuth();
  const [findings, setFindings] = useState<Finding[]>(dbStore.getFindings());
  const [selectedFinding, setSelectedFinding] = useState<Finding>(findings[0]);
  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction[]>(
    dbStore.getCorrectiveActions()
  );

  // Review modal / action states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewDecision, setReviewDecision] = useState<'APPROVED' | 'REJECTED' | 'REINSPECTION_SCHEDULED'>('APPROVED');
  const [reviewFeedback, setReviewFeedback] = useState('');

  // Submit corrective action state (for institution manager)
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionSummary, setActionSummary] = useState('');
  const [actionNotes, setActionNotes] = useState('');
  const [actionEvidenceUrl, setActionEvidenceUrl] = useState('');

  const currentAction = correctiveActions.find(ca => ca.finding_id === selectedFinding?.id);

  const handleReviewSubmit = () => {
    if (!currentAction) return;

    dbStore.reviewCorrectiveAction(
      currentAction.id,
      reviewDecision,
      reviewFeedback,
      currentUser.id
    );

    // Refresh state
    setFindings(dbStore.getFindings());
    setCorrectiveActions(dbStore.getCorrectiveActions());
    setShowReviewModal(false);
    setReviewFeedback('');
  };

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFinding) return;

    dbStore.submitCorrectiveAction({
      finding_id: selectedFinding.id,
      institution_id: selectedFinding.institution_id,
      submitted_by_id: currentUser.id,
      action_summary: actionSummary,
      detailed_notes: actionNotes,
      evidence_urls: actionEvidenceUrl ? [actionEvidenceUrl] : [],
      evidence_hashes: ['e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'],
    });

    setFindings(dbStore.getFindings());
    setCorrectiveActions(dbStore.getCorrectiveActions());
    setShowActionModal(false);
    setActionSummary('');
    setActionNotes('');
    setActionEvidenceUrl('');
  };

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-950 text-rose-300 border-rose-800';
      case 'HIGH':
        return 'bg-orange-950 text-orange-300 border-orange-800';
      case 'MEDIUM':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getStatusBadge = (status: FindingStatus) => {
    switch (status) {
      case 'CLOSED':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'CORRECTION_SUBMITTED':
        return 'bg-sky-950 text-sky-300 border-sky-800';
      case 'UNDER_REVIEW':
        return 'bg-purple-950 text-purple-300 border-purple-800';
      case 'REINSPECTION_REQUIRED':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      default:
        return 'bg-rose-950 text-rose-300 border-rose-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-1">
            Remediation & Escalation Cycle
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Findings & Corrective Actions
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit deficiencies, institution remediation proof, and authorized review signoff
          </p>
        </div>

        {/* Quick Role Context Notice */}
        <div className="text-xs text-slate-400">
          Viewing as <strong className="text-slate-200 capitalize">{activeRole}</strong> ({currentUser.full_name})
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Findings List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Detected Non-Compliances ({findings.length})
          </h3>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {findings.map(finding => {
              const isSelected = selectedFinding?.id === finding.id;
              return (
                <div
                  key={finding.id}
                  onClick={() => setSelectedFinding(finding)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-cyan-500/60 bg-cyan-950/20'
                      : 'border-slate-800 bg-[#090d16] hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                      {finding.id} · {finding.checklist_item_id}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(finding.severity)}`}>
                      {finding.severity}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{finding.title}</h4>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                    <span className="truncate">{finding.institution_name}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono border ${getStatusBadge(finding.status)}`}>
                      {finding.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Detailed Finding, Corrective Action & Review Loop */}
        {selectedFinding && (
          <div className="lg:col-span-2 space-y-5">
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#090d16]">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800 mb-5">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <span className="font-mono text-cyan-400 font-semibold">{selectedFinding.id}</span>
                    <span>·</span>
                    <span>{selectedFinding.category}</span>
                    <span>·</span>
                    <span>Due: {selectedFinding.due_date}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">{selectedFinding.title}</h2>
                  <p className="text-xs text-cyan-300 mt-0.5 font-medium">
                    Facility: {selectedFinding.institution_name}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusBadge(selectedFinding.status)}`}>
                    Status: {selectedFinding.status}
                  </span>
                </div>
              </div>

              {/* Finding Description & Observation */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 mb-6 text-xs">
                <span className="text-slate-400 block font-semibold mb-1">
                  Inspector Deficiency Report:
                </span>
                <p className="text-slate-200 leading-relaxed">{selectedFinding.description}</p>
              </div>

              {/* Corrective Action Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Institution Remediation Submission
                  </h3>

                  {/* Manager Action Trigger */}
                  {selectedFinding.status !== 'CLOSED' && (
                    <button
                      onClick={() => setShowActionModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors"
                    >
                      <Send className="h-3 w-3" />
                      <span>Submit Action Proof</span>
                    </button>
                  )}
                </div>

                {currentAction ? (
                  <div className="p-4 rounded-xl border border-cyan-900/40 bg-cyan-950/10 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100">{currentAction.action_summary}</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(currentAction.submitted_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-slate-300 leading-relaxed">{currentAction.detailed_notes}</p>

                    {currentAction.evidence_urls && currentAction.evidence_urls.length > 0 && (
                      <div className="pt-2">
                        <span className="text-slate-400 text-[11px] block mb-1.5">Submitted Photographic Proof:</span>
                        <div className="flex gap-2">
                          {currentAction.evidence_urls.map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt="Remediation Proof"
                              className="h-20 w-28 object-cover rounded-lg border border-slate-700 bg-slate-900"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {currentAction.reviewer_feedback && (
                      <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/80 text-xs mt-3">
                        <span className="font-semibold text-slate-200 block mb-0.5">
                          Reviewer Decision Feedback:
                        </span>
                        <p className="text-slate-300">{currentAction.reviewer_feedback}</p>
                      </div>
                    )}

                    {/* Admin / Inspector Review Controls */}
                    {activeRole !== 'manager' && currentAction.status === 'PENDING_APPROVAL' && (
                      <div className="pt-3 border-t border-slate-800/80 flex justify-end">
                        <button
                          onClick={() => setShowReviewModal(true)}
                          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
                        >
                          Review & Sign Off Action
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-5 rounded-xl border border-slate-800/60 bg-slate-900/30 text-center text-xs text-slate-400">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-slate-500" />
                    <span>No remediation submission filed yet. Awaiting institution action.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#090d16] border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white">Review Corrective Remediation</h3>
              <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Review Decision</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setReviewDecision('APPROVED')}
                    className={`py-2 rounded-lg font-bold transition-colors ${
                      reviewDecision === 'APPROVED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    Approve & Close
                  </button>
                  <button
                    onClick={() => setReviewDecision('REINSPECTION_SCHEDULED')}
                    className={`py-2 rounded-lg font-bold transition-colors ${
                      reviewDecision === 'REINSPECTION_SCHEDULED'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    Reinspect
                  </button>
                  <button
                    onClick={() => setReviewDecision('REJECTED')}
                    className={`py-2 rounded-lg font-bold transition-colors ${
                      reviewDecision === 'REJECTED'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    Reject
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Reviewer Feedback Notes</label>
                <textarea
                  rows={3}
                  value={reviewFeedback}
                  onChange={e => setReviewFeedback(e.target.value)}
                  placeholder="Enter assessment remarks and justification..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReviewSubmit}
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Confirm Assessment Signoff
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Action Modal for Institution Manager */}
      {showActionModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#090d16] border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white">Submit Remediation Evidence</h3>
              <button onClick={() => setShowActionModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleActionSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Action Summary</label>
                <input
                  type="text"
                  required
                  value={actionSummary}
                  onChange={e => setActionSummary(e.target.value)}
                  placeholder="e.g. Replaced fire extinguisher cylinder and cleared corridor"
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Detailed Rectification Notes</label>
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
                <label className="block text-slate-300 font-medium mb-1">
                  Photo Proof Image URL (or Camera snapshot)
                </label>
                <input
                  type="url"
                  value={actionEvidenceUrl}
                  onChange={e => setActionEvidenceUrl(e.target.value)}
                  placeholder="https://... or upload link"
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
                  File Corrective Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
