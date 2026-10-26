import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  ShieldCheck,
  MapPin,
  Sparkles,
  Heart,
  X,
  Flag,
  Ban,
  Utensils,
  Languages,
  Music,
  Compass,
  Briefcase,
  GraduationCap,
  MessageCircle,
  Video,
  ChevronLeft,
  ChevronRight,
  Images,
  BookOpen,
  Trophy,
  Plane,
  Baby,
  Dog,
  Wine,
} from 'lucide-react';

interface ProfileDetailModalProps {
  profile: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: (profile: UserProfile) => void;
  onPass: (profile: UserProfile) => void;
  onStartVideoCall?: (profile: UserProfile) => void;
  onOpenReport: (profile: UserProfile) => void;
  onBlock: (profile: UserProfile) => void;
  isMatched?: boolean;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  profile,
  isOpen,
  onClose,
  onLike,
  onPass,
  onStartVideoCall,
  onOpenReport,
  onBlock,
  isMatched = false,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!isOpen || !profile) return null;

  const photos = profile.photos && profile.photos.length > 0 ? profile.photos : ['/images/sl_dating_aminata_1792925241536.jpg'];

  const nextPhoto = () => {
    setActivePhotoIdx((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const prevPhoto = () => {
    setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const getGoalLabel = (goal: string) => {
    switch (goal) {
      case 'friendship':
        return 'Looking for Friends / Padi';
      case 'short-term':
        return 'Short-term Relationship / Dating';
      case 'marriage':
        return 'Marriage Minded';
      case 'casual':
        return 'Casual / Hangout';
      default:
        return 'Long-term Relationship';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden text-slate-100 shadow-2xl my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center transition-colors border border-white/20"
          aria-label="Close profile modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image & Carousel (Up to 10 photos) */}
        <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-slate-950">
          <img
            src={photos[activePhotoIdx]}
            alt={`${profile.name} photo ${activePhotoIdx + 1}`}
            className="w-full h-full object-cover transition-all duration-300"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

          {/* Photo Counter Badge */}
          <div className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] font-medium flex items-center gap-1.5">
            <Images className="w-3.5 h-3.5" />
            <span>{activePhotoIdx + 1} of {photos.length}</span>
          </div>

          {/* Arrows if multiple photos */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Badge Overlays */}
          <div className="absolute bottom-4 left-5 right-5 z-20">
            <div className="flex items-center gap-2 mb-1.5">
              {profile.isVerified && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white shadow-md text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Photo-Verified Match</span>
                </div>
              )}
              {profile.isSpotlight && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-bold shadow-md">
                  <Sparkles className="w-3 h-3" />
                  <span>Spotlight</span>
                </div>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">{profile.name}</h2>
              <span className="text-2xl font-light text-slate-300">{profile.age}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{profile.district || profile.locationCity}, {profile.locationCountry}</span>
              <span className="text-slate-500">·</span>
              <span>{profile.distanceKm < 100 ? `${profile.distanceKm} km away` : 'Diaspora connection'}</span>
            </div>
          </div>
        </div>

        {/* Thumbnail Strip */}
        {photos.length > 1 && (
          <div className="flex items-center gap-2 px-6 pt-3 overflow-x-auto bg-slate-900">
            {photos.map((src, i) => (
              <button
                key={i}
                onClick={() => setActivePhotoIdx(i)}
                className={`w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                  activePhotoIdx === i
                    ? 'border-emerald-500 scale-105 ring-2 ring-emerald-500/40'
                    : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={src} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[48vh] overflow-y-auto">
          {/* Homecoming & Holiday Matcher Alert (if applicable) */}
          {profile.homecoming?.isPlanningTrip && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <Plane className="w-4 h-4" />
                <span>Homecoming Visit: {profile.homecoming.arrivalMonth}</span>
              </div>
              <p className="text-[11px] text-slate-300">
                {profile.homecoming.note || `Visiting Sierra Leone in ${profile.homecoming.arrivalMonth}! Looking to connect with locals.`}
              </p>
            </div>
          )}

          {/* Profession & Education & Religion Badges */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <div className="bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-semibold text-emerald-300">
                {getGoalLabel(profile.relationshipGoal)}
              </div>

              {profile.religion && (
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>{profile.religion}</span>
                </div>
              )}

              {profile.profession && (
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{profile.profession} {profile.companyOrEmployer && `at ${profile.companyOrEmployer}`}</span>
                </div>
              )}

              {profile.schoolOrUniversity && (
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{profile.schoolOrUniversity}</span>
                </div>
              )}

              {profile.footballClub && (
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                  <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Fan of {profile.footballClub}</span>
                </div>
              )}
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/60">
              <h4 className="text-xs uppercase font-semibold tracking-wider text-emerald-400 mb-1">
                About Me
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed">{profile.bio}</p>
            </div>
          </div>

          {/* Family & Lifestyle Habits */}
          {(profile.childrenStatus || profile.habits) && (
            <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700 space-y-2">
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-300">
                Family & Lifestyle Habits
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                {profile.childrenStatus && (
                  <div className="flex items-center gap-1.5">
                    <Baby className="w-3.5 h-3.5 text-amber-400" />
                    <span>{profile.childrenStatus}</span>
                  </div>
                )}
                {profile.petPreference && (
                  <div className="flex items-center gap-1.5">
                    <Dog className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{profile.petPreference}</span>
                  </div>
                )}
                {profile.habits?.drinking && (
                  <div className="flex items-center gap-1.5">
                    <Wine className="w-3.5 h-3.5 text-fuchsia-400" />
                    <span>Drinks: {profile.habits.drinking}</span>
                  </div>
                )}
                {profile.habits?.smoking && (
                  <div className="flex items-center gap-1.5">
                    <Wine className="w-3.5 h-3.5 text-rose-400" />
                    <span>Smokes: {profile.habits.smoking}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sierra Leone Cultural Heritage Section */}
          <div className="bg-gradient-to-br from-emerald-950/30 to-slate-800/40 rounded-2xl p-5 border border-emerald-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4" /> Sierra Leone Cultural Roots
              </h4>
              <span className="text-[11px] text-slate-400">Authentic Heritage</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Languages className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dialects & Languages</span>
                </div>
                <div className="font-semibold text-slate-100">
                  {profile.culturalHeritage.dialects.join(', ')}
                </div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Utensils className="w-3.5 h-3.5 text-amber-400" />
                  <span>Favorite Salone Dish</span>
                </div>
                <div className="font-semibold text-slate-100">
                  {profile.culturalHeritage.favoriteDish}
                </div>
              </div>
            </div>

            {profile.culturalHeritage.saloneFact && (
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-xs text-emerald-300">
                <span className="font-semibold">Salone Fun Fact: </span>
                {profile.culturalHeritage.saloneFact}
              </div>
            )}
          </div>

          {/* Safety: Report or Block */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={() => onOpenReport(profile)}
              className="flex items-center gap-1.5 hover:text-rose-400 transition-colors"
            >
              <Flag className="w-3.5 h-3.5 text-rose-500" />
              <span>Report Community Violation</span>
            </button>
            <button
              onClick={() => onBlock(profile)}
              className="flex items-center gap-1.5 hover:text-slate-200 transition-colors"
            >
              <Ban className="w-3.5 h-3.5 text-slate-500" />
              <span>Block User</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          {isMatched ? (
            <>
              <button
                onClick={() => {
                  onClose();
                  if (onStartVideoCall) onStartVideoCall(profile);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Video className="w-4 h-4" /> Start Virtual Video Date
              </button>
              <button
                onClick={() => {
                  onClose();
                  onLike(profile);
                }}
                className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center justify-center gap-2 transition-all border border-slate-700"
              >
                <MessageCircle className="w-4 h-4" /> Chat
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  onClose();
                  onPass(profile);
                }}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-700 hover:bg-rose-500/10 hover:border-rose-500/40 text-slate-300 hover:text-rose-400 font-medium text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <X className="w-4 h-4" /> Pass
              </button>
              <button
                onClick={() => {
                  onClose();
                  onLike(profile);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all"
              >
                <Heart className="w-4 h-4 fill-current" /> Send Like
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
