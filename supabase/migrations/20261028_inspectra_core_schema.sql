-- =========================================================================
-- Inspectra AI - SIH26095 PostgreSQL Core Schema & Row Level Security (RLS)
-- Target Platform: Supabase PostgreSQL
-- =========================================================================

-- Enable required UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'inspector', 'manager')),
    phone TEXT,
    avatar_url TEXT,
    institution_id UUID,
    department TEXT,
    workload_count INT DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. INSTITUTIONS TABLE
CREATE TABLE IF NOT EXISTS public.institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'Higher Education', 'Technical Institute', 'Government School', 
        'Vocational Center', 'Hostel Facility', 'Healthcare Facility'
    )),
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    funding_category TEXT NOT NULL CHECK (funding_category IN (
        'Central Govt', 'State Govt', 'Aided', 'Autonomous', 'CSR Funded'
    )),
    contact_person TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    student_capacity INT NOT NULL DEFAULT 100,
    last_inspection_date DATE,
    overall_compliance_score INT CHECK (overall_compliance_score BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Foreign key link for manager profile to institution
ALTER TABLE public.profiles 
    DROP CONSTRAINT IF EXISTS fk_profiles_institution;
ALTER TABLE public.profiles 
    ADD CONSTRAINT fk_profiles_institution 
    FOREIGN KEY (institution_id) REFERENCES public.institutions(id) ON DELETE SET NULL;

-- 3. INSPECTION ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS public.inspection_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE RESTRICT,
    inspector_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    scheduled_date DATE NOT NULL,
    deadline_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN (
        'scheduled', 'in_progress', 'completed', 'cancelled', 'overdue'
    )),
    assignment_algorithm TEXT NOT NULL DEFAULT 'weighted_random',
    conflict_checked BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INSPECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES public.inspection_assignments(id) ON DELETE CASCADE,
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE RESTRICT,
    inspector_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'verified', 'flagged')),
    inspector_notes TEXT,
    overall_score INT CHECK (overall_score BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CHECKLIST RESPONSES TABLE
CREATE TABLE IF NOT EXISTS public.checklist_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inspection_id UUID NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN (
        'Food & Drinking Water', 'Toilets & Sanitation', 'Accommodation & Living', 
        'Safety & Accessibility', 'Maintenance & Facilities'
    )),
    item_code TEXT NOT NULL,
    question TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PASS', 'FAIL', 'NA')),
    severity TEXT NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    comments TEXT DEFAULT '',
    evidence_ids TEXT[] DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. EVIDENCE RECORDS TABLE (With Web Crypto SHA-256 and Geofence Audit)
CREATE TABLE IF NOT EXISTS public.evidence_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inspection_id UUID NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
    checklist_item_id TEXT,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    sha256_hash CHAR(64) NOT NULL,
    hash_verified_server BOOLEAN DEFAULT true,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    gps_accuracy_meters DOUBLE PRECISION,
    captured_at TIMESTAMPTZ NOT NULL,
    is_live_capture BOOLEAN NOT NULL DEFAULT false,
    device_info TEXT,
    tamper_flags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. FINDINGS TABLE (Automated from failed checklist items)
CREATE TABLE IF NOT EXISTS public.findings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    inspection_id UUID NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
    checklist_item_id TEXT NOT NULL,
    category TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN (
        'OPEN', 'CORRECTION_SUBMITTED', 'UNDER_REVIEW', 'REINSPECTION_REQUIRED', 'CLOSED'
    )),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CORRECTIVE ACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.corrective_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    finding_id UUID NOT NULL REFERENCES public.findings(id) ON DELETE CASCADE,
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    submitted_by_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    action_summary TEXT NOT NULL,
    detailed_notes TEXT NOT NULL,
    evidence_urls TEXT[] DEFAULT '{}',
    evidence_hashes TEXT[] DEFAULT '{}',
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewer_feedback TEXT,
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'PENDING_APPROVAL' CHECK (status IN (
        'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'REINSPECTION_SCHEDULED'
    ))
);

-- 9. AUDIT EVENTS TABLE (Append-Only Immutable Log)
CREATE TABLE IF NOT EXISTS public.audit_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL CHECK (entity_type IN (
        'ASSIGNMENT', 'INSPECTION', 'EVIDENCE', 'FINDING', 'CORRECTIVE_ACTION', 'SECURITY'
    )),
    entity_id TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    actor_name TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address INET,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- INDEXES FOR PERFORMANCE
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_institutions_district ON public.institutions(district);
CREATE INDEX IF NOT EXISTS idx_assignments_inspector ON public.inspection_assignments(inspector_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON public.inspection_assignments(status);
CREATE INDEX IF NOT EXISTS idx_inspections_assignment ON public.inspections(assignment_id);
CREATE INDEX IF NOT EXISTS idx_checklist_inspection ON public.checklist_responses(inspection_id);
CREATE INDEX IF NOT EXISTS idx_evidence_sha256 ON public.evidence_records(sha256_hash);
CREATE INDEX IF NOT EXISTS idx_findings_institution ON public.findings(institution_id);
CREATE INDEX IF NOT EXISTS idx_findings_status ON public.findings(status);
CREATE INDEX IF NOT EXISTS idx_audit_events_entity ON public.audit_events(entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_timestamp ON public.audit_events(timestamp DESC);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corrective_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- Helper function to fetch current user's role
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Profiles: Users can read all profiles in directory; only update own
CREATE POLICY "Profiles readable by authenticated users"
  ON public.profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Institutions: All authenticated can view institutions; only Admin can insert/update
CREATE POLICY "Institutions viewable by authenticated users"
  ON public.institutions FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin can modify institutions"
  ON public.institutions FOR ALL
  USING (public.current_user_role() = 'admin');

-- Assignments: Admin can manage all; Inspectors can view their own assignments
CREATE POLICY "Admin has full access to assignments"
  ON public.inspection_assignments FOR ALL
  USING (public.current_user_role() = 'admin');

CREATE POLICY "Inspectors can view assigned duties"
  ON public.inspection_assignments FOR SELECT
  USING (inspector_id = auth.uid() OR public.current_user_role() = 'admin');

-- Findings: Managers can view only findings for their institution; Admin/Inspector full view
CREATE POLICY "Findings viewable by authorized roles"
  ON public.findings FOR SELECT
  USING (
    public.current_user_role() IN ('admin', 'inspector') OR
    institution_id IN (SELECT institution_id FROM public.profiles WHERE id = auth.uid())
  );

-- Audit Events: Immutable, insert only, viewable by Admin
CREATE POLICY "Audit events readable by admin"
  ON public.audit_events FOR SELECT
  USING (public.current_user_role() = 'admin');

CREATE POLICY "Authenticated users can insert audit events"
  ON public.audit_events FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
