import {
  Institution,
  InspectionAssignment,
  ChecklistItemResponse,
  EvidenceRecord,
  Finding,
  CorrectiveAction,
  AuditEvent,
  UserProfile,
  DashboardMetrics,
} from '../types/index.ts';

const STORAGE_KEY_PREFIX = 'inspectra_data_v1_';

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'user-admin-01',
    email: 'admin@inspectra.gov.in',
    full_name: 'Dr. Rajeshwari Sharma',
    role: 'admin',
    department: 'Directorate of Quality & Standards',
    phone: '+91 98100 12345',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-insp-01',
    email: 'arun.kumar@inspectra.gov.in',
    full_name: 'Inspector Arun Kumar',
    role: 'inspector',
    department: 'Zonal Inspection Team North',
    phone: '+91 98200 23456',
    workload_count: 2,
    is_available: true,
  },
  {
    id: 'user-insp-02',
    email: 'priya.nair@inspectra.gov.in',
    full_name: 'Inspector Priya Nair',
    role: 'inspector',
    department: 'Zonal Inspection Team South',
    phone: '+91 98300 34567',
    workload_count: 1,
    is_available: true,
  },
  {
    id: 'user-insp-03',
    email: 'vikram.singh@inspectra.gov.in',
    full_name: 'Inspector Vikram Singh',
    role: 'inspector',
    department: 'Zonal Inspection Team West',
    phone: '+91 98400 45678',
    workload_count: 3,
    is_available: false, // Busy / high workload
  },
  {
    id: 'user-mgr-01',
    email: 'principal@apextech.edu.in',
    full_name: 'Prof. S. K. Mahajan',
    role: 'manager',
    institution_id: 'inst-01',
    department: 'Apex Institute of Technology Administration',
    phone: '+91 98500 56789',
  },
];

export const INITIAL_INSTITUTIONS: Institution[] = [
  {
    id: 'inst-01',
    name: 'Apex Institute of Technology & Research',
    code: 'INST-ND-8041',
    category: 'Technical Institute',
    district: 'New Delhi Central',
    state: 'Delhi',
    address: 'Plot 14, Institutional Area, Barakhamba Road, New Delhi',
    latitude: 28.6289,
    longitude: 77.2285,
    funding_category: 'Central Govt',
    contact_person: 'Prof. S. K. Mahajan',
    contact_email: 'principal@apextech.edu.in',
    contact_phone: '+91 11 2341 8900',
    student_capacity: 2400,
    last_inspection_date: '2026-09-12',
    overall_compliance_score: 82,
    created_at: '2026-01-15T09:00:00Z',
  },
  {
    id: 'inst-02',
    name: 'Government Model Senior Secondary Hostel',
    code: 'INST-BLR-3022',
    category: 'Hostel Facility',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    address: 'Koramangala 4th Block, 80 Feet Road, Bengaluru',
    latitude: 12.9352,
    longitude: 77.6245,
    funding_category: 'State Govt',
    contact_person: 'Rameshwar Gowda',
    contact_email: 'warden@blr-gmshostel.gov.in',
    contact_phone: '+91 80 2553 1122',
    student_capacity: 850,
    last_inspection_date: '2026-10-02',
    overall_compliance_score: 68,
    created_at: '2026-02-01T10:30:00Z',
  },
  {
    id: 'inst-03',
    name: 'National Vocational Training Institute',
    code: 'INST-MUM-4910',
    category: 'Vocational Center',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    address: 'V.N. Purav Marg, Chunabhatti, Sion, Mumbai',
    latitude: 19.0522,
    longitude: 72.8789,
    funding_category: 'Aided',
    contact_person: 'Dr. Ananya Deshmukh',
    contact_email: 'director@nvti-mumbai.edu.in',
    contact_phone: '+91 22 2405 9123',
    student_capacity: 1200,
    last_inspection_date: '2026-08-20',
    overall_compliance_score: 91,
    created_at: '2026-02-10T11:00:00Z',
  },
  {
    id: 'inst-04',
    name: 'Pragati Integrated Health & Nursing College',
    code: 'INST-PUN-5120',
    category: 'Healthcare Facility',
    district: 'Pune',
    state: 'Maharashtra',
    address: 'Survey No. 42, Shivajinagar, Pune',
    latitude: 18.5314,
    longitude: 73.8446,
    funding_category: 'CSR Funded',
    contact_person: 'Dr. Meera Joshi',
    contact_email: 'dean@pragatinursing.ac.in',
    contact_phone: '+91 20 2567 4300',
    student_capacity: 650,
    last_inspection_date: '2026-07-15',
    overall_compliance_score: 74,
    created_at: '2026-03-01T08:00:00Z',
  },
  {
    id: 'inst-05',
    name: 'Kasturba Central Residential Academy',
    code: 'INST-HYD-7104',
    category: 'Government School',
    district: 'Hyderabad',
    state: 'Telangana',
    address: 'Gachibowli Stadium Road, Hyderabad',
    latitude: 17.4401,
    longitude: 78.3489,
    funding_category: 'Autonomous',
    contact_person: 'K. Venkat Rao',
    contact_email: 'admin@kasturba-hyd.gov.in',
    contact_phone: '+91 40 2300 7890',
    student_capacity: 1800,
    last_inspection_date: '2026-09-28',
    overall_compliance_score: 61,
    created_at: '2026-03-15T09:30:00Z',
  },
];

