import {
  UserProfile,
  FilterSettings,
  UsageQuota,
  AdSettings,
  AdStats,
  SponsoredProfileCard,
  Religion,
  EducationLevel,
} from '../types';

export const SIERRA_LEONE_DISTRICTS = [
  'Western Area Urban (Freetown)',
  'Western Area Rural (Waterloo, York, Sussex)',
  'Bo District',
  'Bombali District (Makeni)',
  'Bonthe District',
  'Falaba District',
  'Kailahun District',
  'Kambia District',
  'Karene District',
  'Kenema District',
  'Koinadugu District (Kabala)',
  'Kono District (Koidu)',
  'Moyamba District',
  'Port Loko District',
  'Pujehun District',
  'Tonkolili District (Magburaka)',
  'United Kingdom Diaspora',
  'United States Diaspora',
  'Canada Diaspora',
  'Europe Diaspora',
  'West Africa Diaspora',
];

export const RELIGION_OPTIONS: Religion[] = [
  'Christian (Protestant)',
  'Christian (Catholic)',
  'Christian (Pentecostal)',
  'Christian (Anglican)',
  'Muslim (Sunni)',
  'Muslim (Tijaniyyah)',
  'Muslim (Ahmadiyya)',
  'Traditional / Indigenous',
  'Spiritual',
  'Other',
  'Prefer not to say',
];

export const EDUCATION_LEVELS: EducationLevel[] = [
  'Secondary / High School',
  'Vocational / College Diploma',
  'University (Bachelor\'s)',
  'Postgraduate (Master\'s)',
  'Doctorate / Ph.D.',
  'Professional Certification',
];

export const SALONE_INSTITUTIONS = [
  'Fourah Bay College (USL)',
  'IPAM (USL)',
  'COMAHS (USL)',
  'Njala University',
  'University of Makeni (UNIMAK)',
  'Ernest Bai Koroma University (EBKUST)',
  'Milton Margai Technical University',
  'Freetown Polytechnic',
  'University of Warwick (UK)',
  'Imperial College London (UK)',
  'Johns Hopkins University (USA)',
  'University of Maryland (USA)',
  'Other International University',
];

export const FOOTBALL_CLUBS = [
  'Arsenal',
  'Chelsea',
  'Manchester United',
  'Real Madrid',
  'Barcelona',
  'Liverpool',
  'Manchester City',
  'Leone Stars (National Team)',
  'East End Lions (Salone)',
  'Mighty Blackpool (Salone)',
  'Bo Rangers (Salone)',
  'FC Kallon (Salone)',
];

export const DIALECT_OPTIONS = [
  'Krio',
  'Mende',
  'Temne',
  'Limba',
  'Fullah',
  'Kono',
  'Susu',
  'Kissi',
  'Mandingo',
  'Sherbro',
  'English',
];

export const SALONE_DISHES = [
  'Cassava Leaf & Rice',
  'Sweet Potato Leaf (Plasas)',
  'Salone Jollof Rice',
  'Crain Crain & Ogbono',
  'Groundnut Stew (Peanut Soup)',
  'Pepper Soup & Poyo',
  'Fried Fish & Plantain',
  'Yebeh Stew',
];

export const SALONE_VIBES = [
  'Lion Mountains Peak Views',
  'Lumley Beach Sunsets',
  'Bureh Surf & Seafood',
  'Traditional Family Cookouts',
  'Salone Afrobeats & Amapiano',
  'Leicester Peak Misty Trails',
  'Sunday Church / Mosque Fellowship',
  'Freetown Nightlife & Lounges',
  'Diaspora Salone Cultural Balls',
];

