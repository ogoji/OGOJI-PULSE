import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Share2,
  ThumbsUp,
  MessageCircle,
  Sparkles,
  ExternalLink,
  Flame,
  Zap,
  Users,
  Instagram,
  CheckCircle2,
  ArrowRight,
  Plus,
  Radio,
  Clock,
  Send,
  Loader2,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { usePulseStore } from '../store/usePulseStore';
import { ConnectModal } from './ConnectModal';
import {
  createFirestoreEngagementCampaign,
  subscribeToEngagementCampaigns,
} from '../lib/firebase';

interface CommunityDrop {
  id: string;
  authorName: string;
  platform: 'Instagram' | 'TikTok' | 'YouTube' | 'X/Twitter' | 'LinkedIn' | 'Snapchat';
  postUrl: string;
  title: string;
  targetInteractions: number;
  interactionsDelivered: number;
  packageType: string;
  createdAt?: any;
}

export const SocialEngagementHub: React.FC = () => {
  const { currentUser } = usePulseStore();
  const [showConnectModal, setShowConnectModal] = useState<boolean>(false);

  const [activePlatformFilter, setActivePlatformFilter] = useState<string>('All');
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [drops, setDrops] = useState<CommunityDrop[]>([]);

  // Form State for Submitting Post Link
  const [newPostUrl, setNewPostUrl] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState<CommunityDrop['platform']>('Instagram');
  const [newPackage, setNewPackage] = useState('Starter Velocity Pack');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Subscribe to real Firestore campaigns
  useEffect(() => {
    const unsubscribe = subscribeToEngagementCampaigns((firestoreCampaigns) => {
      if (firestoreCampaigns) {
        const formatted: CommunityDrop[] = firestoreCampaigns.map((fc) => ({
          id: fc.id,
          authorName: fc.authorName || 'Community Member',
          platform: fc.platform || 'Instagram',
          postUrl: fc.postUrl,
          title: fc.title || fc.postUrl,
          targetInteractions: fc.targetInteractions || 200,
          interactionsDelivered: fc.interactionsDelivered || 0,
          packageType: fc.packageType || 'Community Boost',
          createdAt: fc.createdAt,
        }));
        setDrops(formatted);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmitDrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostUrl.trim() || !newPostTitle.trim()) return;

    setIsSubmitting(true);
    try {
      await createFirestoreEngagementCampaign({
        userId: currentUser.id,
        authorName: currentUser.name || 'Pulse Creator',
        platform: newPlatform,
        postUrl: newPostUrl.trim(),
        packageType: newPackage,
        targetInteractions:
          newPackage === 'Full Viral Surge Campaign'
            ? 1000
            : newPackage === 'Creator Collab & Feed Feature'
            ? 500
            : 200,
      });

      // Optimistic local add
      const newDropItem: CommunityDrop = {
        id: `local-${Date.now()}`,
        authorName: currentUser.name || 'Pulse Creator',
        platform: newPlatform,
        postUrl: newPostUrl.trim(),
        title: newPostTitle.trim(),
        targetInteractions: 250,
        interactionsDelivered: 12,
        packageType: newPackage,
      };

      setDrops([newDropItem, ...drops]);
      setNewPostUrl('');
      setNewPostTitle('');
      setShowSubmitModal(false);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to submit drop:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDrops = drops.filter((d) => {
    if (activePlatformFilter === 'All') return true;
    return d.platform === activePlatformFilter;
  });

  return (
    <div id="social-engagement-hub" className="space-y-12 pb-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 text-pink-400 border border-pink-500/30">
          <Flame className="w-3.5 h-3.5 text-pink-400 animate-bounce" />
          <span>Social Media Engagement & Viral Amplification Engine</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-['Outfit']">
          Get Real Engagements, Algorithm Velocity & Viral Reach
        </h2>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Scale your Instagram Reels, TikToks, YouTube Shorts, and X posts. Access Victor's 50K+ tech audience, join our VIP algorithmic engagement pods, and tap into dedicated boost campaigns.
        </p>
      </div>

      {/* 3 Core Engagement Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Channel 1: VIP Pod */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-pink-500/40 transition-all flex flex-col justify-between space-y-5 relative overflow-hidden group shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />

          <div className="space-y-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 shadow-md">
              <Users className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold text-pink-400 uppercase tracking-wider">
                Instant 30-Min Push
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Victor's VIP Viral Engagement Pod
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Join our private circle of tech creators and builders on WhatsApp. Drop your post within 30 minutes of release to trigger the golden algorithmic distribution window with genuine comments, saves, and shares.
            </p>

            <div className="space-y-1.5 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Organic & Genuine Creator Accounts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>High-Retention Comments & Bookmarks</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp VIP Group Direct Access</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 relative z-10">
            <button
              onClick={() => setShowConnectModal(true)}
              className="w-full py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-pink-500/25 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Join Engagement Pod via WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Channel 2: Collab & Stitch */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-5 relative overflow-hidden group shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />

          <div className="space-y-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md">
              <Share2 className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Audience Cross-Pollination
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Collab, Duet & Stitch with Victor
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Co-author a TikTok or YouTube Short with <span className="text-cyan-300 font-semibold">@ogojithecreator._</span>. Victor reacts, pins, and credits your account, immediately routing thousands of verified tech & AI viewers to your profile.
            </p>

            <div className="space-y-1.5 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>TikTok: @ogojithecreator._</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
                <span>YouTube: @ogojithecreator._</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400" />
                <span>Snapchat: ogojithecreator</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>X/Twitter: @victor4femi</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 relative z-10">
            <a
              href="https://tiktok.com/@ogojithecreator._"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Collab with @ogojithecreator._ on TikTok</span>
            </a>
          </div>
        </div>

        {/* Channel 3: Managed Engagement Campaigns */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-5 relative overflow-hidden group shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />

          <div className="space-y-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                Full-Service Velocity
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Managed Viral Boost Packages
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Book dedicated organic engagement campaigns with transparent PalmPay / USDT payment. We audit your video hook, synchronize comments from niche developers, and drive retention rate past the 70% viral threshold.
            </p>

            <div className="space-y-1.5 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Starter Pack: 250+ Target Interactions (₦15,000)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Creator Collab Push: 500+ Reach (₦35,000)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Viral Surge: Cross-Platform Blitz (₦75,000)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 relative z-10">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/25 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Submit Post for Engagement Boost</span>
            </button>
          </div>
        </div>
      </div>

      {submitSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              Your post has been submitted to the OgojiPulse Engagement Engine and synced to Cloud Firestore!
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 uppercase">Live in Feed</span>
        </div>
      )}

      {/* Community Drops & Engagement Exchange Wall */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-pink-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-wider">
                Live Engagement Exchange
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Active Community Posts Needing Engagement
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Support fellow creators! Click any link to watch, drop a meaningful comment, and boost algorithmic circulation.
            </p>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Boost Your Content Link</span>
          </button>
        </div>

        {/* Platform Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {['All', 'Instagram', 'TikTok', 'YouTube', 'Snapchat', 'X/Twitter'].map((plat) => (
            <button
              key={plat}
              onClick={() => setActivePlatformFilter(plat)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activePlatformFilter === plat
                  ? 'bg-white text-slate-950 font-bold shadow-md'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {plat}
            </button>
          ))}
        </div>

        {/* Grid of Community Drops or Clean Empty State */}
        {filteredDrops.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
            <Radio className="w-8 h-8 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No active engagement drops yet</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Be the first creator to submit your Instagram, TikTok, YouTube, or X post to launch an organic engagement push.
            </p>
            <button
              onClick={() => setShowSubmitModal(true)}
              className="mt-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Submit Your First Post
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDrops.map((drop) => {
              const progressPercent = Math.min(
                100,
                Math.round((drop.interactionsDelivered / drop.targetInteractions) * 100)
              );

              return (
                <div
                  key={drop.id}
                  className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                        {drop.platform}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {drop.packageType}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {drop.title}
                    </h4>

                    <p className="text-xs text-slate-500 font-medium">
                      By <span className="text-slate-300 font-semibold">{drop.authorName}</span>
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/60">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Interactions Delivered</span>
                      <span className="text-cyan-400 font-bold">
                        {drop.interactionsDelivered} / {drop.targetInteractions} ({progressPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <a
                      href={drop.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <span>Engage on {drop.platform}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Active Boost</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Submit Your Content Link for Engagement Boost */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-wider">
                  Engagement Engine
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  Submit Post for Engagement Boost
                </h3>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitDrop} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Target Platform</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {(['Instagram', 'TikTok', 'YouTube', 'Snapchat', 'X/Twitter'] as const).map((plat) => (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => setNewPlatform(plat)}
                      className={`py-2 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                        newPlatform === plat
                          ? 'bg-pink-500 text-white font-bold border-pink-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {plat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Content Post / Reel / Snap Story URL</label>
                <input
                  type="url"
                  required
                  value={newPostUrl}
                  onChange={(e) => setNewPostUrl(e.target.value)}
                  placeholder="https://tiktok.com/@... or https://youtube.com/shorts/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Post Hook / Headline</label>
                <input
                  type="text"
                  required
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="e.g. 3 AI prompts that saved 10 hours of manual QA"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Select Boost Package</label>
                <select
                  value={newPackage}
                  onChange={(e) => setNewPackage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="Starter Velocity Pack">Starter Velocity Pack (200+ Engagements - ₦15,000 / $12)</option>
                  <option value="Creator Collab & Feed Feature">Creator Collab & Feed Feature (500+ Engagements - ₦35,000 / $28)</option>
                  <option value="Full Viral Surge Campaign">Full Viral Surge Campaign (1,000+ Engagements - ₦75,000 / $55)</option>
                  <option value="Community Pod Free Drop">Community Pod Drop (Peer-to-Peer Exchange - Free)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newPostUrl.trim() || !newPostTitle.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-pink-500/25 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Syncing to Firestore...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      <span>Start Engagement Boost</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Connect Modal */}
      <ConnectModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
      />
    </div>
  );
};
