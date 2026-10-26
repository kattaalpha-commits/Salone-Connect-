import React from 'react';
import { UserProfile } from '../types';
import { Heart, Sparkles, ShieldCheck, Lock, ArrowRight } from 'lucide-react';

interface LikesViewProps {
  likers: UserProfile[];
  isPremium: boolean;
  onOpenPremium: () => void;
  onMatchUser: (profile: UserProfile) => void;
  onViewProfile: (profile: UserProfile) => void;
}

export const LikesView: React.FC<LikesViewProps> = ({
  likers,
  isPremium,
  onOpenPremium,
  onMatchUser,
  onViewProfile,
}) => {
  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-white">People Who Liked You</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs">
              {likers.length} Admirers
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {isPremium
              ? 'VIP Gold Active: All admirer profiles are unblurred. Match instantly with 1-click!'
              : 'Upgrade to We Connect VIP to reveal everyone who liked your profile.'}
          </p>
        </div>

        {!isPremium && (
          <button
            onClick={onOpenPremium}
            className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shrink-0 shadow-lg shadow-amber-500/20 transition-transform hover:scale-105"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Unlock Admirers with VIP</span>
          </button>
        )}
      </div>

      {/* Grid of Admirers */}
      {likers.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/50 rounded-3xl border border-slate-800 space-y-3">
          <Heart className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Admirers Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Keep your profile active, ensure your photo verification shield is active, and check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {likers.map((profile) => (
            <div
              key={profile.id}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 group"
            >
              <img
                src={profile.photos[0]}
                alt={isPremium ? profile.name : 'Admirer photo'}
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  isPremium ? 'group-hover:scale-105' : 'filter blur-md scale-110'
                }`}
                referrerPolicy="no-referrer"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Verified Badge */}
              {profile.isVerified && (
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold flex items-center gap-1 shadow">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              )}

              {/* Bottom Card Content */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5">
                {isPremium ? (
                  <div className="space-y-1.5">
                    <div>
                      <h4 className="font-bold text-sm text-white">{profile.name}, {profile.age}</h4>
                      <p className="text-[11px] text-slate-300 truncate">{profile.locationCity}</p>
                    </div>

                    <button
                      onClick={() => onMatchUser(profile)}
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" /> Match Now
                    </button>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <div className="w-8 h-8 rounded-full bg-black/60 border border-white/20 flex items-center justify-center mx-auto text-amber-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <p className="text-[11px] font-semibold text-slate-200">
                      Liked you from {profile.locationCity.split(' ')[0]}
                    </p>
                    <button
                      onClick={onOpenPremium}
                      className="w-full py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold hover:bg-amber-500 hover:text-slate-950 transition-colors"
                    >
                      Unblur Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
