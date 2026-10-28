import React, { useState } from 'react';
import { dbStore } from '../../services/store.ts';
import { Institution, InstitutionCategory, FundingCategory } from '../../types/index.ts';
import { z } from 'zod';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';

const InstitutionSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  code: z.string().min(3, 'Code is required (e.g. INST-DL-101)'),
  category: z.enum([
    'Higher Education',
    'Technical Institute',
    'Government School',
    'Vocational Center',
    'Hostel Facility',
    'Healthcare Facility',
  ]),
  district: z.string().min(2, 'District is required'),
  state: z.string().min(2, 'State is required'),
  address: z.string().min(5, 'Address is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  funding_category: z.enum(['Central Govt', 'State Govt', 'Aided', 'Autonomous', 'CSR Funded']),
  contact_person: z.string().min(2, 'Contact person is required'),
  contact_email: z.string().email('Valid email is required'),
  contact_phone: z.string().min(10, 'Valid 10-digit phone required'),
  student_capacity: z.number().min(10, 'Student capacity must be at least 10'),
});

export const InstitutionsPage: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>(dbStore.getInstitutions());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInst, setSelectedInst] = useState<Institution>(institutions[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'Technical Institute' as InstitutionCategory,
    district: '',
    state: 'Delhi',
    address: '',
    latitude: 28.6139,
    longitude: 77.2090,
    funding_category: 'Central Govt' as FundingCategory,
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    student_capacity: 1200,
  });

  const findings = dbStore.getFindings(selectedInst?.id);
  const assignments = dbStore.getAssignments().filter(a => a.institution_id === selectedInst?.id);

  const handleCreateInstitution = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = InstitutionSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const created = dbStore.addInstitution(result.data);
    const updated = dbStore.getInstitutions();
    setInstitutions(updated);
    setSelectedInst(created);
    setShowAddModal(false);
    // Reset form
    setFormData({
      name: '',
      code: '',
      category: 'Technical Institute',
      district: '',
      state: 'Delhi',
      address: '',
      latitude: 28.6139,
      longitude: 77.2090,
      funding_category: 'Central Govt',
      contact_person: '',
      contact_email: '',
      contact_phone: '',
      student_capacity: 1000,
    });
  };

  const filtered = institutions.filter(i =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1">
            Facility Registry
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Institutions & Facilities
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage government hostels, schools, and technical institutions under surveillance
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-sm shadow-cyan-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>Register New Institution</span>
        </button>
      </div>

      {/* Main Split Layout: List on Left, Detailed Profile on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Search & List */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, district, code..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-800 bg-[#090d16] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filtered.map(inst => {
              const isSelected = selectedInst?.id === inst.id;
              const score = inst.overall_compliance_score || 75;
              return (
                <div
                  key={inst.id}
                  onClick={() => setSelectedInst(inst)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-cyan-500/60 bg-cyan-950/20 shadow-sm'
                      : 'border-slate-800/80 bg-[#090d16] hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                      {inst.code}
                    </span>
                    <span
                      className={`text-xs font-bold tabular-nums font-mono ${
                        score >= 80 ? 'text-emerald-400' : score >= 65 ? 'text-amber-400' : 'text-rose-400'
                      }`}
                    >
                      {score}% Score
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 truncate">{inst.name}</h4>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                    <span className="truncate">{inst.district}, {inst.state}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Selected Institution Detail Card */}
        {selectedInst && (
          <div className="lg:col-span-2 space-y-5">
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#090d16]">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1 text-xs text-slate-400">
                    <span className="font-mono text-cyan-400">{selectedInst.code}</span>
                    <span>·</span>
                    <span>{selectedInst.category}</span>
                    <span>·</span>
                    <span>{selectedInst.funding_category}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">{selectedInst.name}</h2>
                  <p className="text-xs text-slate-300 mt-1">{selectedInst.address}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] text-slate-400 uppercase">Compliance Index</div>
                  <div
                    className={`text-3xl font-bold font-mono tabular-nums ${
                      (selectedInst.overall_compliance_score || 0) >= 80
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {selectedInst.overall_compliance_score}%
                  </div>
                </div>
              </div>

              {/* Facility Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Contact Person</span>
                  <span className="font-semibold text-slate-200">{selectedInst.contact_person}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Official Email</span>
                  <span className="font-semibold text-slate-200 truncate block">{selectedInst.contact_email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Phone Contact</span>
                  <span className="font-semibold text-slate-200">{selectedInst.contact_phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">GPS Coordinates</span>
                  <span className="font-mono text-cyan-300">
                    {selectedInst.latitude.toFixed(4)}, {selectedInst.longitude.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Inspection History & Open Findings */}
              <div className="mt-5 space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Active Inspection Assignments ({assignments.length})
                  </h4>
                  {assignments.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No scheduled inspections currently.</p>
                  ) : (
                    <div className="space-y-2">
                      {assignments.map(a => (
                        <div
                          key={a.id}
                          className="p-3 rounded-lg border border-slate-800 bg-slate-900/40 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-semibold text-slate-200">{a.inspector_name}</span>
                            <div className="text-[11px] text-slate-400">
                              Scheduled: {a.scheduled_date} · Deadline: {a.deadline_date}
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                            {a.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Current Non-Compliance Findings ({findings.length})
                  </h4>
                  {findings.length === 0 ? (
                    <div className="p-3 rounded-lg border border-emerald-900/40 bg-emerald-950/20 text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Zero open violations recorded for this institution.</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {findings.map(f => (
                        <div
                          key={f.id}
                          className="p-3 rounded-lg border border-slate-800 bg-slate-900/40 text-xs"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-slate-100">{f.title}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                f.severity === 'CRITICAL'
                                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                  : 'bg-amber-950 text-amber-300 border border-amber-800'
                              }`}
                            >
                              {f.severity}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mb-2">{f.description}</p>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                            <span>Due by: {f.due_date}</span>
                            <span>Status: {f.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Institution Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#090d16] border border-slate-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-white">Register Facility to Inspection Radar</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInstitution} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Institution Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. National Institute of Design"
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                  {errors.name && <p className="text-rose-400 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Institution Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. INST-DL-9012"
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 focus:outline-none focus:border-cyan-500 uppercase"
                  />
                  {errors.code && <p className="text-rose-400 mt-1">{errors.code}</p>}
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as InstitutionCategory })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Technical Institute">Technical Institute</option>
                    <option value="Hostel Facility">Hostel Facility</option>
                    <option value="Higher Education">Higher Education</option>
                    <option value="Government School">Government School</option>
                    <option value="Vocational Center">Vocational Center</option>
                    <option value="Healthcare Facility">Healthcare Facility</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Funding Category</label>
                  <select
                    value={formData.funding_category}
                    onChange={e => setFormData({ ...formData, funding_category: e.target.value as FundingCategory })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Central Govt">Central Govt</option>
                    <option value="State Govt">State Govt</option>
                    <option value="Aided">Aided</option>
                    <option value="Autonomous">Autonomous</option>
                    <option value="CSR Funded">CSR Funded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">District</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                    placeholder="e.g. South West Delhi"
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                  {errors.district && <p className="text-rose-400 mt-1">{errors.district}</p>}
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g. Delhi"
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                  {errors.state && <p className="text-rose-400 mt-1">{errors.state}</p>}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Physical Address</label>
                <textarea
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                  placeholder="Street, Institutional Area, City, PIN"
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
                {errors.address && <p className="text-rose-400 mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.latitude}
                    onChange={e => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.longitude}
                    onChange={e => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Contact Officer</label>
                  <input
                    type="text"
                    value={formData.contact_person}
                    onChange={e => setFormData({ ...formData, contact_person: e.target.value })}
                    placeholder="e.g. Dr. H. C. Verma"
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                  {errors.contact_person && <p className="text-rose-400 mt-1">{errors.contact_person}</p>}
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={formData.contact_email}
                    onChange={e => setFormData({ ...formData, contact_email: e.target.value })}
                    placeholder="admin@institute.gov.in"
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                  {errors.contact_email && <p className="text-rose-400 mt-1">{errors.contact_email}</p>}
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.contact_phone}
                    onChange={e => setFormData({ ...formData, contact_phone: e.target.value })}
                    placeholder="+91 98111 22233"
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                  {errors.contact_phone && <p className="text-rose-400 mt-1">{errors.contact_phone}</p>}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Submit & Geotag Institution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
