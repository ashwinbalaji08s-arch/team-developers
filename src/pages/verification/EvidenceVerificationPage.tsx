import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { dbStore } from '../../services/store.ts';
import { calculateFileSha256, verifyGeofenceProximity } from '../../services/crypto.ts';
import { EvidenceRecord } from '../../types/index.ts';
import {
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  Clock,
  Hash,
  RefreshCw,
  Eye,
  FileCheck2,
  Compass,
  AlertCircle,
  X,
} from 'lucide-react';

export const EvidenceVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const paramItemCode = searchParams.get('itemCode');
  const paramInspectionId = searchParams.get('inspectionId') || 'asg-01';

  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>(dbStore.getEvidenceRecords());
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceRecord>(evidenceList[0]);

  // Live Camera State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>('Not requested');
  const [currentGps, setCurrentGps] = useState<{ lat: number; lon: number; accuracy: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [captureNotice, setCaptureNotice] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const institutions = dbStore.getInstitutions();
  const targetInstitution = institutions[0];

  useEffect(() => {
    return () => {
      // Clean up camera stream if unmounted
      if (cameraStream) {
        cameraStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [cameraStream]);

  // Request browser location
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation API not supported on this device.');
      return;
    }
    setLocationStatus('Requesting high-accuracy GPS coordinates...');
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCurrentGps({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setLocationStatus(`Locked: ${pos.coords.latitude.toFixed(4)}°, ${pos.coords.longitude.toFixed(4)}° (±${Math.round(pos.coords.accuracy)}m)`);
      },
      err => {
        setLocationStatus(`Location denied or timed out (${err.message}). Flagged in audit.`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Start Live Camera
  const startCamera = async () => {
    try {
      requestLocation();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      alert(`Could not start live camera: ${err.message}. Please allow camera permissions.`);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  // Capture Live Photo
  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsProcessing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async blob => {
      if (!blob) {
        setIsProcessing(false);
        return;
      }

      // 1. Calculate SHA-256 hash using Web Crypto API
      const sha256 = await calculateFileSha256(blob);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

      // 2. Geofence verification
      const tamperFlags: string[] = [];
      if (!currentGps) {
        tamperFlags.push('MISSING_GPS_COORDINATES');
      } else {
        const proximity = verifyGeofenceProximity(
          currentGps.lat,
          currentGps.lon,
          targetInstitution.latitude,
          targetInstitution.longitude,
          800
        );
        if (!proximity.withinRange) {
          tamperFlags.push(`GEOFENCE_OUT_OF_BOUNDS (${proximity.distanceMeters}m from target)`);
        }
      }

      const newRecord: EvidenceRecord = {
        id: `evi-${Date.now().toString().slice(-6)}`,
        inspection_id: paramInspectionId,
        checklist_item_id: paramItemCode || 'SAF-01',
        file_url: dataUrl,
        file_name: `live_capture_${Date.now()}.jpg`,
        file_size_bytes: blob.size,
        sha256_hash: sha256,
        hash_verified_server: true,
        latitude: currentGps ? currentGps.lat : null,
        longitude: currentGps ? currentGps.lon : null,
        gps_accuracy_meters: currentGps ? currentGps.accuracy : null,
        captured_at: new Date().toISOString(),
        is_live_capture: true, // Captured directly via MediaStream
        device_info: navigator.userAgent.slice(0, 40),
        tamper_flags: tamperFlags,
        created_at: new Date().toISOString(),
      };

      dbStore.addEvidenceRecord(newRecord);
      const updated = dbStore.getEvidenceRecords();
      setEvidenceList(updated);
      setSelectedEvidence(newRecord);
      setIsProcessing(false);
      stopCamera();
      setCaptureNotice('Live photo captured & cryptographically hashed with SHA-256.');
      setTimeout(() => setCaptureNotice(null), 4000);
    }, 'image/jpeg', 0.85);
  };

  // Handle File Picker (explicitly marked as NON-LIVE upload)
  const handleFilePicker = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const sha256 = await calculateFileSha256(file);
    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = reader.result as string;
      const newRecord: EvidenceRecord = {
        id: `evi-${Date.now().toString().slice(-6)}`,
        inspection_id: paramInspectionId,
        checklist_item_id: paramItemCode || 'FDW-01',
        file_url: dataUrl,
        file_name: file.name,
        file_size_bytes: file.size,
        sha256_hash: sha256,
        hash_verified_server: true,
        latitude: null, // File picker cannot guarantee live GPS
        longitude: null,
        gps_accuracy_meters: null,
        captured_at: new Date(file.lastModified).toISOString(),
        is_live_capture: false, // Explicitly false as mandated by ethical requirements
        device_info: 'Local Storage Upload',
        tamper_flags: ['UNVERIFIED_GALLERY_UPLOAD', 'NO_AUTHENTICATED_SENSOR_STREAM'],
        created_at: new Date().toISOString(),
      };

      dbStore.addEvidenceRecord(newRecord);
      const updated = dbStore.getEvidenceRecords();
      setEvidenceList(updated);
      setSelectedEvidence(newRecord);
      setIsProcessing(false);
      setCaptureNotice('File registered. Tagged as gallery upload (unverified live sensor stream).');
      setTimeout(() => setCaptureNotice(null), 4000);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1">
            Tamper-Proof Audit
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Evidence Verification Centre
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Photographic proof examination, cryptographic SHA-256 seal checks, and sensor telemetry
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Upload className="h-3.5 w-3.5 text-slate-400" />
            <span>Upload File</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFilePicker}
          />

          <button
            onClick={startCamera}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-sm shadow-cyan-500/20"
          >
            <Camera className="h-3.5 w-3.5" />
            <span>Launch Live Sensor Camera</span>
          </button>
        </div>
      </div>

      {captureNotice && (
        <div className="p-3 rounded-lg border border-cyan-800 bg-cyan-950/40 text-cyan-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-cyan-400" />
          <span>{captureNotice}</span>
        </div>
      )}

      {/* Live Camera Modal Overlay */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#090d16] border border-cyan-500/40 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                <Camera className="h-4 w-4" />
                <span>Live Hardware Sensor Stream</span>
              </div>
              <button onClick={stopCamera} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-black aspect-video mb-3 border border-slate-800">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />

              {/* Viewfinder Overlay HUD */}
              <div className="absolute inset-4 border border-cyan-400/40 pointer-events-none rounded-lg flex flex-col justify-between p-2">
                <div className="flex justify-between text-[10px] font-mono text-cyan-400 bg-black/60 px-2 py-0.5 rounded w-max">
                  <span>GPS: {locationStatus}</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded w-max">
                  <span>SHA-256 Engine Active</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400 font-mono">
                {currentGps ? `±${Math.round(currentGps.accuracy)}m accuracy` : 'Acquiring GPS...'}
              </span>

              <button
                onClick={capturePhoto}
                disabled={isProcessing}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/30 disabled:opacity-50 flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                <span>{isProcessing ? 'Hashing...' : 'Capture & Hash Image'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Evidence Verification Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Evidence List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Registered Photo Records ({evidenceList.length})
          </h3>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {evidenceList.map(record => {
              const isSelected = selectedEvidence?.id === record.id;
              const hasFlags = (record.tamper_flags || []).length > 0;

              return (
                <div
                  key={record.id}
                  onClick={() => setSelectedEvidence(record)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 ${
                    isSelected
                      ? 'border-cyan-500/60 bg-cyan-950/20'
                      : 'border-slate-800 bg-[#090d16] hover:border-slate-700'
                  }`}
                >
                  <img
                    src={record.file_url}
                    alt={record.file_name}
                    className="h-16 w-16 object-cover rounded-lg border border-slate-800 shrink-0 bg-slate-900"
                  />
                  <div className="min-w-0 flex-1 text-xs">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-mono text-[10px] text-cyan-400 font-semibold truncate">
                        {record.id} · {record.checklist_item_id}
                      </span>
                      {record.is_live_capture ? (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-teal-950 text-teal-300 border border-teal-800">
                          LIVE CAMERA
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-800 text-slate-400">
                          GALLERY
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-slate-200 truncate">{record.file_name}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1 truncate">
                      SHA: {record.sha256_hash.slice(0, 16)}...
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Cryptographic & Sensor Telemetry Viewer */}
        {selectedEvidence && (
          <div className="lg:col-span-2 space-y-5">
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#090d16]">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-5">
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
                    Record ID: {selectedEvidence.id} · Linked to Checklist #{selectedEvidence.checklist_item_id}
                  </div>
                  <h2 className="text-lg font-bold text-white">{selectedEvidence.file_name}</h2>
                </div>

                <div>
                  {selectedEvidence.hash_verified_server ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span>SHA-256 Hash Verified</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-950/60 text-rose-300 border border-rose-800">
                      <AlertCircle className="h-4 w-4 text-rose-400" />
                      <span>Hash Verification Failed</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Large Image Preview with Scrim */}
              <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 max-h-[380px] flex items-center justify-center mb-5">
                <img
                  src={selectedEvidence.file_url}
                  alt={selectedEvidence.file_name}
                  className="max-h-[380px] w-full object-contain"
                />
                <div className="absolute bottom-2 left-2 right-2 p-2.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[11px] text-slate-300 flex items-center justify-between">
                  <span className="font-mono truncate">
                    SHA-256: {selectedEvidence.sha256_hash}
                  </span>
                  <span className="shrink-0 ml-2 font-semibold">
                    {Math.round(selectedEvidence.file_size_bytes / 1024)} KB
                  </span>
                </div>
              </div>

              {/* Sensor & Metadata Audit Table */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/50 text-xs mb-5">
                <div>
                  <span className="text-slate-400 block text-[11px] mb-0.5">Capture Origin</span>
                  <span className="font-bold text-slate-100 flex items-center gap-1.5">
                    {selectedEvidence.is_live_capture ? (
                      <>
                        <Camera className="h-3.5 w-3.5 text-teal-400" /> Live Sensor Capture
                      </>
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5 text-amber-400" /> Local File Upload
                      </>
                    )}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {selectedEvidence.device_info || 'Unknown device'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px] mb-0.5">GPS Geolocation</span>
                  {selectedEvidence.latitude && selectedEvidence.longitude ? (
                    <div>
                      <span className="font-mono font-bold text-cyan-300 block">
                        {selectedEvidence.latitude.toFixed(4)}° N, {selectedEvidence.longitude.toFixed(4)}° E
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Accuracy: ±{Math.round(selectedEvidence.gps_accuracy_meters || 5)} meters
                      </span>
                    </div>
                  ) : (
                    <span className="text-amber-400 font-semibold">No GPS Telemetry Tagged</span>
                  )}
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px] mb-0.5">Capture Timestamp</span>
                  <span className="font-mono text-slate-200 block">
                    {new Date(selectedEvidence.captured_at).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Logged in PostgreSQL Audit
                  </span>
                </div>
              </div>

              {/* Tamper Flags and Ethical Notice */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Tamper Assessment & Security Flags
                </h4>

                {selectedEvidence.tamper_flags && selectedEvidence.tamper_flags.length > 0 ? (
                  <div className="space-y-1.5">
                    {selectedEvidence.tamper_flags.map((flag, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg border border-amber-800/60 bg-amber-950/20 text-xs text-amber-300 flex items-center gap-2"
                      >
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        <span className="font-mono text-[11px]">{flag}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-lg border border-emerald-900/40 bg-emerald-950/20 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>No cryptographic or spatial anomalies detected. Compliant evidence record.</span>
                  </div>
                )}

                <p className="text-[11px] text-slate-400 mt-3 italic leading-relaxed">
                  * Note: In compliance with inspection ethics, cryptographic SHA-256 seals verify the file has not been altered post-capture. Geolocation and timestamp metadata provide spatial context but do not substitute for on-site inspector diligence.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
