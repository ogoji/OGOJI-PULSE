import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Bookmark,
  Heart,
  Share2,
  Clock,
  Sparkles,
  MessageSquare,
  FileText,
  ListOrdered,
  Layers,
  ArrowUpRight,
  Tv,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { usePulseStore } from '../store/usePulseStore';
import { ContentFeedItem, ContentCategory } from '../types';

export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|live\/|shorts\/)|youtube-nocookie\.com\/embed\/)([\w-]{11})/
  );
  return match ? match[1] : null;
}

export function getTikTokVideoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:tiktok\.com\/(?:@[\w.-]+\/(?:video|photo)\/|v\/))(\d+)/);
  return match ? match[1] : null;
}

export const FeedView: React.FC = () => {
  const {
    feedItems,
    activeVideo,
    setActiveVideo,
    toggleLikeFeedItem,
    toggleBookmarkFeedItem,
    categoryFilter,
    setCategoryFilter,
    setCurrentTab,
    submitQAQuestion,
    deleteFeedItem,
    isAdminMode,
  } = usePulseStore();

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [showChapters, setShowChapters] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Quick QA modal from video
  const [showQuickQAModal, setShowQuickQAModal] = useState<boolean>(false);
  const [quickQuestionText, setQuickQuestionText] = useState<string>('');
  const [quickQASubmitted, setQuickQASubmitted] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const categories: ('All' | ContentCategory)[] = [
    'All',
    'SQA Engineering',
    'Tech Workflows',
    'Vlogs',
  ];

  const filteredFeed = feedItems.filter((item) => {
    if (categoryFilter === 'All') return true;
    return item.category === categoryFilter;
  });

  const currentVideo = activeVideo || feedItems[0];
  const youtubeId = currentVideo ? getYouTubeVideoId(currentVideo.videoUrl) : null;
  const tiktokId = currentVideo ? getTikTokVideoId(currentVideo.videoUrl) : null;
  const [ytStartTime, setYtStartTime] = useState<number | null>(null);

  useEffect(() => {
    setYtStartTime(null);
  }, [currentVideo?.id]);

  const handleCategorySelect = (cat: 'All' | ContentCategory) => {
    setCategoryFilter(cat);
    if (cat !== 'All') {
      const target = feedItems.find((item) => item.category === cat);
      if (target) {
        setActiveVideo(target);
      }
    }
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSpeedChange = (rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const handleJumpToChapter = (seconds: number) => {
    if (youtubeId) {
      setYtStartTime(seconds);
      return;
    }
    if (!videoRef.current) return;
    videoRef.current.currentTime = seconds;
    if (!isPlaying) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleShareVideo = (item: ContentFeedItem) => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const handleQuickQASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuestionText.trim()) return;
    submitQAQuestion(
      `[Ref: ${currentVideo.title}] ${quickQuestionText.trim()}`,
      currentVideo.category
    );
    setQuickQASubmitted(true);
    setTimeout(() => {
      setQuickQASubmitted(false);
      setShowQuickQAModal(false);
      setQuickQuestionText('');
    }, 1800);
  };

  return (
    <div id="feed-view" className="space-y-8 pb-12">
      {/* Category Filter Navigation */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-2">
          {categories.map((cat) => {
            const isSelected = categoryFilter === cat;
            return (
              <button
                key={cat}
                id={`category-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => handleCategorySelect(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-medium">
          <Tv className="w-3.5 h-3.5 text-cyan-400" />
          <span>{filteredFeed.length} episodes available</span>
        </div>
      </div>

      {/* Featured Talking-Head Media Player Showcase */}
      {currentVideo && (
        <section
          id="featured-talking-head-player"
          className="rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-slate-800/90 overflow-hidden shadow-2xl shadow-cyan-950/20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Embedded Custom Video Player (TikTok Vlog, YouTube Stream, or HTML5 Video) */}
            {tiktokId ? (
              <div className="lg:col-span-8 bg-slate-950 relative flex flex-col justify-between items-center p-3.5 sm:p-5 min-h-[460px] sm:min-h-[580px]">
                {/* Top Video Header Overlay */}
                <div className="w-full flex items-center justify-between mb-3 z-10">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-cyan-500 text-slate-950 shadow-md">
                      {currentVideo.category}
                    </span>
                    {currentVideo.videoUrl.includes('/photo/') ? (
                      <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-slate-900 border border-purple-500/40 text-purple-300 backdrop-blur-md flex items-center gap-1.5 shadow-md">
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                        <span>TIKTOK PHOTO RELEASE</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-slate-900 border border-pink-500/40 text-pink-400 backdrop-blur-md flex items-center gap-1.5 shadow-md">
                        <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                        <span>TIKTOK VLOG</span>
                      </span>
                    )}
                  </div>
                  <a
                    href={currentVideo.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900/90 hover:bg-slate-800 text-pink-300 border border-pink-500/40 backdrop-blur-md flex items-center gap-1.5 transition-colors shadow-lg hover:border-pink-400"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-pink-400" />
                    <span>{currentVideo.videoUrl.includes('/photo/') ? 'View on TikTok' : 'Watch on TikTok'}</span>
                  </a>
                </div>

                {/* TikTok Embed Iframe Container */}
                <div className="w-full max-w-[340px] sm:max-w-[380px] h-[480px] sm:h-[530px] rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl relative">
                  <iframe
                    src={`https://www.tiktok.com/embed/v2/${tiktokId}`}
                    title={currentVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>

                <div className="w-full mt-3 text-center text-xs text-slate-400">
                  <span>Featuring Victor Oladapo Olufemi (<a href="https://www.tiktok.com/@ogojithecreator._" target="_blank" rel="noreferrer" className="text-pink-400 hover:underline">@ogojithecreator._</a>)</span>
                </div>
              </div>
            ) : youtubeId ? (
              <div className="lg:col-span-8 bg-black relative flex flex-col justify-center min-h-[300px] sm:min-h-[460px] aspect-video">
                <iframe
                  key={`${youtubeId}_${ytStartTime || 0}`}
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1${
                    ytStartTime !== null ? `&start=${ytStartTime}` : ''
                  }`}
                  title={currentVideo.title}
                  className="w-full h-full min-h-[300px] sm:min-h-[460px] border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />

                {/* Top Video Header Overlay */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
                  <div className="flex items-center gap-2 pointer-events-auto">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-cyan-500 text-slate-950 shadow-md">
                      {currentVideo.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-rose-600 text-white backdrop-blur-md flex items-center gap-1.5 shadow-md shadow-rose-950/40">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      <span>YOUTUBE STREAM</span>
                    </span>
                  </div>
                  <a
                    href={currentVideo.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="pointer-events-auto px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 backdrop-blur-md flex items-center gap-1.5 transition-colors shadow-lg hover:border-rose-500/50"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
                    <span>Watch on YouTube</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="lg:col-span-8 bg-black relative flex flex-col justify-center min-h-[280px] sm:min-h-[420px]">
                <video
                  ref={videoRef}
                  src={currentVideo.videoUrl}
                  poster={currentVideo.thumbnail}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover max-h-[500px]"
                />

                {/* Custom Overlay Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                {/* Top Video Header */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-cyan-500/90 text-slate-950 backdrop-blur-md">
                    {currentVideo.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-black/60 text-white backdrop-blur-md border border-white/10">
                      {currentVideo.duration}
                    </span>
                  </div>
                </div>

                {/* Center Play Button Overlay (when paused) */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-auto">
                    <button
                      id="video-play-center-btn"
                      onClick={handlePlayPause}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-slate-950 flex items-center justify-center pl-1 shadow-2xl shadow-cyan-400/50 hover:scale-105 transition-all cursor-pointer"
                    >
                      <Play className="w-8 h-8 fill-current" />
                    </button>
                  </div>
                )}

                {/* Bottom Video Control Bar */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10 z-10 pointer-events-auto text-white">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePlayPause}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-cyan-400 hover:text-white transition-colors"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <span className="text-xs text-slate-300 hidden sm:inline">
                      Victor Olufemi (@ogojithecreator._)
                    </span>
                  </div>

                  {/* Speed & Chapters */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60 text-[11px]">
                      {[1, 1.25, 1.5, 2].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => handleSpeedChange(rate)}
                          className={`px-1.5 py-0.5 rounded font-mono ${
                            playbackRate === rate ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setShowChapters(!showChapters)}
                      className={`p-1.5 rounded-lg text-xs flex items-center gap-1 border ${
                        showChapters ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-800/80 border-slate-700 text-slate-300'
                      }`}
                      title="Video Chapters"
                    >
                      <ListOrdered className="w-4 h-4" />
                      <span className="hidden sm:inline">Chapters</span>
                    </button>

                    <button
                      onClick={() => setShowTranscript(!showTranscript)}
                      className={`p-1.5 rounded-lg text-xs flex items-center gap-1 border ${
                        showTranscript ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-800/80 border-slate-700 text-slate-300'
                      }`}
                      title="Transcript"
                    >
                      <FileText className="w-4 h-4" />
                      <span className="hidden sm:inline">Transcript</span>
                    </button>

                    <button
                      onClick={() => videoRef.current?.requestFullscreen?.()}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Video Details & Interaction Column */}
            <div className="lg:col-span-4 p-5 sm:p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900/60">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    {currentVideo.publishedAt}
                  </span>
                  <span>{currentVideo.views.toLocaleString()} views</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug font-['Outfit']">
                  {currentVideo.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentVideo.description}
                </p>

                {/* Key Takeaways */}
                <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    Key Direct Takeaways
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {currentVideo.keyTakeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold shrink-0">•</span>
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Chapters Drawer if open */}
                {showChapters && currentVideo.chapters && (
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-2 animate-in fade-in duration-150">
                    <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                      Episode Chapters
                    </div>
                    <div className="space-y-1">
                      {currentVideo.chapters.map((ch, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleJumpToChapter(ch.timeSeconds)}
                          className="w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-xs text-slate-300 hover:text-cyan-300 transition-colors"
                        >
                          <span className="line-clamp-1">{ch.label}</span>
                          <span className="font-mono text-[11px] text-cyan-400 ml-2">
                            {Math.floor(ch.timeSeconds / 60)}:
                            {(ch.timeSeconds % 60).toString().padStart(2, '0')}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Transcript Drawer if open */}
                {showTranscript && (
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-2 max-h-44 overflow-y-auto animate-in fade-in duration-150">
                    <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center justify-between">
                      <span>Direct Transcript</span>
                      <span className="text-[10px] text-slate-500">Audio Extracted</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      "{currentVideo.transcript}"
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons: Like, Bookmark, Share, Ask Question, Linked Resource */}
              <div className="pt-4 border-t border-slate-800 mt-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      id="like-current-video-btn"
                      onClick={() => toggleLikeFeedItem(currentVideo.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        currentVideo.isLiked
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${currentVideo.isLiked ? 'fill-rose-500' : ''}`} />
                      <span>{currentVideo.likes}</span>
                    </button>

                    <button
                      id="bookmark-current-video-btn"
                      onClick={() => toggleBookmarkFeedItem(currentVideo.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        currentVideo.isBookmarked
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:text-white'
                      }`}
                      title="Save Video"
                    >
                      <Bookmark className={`w-4 h-4 ${currentVideo.isBookmarked ? 'fill-cyan-400' : ''}`} />
                    </button>

                    <button
                      id="share-current-video-btn"
                      onClick={() => handleShareVideo(currentVideo)}
                      className="p-2 rounded-xl border bg-slate-800/60 border-slate-700/60 text-slate-300 hover:text-white transition-all cursor-pointer relative"
                      title="Share Episode"
                    >
                      <Share2 className="w-4 h-4" />
                      {copiedNotification && (
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] rounded bg-cyan-500 text-slate-950 font-bold whitespace-nowrap">
                          Link Copied!
                        </span>
                      )}
                    </button>
                  </div>

                  <button
                    id="ask-victor-quick-qa-btn"
                    onClick={() => setShowQuickQAModal(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ask Victor</span>
                  </button>
                </div>

                {currentVideo.linkedResourceId && (
                  <button
                    onClick={() => setCurrentTab('hub')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      View Companion Prompt / SQA Log
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Episodes & Vlog Releases Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Tv className="w-5 h-5 text-cyan-400" />
              <span>Episodes & Vlog Releases</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Explore Victor's verified TikTok video releases, SQA engineering playbooks, and LinkedIn optimization case studies
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filteredFeed.length} {filteredFeed.length === 1 ? 'video' : 'videos'}
          </span>
        </div>

        {filteredFeed.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <p className="text-slate-300 text-sm font-semibold">
              No videos published in this category yet.
            </p>
            <p className="text-slate-500 text-xs">
              Select "All Videos" to watch all verified releases by Victor Oladapo Olufemi.
            </p>
            <button
              onClick={() => setCategoryFilter('All')}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
            >
              Show All Videos ({feedItems.length})
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredFeed.map((item) => {
            const isCurrent = currentVideo?.id === item.id;
            const isTikTok = !!getTikTokVideoId(item.videoUrl);
            const isYouTube = !!getYouTubeVideoId(item.videoUrl);

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-slate-900 border-cyan-500/60 shadow-xl shadow-cyan-950/30 ring-1 ring-cyan-500/40'
                    : 'bg-slate-900/70 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Card Top: Thumbnail & Badges */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950 group">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                        item.category === 'Vlogs'
                          ? 'bg-pink-500 text-white'
                          : 'bg-cyan-500 text-slate-950'
                      }`}
                    >
                      {item.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {item.videoUrl.includes('/photo/') ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/90 text-white backdrop-blur-md flex items-center gap-1 shadow-md">
                          <span>TikTok Photo</span>
                        </span>
                      ) : isTikTok ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-pink-500/90 text-white backdrop-blur-md flex items-center gap-1 shadow-md">
                          <span>TikTok Vlog</span>
                        </span>
                      ) : isYouTube ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-600 text-white backdrop-blur-md flex items-center gap-1 shadow-md">
                          <span>YouTube Stream</span>
                        </span>
                      ) : null}

                      {isAdminMode && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFeedItem(item.id);
                          }}
                          title="Delete this release"
                          className="p-1 rounded-lg bg-rose-950/90 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-700/60 transition-all cursor-pointer shadow-md"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Duration & Play prompt */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-black/70 text-white backdrop-blur-sm border border-white/10">
                      {item.duration}
                    </span>
                    <button
                      onClick={() => {
                        setActiveVideo(item);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg transition-transform active:scale-95 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isCurrent ? 'Now Playing' : 'Watch Now'}</span>
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-medium">
                      <span>{item.publishedAt}</span>
                      <span>{item.views.toLocaleString()} views</span>
                    </div>
                    <h4 className="text-base font-bold text-white line-clamp-2 leading-snug group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleLikeFeedItem(item.id)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                          item.isLiked
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                            : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${item.isLiked ? 'fill-rose-500' : ''}`} />
                        <span>{item.likes}</span>
                      </button>

                      <button
                        onClick={() => toggleBookmarkFeedItem(item.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          item.isBookmarked
                            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                            : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-white'
                        }`}
                        title="Bookmark"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${item.isBookmarked ? 'fill-cyan-400' : ''}`} />
                      </button>
                    </div>

                    <a
                      href={item.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                    >
                      <span>{isTikTok ? 'TikTok Page' : 'YouTube Link'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </section>

      {/* Professional Services & Ecosystem Showcase */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Professional Services & Creator Ecosystem</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Transform your tech presence, access SQA testing matrices, and book 1-on-1 profile optimization with Victor
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('services')}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>View All Services</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            onClick={() => setCurrentTab('services')}
            className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/30 hover:border-cyan-400/60 space-y-3 cursor-pointer transition-all hover:-translate-y-1 shadow-lg shadow-cyan-950/20 group"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                FLAGSHIP SERVICE
              </span>
              <ArrowUpRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
              LinkedIn Profile Optimization
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transform your profile into an inbound recruiter magnet with ATS algorithm targeting and measurable STAR bullets.
            </p>
          </div>

          <div
            onClick={() => setCurrentTab('hub')}
            className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-500/30 hover:border-purple-400/60 space-y-3 cursor-pointer transition-all hover:-translate-y-1 shadow-lg shadow-purple-950/20 group"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                SQA FRAMEWORKS
              </span>
              <ArrowUpRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
              Pre-Flight SQA Release Logs
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Actionable 15-point regression test matrices and checklist tools for web, API, and mobile applications.
            </p>
          </div>

          <div
            onClick={() => setCurrentTab('profile')}
            className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/30 hover:border-emerald-400/60 space-y-3 cursor-pointer transition-all hover:-translate-y-1 shadow-lg shadow-emerald-950/20 group"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                CREATOR PORTFOLIO
              </span>
              <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
              Case Studies & Proof
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore Victor's verified talking-head breakdowns, SQA playbook reels, and client optimization case studies.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Ask Victor Modal */}
      {showQuickQAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                <h4 className="text-lg font-bold">Ask Victor for Next Video</h4>
              </div>
              <button
                onClick={() => setShowQuickQAModal(false)}
                className="text-slate-400 hover:text-white text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Submit your question regarding: <span className="text-slate-200 font-semibold">{currentVideo.title}</span>. Top voted questions are answered directly in upcoming talking-head episodes!
            </p>

            <form onSubmit={handleQuickQASubmit} className="space-y-4">
              <textarea
                value={quickQuestionText}
                onChange={(e) => setQuickQuestionText(e.target.value)}
                placeholder="What part of this workflow would you like Victor to dive deeper into?"
                rows={4}
                className="w-full p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />

              {quickQASubmitted ? (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold text-center">
                  ✓ Question submitted to Community Q&A queue!
                </div>
              ) : (
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowQuickQAModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-medium text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-bold hover:brightness-110 cursor-pointer"
                  >
                    Queue Question
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
