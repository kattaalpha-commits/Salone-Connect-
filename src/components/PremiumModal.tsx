import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Crown,
  Zap,
  Flame,
  X,
  CreditCard,
  Smartphone,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
  isTrialActive?: boolean;
  trialDaysRemaining?: number;
  onUpgrade: (plan: 'local_2' | 'monthly_5' | 'quarterly_20' | 'annual_50') => void;
  onCancelSubscription?: () => void;
  triggerReason?: string;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  isPremium,
  isTrialActive = true,
  trialDaysRemaining = 14,
  onUpgrade,
  onCancelSubscription,
  triggerReason,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'local_2' | 'monthly_5' | 'quarterly_20' | 'annual_50'>('monthly_5');
  const [paymentStep, setPaymentStep] = useState<'plans' | 'checkout' | 'success'>('plans');
  const [paymentMethod, setPaymentMethod] = useState<'orange_money' | 'afrimoney' | 'qmoney' | 'card'>('orange_money');
  const [mobileNumber, setMobileNumber] = useState('+232 76 123456');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const planDetails = {
    local_2: { name: 'Local Basic Pass', priceUSD: 2, priceNLe: 46, period: '/month', badge: 'Entry' },
    monthly_5: { name: 'Full Salone VIP', priceUSD: 5, priceNLe: 115, period: '/month', badge: 'Most Popular' },
    quarterly_20: { name: 'Diaspora 3-Month', priceUSD: 20, priceNLe: 460, period: '/3 months', badge: 'Great Value' },
    annual_50: { name: 'All-Access Annual VIP', priceUSD: 50, priceNLe: 1150, period: '/year', badge: 'Best Deal' },
  };

  const handleProceedToCheckout = () => {
    setPaymentStep('checkout');
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStep('success');
      setTimeout(() => {
        onUpgrade(selectedPlan);
        onClose();
        setPaymentStep('plans');
      }, 1800);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl shadow-amber-950/20 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* FREE 2 WEEKS TRIAL BANNER */}
        {isTrialActive && !isPremium && (
          <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-white">Free 2-Week Trial Active!</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {trialDaysRemaining} Days Left
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Enjoy full free access to features during your 14-day introductory trial before paid plans start.
              </p>
            </div>
          </div>
        )}

        {/* STEP 1: PLANS SELECTION */}
        {paymentStep === 'plans' && (
          <div className="space-y-4">
            <div className="text-center space-y-1 mb-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10">
                <Crown className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">
                Salone Connect <span className="text-amber-400">VIP Plans</span>
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Affordable Sierra Leonean dating plans starting at just $2 USD. Pay via Orange Money, Afrimoney, or Card.
              </p>
            </div>

            {triggerReason && (
              <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-300 text-center font-medium">
                {triggerReason}
              </div>
            )}

            {/* 4 Flexible Tier Options */}
            <div className="space-y-2">
              {[
                {
                  id: 'local_2',
                  title: 'Local Basic Pass',
                  price: '$2',
                  nle: '≈ NLe 46',
                  period: '/month',
                  perks: '50 daily trials, unlocked secret matches, local priority',
                  badge: 'Entry $2',
                },
                {
                  id: 'monthly_5',
                  title: 'Full Salone VIP',
                  price: '$5',
                  nle: '≈ NLe 115',
                  period: '/month',
                  perks: 'Unlimited trials & messages, 100% ad-free, unblurred admirers',
                  badge: 'Recommended',
                },
                {
                  id: 'quarterly_20',
                  title: 'Diaspora 3-Month Pass',
                  price: '$20',
                  nle: '≈ NLe 460',
                  period: '/3 months',
                  perks: 'Save 20%, Homecoming matcher, full diaspora travel passport',
                  badge: 'Popular',
                },
                {
                  id: 'annual_50',
                  title: 'All-Access Annual VIP',
                  price: '$50',
                  nle: '≈ NLe 1,150',
                  period: '/year',
                  perks: 'Full 365-day access, top profile highlight, VIP Gold badge',
                  badge: 'Best Value',
                },
              ].map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => setSelectedPlan(tier.id as any)}
                  className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    selectedPlan === tier.id
                      ? 'bg-amber-500/15 border-amber-400 ring-1 ring-amber-400'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{tier.title}</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {tier.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{tier.perks}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-base font-black text-white">
                      {tier.price} <span className="text-[10px] font-normal text-slate-400">{tier.period}</span>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono">{tier.nle}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Accepted Mobile Money & Cards row */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
              <span className="font-semibold text-slate-400">Accepted Payments:</span>
              <div className="flex items-center gap-2 font-semibold">
                <span className="text-amber-400">Orange Money</span>
                <span className="text-slate-600">·</span>
                <span className="text-blue-400">Afrimoney</span>
                <span className="text-slate-600">·</span>
                <span className="text-white">Visa/Card</span>
              </div>
            </div>

            {isPremium ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                <span className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4" /> You are an active VIP Member!
                </span>
                {onCancelSubscription && (
                  <button
                    onClick={onCancelSubscription}
                    className="text-[11px] text-slate-400 hover:text-rose-400 mt-1 block mx-auto underline"
                  >
                    Switch to Free Plan
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-105 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>Continue with {planDetails[selectedPlan].name} (${planDetails[selectedPlan].priceUSD})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* STEP 2: CHECKOUT (ORANGE MONEY / AFRIMONEY / VISA) */}
        {paymentStep === 'checkout' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <button
                onClick={() => setPaymentStep('plans')}
                className="text-xs text-slate-400 hover:text-white"
              >
                ← Change Plan
              </button>
              <div className="text-right">
                <div className="text-sm font-bold text-white">{planDetails[selectedPlan].name}</div>
                <div className="text-xs text-emerald-400 font-mono">
                  ${planDetails[selectedPlan].priceUSD} (NLe {planDetails[selectedPlan].priceNLe})
                </div>
              </div>
            </div>

            {/* Select Provider */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Choose Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'orange_money', label: 'Orange Money SL', desc: 'Dial *144# OTP', color: 'border-amber-500 text-amber-400' },
                  { id: 'afrimoney', label: 'Afrimoney Africell', desc: 'Dial *161# OTP', color: 'border-blue-500 text-blue-400' },
                  { id: 'qmoney', label: 'QMoney', desc: 'Direct USSD Prompt', color: 'border-purple-500 text-purple-400' },
                  { id: 'card', label: 'Visa / Mastercard', desc: 'Debit / Credit Card', color: 'border-emerald-500 text-emerald-400' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      paymentMethod === m.id
                        ? 'bg-slate-800/90 ring-1 ring-emerald-500 border-emerald-500'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{m.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Input Form */}
            {paymentMethod !== 'card' ? (
              <div className="space-y-2 p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800">
                <label className="text-xs font-semibold text-slate-300 block">
                  Sierra Leone Mobile Money Number
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="+232 76 000000"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  You will receive an instant approval push on your phone to confirm your NLe {planDetails[selectedPlan].priceNLe} payment.
                </p>
              </div>
            ) : (
              <div className="space-y-2 p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800">
                <label className="text-xs font-semibold text-slate-300 block">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 •••• •••• 4242"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    defaultValue="12/28"
                    className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    defaultValue="894"
                    className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleConfirmPayment}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-105 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              {isProcessing ? (
                <span>Confirming via {paymentMethod === 'orange_money' ? 'Orange Money' : paymentMethod === 'afrimoney' ? 'Afrimoney' : 'Card'}...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authorize Payment of ${planDetails[selectedPlan].priceUSD} (NLe {planDetails[selectedPlan].priceNLe})</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {paymentStep === 'success' && (
          <div className="text-center py-8 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-lg font-bold text-white">Payment Confirmed!</h3>
            <p className="text-xs text-emerald-300">
              Your {planDetails[selectedPlan].name} is now active. Enjoy unlimited messaging, unlocked secret matches, and ad-free browsing!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
