import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, SponsoredProfileCard } from '../types';
import {
  ShieldCheck,
  MapPin,
  Sparkles,
  Heart,
  X,
  Star,
  RotateCcw,
  Send,
  Search,
  Info,
  ExternalLink,
} from 'lucide-react';

interface DiscoveryCardProps {
  profile?: UserProfile;
  sponsoredCard?: SponsoredProfileCard;
  culturalScore?: number;
  onRewind?: () => void;
  onPass?: () => void;
  onSuperLike?: () => void;
  onLike?: () => void;
  onDirectMessage?: () => void;
  onOpenDetails?: () => void;
  remainingTrials?: number;
}

export const DiscoveryCard: React.FC<DiscoveryCardProps> = ({
  profile,
  sponsoredCard,
  culturalScore = 80,
  onRewind,
  onPass,
  onSuperLike,
  onLike,
  onDirectMessage,
  onOpenDetails,
  remainingTrials,
}) => {
  const [photoIndex, setPhotoIndex] = useState(0);

  // Touch & Drag Gesture Mechanics
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const touchMovedRef = useRef<boolean>(false);

  // Reset photo index when profile changes
  useEffect(() => {
    setPhotoIndex(0);
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
    touchMovedRef.current = false;
  }, [profile?.id, sponsoredCard?.id]);

  const photos = profile?.photos && profile.photos.length > 0
    ? profile.photos
    : ['/images/sl_dating_aminata_1792925241536.jpg'];

  // Handle Story Photo Tap: Left 1/3 = prev, Right 2/3 = next
  const handlePhotoTap = (clientX: number) => {
    if (!cardRef.current || photos.length <= 1) return;
    const rect = cardRef.current.getBoundingClientRect();
    const tapX = clientX - rect.left;
    const isLeftThird = tapX < rect.width * 0.33;

    if (isLeftThird) {
      setPhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
    } else {
      setPhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
    }
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    touchMovedRef.current = false;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragStartRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.x;
    const dy = touch.clientY - dragStartRef.current.y;
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
      touchMovedRef.current = true;
    }
    setDragOffset({ x: dx, y: dy });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!dragStartRef.current) return;
    const { x, y } = dragOffset;
    const swipeThreshold = 95;

    // If minimal drag, treat as story photo tap
    if (!touchMovedRef.current && Math.abs(x) < 10 && Math.abs(y) < 10) {
      handlePhotoTap(dragStartRef.current.x);
      setDragOffset({ x: 0, y: 0 });
      setIsDragging(false);
      dragStartRef.current = null;
      return;
    }

    if (x > swipeThreshold) {
      // Swiped Right -> Like
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(25);
      setDragOffset({ x: 500, y: y });
      setTimeout(() => {
        onLike?.();
      }, 150);
    } else if (x < -swipeThreshold) {
      // Swiped Left -> Pass
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
      setDragOffset({ x: -500, y: y });
      setTimeout(() => {
        onPass?.();
      }, 150);
    } else if (y < -swipeThreshold && Math.abs(x) < 70) {
      // Swiped Up -> Super Like
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([25, 40, 25]);
      setDragOffset({ x: 0, y: -500 });
      setTimeout(() => {
        onSuperLike?.();
      }, 150);
    } else {
      // Reset card position smoothly
      setDragOffset({ x: 0, y: 0 });
    }
    setIsDragging(false);
    dragStartRef.current = null;
  };

  // Mouse handlers for desktop testers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    touchMovedRef.current = false;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
      touchMovedRef.current = true;
    }
    setDragOffset({ x: dx, y: dy });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || !dragStartRef.current) return;
    const { x, y } = dragOffset;
    const swipeThreshold = 95;

    if (!touchMovedRef.current && Math.abs(x) < 10 && Math.abs(y) < 10) {
      handlePhotoTap(e.clientX);
      setDragOffset({ x: 0, y: 0 });
      setIsDragging(false);
      dragStartRef.current = null;
      return;
    }

    if (x > swipeThreshold) {
      setDragOffset({ x: 500, y: y });
      setTimeout(() => onLike?.(), 150);
    } else if (x < -swipeThreshold) {
      setDragOffset({ x: -500, y: y });
      setTimeout(() => onPass?.(), 150);
    } else if (y < -swipeThreshold && Math.abs(x) < 70) {
      setDragOffset({ x: 0, y: -500 });
      setTimeout(() => onSuperLike?.(), 150);
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
    setIsDragging(false);
    dragStartRef.current = null;
  };

  // SPONSORED CARD FALLBACK
  if (sponsoredCard) {
    return (
      <div
        ref={cardRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${dragOffset.x * 0.05}deg)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-[3/4.6] rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-amber-500/40 select-none group touch-none cursor-grab active:cursor-grabbing"
      >
        <img
          src={sponsoredCard.imageUrl}
          alt={sponsoredCard.brandName}
          draggable={false}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30 pointer-events-none" />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-bold shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Partner</span>
          </div>
          <span className="text-[10px] bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-slate-300">
            {sponsoredCard.category}
          </span>
        </div>

        <div className="absolute bottom-24 left-5 right-5 text-white z-10 pointer-events-auto">
          <h2 className="text-2xl font-black text-white drop-shadow-md mb-0.5">
            {sponsoredCard.brandName}
          </h2>
          <p className="text-xs text-amber-300 font-semibold mb-2">{sponsoredCard.tagline}</p>
          <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{sponsoredCard.location}</span>
          </div>
          <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed mb-3">
            {sponsoredCard.description}
          </p>
          <button
            onClick={() => alert(`Visiting ${sponsoredCard.brandName}...`)}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.99]"
          >
            <span>{sponsoredCard.callToAction}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="absolute bottom-5 left-4 right-4 flex items-center justify-center gap-4 z-20">
          <button
            onClick={onPass}
            className="w-13 h-13 rounded-full bg-[#26262b] hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700/80 flex items-center justify-center shadow-lg transition-all"
            title="Pass"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            onClick={onLike}
            className="w-13 h-13 rounded-full bg-[#26262b] hover:bg-rose-500 text-rose-500 hover:text-white border border-slate-700/80 flex items-center justify-center shadow-xl transition-all"
            title="Like"
          >
            <Heart className="w-6 h-6 fill-current" />
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  // Stamp visual feedback opacities
  const likeOpacity = Math.min(1, Math.max(0, (dragOffset.x - 20) / 70));
  const passOpacity = Math.min(1, Math.max(0, (-dragOffset.x - 20) / 70));
  const superLikeOpacity = Math.min(1, Math.max(0, (-dragOffset.y - 20) / 70));

  const intentionLabel = profile.looking_for || (
    profile.relationshipGoal === 'long-term' ? 'Long-term partner' :
    profile.relationshipGoal === 'casual' ? 'Casual dating' :
    profile.relationshipGoal === 'friendship' ? 'Friends first' :
    profile.relationshipGoal === 'marriage' ? 'Long-term partner' : 'Friends first'
  );

  return (
    <div
      ref={cardRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${dragOffset.x * 0.05}deg)`,
        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-[3/4.6] rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800 select-none group touch-none cursor-grab active:cursor-grabbing"
    >
      {/* Background Photo */}
      <img
        src={photos[photoIndex]}
        alt={profile.name}
        referrerPolicy="no-referrer"
        draggable={false}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102 pointer-events-none"
      />

      {/* Dynamic Gesture Stamps */}
      {/* LIKE Stamp (Right Swipe) */}
      <div
        style={{ opacity: likeOpacity }}
        className="absolute top-12 left-6 z-30 pointer-events-none border-4 border-rose-500 text-rose-400 px-4 py-1.5 rounded-2xl font-black text-2xl uppercase tracking-widest -rotate-12 bg-rose-950/70 backdrop-blur-sm shadow-2xl flex items-center gap-2"
      >
        <Heart className="w-6 h-6 fill-current" />
        <span>LIKE</span>
      </div>

      {/* PASS Stamp (Left Swipe) */}
      <div
        style={{ opacity: passOpacity }}
        className="absolute top-12 right-6 z-30 pointer-events-none border-4 border-slate-400 text-slate-300 px-4 py-1.5 rounded-2xl font-black text-2xl uppercase tracking-widest rotate-12 bg-slate-950/80 backdrop-blur-sm shadow-2xl flex items-center gap-2"
      >
        <X className="w-6 h-6" />
        <span>PASS</span>
      </div>

      {/* SUPER LIKE Stamp (Up Swipe) */}
      <div
        style={{ opacity: superLikeOpacity }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 z-30 pointer-events-none border-4 border-sky-400 text-sky-300 px-5 py-2 rounded-2xl font-black text-xl uppercase tracking-wider bg-slate-950/85 backdrop-blur-sm shadow-2xl flex items-center gap-2 whitespace-nowrap"
      >
        <Star className="w-5 h-5 fill-current text-sky-400" />
        <span>SUPER LIKE</span>
      </div>

      {/* Deep Romantic Dark Overlay Scrim for Perfect Typography Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-black/35 pointer-events-none" />

      {/* Multi-Photo Dashed Progress Bar at Top */}
      {photos.length > 0 && (
        <div className="absolute top-3 left-3 right-3 z-30 flex gap-1.5 items-center pointer-events-none">
          {photos.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full transition-all duration-200 ${
                idx === photoIndex
                  ? 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.85)]'
                  : idx < photoIndex
                  ? 'bg-white/70'
                  : 'bg-white/25'
              }`}
            />
          ))}
        </div>
      )}

      {/* Top Bar on Card: Verified Tag & Match Affinity */}
      <div className="absolute top-6 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2">
          {profile.isVerified && (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white backdrop-blur-md shadow-lg text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified</span>
            </div>
          )}

          {profile.isSpotlight && (
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[11px] font-bold shadow-md">
              <Sparkles className="w-3 h-3" />
              <span>Spotlight</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 text-rose-300 backdrop-blur-md border border-rose-500/30 text-[11px] font-bold">
          <Sparkles className="w-3 h-3 text-rose-400" />
          <span>{culturalScore}% Match</span>
        </div>
      </div>

      {/* Bottom Overlay Gradient with Strict 3-Line Text Specification */}
      <div className="absolute bottom-22 left-5 right-5 text-white z-10 pointer-events-auto">
        {/* Line 1: Name and Age with Verification Badge */}
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h2 className="text-3xl font-extrabold tracking-tight drop-shadow-md text-white">
            {profile.name}
          </h2>
          <span className="text-2xl font-light text-slate-200">{profile.age}</span>
          {profile.isVerified && (
            <span className="p-0.5 rounded-full bg-emerald-500 text-white shadow-sm" title="Verified Profile">
              <ShieldCheck className="w-4 h-4" />
            </span>
          )}
          {profile.username && (
            <span className="text-xs text-rose-300/90 font-mono font-medium drop-shadow ml-1">
              @{profile.username}
            </span>
          )}
        </div>

        {/* Line 2: Search icon with 'Looking for' label */}
        <div className="flex items-center gap-1.5 text-xs text-slate-300/90 font-medium mb-0.5">
          <Search className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="tracking-wide">Looking for</span>
        </div>

        {/* Line 3: Relationship Intention in Bold Text */}
        <div className="text-base font-bold text-white tracking-tight drop-shadow-sm mb-2">
          {intentionLabel}
        </div>

        {/* Location & District pill */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 font-medium mb-1">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>{profile.district || profile.locationCity}</span>
          </div>
          <span className="text-slate-500">·</span>
          <span>{profile.culturalHeritage.favoriteDish}</span>
        </div>

        <div className="flex items-center justify-between mt-1">
          <button
            onClick={onOpenDetails}
            className="text-[11px] text-rose-300 hover:text-white font-semibold flex items-center gap-1 transition-colors"
          >
            <Info className="w-3 h-3" /> View Bio & {photos.length} Photos
          </button>
          {remainingTrials !== undefined && (
            <span className="text-[10px] text-slate-400">
              {remainingTrials} free trials left
            </span>
          )}
        </div>
      </div>

      {/* Floating Action Bar (Exact 5 Circular Buttons Matching Layout) */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2.5 sm:gap-3.5 z-20">
        {/* 1. Undo / Rewind (Gray, circular arrow) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRewind?.();
          }}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#26262b] hover:bg-slate-800 text-amber-400 hover:text-amber-300 border border-slate-700/80 flex items-center justify-center shadow-lg active:scale-92 transition-all"
          title="Undo / Rewind"
          aria-label="Undo last swipe"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* 2. Pass (Dark gray with white 'X') */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPass?.();
          }}
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#26262b] hover:bg-rose-600/90 text-slate-200 hover:text-white border border-slate-700/80 flex items-center justify-center shadow-xl active:scale-92 transition-all"
          title="Pass profile (or swipe left)"
          aria-label="Pass profile"
        >
          <X className="w-7 h-7" />
        </button>

        {/* 3. Super Like (Dark gray with blue/white star) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSuperLike?.();
          }}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#26262b] hover:bg-sky-500 text-sky-400 hover:text-white border border-slate-700/80 flex items-center justify-center shadow-lg active:scale-92 transition-all"
          title="Super Like / Padi Boost (or swipe up)"
          aria-label="Super Like"
        >
          <Star className="w-5 h-5 fill-current" />
        </button>

        {/* 4. Like (Dark gray with bright red/rose heart) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike?.();
          }}
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#26262b] hover:bg-rose-600 text-rose-500 hover:text-white border border-slate-700/80 flex items-center justify-center shadow-xl active:scale-92 transition-all"
          title="Like profile (or swipe right)"
          aria-label="Like profile"
        >
          <Heart className="w-7 h-7 fill-current" />
        </button>

        {/* 5. Direct Message (Dark gray with paper plane icon) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDirectMessage?.();
          }}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#26262b] hover:bg-emerald-500 text-emerald-400 hover:text-white border border-slate-700/80 flex items-center justify-center shadow-lg active:scale-92 transition-all"
          title="Direct Message / Quick Intro"
          aria-label="Direct Message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
