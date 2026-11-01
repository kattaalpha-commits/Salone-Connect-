import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Smartphone, Mail, Timer, RefreshCw, CheckCircle, AlertTriangle, KeyRound, Sparkles } from 'lucide-react';

interface OtpVerificationModalProps {
  isOpen: boolean;
  targetDestination: string; // phone number or email
  isEmail?: boolean;
  onVerified: () => void;
  onCancel?: () => void;
}

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  isOpen,
  targetDestination,
  isEmail = false,
  onVerified,
  onCancel,
}) => {
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [generatedCode, setGeneratedCode] = useState<string>('842196');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(600); // 10 minutes = 600s
  const [resendCooldown, setResendCooldown] = useState<number>(30);
  const [carrierNotice, setCarrierNotice] = useState<string>('Dispatched via Orange SL & Africell SMS Gateway');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize or reset OTP code and timer when opened
  useEffect(() => {
    if (isOpen) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      setOtpValues(['', '', '', '', '', '']);
      setSecondsRemaining(600);
      setResendCooldown(30);
      setErrorMsg(null);
      setIsSuccess(false);

      if (isEmail) {
        setCarrierNotice('Dispatched via Salone Connect Secure Mail Gateway (TLS 1.3)');
      } else if (targetDestination.startsWith('+232 7') || targetDestination.startsWith('+232 76') || targetDestination.startsWith('+232 79')) {
        setCarrierNotice('Dispatched via Orange Sierra Leone SMPP Gateway (Priority Route)');
      } else if (targetDestination.startsWith('+232 88') || targetDestination.startsWith('+232 77') || targetDestination.startsWith('+232 99')) {
        setCarrierNotice('Dispatched via Africell Sierra Leone GSM SMS Service');
      } else {
        setCarrierNotice('Dispatched via Global Diaspora Cloud Telecom Route');
      }

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 200);
    }
  }, [isOpen, targetDestination, isEmail]);

  // Expiration countdown
  useEffect(() => {
    if (!isOpen || secondsRemaining <= 0 || isSuccess) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setErrorMsg('Verification code expired (10-minute window exceeded). Please request a new code.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, secondsRemaining, isSuccess]);

  // Resend cooldown
  useEffect(() => {
    if (!isOpen || resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, resendCooldown]);

  if (!isOpen) return null;

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDigitChange = (index: number, val: string) => {
    if (isSuccess || isVerifying) return;
    // Keep only numeric characters
    const clean = val.replace(/\D/g, '');
    if (!clean) {
      const copy = [...otpValues];
      copy[index] = '';
      setOtpValues(copy);
      return;
    }

    // Handle single character
    const char = clean.slice(-1);
    const copy = [...otpValues];
    copy[index] = char;
    setOtpValues(copy);
    setErrorMsg(null);

    // Auto-advance
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else {
      // If 6th digit entered, auto submit
      const fullCode = copy.join('');
      if (fullCode.length === 6) {
        verifyCode(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const copy = [...otpValues];
    for (let i = 0; i < pasted.length; i++) {
      copy[i] = pasted[i];
    }
    setOtpValues(copy);
    if (pasted.length === 6) {
      verifyCode(pasted);
    } else {
      inputRefs.current[Math.min(5, pasted.length)]?.focus();
    }
  };

  const verifyCode = (codeToTest?: string) => {
    const code = codeToTest || otpValues.join('');
    if (code.length < 6) {
      setErrorMsg('Please enter all 6 digits of the OTP code.');
      return;
    }

    if (secondsRemaining <= 0) {
      setErrorMsg('This code has expired. Please click "Resend Code".');
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    setTimeout(() => {
      // Check if entered code matches generated code or testing code 842196
      if (code === generatedCode || code === '842196') {
        setIsSuccess(true);
        setIsVerifying(false);
        setTimeout(() => {
          onVerified();
        }, 1200);
      } else {
        setIsVerifying(false);
        setErrorMsg('Invalid code. Please check the 6-digit number sent to your device.');
      }
    }, 800);
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(newCode);
    setOtpValues(['', '', '', '', '', '']);
    setSecondsRemaining(600);
    setResendCooldown(30);
    setErrorMsg(null);
    inputRefs.current[0]?.focus();
  };

  const fillTestCode = () => {
    const chars = generatedCode.split('');
    setOtpValues(chars);
    verifyCode(generatedCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#2e0212] via-slate-900 to-slate-950 border border-rose-900/40 rounded-3xl p-6 sm:p-7 text-slate-100 shadow-2xl overflow-hidden">
        {/* Glowing romantic ambient header backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Security badge top line */}
        <div className="flex items-center justify-between pb-4 border-b border-rose-900/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Two-Factor Authentication</h3>
              <p className="text-[11px] text-rose-300">Mandatory Anti-Fraud Security Check</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-[11px] text-rose-300 font-mono font-semibold">
            <Timer className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>
        </div>

        {/* Carrier Notification Banner */}
        <div className="mt-4 p-3 rounded-2xl bg-rose-950/30 border border-rose-800/30 flex items-center gap-2.5 text-xs text-rose-200">
          {isEmail ? (
            <Mail className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <Smartphone className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <div className="leading-tight">
            <p className="text-[11px] font-medium text-slate-300">
              6-digit code transmitted to <strong className="text-white">{targetDestination || '+232 76 000000'}</strong>
            </p>
            <span className="text-[10px] text-rose-400 font-medium">{carrierNotice}</span>
          </div>
        </div>

        {/* Demo Fast Fill Helper */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Security Test Code: <strong className="font-mono text-amber-300 tracking-wider">{generatedCode}</strong></span>
          </div>
          <button
            type="button"
            onClick={fillTestCode}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/50 font-medium active:scale-95 transition-all"
          >
            Auto-Fill
          </button>
        </div>

        {/* 6-box OTP Input */}
        <div className="py-6">
          <div className="flex justify-center gap-2 sm:gap-3">
            {otpValues.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                disabled={isVerifying || isSuccess}
                className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-bold font-mono rounded-2xl border transition-all outline-none ${
                  digit
                    ? 'border-rose-500 bg-rose-950/40 text-white shadow-lg shadow-rose-950/50'
                    : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700'
                } focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20`}
              />
            ))}
          </div>

          {errorMsg && (
            <div className="mt-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-center gap-2 text-center animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSuccess && (
            <div className="mt-4 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-center gap-2 text-center">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">OTP Code Verified! Account Activated.</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => verifyCode()}
            disabled={isVerifying || isSuccess || otpValues.join('').length < 6}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm transition-all shadow-lg shadow-rose-950/60 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-98"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Verifying Security Token...</span>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle className="w-4 h-4 text-white" />
                <span>Verified!</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm & Activate Account</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || isVerifying || isSuccess}
              className="text-rose-400 hover:text-rose-300 disabled:text-slate-600 font-medium transition-colors"
            >
              {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="hover:text-slate-200 transition-colors"
              >
                Cancel / Edit Number
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
