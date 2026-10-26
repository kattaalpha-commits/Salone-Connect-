import React, { useState } from 'react';
import { UserProfile, RelationshipGoal } from '../types';
import {
  User,
  ShieldCheck,
  Crown,
  Settings,
  Bell,
  Ban,
  X,
  Edit3,
  Camera,
  Check,
  Sparkles,
  Plus,
  Trash2,
  Images,
  Smartphone,
  Share2,
} from 'lucide-react';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onOpenVerification: () => void;
  onOpenPremium: () => void;
  onOpenPilotHub?: () => void;
  onOpenShare?: () => void;
  blockedUsers: string[];
  onUnblockUser: (id: string) => void;
  allProfiles: UserProfile[];
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onOpenVerification,
  onOpenPremium,
  onOpenPilotHub,
  onOpenShare,
  blockedUsers,
  onUnblockUser,
  allProfiles,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'photos' | 'safety' | 'membership'>('profile');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(currentUser.bio);
  const [professionInput, setProfessionInput] = useState(currentUser.profession);
  const [goalInput, setGoalInput] = useState<RelationshipGoal>(currentUser.relationshipGoal);

  const photos = currentUser.photos && currentUser.photos.length > 0
    ? currentUser.photos
    : ['/images/sl_dating_aminata_1792925241536.jpg'];

  if (!isOpen) return null;

  const handleSaveBio = () => {
    onUpdateUser({
      ...currentUser,
      bio: bioInput,
      profession: professionInput,
      relationshipGoal: goalInput,
    });
    setIsEditingBio(false);
  };

  const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (photos.length >= 10) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateUser({
            ...currentUser,
            photos: [...photos, event.target.result as string].slice(0, 10),
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (idx: number) => {
    if (photos.length <= 1) return;
    onUpdateUser({
      ...currentUser,
      photos: photos.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close settings"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Profile Summary */}
        <div className="flex items-center gap-4 pb-5 border-b border-slate-800">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-500 shrink-0">
            <img
              src={photos[0]}
              alt={currentUser.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={onOpenVerification}
              className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
              title="Verify photo"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white truncate">{currentUser.name}</h3>
              {currentUser.isVerified && (
                <span className="p-0.5 rounded-full bg-emerald-500 text-white" title="Photo-Verified">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              )}
              {currentUser.isPremium && (
                <span className="p-0.5 rounded-full bg-amber-500 text-slate-950" title="VIP Pass Member">
                  <Crown className="w-4 h-4" />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">{currentUser.locationCity}, {currentUser.locationCountry}</p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 mt-0.5">
              <span>Goal: {currentUser.relationshipGoal}</span>
              <span>·</span>
              <span>{photos.length}/10 Photos</span>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-slate-800 py-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'profile'
                ? 'bg-slate-800 text-emerald-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Edit Profile
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'photos'
                ? 'bg-slate-800 text-emerald-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Photos ({photos.length}/10)
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'safety'
                ? 'bg-slate-800 text-emerald-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Safety & Blocked ({blockedUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('membership')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'membership'
                ? 'bg-slate-800 text-emerald-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            VIP ($5/mo)
          </button>
        </div>

        {/* Tab 1: Profile Details Editing */}
        {activeTab === 'profile' && (
          <div className="py-4 space-y-4 max-h-[50vh] overflow-y-auto pr-1">
            {/* Relationship Intention Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Looking For
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'friendship', label: 'Friends / Padi' },
                  { id: 'long-term', label: 'Long-term' },
                  { id: 'short-term', label: 'Short-term' },
                  { id: 'marriage', label: 'Marriage Minded' },
                  { id: 'casual', label: 'Casual / Vibes' },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      setGoalInput(g.id as RelationshipGoal);
                      onUpdateUser({ ...currentUser, relationshipGoal: g.id as RelationshipGoal });
                    }}
                    className={`p-2 rounded-xl text-xs font-medium border text-left transition-colors ${
                      currentUser.relationshipGoal === g.id
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 font-bold'
                        : 'bg-slate-800/40 border-slate-700 text-slate-300'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Profession */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Profession / Career
              </label>
              <input
                type="text"
                value={professionInput}
                onChange={(e) => setProfessionInput(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Bio */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">About Me (Bio)</label>
                {!isEditingBio && (
                  <button
                    onClick={() => setIsEditingBio(true)}
                    className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" /> Edit
                  </button>
                )}
              </div>

              {isEditingBio ? (
                <div className="space-y-2">
                  <textarea
                    rows={4}
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditingBio(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveBio}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {currentUser.bio}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Photos (Manage up to 10 pictures) */}
        {activeTab === 'photos' && (
          <div className="py-4 space-y-4 max-h-[50vh] overflow-y-auto pr-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Your Photo Album</h4>
                <p className="text-[11px] text-slate-400">You can upload up to 10 photos of yourself.</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                {photos.length} / 10
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {photos.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-[3/4] rounded-xl overflow-hidden border border-slate-700 bg-slate-950 group"
                >
                  <img src={src} alt="user pic" className="w-full h-full object-cover" />
                  {i === 0 && (
                    <div className="absolute top-1 left-1 bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                      Main
                    </div>
                  )}
                  {photos.length > 1 && (
                    <button
                      onClick={() => handleRemovePhoto(i)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-80 hover:opacity-100 shadow transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}

              {photos.length < 10 && (
                <label className="relative aspect-[3/4] rounded-xl border-2 border-dashed border-slate-700 hover:border-emerald-500 flex flex-col items-center justify-center cursor-pointer bg-slate-800/40 hover:bg-slate-800/70 transition-all text-slate-400 hover:text-emerald-400">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAddPhoto}
                    className="hidden"
                  />
                  <Plus className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-semibold text-center px-1">Add Photo</span>
                </label>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Safety & Blocked */}
        {activeTab === 'safety' && (
          <div className="py-4 space-y-4 max-h-[50vh] overflow-y-auto">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white">Blocked Profiles</h4>
              <p className="text-[11px] text-slate-400">
                Blocked users cannot see your profile, match with you, or message you.
              </p>
            </div>

            {blockedUsers.length === 0 ? (
              <p className="text-xs text-slate-500 p-4 text-center bg-slate-800/30 rounded-xl">
                You have not blocked any profiles.
              </p>
            ) : (
              <div className="space-y-2">
                {blockedUsers.map((id) => {
                  const blockedProfile = allProfiles.find((p) => p.id === id);
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Ban className="w-4 h-4 text-rose-400" />
                        <span className="font-semibold text-slate-200">
                          {blockedProfile ? blockedProfile.name : `User ${id}`}
                        </span>
                      </div>
                      <button
                        onClick={() => onUnblockUser(id)}
                        className="text-xs text-emerald-400 hover:underline"
                      >
                        Unblock
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: VIP Membership */}
        {activeTab === 'membership' && (
          <div className="py-4 space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Crown className="w-4 h-4" /> Membership Plan
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    currentUser.isPremium
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {currentUser.isPremium ? 'VIP PASS' : 'FREE TIER (10 trials/day)'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {currentUser.isPremium
                  ? 'Your profile is highlighted with VIP Spotlight. Enjoy unlimited daily trials, unlimited matches, and unlimited messages.'
                  : 'Free tier includes 10 daily profile trials, max 2 matches, and 2 messages per day. Upgrade to VIP for just $5/mo (NLe 115) or $20 for 3 months.'}
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenPremium();
              }}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              {currentUser.isPremium ? 'Manage Subscription' : 'Upgrade to Salone Connect VIP'}
            </button>

            {onOpenShare && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenShare();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600/20 to-teal-600/20 hover:from-emerald-600/30 hover:to-teal-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Share2 className="w-4 h-4 text-emerald-400" />
                Share App with Testers & Friends
              </button>
            )}

            {onOpenPilotHub && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPilotHub();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                Launch Pilot APK Testing Hub
              </button>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onOpenShare && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenShare();
                }}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share App</span>
              </button>
            )}
            {onOpenPilotHub && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPilotHub();
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Pilot APK</span>
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