export const SPONSORED_CARDS: SponsoredProfileCard[] = [
  {
    id: 'sponsor-bintumani',
    isSponsored: true,
    brandName: 'Bintumani Luxury Hotel & Terrace',
    tagline: 'The Ultimate Sunset Date Spot in Freetown',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    callToAction: 'Book a Table for Two',
    destinationUrl: 'https://bintumanihotel.sl',
    location: 'Aberdeen, Freetown',
    description: 'Elevate your first date with 360-degree ocean views over the Lion Mountains, candlelit cocktails, and fresh Atlantic seafood.',
    category: 'Hospitality',
  },
  {
    id: 'sponsor-orange',
    isSponsored: true,
    brandName: 'Orange Money Sierra Leone',
    tagline: 'Fast, Safe & Instant Date Transfers',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
    callToAction: 'Send Date Escrow via *144#',
    destinationUrl: 'https://orange.sl',
    location: 'All 16 Districts of Sierra Leone',
    description: 'Zero fees on local merchant payments. Safe peer-to-peer transfers for date reservations, taxi rides, and surprise gifts.',
    category: 'Telecom / Mobile Money',
  },
  {
    id: 'sponsor-bureh',
    isSponsored: true,
    brandName: 'Bureh Beach Surf Club',
    tagline: 'Weekend Beach Hangout & Seafood Grill',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    callToAction: 'Plan a Beach Date',
    destinationUrl: 'https://burehbeach.sl',
    location: 'Bureh, Western Area Rural',
    description: 'Fresh grilled barracuda, live acoustic reggae, and golden sand beneath the rolling Lion Mountains. Perfect for meeting your match.',
    category: 'Hospitality',
  },
];

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'user-aminata',
    name: 'Aminata Kamara',
    age: 26,
    gender: 'woman',
    seeking: 'men',
    locationCity: 'Freetown (Aberdeen)',
    locationCountry: 'Sierra Leone',
    district: 'Western Area Urban (Freetown)',
    region: 'freetown',
    distanceKm: 4,
    bio: 'UX product designer & foodie. Catch me hiking Leicester peak at sunrise or enjoying grilled fish on Lumley Beach. Values deep faith, family Sunday rice, and genuine partnership.',
    profession: 'Senior Product Designer',
    companyOrEmployer: 'AfriTech Innovations',
    religion: 'Muslim (Sunni)',
    educationLevel: 'University (Bachelor\'s)',
    schoolOrUniversity: 'Fourah Bay College (USL)',
    footballClub: 'Arsenal',
    childrenStatus: 'No kids but wants kids',
    petPreference: 'Has dog(s)',
    habits: {
      drinking: 'Never',
      smoking: 'Never',
      clubbing: 'Occasionally',
    },
    homecoming: {
      isPlanningTrip: false,
    },
    height: "5'7\"",
    photos: [
      '/images/sl_dating_aminata_1792925241536.jpg',
      '/images/lion_mountains_backdrop_1792926329183.jpg',
      '/images/sl_dating_fatmata_1792925242309.jpg',
    ],
    isVerified: true,
    verificationBadgeType: 'photo_pose',
    culturalHeritage: {
      dialects: ['Krio', 'Temne', 'English'],
      tribe: 'Temne & Krio',
      favoriteDish: 'Cassava Leaf & Rice',
      weekendVibe: 'Lion Mountains Peak Views',
      musicStyle: 'Afrobeats & Acoustic Salone Pop',
      saloneFact: 'Hiked Sugar Loaf and Leicester Peak four times this year!',
    },
    relationshipGoal: 'long-term',
    interests: ['Mountain Hiking', 'Cooking', 'Coastal Sunsets', 'Tech & Startups', 'Family Cookouts'],
    isPremium: true,
    isSpotlight: true,
    hasLikedCurrentUser: true,
  },
  {
    id: 'user-mohamed',
    name: 'Mohamed Sesay',
    age: 29,
    gender: 'man',
    seeking: 'women',
    locationCity: 'Freetown (Hill Station)',
    locationCountry: 'Sierra Leone',
    district: 'Western Area Urban (Freetown)',
    region: 'freetown',
    distanceKm: 8,
    bio: 'Civil engineer with a heart for building Salone infrastructure. On weekends you will catch me at Bureh Beach or hosting friends for grilled fish and Jollof. Looking for someone genuine and intentional.',
    profession: 'Civil Structural Engineer',
    companyOrEmployer: 'Gento Group Infrastructure',
    religion: 'Muslim (Tijaniyyah)',
    educationLevel: 'Postgraduate (Master\'s)',
    schoolOrUniversity: 'Imperial College London (UK)',
    footballClub: 'Real Madrid',
    childrenStatus: 'No kids but wants kids',
    petPreference: 'Pet lover',
    habits: {
      drinking: 'Never',
      smoking: 'Never',
      clubbing: 'Sometimes',
    },
    homecoming: {
      isPlanningTrip: false,
    },
    height: "6'1\"",
    photos: [
      '/images/sl_dating_mohamed_1792925242580.jpg',
      '/images/lion_mountains_backdrop_1792926329183.jpg',
      '/images/sl_dating_samuel_1792925243415.jpg',
    ],
    isVerified: true,
    verificationBadgeType: 'photo_pose',
    culturalHeritage: {
      dialects: ['Krio', 'Mende', 'English'],
      tribe: 'Mende',
      favoriteDish: 'Salone Jollof Rice',
      weekendVibe: 'Bureh Surf & Seafood',
      musicStyle: 'Salone Palm-Wine Music & Afrobeats',
      saloneFact: 'Fluent in Mende proverbs passed down from Kenema elders.',
    },
    relationshipGoal: 'friendship',
    interests: ['Architecture', 'Beach Volleyball', 'Live Music', 'Entrepreneurship', 'Sunday Dinners'],
    isPremium: true,
    hasLikedCurrentUser: true,
  },
  {
    id: 'user-fatmata',
    name: 'Fatmata Bangura',
    age: 27,
    gender: 'woman',
    seeking: 'men',
    locationCity: 'London (Southwark)',
    locationCountry: 'United Kingdom',
    district: 'United Kingdom Diaspora',
    region: 'uk',
    distanceKm: 4800,
    bio: 'Born in Freetown, flourishing in London! Financial analyst. Planning my annual December trip back home to Freetown for the holiday festivals and beach parties.',
    profession: 'Senior Financial Analyst',
    companyOrEmployer: 'Barclays Capital UK',
    religion: 'Christian (Pentecostal)',
    educationLevel: 'University (Bachelor\'s)',
    schoolOrUniversity: 'University of Warwick (UK)',
    footballClub: 'Chelsea',
    childrenStatus: 'No kids but wants kids',
    petPreference: 'Has cat(s)',
    habits: {
      drinking: 'Occasionally',
      smoking: 'Never',
      clubbing: 'Sometimes',
    },
    homecoming: {
      isPlanningTrip: true,
      arrivalMonth: 'December',
      durationWeeks: 4,
      destinationDistrict: 'Western Area Urban (Freetown)',
      note: 'Coming to Freetown for December festivals and Bureh beach chill! Looking for someone to show me around.',
    },
    height: "5'8\"",
    photos: [
      '/images/sl_dating_fatmata_1792925242309.jpg',
      '/images/lion_mountains_backdrop_1792926329183.jpg',
    ],
    isVerified: true,
    verificationBadgeType: 'photo_pose',
    culturalHeritage: {
      dialects: ['Krio', 'Temne', 'English'],
      tribe: 'Temne',
      favoriteDish: 'Sweet Potato Leaf (Plasas)',
      weekendVibe: 'Diaspora Salone Cultural Balls',
      musicStyle: 'Afrobeats, Gospel & Old School Krio Highlife',
      saloneFact: 'Brings authentic bonga fish and benni seeds back in her suitcase every December!',
    },
    relationshipGoal: 'short-term',
    interests: ['Financial Freedom', 'Diaspora Networking', 'Pilates', 'Fine Dining', 'Interior Design'],
    isPremium: false,
    hasLikedCurrentUser: false,
  },
  {
    id: 'user-samuel',
    name: 'Dr. Samuel Koroma',
    age: 31,
    gender: 'man',
    seeking: 'women',
    locationCity: 'Silver Spring, MD',
    locationCountry: 'United States',
    district: 'United States Diaspora',
    region: 'us',
    distanceKm: 7200,
    bio: 'Physician working in public health. Grew up in Bo Town. Deeply attached to my roots in Sierra Leone. Looking for a marriage-minded partner who values family, faith, culture, and mutual ambition.',
    profession: 'Public Health Physician',
    companyOrEmployer: 'Johns Hopkins Medicine',
    religion: 'Christian (Catholic)',
    educationLevel: 'Doctorate / Ph.D.',
    schoolOrUniversity: 'Johns Hopkins University (USA)',
    footballClub: 'Manchester United',
    childrenStatus: 'No kids but wants kids',
    petPreference: 'Has dog(s)',
    habits: {
      drinking: 'Occasionally',
      smoking: 'Never',
      clubbing: 'Never',
    },
    homecoming: {
      isPlanningTrip: true,
      arrivalMonth: 'December',
      durationWeeks: 3,
      destinationDistrict: 'Bo District',
      note: 'Visiting family in Bo and spending a week at Tokeh Beach.',
    },
    height: "6'2\"",
    photos: [
      '/images/sl_dating_samuel_1792925243415.jpg',
      '/images/lion_mountains_backdrop_1792926329183.jpg',
    ],
    isVerified: true,
    verificationBadgeType: 'photo_pose',
    culturalHeritage: {
      dialects: ['Krio', 'Mende', 'Limba', 'English'],
      tribe: 'Mende & Limba',
      favoriteDish: 'Groundnut Stew (Peanut Soup)',
      weekendVibe: 'Traditional Family Cookouts',
      musicStyle: 'Traditional Mende Folk & Soulful Jazz',
      saloneFact: 'Volunteers annual medical clinics in the Eastern Province.',
    },
    relationshipGoal: 'marriage',
    interests: ['Health Equity', 'Mentorship', 'Running & Tennis', 'History Books', 'Cooking Stews'],
    isPremium: true,
    isSpotlight: true,
    hasLikedCurrentUser: true,
  },
  {
    id: 'user-mariama',
    name: 'Mariama Jalloh',
    age: 25,
    gender: 'woman',
    seeking: 'men',
    locationCity: 'Makeni',
    locationCountry: 'Sierra Leone',
    district: 'Bombali District (Makeni)',
    region: 'provinces',
    distanceKm: 140,
    bio: 'Agribusiness founder in Makeni. Passionate about sustainable farming, making friends across Salone, and Sunday family dinners. Open to friendship and casual dating first.',
    profession: 'Agribusiness Founder',
    companyOrEmployer: 'Northern Green Ventures',
    religion: 'Muslim (Sunni)',
    educationLevel: 'University (Bachelor\'s)',
    schoolOrUniversity: 'University of Makeni (UNIMAK)',
    footballClub: 'Leone Stars (National Team)',
    childrenStatus: 'No kids but wants kids',
    petPreference: 'Pet lover',
    habits: {
      drinking: 'Never',
      smoking: 'Never',
      clubbing: 'Never',
    },
    homecoming: {
      isPlanningTrip: false,
    },
    height: "5'6\"",
    photos: [
      '/images/sl_dating_aminata_1792925241536.jpg',
      '/images/lion_mountains_backdrop_1792926329183.jpg',
    ],
    isVerified: true,
    verificationBadgeType: 'photo_pose',
    culturalHeritage: {
      dialects: ['Fullah', 'Krio', 'Temne', 'English'],
      tribe: 'Fullah',
      favoriteDish: 'Crain Crain & Ogbono',
      weekendVibe: 'Sunday Church / Mosque Fellowship',
      musicStyle: 'Acoustic Soul & Salone Traditional',
      saloneFact: 'Speaks four local dialects fluently!',
    },
    relationshipGoal: 'friendship',
    interests: ['Sustainable Farming', 'Reading', 'Community Work', 'Baking', 'Nature Walks'],
    isPremium: false,
    hasLikedCurrentUser: false,
  },
  {
    id: 'user-alieu',
    name: 'Alieu Conteh',
    age: 28,
    gender: 'man',
    seeking: 'women',
    locationCity: 'Bo Town',
    locationCountry: 'Sierra Leone',
    district: 'Bo District',
    region: 'provinces',
    distanceKm: 175,
    bio: 'Photographer and tech teacher in Bo. Ready for casual dating, road trips, and exploring secret waterfalls across our beautiful Lion Mountains peninsula.',
    profession: 'IT Director & Photographer',
    companyOrEmployer: 'Bo Digital Media Hub',
    religion: 'Christian (Protestant)',
    educationLevel: 'University (Bachelor\'s)',
    schoolOrUniversity: 'Njala University',
    footballClub: 'Bo Rangers (Salone)',
    childrenStatus: 'No kids & doesn\'t want kids',
    petPreference: 'Has dog(s)',
    habits: {
      drinking: 'Sometimes',
      smoking: 'Never',
      clubbing: 'Frequently',
    },
    homecoming: {
      isPlanningTrip: false,
    },
    height: "5'11\"",
    photos: [
      '/images/sl_dating_mohamed_1792925242580.jpg',
      '/images/lion_mountains_backdrop_1792926329183.jpg',
    ],
    isVerified: true,
    verificationBadgeType: 'photo_pose',
    culturalHeritage: {
      dialects: ['Krio', 'Mende', 'Temne', 'English'],
      tribe: 'Temne',
      favoriteDish: 'Fried Fish & Plantain',
      weekendVibe: 'Leicester Peak Misty Trails',
      musicStyle: 'Afrobeats & Reggae',
      saloneFact: 'Knows every hidden scenic waterfall in Sierra Leone.',
    },
    relationshipGoal: 'casual',
    interests: ['Landscape Photography', 'Road Trips', 'Soccer', 'Tech', 'Cooking'],
    isPremium: false,
    hasLikedCurrentUser: true,
  },
];