export const INITIAL_ASSIGNMENTS: InspectionAssignment[] = [
  {
    id: 'asg-01',
    institution_id: 'inst-01',
    institution_name: 'Apex Institute of Technology & Research',
    district: 'New Delhi Central',
    inspector_id: 'user-insp-01',
    inspector_name: 'Inspector Arun Kumar',
    scheduled_date: '2026-10-30',
    deadline_date: '2026-11-05',
    status: 'in_progress',
    assignment_algorithm: 'weighted_random',
    conflict_checked: true,
    notes: 'Priority inspection of dormitory fire safety & water potability testing.',
    created_at: '2026-10-25T10:00:00Z',
  },
  {
    id: 'asg-02',
    institution_id: 'inst-02',
    institution_name: 'Government Model Senior Secondary Hostel',
    district: 'Bengaluru Urban',
    inspector_id: 'user-insp-02',
    inspector_name: 'Inspector Priya Nair',
    scheduled_date: '2026-11-02',
    deadline_date: '2026-11-08',
    status: 'scheduled',
    assignment_algorithm: 'weighted_random',
    conflict_checked: true,
    notes: 'Annual sanitation & structural compliance verification.',
    created_at: '2026-10-26T14:20:00Z',
  },
  {
    id: 'asg-03',
    institution_id: 'inst-03',
    institution_name: 'National Vocational Training Institute',
    district: 'Mumbai Suburban',
    inspector_id: 'user-insp-01',
    inspector_name: 'Inspector Arun Kumar',
    scheduled_date: '2026-10-15',
    deadline_date: '2026-10-22',
    status: 'completed',
    assignment_algorithm: 'geo_proximity',
    conflict_checked: true,
    notes: 'Machinery safety & workshop emergency exits cleared.',
    created_at: '2026-10-10T09:15:00Z',
  },
];

export const STANDARD_CHECKLIST_TEMPLATE = [
  {
    category: 'Food & Drinking Water' as const,
    item_code: 'FDW-01',
    question: 'Are RO/UV drinking water purifiers serviced with TDS logs maintained under 150 ppm?',
    defaultSeverity: 'CRITICAL' as const,
  },
  {
    category: 'Food & Drinking Water' as const,
    item_code: 'FDW-02',
    question: 'Is the kitchen and food storage area protected against pests with hygienic storage containers?',
    defaultSeverity: 'HIGH' as const,
  },
  {
    category: 'Toilets & Sanitation' as const,
    item_code: 'SAN-01',
    question: 'Are student washrooms clean, odor-free, with functional flush mechanisms and running water 24/7?',
    defaultSeverity: 'HIGH' as const,
  },
  {
    category: 'Toilets & Sanitation' as const,
    item_code: 'SAN-02',
    question: 'Are sanitary napkin vending machines and incinerators operable in female hostels/restrooms?',
    defaultSeverity: 'MEDIUM' as const,
  },
  {
    category: 'Accommodation & Living' as const,
    item_code: 'ACC-01',
    question: 'Is student dormitory occupancy strictly within prescribed capacity with adequate cross-ventilation?',
    defaultSeverity: 'MEDIUM' as const,
  },
  {
    category: 'Accommodation & Living' as const,
    item_code: 'ACC-02',
    question: 'Are electrical switches, sockets, and fan regulators insulated with no exposed wires in living quarters?',
    defaultSeverity: 'HIGH' as const,
  },
  {
    category: 'Safety & Accessibility' as const,
    item_code: 'SAF-01',
    question: 'Are fire extinguishers unexpired, inspected, and unobstructed along primary exit stairwells?',
    defaultSeverity: 'CRITICAL' as const,
  },
  {
    category: 'Safety & Accessibility' as const,
    item_code: 'SAF-02',
    question: 'Are wheelchair ramps with grab bars present at entrance gates and ground-floor academic blocks?',
    defaultSeverity: 'MEDIUM' as const,
  },
  {
    category: 'Maintenance & Facilities' as const,
    item_code: 'MNT-01',
    question: 'Are structural ceilings and walls free from major water seepage, cracks, or loose plaster?',
    defaultSeverity: 'HIGH' as const,
  },
  {
    category: 'Maintenance & Facilities' as const,
    item_code: 'MNT-02',
    question: 'Is emergency diesel generator / solar inverter operational with adequate fuel reserves?',
    defaultSeverity: 'MEDIUM' as const,
  },
];

