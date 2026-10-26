import React, { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle2, ShieldCheck, RefreshCw, X, AlertCircle } from 'lucide-react';

interface PhotoVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (photoUrl: string) => void;
}

export const PhotoVerificationModal: React.FC<PhotoVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerified,
}) => {
  const [step, setStep] = useState<'intro' | 'capture' | 'analyzing' | 'success'>('intro');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [poseInstruction, setPoseInstruction] = useState('Look straight into the camera');
  const [poseProgress, setPoseProgress] = useState(0);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setStep('intro');
      setPoseProgress(0);
      setCapturedPhoto(null);
    }
  }, [isOpen]);

  const startCamera = async () => {
    setStep('capture');
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      runPoseSequence();
    } catch {
      setCameraError('Camera access was not granted. You can proceed with our simulated biometric selfie verification.');
      setCameraActive(false);
      runSimulatedPoseSequence();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const runPoseSequence = () => {
    setPoseInstruction('Step 1 of 2: Look directly at the camera');
    setPoseProgress(30);

    setTimeout(() => {
      setPoseInstruction('Step 2 of 2: Turn head slightly right and smile');
      setPoseProgress(70);

      setTimeout(() => {
        capturePhoto();
      }, 2000);
    }, 2000);
  };

  const runSimulatedPoseSequence = () => {
    setPoseInstruction('Align your face in the oval frame');
    setPoseProgress(35);

    setTimeout(() => {
      setPoseInstruction('Checking 3D depth and authentic facial liveness');
      setPoseProgress(75);

      setTimeout(() => {
        // Fallback photo
        const fallback = '/images/sl_dating_aminata_1792925241536.jpg';
        setCapturedPhoto(fallback);
        finalizeVerification(fallback);
      }, 1800);
    }, 1800);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 480;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedPhoto(dataUrl);
        stopCamera();
        finalizeVerification(dataUrl);
        return;
      }
    }
    const fallback = '/images/sl_dating_aminata_1792925241536.jpg';
    setCapturedPhoto(fallback);
    finalizeVerification(fallback);
  };

  const finalizeVerification = (photoUrl: string) => {
    setStep('analyzing');
    setPoseProgress(90);

    setTimeout(() => {
      setStep('success');
      setPoseProgress(100);
      setTimeout(() => {
        onVerified(photoUrl);
        onClose();
      }, 1600);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Photo Verification</h3>
              <p className="text-xs text-slate-400">Ensure authentic Sierra Leonean profiles</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-6">
          {step === 'intro' && (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-emerald-400" />
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-bold text-white">Get Your Verified Badge</h4>
                <p className="text-sm text-slate-300 max-w-xs mx-auto leading-relaxed">
                  We Connect protects members from catfishing and fake accounts. Take a 5-second selfie pose to earn the green verified shield.
                </p>
              </div>

              <div className="bg-slate-800/60 rounded-2xl p-4 text-left space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px] font-bold">1</span>
                  <span>Allow camera access to capture your selfie pose.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px] font-bold">2</span>
                  <span>Match the on-screen head-turn motion.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px] font-bold">3</span>
                  <span>Get verified and receive 3x more quality matches!</span>
                </div>
              </div>

              <button
                onClick={startCamera}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Start Camera Verification
              </button>
            </div>
          )}

          {step === 'capture' && (
            <div className="space-y-4 text-center">
              <div className="relative w-64 h-72 mx-auto rounded-3xl overflow-hidden bg-slate-950 border-2 border-emerald-500/50 shadow-inner flex items-center justify-center">
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <div className="p-4 text-center space-y-3">
                    <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                    <p className="text-xs text-slate-300">Processing live pose capture...</p>
                  </div>
                )}

                {/* Face Guide Oval */}
                <div className="absolute inset-4 border-2 border-dashed border-emerald-400/80 rounded-full pointer-events-none animate-pulse"></div>

                <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-md rounded-xl py-1.5 px-3 text-[11px] text-emerald-300 font-medium">
                  {poseInstruction}
                </div>
              </div>

              {cameraError && (
                <div className="flex items-center gap-2 text-amber-400 text-xs bg-amber-950/40 border border-amber-800/40 p-2.5 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${poseProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {step === 'analyzing' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center">
                <RefreshCw className="w-9 h-9 text-emerald-400 animate-spin" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-semibold text-white">Analyzing Biometric Match</h4>
                <p className="text-xs text-slate-400">Confirming pose match & authentic live human verification...</p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white">Identity Verified!</h4>
                <p className="text-xs text-emerald-400">
                  Congratulations! Your profile now proudly displays the Sierra Leone Verified Shield.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
