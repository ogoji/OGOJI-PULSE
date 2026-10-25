import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, Loader2, Sparkles, ShieldCheck, ArrowRight, BellRing, RefreshCw } from 'lucide-react';
import { subscribeToNewsletter } from '../lib/firebase';

interface NewsletterSubscriptionProps {
  variant?: 'footer' | 'standalone' | 'compact';
  onSubscribed?: (email: string) => void;
}

const INTEREST_TAGS = [
  'AI Prompts & Lab',
  'SQA Automation',
  'Talking-Head Workflows',
  'Client Overhaul Discounts',
];

export const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({
  variant = 'footer',
  onSubscribed,
}) => {
  const [email, setEmail] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'AI Prompts & Lab',
    'SQA Automation',
  ]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'info' | 'error';
    text: string;
  } | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [savedEmail, setSavedEmail] = useState('');

  // Check if previously subscribed in this browser
  useEffect(() => {
    try {
      const existing = localStorage.getItem('ogojipulse_subscribed_email');
      if (existing) {
        setSavedEmail(existing);
        setIsSubscribed(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleInterest = (tag: string) => {
    setSelectedInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    setStatusMessage(null);

    try {
      const result = await subscribeToNewsletter({
        email: email.trim(),
        interests: selectedInterests.length > 0 ? selectedInterests : ['General Updates'],
        source: 'footer_newsletter',
      });

      if (result.success) {
        setIsSubscribed(true);
        setSavedEmail(email.trim());
        setStatusMessage({
          type: result.alreadySubscribed ? 'info' : 'success',
          text: result.message,
        });
        if (onSubscribed) {
          onSubscribed(email.trim());
        }
      } else {
        setStatusMessage({
          type: 'error',
          text: result.message || 'Something went wrong. Please check your email.',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Failed to submit. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetForAnotherEmail = () => {
    setIsSubscribed(false);
    setStatusMessage(null);
    setEmail('');
  };

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/90 p-6 sm:p-8 shadow-xl overflow-hidden backdrop-blur-sm">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-10">
        {/* Left column: Header & Value Proposition */}
        <div className="max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>OgojiPulse Weekly Dispatch</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-slate-400 text-[11px]">Free AI & Tech Intel</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
            Level Up With Victor's <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">Weekly AI & SQA Workflows</span>
          </h3>

          <p className="text-sm text-slate-300/90 leading-relaxed">
            Get exclusive prompt templates, test automation cheat sheets, and direct notices when new talking-head breakdowns and booking slots open. Delivered every Tuesday.
          </p>

          {/* Value bullet points */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Prompt engineering formulas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>SQA bug-hunting logs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>Early access drops</span>
            </div>
          </div>
        </div>

        {/* Right column: Form or Subscribed State */}
        <div className="w-full lg:max-w-md">
          {isSubscribed && statusMessage?.type !== 'error' ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-5 space-y-3 backdrop-blur-md">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/40">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <span>You're On The VIP List!</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      ACTIVE
                    </span>
                  </h4>
                  <p className="text-xs text-slate-300">
                    {statusMessage?.text || `Subscribed as ${savedEmail || 'creator subscriber'}.`}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-900/40 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Saved in OgojiPulse Firestore</span>
                </span>
                <button
                  type="button"
                  onClick={handleResetForAnotherEmail}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1 font-medium"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Use another email</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Optional tags picker */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Select your focus areas (optional):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {INTEREST_TAGS.map((tag) => {
                    const isSelected = selectedInterests.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleInterest(tag)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg transition-all font-medium border ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-200'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Email Input & Submit Button */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 shrink-0"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <span>Join Pulse</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Status or error message */}
              {statusMessage && (
                <div
                  className={`text-xs px-3 py-2 rounded-lg border flex items-center gap-2 ${
                    statusMessage.type === 'error'
                      ? 'bg-red-950/40 border-red-800/60 text-red-300'
                      : statusMessage.type === 'info'
                      ? 'bg-cyan-950/40 border-cyan-800/60 text-cyan-300'
                      : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                  }`}
                >
                  <BellRing className="w-3.5 h-3.5 shrink-0" />
                  <span>{statusMessage.text}</span>
                </div>
              )}

              {/* Trust badge */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 px-0.5">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400/80" />
                  <span>Zero spam • 1-click unsubscribe anytime</span>
                </span>
                <span className="text-slate-500 hidden sm:inline">1,400+ subscribers</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default NewsletterSubscription;
