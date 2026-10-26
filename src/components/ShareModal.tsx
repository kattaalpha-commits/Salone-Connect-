import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import {
  Share2,
  Copy,
  Check,
  QrCode,
  Smartphone,
  Download,
  ExternalLink,
  Globe,
  Mail,
  AlertTriangle,
  X,
  Link2,
  Users,
  Mountain,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPilotHub?: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  onOpenPilotHub,
}) => {
  // Live default preview URL (Google AI Studio preview link or current domain)
  const defaultUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://ais-pre-s3cj2t4yy667ngiz3tlq7s-606344511533.europe-west3.run.app';

  const [shareUrl, setShareUrl] = useState<string>(() => {
    return localStorage.getItem('salone_connect_custom_share_url') || defaultUrl;
  });
  const [isEditingUrl, setIsEditingUrl] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>(shareUrl);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedMessage, setCopiedMessage] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'share' | 'qr' | 'deploy_guide'>('share');
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Invite text crafted culturally for Sierra Leone & Diaspora
  const inviteMessageText = `🇸🇱 Kushe! Join me on Salone Connect Dating – the premier matchmaking app for Sierra Leoneans at home across all 16 districts and in the Diaspora.\n\n✨ Features:\n• Photo-verified profiles & 100% scam-free\n• District & Homecoming matchers\n• Lion Mountains virtual video dates & private chats\n• Mobile Money (Orange Money, Afrimoney) & Card support\n\n👉 Test the live pilot app here:\n${shareUrl}`;

  // Generate QR Code whenever shareUrl changes or modal opens
  useEffect(() => {
    if (isOpen && shareUrl) {
      QRCode.toDataURL(shareUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#020617',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error('Failed to generate QR:', err));
    }
  }, [isOpen, shareUrl]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyInviteMessage = async () => {
    try {
      await navigator.clipboard.writeText(inviteMessageText);
      setCopiedMessage(true);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    }
  };

  // Native Web Share API (Triggers native Android/iOS share drawer)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Salone Connect Dating - Pilot Test',
          text: '🇸🇱 Join me on Salone Connect Dating – matchmaking for Sierra Leone & Diaspora!',
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share dismissed or failed:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  // Direct Social Share URLs
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(inviteMessageText);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent('🇸🇱 Join Salone Connect Dating Pilot!')}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent('🇸🇱 Test Salone Connect Dating - Lion Mountains Matches & Cultural Dating for Sierra Leoneans:')}&url=${encodedUrl}`;
  const smsUrl = `sms:?&body=${encodeURIComponent(`🇸🇱 Kushe! Test the new Salone Connect Dating app here: ${shareUrl}`)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent('Invitation to test Salone Connect Dating 🇸🇱')}&body=${encodeURIComponent(inviteMessageText)}`;

  // Save custom public URL
  const handleSaveCustomUrl = () => {
    let clean = customInput.trim();
    if (clean && !clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = `https://${clean}`;
    }
    if (clean) {
      setShareUrl(clean);
      localStorage.setItem('salone_connect_custom_share_url', clean);
    }
    setIsEditingUrl(false);
  };

  const handleResetToDefaultUrl = () => {
    setShareUrl(defaultUrl);
    setCustomInput(defaultUrl);
    localStorage.removeItem('salone_connect_custom_share_url');
    setIsEditingUrl(false);
  };

  // Download QR Code as an image for posters / WhatsApp status
  const handleDownloadQrImage = () => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = 'salone-connect-pilot-qr.png';
    link.click();
  };

  const isSandboxedRunApp = shareUrl.includes('.run.app');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-b border-slate-800 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Mountain className="w-3 h-3" /> Pilot Distribution
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Free Tester Access</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Share2 className="w-6 h-6 text-emerald-400" />
              Share App with Testers
            </h2>
            <p className="text-xs text-slate-300">
              Invite friends, family, and pilot testers in Sierra Leone and the Diaspora with 1 click.
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

        {/* Tab Controls */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-4 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('share')}
            className={`py-3 px-3 font-semibold whitespace-nowrap border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'share'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            1-Click Share
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
            onClick={() => setActiveTab('deploy_guide')}
            className={`py-3 px-3 font-semibold whitespace-nowrap border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'deploy_guide'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Public Free Link (Fix 403)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-slate-200 text-xs">
          {/* Share Link Banner & Custom URL Switcher */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-emerald-400" />
                Active Tester URL
              </span>
              <button
                onClick={() => setIsEditingUrl(!isEditingUrl)}
                className="text-[11px] text-emerald-400 hover:underline font-medium"
              >
                {isEditingUrl ? 'Cancel' : 'Change to Custom Public URL'}
              </button>
            </div>

            {isEditingUrl ? (
              <div className="space-y-2 pt-1">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="https://salone-connect.vercel.app"
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleSaveCustomUrl}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors"
                  >
                    Save
                  </button>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Enter your public Vercel/Netlify link to share without 403 errors.</span>
                  <button
                    onClick={handleResetToDefaultUrl}
                    className="text-slate-400 hover:text-slate-200 underline"
                  >
                    Reset
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-2.5 rounded-xl border border-slate-800">
                <span className="font-mono text-emerald-300 truncate flex-1 select-all">
                  {shareUrl}
                </span>
                <button
                  onClick={handleCopyLink}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                    copiedLink
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Link
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Warning if still on private Google Cloud run.app URL */}
            {isSandboxedRunApp && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <div className="space-y-0.5 text-[11px]">
                  <p className="font-semibold text-amber-200">
                    Important Note for External Testers:
                  </p>
                  <p className="text-amber-300/90 leading-relaxed">
                    Google AI Studio development URLs (<code className="font-mono text-xs">*.run.app</code>) require collaborator login and cause <strong>403 Access Denied</strong> for external phones. To share with anyone with ZERO login, deploy in 30 seconds to Vercel/Netlify using the <strong>Public Free Link</strong> tab!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* TAB 1: 1-Click Share Actions */}
          {activeTab === 'share' && (
            <div className="space-y-4">
              {/* Native Mobile Share Sheet */}
              <button
                onClick={handleNativeShare}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2.5 transition-all active:scale-[0.99]"
              >
                <Share2 className="w-4 h-4" />
                Open Native Phone Share Sheet (WhatsApp, SMS, etc.)
              </button>

              {/* Direct Channel Buttons Grid */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Quick Share to Messaging Apps
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* WhatsApp */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-white flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow group-hover:scale-110 transition-transform">
                      <span className="text-sm font-bold">WA</span>
                    </div>
                    <span className="font-bold text-xs text-[#25D366]">WhatsApp</span>
                    <span className="text-[10px] text-slate-400">Friends & Family</span>
                  </a>

                  {/* SMS / Text */}
                  <a
                    href={smsUrl}
                    className="p-3 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-white flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shadow group-hover:scale-110 transition-transform">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-blue-400">SMS Message</span>
                    <span className="text-[10px] text-slate-400">Direct phone</span>
                  </a>

                  {/* Telegram */}
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#0088cc]/15 hover:bg-[#0088cc]/25 border border-[#0088cc]/30 text-white flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#0088cc] flex items-center justify-center text-white shadow group-hover:scale-110 transition-transform">
                      <span className="text-sm font-bold">TG</span>
                    </div>
                    <span className="font-bold text-xs text-[#0088cc]">Telegram</span>
                    <span className="text-[10px] text-slate-400">Diaspora groups</span>
                  </a>

                  {/* Email */}
                  <a
                    href={emailUrl}
                    className="p-3 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-white flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white shadow group-hover:scale-110 transition-transform">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-purple-300">Email Invite</span>
                    <span className="text-[10px] text-slate-400">Formal tester</span>
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 flex items-center justify-center gap-2 transition-colors text-center"
                  >
                    <span className="font-bold text-blue-400">Facebook</span>
                    <span className="text-[10px] text-slate-400">Share to Feed</span>
                  </a>
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 flex items-center justify-center gap-2 transition-colors text-center"
                  >
                    <span className="font-bold text-sky-400">X / Twitter</span>
                    <span className="text-[10px] text-slate-400">Post link</span>
                  </a>
                </div>
              </div>

              {/* Ready-to-Send Invitation Message Card */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Pre-Written Cultural Invite Message
                  </span>
                  <button
                    onClick={handleCopyInviteMessage}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                      copiedMessage
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
                    }`}
                  >
                    {copiedMessage ? (
                      <>
                        <Check className="w-3 h-3" /> Copied Text!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy Message
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-sans text-xs text-slate-300 whitespace-pre-line leading-relaxed select-all">
                  {inviteMessageText}
                </div>
              </div>

              {/* Instructions for testers */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 space-y-2">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  What to Tell Your Testers:
                </span>
                <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                  <li>
                    <strong>On Android</strong>: Open link in Chrome and tap <em>"Add to Home Screen"</em> or the in-app <em>"Install APK"</em> button to get a full-screen standalone app with splash screen.
                  </li>
                  <li>
                    <strong>On iPhone</strong>: Open link in Safari, tap the <em>Share</em> button (square with arrow), and choose <em>"Add to Home Screen"</em>.
                  </li>
                  <li>
                    <strong>No Play Store needed</strong>: Installs directly as a high-performance WebAPK!
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: Scan Phone QR Code */}
          {activeTab === 'qr' && (
            <div className="space-y-5 text-center">
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl inline-flex flex-col items-center justify-center mx-auto shadow-2xl">
                {qrCodeDataUrl ? (
                  <div className="p-3 bg-white rounded-2xl shadow-inner">
                    <img
                      src={qrCodeDataUrl}
                      alt="Salone Connect Pilot QR Code"
                      className="w-56 h-56 object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-56 h-56 bg-slate-800 rounded-2xl flex items-center justify-center animate-pulse">
                    <QrCode className="w-12 h-12 text-slate-600" />
                  </div>
                )}

                <div className="mt-4 space-y-1">
                  <div className="text-white font-bold text-sm flex items-center justify-center gap-1.5">
                    <Mountain className="w-4 h-4 text-emerald-400" />
                    <span>Salone Connect Dating Pilot</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Scan with any phone camera (Android or iOS) to open directly.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleDownloadQrImage}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-2 border border-slate-700 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  Download QR Code Image
                </button>
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 transition-colors shadow-md"
                >
                  <Copy className="w-4 h-4" />
                  {copiedLink ? 'Copied!' : 'Copy Direct URL'}
                </button>
              </div>

              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Tip: You can print this QR code or post it on your WhatsApp Status and Instagram stories so friends can scan and test instantly.
              </p>
            </div>
          )}

          {/* TAB 3: Public Free Link (Fix 403) Guide */}
          {activeTab === 'deploy_guide' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-800/40 to-slate-900 border border-blue-500/30 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                  <Globe className="w-4 h-4" />
                  Why Google AI Studio Gives Testers "403 Access Denied"
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Development URLs on <code className="font-mono text-emerald-400">*.run.app</code> are protected by Google Cloud IAM security policies. External testers cannot open them without being added as project collaborators.
                </p>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Deploying to <strong>Vercel</strong> or <strong>Netlify</strong> takes less than 60 seconds and produces a public link (e.g., <code className="font-mono text-emerald-300">salone-connect.vercel.app</code>) that anyone in Sierra Leone or abroad can open with <strong>zero login</strong>!
                </p>
              </div>

              {/* 30-Second Drag-and-Drop Method */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black">
                      1
                    </span>
                    Method A: Netlify Drop (30-Sec Drag & Drop, No GitHub)
                  </span>
                  <a
                    href="https://app.netlify.com/drop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                  >
                    Open Netlify Drop <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-xs">
                  <li>Run <code className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-emerald-400">npm run build</code> in the project.</li>
                  <li>Open <a href="https://app.netlify.com/drop" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">app.netlify.com/drop</a> in your browser.</li>
                  <li>Drag the compiled <code className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-amber-300">dist/</code> folder into the browser window.</li>
                  <li>Netlify deploys it instantly and gives you a free public link like <code className="font-mono text-emerald-300">https://salone-connect.netlify.app</code>.</li>
                  <li>Paste that link into the <strong>Active Tester URL</strong> box above to update all QR codes and WhatsApp invites!</li>
                </ol>
              </div>

              {/* Vercel Method */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black">
                      2
                    </span>
                    Method B: Vercel GitHub Import (Auto-updating)
                  </span>
                  <a
                    href="https://vercel.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                  >
                    Visit Vercel <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-xs">
                  <li>Push your codebase to GitHub.</li>
                  <li>Log in to <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">vercel.com</a> and click <strong>"Add New" &gt; "Project"</strong>.</li>
                  <li>Select your repo; Vercel automatically detects the generated <code className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-emerald-400">vercel.json</code> and builds the Vite SPA.</li>
                  <li>Click <strong>Deploy</strong> to get a fast, global URL like <code className="font-mono text-emerald-300">salone-connect.vercel.app</code>.</li>
                </ol>
              </div>

              {onOpenPilotHub && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenPilotHub();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold border border-slate-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <Smartphone className="w-4 h-4" />
                  Open Pilot Hub for Bubblewrap Standalone APK Builder
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Pilot Test Distribution Ready</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
