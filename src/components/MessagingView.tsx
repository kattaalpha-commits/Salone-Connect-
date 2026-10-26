import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Message, ChatEscrow } from '../types';
import { BannerAd } from './BannerAd';
import {
  Send,
  Video,
  ShieldCheck,
  Mic,
  MoreVertical,
  Flag,
  Ban,
  Sparkles,
  Lock,
  ArrowLeft,
  CheckCheck,
  Crown,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Download,
  AlertTriangle,
  Camera,
  Coins,
  Check,
  HelpCircle,
  X,
} from 'lucide-react';

interface MessagingViewProps {
  currentUser: UserProfile;
  matches: UserProfile[];
  activeMatch: UserProfile | null;
  onSelectMatch: (match: UserProfile) => void;
  messages: Message[];
  onSendMessage: (
    receiverId: string,
    text: string,
    isVoice?: boolean,
    mediaUrl?: string,
    isViewOnce?: boolean,
    escrow?: ChatEscrow
  ) => void;
  onStartVideoCall: (profile: UserProfile) => void;
  onOpenReport: (profile: UserProfile) => void;
  onBlock: (profile: UserProfile) => void;
  messagesSentToday: number;
  maxFreeDailyMessages: number;
  onOpenPremium: (reason: string) => void;
  isVip: boolean;
  onTriggerScreenshot: (targetMatchId: string) => void;
}

