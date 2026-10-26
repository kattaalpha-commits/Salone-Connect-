import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Mountain, ShieldCheck } from 'lucide-react';

interface InterstitialAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  isVip: boolean;
}

export const InterstitialAdModal: React.FC<InterstitialAdModalProps> = ({
  isOpen,
  onClose,
  isVip,
}) => {
  const [canClose, setCanClose] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(5);

  useEffect(() => {
    let timer: any;
    if (isOpen) {
      setCanClose(false);
      setSecondsRemaining(5);
      timer = setInterval(() => {
        setSecondsRemaining((s) => {
          if (s <= 1) {
            setCanClose(true);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen || isVip) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden text-slate-100 shadow-2xl flex flex-col">
        {/* Top Header with Close Countdown */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Sponsored Interstitial
          </span>

          {canClose ? (
            <button
              onClick={onClose}
              className="py-1 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Skip Ad</span>
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="text-xs text-slate-400 font-mono">
              Reward / Skip in {secondsRemaining}s
            </div>
          )}
        </div>

        {/* Hero Ad Creative */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950">
          <img
            src="https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80"
            alt="Orange Money SL"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />
        </div>

        {/* Ad Body */}
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Orange Money Sierra Leone</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fast, secure, and instant mobile transfers across all 16 districts. Use Orange Money to send safe date escrow gifts or top up your Salone Connect VIP pass for just $2/mo.
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={() => {
                alert('Dialing *144# on Orange Sierra Leone network...');
                onClose();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition-transform active:scale-[0.99]"
            >
              <span>Open Orange Money (*144#)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {canClose && (
              <button
                onClick={onClose}
                className="py-3 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
              >
                Close Ad
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
