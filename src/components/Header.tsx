import React, { useState } from 'react';
import {
  Home,
  BookOpen,
  Briefcase,
  Users,
  User,
  ShieldAlert,
  Search,
  SlidersHorizontal,
  Bell,
  CheckCircle,
  Sparkles,
  MessageCircle,
  Flame,
} from 'lucide-react';
import { usePulseStore, ActiveTab } from '../store/usePulseStore';
import { BrandLogo } from './BrandLogo';
import { ConnectModal } from './ConnectModal';
import { AuthWidget } from './AuthWidget';

export const Header: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    isAdminMode,
    toggleAdminMode,
    searchQuery,
    setSearchQuery,
    bookings,
  } = usePulseStore();

  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const pendingBookingsCount = bookings.filter((b) => b.status === 'pending_verification').length;

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'feed', label: 'Home Feed', icon: Home },
    { id: 'ai-lab', label: 'AI Studio & Lab', icon: Sparkles },
    { id: 'engagement', label: 'Get Engagements', icon: Flame },
    { id: 'hub', label: 'Tech & SQA Hub', icon: BookOpen },
    { id: 'services', label: 'Services & Pricing', icon: Briefcase },
    { id: 'community', label: 'Community & Q&A', icon: Users },
    { id: 'profile', label: 'Portfolio & Profile', icon: User },
  ];

  if (isAdminMode) {
    navItems.push({ id: 'admin', label: 'Creator Studio', icon: ShieldAlert });
  }

  return (
    <>
      <header
        id="app-header"
        className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all"
      >
        {/* Top Contact Strip */}
        <div className="bg-gradient-to-r from-cyan-950/70 via-slate-950 to-emerald-950/70 border-b border-slate-800/60 py-1.5 px-3 sm:px-6 text-[11px] text-slate-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                WhatsApp:
              </span>
              <a
                href="https://wa.me/2347120037624"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-cyan-300 hover:text-cyan-200 hover:underline"
              >
                07120037624
              </a>
              <span className="text-slate-600">/</span>
              <a
                href="https://wa.me/2348114676752"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-cyan-300 hover:text-cyan-200 hover:underline"
              >
                08114676752
              </a>
            </div>

            <div className="hidden md:flex items-center gap-4 text-slate-400 shrink-0">
              <span>
                TikTok/YT:{' '}
                <a
                  href="https://tiktok.com/@ogojithecreator._"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  @ogojithecreator._
                </a>
              </span>
              <span>
                Snap:{' '}
                <a
                  href="https://www.snapchat.com/add/ogojithecreator"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-300 hover:text-yellow-400 transition-colors"
                >
                  ogojithecreator
                </a>
              </span>
              <span>
                X:{' '}
                <a
                  href="https://x.com/victor4femi"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  @victor4femi
                </a>
              </span>
            </div>

            <button
              onClick={() => setShowConnectModal(true)}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold shrink-0 inline-flex items-center gap-1 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Contact Lines</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Live Status */}
          <div className="flex items-center gap-3 sm:gap-4">
            <BrandLogo
              size="sm"
              showSubtitle={false}
              onClick={() => setCurrentTab('feed')}
              className="cursor-pointer"
            />
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-[11px] font-semibold text-cyan-300 uppercase tracking-widest">
                @ogojithecreator._
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav id="desktop-navigation" className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer relative ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-950/50 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.id === 'admin' && pendingBookingsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                      {pendingBookingsCount}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Search bar, Admin Switcher & Notifications */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Search */}
            <div className="relative hidden xl:block w-44">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hub or feed..."
                className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:w-56 transition-all"
              />
            </div>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                id="notifications-toggle"
                onClick={() => setShowNotificationMenu(!showNotificationMenu)}
                className="relative p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-slate-700 transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {pendingBookingsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full ring-2 ring-slate-950" />
                )}
              </button>

              {showNotificationMenu && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Pulse Updates
                    </span>
                    <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                      Live
                    </span>
                  </div>
                  <div className="mt-3 space-y-2.5 text-xs">
                    <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-200">New Pre-Flight SQA Matrix Added</p>
                        <p className="text-slate-400 text-[11px]">15-point release checklist is now open in the Resource Hub.</p>
                      </div>
                    </div>
                    {pendingBookingsCount > 0 && (
                      <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-amber-200">{pendingBookingsCount} Client Booking Pending</p>
                          <p className="text-slate-400 text-[11px]">Check PalmPay/USDT receipt in Creator Studio.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Firebase Auth Google Sign-in Widget */}
            <AuthWidget />

            {/* Quick WhatsApp CTA Button */}
            <button
              id="header-whatsapp-btn"
              onClick={() => setShowConnectModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all cursor-pointer shadow-sm shadow-emerald-500/10"
              title="Chat with Victor on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            {/* Creator / Admin Toggle Switch */}
            <button
              id="admin-mode-toggle"
              onClick={toggleAdminMode}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                isAdminMode
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300 shadow-sm shadow-amber-500/20'
                  : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
              title="Switch between Audience perspective and Victor's Creator Studio"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isAdminMode ? 'Creator Studio ON' : 'Switch to Creator Mode'}
              </span>
              <span className="sm:hidden">{isAdminMode ? 'Admin' : 'Audience'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div
        id="mobile-navigation"
        className="md:hidden flex items-center justify-around border-t border-slate-800/80 bg-slate-950/95 py-2 px-1"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-cyan-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
        <button
          onClick={() => setShowConnectModal(true)}
          className="flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium text-emerald-400"
        >
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          <span>Chat</span>
        </button>
      </div>
    </header>

    {/* Connect & Socials Modal */}
    <ConnectModal isOpen={showConnectModal} onClose={() => setShowConnectModal(false)} />
    </>
  );
};
