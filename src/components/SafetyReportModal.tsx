import React, { useState } from 'react';
import { UserProfile, ReportTicket } from '../types';
import { Flag, Ban, ShieldAlert, CheckCircle2, X } from 'lucide-react';

interface SafetyReportModalProps {
  profile: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (ticket: ReportTicket) => void;
  onBlockUser: (profile: UserProfile) => void;
}

export const SafetyReportModal: React.FC<SafetyReportModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSubmitReport,
  onBlockUser,
}) => {
  const [reason, setReason] = useState<ReportTicket['reason']>('impersonation');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [alsoBlock, setAlsoBlock] = useState(true);

  if (!isOpen || !profile) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticket: ReportTicket = {
      id: `report-${Date.now()}`,
      targetUserId: profile.id,
      targetUserName: profile.name,
      reason,
      details,
      timestamp: new Date().toLocaleString(),
      status: 'pending',
    };
    onSubmitReport(ticket);
    if (alsoBlock) {
      onBlockUser(profile);
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close safety report modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Report Submitted</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Thank you for keeping our Sierra Leonean dating community safe and authentic. Our moderation team reviews reports 24/7.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Report {profile.name}</h3>
                <p className="text-xs text-slate-400">Violation of We Connect Community Guidelines</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Reason for Report</label>
              <div className="space-y-1.5">
                {[
                  { id: 'impersonation', label: 'Impersonation / Fake Profile / Catfish' },
                  { id: 'harassment', label: 'Harassment, Hate Speech, or Disrespect' },
                  { id: 'inappropriate_content', label: 'Inappropriate Photos or Messages' },
                  { id: 'scam', label: 'Commercial Solicitation or Financial Scam' },
                  { id: 'underage', label: 'Suspected Underage Account (Under 18)' },
                  { id: 'other', label: 'Other Guidelines Violation' },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                      reason === item.id
                        ? 'bg-rose-500/10 border-rose-500 text-rose-300 font-semibold'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={item.id}
                      checked={reason === item.id}
                      onChange={() => setReason(item.id as any)}
                      className="accent-rose-500"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                Additional Details (Optional)
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Please describe what happened to assist our safety team..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Ban className="w-4 h-4 text-slate-400" />
                <span>Also block this user immediately</span>
              </div>
              <input
                type="checkbox"
                checked={alsoBlock}
                onChange={(e) => setAlsoBlock(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-rose-950 transition-colors"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
