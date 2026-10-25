import React, { useState } from 'react';
import {
  User,
  Bookmark,
  CheckCircle,
  Clock,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Video,
  FileCode,
  ExternalLink,
  Edit2,
  Check,
  Ghost,
  Play,
  Tv,
  Briefcase,
  Layers,
} from 'lucide-react';
import { usePulseStore } from '../store/usePulseStore';
import { CreatorCtaBanner } from './CreatorCtaBanner';
import { getTikTokVideoId, getYouTubeVideoId } from './FeedView';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    resetOnboarding,
    feedItems,
    resources,
    bookmarkedResourceIds,
    completedTasks,
    bookings,
    setCurrentTab,
    setActiveVideo,
  } = usePulseStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editBio, setEditBio] = useState(currentUser.bio || '');
  const [trackingRefInput, setTrackingRefInput] = useState('');
  const [searchedBooking, setSearchedBooking] = useState<any>(null);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>('tiktok_video_04');

  const bookmarkedPrompts = resources.filter((r) =>
    bookmarkedResourceIds.includes(r.id)
  );
  const bookmarkedVideos = feedItems.filter((v) => v.isBookmarked);
  const completedTaskCount = Object.values(completedTasks).filter(Boolean).length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName.trim() || currentUser.name,
      bio: editBio.trim(),
    });
    setIsEditing(false);
  };

  const handleLookupBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingRefInput.trim()) return;
    const found = bookings.find(
      (b) => b.referenceCode.toLowerCase() === trackingRefInput.trim().toLowerCase()
    );
    setSearchedBooking(found || 'not_found');
  };

  return (
    <div id="profile-view" className="space-y-8 pb-12">
      {/* Profile Header Card */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-cyan-500/50 shadow-lg"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
                  {currentUser.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {currentUser.role === 'admin' ? 'Creator Admin' : 'Community Member'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <span className="text-xs text-slate-400 font-mono">{currentUser.handle}</span>
                <a
                  href="https://www.snapchat.com/add/ogojithecreator"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 transition-colors"
                >
                  <Ghost className="w-3 h-3" />
                  <span>Snap: ogojithecreator</span>
                </a>
              </div>
              <p className="text-xs text-slate-300 max-w-md pt-1">{currentUser.bio}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="edit-profile-btn"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
            <button
              id="retrigger-onboarding-btn"
              onClick={resetOnboarding}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Change onboarding preferences"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Focus Areas</span>
            </button>
          </div>
        </div>

        {/* Profile Edit Form Drawer */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Short Bio</label>
                <input
                  type="text"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-400">Saved Prompts</span>
            <div className="text-xl font-bold text-white font-mono">{bookmarkedPrompts.length}</div>
          </div>
          <Bookmark className="w-5 h-5 text-cyan-400" />
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-400">Verified SQA Tasks</span>
            <div className="text-xl font-bold text-emerald-400 font-mono">
              {completedTaskCount}
            </div>
          </div>
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-400">Optimization Bookings</span>
            <div className="text-xl font-bold text-amber-400 font-mono">{bookings.length}</div>
          </div>
          <CreditCard className="w-5 h-5 text-amber-400" />
        </div>
      </div>

      {/* Engineering & Creator Portfolio Showcase */}
      {(() => {
        const currentPortfolioItem =
          feedItems.find((f) => f.id === selectedPortfolioId) ||
          feedItems[0];
        const tiktokId = currentPortfolioItem ? getTikTokVideoId(currentPortfolioItem.videoUrl) : null;
        const youtubeId = currentPortfolioItem ? getYouTubeVideoId(currentPortfolioItem.videoUrl) : null;

        return (
          <section className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl shadow-cyan-950/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Verified Creator & Engineering Portfolio</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] mt-1">
                  Case Studies & Digital Media Production
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                  Real demonstration of SQA automation engineering, digital branding strategy, and high-impact tech content created by Victor Oladapo Olufemi.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => setCurrentTab('services')}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Book SQA / Brand Service
                </button>
                <button
                  onClick={() => setCurrentTab('ai-lab')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                >
                  Ask AI Digital Twin
                </button>
              </div>
            </div>

            {/* Portfolio Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
              {feedItems.map((item) => {
                const isSelected = (currentPortfolioItem?.id === item.id);
                const isTikTok = !!getTikTokVideoId(item.videoUrl);
                const isPhoto = item.videoUrl.includes('/photo/');

                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedPortfolioId(item.id)}
                    className={`px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                    }`}
                  >
                    <span>{isPhoto ? '📸 TikTok Photo' : isTikTok ? '🎵 TikTok' : '📺 YouTube'}:</span>
                    <span className="line-clamp-1 max-w-[200px]">{item.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Featured Active Portfolio Showcase Card */}
            {currentPortfolioItem && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center rounded-2xl bg-slate-950 border border-slate-800/90 p-5 sm:p-6">
                {/* Video Embed Player */}
                <div className="lg:col-span-6 flex flex-col items-center justify-center bg-black/60 rounded-2xl p-2 border border-slate-800/60 min-h-[380px] sm:min-h-[460px]">
                  {tiktokId ? (
                    <div className="w-full max-w-[320px] sm:max-w-[340px] h-[440px] sm:h-[480px] rounded-xl overflow-hidden shadow-2xl relative">
                      <iframe
                        src={`https://www.tiktok.com/embed/v2/${tiktokId}`}
                        title={currentPortfolioItem.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  ) : youtubeId ? (
                    <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl relative">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                        title={currentPortfolioItem.title}
                        className="w-full h-full min-h-[280px] border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 p-8 text-center">Video player preview available in feed</div>
                  )}
                </div>

                {/* Case Study Details & Takeaways */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      {currentPortfolioItem.category}
                    </span>
                    {currentPortfolioItem.videoUrl.includes('/photo/') ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/40">
                        TikTok Photo & Strategy Carousel
                      </span>
                    ) : tiktokId ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-400 border border-pink-500/40">
                        TikTok Featured Case Study
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                        YouTube Technical Masterclass
                      </span>
                    )}
                    <span className="text-xs text-slate-400 ml-auto font-mono">
                      {currentPortfolioItem.views.toLocaleString()} views • {currentPortfolioItem.likes.toLocaleString()} likes
                    </span>
                  </div>

                  <h4 className="text-lg sm:text-xl font-bold text-white leading-snug font-['Outfit']">
                    {currentPortfolioItem.title}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentPortfolioItem.description}
                  </p>

                  {/* Demonstration Highlights */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      What This Portfolio Piece Demonstrates
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {currentPortfolioItem.keyTakeaways.map((takeaway, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-cyan-400 font-bold shrink-0">✓</span>
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentPortfolioItem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setActiveVideo(currentPortfolioItem);
                        setCurrentTab('feed');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Open in Studio Feed Player</span>
                    </button>

                    <a
                      href={currentPortfolioItem.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{currentPortfolioItem.videoUrl.includes('/photo/') ? 'View on TikTok' : tiktokId ? 'Watch on TikTok' : 'Watch on YouTube'}</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </section>
        );
      })()}

      {/* Live Booking Reference Tracker */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <Clock className="w-4 h-4" />
          <span>Track Optimization Service Order</span>
        </div>
        <h3 className="text-lg font-bold text-white font-['Outfit']">
          Check Your Onboarding & Verification Status
        </h3>
        <p className="text-xs text-slate-400">
          Enter your reference code (e.g. <code>KW-LI-2026-901</code>) to check receipt verification status directly.
        </p>

        <form onSubmit={handleLookupBooking} className="flex gap-2 max-w-md">
          <input
            type="text"
            value={trackingRefInput}
            onChange={(e) => setTrackingRefInput(e.target.value)}
            placeholder="e.g. KW-LI-2026-901"
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white uppercase font-mono"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
          >
            Track Status
          </button>
        </form>

        {searchedBooking && searchedBooking !== 'not_found' && (
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-cyan-400">{searchedBooking.referenceCode}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                {searchedBooking.status}
              </span>
            </div>
            <div>
              <strong className="text-white">{searchedBooking.tierName}</strong> for {searchedBooking.clientName}
            </div>
            <div className="text-[11px] text-slate-400">
              Payment via {searchedBooking.paymentMethod} • Ref Note: {searchedBooking.proofNote || 'Pending verification'}
            </div>
          </div>
        )}

        {searchedBooking === 'not_found' && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            No booking found matching reference "{trackingRefInput}". Please check the spelling or contact Victor on LinkedIn.
          </div>
        )}
      </div>

      {/* Bookmarked Prompts & Stacks */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-cyan-400" />
          <span>Saved Prompt Blueprints & Workflows</span>
        </h3>

        {bookmarkedPrompts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bookmarkedPrompts.map((p) => (
              <div
                key={p.id}
                onClick={() => setCurrentTab('hub')}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer space-y-2 transition-colors"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  {p.promptTargetModel || p.category}
                </span>
                <h4 className="text-sm font-bold text-white">{p.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-center text-xs text-slate-400">
            No saved prompts yet. Explore the{' '}
            <button onClick={() => setCurrentTab('hub')} className="text-cyan-400 underline">
              Tech & AI Hub
            </button>{' '}
            to bookmark templates.
          </div>
        )}
      </div>

      {/* Direct Contact CTA Banner */}
      <div className="pt-4">
        <CreatorCtaBanner variant="compact" />
      </div>
    </div>
  );
};
