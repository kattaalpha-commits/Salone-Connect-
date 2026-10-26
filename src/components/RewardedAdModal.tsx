import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Play, Zap, MessageSquarePlus, Clock, X, Volume2 } from 'lucide-react';

interface RewardedAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed: (rewardType: 'swipes' | 'messages' | 'boost') => void;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  isOpen,
  onClose,
  onRewardClaimed,
}) => {
  const [selectedReward, setSelectedReward] = useState<'swipes' | 'messages' | 'boost'>('swipes');
  const [adState, setAdState] = useState<'select' | 'watching' | 'completed'>('select');
  const [countdown, setCountdown] = useState(15); // 15s quick simulator for rapid UX test

  useEffect(() => {
    let timer: any;
    if (adState === 'watching' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else if (adState === 'watching' && countdown === 0) {
      setAdState('completed');
    }
    return () => clearInterval(timer);
  }, [adState, countdown]);

  if (!isOpen) return null;

  const handleStartAd = () => {
    setCountdown(15);
    setAdState('watching');
  };

  const handleClaim = () => {
    onRewardClaimed(selectedReward);
    setAdState('select');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl my-auto">
        {adState !== 'watching' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* STEP 1: SELECT REWARD */}
        {adState === 'select' && (
          <div className="space-y-4">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Watch a Short Ad, Get Rewarded</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Select your reward, watch a quick 15-second sponsor video, and continue exploring Salone Connect.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  id: 'swipes',
                  title: '5 Extra Profile Swipes',
                  desc: 'Keep exploring fellow Sierra Leoneans today',
                  icon: <Zap className="w-4 h-4 text-emerald-400" />,
                },
                {
                  id: 'messages',
                  title: '10 Additional Messages',
                  desc: 'Continue your conversations with your matches',
                  icon: <MessageSquarePlus className="w-4 h-4 text-blue-400" />,
                },
                {
                  id: 'boost',
                  title: '1-Hour Profile Boost',
                  desc: 'Push your profile to the top of the Lion Mountains stack',
                  icon: <Clock className="w-4 h-4 text-amber-400" />,
                },
              ].map((reward) => (
                <div
                  key={reward.id}
                  onClick={() => setSelectedReward(reward.id as any)}
                  className={`p-3 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                    selectedReward === reward.id
                      ? 'bg-emerald-600/20 border-emerald-500 ring-1 ring-emerald-500/50'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                    {reward.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white">{reward.title}</h4>
                    <p className="text-[11px] text-slate-400">{reward.desc}</p>
                  </div>
                  <input
                    type="radio"
                    name="rewardRadio"
                    checked={selectedReward === reward.id}
                    onChange={() => setSelectedReward(reward.id as any)}
                    className="accent-emerald-500"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleStartAd}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all active:scale-[0.99]"
            >
              <Play className="w-4 h-4 fill-current" />
              Watch 15s Sponsor Video
            </button>
          </div>
        )}

        {/* STEP 2: WATCHING AD WITH PROGRESS BAR */}
        {adState === 'watching' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold text-emerald-400">Sponsored Ad playing</span>
              <div className="flex items-center gap-1.5 font-mono bg-slate-800 px-2.5 py-1 rounded-full">
                <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Reward in {countdown}s</span>
              </div>
            </div>

            {/* Video Creative Mockup */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex flex-col justify-between p-4 shadow-inner">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
                alt="Ad Creative"
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className="relative z-10 flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/60 text-amber-400 border border-amber-500/30">
                  Featured Partner
                </span>
              </div>

              <div className="relative z-10 space-y-1">
                <h4 className="text-sm font-bold text-white">Bintumani Hotel & Rooftop Bar</h4>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Experience romantic candlelight dining with breathtaking views over the Lion Mountains in Freetown.
                </p>
              </div>
            </div>

            {/* Countdown Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-1000"
                style={{ width: `${((15 - countdown) / 15) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-center text-slate-400">
              Please watch the video to the end to unlock your reward.
            </p>
          </div>
        )}

        {/* STEP 3: COMPLETED */}
        {adState === 'completed' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Reward Unlocked!</h3>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                {selectedReward === 'swipes' && 'You received 5 extra profile trials for today!'}
                {selectedReward === 'messages' && 'You received 10 additional messages for today!'}
                {selectedReward === 'boost' && 'Your profile visibility has been boosted for 1 hour!'}
              </p>
            </div>

            <button
              onClick={handleClaim}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all"
            >
              Claim & Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
