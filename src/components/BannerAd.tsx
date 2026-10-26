import React from 'react';
import { ExternalLink, Sparkles, X } from 'lucide-react';

interface BannerAdProps {
  placement: 'discover_bottom' | 'chats_inline';
  isVip: boolean;
  onUpgradeVip?: () => void;
}

const AD_CREATIVES = [
  {
    title: 'Orange Money Sierra Leone',
    subtitle: 'Zero transaction fees on local merchant payments & mobile data.',
    cta: 'Dial *144#',
    tag: 'Sponsored',
    bgGradient: 'from-amber-950/60 to-slate-900',
    borderColor: 'border-amber-500/30',
    accentText: 'text-amber-400',
  },
  {
    title: 'Bintumani Hotel & Rooftop Bar',
    subtitle: 'Plan your dream sunset date overlooking the Lion Mountains.',
    cta: 'Reserve Table',
    tag: 'Sponsored',
    bgGradient: 'from-emerald-950/60 to-slate-900',
    borderColor: 'border-emerald-500/30',
    accentText: 'text-emerald-400',
  },
  {
    title: 'Afrimoney Fast Cash',
    subtitle: 'Send money to your family and dates anywhere across Salone.',
    cta: 'Dial *161#',
    tag: 'Sponsored',
    bgGradient: 'from-blue-950/60 to-slate-900',
    borderColor: 'border-blue-500/30',
    accentText: 'text-blue-400',
  },
];

export const BannerAd: React.FC<BannerAdProps> = ({ placement, isVip, onUpgradeVip }) => {
  // Never show ads to VIP subscribers
  if (isVip) return null;

  // Pick ad based on placement
  const creative = placement === 'discover_bottom' ? AD_CREATIVES[0] : AD_CREATIVES[1];

  return (
    <div
      className={`w-full rounded-2xl bg-gradient-to-r ${creative.bgGradient} border ${creative.borderColor} p-3 sm:p-3.5 shadow-lg my-2 transition-all relative overflow-hidden`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-black/40 text-slate-300 border border-white/10">
              {creative.tag}
            </span>
            <h4 className={`text-xs font-bold ${creative.accentText} truncate`}>
              {creative.title}
            </h4>
          </div>
          <p className="text-[11px] text-slate-300 truncate leading-snug">
            {creative.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => alert(`Redirecting to ${creative.title} partner service...`)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-semibold border border-slate-700 flex items-center gap-1 transition-colors"
          >
            <span>{creative.cta}</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>

          {onUpgradeVip && (
            <button
              onClick={onUpgradeVip}
              className="text-[10px] text-slate-400 hover:text-amber-300 underline"
              title="Remove ads with VIP"
            >
              Hide Ads
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
