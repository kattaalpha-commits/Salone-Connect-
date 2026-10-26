export type Gender = 'man' | 'woman' | 'non-binary';
export type Seeking = 'women' | 'men' | 'everyone';
export type RelationshipGoal =
  | 'long-term'
  | 'short-term'
  | 'friendship'
  | 'marriage'
  | 'casual';

export type Religion =
  | 'Christian (Protestant)'
  | 'Christian (Catholic)'
  | 'Christian (Pentecostal)'
  | 'Christian (Anglican)'
  | 'Muslim (Sunni)'
  | 'Muslim (Tijaniyyah)'
  | 'Muslim (Ahmadiyya)'
  | 'Traditional / Indigenous'
  | 'Spiritual'
  | 'Other'
  | 'Prefer not to say';

export type EducationLevel =
  | 'Secondary / High School'
  | 'Vocational / College Diploma'
  | 'University (Bachelor\'s)'
  | 'Postgraduate (Master\'s)'
  | 'Doctorate / Ph.D.'
  | 'Professional Certification';

export type ChildrenStatus =
  | 'Has kids & wants more'
  | 'Has kids & no more'
  | 'No kids but wants kids'
  | 'No kids & doesn\'t want kids';

export type PetPreference =
  | 'Has dog(s)'
  | 'Has cat(s)'
  | 'Pet lover'
  | 'No pets';

export type HabitFrequency = 'Frequently' | 'Sometimes' | 'Occasionally' | 'Never';

export interface LifestyleHabits {
  drinking: HabitFrequency;
  smoking: HabitFrequency;
  clubbing: HabitFrequency;
}

export interface HomecomingTravel {
  isPlanningTrip: boolean;
  arrivalMonth?: string;
  durationWeeks?: number;
  destinationDistrict?: string;
  note?: string;
}

export interface CulturalHeritage {
  dialects: string[];
  tribe?: string;
  favoriteDish: string;
  weekendVibe: string;
  musicStyle: string;
  saloneFact?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  seeking: Seeking;
  locationCity: string;
  locationCountry: string;
  district?: string; // One of 16 districts or Diaspora
  region: 'freetown' | 'provinces' | 'uk' | 'us' | 'canada' | 'other';
  distanceKm: number;
  bio: string;
  profession: string;
  companyOrEmployer?: string;
  religion?: Religion;
  educationLevel?: EducationLevel;
  schoolOrUniversity?: string;
  height?: string;
  photos: string[]; // Up to 10 photos
  isVerified: boolean;
  verificationBadgeType: 'photo_pose' | 'government_id' | 'none';
  culturalHeritage: CulturalHeritage;
  relationshipGoal: RelationshipGoal;
  interests: string[];
  footballClub?: string;
  childrenStatus?: ChildrenStatus;
  petPreference?: PetPreference;
  habits?: LifestyleHabits;
  homecoming?: HomecomingTravel;
  isPremium?: boolean;
  premiumTier?: 'local_2' | 'monthly_5' | 'quarterly_20' | 'annual_50';
  isTrialActive?: boolean;
  trialExpiresAt?: string;
  isSpotlight?: boolean;
  matchPercentage?: number;
  likedByCurrentUser?: boolean;
  passedByCurrentUser?: boolean;
  isMatch?: boolean;
  isLockedMatch?: boolean; // Locked Secret Match Mechanic
  hasLikedCurrentUser?: boolean;
}

export interface ChatEscrow {
  id: string;
  amountNLe: number;
  purpose: string; // e.g., 'Date Dinner Escrow', 'Taxi Fare Assistance', 'Gift Package'
  status: 'held' | 'released' | 'refunded';
  senderId: string;
  receiverId: string;
  createdAt: string;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isVoiceNote?: boolean;
  voiceDuration?: string;
  mediaUrl?: string;
  isViewOnce?: boolean;
  viewOnceOpened?: boolean;
  isScreenshotNotice?: boolean;
  screenshotBy?: string;
  escrow?: ChatEscrow;
  isRead: boolean;
}

export interface MatchNotification {
  id: string;
  type: 'match' | 'message' | 'like' | 'verification' | 'limit' | 'screenshot' | 'escrow';
  title: string;
  description: string;
  timestamp: string;
  avatar?: string;
  read: boolean;
  actionUserId?: string;
}

export interface FilterSettings {
  minAge: number;
  maxAge: number;
  seeking: Seeking;
  region: 'all' | 'freetown' | 'provinces' | 'uk' | 'us' | 'canada';
  district?: string;
  maxDistanceKm: number;
  verifiedOnly: boolean;
  dialects: string[];
  religions: Religion[];
  relationshipGoals: RelationshipGoal[];
  dishes: string[];
  onlyWithPhotos: boolean;
}

export interface ReportTicket {
  id: string;
  targetUserId: string;
  targetUserName: string;
  reason: 'impersonation' | 'harassment' | 'inappropriate_content' | 'scam' | 'underage' | 'other';
  details: string;
  timestamp: string;
  status: 'pending' | 'resolved';
}

export interface UsageQuota {
  swipesToday: number;
  maxFreeSwipesPerDay: number; // 10 trials
  maxFreeMatches: number; // 2 or 3 matches
  messagesSentToday: number;
  maxFreeDailyMessages: number; // 2 messages per day
  interstitialAdSwipeCounter: number;
  interstitialAdsSeenToday: number;
}

// Advertising System Types
export interface AdSettings {
  bannerAdsEnabled: boolean;
  nativeAdsEnabled: boolean;
  rewardedAdsEnabled: boolean;
  interstitialAdsEnabled: boolean;
  interstitialFrequencySwipes: number; // default 20
  maxDailyInterstitials: number; // default 3
  activeNetworks: ('admob' | 'meta' | 'direct_sl' | 'diaspora')[];
}

export interface AdStats {
  totalRevenueUSD: number;
  impressions: number;
  clicks: number;
  ctrPercent: number;
  ecpmUSD: number;
  rewardedCompleted: number;
  subscriptionsCount: number;
  subscriptionsRevenueUSD: number;
}

export interface SponsoredProfileCard {
  id: string;
  isSponsored: true;
  brandName: string;
  tagline: string;
  imageUrl: string;
  callToAction: string;
  destinationUrl: string;
  location: string;
  description: string;
  category: 'Hospitality' | 'Telecom / Mobile Money' | 'Travel / Airlines' | 'Salone Events';
}
