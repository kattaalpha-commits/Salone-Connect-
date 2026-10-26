import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  Message,
  MatchNotification,
  FilterSettings,
  ReportTicket,
  AdSettings,
  AdStats,
  SponsoredProfileCard,
  ChatEscrow,
} from './types';
import {
  INITIAL_PROFILES,
  DEFAULT_CURRENT_USER,
  DEFAULT_FILTER_SETTINGS,
  DEFAULT_AD_SETTINGS,
  DEFAULT_AD_STATS,
  SPONSORED_CARDS,
  calculateCulturalMatch,
} from './data/mockProfiles';
import { DiscoveryCard } from './components/DiscoveryCard';
import { ProfileDetailModal } from './components/ProfileDetailModal';
import { MatchCelebrationModal } from './components/MatchCelebrationModal';
import { MessagingView } from './components/MessagingView';
import { VirtualVideoDateModal } from './components/VirtualVideoDateModal';
import { FiltersModal } from './components/FiltersModal';
import { PremiumModal } from './components/PremiumModal';
import { LikesView } from './components/LikesView';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { SafetyReportModal } from './components/SafetyReportModal';
import { ProfileSettingsModal } from './components/ProfileSettingsModal';
import { PhotoVerificationModal } from './components/PhotoVerificationModal';
import { OnboardingModal } from './components/OnboardingModal';
import { BannerAd } from './components/BannerAd';
import { RewardedAdModal } from './components/RewardedAdModal';
import { InterstitialAdModal } from './components/InterstitialAdModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { PilotTestModal } from './components/PilotTestModal';
import { ShareModal } from './components/ShareModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { SplashScreen } from './components/SplashScreen';
import {
  Flame,
  MessageCircle,
  Heart,
  SlidersHorizontal,
  Bell,
  Crown,
  ShieldCheck,
  RotateCcw,
  User,
  Sparkles,
  Mountain,
  Lock,
  BarChart3,
  Gift,
  Calendar,
  AlertTriangle,
  Smartphone,
  Share2,
} from 'lucide-react';

const MAX_FREE_SWIPES_PER_DAY = 10;
const MAX_FREE_MATCHES = 3;
const MAX_FREE_DAILY_MESSAGES = 2;

