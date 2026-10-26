import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Sparkles,
  Gift,
  ShieldCheck,
  RotateCcw,
  Volume2,
} from 'lucide-react';

interface VirtualVideoDateModalProps {
  partner: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

const SALONE_DATE_STARTERS = [
  'What is your all-time favorite Sierra Leone dish and who taught you how to cook it?',
  'If we spent a perfect Saturday together in Freetown, where are we going first: Bureh, Lumley, or Leicester Peak?',
  'What is a family tradition or Krio/Mende/Temne value that you hold closest to your heart?',
  'Afrobeats or old-school Highlife: What is playing in your car when you take a road trip?',
  'What is one dream you are working toward right now in your career or life?',
];

const VIRTUAL_GIFTS = [
  { id: 'star_beer', label: 'Star Beer', icon: '🍺' },
  { id: 'palm_wine', label: 'Fresh Palm Wine', icon: '🥥' },
  { id: 'plantain', label: 'Fried Plantain', icon: '🍌' },
  { id: 'diamond', label: 'Kono Diamond', icon: '💎' },
  { id: 'flower', label: 'Salone Hibiscus', icon: '🌺' },
];

export const VirtualVideoDateModal: React.FC<VirtualVideoDateModalProps> = ({
  partner,
  isOpen,
  onClose,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [activeStarterIndex, setActiveStarterIndex] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const [activeGift, setActiveGift] = useState<{ icon: string; label: string } | null>(null);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let interval: any;
    if (isOpen) {
      setCallDuration(0);
      interval = setInterval(() => {
        setCallDuration((c) => c + 1);
      }, 1000);
      startLocalCamera();
    } else {
      stopLocalCamera();
    }
    return () => {
      if (interval) clearInterval(interval);
      stopLocalCamera();
    };
  }, [isOpen]);

  const startLocalCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play();
      }
      setCameraPermissionGranted(true);
    } catch {
      setCameraPermissionGranted(false);
    }
  };

  const stopLocalCamera = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = isMuted;
      });
    }
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOff;
      });
    }
    setIsVideoOff(!isVideoOff);
  };

  const sendGift = (gift: { icon: string; label: string }) => {
    setActiveGift(gift);
    setTimeout(() => {
      setActiveGift(null);
    }, 2800);
  };

  const nextStarter = () => {
    setActiveStarterIndex((prev) => (prev + 1) % SALONE_DATE_STARTERS.length);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!isOpen || !partner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl h-[92vh] max-h-[820px] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Top Header Bar */}
        <div className="h-14 px-4 sm:px-6 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-emerald-500">
              <img
                src={partner.photos[0]}
                alt={partner.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs sm:text-sm font-bold text-white">{partner.name}</h3>
                <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-2.5 h-2.5" /> Virtual Date
                </span>
              </div>
              <p className="text-[10px] text-slate-400">{partner.locationCity}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono">
              {formatTime(callDuration)}
            </div>
          </div>
        </div>

        {/* Video Main Stage Area */}
        <div className="relative flex-1 bg-slate-950 overflow-hidden flex items-center justify-center">
          {/* Remote Partner Video Stream Simulation */}
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950">
            <img
              src={partner.photos[0]}
              alt={partner.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-90 scale-105 filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Audio Waveform indicator for remote speech simulation */}
            <div className="absolute bottom-24 left-6 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs text-white">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>{partner.name} is speaking...</span>
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-1 bg-emerald-400 h-2 animate-pulse" />
                <span className="w-1 bg-emerald-400 h-3 animate-pulse delay-75" />
                <span className="w-1 bg-emerald-400 h-1.5 animate-pulse delay-150" />
              </div>
            </div>

            {/* Virtual Gift Animation Overlay */}
            {activeGift && (
              <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none animate-bounce">
                <div className="p-6 rounded-3xl bg-black/70 backdrop-blur-md border border-amber-400/50 text-center space-y-2 shadow-2xl">
                  <span className="text-6xl block">{activeGift.icon}</span>
                  <p className="text-sm font-bold text-amber-300">
                    You sent {activeGift.label}!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Self-View (Picture-in-Picture) Local Video */}
          <div className="absolute top-4 right-4 w-32 sm:w-44 aspect-[3/4] rounded-2xl overflow-hidden bg-slate-900 border-2 border-emerald-500/80 shadow-2xl z-20">
            {cameraPermissionGranted && !isVideoOff ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-slate-800 text-slate-400">
                <VideoOff className="w-6 h-6 text-slate-500 mb-1" />
                <span className="text-[10px]">Camera Off</span>
              </div>
            )}
            <div className="absolute bottom-1.5 left-2 text-[10px] bg-black/60 px-1.5 py-0.5 rounded text-white font-medium">
              You
            </div>
          </div>

          {/* Salone Date Starter Icebreaker Card Overlay */}
          <div className="absolute top-4 left-4 max-w-xs sm:max-w-md bg-slate-900/90 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-3.5 text-slate-100 shadow-xl z-20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Salone Date Starter
              </span>
              <button
                onClick={nextStarter}
                className="text-[11px] text-slate-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                title="Next question"
              >
                <RotateCcw className="w-3 h-3" /> Next
              </button>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              "{SALONE_DATE_STARTERS[activeStarterIndex]}"
            </p>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="p-4 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 z-20">
          {/* Virtual Romance Gifts Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-[11px] text-slate-400 font-semibold mr-1 flex items-center gap-1">
              <Gift className="w-3.5 h-3.5 text-amber-400" /> Gifts:
            </span>
            {VIRTUAL_GIFTS.map((g) => (
              <button
                key={g.id}
                onClick={() => sendGift(g)}
                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-all hover:scale-105 active:scale-95 flex items-center gap-1"
                title={g.label}
              >
                <span>{g.icon}</span>
                <span className="hidden sm:inline text-[11px]">{g.label}</span>
              </button>
            ))}
          </div>

          {/* Call Controls: Audio, Video, End Call */}
          <div className="flex items-center gap-3 mx-auto sm:mx-0">
            <button
              onClick={toggleMic}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                isMuted
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
              title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleVideo}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                isVideoOff
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
              title={isVideoOff ? 'Turn video on' : 'Turn video off'}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>

            <button
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-950 transition-all active:scale-95"
              title="End Virtual Date"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