export const MessagingView: React.FC<MessagingViewProps> = ({
  currentUser,
  matches,
  activeMatch,
  onSelectMatch,
  messages,
  onSendMessage,
  onStartVideoCall,
  onOpenReport,
  onBlock,
  messagesSentToday,
  maxFreeDailyMessages,
  onOpenPremium,
  isVip,
  onTriggerScreenshot,
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [isViewOnceEnabled, setIsViewOnceEnabled] = useState(false);
  const [activeMediaUrl, setActiveMediaUrl] = useState<string | null>(null);
  const [viewOnceModalUrl, setViewOnceModalUrl] = useState<string | null>(null);
  const [openedViewOnceIds, setOpenedViewOnceIds] = useState<string[]>([]);
  const [showEscrowModal, setShowEscrowModal] = useState(false);
  const [escrowAmount, setEscrowAmount] = useState('200');
  const [escrowPurpose, setEscrowPurpose] = useState('Date Dinner Reservation');
  const [escrowStatusMap, setEscrowStatusMap] = useState<Record<string, 'held' | 'released'>>({});

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recordingTimerRef = useRef<any>(null);

  const remainingDailyMessages = Math.max(0, maxFreeDailyMessages - messagesSentToday);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeMatch]);

  const activeMessages = activeMatch
    ? messages.filter(
        (m) =>
          (m.senderId === currentUser.id && m.receiverId === activeMatch.id) ||
          (m.senderId === activeMatch.id && m.receiverId === currentUser.id)
      )
    : [];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeMatch) return;
    if (!inputText.trim() && !activeMediaUrl) return;

    if (!isVip && messagesSentToday >= maxFreeDailyMessages) {
      onOpenPremium('You have reached the free tier limit of 2 messages per day. Upgrade to Salone Connect VIP for unlimited messaging!');
      return;
    }

    onSendMessage(
      activeMatch.id,
      inputText.trim() || (isViewOnceEnabled ? '📷 View Once Photo' : '📷 Shared Photo'),
      false,
      activeMediaUrl || undefined,
      isViewOnceEnabled
    );

    setInputText('');
    setActiveMediaUrl(null);
    setIsViewOnceEnabled(false);
  };

  const handleStartVoiceRecording = () => {
    if (!isVip && messagesSentToday >= maxFreeDailyMessages) {
      onOpenPremium('Daily free message quota reached (2/2 sent today). Upgrade to VIP to send voice notes!');
      return;
    }
    setIsRecordingVoice(true);
    setRecordingSeconds(0);
    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const handleStopAndSendVoice = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setIsRecordingVoice(false);
    if (!activeMatch) return;

    const durationStr = `0:${recordingSeconds < 10 ? '0' : ''}${recordingSeconds || 3}`;
    onSendMessage(activeMatch.id, `🎙️ Salone Voice Note (${durationStr})`, true);
    setRecordingSeconds(0);
  };

  const handleCancelVoice = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setIsRecordingVoice(false);
    setRecordingSeconds(0);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setActiveMediaUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenViewOnce = (msgId: string, url: string) => {
    if (openedViewOnceIds.includes(msgId)) return;
    setViewOnceModalUrl(url);
    setOpenedViewOnceIds((prev) => [...prev, msgId]);
  };

  const handleCreateEscrow = () => {
    if (!activeMatch) return;
    const amount = parseInt(escrowAmount, 10) || 200;
    const escrowObj: ChatEscrow = {
      id: `escrow-${Date.now()}`,
      amountNLe: amount,
      purpose: escrowPurpose,
      status: 'held',
      senderId: currentUser.id,
      receiverId: activeMatch.id,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onSendMessage(
      activeMatch.id,
      `🔒 Safe Date Escrow Created: NLe ${amount.toLocaleString()} for "${escrowPurpose}". Funds are held securely until confirmed.`,
      false,
      undefined,
      false,
      escrowObj
    );
    setShowEscrowModal(false);
  };

  const handleReleaseEscrow = (escrowId: string) => {
    setEscrowStatusMap((prev) => ({ ...prev, [escrowId]: 'released' }));
    if (activeMatch) {
      onSendMessage(
        activeMatch.id,
        `✅ Escrow Released! The funds have been safely disbursed to ${activeMatch.name} via Orange/Afrimoney.`,
        false
      );
    }
  };

  const downloadImage = (url: string, filename = 'salone_connect_photo.jpg') => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const culturalIcebreakers = [
    'Aw di bodi? 👋 So glad we connected under the Lion Mountains!',
    'I see you love Cassava Leaf! Who makes the best in your family? 🍲',
    'Are you team Lumley Beach or team Bureh Beach for weekend chill? 🏖️',
    'If we do our first virtual date, what are we cooking? 👩‍🍳',
  ];

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-[550px] max-w-6xl mx-auto w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
      {/* Left Column: Matches List */}
      <div
        className={`w-full md:w-80 border-r border-slate-800 bg-slate-950 flex flex-col ${
          activeMatch ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-white text-base">Your Matches</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
              {matches.length}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Private chats are only unlocked after a mutual match.
          </p>

          {!isVip && (
            <div className="mt-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Daily Messages:</span>
              <span className={`font-semibold ${remainingDailyMessages > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {remainingDailyMessages} of {maxFreeDailyMessages} left
              </span>
            </div>
          )}
        </div>

        {/* Matches Feed */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
          {matches.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-slate-500">
                <Lock className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-300 font-medium">No Matches Yet</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Explore profiles in the Discover tab to unlock mutual matches and private chats.
              </p>
            </div>
          ) : (
            matches.map((match) => {
              const isSelected = activeMatch?.id === match.id;
              const lastMsg = messages
                .filter(
                  (m) =>
                    (m.senderId === currentUser.id && m.receiverId === match.id) ||
                    (m.senderId === match.id && m.receiverId === currentUser.id)
                )
                .slice(-1)[0];

              // Locked Secret Match mechanic
              const isLocked = match.isLockedMatch && !isVip;

              return (
                <button
                  key={match.id}
                  onClick={() => {
                    if (isLocked) {
                      onOpenPremium('This is a Locked Secret Match! Upgrade to VIP for $2/mo to unlock and chat.');
                      return;
                    }
                    onSelectMatch(match);
                  }}
                  className={`w-full p-3.5 flex items-center gap-3 text-left transition-colors relative ${
                    isSelected ? 'bg-slate-800/80 border-l-2 border-emerald-500' : 'hover:bg-slate-900/60'
                  }`}
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-700">
                    <img
                      src={match.photos[0]}
                      alt={match.name}
                      className={`w-full h-full object-cover ${isLocked ? 'filter blur-md' : ''}`}
                      referrerPolicy="no-referrer"
                    />
                    {isLocked ? (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-amber-400">
                        <Lock className="w-4 h-4" />
                      </div>
                    ) : match.isVerified && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border border-slate-950 flex items-center justify-center text-white">
                        <ShieldCheck className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-xs text-white truncate">
                        {isLocked ? 'Locked Secret Match' : match.name}
                      </span>
                      {lastMsg && !isLocked && (
                        <span className="text-[10px] text-slate-500">{lastMsg.timestamp}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {isLocked
                        ? '🔒 Tap to unlock with VIP'
                        : lastMsg
                        ? lastMsg.text
                        : `Matched with you · ${match.locationCity}`}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Inline Banner Ad in Chats */}
        <div className="p-2 border-t border-slate-800">
          <BannerAd placement="chats_inline" isVip={isVip} onUpgradeVip={() => onOpenPremium('Remove ads with VIP!')} />
        </div>
      </div>

      {/* Right Column: Active Conversation */}
      <div className={`flex-1 flex flex-col bg-slate-900 ${!activeMatch ? 'hidden md:flex' : 'flex'}`}>
        {activeMatch ? (
          <>
            {/* Chat Top Header */}
            <div className="h-16 px-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onSelectMatch(null as any)}
                  className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
                  aria-label="Back to matches"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-700">
                  <img
                    src={activeMatch.photos[0]}
                    alt={activeMatch.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {activeMatch.isVerified && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border border-slate-900" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-white">{activeMatch.name}</h4>
                    {activeMatch.isVerified && (
                      <span className="text-emerald-400 text-xs flex items-center gap-0.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {activeMatch.district || activeMatch.locationCity} · {activeMatch.religion || 'Sierra Leone'}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Virtual Date, Escrow & Menu */}
              <div className="flex items-center gap-2">
                {/* Private Chat Escrow button */}
                <button
                  onClick={() => setShowEscrowModal(true)}
                  className="py-1.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  title="Send Safe Date Escrow"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Date Escrow</span>
                </button>

                <button
                  onClick={() => onStartVideoCall(activeMatch)}
                  className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                  title="Start Virtual Video Date"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Virtual Date</span>
                </button>

                {/* Screenshot Trigger Button (To simulate or test screenshot detection) */}
                <button
                  onClick={() => onTriggerScreenshot(activeMatch.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Simulate screenshot detection"
                  aria-label="Screenshot trigger"
                >
                  <Camera className="w-4 h-4" />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    aria-label="Chat options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {showOptionsDropdown && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-slate-950 border border-slate-800 rounded-xl shadow-xl py-1 z-30">
                      <button
                        onClick={() => {
                          setShowOptionsDropdown(false);
                          setShowEscrowModal(true);
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-amber-300 hover:bg-amber-500/10 flex items-center gap-2"
                      >
                        <Coins className="w-3.5 h-3.5" /> Safe Date Escrow
                      </button>
                      <button
                        onClick={() => {
                          setShowOptionsDropdown(false);
                          onOpenReport(activeMatch);
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                      >
                        <Flag className="w-3.5 h-3.5" /> Report Profile
                      </button>
                      <button
                        onClick={() => {
                          setShowOptionsDropdown(false);
                          onBlock(activeMatch);
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                      >
                        <Ban className="w-3.5 h-3.5" /> Block User
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* MANDATORY FINANCIAL CAUTION BANNER */}
            <div className="bg-amber-950/40 border-b border-amber-500/30 px-4 py-2 flex items-center gap-2.5 text-xs text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-[11px] leading-snug">
                <strong>Financial Safety Warning:</strong> Never share your Orange Money, Afrimoney, or QMoney PIN codes or banking credentials with anyone.
              </p>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Cultural Icebreakers Suggestions */}
              {activeMessages.length === 0 && (
                <div className="space-y-2 py-4">
                  <p className="text-xs text-center text-slate-400">
                    Break the ice with authentic Sierra Leonean starters:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto">
                    {culturalIcebreakers.map((starter, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSendMessage(activeMatch.id, starter)}
                        className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-emerald-950/40 border border-slate-700 hover:border-emerald-500/50 text-left text-xs text-slate-300 hover:text-emerald-300 transition-colors"
                      >
                        {starter}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages Feed */}
              {activeMessages.map((msg) => {
                const isMine = msg.senderId === currentUser.id;

                // Screenshot notification bubble
                if (msg.isScreenshotNotice) {
                  return (
                    <div key={msg.id} className="flex justify-center my-2">
                      <div className="px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-amber-500/40 text-[11px] text-amber-300 flex items-center gap-2 shadow">
                        <Camera className="w-3.5 h-3.5" />
                        <span>{msg.text}</span>
                      </div>
                    </div>
                  );
                }

                // Escrow transaction bubble
                if (msg.escrow) {
                  const escrowStatus = escrowStatusMap[msg.escrow.id] || msg.escrow.status;
                  return (
                    <div key={msg.id} className="max-w-md mx-auto my-2 w-full">
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/40 space-y-2.5 shadow-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                            <Coins className="w-4 h-4" /> Private Chat Escrow
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                            {escrowStatus}
                          </span>
                        </div>

                        <div>
                          <div className="text-lg font-black text-white font-mono">
                            NLe {msg.escrow.amountNLe.toLocaleString()}
                          </div>
                          <p className="text-xs text-slate-300 mt-0.5">{msg.escrow.purpose}</p>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-snug">
                          Held securely in Salone Connect Escrow. Funds are released when verified by the sender.
                        </p>

                        {isMine && escrowStatus === 'held' && (
                          <button
                            onClick={() => handleReleaseEscrow(msg.escrow!.id)}
                            className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" /> Release Escrow Funds to {activeMatch.name}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                }

                const isViewOnceMsg = msg.isViewOnce;
                const isOpened = openedViewOnceIds.includes(msg.id) || msg.viewOnceOpened;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow ${
                        isMine
                          ? 'bg-emerald-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/60'
                      }`}
                    >
                      {/* VIEW ONCE PHOTO BUBBLE */}
                      {isViewOnceMsg ? (
                        <div className="space-y-1.5">
                          {isOpened ? (
                            <div className="flex items-center gap-2 text-slate-300 text-xs py-1">
                              <EyeOff className="w-4 h-4 text-slate-400" />
                              <span className="italic">Opened · View Once Photo</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleOpenViewOnce(msg.id, msg.mediaUrl || msg.text)}
                              className="flex items-center gap-2 p-2 rounded-xl bg-black/30 hover:bg-black/50 text-white font-bold transition-colors border border-white/20"
                            >
                              <Eye className="w-4 h-4 text-emerald-300 animate-pulse" />
                              <span>View Once Photo (Tap to Open)</span>
                            </button>
                          )}
                        </div>
                      ) : msg.mediaUrl ? (
                        /* REGULAR PHOTO ATTACHMENT WITH SAVE OPTION */
                        <div className="space-y-2">
                          <div className="rounded-xl overflow-hidden max-h-60 relative group">
                            <img
                              src={msg.mediaUrl}
                              alt="attachment"
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => downloadImage(msg.mediaUrl!)}
                              className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-black text-white text-[10px] flex items-center gap-1 opacity-90 hover:opacity-100 transition-opacity"
                              title="Save photo"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Save</span>
                            </button>
                          </div>
                          {msg.text && !msg.text.startsWith('📷') && <p>{msg.text}</p>}
                        </div>
                      ) : msg.isVoiceNote ? (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-black/20 flex items-center justify-center">
                            <Mic className="w-3.5 h-3.5" />
                          </div>
                          <span>{msg.text}</span>
                        </div>
                      ) : (
                        <span>{msg.text}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1 px-1">
                      <span>{msg.timestamp}</span>
                      {isMine && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Photo Preview Strip before sending */}
            {activeMediaUrl && (
              <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700 relative">
                    <img src={activeMediaUrl} alt="preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-white">Photo Ready to Send</span>
                    <label className="flex items-center gap-1.5 mt-0.5 text-[11px] text-amber-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isViewOnceEnabled}
                        onChange={(e) => setIsViewOnceEnabled(e.target.checked)}
                        className="w-3.5 h-3.5 accent-amber-500 rounded"
                      />
                      <span>Send as View Once (Self-Destruct)</span>
                    </label>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveMediaUrl(null);
                    setIsViewOnceEnabled(false);
                  }}
                  className="p-1 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Chat Input Bar with 2 Daily Messages Indicator */}
            <div className="p-3 border-t border-slate-800 bg-slate-950 space-y-2">
              {!isVip && (
                <div className="flex items-center justify-between text-[11px] px-2 text-slate-400">
                  <span>
                    Free plan:{' '}
                    <strong className={remainingDailyMessages > 0 ? 'text-emerald-400' : 'text-amber-400'}>
                      {remainingDailyMessages} of {maxFreeDailyMessages} messages remaining today
                    </strong>
                  </span>
                  <button
                    onClick={() => onOpenPremium('Unlock unlimited daily messages with Salone Connect VIP!')}
                    className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Crown className="w-3 h-3" /> Upgrade $2/mo
                  </button>
                </div>
              )}

              {isRecordingVoice ? (
                <div className="flex items-center justify-between p-2 rounded-2xl bg-rose-950/40 border border-rose-800/50">
                  <div className="flex items-center gap-2 text-rose-400 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span>Recording Voice Note... 0:0{recordingSeconds}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCancelVoice}
                      className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleStopAndSendVoice}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold"
                    >
                      Send Note
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                    title="Send photo"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={handleStartVoiceRecording}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                    title="Record voice note"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      !isVip && remainingDailyMessages === 0
                        ? 'Daily free messages limit reached. Upgrade to VIP to send...'
                        : 'Type a message (e.g. Kusheh! How was your day?)...'
                    }
                    className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim() && !activeMediaUrl}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition-all shadow-md active:scale-95"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white">Select a Match to Chat</h3>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Sierra Leonean dating is built on mutual respect and shared culture. Exchange private messages, photos, view-once media, or set up a secure date escrow.
            </p>
          </div>
        )}
      </div>

      {/* VIEW ONCE FULLSCREEN MODAL */}
      {viewOnceModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-md w-full text-center space-y-4">
            <div className="flex items-center justify-between text-xs text-amber-300">
              <span className="flex items-center gap-1.5 font-bold">
                <Eye className="w-4 h-4" /> View Once Photo
              </span>
              <span className="text-slate-400">Will disappear once closed</span>
            </div>
            <div className="rounded-3xl overflow-hidden border-2 border-amber-500/50 shadow-2xl bg-black">
              <img src={viewOnceModalUrl} alt="view once" className="w-full h-auto max-h-[75vh] object-contain" />
            </div>
            <button
              onClick={() => setViewOnceModalUrl(null)}
              className="py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
            >
              Close & Self-Destruct
            </button>
          </div>
        </div>
      )}

      {/* PRIVATE CHAT ESCROW MODAL */}
      {showEscrowModal && activeMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl space-y-4">
            <button
              onClick={() => setShowEscrowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Create Safe Date Escrow</h3>
                <p className="text-xs text-slate-400">Strictly private 1-on-1 thread feature</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Safely hold funds in escrow for a dinner date reservation, gift package, or taxi assistance with {activeMatch.name}. Funds are only released once you confirm!
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Escrow Purpose</label>
                <input
                  type="text"
                  value={escrowPurpose}
                  onChange={(e) => setEscrowPurpose(e.target.value)}
                  placeholder="e.g. Dinner Date Reservation at Bintumani"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Amount in Sierra Leone Leones (NLe)
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {['100', '200', '500'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setEscrowAmount(amt)}
                      className={`py-2 rounded-xl border text-xs font-bold transition-colors ${
                        escrowAmount === amt
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-slate-800/40 border-slate-700 text-slate-300'
                      }`}
                    >
                      NLe {amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={escrowAmount}
                  onChange={(e) => setEscrowAmount(e.target.value)}
                  placeholder="Custom amount"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              onClick={handleCreateEscrow}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Lock className="w-4 h-4" /> Deposit NLe {escrowAmount} to Escrow
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
