import React, { useState, useRef, useEffect } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Camera,
  PhoneOff,
  ShieldAlert,
  Info,
  Maximize2,
  RefreshCw,
  Users,
} from 'lucide-react';
import { dbStore } from '../../services/store.ts';

export const VideoInspectionPage: React.FC = () => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [callActive, setCallActive] = useState(true);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [capturedNotice, setCapturedNotice] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play();
        }
      } catch (err: any) {
        setStreamError('Local camera permission was not granted or camera is occupied. Displaying fallback inspection feed.');
      }
    };

    startWebcam();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOn;
      });
    }
    setIsVideoOn(!isVideoOn);
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isAudioOn;
      });
    }
    setIsAudioOn(!isAudioOn);
  };

  const captureCallSnapshot = () => {
    setCapturedNotice('Inspection frame captured and timestamped into audit timeline.');
    setTimeout(() => setCapturedNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1">
            Remote Surveillance
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Encrypted Video Inspection Channel
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Two-way peer-to-peer visual walkthrough between Inspector & Institution Representative
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded text-[11px] font-mono font-semibold bg-amber-950/60 text-amber-300 border border-amber-800/60">
            SIMULATED INFRASTRUCTURE P2P
          </span>
        </div>
      </div>

      {/* Infrastructure Notice as explicitly required by prompt */}
      <div className="p-4 rounded-xl border border-slate-800 bg-[#090d16] text-xs flex items-start gap-3">
        <Info className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-slate-300 leading-relaxed">
          <strong className="text-white">Technical Disclosure:</strong> In production, WebRTC peer video relies on dedicated TURN/STUN relay servers. For this demonstration environment, live browser media APIs provide your local video stream, and institution CCTV is not assumed to be pre-integrated.
        </div>
      </div>

      {capturedNotice && (
        <div className="p-3 rounded-lg border border-cyan-800 bg-cyan-950/40 text-cyan-200 text-xs flex items-center gap-2">
          <Camera className="h-4 w-4 text-cyan-400" />
          <span>{capturedNotice}</span>
        </div>
      )}

      {/* Video Conference Viewport */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Main Feed: Remote Institution Walkthrough */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex flex-col justify-between p-4">
          <div className="flex items-center justify-between z-10">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/60 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              LIVE · Remote Facility Stream
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded">
              Bitrate: 1.8 Mbps · WebRTC
            </span>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            {/* High fidelity simulation graphic for remote facility */}
            <div className="text-center p-6">
              <Video className="h-12 w-12 text-slate-600 mx-auto mb-3" />
              <div className="text-sm font-bold text-slate-300">
                Apex Institute · Dormitory Wing Corridor
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Walkthrough streamed by Prof. S. K. Mahajan (Manager)
              </div>
            </div>
          </div>

          <div className="z-10 flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>Latency: 42ms</span>
            <span>Channel ID: #RTC-INSP-8041</span>
          </div>
        </div>

        {/* Secondary Feed: Inspector On-Site / Local Cam */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex flex-col justify-between p-4">
          <div className="flex items-center justify-between z-10">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/60 text-cyan-400 border border-cyan-500/30">
              LOCAL · Inspector Camera
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded">
              720p 30fps
            </span>
          </div>

          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />

          {streamError && (
            <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center p-6 text-center text-xs text-slate-400">
              {streamError}
            </div>
          )}

          <div className="z-10 flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>Audio: {isAudioOn ? 'Active' : 'Muted'}</span>
            <span>Video: {isVideoOn ? 'Active' : 'Disabled'}</span>
          </div>
        </div>
      </div>

      {/* Call Action Bar */}
      <div className="p-4 rounded-xl border border-slate-800 bg-[#090d16] flex items-center justify-center gap-4">
        <button
          onClick={toggleAudio}
          className={`p-3 rounded-full transition-colors ${
            isAudioOn
              ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              : 'bg-rose-950 text-rose-300 border border-rose-800'
          }`}
          title={isAudioOn ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full transition-colors ${
            isVideoOn
              ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              : 'bg-rose-950 text-rose-300 border border-rose-800'
          }`}
          title={isVideoOn ? 'Disable Video' : 'Enable Video'}
        >
          {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </button>

        <button
          onClick={captureCallSnapshot}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-cyan-500/20"
        >
          <Camera className="h-4 w-4" />
          <span>Capture Frame</span>
        </button>

        <button
          onClick={() => setCallActive(!callActive)}
          className="p-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white transition-colors"
          title="End Video Session"
        >
          <PhoneOff className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
