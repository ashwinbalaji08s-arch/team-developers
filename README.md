# Inspectra AI — Smart Real-Time Monitoring & Inspection Platform
**Smart India Hackathon Project Reference: SIH26095**

Inspectra AI is an enterprise-grade, transparent inspection and compliance verification platform engineered for public schools, technical institutes, hostels, and government facilities. It resolves inspection collusions, stale gallery uploads, and unenforced audit findings through client-side SHA-256 cryptographic hashing, hardware camera bindings, GPS geofencing, and conflict-free algorithmic random duty allocation.

---

## 🛠 Tech Stack
- **Frontend Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 with dark navy (`#0b1120`), cyan, and teal color palette
- **Icons**: Lucide React
- **Geographic Visualizations**: Leaflet with OpenStreetMap
- **Data Analytics**: Recharts
- **Cryptographic Security**: Web Crypto API (`crypto.subtle.digest`) for client-side SHA-256 evidence hashing
- **Form Validation**: Zod schema validation
- **Backend & Database Target**: Supabase (PostgreSQL with Row Level Security, Auth, and Storage)
- **Local Fallback Engine**: In-browser indexed state store for deterministic offline demo & evaluation

---

## 🔑 Dedicated Authentication Gateways
- **Unified Login Gate (`/login`)**: Direct portal to select role or trigger 1-click test credentials.
- **Institution Manager Login (`/login/institution`)**: Dedicated login for Principals, Wardens, and Facility Administrators.
- **Inspector Duty Portal (`/login/inspector`)**: Dedicated login for Zonal Field Inspection Officers with badge ID verification.
- **Directorate Admin Portal (`/login/admin`)**: Central Directorate of Quality & Standards administrative login.

---

## 🔑 Key Modules & Architecture

### 1. Landing Page (`/`)
- Overview of the inspection problem and proposed solution.
- Architecture workflow: Random Allocation → Field Capture & Hash → Automated Findings → Verified Remediation.
- Quick persona launchers for Admin, Inspector, and Institution Manager.

### 2. Admin Command Center
- Real-time KPI metrics aggregated from database records: Total institutions, completed/pending inspections, open/critical findings, and overdue actions.
- Geographic Inspection Grid: Leaflet map with status-coded pins and compliance tooltips.
- One-click trigger for the **Random Duty Assignment Engine**.
- Exportable CSV reports.

### 3. Institution Management
- Register and manage facilities with categories (Higher Education, Technical, School, Hostel, Healthcare), district, coordinates (lat/long), and funding type.
- Form validation using Zod.
- Full inspection history and open violation tracking per facility.

### 4. Random Duty Assignment Engine
- Algorithmic, conflict-of-interest-checked assignment generator.
- Workload balancing across the active inspector pool.
- 90-day cooldown enforcement preventing repeat assignments to the same facility.
- Automatic creation of immutable audit events for every dispatch.

### 5. Inspector Field Hub & Digital Checklist
- View assigned inspection duties and deadlines.
- Five standardized facility audit domains:
  1. Food and Drinking Water
  2. Toilets and Sanitation
  3. Accommodation and Living
  4. Safety and Accessibility
  5. Maintenance and Facilities
- Support for `PASS`, `FAIL`, and `N/A`, severity classification (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), and required deficiency comments.
- **Automated Finding Creation**: Submitting an inspection with failed checklist items immediately generates tracked findings in the database.

### 6. Evidence Verification Centre & Photo Integrity
- Direct browser camera integration (`navigator.mediaDevices.getUserMedia`).
- Geolocation telemetry capture with accuracy radius (`±X meters`).
- **Cryptographic SHA-256 Hashing**: Instant client-side computation before data transfer.
- Distinguishes **Verified Live Camera Streams** from unverified gallery file uploads to prevent spoofing.
- Geofence calculation checking if capture location is within tolerance of the institution's registered coordinates.

### 7. Findings, Corrective Actions & Manager Portal
- Institution managers review violations specifically affecting their facility.
- Managers submit photographic remediation proof and detailed notes.
- Authorized reviewers (Admin / Inspector) review, approve, reject, or request re-inspection.

### 8. Remote Video Inspection Channel
- Two-way peer inspection stream interface.
- Includes clear disclosure labeling external peer-to-peer relay infrastructure as simulated for the demo sandbox.

### 9. Statutory Audit & Reports
- Chronological, tamper-evident audit ledger.
- Export to CSV or print official inspection summary dossiers.

---

## 🚀 Getting Started & Configuration

### Environment Variables
Copy `.env.example` to `.env`:
```env
# Supabase credentials (optional for cloud persistence; fallback engine active by default)
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-public-key"
```

### PostgreSQL Database Migration
The complete SQL migration schema is located in:
```
/supabase/migrations/20261028_inspectra_core_schema.sql
```
To run on your Supabase instance:
1. Open your Supabase Project Dashboard.
2. Navigate to the **SQL Editor**.
3. Paste the contents of `20261028_inspectra_core_schema.sql` and run it.
4. All 9 tables (`profiles`, `institutions`, `inspection_assignments`, `inspections`, `checklist_responses`, `evidence_records`, `findings`, `corrective_actions`, `audit_events`), indexes, and Row Level Security (RLS) policies will be provisioned.

---

## 🧪 Acceptance Test Walkthrough
1. **Admin Console** (`/admin`): Review national KPIs and click **"Generate Random Assignment"**.
2. **Inspector Switch** (`/inspector`): Switch active persona to **Inspector**, open the newly scheduled inspection.
3. **Digital Checklist** (`/checklist`): Mark an item as `FAIL` with a severity of `CRITICAL` and enter an observation note.
4. **Evidence Capture** (`/verification`): Open the live sensor camera or upload a test file to generate a cryptographic SHA-256 seal.
5. **Submit Inspection**: Finalize the audit. Notice the automated creation of a new finding.
6. **Manager Portal** (`/manager`): Switch persona to **Manager**, review the finding, and submit remediation proof.
7. **Signoff**: Switch back to **Admin**, approve the corrective action, and verify the status updates to `CLOSED` in the audit ledger.