// Helper to compute 14-day trial expiry
export const getInitialTrialExpiry = (): string => {
  const d = new Date();
  d.setDate(d.getDate() + 14); // 2 weeks free trial
  return d.toISOString();
};

export const DEFAULT_CURRENT_USER: UserProfile = {
  id: 'current-user-1',
  name: 'Isatu Cole',
  age: 26,
  gender: 'woman',
  seeking: 'men',
  locationCity: 'Freetown',
  locationCountry: 'Sierra Leone',
  district: 'Western Area Urban (Freetown)',
  region: 'freetown',
  distanceKm: 0,
  bio: 'Living in the heart of Freetown. Loves fresh beach air at Lumley, views of the Lion Mountains, and home cooking. Looking for friendship and genuine connection.',
  profession: 'Marketing Strategist',
  companyOrEmployer: 'Sierra Brand Consult',
  religion: 'Christian (Protestant)',
  educationLevel: 'University (Bachelor\'s)',
  schoolOrUniversity: 'Fourah Bay College (USL)',
  footballClub: 'Arsenal',
  childrenStatus: 'No kids but wants kids',
  petPreference: 'Pet lover',
  habits: {
    drinking: 'Occasionally',
    smoking: 'Never',
    clubbing: 'Occasionally',
  },
  homecoming: {
    isPlanningTrip: false,
  },
  height: "5'6\"",
  photos: [
    '/images/sl_dating_aminata_1792925241536.jpg',
    '/images/lion_mountains_backdrop_1792926329183.jpg',
    '/images/sl_dating_fatmata_1792925242309.jpg',
  ],
  isVerified: true,
  verificationBadgeType: 'photo_pose',
  culturalHeritage: {
    dialects: ['Krio', 'Temne', 'English'],
    tribe: 'Krio',
    favoriteDish: 'Cassava Leaf & Rice',
    weekendVibe: 'Lion Mountains Peak Views',
    musicStyle: 'Salone Afrobeats & Highlife',
    saloneFact: 'Loves hiking and promoting Sierra Leone cultural tourism.',
  },
  relationshipGoal: 'friendship',
  interests: ['Mountain Hiking', 'Cooking', 'Coastal Sunsets', 'Tech & Startups', 'Family Cookouts'],
  isPremium: false,
  isTrialActive: true,
  trialExpiresAt: getInitialTrialExpiry(),
  isSpotlight: false,
};