export const INITIAL_FINDINGS: Finding[] = [
  {
    id: 'fnd-101',
    institution_id: 'inst-01',
    institution_name: 'Apex Institute of Technology & Research',
    inspection_id: 'asg-01',
    checklist_item_id: 'SAF-01',
    category: 'Safety & Accessibility',
    severity: 'CRITICAL',
    title: 'Block B 2nd Floor Fire Extinguisher Expired & Obstructed',
    description: 'During inspection, ABC Dry Powder extinguisher cylinder in Block B north corridor was overdue for hydrostatic pressure testing since March 2026 and obstructed by stacked wooden desks.',
    due_date: '2026-11-08',
    status: 'OPEN',
    created_at: '2026-10-25T11:30:00Z',
  },
  {
    id: 'fnd-102',
    institution_id: 'inst-02',
    institution_name: 'Government Model Senior Secondary Hostel',
    inspection_id: 'asg-02',
    checklist_item_id: 'FDW-01',
    category: 'Food & Drinking Water',
    severity: 'HIGH',
    title: 'Dining Hall Water Cooler TDS Exceeds 380 ppm',
    description: 'Water filtration membrane clogged. Water tested TDS 386 ppm, presenting bacterial and mineral contamination risk for hostel residents.',
    due_date: '2026-11-04',
    status: 'CORRECTION_SUBMITTED',
    created_at: '2026-10-20T14:15:00Z',
  },
  {
    id: 'fnd-103',
    institution_id: 'inst-05',
    institution_name: 'Kasturba Central Residential Academy',
    inspection_id: 'asg-prev-05',
    checklist_item_id: 'ACC-02',
    category: 'Accommodation & Living',
    severity: 'HIGH',
    title: 'Exposed Main Switchboard in Dormitory Wing C',
    description: 'Sub-panel distribution box cover missing with exposed 230V terminals accessible to students.',
    due_date: '2026-10-28',
    status: 'UNDER_REVIEW',
    created_at: '2026-10-18T16:00:00Z',
  },
];

export const INITIAL_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'adt-001',
    action: 'RANDOM_ASSIGNMENT_GENERATED',
    entity_type: 'ASSIGNMENT',
    entity_id: 'asg-01',
    actor_id: 'user-admin-01',
    actor_name: 'Dr. Rajeshwari Sharma',
    actor_role: 'admin',
    details: {
      institution: 'Apex Institute of Technology & Research',
      inspector: 'Inspector Arun Kumar',
      algorithm: 'weighted_random',
      workload_evaluated: 2,
      conflict_checked: true,
    },
    timestamp: '2026-10-25T10:00:00Z',
  },
  {
    id: 'adt-002',
    action: 'EVIDENCE_HASH_VERIFIED',
    entity_type: 'EVIDENCE',
    entity_id: 'evi-991',
    actor_id: 'user-insp-01',
    actor_name: 'Inspector Arun Kumar',
    actor_role: 'inspector',
    details: {
      sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      gps_match: true,
      distance_meters: 18,
      is_live_capture: true,
    },
    timestamp: '2026-10-25T11:28:00Z',
  },
];

