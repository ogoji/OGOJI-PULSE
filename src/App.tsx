import React, { useState, useEffect } from 'react';
import { usePulseStore } from './store/usePulseStore';
import { Header } from './components/Header';
import { FeedView } from './components/FeedView';
import { AIStudioLab } from './components/AIStudioLab';
import { HubView } from './components/HubView';
import { ServicesView } from './components/ServicesView';
import { CommunityView } from './components/CommunityView';
import { ProfileView } from './components/ProfileView';
import { AdminView } from './components/AdminView';
import { SocialEngagementHub } from './components/SocialEngagementHub';
import { OnboardingModal } from './components/OnboardingModal';
import { BrandLogo } from './components/BrandLogo';
import { CreatorCtaBanner } from './components/CreatorCtaBanner';
import { NewsletterSubscription } from './components/NewsletterSubscription';
import {
  Linkedin,
  Video,
  ShieldCheck,
  Cpu,
  ArrowUpRight,
  Sparkles,
  Zap,
  MessageCircle,
  Phone,
  Youtube,
  Twitter,
  Ghost,
} from 'lucide-react';

export default function App() {
  const { currentTab, setCurrentTab, isAdminMode } = usePulseStore();

  // Local state simulating real-time WhatsApp contact availability ('Online' | 'Away')
  const [chatStatus, setChatStatus] = useState<'Online' | 'Away'>('Online');
  const [bookingStatus, setBookingStatus] = useState<'Online' | 'Away'>('Online');

  // Automatic heartbeat to realistically calculate status while keeping it responsive
  useEffect(() => {
    const updateAvailability = () => {
      const now = new Date();
      // Nigeria / West Africa Time (WAT: UTC+1)
      const watHour = (now.getUTCHours() + 1) % 24;
      // 8:00 AM to 11:59 PM WAT represents primary online creator hours
      const isOnlineChat = watHour >= 8 && watHour <= 23;
      const isOnlineBooking = watHour >= 9 && watHour <= 21;
      setChatStatus(isOnlineChat ? 'Online' : 'Away');
      setBookingStatus(isOnlineBooking ? 'Online' : 'Away');
    };

    updateAvailability();
    const interval = setInterval(updateAvailability, 60000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  return (
    <div
      id="ogojipulse-app"
      className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-['Outfit']"
    >
      {/* Interactive First-Visit Onboarding Preference Selector */}
      <OnboardingModal />

      {/* Main Top Navigation Header */}
      <Header />

      {/* Main Page Canvas */}
      <main id="main-content-canvas" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentTab === 'feed' && <FeedView />}
        {currentTab === 'ai-lab' && <AIStudioLab />}
        {currentTab === 'engagement' && <SocialEngagementHub />}
        {currentTab === 'hub' && <HubView />}
        {currentTab === 'services' && <ServicesView />}
        {currentTab === 'community' && <CommunityView />}
        {currentTab === 'profile' && <ProfileView />}
        {currentTab === 'admin' && <AdminView />}

        {/* Global Prominent Contact CTA (when on Feed, AI Lab, Engagement, Hub, or Community) */}
        {(currentTab === 'feed' || currentTab === 'ai-lab' || currentTab === 'engagement' || currentTab === 'hub' || currentTab === 'community') && (
          <div className="mt-12 mb-8">
            <CreatorCtaBanner />
          </div>
        )}
      </main>

      {/* Creator Brand Footer */}
      <footer id="app-footer" className="mt-auto border-t border-slate-800/80 bg-slate-950/90 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Newsletter Subscription Form */}
          <NewsletterSubscription />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-8 border-b border-slate-800/80">
            <div className="space-y-3 max-w-md">
              <BrandLogo size="md" showSubtitle={true} onClick={() => setCurrentTab('feed')} />
              <p className="text-xs text-slate-400 leading-relaxed">
                The centralized digital command center for{' '}
                <strong className="text-slate-200">Victor Oladapo Olufemi</strong> (
                <span className="text-cyan-400">@ogojithecreator._</span>). Uniting talking-head media,
                AI prompt repositories, SQA engineering insights, and high-value professional optimization.
              </p>
            </div>

            {/* Quick Links & CTAs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs text-slate-400 w-full lg:w-auto">
              {/* Channels */}
              <div className="space-y-2">
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Core Channels
                </span>
                <ul className="space-y-1.5">
                  <li>
                    <button
                      onClick={() => setCurrentTab('feed')}
                      className="hover:text-cyan-400 transition-colors"
                    >
                      Talking-Head Feed
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCurrentTab('ai-lab')}
                      className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors flex items-center gap-1"
                    >
                      <span>AI Studio & Lab</span>
                      <span className="text-[9px] bg-cyan-500/20 px-1 rounded">New</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCurrentTab('hub')}
                      className="hover:text-cyan-400 transition-colors"
                    >
                      Prompt Repository
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCurrentTab('hub')}
                      className="hover:text-cyan-400 transition-colors"
                    >
                      SQA Release Logs
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCurrentTab('community')}
                      className="hover:text-cyan-400 transition-colors"
                    >
                      Q&A Discussion
                    </button>
                  </li>
                </ul>
              </div>

              {/* Monetization */}
              <div className="space-y-2">
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Services
                </span>
                <ul className="space-y-1.5">
                  <li>
                    <button
                      onClick={() => setCurrentTab('services')}
                      className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors flex items-center gap-1"
                    >
                      <span>Yearly Video Creation</span>
                      <span className="text-[9px] bg-cyan-500/20 px-1 rounded text-cyan-300 font-mono">₦3k</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCurrentTab('services')}
                      className="hover:text-cyan-400 transition-colors"
                    >
                      LinkedIn Optimization
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCurrentTab('services')}
                      className="hover:text-cyan-400 transition-colors"
                    >
                      Multi-Social Overhaul
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCurrentTab('services')}
                      className="hover:text-cyan-400 transition-colors"
                    >
                      VIP Management Tier
                    </button>
                  </li>
                </ul>
              </div>

              {/* WhatsApp CTAs & Real-Time Availability */}
              <div className="space-y-2">
                <span className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center justify-between text-emerald-400">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp CTAs</span>
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 font-normal">
                    Real-Time Desk
                  </span>
                </span>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between gap-2">
                    <a
                      href="https://wa.me/2347120037624"
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-300 hover:text-emerald-400 transition-colors font-mono text-xs flex items-center gap-1"
                    >
                      <span>07120037624</span>
                      <span className="text-slate-400 text-[11px] font-sans">(Chat)</span>
                    </a>
                    {/* Simulated Status Indicator */}
                    <button
                      type="button"
                      onClick={() => setChatStatus((prev) => (prev === 'Online' ? 'Away' : 'Online'))}
                      title="Click to toggle availability state (simulated)"
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer border ${
                        chatStatus === 'Online'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900/80'
                          : 'bg-amber-950/80 text-amber-300 border-amber-700/60 hover:bg-amber-900/80'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          chatStatus === 'Online'
                            ? 'bg-emerald-400 animate-pulse ring-2 ring-emerald-400/40'
                            : 'bg-amber-400 ring-2 ring-amber-400/20'
                        }`}
                      />
                      <span>{chatStatus}</span>
                    </button>
                  </li>

                  <li className="flex items-center justify-between gap-2">
                    <a
                      href="https://wa.me/2348114676752"
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-300 hover:text-emerald-400 transition-colors font-mono text-xs flex items-center gap-1"
                    >
                      <span>08114676752</span>
                      <span className="text-slate-400 text-[11px] font-sans">(Bookings)</span>
                    </a>
                    {/* Simulated Status Indicator */}
                    <button
                      type="button"
                      onClick={() => setBookingStatus((prev) => (prev === 'Online' ? 'Away' : 'Online'))}
                      title="Click to toggle availability state (simulated)"
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer border ${
                        bookingStatus === 'Online'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900/80'
                          : 'bg-amber-950/80 text-amber-300 border-amber-700/60 hover:bg-amber-900/80'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          bookingStatus === 'Online'
                            ? 'bg-emerald-400 animate-pulse ring-2 ring-emerald-400/40'
                            : 'bg-amber-400 ring-2 ring-amber-400/20'
                        }`}
                      />
                      <span>{bookingStatus}</span>
                    </button>
                  </li>

                  <li className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{chatStatus === 'Online' ? '⚡ Avg. response < 5m' : '🌙 Away • Replies shortly'}</span>
                    <span className="text-[9px] text-slate-600">WAT Timezone</span>
                  </li>

                  <li className="pt-1 border-t border-slate-800">
                    <span className="text-[10px] text-slate-500 block">PalmPay: 9014402749</span>
                    <span className="text-[10px] text-slate-500 block">USDT: BEP20</span>
                  </li>
                </ul>
              </div>

              {/* Social Channels */}
              <div className="space-y-2">
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Social Media
                </span>
                <ul className="space-y-1.5">
                  <li>
                    <a
                      href="https://tiktok.com/@ogojithecreator._"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      <span>TikTok: @ogojithecreator._</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://youtube.com/@ogojithecreator._"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-red-400 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Youtube className="w-3.5 h-3.5 text-red-400" />
                      <span>YouTube: @ogojithecreator._</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.snapchat.com/add/ogojithecreator"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-yellow-400 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Ghost className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Snapchat: ogojithecreator</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://x.com/victor4femi"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                    >
                      <Twitter className="w-3.5 h-3.5 text-slate-300" />
                      <span>X: @victor4femi</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>OgojiPulse v1.0.0 • Designed for @ogojithecreator._ (Victor Oladapo Olufemi)</span>
            </div>
            <div>
              © 2026 OgojiPulse • WhatsApp: 07120037624 / 08114676752 • All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
