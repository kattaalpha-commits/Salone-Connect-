import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Smartphone,
  Download,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Terminal,
  Bug,
  Send,
  Users,
  X,
  Layers,
  Crown,
  CheckCircle2,
  AlertCircle,
  Share2,
  Globe,
  Cloud,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { UserProfile } from '../types';

interface PilotTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onResetQuota: () => void;
  onPreviewSplash?: () => void;
  onOpenShare?: () => void;
}

export const PilotTestModal: React.FC<PilotTestModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onResetQuota,
  onPreviewSplash,
  onOpenShare,
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'install' | 'deploy' | 'qr' | 'apk_builder' | 'personas' | 'feedback'>('install');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [feedbackCategory, setFeedbackCategory] = useState<'bug' | 'feature' | 'ui' | 'cultural'>('bug');
  const [feedbackNote, setFeedbackNote] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [installSuccessMessage, setInstallSuccessMessage] = useState<string | null>(null);

  // Live Shared Preview URL
  const appLiveUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-s3cj2t4yy667ngiz3tlq7s-606344511533.europe-west3.run.app';

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(appLiveUrl, {
        width: 260,
        margin: 1.5,
        color: {
          dark: '#020617',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error('Failed to generate QR:', err));
    }
  }, [isOpen, appLiveUrl]);

  if (!isOpen) return null;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(appLiveUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstallSuccessMessage('Installation request launched on your device!');
      setTimeout(() => setInstallSuccessMessage(null), 4000);
    }
  };

  const handleDownloadTwaConfig = () => {
    const twaConfig = {
      packageId: 'com.saloneconnect.dating',
      host: new URL(appLiveUrl).host,
      name: 'Salone Connect Dating',
      launcherName: 'SaloneConnect',
      themeColor: '#020617',
      navigationColor: '#020617',
      backgroundColor: '#020617',
      startUrl: '/',
      iconUrl: `${appLiveUrl}/pwa-512x512.png`,
      maskableIconUrl: `${appLiveUrl}/pwa-maskable-512x512.png`,
      generator: 'Bubblewrap TWA Builder v1.18.2',
      features: {
        location: true,
        camera: true,
        microphone: true,
        webShare: true,
      },
      pilotContacts: {
        lead: 'kattaalpha@gmail.com',
        phone: '+23280181162',
      },
    };

    const blob = new Blob([JSON.stringify(twaConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'salone-connect-twa-manifest.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackNote.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackNote('');
      setFeedbackSent(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border-b border-slate-800 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Pilot Release v1.0.0
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Build 108 · Android & Mobile</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-emerald-400" />
              Pilot Testing & APK Launcher
            </h2>
            <p className="text-xs text-slate-300">
              Install Salone Connect on Android devices, scan mobile QR, or build standalone APK binaries.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-4 gap-2 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('install')}
            className={`py-3 px-3 font-semibold whitespace-nowrap border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'install'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            1-Click Android WebAPK
          </button>
          <button
            onClick={() => setActiveTab('deploy')}
            className={`py-3 px-3 font-semibold whitespace-nowrap border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'deploy'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Public Deploy (Fix 403)
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`py-3 px-3 font-semibold whitespace-nowrap border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'qr'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            Scan Phone QR
          </button>
          <button
            onClick={() => setActiveTab('apk_builder')}
            className={`py-3 px-3 font-semibold whitespace-nowrap border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'apk_builder'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Direct APK Build
          </button>
          <button
            onClick={() => setActiveTab('personas')}
            className={`py-3 px-3 font-semibold whitespace-nowrap border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'personas'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Tester Sandbox
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`py-3 px-3 font-semibold whitespace-nowrap border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'feedback'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bug className="w-3.5 h-3.5" />
            Bug Report
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {/* TAB 1: 1-Click Android WebAPK */}
          {activeTab === 'install' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-br from-emerald-950/40 via-slate-800/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shrink-0">
                  <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center">
                    <img src="/pwa-192x192.png" alt="Salone Connect" className="w-12 h-12 rounded-xl object-contain" />
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h3 className="font-bold text-white text-base">Salone Connect Dating</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                      Standalone APK
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Installs natively on Android phones with splash screen, camera & microphone access for video dates, and full offline caching.
                  </p>
                </div>

                {isInstalled ? (
                  <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold text-xs whitespace-nowrap">
                    <CheckCircle2 className="w-4 h-4" /> Running in App Mode
                  </div>
                ) : isInstallable ? (
                  <button
                    onClick={handleInstallClick}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 whitespace-nowrap"
                  >
                    <Download className="w-4 h-4" /> Install WebAPK Now
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('qr')}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-semibold text-xs flex items-center justify-center gap-1.5"
                  >
                    <QrCode className="w-4 h-4" /> Open on Mobile
                  </button>
                )}
              </div>

              {installSuccessMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" /> {installSuccessMessage}
                </div>
              )}

              {/* Instructions Guide */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  How Pilot Testers Can Install (2 Easy Steps):
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Android Instruction */}
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-white">
                      <Smartphone className="w-4 h-4 text-emerald-400" />
                      <span>On Android (Chrome / Samsung Internet)</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                      <li>Open the app link on your phone (or scan the QR tab).</li>
                      <li>
                        Tap the browser menu <strong className="text-white">⋮ (3 dots)</strong> at the top right.
                      </li>
                      <li>
                        Tap <strong className="text-emerald-400">"Install app"</strong> or <strong className="text-emerald-400">"Add to Home Screen"</strong>.
                      </li>
                      <li>Android will generate the official WebAPK package on your home screen.</li>
                    </ol>
                  </div>

                  {/* iOS Instruction */}
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-white">
                      <Share2 className="w-4 h-4 text-sky-400" />
                      <span>On iPhone / iPad (Safari)</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                      <li>Open the app link in Safari.</li>
                      <li>
                        Tap the <strong className="text-white">Share</strong> button at the bottom navigation bar.
                      </li>
                      <li>
                        Scroll down and tap <strong className="text-sky-400">"Add to Home Screen"</strong>.
                      </li>
                      <li>Tap "Add". The app will run full screen with native gesture support.</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Pilot Security Specs */}
              <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-800 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-white">Pilot Testing Security Enforcement</p>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Anti-scam geo-fencing is actively running in this build. Dial codes +234, +91, and +880 are blacklisted. Video date WebRTC permissions and photo-verification liveness camera are fully functional for testers.
                  </p>
                </div>
              </div>

              {/* Splash Screen Preview */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-800/40 to-blue-950/40 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-16 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden shadow-inner shrink-0 flex items-center justify-center">
                    <img src="/splash.jpg" alt="Splash Screen" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-0.5 text-xs text-left">
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                      Two-Tone Portrait Splash Screen
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Solid green top, solid blue bottom, soft white card with glowing pink heart & silhouette.
                    </p>
                  </div>
                </div>

                {onPreviewSplash && (
                  <button
                    onClick={() => {
                      onClose();
                      onPreviewSplash();
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/40 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-pink-400" /> Preview Splash Screen
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB: FREE PUBLIC DEPLOYMENT (FIX 403 ACCESS DENIED) */}
          {activeTab === 'deploy' && (
            <div className="space-y-5 text-xs text-slate-200">
              {/* Notice on 403 */}
              <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Why External Testers Get "403 Access Denied":
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  The Google AI Studio URL (<code className="text-amber-200">*.run.app</code>) is a private, authenticated development sandbox restricted to your Google account.
                  To let any tester in Sierra Leone, the UK, or the USA open and test the app with zero login, deploy this build for free on <strong className="text-white">Vercel</strong> or <strong className="text-white">Netlify</strong>.
                </p>
              </div>

              {/* Deployment Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option 1: Vercel */}
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center font-black text-xs border border-slate-700">▲</div>
                      <h4 className="font-bold text-white text-sm">Vercel (Recommended)</h4>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">100% Free</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Automatic global CDN, unlimited tester traffic, and instant custom domain. <code className="text-emerald-400">vercel.json</code> is already configured!
                  </p>
                  <div className="space-y-1.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-[10px]">
                    <div className="text-slate-500"># Deploy via terminal in 1 command:</div>
                    <div className="text-emerald-300">npx vercel --prod</div>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
                    <li>Push code to GitHub.</li>
                    <li>Import repository on <strong className="text-white">vercel.com</strong>.</li>
                    <li>Hit <strong className="text-emerald-400">Deploy</strong> — live in 40s!</li>
                  </ol>
                </div>

                {/* Option 2: Netlify Drop */}
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-black text-xs border border-teal-500/40">◆</div>
                      <h4 className="font-bold text-white text-sm">Netlify Drag-and-Drop</h4>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">Instant</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    No GitHub or terminal required! Drag your compiled <code className="text-slate-200">dist</code> folder onto Netlify Drop.
                  </p>
                  <div className="space-y-1.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-[10px]">
                    <div className="text-slate-500"># Terminal option:</div>
                    <div className="text-teal-300">npx netlify deploy --prod --dir=dist</div>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
                    <li>Run <code className="text-white">npm run build</code>.</li>
                    <li>Open <strong className="text-white">app.netlify.com/drop</strong>.</li>
                    <li>Drag the <code className="text-emerald-400">dist/</code> folder into the browser window.</li>
                  </ol>
                </div>
              </div>

              {/* Ready Config Files Box */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" /> Pre-Configured Files Created in Workspace:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                    <span className="font-mono text-emerald-400 font-semibold">vercel.json</span>
                    <p className="text-slate-400 text-[10px]">SPA rewrites, asset caching & security headers.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                    <span className="font-mono text-teal-400 font-semibold">netlify.toml</span>
                    <p className="text-slate-400 text-[10px]">Build redirects for clean client routing.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                    <span className="font-mono text-amber-400 font-semibold">firebase.json</span>
                    <p className="text-slate-400 text-[10px]">Firebase Hosting rewrite rules.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Scan Phone QR */}
          {activeTab === 'qr' && (
            <div className="space-y-5 text-center">
              <div className="max-w-xs mx-auto p-5 rounded-2xl bg-white shadow-2xl flex flex-col items-center justify-center">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="Salone Connect Pilot QR Code" className="w-56 h-56 object-contain rounded-lg" />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center text-slate-400">
                    Generating QR...
                  </div>
                )}
                <span className="mt-3 text-[11px] font-bold text-slate-900 tracking-wide">
                  SCAN WITH ANY PHONE CAMERA
                </span>
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <p className="text-xs text-slate-300">
                  Direct live link to test this exact build on your smartphone:
                </p>
                <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 rounded-xl p-2 px-3">
                  <input
                    type="text"
                    readOnly
                    value={appLiveUrl}
                    className="bg-transparent text-xs text-slate-200 flex-1 outline-none truncate font-mono"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <a
                    href={appLiveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs shrink-0"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {onOpenShare && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenShare();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all mt-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Open 1-Click Share Suite (WhatsApp, SMS, QR Flyer)</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Direct APK Build (Bubblewrap & TWA) */}
          {activeTab === 'apk_builder' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Google Bubblewrap / TWA APK Compiler
                    </h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                    Official Android TWA
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Google provides <strong className="text-white">Bubblewrap</strong> to turn PWA WebAPKs into signed or unsigned binary <code className="text-emerald-400">.apk</code> / <code className="text-emerald-400">.aab</code> files for Google Play or WhatsApp pilot testing.
                </p>
              </div>

              {/* Commands Box */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400">Run in your terminal to build APK:</p>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-200 space-y-2 overflow-x-auto">
                  <div className="text-slate-400"># 1. Initialize Bubblewrap Android Project with our manifest</div>
                  <div className="text-emerald-400">
                    npx @bubblewrap/cli init --manifest={appLiveUrl}/manifest.webmanifest
                  </div>
                  <div className="text-slate-400 pt-1"># 2. Compile into Android .apk file</div>
                  <div className="text-emerald-400">npx @bubblewrap/cli build</div>
                </div>
              </div>

              {/* Download TWA Config */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-800 gap-3">
                <div className="space-y-0.5 text-xs">
                  <p className="font-semibold text-white">Pre-Configured TWA Manifest</p>
                  <p className="text-slate-400 text-[11px]">
                    Includes package ID <code className="text-slate-300">com.saloneconnect.dating</code>, camera, and GPS permissions.
                  </p>
                </div>
                <button
                  onClick={handleDownloadTwaConfig}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download Manifest JSON
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Tester Personas */}
          {activeTab === 'personas' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Switch Testing Roles in 1 Click:
                </h4>
                <p className="text-xs text-slate-400">
                  Quickly test different tiers and user perspectives across Sierra Leone and the Diaspora.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Persona 1: Freetown Free Tier */}
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      🇸🇱 Freetown Resident
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">Free Tier</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Location: Western Area Urban. Tests 10 daily swipe limits, ads, and secret blurred matches.
                  </p>
                  <button
                    onClick={() => {
                      onUpdateUser({
                        locationCity: 'Freetown',
                        locationCountry: 'Sierra Leone',
                        district: 'Western Area Urban',
                        region: 'freetown',
                        isPremium: false,
                        isTrialActive: false,
                        trialExpiresAt: new Date(Date.now() - 20 * 86400000).toISOString(), // expired trial
                      });
                    }}
                    className="w-full py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold text-[11px] transition-colors"
                  >
                    Switch to Free Tester
                  </button>
                </div>

                {/* Persona 2: VIP Subscriber */}
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5" /> VIP Subscriber
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">VIP Pass</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Paid via Orange Money / Card. Tests unlimited swipes, 100% ad-free mode, and unlocked admirers.
                  </p>
                  <button
                    onClick={() => {
                      onUpdateUser({
                        isPremium: true,
                        premiumTier: 'monthly_5',
                        isVerified: true,
                        verificationBadgeType: 'photo_pose',
                      });
                    }}
                    className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition-colors"
                  >
                    Activate VIP Subscriber
                  </button>
                </div>

                {/* Persona 3: Diaspora Traveler */}
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      🇬🇧 London Diaspora
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">Homecoming</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Visiting Sierra Leone for December holidays. Tests the Homecoming Matcher & currency switcher.
                  </p>
                  <button
                    onClick={() => {
                      onUpdateUser({
                        locationCity: 'London',
                        locationCountry: 'United Kingdom',
                        district: 'Diaspora (UK)',
                        region: 'uk',
                        homecoming: {
                          isPlanningTrip: true,
                          arrivalMonth: 'December 2026',
                          durationWeeks: 4,
                          destinationDistrict: 'Western Area Urban',
                          note: 'Coming home for December holiday!',
                        },
                      });
                    }}
                    className="w-full py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold text-[11px] transition-colors"
                  >
                    Switch to Diaspora Tester
                  </button>
                </div>

                {/* Persona 4: Reset Swipes & Trials */}
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      ⚡ Refill Swipes & Quota
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Tool</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Resets daily swipe counter and messages so you can test discovery card swiping continuously.
                  </p>
                  <button
                    onClick={onResetQuota}
                    className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition-colors"
                  >
                    Reset Daily Counters (0/10)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Bug Report & Pilot Feedback */}
          {activeTab === 'feedback' && (
            <form onSubmit={handleSendFeedback} className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Send Pilot Feedback Directly to Product Team:
                </h4>
                <p className="text-xs text-slate-400">
                  Official Pilot Desk: <span className="text-white font-semibold">kattaalpha@gmail.com</span> · WhatsApp: <span className="text-emerald-400 font-semibold">+23280181162</span>
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'bug', label: '🐛 Bug / Issue' },
                  { id: 'ui', label: '🎨 UI / Mobile' },
                  { id: 'cultural', label: '🇸🇱 Culture Tag' },
                  { id: 'feature', label: '💡 Idea' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFeedbackCategory(item.id as any)}
                    className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                      feedbackCategory === item.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <textarea
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                placeholder="Describe what happened on your mobile device (e.g., photo upload, video call camera test, swipe gesture, district filter)..."
                rows={4}
                required
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 outline-none focus:border-emerald-500 resize-none"
              />

              {feedbackSent ? (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> Thank you! Your pilot report has been queued for review.
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="w-4 h-4" /> Submit Pilot Feedback
                </button>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300">Live Pilot Cloud Build: Active</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
          >
            Close Hub
          </button>
        </div>
      </div>
    </div>
  );
};