class DataStore {
  private get<T>(key: string, fallback: T): T {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      if (stored) {
        return JSON.parse(stored) as T;
      }
    } catch {
      // LocalStorage access failure or JSON parse error fallback
    }
    return fallback;
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
    } catch {
      // In case quota is exceeded
    }
  }

  // --- Institutions ---
  getInstitutions(): Institution[] {
    return this.get<Institution[]>('institutions', INITIAL_INSTITUTIONS);
  }

  getInstitution(id: string): Institution | undefined {
    return this.getInstitutions().find(inst => inst.id === id);
  }

  addInstitution(data: Omit<Institution, 'id' | 'created_at'>): Institution {
    const list = this.getInstitutions();
    const newInst: Institution = {
      ...data,
      id: `inst-${Date.now().toString().slice(-6)}`,
      created_at: new Date().toISOString(),
    };
    list.unshift(newInst);
    this.set('institutions', list);

    this.addAuditEvent({
      action: 'INSTITUTION_REGISTERED',
      entity_type: 'INSPECTION',
      entity_id: newInst.id,
      actor_id: 'user-admin-01',
      actor_name: 'Dr. Rajeshwari Sharma',
      actor_role: 'admin',
      details: { name: newInst.name, district: newInst.district, code: newInst.code },
    });

    return newInst;
  }

  updateInstitution(id: string, updates: Partial<Institution>): Institution | undefined {
    const list = this.getInstitutions();
    const idx = list.findIndex(i => i.id === id);
    if (idx === -1) return undefined;
    list[idx] = { ...list[idx], ...updates };
    this.set('institutions', list);
    return list[idx];
  }

  // --- Assignments ---
  getAssignments(): InspectionAssignment[] {
    return this.get<InspectionAssignment[]>('assignments', INITIAL_ASSIGNMENTS);
  }

  getAssignment(id: string): InspectionAssignment | undefined {
    return this.getAssignments().find(a => a.id === id);
  }

  updateAssignment(id: string, updates: Partial<InspectionAssignment>): InspectionAssignment | undefined {
    const list = this.getAssignments();
    const idx = list.findIndex(a => a.id === id);
    if (idx === -1) return undefined;
    list[idx] = { ...list[idx], ...updates };
    this.set('assignments', list);
    return list[idx];
  }

  /**
   * Random Inspection Assignment Algorithm:
   * Selects eligible inspectors and institutions using configurable rules:
   * 1. Filters available inspectors (is_available === true)
   * 2. Balances workload (prefers lowest workload_count)
   * 3. Enforces conflict of interest: inspector cannot have inspected the same institution within 90 days
   * 4. Returns newly formed assignment and records audit event.
   */
  generateRandomAssignment(options?: {
    preferredInstitutionId?: string;
    targetDeadlineDays?: number;
  }): { success: boolean; assignment?: InspectionAssignment; message: string } {
    const institutions = this.getInstitutions();
    const assignments = this.getAssignments();
    const profiles = this.getProfiles().filter(p => p.role === 'inspector');

    if (institutions.length === 0) {
      return { success: false, message: 'No institutions registered in the database.' };
    }

    // 1. Pick target institution (or use preferred if supplied)
    let targetInst: Institution | undefined;
    if (options?.preferredInstitutionId) {
      targetInst = institutions.find(i => i.id === options.preferredInstitutionId);
    } else {
      // Find institutions that have no pending/in_progress assignment
      const activeInstIds = new Set(
        assignments.filter(a => a.status === 'in_progress' || a.status === 'scheduled').map(a => a.institution_id)
      );
      const candidates = institutions.filter(i => !activeInstIds.has(i.id));
      const pool = candidates.length > 0 ? candidates : institutions;
      // Weighted selection based on oldest last_inspection_date or lowest compliance score
      pool.sort((a, b) => (a.overall_compliance_score || 100) - (b.overall_compliance_score || 100));
      targetInst = pool[0];
    }

    if (!targetInst) {
      return { success: false, message: 'Could not select an eligible target institution.' };
    }

    // 2. Filter available inspectors with conflict-of-interest check
    const eligibleInspectors = profiles.filter(inspector => {
      if (inspector.is_available === false) return false;

      // Check conflict of interest: inspector cannot have completed an inspection on this institution in last 90 days
      const hasRecentAssignment = assignments.some(
        a => a.institution_id === targetInst!.id && a.inspector_id === inspector.id && a.status === 'completed'
      );
      return !hasRecentAssignment;
    });

    if (eligibleInspectors.length === 0) {
      return {
        success: false,
        message: 'No eligible inspectors available. All inspectors have reached workload limits or have conflict-of-interest restrictions.',
      };
    }

    // 3. Balance workload: Pick inspector with lowest current workload, with random tiebreaker
    eligibleInspectors.sort((a, b) => (a.workload_count || 0) - (b.workload_count || 0));
    const lowestWorkload = eligibleInspectors[0].workload_count || 0;
    const lowestTierInspectors = eligibleInspectors.filter(i => (i.workload_count || 0) === lowestWorkload);
    const chosenInspector = lowestTierInspectors[Math.floor(Math.random() * lowestTierInspectors.length)];

    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + 2);

    const deadlineDays = options?.targetDeadlineDays || 7;
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + deadlineDays);

    const newAssignment: InspectionAssignment = {
      id: `asg-${Date.now().toString().slice(-6)}`,
      institution_id: targetInst.id,
      institution_name: targetInst.name,
      district: targetInst.district,
      inspector_id: chosenInspector.id,
      inspector_name: chosenInspector.full_name,
      scheduled_date: scheduledDate.toISOString().split('T')[0],
      deadline_date: deadlineDate.toISOString().split('T')[0],
      status: 'scheduled',
      assignment_algorithm: 'weighted_random',
      conflict_checked: true,
      notes: `Automated random assignment for ${targetInst.category} monitoring. Conflict-of-interest check passed.`,
      created_at: new Date().toISOString(),
    };

    assignments.unshift(newAssignment);
    this.set('assignments', assignments);

    // Update inspector workload
    this.updateProfileWorkload(chosenInspector.id, (chosenInspector.workload_count || 0) + 1);

    // Record immutable audit event
    this.addAuditEvent({
      action: 'RANDOM_ASSIGNMENT_GENERATED',
      entity_type: 'ASSIGNMENT',
      entity_id: newAssignment.id,
      actor_id: 'user-admin-01',
      actor_name: 'Dr. Rajeshwari Sharma',
      actor_role: 'admin',
      details: {
        institution_id: targetInst.id,
        institution_name: targetInst.name,
        inspector_id: chosenInspector.id,
        inspector_name: chosenInspector.full_name,
        algorithm: 'weighted_random',
        previous_workload: chosenInspector.workload_count || 0,
        conflict_checked: true,
      },
    });

    return {
      success: true,
      assignment: newAssignment,
      message: `Successfully generated assignment for ${targetInst.name} assigned to ${chosenInspector.full_name}.`,
    };
  }

  // --- Profiles ---
  getProfiles(): UserProfile[] {
    return this.get<UserProfile[]>('profiles', INITIAL_PROFILES);
  }

  getProfile(id: string): UserProfile | undefined {
    return this.getProfiles().find(p => p.id === id);
  }

  updateProfileWorkload(id: string, count: number): void {
    const profiles = this.getProfiles();
    const idx = profiles.findIndex(p => p.id === id);
    if (idx !== -1) {
      profiles[idx].workload_count = count;
      this.set('profiles', profiles);
    }
  }

  // --- Checklist Responses ---
  getChecklistResponses(inspectionId: string): ChecklistItemResponse[] {
    const all = this.get<Record<string, ChecklistItemResponse[]>>('checklists', {});
    if (all[inspectionId]) return all[inspectionId];

    // Seed default template for this inspection if first time
    const initialItems: ChecklistItemResponse[] = STANDARD_CHECKLIST_TEMPLATE.map((tpl, i) => ({
      id: `chk-${inspectionId}-${i + 1}`,
      inspection_id: inspectionId,
      category: tpl.category,
      item_code: tpl.item_code,
      question: tpl.question,
      status: 'PASS',
      severity: tpl.defaultSeverity,
      comments: 'Complies with standard guidelines.',
      evidence_ids: [],
      updated_at: new Date().toISOString(),
    }));

    all[inspectionId] = initialItems;
    this.set('checklists', all);
    return initialItems;
  }

  saveChecklistResponses(inspectionId: string, responses: ChecklistItemResponse[]): void {
    const all = this.get<Record<string, ChecklistItemResponse[]>>('checklists', {});
    all[inspectionId] = responses;
    this.set('checklists', all);
  }

  // --- Evidence Records ---
  getEvidenceRecords(inspectionId?: string): EvidenceRecord[] {
    const all = this.get<EvidenceRecord[]>('evidence', [
      {
        id: 'evi-991',
        inspection_id: 'asg-01',
        checklist_item_id: 'SAF-01',
        file_url: 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?w=600&auto=format&fit=crop&q=80',
        file_name: 'fire_extinguisher_corridor_north.jpg',
        file_size_bytes: 1420500,
        sha256_hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        hash_verified_server: true,
        latitude: 28.6291,
        longitude: 77.2287,
        gps_accuracy_meters: 4.8,
        captured_at: '2026-10-25T11:28:00Z',
        is_live_capture: true,
        device_info: 'Chrome on Android / SM-G998B',
        created_at: '2026-10-25T11:28:15Z',
      },
    ]);
    if (inspectionId) {
      return all.filter(e => e.inspection_id === inspectionId);
    }
    return all;
  }

  addEvidenceRecord(evidence: EvidenceRecord): void {
    const all = this.getEvidenceRecords();
    all.unshift(evidence);
    this.set('evidence', all);

    this.addAuditEvent({
      action: 'EVIDENCE_RECORD_COMMITTED',
      entity_type: 'EVIDENCE',
      entity_id: evidence.id,
      actor_id: 'inspector-active',
      actor_name: 'Inspector',
      actor_role: 'inspector',
      details: {
        hash: evidence.sha256_hash,
        is_live_capture: evidence.is_live_capture,
        has_gps: evidence.latitude !== null,
        gps_accuracy: evidence.gps_accuracy_meters,
      },
    });
  }

  // --- Findings ---
  getFindings(institutionId?: string): Finding[] {
    const all = this.get<Finding[]>('findings', INITIAL_FINDINGS);
    if (institutionId) {
      return all.filter(f => f.institution_id === institutionId);
    }
    return all;
  }

  getFinding(id: string): Finding | undefined {
    return this.getFindings().find(f => f.id === id);
  }

  addFinding(finding: Omit<Finding, 'id' | 'created_at'>): Finding {
    const all = this.getFindings();
    const newFinding: Finding = {
      ...finding,
      id: `fnd-${Date.now().toString().slice(-6)}`,
      created_at: new Date().toISOString(),
    };
    all.unshift(newFinding);
    this.set('findings', all);

    this.addAuditEvent({
      action: 'CRITICAL_FINDING_RECORDED',
      entity_type: 'FINDING',
      entity_id: newFinding.id,
      actor_id: 'user-insp-01',
      actor_name: 'Inspector',
      actor_role: 'inspector',
      details: {
        title: newFinding.title,
        severity: newFinding.severity,
        institution_id: newFinding.institution_id,
      },
    });

    return newFinding;
  }

  updateFindingStatus(id: string, status: Finding['status']): void {
    const all = this.getFindings();
    const idx = all.findIndex(f => f.id === id);
    if (idx !== -1) {
      all[idx].status = status;
      this.set('findings', all);
    }
  }

  // --- Corrective Actions ---
  getCorrectiveActions(findingId?: string): CorrectiveAction[] {
    const all = this.get<CorrectiveAction[]>('corrective_actions', [
      {
        id: 'ca-01',
        finding_id: 'fnd-102',
        institution_id: 'inst-02',
        submitted_by_id: 'user-mgr-01',
        action_summary: 'Replaced RO Filter Membranes and Cleaned Water Storage Reservoir',
        detailed_notes: 'Procured certified commercial Kent RO membrane kit. Serviced on Oct 22, 2026. TDS meter reading verified at 78 ppm.',
        evidence_urls: [
          'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80',
        ],
        evidence_hashes: ['e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'],
        submitted_at: '2026-10-23T15:00:00Z',
        status: 'PENDING_APPROVAL',
      },
    ]);
    if (findingId) {
      return all.filter(ca => ca.finding_id === findingId);
    }
    return all;
  }

  submitCorrectiveAction(data: Omit<CorrectiveAction, 'id' | 'submitted_at' | 'status'>): CorrectiveAction {
    const all = this.getCorrectiveActions();
    const newAction: CorrectiveAction = {
      ...data,
      id: `ca-${Date.now().toString().slice(-6)}`,
      submitted_at: new Date().toISOString(),
      status: 'PENDING_APPROVAL',
    };
    all.unshift(newAction);
    this.set('corrective_actions', all);

    this.updateFindingStatus(data.finding_id, 'CORRECTION_SUBMITTED');

    this.addAuditEvent({
      action: 'CORRECTIVE_ACTION_SUBMITTED',
      entity_type: 'CORRECTIVE_ACTION',
      entity_id: newAction.id,
      actor_id: data.submitted_by_id,
      actor_name: 'Institution Manager',
      actor_role: 'manager',
      details: {
        finding_id: data.finding_id,
        summary: data.action_summary,
      },
    });

    return newAction;
  }

  reviewCorrectiveAction(
    actionId: string,
    decision: 'APPROVED' | 'REJECTED' | 'REINSPECTION_SCHEDULED',
    feedback: string,
    reviewerId: string
  ): void {
    const all = this.getCorrectiveActions();
    const idx = all.findIndex(ca => ca.id === actionId);
    if (idx !== -1) {
      all[idx].status = decision;
      all[idx].reviewer_feedback = feedback;
      all[idx].reviewer_id = reviewerId;
      all[idx].reviewed_at = new Date().toISOString();
      this.set('corrective_actions', all);

      const targetStatus: Finding['status'] =
        decision === 'APPROVED'
          ? 'CLOSED'
          : decision === 'REINSPECTION_SCHEDULED'
          ? 'REINSPECTION_REQUIRED'
          : 'OPEN';

      this.updateFindingStatus(all[idx].finding_id, targetStatus);

      this.addAuditEvent({
        action: `CORRECTIVE_ACTION_${decision}`,
        entity_type: 'CORRECTIVE_ACTION',
        entity_id: actionId,
        actor_id: reviewerId,
        actor_name: 'Dr. Rajeshwari Sharma',
        actor_role: 'admin',
        details: { decision, feedback },
      });
    }
  }

  // --- Audit Events ---
  getAuditEvents(): AuditEvent[] {
    return this.get<AuditEvent[]>('audit_events', INITIAL_AUDIT_EVENTS);
  }

  addAuditEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): void {
    const all = this.getAuditEvents();
    const newEvent: AuditEvent = {
      ...event,
      id: `adt-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
    };
    all.unshift(newEvent);
    // Keep last 100 events
    this.set('audit_events', all.slice(0, 100));
  }

  // --- Documents Management ---
  getDocuments(institutionId?: string): import('../types/index.ts').InstitutionDocument[] {
    const defaultDocs: import('../types/index.ts').InstitutionDocument[] = [
      {
        id: 'doc-01',
        institution_id: 'inst-01',
        document_type: 'Fire Safety Certificate',
        file_name: 'Fire_NOC_DelhiFireService_2025.pdf',
        file_url: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&auto=format&fit=crop&q=80',
        file_size_bytes: 2450000,
        uploaded_at: '2026-01-10T10:00:00Z',
        expiry_date: '2026-12-31',
        status: 'VALID',
        notes: 'Annual Delhi Fire Service renewal clearance certificate.',
      },
      {
        id: 'doc-02',
        institution_id: 'inst-01',
        document_type: 'Water Potability Report',
        file_name: 'Jal_Board_Potability_Report_Q3.pdf',
        file_url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80',
        file_size_bytes: 1820000,
        uploaded_at: '2026-07-15T14:30:00Z',
        expiry_date: '2026-11-15',
        status: 'VALID',
        notes: 'Bacteriological and chemical potable water lab analysis.',
      },
      {
        id: 'doc-03',
        institution_id: 'inst-01',
        document_type: 'Building Safety NOC',
        file_name: 'CPWD_Structural_Integrity_Certificate.pdf',
        file_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
        file_size_bytes: 3100000,
        uploaded_at: '2025-04-12T09:00:00Z',
        expiry_date: '2027-04-12',
        status: 'VALID',
        notes: 'Structural engineering seismic and load-bearing audit.',
      },
      {
        id: 'doc-04',
        institution_id: 'inst-01',
        document_type: 'Food Safety / FSSAI License',
        file_name: 'FSSAI_Mess_Canteen_Registration.pdf',
        file_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
        file_size_bytes: 1450000,
        uploaded_at: '2025-10-18T11:00:00Z',
        expiry_date: '2026-10-31',
        status: 'PENDING_VERIFICATION',
        notes: 'Renewal under evaluation by state food commissioner.',
      },
    ];

    const all = this.get<import('../types/index.ts').InstitutionDocument[]>('documents', defaultDocs);
    if (institutionId) {
      return all.filter(d => d.institution_id === institutionId);
    }
    return all;
  }

  addDocument(doc: Omit<import('../types/index.ts').InstitutionDocument, 'id' | 'uploaded_at'>): import('../types/index.ts').InstitutionDocument {
    const all = this.getDocuments();
    const newDoc: import('../types/index.ts').InstitutionDocument = {
      ...doc,
      id: `doc-${Date.now().toString().slice(-6)}`,
      uploaded_at: new Date().toISOString(),
    };
    all.unshift(newDoc);
    this.set('documents', all);

    this.addAuditEvent({
      action: 'STATUTORY_DOCUMENT_UPLOADED',
      entity_type: 'INSPECTION',
      entity_id: newDoc.id,
      actor_id: 'manager-active',
      actor_name: 'Institution Manager',
      actor_role: 'manager',
      details: {
        document_type: newDoc.document_type,
        file_name: newDoc.file_name,
        institution_id: newDoc.institution_id,
      },
    });

    return newDoc;
  }

  deleteDocument(id: string): void {
    const all = this.getDocuments();
    const filtered = all.filter(d => d.id !== id);
    this.set('documents', filtered);
  }

  // --- Notifications Management ---
  getNotifications(role?: import('../types/index.ts').UserRole, institutionId?: string): import('../types/index.ts').NotificationItem[] {
    const defaultNotifs: import('../types/index.ts').NotificationItem[] = [
      {
        id: 'notif-01',
        recipient_role: 'manager',
        institution_id: 'inst-01',
        title: 'Inspection Schedule Notice',
        message: 'Directorate has scheduled an unannounced inspection window between Oct 30 and Nov 05, 2026.',
        type: 'inspection_scheduled',
        read: false,
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        action_link: '/manager',
      },
      {
        id: 'notif-02',
        recipient_role: 'manager',
        institution_id: 'inst-01',
        title: 'Remediation Action Required',
        message: 'Critical finding recorded in Block B corridor: Fire extinguisher inspection overdue.',
        type: 'action_required',
        read: false,
        created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
        action_link: '/findings',
      },
      {
        id: 'notif-03',
        recipient_role: 'inspector',
        title: 'Assigned Inspection Duty',
        message: 'You have been randomized for on-site inspection at Apex Institute of Technology & Research (INST-ND-8041).',
        type: 'inspection_scheduled',
        read: false,
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        action_link: '/inspector',
      },
      {
        id: 'notif-04',
        recipient_role: 'inspector',
        title: 'SHA-256 Hash Confirmed',
        message: 'Photo evidence EVI-991 cryptographically sealed and anchored to institution geofence.',
        type: 'report_generated',
        read: true,
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
        action_link: '/verification',
      },
    ];

    const all = this.get<import('../types/index.ts').NotificationItem[]>('notifications', defaultNotifs);
    return all.filter(n => {
      if (role && n.recipient_role !== role) return false;
      if (institutionId && n.institution_id && n.institution_id !== institutionId) return false;
      return true;
    });
  }

  markNotificationRead(id: string): void {
    const all = this.get<import('../types/index.ts').NotificationItem[]>('notifications', []);
    const idx = all.findIndex(n => n.id === id);
    if (idx !== -1) {
      all[idx].read = true;
      this.set('notifications', all);
    }
  }

  updateProfile(id: string, updates: Partial<UserProfile>): UserProfile | undefined {
    const profiles = this.getProfiles();
    const idx = profiles.findIndex(p => p.id === id);
    if (idx === -1) return undefined;
    profiles[idx] = { ...profiles[idx], ...updates };
    this.set('profiles', profiles);
    return profiles[idx];
  }

  // --- Aggregated Metrics ---
  getDashboardMetrics(): DashboardMetrics {
    const institutions = this.getInstitutions();
    const assignments = this.getAssignments();
    const findings = this.getFindings();

    const completed = assignments.filter(a => a.status === 'completed').length;
    const pending = assignments.filter(a => a.status === 'scheduled' || a.status === 'in_progress').length;
    const openFindings = findings.filter(f => f.status !== 'CLOSED').length;
    const criticalFindings = findings.filter(f => f.severity === 'CRITICAL' && f.status !== 'CLOSED').length;
    const overdueActions = findings.filter(f => {
      if (f.status === 'CLOSED') return false;
      const due = new Date(f.due_date).getTime();
      return due < Date.now();
    }).length;

    const avgScore = institutions.length
      ? Math.round(institutions.reduce((sum, i) => sum + (i.overall_compliance_score || 75), 0) / institutions.length)
      : 80;

    return {
      total_institutions: institutions.length,
      completed_inspections: completed,
      pending_inspections: pending,
      open_findings: openFindings,
      critical_findings: criticalFindings,
      overdue_actions: overdueActions,
      compliance_rate_percent: avgScore,
      monthly_inspections: [
        { month: 'Jun', completed: 18, target: 20 },
        { month: 'Jul', completed: 24, target: 25 },
        { month: 'Aug', completed: 21, target: 25 },
        { month: 'Sep', completed: 30, target: 30 },
        { month: 'Oct', completed: 28, target: 35 },
      ],
      category_compliance: [
        { category: 'Food & Drinking Water', passRate: 78, failCount: 4 },
        { category: 'Toilets & Sanitation', passRate: 84, failCount: 3 },
        { category: 'Accommodation', passRate: 72, failCount: 6 },
        { category: 'Safety & Accessibility', passRate: 65, failCount: 9 },
        { category: 'Maintenance', passRate: 89, failCount: 2 },
      ],
    };
  }

  resetToDefaultDemoData(): void {
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'institutions');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'assignments');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'profiles');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'checklists');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'evidence');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'findings');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'corrective_actions');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'audit_events');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'documents');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'notifications');
  }
}

export const dbStore = new DataStore();