export const DEFAULT_USAGE_QUOTA: UsageQuota = {
  swipesToday: 0,
  maxFreeSwipesPerDay: 10,
  maxFreeMatches: 3,
  messagesSentToday: 0,
  maxFreeDailyMessages: 2,
  interstitialAdSwipeCounter: 0,
  interstitialAdsSeenToday: 0,
};

export const DEFAULT_AD_SETTINGS: AdSettings = {
  bannerAdsEnabled: true,
  nativeAdsEnabled: true,
  rewardedAdsEnabled: true,
  interstitialAdsEnabled: true,
  interstitialFrequencySwipes: 20,
  maxDailyInterstitials: 3,
  activeNetworks: ['direct_sl', 'admob', 'diaspora'],
};

export const DEFAULT_AD_STATS: AdStats = {
  totalRevenueUSD: 148.50,
  impressions: 4820,
  clicks: 342,
  ctrPercent: 7.09,
  ecpmUSD: 2.45,
  rewardedCompleted: 118,
  subscriptionsCount: 38,
  subscriptionsRevenueUSD: 290.00,
};

export const DEFAULT_FILTER_SETTINGS: FilterSettings = {
  minAge: 21,
  maxAge: 40,
  seeking: 'men',
  region: 'all',
  maxDistanceKm: 10000,
  verifiedOnly: false,
  dialects: [],
  religions: [],
  relationshipGoals: [],
  dishes: [],
  onlyWithPhotos: true,
};

// Calculate cultural compatibility algorithm
export function calculateCulturalMatch(userA: UserProfile, userB: UserProfile): number {
  let score = 55;

  const sharedDialects = userA.culturalHeritage.dialects.filter((d) =>
    userB.culturalHeritage.dialects.includes(d)
  );
  score += Math.min(sharedDialects.length * 8, 20);

  if (userA.culturalHeritage.favoriteDish === userB.culturalHeritage.favoriteDish) {
    score += 12;
  }

  if (userA.culturalHeritage.weekendVibe === userB.culturalHeritage.weekendVibe) {
    score += 8;
  }

  if (userA.relationshipGoal === userB.relationshipGoal) {
    score += 10;
  }

  if (userA.religion && userB.religion && userA.religion === userB.religion) {
    score += 8;
  }

  if (userA.footballClub && userB.footballClub && userA.footballClub === userB.footballClub) {
    score += 6;
  }

  const sharedInterests = userA.interests.filter((i) => userB.interests.includes(i));
  score += Math.min(sharedInterests.length * 4, 12);

  return Math.min(score, 99);
}
