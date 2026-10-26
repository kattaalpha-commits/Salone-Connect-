import React from 'react';
import { MatchNotification } from '../types';
import { Bell, Check, X, ShieldCheck, Heart, MessageCircle, Sparkles } from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: MatchNotification[];
  onMarkAllRead: () => void;
  onSelectNotification: (notif: MatchNotification) => void;
  pushEnabled: boolean;
  onTogglePush: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onSelectNotification,
  pushEnabled,
  onTogglePush,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col text-slate-100">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">Activity & Notifications</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white"
            aria-label="Close notifications"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Push Notification Permission Card */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Browser Push Alerts</span>
            <button
              onClick={onTogglePush}
              className={`text-xs px-2.5 py-1 rounded-full font-bold transition-colors ${
                pushEnabled
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {pushEnabled ? 'Enabled ✓' : 'Enable Push'}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Get instant alerts when someone likes you, matches with your profile, or invites you to a virtual video date.
          </p>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No new notifications right now.
            </div>
          ) : (
            notifications.map((notif) => {
              const getIcon = () => {
                switch (notif.type) {
                  case 'match':
                    return <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" />;
                  case 'message':
                    return <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />;
                  case 'verification':
                    return <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />;
                  default:
                    return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
                }
              };

              return (
                <div
                  key={notif.id}
                  onClick={() => onSelectNotification(notif)}
                  className={`p-3 rounded-2xl cursor-pointer transition-colors flex items-start gap-3 ${
                    notif.read ? 'opacity-70 hover:bg-slate-800/40' : 'bg-slate-800/70 hover:bg-slate-800'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-700/80 flex items-center justify-center shrink-0 mt-0.5 border border-slate-600">
                    {getIcon()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-xs font-semibold text-white truncate">{notif.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{notif.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                      {notif.description}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-slate-800 text-center">
            <button
              onClick={onMarkAllRead}
              className="text-xs text-emerald-400 hover:underline font-medium"
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
