import React, { useState } from 'react';
import {
  Check,
  Zap,
  ArrowRight,
  ShieldCheck,
  Copy,
  ExternalLink,
  CreditCard,
  Coins,
  Linkedin,
  Clock,
  Sparkles,
  HelpCircle,
  FileCheck2,
  Lock,
  MessageCircle,
  Flame,
  Play,
  XCircle,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import { usePulseStore } from '../store/usePulseStore';
import { ServiceTier, PaymentMethod } from '../types';
import { CreatorCtaBanner } from './CreatorCtaBanner';
import { createFirestoreBooking } from '../lib/firebase';
import { getTikTokVideoId } from './FeedView';

export const ServicesView: React.FC = () => {
  const {
    serviceTiers,
    selectedTierForBooking,
    setSelectedTierForBooking,
    createBooking,
    bookings,
    currentUser,
    setCurrentTab,
  } = usePulseStore();

  const [activeBookingTier, setActiveBookingTier] = useState<ServiceTier | null>(null);
  const [currencyToggle, setCurrencyToggle] = useState<'NGN' | 'USD'>('NGN');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('PalmPay');

  // Booking Form State
  const [clientName, setClientName] = useState(currentUser.name || '');
  const [clientEmail, setClientEmail] = useState('');
  const [clientLinkedIn, setClientLinkedIn] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [proofNote, setProofNote] = useState('');
  const [careerGoals, setCareerGoals] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [profileLinks, setProfileLinks] = useState('');

  // UI Flow in Modal
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [createdBookingRef, setCreatedBookingRef] = useState<string | null>(null);
  const [activeCaseStudyStage, setActiveCaseStudyStage] = useState<'before' | 'after'>('after');

  const handleCopyText = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleStartBooking = (tier: ServiceTier) => {
    setActiveBookingTier(tier);
    setSelectedTierForBooking(tier);
    setBookingStep(1);
    setCreatedBookingRef(null);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBookingTier) return;

    const initials = clientName
      ? clientName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
      : 'OP';

    const ref = `${initials}-${activeBookingTier.id.substring(0, 2).toUpperCase()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const amountFormatted =
      currencyToggle === 'NGN'
        ? `₦${activeBookingTier.priceNgn.toLocaleString()}`
        : `$${activeBookingTier.priceUsd} USD`;

    const booking = createBooking({
      tierId: activeBookingTier.id,
      tierName: activeBookingTier.name,
      clientName: clientName.trim() || 'Valued Client',
      clientEmail: clientEmail.trim(),
      clientLinkedIn: clientLinkedIn.trim(),
      clientPhone: clientPhone.trim(),
      paymentMethod: selectedPaymentMethod,
      amountFormatted,
      referenceCode: ref,
      proofNote: proofNote.trim(),
      intakeAnswers: {
        careerGoals,
        targetAudience,
        profileLinks,
      },
    });

    // Persist to Cloud Firestore
    createFirestoreBooking({
      userId: currentUser.id,
      clientName: clientName.trim() || 'Valued Client',
      clientEmail: clientEmail.trim(),
      serviceId: activeBookingTier.id,
      serviceTitle: activeBookingTier.name,
      priceNgn: activeBookingTier.priceNgn,
      priceUsd: activeBookingTier.priceUsd,
      paymentMethod: selectedPaymentMethod.toLowerCase() === 'usdt' ? 'usdt' : 'palmpay',
      proofOfPaymentNote: `${ref} - ${proofNote.trim()}`,
    }).catch((err) => console.warn('Firestore booking sync warning:', err));

    setCreatedBookingRef(booking.referenceCode);
    setBookingStep(3);
  };

  return (
    <div id="services-view" className="space-y-12 pb-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>High-Value Profile & Growth Architect</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-['Outfit']">
          Turn Your Digital Presence Into an Inbound Opportunity Magnet
        </h2>

        <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Whether you are targeting six-figure international tech roles or scaling high-converting personal brand channels, our precision optimization frameworks deliver measurable results.
        </p>

        {/* Currency Switcher */}
        <div className="inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setCurrencyToggle('NGN')}
            className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
              currencyToggle === 'NGN'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ₦ Nigerian Naira (PalmPay)
          </button>
          <button
            onClick={() => setCurrencyToggle('USD')}
            className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
              currencyToggle === 'USD'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            $ USD (Crypto USDT / BEP20)
          </button>
        </div>
      </div>

      {/* LinkedIn Profile Optimization: Verified Video Breakdown & Before/After Audit */}
      {(() => {
        const beforeVideoUrl =
          'https://www.tiktok.com/@ogojithecreator._/video/7676635401334951186?is_from_webapp=1&sender_device=pc';
        const afterVideoUrl =
          'https://www.tiktok.com/@ogojithecreator._/video/7684476290304363784?is_from_webapp=1&sender_device=pc';
        const activeVideoUrl =
          activeCaseStudyStage === 'before' ? beforeVideoUrl : afterVideoUrl;
        const tiktokId = getTikTokVideoId(activeVideoUrl);
        const linkedinTier = serviceTiers.find((t) => t.id === 'linkedin_optimization');

        return (
          <section
            id="linkedin-before-audit"
            className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl shadow-cyan-950/20 relative overflow-hidden"
          >
            {/* Header / Intro */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  <Play className="w-3.5 h-3.5 fill-cyan-400" />
                  <span>Verified Transformation Case Study</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] mt-1">
                  LinkedIn Optimization: The "Before & After" Breakdown
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Watch Victor Oladapo Olufemi (<span className="text-pink-400 font-semibold">@ogojithecreator._</span>) reveal the exact difference between an invisible profile and an inbound recruiter magnet.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={activeVideoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-pink-300 border border-pink-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-pink-400" />
                  <span>Watch on TikTok</span>
                </a>
                {linkedinTier && (
                  <button
                    onClick={() => handleStartBooking(linkedinTier)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 transition-all shadow-md shadow-cyan-500/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Book Optimization</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Video Stage Toggle Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  id="btn-case-study-before"
                  onClick={() => setActiveCaseStudyStage('before')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeCaseStudyStage === 'before'
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25 ring-1 ring-rose-400'
                      : 'text-slate-400 hover:text-white bg-slate-900/60'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-300" />
                  <span>1. BEFORE Optimization (The Audit & Traps)</span>
                </button>
                <button
                  type="button"
                  id="btn-case-study-after"
                  onClick={() => setActiveCaseStudyStage('after')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeCaseStudyStage === 'after'
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-400 font-extrabold'
                      : 'text-slate-400 hover:text-white bg-slate-900/60'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-slate-950" />
                  <span>2. AFTER Optimization (The Inbound Magnet & Results)</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-400 px-2 font-mono flex items-center gap-1">
                <span>Active Stage:</span>
                <span className={`font-bold uppercase ${activeCaseStudyStage === 'before' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {activeCaseStudyStage === 'before' ? '🔴 Unoptimized Audit' : '🟢 Transformed Proof'}
                </span>
              </div>
            </div>

            {/* Video & Comparison Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Column: Embedded TikTok Reel */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-inner">
                <div className="w-full flex items-center justify-between mb-2 text-xs">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    activeCaseStudyStage === 'before'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {activeCaseStudyStage === 'before'
                      ? 'Part 1: The "Before" Problem'
                      : 'Part 2: The "After" Results'}
                  </span>
                  <span className="text-slate-400 text-[11px] font-mono">
                    ID: {tiktokId}
                  </span>
                </div>

                <div className="w-full max-w-[320px] h-[460px] sm:h-[500px] rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl relative">
                  {tiktokId ? (
                    <iframe
                      key={tiktokId}
                      src={`https://www.tiktok.com/embed/v2/${tiktokId}`}
                      title={activeCaseStudyStage === 'before' ? 'Before Optimization Video' : 'After Optimization Video'}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
                      <Play className="w-12 h-12 text-pink-400 mb-2" />
                      <p className="text-xs font-semibold">Video preview ready</p>
                    </div>
                  )}
                </div>

                <div className="w-full mt-3 flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>Victor Oladapo Olufemi (<a href="https://www.tiktok.com/@ogojithecreator._" target="_blank" rel="noreferrer" className="text-pink-400 hover:underline">@ogojithecreator._</a>)</span>
                  <button
                    type="button"
                    onClick={() => setActiveCaseStudyStage(activeCaseStudyStage === 'before' ? 'after' : 'before')}
                    className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline cursor-pointer"
                  >
                    {activeCaseStudyStage === 'before' ? 'Watch "After" →' : '← Watch "Before"'}
                  </button>
                </div>
              </div>

              {/* Right Column: "The Before" vs "The After" Breakdown Cards */}
              <div className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* The BEFORE Box */}
                  <div
                    onClick={() => setActiveCaseStudyStage('before')}
                    className={`p-4 rounded-2xl transition-all cursor-pointer border ${
                      activeCaseStudyStage === 'before'
                        ? 'bg-rose-950/40 border-rose-500/70 ring-1 ring-rose-400/40 shadow-lg'
                        : 'bg-rose-950/20 border-rose-900/40 opacity-80 hover:opacity-100'
                    } space-y-3`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-rose-400">
                        <XCircle className="w-5 h-5 shrink-0" />
                        <span className="text-xs font-black uppercase tracking-wider font-mono">
                          1. Before Optimization (The Trap)
                        </span>
                      </div>
                      {activeCaseStudyStage === 'before' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white">
                          Watching
                        </span>
                      )}
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="text-rose-400 shrink-0 font-bold">•</span>
                        <span><strong>Generic Headline:</strong> "QA Tester at Company" with 0 algorithm search ranking</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-400 shrink-0 font-bold">•</span>
                        <span><strong>Task-Oriented Bullets:</strong> Simple duty lists with no metrics or business ROI</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-400 shrink-0 font-bold">•</span>
                        <span><strong>ATS Ghosting:</strong> Filtered out before human eyes ever view the application</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-400 shrink-0 font-bold">•</span>
                        <span><strong>Cold Outreach Only:</strong> Zero weekly recruiter or client inbound messages</span>
                      </li>
                    </ul>
                  </div>

                  {/* The AFTER Box */}
                  <div
                    onClick={() => setActiveCaseStudyStage('after')}
                    className={`p-4 rounded-2xl transition-all cursor-pointer border ${
                      activeCaseStudyStage === 'after'
                        ? 'bg-emerald-950/40 border-emerald-500/70 ring-1 ring-emerald-400/40 shadow-lg'
                        : 'bg-emerald-950/20 border-emerald-900/40 opacity-80 hover:opacity-100'
                    } space-y-3`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span className="text-xs font-black uppercase tracking-wider font-mono">
                          2. After Victor's Overhaul (The Magnet)
                        </span>
                      </div>
                      {activeCaseStudyStage === 'after' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950 font-black">
                          Watching
                        </span>
                      )}
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                        <span><strong>Search-Optimized Headline:</strong> Calibrated for top 0.1% recruiter search filters</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                        <span><strong>STAR-Method Proof:</strong> Impact-driven bullet points proving tangible scale & value</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                        <span><strong>Authority Positioning:</strong> Featured assets and Story-driven "About" rewrite</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                        <span><strong>Inbound Inquiries:</strong> 5x to 10x weekly profile views and direct interview invitations</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Key Insights from the Video */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
                      <TrendingUp className="w-4 h-4" />
                      <span>Takeaways from Victor's Optimization Videos</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Turnaround: 3-5 Days</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80">
                      <span className="text-cyan-400 font-bold block mb-1">1. ATS Calibration</span>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        Embedding targeted keyword phrases that recruiters query for high-ticket roles.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80">
                      <span className="text-cyan-400 font-bold block mb-1">2. Story & Metrics</span>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        Reframing experience to showcase dollars saved, bugs mitigated, and speed improved.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80">
                      <span className="text-cyan-400 font-bold block mb-1">3. Inbound Conversion</span>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        Structuring contact points and CTAs so decision-makers reach out directly.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Booking Prompt */}
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border border-cyan-500/30 gap-3">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Ready to turn your LinkedIn into an opportunity magnet?
                    </span>
                    <span className="text-[11px] text-slate-400">
                      One-time investment: ₦35,000 NGN or $45 USD. Delivered in 3-5 business days.
                    </span>
                  </div>
                  {linkedinTier && (
                    <button
                      onClick={() => handleStartBooking(linkedinTier)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all shadow-md shadow-cyan-400/20 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <span>Get Started Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Service Tiers Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {serviceTiers.map((tier) => {
          const isHighlighted = tier.popular;
          const displayPrice =
            currencyToggle === 'NGN'
              ? `₦${tier.priceNgn.toLocaleString()}`
              : `$${tier.priceUsd} USD`;

          return (
            <div
              key={tier.id}
              id={`service-card-${tier.id}`}
              className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between border transition-all ${
                isHighlighted
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-cyan-500/60 ring-1 ring-cyan-400/40 shadow-2xl shadow-cyan-950/40 -translate-y-2'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              {isHighlighted && (
                <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow-md text-slate-950 ${
                  tier.id === 'yearly_video_creation'
                    ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-cyan-500/20'
                }`}>
                  {tier.id === 'yearly_video_creation' ? '🔥 ₦3,000 / Year Deal' : 'Most Popular Overhaul'}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-black text-white font-['Outfit']">{tier.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 min-h-[32px] leading-relaxed">
                    {tier.tagline}
                  </p>
                </div>

                {tier.id === 'linkedin_optimization' && (
                  <div className="flex flex-wrap items-center gap-1.5 p-2.5 rounded-xl bg-slate-950/90 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 w-full flex items-center gap-1">
                      <Play className="w-2.5 h-2.5 fill-cyan-400 text-cyan-400" />
                      <span>Verified Video Case Study:</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCaseStudyStage('before');
                        document.getElementById('linkedin-before-audit')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/40 hover:bg-rose-500/25 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-2.5 h-2.5 fill-rose-300" />
                      <span>Watch "Before"</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCaseStudyStage('after');
                        document.getElementById('linkedin-before-audit')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/25 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-2.5 h-2.5 fill-emerald-300" />
                      <span>Watch "After"</span>
                    </button>
                  </div>
                )}

                <div className="pb-4 border-b border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                      {displayPrice}
                    </span>
                  </div>
                  <span className="text-[11px] text-cyan-400 font-medium block mt-1">
                    {tier.billingFrequency}
                  </span>
                </div>

                <div className="space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    What You Receive:
                  </span>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    {tier.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Turnaround:</span>
                  <span className="text-slate-200 font-semibold">{tier.turnaroundTime}</span>
                </div>

                <button
                  id={`book-tier-btn-${tier.id}`}
                  onClick={() => handleStartBooking(tier)}
                  className={`w-full py-3.5 px-5 rounded-2xl font-bold text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                    isHighlighted
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-cyan-500/25'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  <span>
                    {tier.id === 'yearly_video_creation'
                      ? 'Enroll for ₦3,000 / Year'
                      : 'Book Optimization'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Channels & Verification Protocol Box */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
              Direct Payment Channels & Verification Protocol
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Zero platform fees. Fast-tracked client onboarding with 3-step verification.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
            <span>Encrypted & Verified Direct with Victor</span>
          </span>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PalmPay Nigeria Details */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-cyan-400" />
                <span className="font-bold text-sm text-white">Bank Transfer (Nigeria - NGN)</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400">
                Instant Transfer
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Bank Name:</span>
                <span className="font-bold text-white">PalmPay</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Account Number:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-cyan-400 text-sm">9014402749</span>
                  <button
                    onClick={() => handleCopyText('9014402749', 'palmpay_acc')}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400"
                    title="Copy Account Number"
                  >
                    {copiedField === 'palmpay_acc' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Account Name:</span>
                <span className="font-semibold text-white">Victor Olufemi</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Transfer Note:</span>{' '}
                <code className="text-cyan-400">[Your Name] - LinkedIn/Social Optimization</code>
              </div>
            </div>
          </div>

          {/* USDT Crypto Details */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Coins className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm text-white">International Clients (Crypto)</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                BNB Chain (BEP20)
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Asset & Network:</span>
                <span className="font-bold text-emerald-400">USDT (BNB Chain / BEP20)</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Wallet Address (BEP20):</span>
                  <button
                    onClick={() =>
                      handleCopyText(
                        '0x475fdf925699958fbf23bc919ab80f440b9f7fac',
                        'usdt_wallet'
                      )
                    }
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300"
                  >
                    {copiedField === 'usdt_wallet' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Copy</span>
                  </button>
                </div>
                <div className="font-mono text-[11px] text-slate-200 break-all bg-slate-950 p-2 rounded border border-slate-800">
                  0x475fdf925699958fbf23bc919ab80f440b9f7fac
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300">
                ⚠️ Send only USDT via the BNB Smart Chain (BEP20). Transfers via TRC20 or ERC20 cannot be credited.
              </div>
            </div>
          </div>
        </div>

        {/* 3-Step Protocol Cards */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Official 3-Step Onboarding Protocol
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <span className="text-xs font-black text-cyan-400 font-mono">STEP 01</span>
              <h4 className="text-sm font-bold text-white">Make Payment</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Transfer the exact package total via PalmPay (Nigeria) or BEP20 USDT (International).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <span className="text-xs font-black text-cyan-400 font-mono">STEP 02</span>
              <h4 className="text-sm font-bold text-white">Send Proof on WhatsApp or LinkedIn</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Forward your transaction receipt or screenshot via WhatsApp to{' '}
                <a href="https://wa.me/2347120037624" target="_blank" rel="noreferrer" className="text-emerald-400 font-mono font-semibold hover:underline">07120037624</a> or{' '}
                <a href="https://wa.me/2348114676752" target="_blank" rel="noreferrer" className="text-emerald-400 font-mono font-semibold hover:underline">08114676752</a>, or LinkedIn DM to{' '}
                <span className="text-slate-200 font-semibold">Victor Oladapo Olufemi</span>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <span className="text-xs font-black text-cyan-400 font-mono">STEP 03</span>
              <h4 className="text-sm font-bold text-white">Complete Intake Questionnaire</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upon confirmation, you receive a tailored intake form to share career goals and profile links.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Booking & Payment Modal */}
      {activeBookingTier && (
        <div
          id="booking-checkout-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
        >
          <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl text-white space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Client Booking Gateway
                </span>
                <h3 className="text-xl font-bold text-white font-['Outfit']">
                  {activeBookingTier.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveBookingTier(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* STEP 1: Payment Channel Selection & Account Details */}
            {bookingStep === 1 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-400">Selected Package Price:</span>
                  <span className="text-lg font-black text-white font-mono">
                    {currencyToggle === 'NGN'
                      ? `₦${activeBookingTier.priceNgn.toLocaleString()}`
                      : `$${activeBookingTier.priceUsd} USD`}
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Choose Payment Channel:</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPaymentMethod('PalmPay');
                        setCurrencyToggle('NGN');
                      }}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedPaymentMethod === 'PalmPay'
                          ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                          : 'bg-slate-800/40 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">PalmPay (NGN)</div>
                      <div className="text-[11px] text-slate-400">Domestic Bank Transfer</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPaymentMethod('USDT_BEP20');
                        setCurrencyToggle('USD');
                      }}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedPaymentMethod === 'USDT_BEP20'
                          ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                          : 'bg-slate-800/40 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">USDT (BEP20)</div>
                      <div className="text-[11px] text-slate-400">Crypto / International</div>
                    </button>
                  </div>
                </div>

                {/* Account Details To Copy */}
                {selectedPaymentMethod === 'PalmPay' ? (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="text-slate-400">Transfer target:</div>
                    <div className="font-mono text-cyan-400 font-bold text-sm">
                      PalmPay: 9014402749 (Victor Olufemi)
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      Reference Note to include:{' '}
                      <span className="text-slate-200">{clientName || 'YourName'} - Optimization</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="text-slate-400">BEP20 Wallet Address:</div>
                    <div className="font-mono text-cyan-400 font-bold text-xs break-all">
                      0x475fdf925699958fbf23bc919ab80f440b9f7fac
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setBookingStep(2)}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm cursor-pointer shadow-lg shadow-cyan-500/25"
                >
                  I'm Ready to Submit Details & Proof →
                </button>
              </div>
            )}

            {/* STEP 2: Client Details & Questionnaire Form */}
            {bookingStep === 2 && (
              <form onSubmit={handleSubmitBooking} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Victor Olufemi"
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">LinkedIn Profile URL *</label>
                    <input
                      type="url"
                      required
                      value={clientLinkedIn}
                      onChange={(e) => setClientLinkedIn(e.target.value)}
                      placeholder="https://linkedin.com/in/yourname"
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">WhatsApp / Phone</label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+234..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Questionnaire Fields */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Target Career Goals / Niche Outcome *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={careerGoals}
                    onChange={(e) => setCareerGoals(e.target.value)}
                    placeholder="e.g. Securing a Lead QA / Remote Engineer role in US/EU, or scaling high-ticket consulting."
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Current Social Links & Target Audience *
                  </label>
                  <input
                    type="text"
                    required
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g. Tech recruiters, founders, agency clients"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Payment Reference or Transaction Hash *
                  </label>
                  <input
                    type="text"
                    required
                    value={proofNote}
                    onChange={(e) => setProofNote(e.target.value)}
                    placeholder="e.g. PalmPay session ID #98231 or USDT TX hash 0x..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setBookingStep(1)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs text-slate-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-cyan-500/25"
                  >
                    Submit Booking & Generate Verification Pass
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Verification Confirmation */}
            {bookingStep === 3 && (
              <div className="space-y-5 text-center py-2">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <FileCheck2 className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-xl font-bold text-white">Booking Order Created!</h4>
                  <p className="text-xs text-slate-400">
                    Your reference pass has been registered in the OgojiPulse system.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-2">
                  <span className="text-[11px] text-slate-400 font-mono">Your Booking Reference:</span>
                  <div className="text-xl font-black text-cyan-400 font-mono">
                    {createdBookingRef}
                  </div>
                  <span className="text-[11px] text-amber-400 block">
                    Status: Pending Victor's DM Verification
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 text-left space-y-3">
                  <span className="font-bold text-white block">Next Final Step: Send Proof</span>
                  <p>
                    Send a screenshot of your payment receipt along with this reference code (
                    <strong className="text-cyan-400 font-mono">{createdBookingRef}</strong>) directly to Victor via WhatsApp for instant confirmation:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <a
                      href={`https://wa.me/2347120037624?text=${encodeURIComponent(
                        `Hi Victor, I completed payment for OgojiPulse Order #${createdBookingRef}. Here is my receipt screenshot!`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp (07120037624)</span>
                    </a>
                    <a
                      href={`https://wa.me/2348114676752?text=${encodeURIComponent(
                        `Hi Victor, I completed payment for OgojiPulse Order #${createdBookingRef}. Here is my receipt screenshot!`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-emerald-500/40 text-emerald-400 font-bold text-xs transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp (08114676752)</span>
                    </a>
                  </div>
                  <div className="pt-1 border-t border-slate-700/60">
                    <a
                      href="https://www.linkedin.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-slate-400 hover:text-cyan-400 inline-flex items-center gap-1.5"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      <span>Or send via Victor Oladapo Olufemi's LinkedIn DM</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => setActiveBookingTier(null)}
                  className="w-full py-3 rounded-xl bg-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-700"
                >
                  Done & Return to Services
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Creator Official Contact & Omnichannel CTA */}
      <div className="pt-6">
        <CreatorCtaBanner
          title="Direct Consultation & Verification Line"
          subtitle="Chat directly on WhatsApp (07120037624 or 08114676752) or follow Victor across TikTok, YouTube, Snapchat, and X."
        />
      </div>
    </div>
  );
};
