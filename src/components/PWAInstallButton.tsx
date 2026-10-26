import React, { useState } from 'react';
import { Smartphone, Download, Share2, X, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  onOpenPilotHub?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ onOpenPilotHub }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed and running standalone, show subtle active badge or button to open pilot hub
  if (isInstalled) {
    return (
      <button
        onClick={onOpenPilotHub}
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all"
        title="App Installed - View Pilot Hub"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span>Pilot App</span>
      </button>
    );
  }

  // Chromium / Android / Desktop WebAPK prompt ready
  if (isInstallable) {
    return (
      <button
        onClick={async () => {
          const success = await install();
          if (!success && onOpenPilotHub) {
            onOpenPilotHub();
          }
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950 transition-all animate-pulse"
        title="Install Salone Connect as Android APK / Native App"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install APK</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
        >
          <Share2 className="w-3.5 h-3.5 text-sky-400" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  Install on iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">1</span>
                  <p>Tap the <strong>Share</strong> button in your Safari bottom toolbar.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">2</span>
                  <p>Scroll down and tap <strong>"Add to Home Screen"</strong>.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">3</span>
                  <p>Tap <strong>Add</strong> at top right to launch full screen!</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback: Button to open Pilot Testing Hub
  return (
    <button
      onClick={onOpenPilotHub}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all"
      title="Open Pilot Testing & APK Hub"
    >
      <Smartphone className="w-3.5 h-3.5" />
      <span>Pilot APK</span>
    </button>
  );
};