export default function App() {
  // 1. Persistent State with safe image path sanitization for all devices
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('salone_connect_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          photos: (parsed.photos || []).map((p: string) => p.replace('/src/assets/images/', '/images/')),
        };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_CURRENT_USER;
  });

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('salone_connect_onboarded') === 'true';
  });

  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('salone_connect_profiles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: UserProfile) => ({
            ...item,
            photos: (item.photos || []).map((p: string) => p.replace('/src/assets/images/', '/images/')),
          }));
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_PROFILES;
  });

  const [likedUserIds, setLikedUserIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('salone_connect_likes');
    return saved ? JSON.parse(saved) : [];
  });

  const [passedUserIds, setPassedUserIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('salone_connect_passes');
    return saved ? JSON.parse(saved) : [];
  });

  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('salone_connect_blocked');
    return saved ? JSON.parse(saved) : [];
  });

  // Daily quotas & Ad tracking
  const [swipesUsedToday, setSwipesUsedToday] = useState<number>(() => {
    const saved = localStorage.getItem('salone_swipes_today');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [messagesSentToday, setMessagesSentToday] = useState<number>(() => {
    const saved = localStorage.getItem('salone_msgs_today');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [interstitialCountToday, setInterstitialCountToday] = useState<number>(0);
  const [swipeCountSinceLastInterstitial, setSwipeCountSinceLastInterstitial] = useState<number>(0);

  // Ad Settings & Stats
  const [adSettings, setAdSettings] = useState<AdSettings>(() => {
    const saved = localStorage.getItem('salone_ad_settings');
    return saved ? JSON.parse(saved) : DEFAULT_AD_SETTINGS;
  });

  const [adStats, setAdStats] = useState<AdStats>(() => {
    const saved = localStorage.getItem('salone_ad_stats');
    return saved ? JSON.parse(saved) : DEFAULT_AD_STATS;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('salone_connect_messages');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'msg-init-1',
        matchId: 'user-aminata',
        senderId: 'user-aminata',
        receiverId: 'current-user-1',
        text: 'Kusheh! I saw you love hiking the Lion Mountains and eating Cassava Leaf too! Welcome to Salone Connect 😊',
        timestamp: '10:30 AM',
        isRead: true,
      },
    ];
  });

  const [notifications, setNotifications] = useState<MatchNotification[]>(() => {
    const saved = localStorage.getItem('salone_connect_notifs');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'notif-trial-1',
        type: 'verification',
        title: 'Free 2-Week VIP Trial Active',
        description: 'You have 14 days of complimentary VIP access. Enjoy unlimited matching and zero ads!',
        timestamp: 'Just now',
        read: false,
      },
      {
        id: 'notif-2',
        type: 'match',
        title: 'New Match on Lion Mountains!',
        description: 'You and Aminata Kamara matched with 96% cultural affinity.',
        timestamp: '15m ago',
        read: false,
      },
    ];
  });

  const [filters, setFilters] = useState<FilterSettings>(() => {
    const saved = localStorage.getItem('salone_connect_filters');
    return saved ? JSON.parse(saved) : DEFAULT_FILTER_SETTINGS;
  });

  const [pushEnabled, setPushEnabled] = useState(false);

  // 2. Navigation State
  const [activeTab, setActiveTab] = useState<'discover' | 'messages' | 'likes' | 'safety'>('discover');
  const [activeChatMatch, setActiveChatMatch] = useState<UserProfile | null>(null);

  // 3. Modals State
  const [selectedProfileForDetails, setSelectedProfileForDetails] = useState<UserProfile | null>(null);
  const [latestMutualMatch, setLatestMutualMatch] = useState<UserProfile | null>(null);
  const [videoCallPartner, setVideoCallPartner] = useState<UserProfile | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [premiumTriggerReason, setPremiumTriggerReason] = useState<string | undefined>(undefined);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSafetyReportOpen, setIsSafetyReportOpen] = useState(false);
  const [reportTargetProfile, setReportTargetProfile] = useState<UserProfile | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPhotoVerifyOpen, setIsPhotoVerifyOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(!hasCompletedOnboarding);
  const [isRewardedAdOpen, setIsRewardedAdOpen] = useState(false);
  const [isInterstitialAdOpen, setIsInterstitialAdOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isPilotTestOpen, setIsPilotTestOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  // 2-week trial calculation
  const now = new Date();
  const trialExpiryDate = currentUser.trialExpiresAt ? new Date(currentUser.trialExpiresAt) : new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const isTrialActive = currentUser.isTrialActive ?? (trialExpiryDate > now);
  const trialDaysRemaining = Math.max(0, Math.ceil((trialExpiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  // If user is either paid subscriber OR trial is active, treat as VIP for limits & ads
  const isVip = !!currentUser.isPremium || isTrialActive;

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('salone_connect_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('salone_connect_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('salone_connect_likes', JSON.stringify(likedUserIds));
  }, [likedUserIds]);

  useEffect(() => {
    localStorage.setItem('salone_connect_passes', JSON.stringify(passedUserIds));
  }, [passedUserIds]);

  useEffect(() => {
    localStorage.setItem('salone_connect_blocked', JSON.stringify(blockedUserIds));
  }, [blockedUserIds]);

  useEffect(() => {
    localStorage.setItem('salone_swipes_today', swipesUsedToday.toString());
  }, [swipesUsedToday]);

  useEffect(() => {
    localStorage.setItem('salone_msgs_today', messagesSentToday.toString());
  }, [messagesSentToday]);

  useEffect(() => {
    localStorage.setItem('salone_connect_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('salone_connect_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('salone_ad_settings', JSON.stringify(adSettings));
  }, [adSettings]);

  useEffect(() => {
    localStorage.setItem('salone_ad_stats', JSON.stringify(adStats));
  }, [adStats]);

  // Matches list calculation
  const matches = profiles.filter(
    (p) => likedUserIds.includes(p.id) && (p.hasLikedCurrentUser || p.isMatch) && !blockedUserIds.includes(p.id)
  );

  // Filtered Discovery Feed
  const availableDiscoveryProfiles = profiles.filter((p) => {
    if (p.id === currentUser.id) return false;
    if (blockedUserIds.includes(p.id)) return false;
    if (passedUserIds.includes(p.id)) return false;
    if (likedUserIds.includes(p.id)) return false;

    if (p.age < filters.minAge || p.age > filters.maxAge) return false;
    if (filters.seeking === 'men' && p.gender !== 'man') return false;
    if (filters.seeking === 'women' && p.gender !== 'woman') return false;
    if (filters.region !== 'all' && p.region !== filters.region) return false;
    if (filters.verifiedOnly && !p.isVerified) return false;

    if (filters.dialects.length > 0) {
      const hasDialect = p.culturalHeritage.dialects.some((d) => filters.dialects.includes(d));
      if (!hasDialect) return false;
    }

    if (filters.dishes.length > 0) {
      if (!filters.dishes.includes(p.culturalHeritage.favoriteDish)) return false;
    }

    return true;
  });

  // Native ad injection every 3 cards if enabled and not VIP
  const showNativeAd = adSettings.nativeAdsEnabled && !isVip && swipesUsedToday > 0 && swipesUsedToday % 4 === 0;
  const currentSponsoredCard = showNativeAd ? SPONSORED_CARDS[swipesUsedToday % SPONSORED_CARDS.length] : null;

  const currentProfile = availableDiscoveryProfiles[0] || null;

  const openPremiumWithReason = (reason: string) => {
    setPremiumTriggerReason(reason);
    setIsPremiumOpen(true);
  };

  // Check interstitial trigger
  const checkInterstitialAdTrigger = () => {
    if (isVip || !adSettings.interstitialAdsEnabled) return;

    const nextCount = swipeCountSinceLastInterstitial + 1;
    setSwipeCountSinceLastInterstitial(nextCount);

    if (nextCount >= adSettings.interstitialFrequencySwipes && interstitialCountToday < adSettings.maxDailyInterstitials) {
      setIsInterstitialAdOpen(true);
      setSwipeCountSinceLastInterstitial(0);
      setInterstitialCountToday((prev) => prev + 1);
    }
  };

  // Discovery Action Handlers
  const handleLike = (targetProfile?: UserProfile) => {
    const profileToLike = targetProfile || currentProfile;
    if (!profileToLike) return;

    if (!isVip && swipesUsedToday >= MAX_FREE_SWIPES_PER_DAY) {
      openPremiumWithReason(
        'You have used your 10 free daily profile trials. Upgrade to Salone Connect VIP starting at $2/mo (NLe 46) or watch a rewarded video for extra swipes!'
      );
      return;
    }

    setSwipesUsedToday((prev) => prev + 1);
    checkInterstitialAdTrigger();
    setLikedUserIds((prev) => [...prev, profileToLike.id]);

    const willBeMatch = profileToLike.hasLikedCurrentUser || profileToLike.isMatch;

    if (willBeMatch) {
      // Check Locked Secret Match Mechanic
      if (!isVip && matches.length >= MAX_FREE_MATCHES) {
        // Create as a LOCKED secret match
        profileToLike.isLockedMatch = true;
        setNotifications((prev) => [
          {
            id: `notif-secret-${Date.now()}`,
            type: 'match',
            title: '🔒 Secret Match Locked!',
            description: `You and ${profileToLike.name} matched! Upgrade to VIP for $2/mo to unlock and chat.`,
            timestamp: 'Just now',
            read: false,
            actionUserId: profileToLike.id,
          },
          ...prev,
        ]);
        openPremiumWithReason(
          `You unlocked a Secret Match! Free tier allows ${MAX_FREE_MATCHES} active matches. Upgrade to VIP ($2/mo) to unlock your match with ${profileToLike.name}.`
        );
      } else {
        setLatestMutualMatch(profileToLike);
        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}`,
            type: 'match',
            title: 'New Mutual Match!',
            description: `You and ${profileToLike.name} matched! Send a private message or start a virtual date.`,
            timestamp: 'Just now',
            read: false,
            actionUserId: profileToLike.id,
          },
          ...prev,
        ]);
      }
    }
  };

  const handlePass = (targetProfile?: UserProfile) => {
    const profileToPass = targetProfile || currentProfile;
    if (!profileToPass) return;

    if (!isVip && swipesUsedToday >= MAX_FREE_SWIPES_PER_DAY) {
      openPremiumWithReason(
        'You have reached your 10 free daily trials. Upgrade to VIP for $2/mo or watch a video ad!'
      );
      return;
    }

    setSwipesUsedToday((prev) => prev + 1);
    checkInterstitialAdTrigger();
    setPassedUserIds((prev) => [...prev, profileToPass.id]);
  };

  const handleSuperLike = () => {
    if (!currentProfile) return;
    if (!isVip && swipesUsedToday >= MAX_FREE_SWIPES_PER_DAY) {
      openPremiumWithReason('Daily free trials used. Upgrade to VIP for unlimited super likes / Padi boost!');
      return;
    }
    currentProfile.hasLikedCurrentUser = true;
    handleLike(currentProfile);
  };

  const handleRewind = () => {
    if (!isVip) {
      openPremiumWithReason('Rewind is a VIP feature. Upgrade to undo accidental passes!');
      return;
    }
    if (passedUserIds.length > 0) {
      const lastPassed = passedUserIds[passedUserIds.length - 1];
      setPassedUserIds((prev) => prev.filter((id) => id !== lastPassed));
    }
  };

  // Messaging with Escrow, View-Once & Screenshot detection
  const handleSendMessage = (
    receiverId: string,
    text: string,
    isVoice?: boolean,
    mediaUrl?: string,
    isViewOnce?: boolean,
    escrow?: ChatEscrow
  ) => {
    if (!isVip && messagesSentToday >= MAX_FREE_DAILY_MESSAGES) {
      openPremiumWithReason(
        'Daily limit reached: Free accounts can send 2 messages per day. Upgrade to Salone Connect VIP for $2/mo or watch an ad for 10 extra messages!'
      );
      return;
    }

    setMessagesSentToday((prev) => prev + 1);

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      matchId: receiverId,
      senderId: currentUser.id,
      receiverId,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isVoiceNote: isVoice,
      mediaUrl,
      isViewOnce,
      escrow,
      isRead: true,
    };
    setMessages((prev) => [...prev, newMsg]);

    // Simulated authentic reply
    setTimeout(() => {
      const partner = profiles.find((p) => p.id === receiverId);
      if (!partner) return;

      const responses = [
        `Kusheh! So glad to hear from you! How is your day in the Lion Mountains going? 😊`,
        `Ah true! Honestly nothing beats fresh cassava leaf and Bureh beach. When are we hopping on a virtual date?`,
        `I appreciate your message! It is so nice meeting someone who shares our Salone pride.`,
        `Haha yes! Sunday cookouts with family are top tier. What are your weekend plans?`,
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];

      const replyMsg: Message = {
        id: `msg-reply-${Date.now()}`,
        matchId: receiverId,
        senderId: receiverId,
        receiverId: currentUser.id,
        text: randomReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1800);
  };

  // Screenshot Detection Event trigger
  const handleTriggerScreenshot = (targetMatchId: string) => {
    const noticeMsg: Message = {
      id: `msg-screen-${Date.now()}`,
      matchId: targetMatchId,
      senderId: currentUser.id,
      receiverId: targetMatchId,
      text: `${currentUser.name} took a screenshot of the chat!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isScreenshotNotice: true,
      screenshotBy: currentUser.name,
      isRead: true,
    };
    setMessages((prev) => [...prev, noticeMsg]);

    setNotifications((prev) => [
      {
        id: `notif-screen-${Date.now()}`,
        type: 'screenshot',
        title: '📸 Screenshot Notice',
        description: `${currentUser.name} took a screenshot of your private chat thread.`,
        timestamp: 'Just now',
        read: false,
      },
      ...prev,
    ]);
  };

  // Rewarded Ad claim
  const handleClaimReward = (rewardType: 'swipes' | 'messages' | 'boost') => {
    if (rewardType === 'swipes') {
      setSwipesUsedToday((prev) => Math.max(0, prev - 5));
    } else if (rewardType === 'messages') {
      setMessagesSentToday((prev) => Math.max(0, prev - 10));
    } else if (rewardType === 'boost') {
      setCurrentUser((prev) => ({ ...prev, isSpotlight: true }));
    }

    setAdStats((prev) => ({
      ...prev,
      rewardedCompleted: prev.rewardedCompleted + 1,
      totalRevenueUSD: prev.totalRevenueUSD + 0.15,
      impressions: prev.impressions + 1,
    }));
  };

  const handleBlockUser = (profile: UserProfile) => {
    setBlockedUserIds((prev) => [...prev, profile.id]);
    setSelectedProfileForDetails(null);
    if (activeChatMatch?.id === profile.id) {
      setActiveChatMatch(null);
    }
  };

  const handleUnblockUser = (id: string) => {
    setBlockedUserIds((prev) => prev.filter((x) => x !== id));
  };

  const handleUpgradeToPremium = (plan: 'local_2' | 'monthly_5' | 'quarterly_20' | 'annual_50') => {
    setCurrentUser((prev) => ({
      ...prev,
      isPremium: true,
      premiumTier: plan,
      isSpotlight: true,
    }));
    setPremiumTriggerReason(undefined);

    // Unlocking any locked matches
    setProfiles((prev) => prev.map((p) => ({ ...p, isLockedMatch: false })));
  };

  const handleCancelPremium = () => {
    setCurrentUser((prev) => ({
      ...prev,
      isPremium: false,
      isTrialActive: false,
      premiumTier: undefined,
      isSpotlight: false,
    }));
  };

  const handleOnboardingComplete = (completedUser: UserProfile) => {
    setCurrentUser(completedUser);
    setHasCompletedOnboarding(true);
    localStorage.setItem('salone_connect_onboarded', 'true');
    setIsOnboardingOpen(false);
    setLikedUserIds(['user-aminata']);
  };

  const admirers = profiles.filter(
    (p) => p.hasLikedCurrentUser && !blockedUserIds.includes(p.id) && p.id !== currentUser.id
  );

  const unreadNotifCount = notifications.filter((n) => !n.read).length;
  const remainingDailySwipes = Math.max(0, MAX_FREE_SWIPES_PER_DAY - swipesUsedToday);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white relative">
      {/* Mobile App Splash Screen */}
      {showSplashScreen && (
        <SplashScreen onDismiss={() => setShowSplashScreen(false)} />
      )}

      {/* Lion Mountains Atmospheric Backdrop */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0 overflow-hidden">
        <img
          src="/images/lion_mountains_backdrop_1792926329183.jpg"
          alt="Sierra Leone Lion Mountains backdrop"
          className="w-full h-full object-cover filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950" />
      </div>

      {/* 3-ZONE TOP BAR CONTRACT */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('discover');
              }}
              className="text-lg sm:text-xl font-black tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 flex items-center justify-center text-white shadow-md">
                <Mountain className="w-4 h-4 fill-current" />
              </div>
              <span className="flex items-center gap-1.5">
                <span>Salone Connect</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hidden sm:inline">
                  Lion Mountains
                </span>
              </span>
            </a>
          </div>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-300">
            <button
              onClick={() => setActiveTab('discover')}
              className={`hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'discover' ? 'text-emerald-400 font-semibold' : ''
              }`}
            >
              <Flame className="w-4 h-4" /> Discover
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'messages' ? 'text-emerald-400 font-semibold' : ''
              }`}
            >
              <MessageCircle className="w-4 h-4" /> Chats ({matches.length})
            </button>
            <button
              onClick={() => setActiveTab('likes')}
              className={`hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'likes' ? 'text-emerald-400 font-semibold' : ''
              }`}
            >
              <Heart className="w-4 h-4" /> Admirers ({admirers.length})
            </button>
            <button
              onClick={() => setIsFiltersOpen(true)}
              className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-4 h-4" /> Discovery Filters
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <User className="w-4 h-4" /> My Profile
            </button>
          </nav>

          {/* Zone 3: Actions, Share & Pilot Testing */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Share App with Testers */}
            <button
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/35 text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Share App with Testers (WhatsApp, SMS, QR)"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Share</span>
            </button>

            {/* PWA / WebAPK One-Click Install */}
            <PWAInstallButton onOpenPilotHub={() => setIsPilotTestOpen(true)} />

            {/* Pilot Testing & APK Hub launcher button */}
            <button
              onClick={() => setIsPilotTestOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 border border-slate-700 text-xs font-semibold transition-all shadow-sm"
              title="Launch Pilot Testing & APK Hub"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pilot APK</span>
            </button>

            {/* Rewarded Video Ad trigger */}
            <button
              onClick={() => setIsRewardedAdOpen(true)}
              className="hidden xl:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold transition-colors"
              title="Watch ad for free swipes"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Free Boost</span>
            </button>

            {/* Admin Console shortcut for admin user kattaalpha@gmail.com */}
            <button
              onClick={() => setIsAdminDashboardOpen(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
              title="Admin & Ads Console"
            >
              <BarChart3 className="w-4 h-4" />
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
              )}
            </button>

            {/* VIP Pass / Upgrade CTA */}
            {isVip ? (
              <button
                onClick={() => {
                  setPremiumTriggerReason(undefined);
                  setIsPremiumOpen(true);
                }}
                className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>{currentUser.isPremium ? 'VIP Active' : 'Trial Active (Free)'}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setPremiumTriggerReason(undefined);
                  setIsPremiumOpen(true);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md shadow-emerald-950 flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Crown className="w-3.5 h-3.5 text-amber-300" /> VIP from $2
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Trust & 14-Day Free Trial Notice Banner */}
      <div className="relative z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 py-1.5 px-4 text-center text-[11px] text-slate-300 flex flex-wrap items-center justify-center gap-2">
        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
          <Mountain className="w-3.5 h-3.5" /> 16 Districts & Diaspora
        </span>
        <span className="text-slate-600">·</span>
        <span>Faith, Education & Occupation Verified</span>
        <span className="text-slate-600">·</span>
        {isTrialActive && !currentUser.isPremium ? (
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Free 2-Week Trial: {trialDaysRemaining} days remaining
          </span>
        ) : !isVip ? (
          <span className="text-amber-400 font-semibold">
            Free Plan: {remainingDailySwipes} trials left · Plans start at $2 (NLe 46) via Orange/Afrimoney
          </span>
        ) : (
          <span className="text-amber-400 font-semibold">VIP Pass Active · 100% Ad-Free</span>
        )}
        <span className="text-slate-600">·</span>
        <button
          onClick={() => setIsShareOpen(true)}
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 hover:bg-emerald-500/30 transition-all text-[10px] cursor-pointer"
        >
          <Share2 className="w-3 h-3" /> Share with Testers
        </button>
        <span className="text-slate-600">·</span>
        <button
          onClick={() => setIsPilotTestOpen(true)}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700 hover:bg-slate-700 transition-all text-[10px] cursor-pointer"
        >
          <Smartphone className="w-3 h-3" /> Pilot APK & Tests
        </button>
      </div>

      {/* MAIN VIEWPORT */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full p-3 sm:p-6 pb-28 md:pb-8 flex flex-col justify-center">
        {/* TAB 1: DISCOVER FEED */}
        {activeTab === 'discover' && (
          <div className="w-full max-w-md mx-auto space-y-4">
            {/* Filter Pill Controls Bar */}
            <div className="flex items-center justify-between text-xs px-2">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="font-semibold text-white">
                  {filters.region === 'all'
                    ? 'All 16 Districts & Diaspora'
                    : filters.region === 'freetown'
                    ? 'Freetown & Western Area'
                    : filters.region === 'provinces'
                    ? 'Provinces (Bo, Makeni, etc)'
                    : `${filters.region.toUpperCase()} Diaspora`}
                </span>
                <span className="text-slate-600">·</span>
                <span>{availableDiscoveryProfiles.length} Profiles</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRewind}
                  className={`flex items-center gap-1 text-slate-400 hover:text-white transition-colors ${
                    !isVip ? 'opacity-70' : ''
                  }`}
                  title="Rewind last pass"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Rewind</span>
                </button>
                <button
                  onClick={() => setIsFiltersOpen(true)}
                  className="flex items-center gap-1 text-emerald-400 hover:underline font-semibold"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Free Tier Trials Warning */}
            {!isVip && remainingDailySwipes === 0 && (
              <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-300">
                  <Lock className="w-4 h-4" /> 10 Daily Free Trials Reached
                </div>
                <p className="text-[11px] text-slate-300">
                  Upgrade to Salone Connect VIP starting at $2/mo (NLe 46) or watch a quick 15s video for 5 extra swipes!
                </p>
                <div className="flex gap-2 justify-center pt-1">
                  <button
                    onClick={() => setIsRewardedAdOpen(true)}
                    className="py-1.5 px-3 bg-slate-800 text-white font-semibold text-xs rounded-xl"
                  >
                    Watch Ad (+5 Swipes)
                  </button>
                  <button
                    onClick={() => openPremiumWithReason('Unlock unlimited daily trials starting at $2/mo!')}
                    className="py-1.5 px-3 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
                  >
                    Upgrade $2/mo
                  </button>
                </div>
              </div>
            )}

            {/* Native Sponsored Card or Profile Card */}
            {currentSponsoredCard ? (
              <DiscoveryCard
                sponsoredCard={currentSponsoredCard}
                onPass={() => handlePass()}
                onLike={() => alert(`Visiting ${currentSponsoredCard.brandName}...`)}
              />
            ) : currentProfile ? (
              <DiscoveryCard
                profile={currentProfile}
                culturalScore={calculateCulturalMatch(currentUser, currentProfile)}
                onLike={() => handleLike()}
                onPass={() => handlePass()}
                onSuperLike={handleSuperLike}
                onOpenDetails={() => setSelectedProfileForDetails(currentProfile)}
                remainingTrials={!isVip ? remainingDailySwipes : undefined}
              />
            ) : (
              <div className="p-10 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-4 shadow-xl backdrop-blur-md">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <Mountain className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">All Profiles Explored!</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                    You've reached the peak of current profiles across all 16 districts. Check your matches, expand filters, or reset the stack.
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2 max-w-xs mx-auto">
                  <button
                    onClick={() => {
                      setPassedUserIds([]);
                      setLikedUserIds([]);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors"
                  >
                    Reset Profile Stack
                  </button>
                  <button
                    onClick={() => setIsFiltersOpen(true)}
                    className="w-full py-2 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
                  >
                    Expand Location Distance
                  </button>
                </div>
              </div>
            )}

            {/* Non-intrusive Banner Ad at Bottom of Discover */}
            <BannerAd placement="discover_bottom" isVip={isVip} onUpgradeVip={() => openPremiumWithReason('Remove all ads with VIP!')} />
          </div>
        )}

        {/* TAB 2: SECURE PRIVATE MESSAGING */}
        {activeTab === 'messages' && (
          <MessagingView
            currentUser={currentUser}
            matches={matches}
            activeMatch={activeChatMatch}
            onSelectMatch={(m) => setActiveChatMatch(m)}
            messages={messages}
            onSendMessage={handleSendMessage}
            onStartVideoCall={(profile) => setVideoCallPartner(profile)}
            onOpenReport={(profile) => {
              setReportTargetProfile(profile);
              setIsSafetyReportOpen(true);
            }}
            onBlock={(profile) => handleBlockUser(profile)}
            messagesSentToday={messagesSentToday}
            maxFreeDailyMessages={MAX_FREE_DAILY_MESSAGES}
            onOpenPremium={(reason) => openPremiumWithReason(reason)}
            isVip={isVip}
            onTriggerScreenshot={handleTriggerScreenshot}
          />
        )}

        {/* TAB 3: WHO LIKED YOU / ADMIRERS */}
        {activeTab === 'likes' && (
          <LikesView
            likers={admirers}
            isPremium={isVip}
            onOpenPremium={() => openPremiumWithReason('See all admirers with Salone Connect VIP!')}
            onMatchUser={(profile) => {
              handleLike(profile);
              setActiveChatMatch(profile);
              setActiveTab('messages');
            }}
            onViewProfile={(profile) => setSelectedProfileForDetails(profile)}
          />
        )}

        {/* TAB 4: SAFETY, GEO-FENCING & COMMUNITY TRUST */}
        {activeTab === 'safety' && (
          <div className="max-w-2xl mx-auto w-full space-y-4">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Trust, Safety & Anti-Scam Shield</h3>
                  <p className="text-xs text-slate-400">
                    A safe, photo-verified community across all 16 Sierra Leonean districts and diaspora.
                  </p>
                </div>
              </div>

              {/* Financial Caution */}
              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-amber-300">Mandatory Financial Warning</h5>
                  <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                    Never send money directly or share your Orange Money, Afrimoney, or QMoney PIN codes with anyone. Use the private chat Escrow feature for date reservations.
                  </p>
                </div>
              </div>

              {/* Anti-Scam Geo-Restrictions */}
              <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700 text-xs space-y-1.5">
                <h5 className="font-bold text-white">Strict Anti-Scam Geo-Fencing</h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Accounts originating from high-risk phone prefixes (+234, +91, +880) and unauthorized proxy IP ranges are strictly blocked from registration.
                </p>
              </div>

              {/* Support Contact */}
              <div className="p-3.5 rounded-2xl bg-slate-800/30 border border-slate-700 text-xs space-y-1">
                <h5 className="font-bold text-slate-300">Official Support & Safety Contact</h5>
                <p className="text-[11px] text-slate-400">
                  Email: <a href="mailto:kattaalpha@gmail.com" className="text-emerald-400 hover:underline">kattaalpha@gmail.com</a> · WhatsApp: <a href="tel:+23280181162" className="text-emerald-400 hover:underline">+23280181162</a>
                </p>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setIsPhotoVerifyOpen(true)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
                >
                  Verify My Profile Photo
                </button>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="py-2.5 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
                >
                  Manage Blocked Users
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 h-16 pb-safe grid grid-cols-5 items-center px-1">
        <button
          onClick={() => setActiveTab('discover')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] ${
            activeTab === 'discover' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Discover</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] relative ${
            activeTab === 'messages' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageCircle className="w-5 h-5" />
          {matches.length > 0 && (
            <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-emerald-500" />
          )}
          <span className="text-[10px] font-medium tracking-tight mt-1">Chats</span>
        </button>

        <button
          onClick={() => setActiveTab('likes')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] ${
            activeTab === 'likes' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Admirers</span>
        </button>

        <button
          onClick={() => setIsShareOpen(true)}
          className="flex flex-col items-center justify-center h-full min-h-[44px] text-emerald-400 hover:text-emerald-300 active:scale-95 transition-transform"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight mt-1">Share</span>
        </button>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex flex-col items-center justify-center h-full min-h-[44px] text-slate-400 hover:text-white"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Profile</span>
        </button>
      </nav>

      {/* MODALS & DRAWERS */}
      {/* 1. Onboarding with 16 Districts, Religion, Education, Occupation, Homecoming */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleOnboardingComplete}
        initialUser={currentUser}
      />

      {/* 2. Profile Details Modal */}
      <ProfileDetailModal
        profile={selectedProfileForDetails}
        isOpen={!!selectedProfileForDetails}
        onClose={() => setSelectedProfileForDetails(null)}
        onLike={(p) => {
          handleLike(p);
          setSelectedProfileForDetails(null);
        }}
        onPass={(p) => {
          handlePass(p);
          setSelectedProfileForDetails(null);
        }}
        onStartVideoCall={(p) => {
          setSelectedProfileForDetails(null);
          setVideoCallPartner(p);
        }}
        onOpenReport={(p) => {
          setReportTargetProfile(p);
          setIsSafetyReportOpen(true);
        }}
        onBlock={(p) => handleBlockUser(p)}
        isMatched={selectedProfileForDetails ? likedUserIds.includes(selectedProfileForDetails.id) && selectedProfileForDetails.hasLikedCurrentUser : false}
      />

      {/* 3. Mutual Match Celebration Modal */}
      <MatchCelebrationModal
        matchedProfile={latestMutualMatch}
        currentUser={currentUser}
        isOpen={!!latestMutualMatch}
        onClose={() => setLatestMutualMatch(null)}
        onStartChat={(p) => {
          setActiveChatMatch(p);
          setActiveTab('messages');
          setLatestMutualMatch(null);
        }}
        onStartVideoDate={(p) => {
          setVideoCallPartner(p);
          setLatestMutualMatch(null);
        }}
      />

      {/* 4. Integrated Virtual Video Date Modal */}
      <VirtualVideoDateModal
        partner={videoCallPartner}
        isOpen={!!videoCallPartner}
        onClose={() => setVideoCallPartner(null)}
      />

      {/* 5. Discovery Filters Modal */}
      <FiltersModal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        filters={filters}
        onUpdateFilters={(newFilters) => setFilters(newFilters)}
        isPremiumUser={isVip}
        onOpenPremium={() => {
          setIsFiltersOpen(false);
          openPremiumWithReason('Unlock VIP advanced filters from $2/mo!');
        }}
      />

      {/* 6. Premium Subscription VIP Modal ($2 to $50 plans, Orange Money & Cards) */}
      <PremiumModal
        isOpen={isPremiumOpen}
        onClose={() => {
          setIsPremiumOpen(false);
          setPremiumTriggerReason(undefined);
        }}
        isPremium={!!currentUser.isPremium}
        isTrialActive={isTrialActive}
        trialDaysRemaining={trialDaysRemaining}
        onUpgrade={handleUpgradeToPremium}
        onCancelSubscription={handleCancelPremium}
        triggerReason={premiumTriggerReason}
      />

      {/* 7. Push Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        onSelectNotification={(n) => {
          if (n.actionUserId) {
            const partner = profiles.find((p) => p.id === n.actionUserId);
            if (partner) {
              setActiveChatMatch(partner);
              setActiveTab('messages');
            }
          }
          setIsNotificationsOpen(false);
        }}
        pushEnabled={pushEnabled}
        onTogglePush={() => setPushEnabled(!pushEnabled)}
      />

      {/* 8. Safety & Reporting Modal */}
      <SafetyReportModal
        profile={reportTargetProfile}
        isOpen={isSafetyReportOpen}
        onClose={() => {
          setIsSafetyReportOpen(false);
          setReportTargetProfile(null);
        }}
        onSubmitReport={(ticket) => {
          setNotifications((prev) => [
            {
              id: `notif-rep-${Date.now()}`,
              type: 'verification',
              title: 'Report Received',
              description: `Our safety team is reviewing your report regarding ${ticket.targetUserName}.`,
              timestamp: 'Just now',
              read: false,
            },
            ...prev,
          ]);
        }}
        onBlockUser={(p) => handleBlockUser(p)}
      />

      {/* 9. Profile & Settings Modal with 10 photos manager */}
      <ProfileSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(updated) => setCurrentUser(updated)}
        onOpenVerification={() => setIsPhotoVerifyOpen(true)}
        onOpenPremium={() => {
          setPremiumTriggerReason(undefined);
          setIsPremiumOpen(true);
        }}
        onOpenPilotHub={() => setIsPilotTestOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        blockedUsers={blockedUserIds}
        onUnblockUser={handleUnblockUser}
        allProfiles={profiles}
      />

      {/* 10. Photo Verification Biometric Pose Modal */}
      <PhotoVerificationModal
        isOpen={isPhotoVerifyOpen}
        onClose={() => setIsPhotoVerifyOpen(false)}
        onVerified={(photo) => {
          setCurrentUser((prev) => ({
            ...prev,
            isVerified: true,
            photos: photo.startsWith('data:') ? [photo, ...prev.photos.slice(0, 9)] : prev.photos,
          }));
          setNotifications((prev) => [
            {
              id: `notif-verify-${Date.now()}`,
              type: 'verification',
              title: 'Verification Badge Granted',
              description: 'Your photo pose has been authenticated with the Sierra Leone Verified Shield.',
              timestamp: 'Just now',
              read: false,
            },
            ...prev,
          ]);
        }}
      />

      {/* 11. Rewarded Video Ad Modal */}
      <RewardedAdModal
        isOpen={isRewardedAdOpen}
        onClose={() => setIsRewardedAdOpen(false)}
        onRewardClaimed={handleClaimReward}
      />

      {/* 12. Interstitial Ad Modal (Every 20 swipes, max 3/day) */}
      <InterstitialAdModal
        isOpen={isInterstitialAdOpen}
        onClose={() => setIsInterstitialAdOpen(false)}
        isVip={isVip}
      />

      {/* 13. Admin Dashboard & Monetisation Console */}
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        adSettings={adSettings}
        onUpdateAdSettings={(updated) => setAdSettings(updated)}
        adStats={adStats}
      />

      {/* 14. Pilot Testing & APK Launcher Hub */}
      <PilotTestModal
        isOpen={isPilotTestOpen}
        onClose={() => setIsPilotTestOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(updated) => setCurrentUser((prev) => ({ ...prev, ...updated }))}
        onPreviewSplash={() => setShowSplashScreen(true)}
        onOpenShare={() => {
          setIsPilotTestOpen(false);
          setIsShareOpen(true);
        }}
        onResetQuota={() => {
          setSwipesUsedToday(0);
          setMessagesSentToday(0);
          localStorage.removeItem('salone_swipes_today');
          localStorage.removeItem('salone_msgs_today');
          alert('Pilot daily quotas reset! You now have 10 fresh trial swipes.');
        }}
      />

      {/* 15. Share & Invite Testers Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        onOpenPilotHub={() => setIsPilotTestOpen(true)}
      />

      {/* 16. Offline Connectivity Indicator */}
      <OfflineIndicator />
    </div>
  );
}
