import React from 'react';
import { FilterSettings, Seeking, RelationshipGoal } from '../types';
import { DIALECT_OPTIONS, SALONE_DISHES } from '../data/mockProfiles';
import { SlidersHorizontal, ShieldCheck, MapPin, X, Sparkles, Check } from 'lucide-react';

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterSettings;
  onUpdateFilters: (newFilters: FilterSettings) => void;
  isPremiumUser: boolean;
  onOpenPremium: () => void;
}

export const FiltersModal: React.FC<FiltersModalProps> = ({
  isOpen,
  onClose,
  filters,
  onUpdateFilters,
  isPremiumUser,
  onOpenPremium,
}) => {
  if (!isOpen) return null;

  const toggleDialect = (d: string) => {
    const next = filters.dialects.includes(d)
      ? filters.dialects.filter((x) => x !== d)
      : [...filters.dialects, d];
    onUpdateFilters({ ...filters, dialects: next });
  };

  const toggleDish = (dish: string) => {
    const next = filters.dishes.includes(dish)
      ? filters.dishes.filter((x) => x !== dish)
      : [...filters.dishes, dish];
    onUpdateFilters({ ...filters, dishes: next });
  };

  const toggleGoal = (goal: RelationshipGoal) => {
    const next = filters.relationshipGoals.includes(goal)
      ? filters.relationshipGoals.filter((x) => x !== goal)
      : [...filters.relationshipGoals, goal];
    onUpdateFilters({ ...filters, relationshipGoals: next });
  };

  const handleReset = () => {
    onUpdateFilters({
      minAge: 18,
      maxAge: 55,
      seeking: 'everyone',
      region: 'all',
      maxDistanceKm: 10000,
      verifiedOnly: false,
      dialects: [],
      religions: [],
      relationshipGoals: [],
      dishes: [],
      onlyWithPhotos: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Discovery & Match Filters</h3>
              <p className="text-xs text-slate-400">Customize by location and cultural interests</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Options */}
        <div className="py-5 space-y-6 max-h-[60vh] overflow-y-auto pr-1">
          {/* Location / Region Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Location & Diaspora Filter
              </label>
              <span className="text-[11px] text-emerald-400 capitalize">{filters.region}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'all', label: 'Global / All' },
                { id: 'freetown', label: 'Freetown & Western' },
                { id: 'provinces', label: 'Provinces (Bo, etc)' },
                { id: 'uk', label: 'UK Diaspora' },
                { id: 'us', label: 'USA Diaspora' },
                { id: 'canada', label: 'Canada Diaspora' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => onUpdateFilters({ ...filters, region: r.id as any })}
                  className={`p-2 rounded-xl border text-xs font-medium transition-all ${
                    filters.region === r.id
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 font-bold'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Age Range Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">Age Range</span>
              <span className="text-emerald-400 font-mono font-bold">
                {filters.minAge} - {filters.maxAge} years
              </span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="18"
                max="65"
                value={filters.minAge}
                onChange={(e) =>
                  onUpdateFilters({
                    ...filters,
                    minAge: Math.min(Number(e.target.value), filters.maxAge - 1),
                  })
                }
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2"
              />
              <input
                type="range"
                min="18"
                max="75"
                value={filters.maxAge}
                onChange={(e) =>
                  onUpdateFilters({
                    ...filters,
                    maxAge: Math.max(Number(e.target.value), filters.minAge + 1),
                  })
                }
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2"
              />
            </div>
          </div>

          {/* Interested In */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-200">Show Me</span>
            <div className="grid grid-cols-3 gap-2">
              {(['men', 'women', 'everyone'] as Seeking[]).map((s) => (
                <button
                  key={s}
                  onClick={() => onUpdateFilters({ ...filters, seeking: s })}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium capitalize transition-all ${
                    filters.seeking === s
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 font-bold'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Photo-Verified Only Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Photo-Verified Only</h4>
                <p className="text-[11px] text-slate-400">Filter out unverified accounts</p>
              </div>
            </div>
            <button
              onClick={() => onUpdateFilters({ ...filters, verifiedOnly: !filters.verifiedOnly })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                filters.verifiedOnly ? 'bg-emerald-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform transform ${
                  filters.verifiedOnly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Sierra Leone Dialects Filter */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-200">
              Dialects & Languages Spoken
            </span>
            <div className="flex flex-wrap gap-1.5">
              {DIALECT_OPTIONS.map((d) => {
                const active = filters.dialects.includes(d);
                return (
                  <button
                    key={d}
                    onClick={() => toggleDialect(d)}
                    className={`px-2.5 py-1 rounded-lg border text-xs transition-all ${
                      active
                        ? 'bg-emerald-600 border-emerald-500 text-white font-medium'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cultural Dishes */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-200">Favorite Salone Dish</span>
            <div className="flex flex-wrap gap-1.5">
              {SALONE_DISHES.map((dish) => {
                const active = filters.dishes.includes(dish);
                return (
                  <button
                    key={dish}
                    onClick={() => toggleDish(dish)}
                    className={`px-2.5 py-1 rounded-lg border text-xs transition-all ${
                      active
                        ? 'bg-emerald-600 border-emerald-500 text-white font-medium'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {dish}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Premium Advanced Filters Lock Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 to-slate-800 border border-amber-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Premium Advanced Filters
              </span>
              {!isPremiumUser && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  VIP ONLY
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Filter by specific Sierra Leonean tribes (Temne, Mende, Fullah, Limba, Krio), education degree level, and diaspora residency.
            </p>
            {!isPremiumUser && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPremium();
                }}
                className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
              >
                Unlock VIP Advanced Filters
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Reset All Filters
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
