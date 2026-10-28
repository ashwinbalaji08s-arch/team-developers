import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { dbStore } from '../../services/store.ts';
import { ChecklistItemResponse, ChecklistCategory, ChecklistItemStatus, SeverityLevel } from '../../types/index.ts';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Save,
  Send,
  Camera,
  AlertTriangle,
  Building2,
  Calendar,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const ChecklistPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const inspectionId = searchParams.get('inspectionId') || 'asg-01';
  const assignment = dbStore.getAssignment(inspectionId);
  const institution = assignment ? dbStore.getInstitution(assignment.institution_id) : dbStore.getInstitutions()[0];

  const [items, setItems] = useState<ChecklistItemResponse[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ChecklistCategory>('Food & Drinking Water');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    const loaded = dbStore.getChecklistResponses(inspectionId);
    setItems(loaded);
  }, [inspectionId]);

  const categories: ChecklistCategory[] = [
    'Food & Drinking Water',
    'Toilets & Sanitation',
    'Accommodation & Living',
    'Safety & Accessibility',
    'Maintenance & Facilities',
  ];

  const handleStatusChange = (itemId: string, status: ChecklistItemStatus) => {
    setItems(prev =>
      prev.map(it => (it.id === itemId ? { ...it, status, updated_at: new Date().toISOString() } : it))
    );
  };

  const handleSeverityChange = (itemId: string, severity: SeverityLevel) => {
    setItems(prev =>
      prev.map(it => (it.id === itemId ? { ...it, severity, updated_at: new Date().toISOString() } : it))
    );
  };

  const handleCommentsChange = (itemId: string, comments: string) => {
    setItems(prev =>
      prev.map(it => (it.id === itemId ? { ...it, comments, updated_at: new Date().toISOString() } : it))
    );
  };

  const handleSaveDraft = () => {
    dbStore.saveChecklistResponses(inspectionId, items);
    setSaveStatus('Draft safely saved to local storage.');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleSubmitInspection = () => {
    setValidationError(null);

    // Validate that failed items have explanatory comments
    const unannotatedFails = items.filter(it => it.status === 'FAIL' && it.comments.trim().length < 5);
    if (unannotatedFails.length > 0) {
      setValidationError(
        `Item ${unannotatedFails[0].item_code} is marked as FAIL. A detailed comment explaining the deficiency is strictly required.`
      );
      setSelectedCategory(unannotatedFails[0].category);
      return;
    }

    // Save final checklist responses
    dbStore.saveChecklistResponses(inspectionId, items);

    // Automatically spawn findings for failed items
    const failedItems = items.filter(it => it.status === 'FAIL');
    failedItems.forEach(fail => {
      // Check if finding already exists to prevent duplicate creation
      const existing = dbStore.getFindings().some(f => f.inspection_id === inspectionId && f.checklist_item_id === fail.item_code);
      if (!existing && institution) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + (fail.severity === 'CRITICAL' ? 3 : 10));

        dbStore.addFinding({
          institution_id: institution.id,
          institution_name: institution.name,
          inspection_id: inspectionId,
          checklist_item_id: fail.item_code,
          category: fail.category,
          severity: fail.severity,
          title: `Non-Compliance: ${fail.question.slice(0, 60)}...`,
          description: fail.comments || 'Deficiency detected during on-site audit.',
          due_date: dueDate.toISOString().split('T')[0],
          status: 'OPEN',
        });
      }
    });

    // Mark assignment as completed
    if (assignment) {
      dbStore.updateAssignment(assignment.id, { status: 'completed' });
    }

    // Add immutable audit event
    dbStore.addAuditEvent({
      action: 'INSPECTION_FINALIZED',
      entity_type: 'INSPECTION',
      entity_id: inspectionId,
      actor_id: assignment?.inspector_id || 'user-insp-01',
      actor_name: assignment?.inspector_name || 'Inspector',
      actor_role: 'inspector',
      details: {
        total_items: items.length,
        passed: items.filter(i => i.status === 'PASS').length,
        failed: failedItems.length,
        institution_id: institution?.id,
      },
    });

    setSaveStatus('Inspection finalized and submitted! Findings registered.');
    setTimeout(() => {
      navigate('/findings');
    }, 1200);
  };

  const filteredItems = items.filter(it => it.category === selectedCategory);
  const totalPassed = items.filter(it => it.status === 'PASS').length;
  const totalFailed = items.filter(it => it.status === 'FAIL').length;
  const totalNA = items.filter(it => it.status === 'NA').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1">
            Standard Field Protocol
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Digital Inspection Checklist
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Facility: <strong className="text-slate-200">{institution?.name}</strong> · Assignment #{inspectionId}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Save className="h-3.5 w-3.5 text-cyan-400" />
            <span>Save Offline Draft</span>
          </button>

          <button
            onClick={handleSubmitInspection}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-sm shadow-cyan-500/20"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Submit Finalized Audit</span>
          </button>
        </div>
      </div>

      {/* Save Status / Error Notification */}
      {saveStatus && (
        <div className="p-3 rounded-lg border border-emerald-800 bg-emerald-950/40 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{saveStatus}</span>
        </div>
      )}

      {validationError && (
        <div className="p-3 rounded-lg border border-rose-800 bg-rose-950/40 text-rose-200 text-xs flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Progress & Category Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-slate-800 bg-[#090d16] text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">Audit Progress</span>
          <span className="text-base font-bold text-white">
            {items.length} Checklist Items
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Compliant (PASS)</span>
          <span className="text-base font-bold text-emerald-400 tabular-nums font-mono">
            {totalPassed} Items
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Deficiencies (FAIL)</span>
          <span className="text-base font-bold text-rose-400 tabular-nums font-mono">
            {totalFailed} Items
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Not Applicable</span>
          <span className="text-base font-bold text-slate-400 tabular-nums font-mono">
            {totalNA} Items
          </span>
        </div>
      </div>

      {/* Category Segmented Selector */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-xl border border-slate-800 bg-[#090d16]">
        {categories.map(cat => {
          const isSelected = selectedCategory === cat;
          const catItems = items.filter(i => i.category === cat);
          const failCount = catItems.filter(i => i.status === 'FAIL').length;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span>{cat}</span>
              {failCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {failCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Checklist Items List for Active Category */}
      <div className="space-y-4">
        {filteredItems.map((item, idx) => {
          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all ${
                item.status === 'FAIL'
                  ? 'border-rose-900/50 bg-rose-950/10'
                  : item.status === 'PASS'
                  ? 'border-slate-800 bg-[#090d16]'
                  : 'border-slate-800/60 bg-slate-900/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                <div className="flex items-start gap-3">
                  <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-mono text-cyan-400 font-bold shrink-0">
                    {item.item_code}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 leading-snug">
                      {item.question}
                    </h3>
                  </div>
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
                  <button
                    onClick={() => handleStatusChange(item.id, 'PASS')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                      item.status === 'PASS'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>PASS</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange(item.id, 'FAIL')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                      item.status === 'FAIL'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    <span>FAIL</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange(item.id, 'NA')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                      item.status === 'NA'
                        ? 'bg-slate-700/50 text-slate-200 border border-slate-600'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>N/A</span>
                  </button>
                </div>
              </div>

              {/* Severity & Notes Form */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Severity Tier</label>
                  <select
                    value={item.severity}
                    onChange={e => handleSeverityChange(item.id, e.target.value as SeverityLevel)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="LOW">LOW (Informational)</option>
                    <option value="MEDIUM">MEDIUM (Needs Remediation)</option>
                    <option value="HIGH">HIGH (Urgent)</option>
                    <option value="CRITICAL">CRITICAL (Immediate Safety Risk)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1 font-medium">
                    Inspector Observation & Deficiency Notes
                  </label>
                  <input
                    type="text"
                    value={item.comments}
                    onChange={e => handleCommentsChange(item.id, e.target.value)}
                    placeholder="Enter on-site notes, location specifics, measurements..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => navigate(`/verification?itemCode=${item.item_code}&inspectionId=${inspectionId}`)}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-cyan-300 font-medium transition-colors"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    <span>Attach Evidence</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
