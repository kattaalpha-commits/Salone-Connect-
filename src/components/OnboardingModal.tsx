import React, { useState } from 'react';
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
  SALONE_INSTITUTIONS,
  FOOTBALL_CLUBS,
} from '../data/mockProfiles';
import { PhotoVerificationModal } from './PhotoVerificationModal';
import {
  ShieldCheck,
  Sparkles,
  Check,
  ChevronRight,
  ChevronLeft,
  MapPin,
  User,
  Plus,
  Trash2,
  Globe,
  Mountain,
  BookOpen,
  GraduationCap,
  Heart,
  Plane,
  AlertTriangle,
  Smile,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (user: UserProfile) => void;
  initialUser?: UserProfile;
}

const SAMPLE_PHOTO_PRESETS = [
  '/images/sl_dating_aminata_1792925241536.jpg',
  '/images/sl_dating_mohamed_1792925242580.jpg',
  '/images/sl_dating_fatmata_1792925242309.jpg',
  '/images/sl_dating_samuel_1792925243415.jpg',
  '/images/lion_mountains_backdrop_1792926329183.jpg',
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  initialUser,
}) => {
  const [step, setStep] = useState(1); // 6 steps total
  const [name, setName] = useState(initialUser?.name || '');
  const [age, setAge] = useState<number>(initialUser?.age || 25);
  const [phoneNumber, setPhoneNumber] = useState('+232 76 000000');
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
    initialUser?.educationLevel || 'University (Bachelor\'s)'
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
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  const handleNext = () => {
    setErrorMsg(null);

    // Anti-scam phone prefix validation
    if (
      phoneNumber.startsWith('+234') ||
      phoneNumber.startsWith('00234') ||
      phoneNumber.startsWith('+91') ||
      phoneNumber.startsWith('+880')
    ) {
      setErrorMsg('Security Notice: Registrations from this country code are restricted under Salone Connect Anti-Scam Policy.');
      return;
    }

    if (step === 1) {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name');
        return;
      }
      if (age < 18) {
        setErrorMsg('You must be 18 years or older to join Salone Connect');
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
      const completedUser: UserProfile = {
        id: initialUser?.id || `user-custom-${Date.now()}`,
        name,
        age,
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
    const defaultTesterUser: UserProfile = {
      id: initialUser?.id || `user-tester-${Date.now()}`,
      name: name.trim() || 'Isatu Cole',
      age: age || 26,
      gender: gender || 'woman',
      seeking: seeking || 'men',
      locationCity: 'Freetown',
      locationCountry: 'Sierra Leone',
      district: 'Western Area Urban (Freetown)',
      region: 'freetown',
      distanceKm: 0,
      bio: 'Proud Sierra Leonean living under the Lion Mountains. Testing the pilot app for cultural connection and good vibes.',
      profession: profession || 'Marketing Strategist',
      companyOrEmployer: 'Sierra Brand Consult',
      religion: religion || 'Christian (Protestant)',
      educationLevel: educationLevel || "University (Bachelor's)",
      schoolOrUniversity: 'Fourah Bay College (USL)',
      photos: photos && photos.length > 0 ? photos : ['/images/sl_dating_aminata_1792925241536.jpg', '/images/lion_mountains_backdrop_1792926329183.jpg'],
      isVerified: true,
      verificationBadgeType: 'photo_pose',
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
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl my-auto">
        {/* Instant Pilot Tester Access Pill */}
        <div className="mb-5 p-3 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-800/70 to-slate-900 border border-emerald-500/40 flex items-center justify-between gap-3 shadow-lg">
          <div className="space-y-0.5 text-xs">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Pilot Tester Quick Access
            </span>
            <p className="text-[11px] text-slate-300">
              Skip registration form to immediately explore swiping, chats & matching!
            </p>
          </div>
          <button
            type="button"
            onClick={handleQuickGuestStart}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs whitespace-nowrap shadow-md active:scale-95 transition-all shrink-0 flex items-center gap-1.5"
          >
            <span>Explore Now</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Mountain className="w-3.5 h-3.5 text-emerald-400" /> Salone Connect Registration
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Step {step} of 6</span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                className={`h-1.5 w-5 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Basic Identity & Anti-Scam Verification */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Kusheh! Welcome to Salone Connect</h2>
              <p className="text-xs text-slate-400 mt-1">
                Authentic Sierra Leonean community with free 14-day introductory VIP trial.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Isatu Bangura or Mohamed Sesay"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Your Age (18+)</label>
                  <input
                    type="number"
                    min="18"
                    max="80"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value, 10) || 18)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number (SMS OTP)</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+232 76 000000"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">I identify as</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['woman', 'man', 'non-binary'] as Gender[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-2 px-3 rounded-xl border text-xs font-medium capitalize transition-all ${
                        gender === g
                          ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 font-semibold'
                          : 'bg-slate-800/50 border-slate-700 text-slate-300'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Interested in meeting</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['men', 'women', 'everyone'] as Seeking[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSeeking(s)}
                      className={`py-2 px-3 rounded-xl border text-xs font-medium capitalize transition-all ${
                        seeking === s
                          ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 font-semibold'
                          : 'bg-slate-800/50 border-slate-700 text-slate-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
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
              <p className="text-xs text-slate-400 mt-1">
                Help compatible matches discover your spiritual values, trade, and academic background.
              </p>
            </div>

            <div className="space-y-3">
              {/* Religion */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Religion / Faith</label>
                <select
                  value={religion}
                  onChange={(e) => setReligion(e.target.value as Religion)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {RELIGION_OPTIONS.map((rel) => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                </select>
              </div>

              {/* Education Level */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Education Level</label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {EDUCATION_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

              {/* School / University Name */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">School / University</label>
                <input
                  type="text"
                  value={schoolOrUniversity}
                  onChange={(e) => setSchoolOrUniversity(e.target.value)}
                  placeholder="e.g. Fourah Bay College, Njala University, IPAM"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Occupation & Employer */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Occupation / Profession</label>
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="e.g. Civil Engineer, Nurse"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={companyOrEmployer}
                    onChange={(e) => setCompanyOrEmployer(e.target.value)}
                    placeholder="e.g. Ministry of Health, Self-Employed"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: 16 Districts of Sierra Leone & Homecoming Matcher */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Location & 16 Districts</h2>
              <p className="text-xs text-slate-400 mt-1">
                Pinpoint your district in Sierra Leone or your base in the global Diaspora.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Home District / Diaspora Hub</label>
                <select
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    if (e.target.value.includes('Freetown')) {
                      setRegion('freetown');
                      setLocationCity('Freetown');
                      setLocationCountry('Sierra Leone');
                    } else if (e.target.value.includes('Diaspora')) {
                      if (e.target.value.includes('United Kingdom')) {
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
                      setLocationCity(e.target.value.split(' ')[0]);
                      setLocationCountry('Sierra Leone');
                    }
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {SIERRA_LEONE_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              {/* Homecoming & Holiday Matcher */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Plane className="w-4 h-4" /> Homecoming & Holiday Matcher
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPlanningTrip}
                      onChange={(e) => setIsPlanningTrip(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <p className="text-[11px] text-slate-300 leading-snug">
                  Planning a visit home to Sierra Leone for December festivals or Easter holidays? Match with locals before your flight lands!
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

        {/* STEP 4: Lifestyle, Habits & Cultural Tags */}
        {step === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Lifestyle, Habits & Heritage</h2>
              <p className="text-xs text-slate-400 mt-1">
                Shared habits and Salone culture make for lasting compatibility.
              </p>
            </div>

            <div className="space-y-3">
              {/* Children Status */}
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
                          ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-semibold'
                          : 'bg-slate-800/40 border-slate-700 text-slate-300'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Social Habits */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Drinking</label>
                  <select
                    value={drinking}
                    onChange={(e) => setDrinking(e.target.value as HabitFrequency)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
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
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
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
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    {['Never', 'Occasionally', 'Sometimes', 'Frequently'].map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Favorite Football Club */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Football Club Supporter</label>
                <select
                  value={footballClub}
                  onChange={(e) => setFootballClub(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {FOOTBALL_CLUBS.map((club) => (
                    <option key={club} value={club}>{club}</option>
                  ))}
                </select>
              </div>

              {/* Dialects */}
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
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300'
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
              <p className="text-xs text-slate-400 mt-1">
                Whether looking for lifelong marriage, short-term dating, or new Salone friends / padi.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">What brings you here?</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'friendship', label: 'Friends / Padi', desc: 'Salone companionship' },
                    { id: 'long-term', label: 'Long-term', desc: 'Committed bond' },
                    { id: 'short-term', label: 'Short-term Dating', desc: 'Dating & learning' },
                    { id: 'marriage', label: 'Marriage Minded', desc: 'Ready for forever' },
                    { id: 'casual', label: 'Casual / Vibes', desc: 'Social & hangouts' },
                  ].map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setRelationshipGoal(goal.id as RelationshipGoal)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        relationshipGoal === goal.id
                          ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-800/50 border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="text-xs font-semibold">{goal.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{goal.desc}</div>
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
                  placeholder="Share a bit about your roots, your favorite memories of Salone, your personality..."
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Photos (Up to 10 Pictures) & Verification */}
        {step === 6 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white tracking-tight">Your Photos (Up to 10)</h2>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                  {photos.length} / 10 Added
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Upload up to 10 pictures. First photo will be your main profile card.
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {photos.map((src, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[3/4] rounded-xl overflow-hidden border border-slate-700 bg-slate-950 group"
                >
                  <img src={src} alt="user pic" className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <div className="absolute top-1 left-1 bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
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
                <label className="relative aspect-[3/4] rounded-xl border-2 border-dashed border-slate-700 hover:border-emerald-500 flex flex-col items-center justify-center cursor-pointer bg-slate-800/40 hover:bg-slate-800/70 transition-all text-slate-400 hover:text-emerald-400">
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  <Plus className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-semibold">Add Photo</span>
                </label>
              )}
            </div>

            {/* Photo Verification Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Photo Verification Shield</h4>
                  <p className="text-[11px] text-emerald-400">
                    {isVerified ? 'Shield Verified — Authentic Sierra Leonean' : 'Pending Selfie Pose Scan'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVerificationModal(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
              >
                {isVerified ? 'Re-scan Pose' : 'Scan Pose'}
              </button>
            </div>
          </div>
        )}

        {/* Modal Navigation Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="py-2 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.02]"
          >
            {step === 6 ? (
              <>
                <Sparkles className="w-4 h-4" /> Start 14-Day Free VIP Trial
              </>
            ) : (
              <>
                Continue <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

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
    </div>
  );
};
