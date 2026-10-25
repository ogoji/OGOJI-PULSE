import React, { useState } from 'react';
import {
  MessageCircle,
  Phone,
  Youtube,
  Twitter,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  X,
  ShieldCheck,
  Zap,
  Ghost,
} from 'lucide-react';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(id);
    setTimeout(() => setCopiedField(null), 2200);
  };

  const whatsappLines = [
    {
      label: 'Line 1 (Direct Chat)',
      phone: '07120037624',
      waUrl: 'https://wa.me/2347120037624?text=Hi%20Victor%2C%20I%20am%20reaching%20out%20from%20OgojiPulse%21',
    },
    {
      label: 'Line 2 (Inquiries & Bookings)',
      phone: '08114676752',
      waUrl: 'https://wa.me/2348114676752?text=Hi%20Victor%2C%20I%20am%20interested%20in%20profile%20optimization%20and%20SQA%20services.',
    },
  ];

  const socials = [
    {
      platform: 'TikTok',
      handle: '@ogojithecreator._',
      url: 'https://tiktok.com/@ogojithecreator._',
      icon: Zap,
      textColor: 'text-cyan-400',
      badge: 'Shorts & Reels',
    },
    {
      platform: 'YouTube',
      handle: '@ogojithecreator._',
      url: 'https://youtube.com/@ogojithecreator._',
      icon: Youtube,
      textColor: 'text-red-400',
      badge: 'Deep Dives',
    },
    {
      platform: 'Snapchat',
      handle: 'ogojithecreator',
      url: 'https://www.snapchat.com/add/ogojithecreator',
      icon: Ghost,
      textColor: 'text-yellow-400',
      badge: 'Behind The Scenes & Snaps',
    },
    {
      platform: 'X / Twitter',
      handle: '@victor4femi',
      url: 'https://x.com/victor4femi',
      icon: Twitter,
      textColor: 'text-slate-300',
      badge: 'Daily Tech Takes',
    },
  ];

  return (
    <div
      id="connect-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in"
    >
      <div
        id="connect-modal-dialog"
        className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-cyan-500/30 p-6 sm:p-7 shadow-2xl text-white space-y-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-3 h-3" />
              <span>Official Channels</span>
            </div>
            <h3 className="text-xl font-bold text-white font-['Outfit']">
              Connect With Victor Oladapo Olufemi
            </h3>
            <p className="text-xs text-slate-400">
              Fast response on WhatsApp for bookings, consulting, and collaborations.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* WhatsApp Direct Lines */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <MessageCircle className="w-4 h-4" />
              <span>Official WhatsApp Numbers</span>
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Online
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {whatsappLines.map((line, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{line.label}</span>
                    <button
                      onClick={() => handleCopy(line.phone, `wa_${idx}`)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-emerald-400"
                      title="Copy Number"
                    >
                      {copiedField === `wa_${idx}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="font-mono text-base font-bold text-emerald-400">
                    {line.phone}
                  </div>
                </div>

                <a
                  href={line.waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Channels */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Follow on Socials
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {socials.map((s, idx) => {
              const Icon = s.icon;
              return (
                <a
                  key={idx}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-slate-900 text-slate-300 group-hover:text-cyan-400 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{s.platform}</div>
                      <div className={`text-[11px] font-mono ${s.textColor}`}>{s.handle}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 text-center">
          Payment transfers and custom booking proposals can be directly verified via WhatsApp.
        </div>
      </div>
    </div>
  );
};
