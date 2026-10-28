export type UserRole = 'admin' | 'inspector' | 'manager';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  institution_id?: string; // If manager, linked institution
  department?: string;
  workload_count?: number;
  is_available?: boolean;
}

export type InstitutionCategory =
  | 'Higher Education'
  | 'Technical Institute'
  | 'Government School'
  | 'Vocational Center'
  | 'Hostel Facility'
  | 'Healthcare Facility';

export type FundingCategory = 'Central Govt' | 'State Govt' | 'Aided' | 'Autonomous' | 'CSR Funded';

export interface Institution {
  id: string;
  name: string;
  code: string;
  category: InstitutionCategory;
  district: string;
  state: string;
  address: string;
  latitude: number;
  longitude: number;
  funding_category: FundingCategory;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  student_capacity: number;
  last_inspection_date?: string;
  overall_compliance_score?: number; // 0-100
  created_at: string;
}

export type AssignmentStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';

export interface InspectionAssignment {
  id: string;
  institution_id: string;
  institution_name?: string;
  district?: string;
  inspector_id: string;
  inspector_name?: string;
  scheduled_date: string;
  deadline_date: string;
  status: AssignmentStatus;
  assignment_algorithm: 'weighted_random' | 'manual_override' | 'geo_proximity';
  conflict_checked: boolean;
  notes?: string;
  created_at: string;
}

export type ChecklistCategory =
  | 'Food & Drinking Water'
  | 'Toilets & Sanitation'
  | 'Accommodation & Living'
  | 'Safety & Accessibility'
  | 'Maintenance & Facilities';

export type ChecklistItemStatus = 'PASS' | 'FAIL' | 'NA';
export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ChecklistItemResponse {
  id: string;
  inspection_id: string;
  category: ChecklistCategory;
  item_code: string;
  question: string;
  status: ChecklistItemStatus;
  severity: SeverityLevel;
  comments: string;
  evidence_ids: string[];
  updated_at: string;
}

export interface EvidenceRecord {
  id: string;
  inspection_id: string;
  checklist_item_id?: string;
  file_url: string;
  file_name: string;
  file_size_bytes: number;
  sha256_hash: string;
  hash_verified_server: boolean;
  latitude: number | null;
  longitude: number | null;
  gps_accuracy_meters: number | null;
  captured_at: string;
  is_live_capture: boolean; // True if from Camera API, false if from file picker
  device_info?: string;
  tamper_flags?: string[];
  created_at: string;
}

export type FindingStatus = 'OPEN' | 'CORRECTION_SUBMITTED' | 'UNDER_REVIEW' | 'REINSPECTION_REQUIRED' | 'CLOSED';

export interface Finding {
  id: string;
  institution_id: string;
  institution_name: string;
  inspection_id: string;
  checklist_item_id: string;
  category: ChecklistCategory;
  severity: SeverityLevel;
  title: string;
  description: string;
  due_date: string;
  status: FindingStatus;
  created_at: string;
  corrective_action_id?: string;
}

export interface CorrectiveAction {
  id: string;
  finding_id: string;
  institution_id: string;
  submitted_by_id: string;
  action_summary: string;
  detailed_notes: string;
  evidence_urls: string[];
  evidence_hashes?: string[];
  submitted_at: string;
  reviewer_feedback?: string;
  reviewer_id?: string;
  reviewed_at?: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'REINSPECTION_SCHEDULED';
}

export interface AuditEvent {
  id: string;
  action: string;
  entity_type: 'ASSIGNMENT' | 'INSPECTION' | 'EVIDENCE' | 'FINDING' | 'CORRECTIVE_ACTION' | 'SECURITY';
  entity_id: string;
  actor_id: string;
  actor_name: string;
  actor_role: UserRole;
  details: Record<string, unknown>;
  ip_address?: string;
  timestamp: string;
}

export interface InstitutionDocument {
  id: string;
  institution_id: string;
  document_type:
    | 'Fire Safety Certificate'
    | 'Water Potability Report'
    | 'Building Safety NOC'
    | 'Food Safety / FSSAI License'
    | 'Sanitation Certificate'
    | 'Electrical Safety Audit';
  file_name: string;
  file_url: string;
  file_size_bytes: number;
  uploaded_at: string;
  expiry_date: string;
  status: 'VALID' | 'PENDING_VERIFICATION' | 'EXPIRED';
  notes?: string;
}

export interface NotificationItem {
  id: string;
  recipient_role: UserRole;
  recipient_id?: string;
  institution_id?: string;
  title: string;
  message: string;
  type: 'inspection_scheduled' | 'action_required' | 'action_reviewed' | 'deadline_warning' | 'report_generated';
  read: boolean;
  created_at: string;
  action_link?: string;
}

export interface DashboardMetrics {
  total_institutions: number;
  completed_inspections: number;
  pending_inspections: number;
  open_findings: number;
  critical_findings: number;
  overdue_actions: number;
  compliance_rate_percent: number;
  monthly_inspections: { month: string; completed: number; target: number }[];
  category_compliance: { category: string; passRate: number; failCount: number }[];
}

