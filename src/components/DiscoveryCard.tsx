import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, SponsoredProfileCard } from '../types';
import {
  ShieldCheck,
  MapPin,
  Sparkles,
  Heart,
  X,
  Star,
  Info,
  Utensils,
  Languages,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';

interface DiscoveryCardProps {
  profile?: UserProfile;
  sponsoredCard?: SponsoredProfileCard;
  culturalScore?: number;
  onLike?: () => void;
  onPass?: () => void;
  onSuperLike?: () => void;
  onOpenDetails?: () => void;
  remainingTrials?: number;
}

export const DiscoveryCard: React.FC<DiscoveryCardProps> = ({
  profile,
  sponsoredCard,
  culturalScore = 80,
  onLike,
  onPass,
  onSuperLike,
  onOpenDetails,
  remainingTrials,
}) => {
  const [photoIndex, setPhotoIndex] = useState(0);

  // Touch & Drag Gesture Mechanics
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Reset photo index when profile changes
  useEffect(() => {
    setPhotoIndex(0);
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
  }, [profile?.id, sponsoredCard?.id]);

  // Handle Touch Start
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    setIsDragging(true);
  };

  // Handle Touch Move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragStartRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.x;
    const dy = touch.clientY - dragStartRef.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  // Handle Touch End / Gesture Trigger
  const handleTouchEnd = () => {
    if (!dragStartRef.current) return;
    const { x, y } = dragOffset;
    setIsDragging(false);
    dragStartRef.current = null;

    const swipeThreshold = 80;

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
    } else if (y < -swipeThreshold && Math.abs(x) < 60) {
      // Swiped Up -> Super Like / Padi Boost
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([25, 40, 25]);
      setDragOffset({ x: 0, y: -500 });
      setTimeout(() => {
        onSuperLike?.();
      }, 150);
    } else {
      // Reset card position smoothly
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Mouse Drag Handlers for Desktop Testers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag with primary mouse button, ignore button clicks inside
    if (e.button !== 0) return;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    handleTouchEnd();
  };

  // IF NATIVE SPONSORED PROFILE CARD
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
          transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${dragOffset.x * 0.06}deg)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-[3/4.3] rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-amber-500/40 select-none group touch-none cursor-grab active:cursor-grabbing"
      >
        <img
          src={sponsoredCard.imageUrl}
          alt={sponsoredCard.brandName}
          draggable={false}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30 pointer-events-none" />

        {/* Top Sponsored Badge */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-bold shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sponsored Partner</span>
          </div>
          <span className="text-[10px] bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-slate-300">
            {sponsoredCard.category}
          </span>
        </div>

        {/* Bottom Details Overlay */}
        <div className="absolute bottom-20 left-4 right-4 text-white z-10 pointer-events-auto">
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

        {/* Action Controls to Dismiss or Like Sponsor */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-4 z-20">
          <button
            onClick={onPass}
            className="w-12 h-12 rounded-full bg-slate-900/90 hover:bg-rose-500 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center shadow-lg transition-all"
            title="Next profile"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={onLike}
            className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-xl transition-all"
            title="Explore sponsor"
          >
            <Heart className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const photos = profile.photos && profile.photos.length > 0 ? profile.photos : ['/images/sl_dating_aminata_1792925241536.jpg'];

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const getGoalBadge = (goal: string) => {
    switch (goal) {
      case 'friendship':
        return 'Looking for Friends / Padi';
      case 'short-term':
        return 'Short-term Dating';
      case 'marriage':
        return 'Marriage Minded';
      case 'casual':
        return 'Casual / Hangout';
      default:
        return 'Long-term Love';
    }
  };

  // Stamp opacities
  const likeOpacity = Math.min(1, Math.max(0, (dragOffset.x - 20) / 70));
  const passOpacity = Math.min(1, Math.max(0, (-dragOffset.x - 20) / 70));
  const superLikeOpacity = Math.min(1, Math.max(0, (-dragOffset.y - 20) / 70));

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
        transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${dragOffset.x * 0.06}deg)`,
        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-[3/4.3] rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800 select-none group touch-none cursor-grab active:cursor-grabbing"
    >
      {/* Background Image */}
      <img
        src={photos[photoIndex]}
        alt={profile.name}
        referrerPolicy="no-referrer"
        draggable={false}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
      />

      {/* Dynamic Gesture Stamps */}
      {/* LIKE Stamp (Right Swipe) */}
      <div
        style={{ opacity: likeOpacity }}
        className="absolute top-12 left-6 z-30 pointer-events-none border-4 border-emerald-400 text-emerald-400 px-4 py-1.5 rounded-2xl font-black text-2xl uppercase tracking-widest -rotate-12 bg-emerald-950/70 backdrop-blur-sm shadow-2xl flex items-center gap-2"
      >
        <Heart className="w-6 h-6 fill-current" />
        <span>LIKE</span>
      </div>

      {/* PASS Stamp (Left Swipe) */}
      <div
        style={{ opacity: passOpacity }}
        className="absolute top-12 right-6 z-30 pointer-events-none border-4 border-rose-500 text-rose-500 px-4 py-1.5 rounded-2xl font-black text-2xl uppercase tracking-widest rotate-12 bg-rose-950/70 backdrop-blur-sm shadow-2xl flex items-center gap-2"
      >
        <X className="w-6 h-6" />
        <span>PASS</span>
      </div>

      {/* SUPER LIKE / PADI BOOST Stamp (Up Swipe) */}
      <div
        style={{ opacity: superLikeOpacity }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 z-30 pointer-events-none border-4 border-amber-400 text-amber-300 px-5 py-2 rounded-2xl font-black text-xl uppercase tracking-wider bg-slate-950/80 backdrop-blur-sm shadow-2xl flex items-center gap-2 whitespace-nowrap"
      >
        <Star className="w-5 h-5 fill-current text-amber-400" />
        <span>PADI BOOST</span>
      </div>

      {/* Gradient Scrim for Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30 pointer-events-none" />

      {/* Multi-Photo Indicators Bar (Up to 10 dots/dashes) */}
      {photos.length > 1 && (
        <div className="absolute top-2.5 left-4 right-4 z-20 flex gap-1 items-center">
          {photos.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                idx === photoIndex ? 'bg-white shadow' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      )}

      {/* Prev / Next Photo Tap Zones */}
      {photos.length > 1 && (
        <>
          <button
            onClick={prevPhoto}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextPhoto}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next photo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Top Bar on Card: Verified Tag & Cultural Score */}
      <div className="absolute top-6 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2">
          {profile.isVerified && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 text-white backdrop-blur-md shadow-lg text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Photo-Verified</span>
            </div>
          )}

          {profile.isSpotlight && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-bold shadow-md">
              <Sparkles className="w-3 h-3" />
              <span>Spotlight</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-black/60 text-emerald-300 backdrop-blur-md border border-emerald-500/30 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{culturalScore}% Match</span>
        </div>
      </div>

      {/* Profile Details Content Overlay */}
      <div className="absolute bottom-20 left-4 right-4 text-white z-10 pointer-events-auto">
        <div className="flex items-baseline gap-2 mb-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-md">
            {profile.name}
          </h2>
          <span className="text-xl sm:text-2xl font-light text-slate-300">{profile.age}</span>
        </div>

        {/* Location & District */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 font-medium mb-1.5">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{profile.district || profile.locationCity}</span>
          </div>
          <span className="text-slate-500">·</span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-[11px] text-emerald-300">
            {getGoalBadge(profile.relationshipGoal)}
          </span>
        </div>

        {/* Religion & Occupation & Football badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
          {profile.religion && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-amber-300 text-[11px]">
              <BookOpen className="w-3 h-3" />
              <span>{profile.religion}</span>
            </div>
          )}
          {profile.schoolOrUniversity && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-cyan-300 text-[11px]">
              <GraduationCap className="w-3 h-3" />
              <span>{profile.schoolOrUniversity.split('(')[0]}</span>
            </div>
          )}
        </div>

        {/* Sierra Leone Cultural Anchors */}
        <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-slate-200">
            <Utensils className="w-3 h-3 text-amber-300" />
            <span>{profile.culturalHeritage.favoriteDish}</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-slate-200">
            <Languages className="w-3 h-3 text-emerald-300" />
            <span>{profile.culturalHeritage.dialects.slice(0, 2).join(', ')}</span>
          </div>
        </div>

        {/* Bio Snippet */}
        <p className="text-xs text-slate-200 line-clamp-2 drop-shadow leading-relaxed mb-1">
          {profile.bio}
        </p>

        <div className="flex items-center justify-between mt-1">
          <button
            onClick={onOpenDetails}
            className="text-[11px] text-emerald-400 font-semibold hover:underline flex items-center gap-1"
          >
            <Info className="w-3 h-3" /> View Full Profile & {photos.length} Photos
          </button>
          {remainingTrials !== undefined && (
            <span className="text-[10px] text-slate-400">
              {remainingTrials} trials remaining today
            </span>
          )}
        </div>
      </div>

      {/* Bottom Floating Action Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-4 z-20">
        <button
          onClick={onPass}
          className="w-13 h-13 rounded-full bg-slate-900/90 hover:bg-rose-500 text-slate-300 hover:text-white border border-slate-700/80 hover:border-rose-400 flex items-center justify-center shadow-lg active:scale-95 transition-all"
          title="Pass profile (or swipe left)"
          aria-label="Pass profile"
        >
          <X className="w-6 h-6" />
        </button>

        <button
          onClick={onSuperLike}
          className="w-11 h-11 rounded-full bg-slate-900/90 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/40 hover:border-amber-400 flex items-center justify-center shadow-lg active:scale-95 transition-all"
          title="Super Like / Padi Boost (or swipe up)"
          aria-label="Super Like"
        >
          <Star className="w-5 h-5 fill-current" />
        </button>

        <button
          onClick={onLike}
          className="w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-950/50 active:scale-95 transition-all"
          title="Like profile (or swipe right)"
          aria-label="Like profile"
        >
          <Heart className="w-6 h-6 fill-current" />
        </button>
      </div>
    </div>
  );
};
