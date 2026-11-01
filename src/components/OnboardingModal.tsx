import React, { useState, useMemo } from 'react';
import {
  UserProfile,
  Gender,
  Seeking,
  RelationshipGoal,
  Religion,
  EducationLevel,
  ChildrenStatus,
  PetPreference,
  HabitFrequency,
} from '../types';
import {
  DIALECT_OPTIONS,
  SALONE_DISHES,
  SALONE_VIBES,
  SIERRA_LEONE_DISTRICTS,
  RELIGION_OPTIONS,
  EDUCATION_LEVELS,
  FOOTBALL_CLUBS,
} from '../data/mockProfiles';
import { PhotoVerificationModal } from './PhotoVerificationModal';
import { OtpVerificationModal } from './OtpVerificationModal';
import {
  ShieldCheck,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  User,
  Plus,
  Trash2,
  Mountain,
  Heart,
  Plane,
  AlertTriangle,
  AtSign,
  Calendar,
  Lock,
  Smartphone,
  CheckCircle,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (user: UserProfile) => void;
  initialUser?: UserProfile;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  initialUser,
}) => {
  const [step, setStep] = useState(1); // 6 steps total
  const [name, setName] = useState(initialUser?.name || '');
  const [username, setUsername] = useState(initialUser?.username || '');

  // Exact DOB components with Leap Year & strict >= 18 calculation
  const today = new Date();
  const [dobYear, setDobYear] = useState<number>(today.getFullYear() - 25);
  const [dobMonth, setDobMonth] = useState<number>(5); // May
  const [dobDay, setDobDay] = useState<number>(14);

  const [phoneNumber, setPhoneNumber] = useState('+232 76 892014');
  const [emailAddress, setEmailAddress] = useState('isatu.cole@gmail.com');
  const [gender, setGender] = useState<Gender>(initialUser?.gender || 'woman');
  const [seeking, setSeeking] = useState<Seeking>(initialUser?.seeking || 'men');
  const [district, setDistrict] = useState(initialUser?.district || 'Western Area Urban (Freetown)');
  const [locationCity, setLocationCity] = useState(initialUser?.locationCity || 'Freetown');
  const [locationCountry, setLocationCountry] = useState(initialUser?.locationCountry || 'Sierra Leone');
  const [region, setRegion] = useState<'freetown' | 'provinces' | 'uk' | 'us' | 'canada' | 'other'>(
    initialUser?.region || 'freetown'
  );

  // Religion & Education & Occupation
  const [religion, setReligion] = useState<Religion>(initialUser?.religion || 'Christian (Protestant)');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(
    initialUser?.educationLevel || "University (Bachelor's)"
  );
  const [schoolOrUniversity, setSchoolOrUniversity] = useState(
    initialUser?.schoolOrUniversity || 'Fourah Bay College (USL)'
  );
  const [profession, setProfession] = useState(initialUser?.profession || 'Marketing Strategist');
  const [companyOrEmployer, setCompanyOrEmployer] = useState(initialUser?.companyOrEmployer || 'Sierra Consult');

  // Cultural Heritage & Sports
  const [selectedDialects, setSelectedDialects] = useState<string[]>(
    initialUser?.culturalHeritage.dialects || ['Krio', 'English']
  );
  const [favoriteDish, setFavoriteDish] = useState(
    initialUser?.culturalHeritage.favoriteDish || 'Cassava Leaf & Rice'
  );
  const [weekendVibe, setWeekendVibe] = useState(
    initialUser?.culturalHeritage.weekendVibe || 'Lion Mountains Peak Views'
  );
  const [footballClub, setFootballClub] = useState(initialUser?.footballClub || 'Arsenal');
  const [relationshipGoal, setRelationshipGoal] = useState<RelationshipGoal>(
    initialUser?.relationshipGoal || 'friendship'
  );

  // Lifestyle & Family
  const [childrenStatus, setChildrenStatus] = useState<ChildrenStatus>(
    initialUser?.childrenStatus || 'No kids but wants kids'
  );
  const [petPreference, setPetPreference] = useState<PetPreference>(
    initialUser?.petPreference || 'Pet lover'
  );
  const [drinking, setDrinking] = useState<HabitFrequency>(initialUser?.habits?.drinking || 'Occasionally');
  const [smoking, setSmoking] = useState<HabitFrequency>(initialUser?.habits?.smoking || 'Never');
  const [clubbing, setClubbing] = useState<HabitFrequency>(initialUser?.habits?.clubbing || 'Occasionally');

  // Homecoming Matcher
  const [isPlanningTrip, setIsPlanningTrip] = useState(initialUser?.homecoming?.isPlanningTrip || false);
  const [arrivalMonth, setArrivalMonth] = useState(initialUser?.homecoming?.arrivalMonth || 'December');

  // Bio & Photos (Up to 10)
  const [bio, setBio] = useState(
    initialUser?.bio ||
      'Proud Sierra Leonean living under the Lion Mountains. Looking for genuine friendship, cultural connection, and good laughs.'
  );
  const [photos, setPhotos] = useState<string[]>(
    initialUser?.photos && initialUser.photos.length > 0
      ? initialUser.photos.slice(0, 10)
      : ['/images/sl_dating_aminata_1792925241536.jpg']
  );

  const [isVerified, setIsVerified] = useState(initialUser?.isVerified ?? true);
  const [isOtpVerified, setIsOtpVerified] = useState(initialUser?.otpVerified ?? false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Calculate dynamic max days in month handling leap years
  const daysInSelectedMonth = useMemo(() => {
    return new Date(dobYear, dobMonth, 0).getDate();
  }, [dobYear, dobMonth]);

  // Exact age calculation from DOB
  const calculatedAge = useMemo(() => {
    const birthDate = new Date(dobYear, dobMonth - 1, dobDay);
    const now = new Date();
    let age = now.getFullYear() - birthDate.getFullYear();
    const monthDiff = now.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }, [dobYear, dobMonth, dobDay]);

  if (!isOpen) return null;

  const toggleDialect = (dialect: string) => {
    if (selectedDialects.includes(dialect)) {
      if (selectedDialects.length > 1) {
        setSelectedDialects(selectedDialects.filter((d) => d !== dialect));
      }
    } else {
      setSelectedDialects([...selectedDialects, dialect]);
    }
  };

  const addPhoto = (photoUrl: string) => {
    if (photos.length >= 10) {
      setErrorMsg('You have reached the maximum limit of 10 pictures.');
      return;
    }
    setPhotos([...photos, photoUrl]);
    setErrorMsg(null);
  };

  const removePhoto = (index: number) => {
    if (photos.length <= 1) {
      setErrorMsg('You must have at least 1 photo.');
      return;
    }
    setPhotos(photos.filter((_, i) => i !== index));
    setErrorMsg(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (photos.length >= 10) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          addPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep1 = (): boolean => {
    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return false;
    }

    // Username validation: 3-20 chars, alphanumeric and underscores only
    const cleanUsername = username.trim().replace(/^@/, '');
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!cleanUsername) {
      setErrorMsg('Please choose a unique @username for your profile');
      return false;
    }
    if (!usernameRegex.test(cleanUsername)) {
      setErrorMsg('Username must be 3-20 characters and contain only letters, numbers, and underscores.');
      return false;
    }

    // Strict 18+ validation with exact required wording
    if (calculatedAge < 18) {
      setErrorMsg('You must be at least 18 years old to use this application.');
      return false;
    }

    // Anti-scam phone prefix validation
    if (
      phoneNumber.startsWith('+234') ||
      phoneNumber.startsWith('00234') ||
      phoneNumber.startsWith('+91') ||
      phoneNumber.startsWith('+880')
    ) {
      setErrorMsg('Security Notice: Registrations from this country code are restricted under Salone Connect Anti-Scam Policy.');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    setErrorMsg(null);

    if (step === 1) {
      if (!validateStep1()) return;
      // Trigger mandatory OTP verification if not yet done
      if (!isOtpVerified) {
        setShowOtpModal(true);
        return;
      }
    }

    if (step === 2) {
      if (!profession.trim()) {
        setErrorMsg('Please specify your profession / occupation');
        return;
      }
    }

    if (step === 5) {
      if (!bio.trim() || bio.length < 15) {
        setErrorMsg('Please write a brief bio introducing yourself (at least 15 characters)');
        return;
      }
    }

    if (step < 6) {
      setStep(step + 1);
    } else {
      const formattedUsername = username.trim().replace(/^@/, '');
      const formattedDob = `${dobYear}-${dobMonth.toString().padStart(2, '0')}-${dobDay.toString().padStart(2, '0')}`;

      const completedUser: UserProfile = {
        id: initialUser?.id || `user-custom-${Date.now()}`,
        name: name.trim(),
        username: formattedUsername || 'salone_user',
        age: calculatedAge,
        dateOfBirth: formattedDob,
        gender,
        seeking,
        locationCity,
        locationCountry,
        district,
        region,
        distanceKm: 0,
        bio,
        profession,
        companyOrEmployer,
        religion,
        educationLevel,
        schoolOrUniversity,
        photos: photos.slice(0, 10),
        isVerified,
        verificationBadgeType: isVerified ? 'photo_pose' : 'none',
        livenessVerified: isVerified,
        otpVerified: isOtpVerified,
        isPhoneVerified: true,
        culturalHeritage: {
          dialects: selectedDialects,
          tribe: 'Temne & Krio',
          favoriteDish,
          weekendVibe,
          musicStyle: 'Afrobeats & Acoustic Salone',
          saloneFact: `Proudly supporting ${footballClub} and love ${favoriteDish}!`,
        },
        footballClub,
        childrenStatus,
        petPreference,
        habits: {
          drinking,
          smoking,
          clubbing,
        },
        homecoming: {
          isPlanningTrip,
          arrivalMonth,
          destinationDistrict: district,
        },
        relationshipGoal,
        interests: ['Mountain Hiking', 'Cooking', 'Coastal Sunsets', 'Family Cookouts'],
        isPremium: initialUser?.isPremium || false,
        isTrialActive: true,
        trialExpiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        isSpotlight: initialUser?.isSpotlight || false,
      };
      onComplete(completedUser);
    }
  };

  const handleQuickGuestStart = () => {
    const formattedDob = `${dobYear}-${dobMonth.toString().padStart(2, '0')}-${dobDay.toString().padStart(2, '0')}`;
    const defaultTesterUser: UserProfile = {
      id: initialUser?.id || `user-tester-${Date.now()}`,
      name: name.trim() || 'Isatu Cole',
      username: username.trim().replace(/^@/, '') || 'isatu_cole',
      age: calculatedAge >= 18 ? calculatedAge : 26,
      dateOfBirth: formattedDob,
      gender: gender || 'woman',
      seeking: seeking || 'men',
      locationCity: 'Freetown',
      locationCountry: 'Sierra Leone',
      district: 'Western Area Urban (Freetown)',
      region: 'freetown',
      distanceKm: 0,
      bio: 'Proud Sierra Leonean living under the Lion Mountains. Exploring genuine cultural connection, warmth, and good vibes.',
      profession: profession || 'Marketing Strategist',
      companyOrEmployer: 'Sierra Brand Consult',
      religion: religion || 'Christian (Protestant)',
      educationLevel: educationLevel || "University (Bachelor's)",
      schoolOrUniversity: 'Fourah Bay College (USL)',
      photos: photos && photos.length > 0 ? photos : ['/images/sl_dating_aminata_1792925241536.jpg', '/images/lion_mountains_backdrop_1792926329183.jpg'],
      isVerified: true,
      verificationBadgeType: 'photo_pose',
      livenessVerified: true,
      otpVerified: true,
      isPhoneVerified: true,
      culturalHeritage: {
        dialects: ['Krio', 'English'],
        tribe: 'Krio',
        favoriteDish: 'Cassava Leaf & Rice',
        weekendVibe: 'Lion Mountains Peak Views',
        musicStyle: 'Afrobeats & Acoustic Salone',
        saloneFact: 'Love hiking Lion Mountains and eating Cassava leaf!',
      },
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
      relationshipGoal: 'friendship',
      interests: ['Mountain Hiking', 'Cooking', 'Coastal Sunsets', 'Family Cookouts'],
      isPremium: true,
      isTrialActive: true,
      trialExpiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      isSpotlight: true,
    };
    onComplete(defaultTesterUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#2e0212] via-slate-900 to-slate-950 border border-rose-900/40 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl my-auto">
        {/* Romantic glow highlight */}
        <div className="absolute top-0 right-10 w-44 h-24 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Instant Pilot Tester Access Pill */}
        <div className="mb-5 p-3 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 border border-rose-500/30 flex items-center justify-between gap-3 shadow-lg">
          <div className="space-y-0.5 text-xs">
            <span className="font-bold text-rose-300 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              Pilot Tester Fast Access
            </span>
            <p className="text-[11px] text-slate-300">
              Skip form to instantly experience romantic swiping, OTP security & live chat!
            </p>
          </div>
          <button
            type="button"
            onClick={handleQuickGuestStart}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs whitespace-nowrap shadow-md active:scale-95 transition-all shrink-0 flex items-center gap-1.5"
          >
            <span>Explore Now</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> Salone Connect Signup
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-rose-200/70">Step {step} of 6</span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                className={`h-1.5 w-5 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2 animate-shake">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Basic Identity, Unique @Username & Exact Age (18+) */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>Kusheh! Welcome to Salone Connect</span>
                <Sparkles className="w-5 h-5 text-rose-400" />
              </h2>
              <p className="text-xs text-rose-200/80 mt-1">
                Authentic Sierra Leonean community with romantic elegance & high-security verification.
              </p>
            </div>

            <div className="space-y-3">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Legal Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400/70" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Isatu Cole or Mohamed Sesay"
                    className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-rose-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Unique Username */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-300">Choose Unique Username</label>
                  <span className="text-[10px] text-rose-400">Alphanumeric & underscores only</span>
                </div>
                <div className="relative">
                  <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="isatu_cole"
                    maxLength={20}
                    className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-rose-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Date of Birth Dynamic Picker & Minimum 18 Age Threshold */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-rose-400" /> Date of Birth (Must be $\ge 18$)
                  </label>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                    calculatedAge >= 18 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    {calculatedAge} years old
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* Day */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Day</label>
                    <select
                      value={dobDay}
                      onChange={(e) => setDobDay(parseInt(e.target.value, 10))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white focus:border-rose-500"
                    >
                      {Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* Month */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Month</label>
                    <select
                      value={dobMonth}
                      onChange={(e) => {
                        const m = parseInt(e.target.value, 10);
                        setDobMonth(m);
                        const maxD = new Date(dobYear, m, 0).getDate();
                        if (dobDay > maxD) setDobDay(maxD);
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white focus:border-rose-500"
                    >
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((mName, idx) => (
                        <option key={idx + 1} value={idx + 1}>{mName}</option>
                      ))}
                    </select>
                  </div>

                  {/* Year */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Year</label>
                    <select
                      value={dobYear}
                      onChange={(e) => setDobYear(parseInt(e.target.value, 10))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white focus:border-rose-500"
                    >
                      {Array.from({ length: 65 }, (_, i) => today.getFullYear() - 14 - i).map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {calculatedAge < 18 && (
                  <p className="text-[11px] text-rose-400 font-medium">
                    You must be at least 18 years old to use this application.
                  </p>
                )}
              </div>

              {/* Phone & OTP State */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-300">Phone Number (Mandatory SMS OTP)</label>
                  {isOtpVerified && (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> SMS Verified
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400/70" />
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setIsOtpVerified(false);
                      }}
                      placeholder="+232 76 892014"
                      className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!validateStep1()) return;
                      setShowOtpModal(true);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                      isOtpVerified
                        ? 'bg-emerald-900/60 border border-emerald-500 text-emerald-300'
                        : 'bg-rose-600 hover:bg-rose-500 text-white'
                    }`}
                  >
                    {isOtpVerified ? 'Verified ✓' : 'Send OTP'}
                  </button>
                </div>
              </div>

              {/* Gender & Seeking */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">I identify as</label>
                  <div className="flex gap-1.5">
                    {(['woman', 'man', 'non-binary'] as Gender[]).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`flex-1 py-2 px-1 rounded-xl border text-[11px] font-medium capitalize transition-all ${
                          gender === g
                            ? 'bg-rose-950/70 border-rose-500 text-rose-300 font-bold shadow-sm'
                            : 'bg-slate-900/50 border-slate-800 text-slate-400'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Seeking</label>
                  <div className="flex gap-1.5">
                    {(['men', 'women', 'everyone'] as Seeking[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSeeking(s)}
                        className={`flex-1 py-2 px-1 rounded-xl border text-[11px] font-medium capitalize transition-all ${
                          seeking === s
                            ? 'bg-rose-950/70 border-rose-500 text-rose-300 font-bold shadow-sm'
                            : 'bg-slate-900/50 border-slate-800 text-slate-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Religion, Education & Occupation */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Faith, Education & Occupation</h2>
              <p className="text-xs text-rose-200/80 mt-1">
                Help compatible matches discover your spiritual values, trade, and academic background.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Religion / Faith</label>
                <select
                  value={religion}
                  onChange={(e) => setReligion(e.target.value as Religion)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  {RELIGION_OPTIONS.map((rel) => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Education Level</label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  {EDUCATION_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">School / University</label>
                <input
                  type="text"
                  value={schoolOrUniversity}
                  onChange={(e) => setSchoolOrUniversity(e.target.value)}
                  placeholder="e.g. Fourah Bay College, Njala University, IPAM"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Occupation / Profession</label>
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="e.g. Civil Engineer, Nurse"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={companyOrEmployer}
                    onChange={(e) => setCompanyOrEmployer(e.target.value)}
                    placeholder="e.g. Self-Employed, Ministry"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: 16 Districts & Homecoming Matcher */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Location & 16 Districts</h2>
              <p className="text-xs text-rose-200/80 mt-1">
                Match with Sierra Leoneans across all 16 districts or in the global Diaspora.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Home District / Diaspora Hub</label>
                <select
                  value={district}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDistrict(val);
                    if (val.includes('Freetown')) {
                      setRegion('freetown');
                      setLocationCity('Freetown');
                      setLocationCountry('Sierra Leone');
                    } else if (val.includes('Diaspora')) {
                      if (val.includes('United Kingdom')) {
                        setRegion('uk');
                        setLocationCity('London');
                        setLocationCountry('United Kingdom');
                      } else {
                        setRegion('us');
                        setLocationCity('Silver Spring, MD');
                        setLocationCountry('United States');
                      }
                    } else {
                      setRegion('provinces');
                      setLocationCity(val.split(' ')[0]);
                      setLocationCountry('Sierra Leone');
                    }
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  {SIERRA_LEONE_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              {/* Homecoming & Holiday Matcher */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/40 to-slate-900 border border-rose-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <Plane className="w-4 h-4 text-rose-400" /> Homecoming & Holiday Matcher
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPlanningTrip}
                      onChange={(e) => setIsPlanningTrip(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>

                <p className="text-[11px] text-slate-300 leading-snug">
                  Visiting Sierra Leone for December holidays, Easter festivals, or family homecomings? Connect with locals before boarding.
                </p>

                {isPlanningTrip && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Arrival Month</label>
                      <select
                        value={arrivalMonth}
                        onChange={(e) => setArrivalMonth(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                      >
                        {['November', 'December', 'January', 'Easter / April', 'Summer / August'].map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Primary Destination</label>
                      <input
                        type="text"
                        defaultValue="Freetown & Bureh Beach"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Lifestyle, Habits & Heritage */}
        {step === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Lifestyle, Habits & Heritage</h2>
              <p className="text-xs text-rose-200/80 mt-1">
                Shared values, lifestyle rhythms, and Salone culture make for lasting romance.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Children Status</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    'No kids but wants kids',
                    'Has kids & wants more',
                    'Has kids & no more',
                    'No kids & doesn\'t want kids',
                  ].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setChildrenStatus(status as any)}
                      className={`p-2 rounded-xl text-left border text-[11px] transition-colors ${
                        childrenStatus === status
                          ? 'bg-rose-950/70 border-rose-500 text-rose-300 font-bold'
                          : 'bg-slate-900/50 border-slate-800 text-slate-400'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Habits */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Drinking</label>
                  <select
                    value={drinking}
                    onChange={(e) => setDrinking(e.target.value as HabitFrequency)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    {['Never', 'Occasionally', 'Sometimes', 'Frequently'].map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Smoking</label>
                  <select
                    value={smoking}
                    onChange={(e) => setSmoking(e.target.value as HabitFrequency)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    {['Never', 'Occasionally', 'Sometimes', 'Frequently'].map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Clubbing</label>
                  <select
                    value={clubbing}
                    onChange={(e) => setClubbing(e.target.value as HabitFrequency)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    {['Never', 'Occasionally', 'Sometimes', 'Frequently'].map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Favorite Football Club</label>
                <select
                  value={footballClub}
                  onChange={(e) => setFootballClub(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  {FOOTBALL_CLUBS.map((club) => (
                    <option key={club} value={club}>{club}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Dialects Spoken</label>
                <div className="flex flex-wrap gap-1.5">
                  {DIALECT_OPTIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDialect(d)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                        selectedDialects.includes(d)
                          ? 'bg-rose-600 border-rose-500 text-white'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      {d} {selectedDialects.includes(d) && '✓'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Relationship Goal & Bio */}
        {step === 5 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Your Intentions & Bio</h2>
              <p className="text-xs text-rose-200/80 mt-1">
                Whether looking for lifelong marriage, romantic courtship, or friendship.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Relationship Goal</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'marriage', label: 'Marriage Minded', desc: 'Ready for lifelong commitment' },
                    { id: 'long-term', label: 'Long-term Love', desc: 'Intentional partnership' },
                    { id: 'short-term', label: 'Romantic Dating', desc: 'Dating & learning each other' },
                    { id: 'friendship', label: 'Friends / Padi', desc: 'Salone companionship' },
                    { id: 'casual', label: 'Social & Vibes', desc: 'Hangouts & beach dates' },
                  ].map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setRelationshipGoal(goal.id as RelationshipGoal)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        relationshipGoal === goal.id
                          ? 'bg-rose-950/70 border-rose-500 text-rose-300 shadow-sm'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{goal.label}</div>
                      <div className="text-[10px] text-rose-300/70 mt-0.5">{goal.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">About You (Bio)</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a bit about your roots, your passions, what makes you smile..."
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Photos & 3D Biometric Verification */}
        {step === 6 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white tracking-tight">Your Photos (Up to 10)</h2>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {photos.length} / 10 Added
                </span>
              </div>
              <p className="text-xs text-rose-200/80 mt-1">
                Upload authentic pictures. The first picture will be your primary discovery card.
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {photos.map((src, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[3/4] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group"
                >
                  <img src={src} alt="user pic" className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <div className="absolute top-1 left-1 bg-rose-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                      Main
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-80 hover:opacity-100 shadow transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {photos.length < 10 && (
                <label className="relative aspect-[3/4] rounded-xl border-2 border-dashed border-rose-800/60 hover:border-rose-500 flex flex-col items-center justify-center cursor-pointer bg-slate-900/40 hover:bg-rose-950/20 transition-all text-slate-400 hover:text-rose-400">
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  <Plus className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-semibold">Add Photo</span>
                </label>
              )}
            </div>

            {/* Photo Verification Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 border border-rose-500/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">3D Face Liveness Shield</h4>
                  <p className="text-[11px] text-rose-300">
                    {isVerified ? 'Shield Verified — Authentic Live Presence' : 'Pending 3D Micro-Expression Scan'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVerificationModal(true)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
              >
                {isVerified ? 'Re-scan 3D' : 'Scan Live 3D'}
              </button>
            </div>
          </div>
        )}

        {/* Modal Navigation Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-rose-950/40">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="py-2.5 px-4 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-950/60 transition-all hover:scale-[1.02] active:scale-98"
          >
            {step === 6 ? (
              <>
                <Heart className="w-4 h-4 fill-white" /> Complete & Enter Salone Connect
              </>
            ) : (
              <>
                Continue <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3D Liveness Detection Modal */}
      <PhotoVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onVerified={(photo) => {
          setIsVerified(true);
          if (photo.startsWith('data:')) {
            setPhotos([photo, ...photos.slice(0, 9)]);
          }
        }}
      />

      {/* Mandatory 6-Digit OTP Verification Modal */}
      <OtpVerificationModal
        isOpen={showOtpModal}
        targetDestination={phoneNumber}
        onVerified={() => {
          setIsOtpVerified(true);
          setShowOtpModal(false);
          setStep(2); // Automatically proceed to step 2 after OTP verification
        }}
        onCancel={() => setShowOtpModal(false)}
      />
    </div>
  );
};
