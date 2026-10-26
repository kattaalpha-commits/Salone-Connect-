import React, { useState } from 'react';
import { AdSettings, AdStats } from '../types';
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Eye,
  MousePointerClick,
  Sliders,
  CheckCircle,
  X,
  Mail,
  Phone,
  ShieldCheck,
  Globe,
  Layers,
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  adSettings: AdSettings;
  onUpdateAdSettings: (settings: AdSettings) => void;
  adStats: AdStats;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  adSettings,
  onUpdateAdSettings,
  adStats,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'controls' | 'networks' | 'safety'>('analytics');

  if (!isOpen) return null;

  const toggleNetwork = (net: 'admob' | 'meta' | 'direct_sl' | 'diaspora') => {
    const exists = adSettings.activeNetworks.includes(net);
    const updated = exists
      ? adSettings.activeNetworks.filter((n) => n !== net)
      : [...adSettings.activeNetworks, net];
    onUpdateAdSettings({ ...adSettings, activeNetworks: updated });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close admin dashboard"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Salone Connect Monetisation & Admin</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Live Admin Console
              </span>
            </div>
            <p className="text-xs text-slate-400">Ad placements, revenue analytics, and safety compliance</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 py-3 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              activeTab === 'analytics' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            Revenue Analytics
          </button>
          <button
            onClick={() => setActiveTab('controls')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              activeTab === 'controls' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ad Controls & Toggles
          </button>
          <button
            onClick={() => setActiveTab('networks')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              activeTab === 'networks' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ad Networks (AdMob / Direct)
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              activeTab === 'safety' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            Support & Geo-Fencing
          </button>
        </div>

        {/* TAB 1: REVENUE ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Total Ad Revenue</span>
                </div>
                <div className="text-xl font-black text-white font-mono">${adStats.totalRevenueUSD.toFixed(2)}</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">≈ NLe {(adStats.totalRevenueUSD * 23).toLocaleString()}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  <span>VIP Subscriptions</span>
                </div>
                <div className="text-xl font-black text-white font-mono">${adStats.subscriptionsRevenueUSD.toFixed(2)}</div>
                <div className="text-[10px] text-amber-400 mt-0.5">{adStats.subscriptionsCount} Active VIP Members</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Impressions</span>
                </div>
                <div className="text-xl font-black text-white font-mono">{adStats.impressions.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">eCPM: ${adStats.ecpmUSD}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <MousePointerClick className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span>Clicks & CTR</span>
                </div>
                <div className="text-xl font-black text-white font-mono">{adStats.clicks}</div>
                <div className="text-[10px] text-fuchsia-400 mt-0.5">{adStats.ctrPercent}% Click-through</div>
              </div>
            </div>

            {/* Performance breakdown */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700 space-y-3">
              <h4 className="text-xs font-bold text-white">Monetisation Channels Breakdown</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Local Sierra Leone VIP ($2 & $5 Plans via Orange/Africell)</span>
                  <span className="font-mono font-bold text-emerald-400">58% ($168.20)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Diaspora VIP ($20 & $50 Plans via Card/Stripe)</span>
                  <span className="font-mono font-bold text-emerald-400">42% ($121.80)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Rewarded Video Ads (Extra Swipes/Boosts)</span>
                  <span className="font-mono font-bold text-amber-400">118 Completed</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AD CONTROLS & TOGGLES */}
        {activeTab === 'controls' && (
          <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto">
            <p className="text-xs text-slate-400">
              Toggle specific ad formats on or off in real-time. Changes take effect immediately.
            </p>

            <div className="space-y-2.5">
              {[
                {
                  id: 'banner',
                  title: 'Banner Ads (Discover & Chats)',
                  desc: 'Displays non-intrusive sponsor banners at bottom of Discover and inline in Chats.',
                  checked: adSettings.bannerAdsEnabled,
                  toggle: () => onUpdateAdSettings({ ...adSettings, bannerAdsEnabled: !adSettings.bannerAdsEnabled }),
                },
                {
                  id: 'native',
                  title: 'Native Sponsored Profile Cards',
                  desc: 'Blends sponsored cards (hotels, telecom, travel) directly inside the discovery stack.',
                  checked: adSettings.nativeAdsEnabled,
                  toggle: () => onUpdateAdSettings({ ...adSettings, nativeAdsEnabled: !adSettings.nativeAdsEnabled }),
                },
                {
                  id: 'rewarded',
                  title: 'Rewarded Ads (15-30s Video)',
                  desc: 'Allows users to watch an ad in exchange for 5 extra swipes or 10 messages.',
                  checked: adSettings.rewardedAdsEnabled,
                  toggle: () => onUpdateAdSettings({ ...adSettings, rewardedAdsEnabled: !adSettings.rewardedAdsEnabled }),
                },
                {
                  id: 'interstitial',
                  title: 'Interstitial Full-Screen Ads',
                  desc: 'Shows full-screen ads after every 20 swipes (max 3/day per user, never in active chats).',
                  checked: adSettings.interstitialAdsEnabled,
                  toggle: () => onUpdateAdSettings({ ...adSettings, interstitialAdsEnabled: !adSettings.interstitialAdsEnabled }),
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-between gap-4"
                >
                  <div>
                    <h5 className="text-xs font-bold text-white">{item.title}</h5>
                    <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
                  </div>
                  <button
                    onClick={item.toggle}
                    className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                      item.checked ? 'bg-emerald-600' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform transform ${
                        item.checked ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: AD NETWORKS & EXPANSION */}
        {activeTab === 'networks' && (
          <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
            <p className="text-xs text-slate-400">
              Future-proof mediation engine supporting international ad networks and direct local Sierra Leone sponsors.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'direct_sl',
                  name: 'Direct Local SL Business Ads',
                  desc: 'Direct sponsors in Freetown & Provinces (Orange, Africell, Bintumani, Bureh Beach). Highest eCPM.',
                  status: 'Active (Direct Merchant)',
                },
                {
                  id: 'admob',
                  name: 'Google AdMob Network',
                  desc: 'Google Mobile Ads SDK banner and interstitial fallback fill.',
                  status: 'Configured & Ready',
                },
                {
                  id: 'meta',
                  name: 'Meta Audience Network',
                  desc: 'Facebook & Instagram targeted dating demand for African audiences.',
                  status: 'Standby / Fallback',
                },
                {
                  id: 'diaspora',
                  name: 'Diaspora Direct Promotions',
                  desc: 'UK & USA Sierra Leonean events, independence balls, flight deals.',
                  status: 'Active (Diaspora Hub)',
                },
              ].map((net) => {
                const active = adSettings.activeNetworks.includes(net.id as any);
                return (
                  <div
                    key={net.id}
                    onClick={() => toggleNetwork(net.id as any)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      active
                        ? 'bg-emerald-950/40 border-emerald-500/60'
                        : 'bg-slate-800/40 border-slate-700/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="text-xs font-bold text-white">{net.name}</h5>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {active ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">{net.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: SAFETY & GEO-FENCING */}
        {activeTab === 'safety' && (
          <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Geo-Fencing Anti-Scam Policy */}
            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <h4 className="text-xs font-bold text-rose-300">Anti-Scam Geo-Fencing Enforcement</h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                As part of Salone Connect strict trust standards, phone number prefixes and IP networks from known high-risk scam jurisdictions (<code className="text-rose-300">+234</code>, <code className="text-rose-300">+91</code>, <code className="text-rose-300">+880</code>) are automatically blocked from registration.
              </p>
            </div>

            {/* Official Support & Safety Contact Card */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2.5">
              <h4 className="text-xs font-bold text-white">Official Product & Safety Contacts</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Support Email: </span>
                  <a href="mailto:kattaalpha@gmail.com" className="text-emerald-400 font-mono hover:underline">
                    kattaalpha@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>WhatsApp / Direct Line: </span>
                  <a href="tel:+23280181162" className="text-emerald-400 font-mono hover:underline">
                    +23280181162
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
};
