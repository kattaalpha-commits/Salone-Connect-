import React, { useEffect } from 'react';
import { UserProfile } from '../types';
import confetti from 'canvas-confetti';
import { Heart, MessageCircle, Video, X, Sparkles } from 'lucide-react';

interface MatchCelebrationModalProps {
  matchedProfile: UserProfile | null;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (profile: UserProfile) => void;
  onStartVideoDate: (profile: UserProfile) => void;
}

export const MatchCelebrationModal: React.FC<MatchCelebrationModalProps> = ({
  matchedProfile,
  currentUser,
  isOpen,
  onClose,
  onStartChat,
  onStartVideoDate,
}) => {
  useEffect(() => {
    if (isOpen && matchedProfile) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#ffffff', '#f59e0b'],
        });
      } catch {
        // Fallback gracefully if canvas context restricted
      }
    }
  }, [isOpen, matchedProfile]);

  if (!isOpen || !matchedProfile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 text-center text-slate-100 shadow-2xl shadow-emerald-950/40">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Close match modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Celebration Title */}
        <div className="space-y-1 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Una Don Match!</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">It’s a Match!</h2>
          <p className="text-xs text-slate-300">
            You and <span className="text-emerald-400 font-semibold">{matchedProfile.name}</span> both liked each other’s Salone profile.
          </p>
        </div>

        {/* Side-by-Side Avatars with Heart Ring */}
        <div className="relative flex items-center justify-center gap-4 my-6">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-3 border-emerald-500 shadow-lg">
            <img
              src={currentUser.photos[0]}
              alt={currentUser.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="absolute z-10 w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl border-2 border-slate-900 animate-bounce">
            <Heart className="w-5 h-5 fill-current" />
          </div>

          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-3 border-emerald-500 shadow-lg">
            <img
              src={matchedProfile.photos[0]}
              alt={matchedProfile.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Cultural Compatibility Highlight */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5 mb-6 text-xs text-slate-300 space-y-1">
          <p className="font-semibold text-emerald-300">
            {matchedProfile.culturalHeritage.favoriteDish === currentUser.culturalHeritage.favoriteDish
              ? `Both of you love ${matchedProfile.culturalHeritage.favoriteDish}!`
              : `Shared dialects: ${matchedProfile.culturalHeritage.dialects.slice(0, 2).join(' & ')}`}
          </p>
          <p className="text-[11px] text-slate-400">
            Private messaging is now unlocked between the two of you.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => {
              onClose();
              onStartChat(matchedProfile);
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all hover:scale-[1.01]"
          >
            <MessageCircle className="w-4 h-4" /> Send First Private Message
          </button>

          <button
            onClick={() => {
              onClose();
              onStartVideoDate(matchedProfile);
            }}
            className="w-full py-3 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 font-medium text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Video className="w-4 h-4 text-emerald-400" /> Plan a Virtual Video Date
          </button>

          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white pt-2 transition-colors block mx-auto"
          >
            Keep Exploring Profiles
          </button>
        </div>
      </div>
    </div>
  );
};
