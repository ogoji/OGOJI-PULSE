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
  ArrowRight,
  ShieldCheck,
  Zap,
  Ghost,
} from 'lucide-react';

interface CreatorCtaBannerProps {
  variant?: 'full' | 'compact' | 'card';
  title?: string;
  subtitle?: string;
}

export const CreatorCtaBanner: React.FC<CreatorCtaBannerProps> = ({
  variant = 'full',
  title = 'Work With Victor & Stay Connected Across Every Channel',
  subtitle = 'Direct line for profile optimization bookings, SQA consulting, brand collaborations, and exclusive AI prompt drops.',
}) => {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const whatsappNumbers = [
    {
      display: '07120037624',
      formatted: '+234 712 003 7624',
      waLink: 'https://wa.me/2347120037624?text=Hi%20Victor%2C%20I%20came%20from%20OgojiPulse%20and%20would%20like%20to%20connect%21',
      label: 'Primary Direct Line',
    },
    {
      display: '08114676752',
      formatted: '+234 811 467 6752',
      waLink: 'https://wa.me/2348114676752?text=Hi%20Victor%2C%20I%20am%20interested%20in%20your%20optimization%20services%20and%20QA%20consulting.',
      label: 'Secondary / Inquiries',
    },
  ];

  const socialLinks = [
    {
      name: 'TikTok',
      handle: '@ogojithecreator._',
      url: 'https://tiktok.com/@ogojithecreator._',
      icon: Zap,
      color: 'hover:border-cyan-400/50 hover:text-cyan-300 group-hover:text-cyan-400',
      badge: 'Fast AI & Tech Reels',
    },
    {
      name: 'YouTube',
      handle: '@ogojithecreator._',
      url: 'https://youtube.com/@ogojithecreator._',
      icon: Youtube,
      color: 'hover:border-red-500/50 hover:text-red-400 group-hover:text-red-400',
      badge: 'Talking-Head Deep Dives',
    },
    {
      name: 'Snapchat',
      handle: 'ogojithecreator',
      url: 'https://www.snapchat.com/add/ogojithecreator',
      icon: Ghost,
      color: 'hover:border-yellow-400/50 hover:text-yellow-300 group-hover:text-yellow-400',
      badge: 'Exclusive Snaps & Daily Stories',
    },
    {
      name: 'X (Twitter)',
      handle: '@victor4femi',
      url: 'https://x.com/victor4femi',
      icon: Twitter,
      color: 'hover:border-slate-400/50 hover:text-slate-200 group-hover:text-white',
      badge: 'Daily Tech & SQA Takes',
    },
  ];

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2200);
  };

  if (variant === 'compact') {
    return (
      <div
        id="creator-cta-compact"
        className="rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border border-cyan-500/30 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-white font-['Outfit']">
              Quick Chat with Victor on WhatsApp
            </h4>
            <p className="text-xs text-slate-400">
              Direct verification & instant responses: <span className="font-mono text-cyan-400">07120037624</span> or{' '}
              <span className="font-mono text-cyan-400">08114676752</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <a
            href="https://wa.me/2347120037624?text=Hi%20Victor%2C%20I%20would%20like%20to%20discuss%20an%20optimization%20project."
            target="_blank"
            rel="noreferrer"
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-emerald-500/20"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp (07120037624)</span>
          </a>
          <a
            href="https://wa.me/2348114676752?text=Hi%20Victor%2C%20I%20have%20an%20inquiry%20from%20OgojiPulse."
            target="_blank"
            rel="noreferrer"
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs transition-colors border border-emerald-500/30"
          >
            <span>08114676752</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <section
      id="creator-official-cta-section"
      className="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-gradient-to-b from-slate-900 via-slate-950 to-[#070b12] p-6 sm:p-8 md:p-10 shadow-2xl space-y-8"
    >
      {/* Glow highlight */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Access to Victor Oladapo Olufemi</span>
          </div>

          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight font-['Outfit']">
            {title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Direct Lines</span>
          </span>
        </div>
      </div>

      {/* Grid: WhatsApp Channels & Social Ecosystem */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: WhatsApp Direct Action Card (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white font-['Outfit']">
                    Official WhatsApp Concierge
                  </h4>
                  <p className="text-xs text-slate-400">
                    Reach Victor directly for immediate responses, proof verification & custom bookings.
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Instant Chat
              </span>
            </div>

            {/* Number Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {whatsappNumbers.map((num, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        {num.label}
                      </span>
                      <button
                        onClick={() => handleCopy(num.display)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
                        title="Copy phone number"
                      >
                        {copiedNumber === num.display ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="font-mono text-base font-bold text-emerald-400 tracking-wide mt-1">
                      {num.display}
                    </div>
                    <div className="text-[10px] text-slate-500">{num.formatted}</div>
                  </div>

                  <a
                    href={num.waLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors shadow-sm cursor-pointer mt-2"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Message on WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Directly monitored by <strong className="text-slate-200">Victor Olufemi</strong>. Please mention your name and inquiry context when messaging.
            </span>
          </div>
        </div>

        {/* Right: Social Media Ecosystem (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-white font-['Outfit']">
                Follow & Subscribe
              </h4>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                Omnichannel
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Catch daily AI breakdowns, SQA testing techniques, and talking-head drops.
            </p>
          </div>

          <div className="space-y-2.5">
            {socialLinks.map((item, idx) => {
              const Icon = item.icon;
              return (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`group flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-slate-950 border border-slate-800 transition-all ${item.color}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-900 text-slate-300 group-hover:text-current transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {item.name}
                      </div>
                      <div className="text-[11px] font-mono text-cyan-400/90">
                        {item.handle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-block text-[10px] text-slate-500 group-hover:text-slate-400">
                      {item.badge}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
