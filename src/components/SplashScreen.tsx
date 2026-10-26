import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import splashScreenImg from '../assets/images/app_splash_screen_1793007859545.jpg';

interface SplashScreenProps {
  onDismiss: () => void;
  autoDismissMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onDismiss,
  autoDismissMs = 2800,
}) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / autoDismissMs) * 100));
      setProgress(pct);

      if (elapsed >= autoDismissMs - 400 && !isFadingOut) {
        setIsFadingOut(true);
      }

      if (elapsed >= autoDismissMs) {
        clearInterval(interval);
        onDismiss();
      }
    }, 40);

    return () => clearInterval(interval);
  }, [autoDismissMs, onDismiss, isFadingOut]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(onDismiss, 200);
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-50 flex items-center justify-center cursor-pointer transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        // Two-tone national flag backdrop: Solid green on top, Solid blue on bottom
        background: 'linear-gradient(to bottom, #15803d 0%, #15803d 50%, #1d4ed8 50%, #1d4ed8 100%)',
      }}
    >
      {/* Container framing the vertical portrait rectangle */}
      <div className="relative w-full max-w-sm h-full max-h-[780px] p-4 sm:p-6 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
        {/* Soft White Card Container */}
        <div className="relative w-full aspect-[9/16] max-h-[640px] rounded-[36px] bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col items-center justify-between p-6 sm:p-8 border border-white/40">
          {/* Main Visual Image Layer */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={splashScreenImg}
              alt="Salone Connect Dating Splash Screen"
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          </div>

          {/* Interactive Tap & Loading Indicator overlay at the bottom */}
          <div className="relative z-10 w-full mt-auto pt-6 flex flex-col items-center gap-3">
            {/* Smooth Progress Bar */}
            <div className="w-44 h-1.5 bg-slate-200/80 rounded-full overflow-hidden shadow-inner backdrop-blur-sm">
              <div
                className="h-full bg-gradient-to-r from-teal-600 to-emerald-500 rounded-full transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Skip Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSkip();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-teal-900/10 hover:bg-teal-900/20 text-teal-900 text-[11px] font-bold tracking-wide transition-all uppercase"
            >
              <span>Tap to Enter</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Ambient bottom caption */}
        <div className="mt-3 flex items-center gap-2 text-white/90 text-xs font-semibold drop-shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Sierra Leone Cultural Dating</span>
        </div>
      </div>
    </div>
  );
};
