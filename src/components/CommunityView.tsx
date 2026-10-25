import React, { useState } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  Send,
  Sparkles,
  HelpCircle,
  Video,
  CheckCircle2,
  Clock,
  Filter,
  User,
  ShieldCheck,
  PlusCircle,
  MessageCircle,
} from 'lucide-react';
import { usePulseStore } from '../store/usePulseStore';
import { DiscussionPost } from '../types';
import { createFirestoreDiscussion, createFirestoreQAQuestion } from '../lib/firebase';

export const CommunityView: React.FC = () => {
  const {
    discussions,
    addDiscussionPost,
    likeDiscussionPost,
    addDiscussionReply,
    qaQuestions,
    submitQAQuestion,
    upvoteQAQuestion,
    currentUser,
    isAdminMode,
  } = usePulseStore();

  const [activeTab, setActiveTab] = useState<'discussions' | 'qa'>('discussions');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // Discussion Form State
  const [showNewPostModal, setShowNewPostModal] = useState<boolean>(false);
  const [newPostTitle, setNewPostTitle] = useState<string>('');
  const [newPostContent, setNewPostContent] = useState<string>('');
  const [newPostTag, setNewPostTag] = useState<DiscussionPost['tag']>('AI & Tools');

  // Reply state
  const [replyInputMap, setReplyInputMap] = useState<Record<string, string>>({});
  const [openReplyPostId, setOpenReplyPostId] = useState<string | null>(null);

  // Q&A Form State
  const [newQuestionText, setNewQuestionText] = useState<string>('');
  const [newQuestionCategory, setNewQuestionCategory] = useState<string>('Tech & AI Workflows');
  const [qaSuccessMessage, setQaSuccessMessage] = useState<boolean>(false);

  const tags = ['All', 'AI & Tools', 'SQA Testing', 'Creator Workflow', 'Career'];

  const filteredDiscussions = discussions.filter((d) => {
    if (selectedTag === 'All') return true;
    return d.tag === selectedTag;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    addDiscussionPost(newPostTitle.trim(), newPostContent.trim(), newPostTag);

    createFirestoreDiscussion({
      authorId: currentUser.id,
      authorName: currentUser.name || 'Builder',
      authorAvatar: currentUser.avatar,
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      category: newPostTag,
      tags: [newPostTag],
    }).catch((err) => console.warn('Firestore discussion sync warning:', err));

    setNewPostTitle('');
    setNewPostContent('');
    setShowNewPostModal(false);
  };

  const handleSendReply = (postId: string) => {
    const text = replyInputMap[postId];
    if (!text || !text.trim()) return;
    addDiscussionReply(postId, text.trim());
    setReplyInputMap({ ...replyInputMap, [postId]: '' });
  };

  const handleCreateQA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    submitQAQuestion(newQuestionText.trim(), newQuestionCategory, currentUser.name);

    createFirestoreQAQuestion({
      authorId: currentUser.id,
      authorName: currentUser.name || 'Community Member',
      questionText: newQuestionText.trim(),
      category: newQuestionCategory,
    }).catch((err) => console.warn('Firestore QA sync warning:', err));

    setNewQuestionText('');
    setQaSuccessMessage(true);
    setTimeout(() => setQaSuccessMessage(false), 3000);
  };

  return (
    <div id="community-view" className="space-y-8 pb-12">
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Outfit']">
            Community & Direct Q&A
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Connect with fellow builders, discuss AI & QA architectures, and pitch topics for Victor's next video.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            id="community-tab-discussions"
            onClick={() => setActiveTab('discussions')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'discussions'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Discussion Board</span>
          </button>

          <button
            id="community-tab-qa"
            onClick={() => setActiveTab('qa')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'qa'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Direct Video Q&A ({qaQuestions.length})</span>
          </button>
        </div>
      </div>

      {/* DISCUSSIONS BOARD */}
      {activeTab === 'discussions' && (
        <div className="space-y-6">
          {/* Controls: Tag filter & Start Discussion Button */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTag(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedTag === t
                      ? 'bg-slate-800 text-cyan-400 border border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              id="start-discussion-btn"
              onClick={() => setShowNewPostModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Start Discussion</span>
            </button>
          </div>

          {/* Discussion Posts List */}
          <div className="space-y-4">
            {filteredDiscussions.length === 0 ? (
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-8 sm:p-12 text-center space-y-4">
                <MessageSquare className="w-10 h-10 text-cyan-400/60 mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white">No discussions yet</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Be the first to start a conversation, share an engineering insight, or discuss tech workflows with Victor and the community.
                  </p>
                </div>
                <button
                  onClick={() => setShowNewPostModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:brightness-110 cursor-pointer shadow-md shadow-cyan-500/20"
                >
                  Start the First Discussion
                </button>
              </div>
            ) : (
              filteredDiscussions.map((post) => {
              const isExpandedReplies = openReplyPostId === post.id;

              return (
                <div
                  key={post.id}
                  id={`discussion-post-${post.id}`}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 sm:p-6 space-y-4 hover:border-slate-700 transition-all"
                >
                  {/* Author Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-cyan-500/40"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-white">
                            {post.authorName}
                          </span>
                          {post.isCreator && (
                            <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                              Creator
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {post.authorHandle} • {post.createdAt}
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {post.tag}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-slate-100">{post.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  {/* Actions & Replies count */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => likeDiscussionPost(post.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                          post.isLiked
                            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                            : 'bg-slate-800/50 border-slate-700/50 hover:text-white'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{post.likes}</span>
                      </button>

                      <button
                        onClick={() => setOpenReplyPostId(isExpandedReplies ? null : post.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:text-white transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{post.replies.length} replies</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setOpenReplyPostId(post.id)}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                    >
                      Reply to Thread
                    </button>
                  </div>

                  {/* Thread Replies Section */}
                  {isExpandedReplies && (
                    <div className="pt-3 border-t border-slate-800 space-y-3">
                      {post.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3"
                        >
                          <img
                            src={reply.authorAvatar}
                            alt={reply.authorName}
                            className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-700"
                          />
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-200">{reply.authorName}</span>
                              {reply.isCreator && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-400">
                                  Victor Olufemi
                                </span>
                              )}
                              <span className="text-[10px] text-slate-500">{reply.createdAt}</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed">{reply.content}</p>
                          </div>
                        </div>
                      ))}

                      {/* Reply Input */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={replyInputMap[post.id] || ''}
                          onChange={(e) =>
                            setReplyInputMap({ ...replyInputMap, [post.id]: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendReply(post.id);
                          }}
                          placeholder={`Reply as ${
                            isAdminMode ? 'Victor Olufemi (Creator)' : currentUser.name
                          }...`}
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                        <button
                          onClick={() => handleSendReply(post.id)}
                          className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
            )}
          </div>
        </div>
      )}

      {/* DIRECT VIDEO Q&A QUEUE */}
      {activeTab === 'qa' && (
        <div className="space-y-6">
          {/* Submit Question Card */}
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <Video className="w-4 h-4" />
              <span>Direct Talking-Head Segment Pitch</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-['Outfit']">
              Submit a Question for Victor’s Next Video
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Victor regularly reviews the community queue and records dedicated direct-to-camera breakdowns for top-upvoted questions.
            </p>

            <form onSubmit={handleCreateQA} className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    required
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="e.g. How do you automate API schema regression checks before client handoff?"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <select
                    value={newQuestionCategory}
                    onChange={(e) => setNewQuestionCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Tech & AI Workflows">Tech & AI Workflows</option>
                    <option value="SQA & Testing">SQA & Testing</option>
                    <option value="Career & Optimization">Career & Optimization</option>
                    <option value="Creator Studio Gear">Creator Studio Gear</option>
                  </select>
                </div>
              </div>

              {qaSuccessMessage ? (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold text-center">
                  ✓ Question added to community queue! Fellow members can now upvote it.
                </div>
              ) : (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-bold hover:brightness-110 cursor-pointer shadow-md shadow-cyan-500/20"
                  >
                    Submit Question to Queue
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Question List */}
          <div className="space-y-3">
            {qaQuestions.length === 0 ? (
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-8 text-center space-y-3">
                <Video className="w-8 h-8 text-cyan-400/60 mx-auto" />
                <h4 className="text-sm font-bold text-white">Queue is ready for questions</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  No questions submitted yet. Be the first to ask Victor a question for his upcoming video breakdown!
                </p>
              </div>
            ) : (
              qaQuestions.map((q) => {
              const statusBadges = {
                pending: 'bg-slate-800 text-slate-400 border-slate-700',
                queued_for_vlog: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
                answered_in_episode: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
              };

              const statusLabels = {
                pending: 'In Community Queue',
                queued_for_vlog: '🎬 Queued for Next Video',
                answered_in_episode: '✓ Answered in Video',
              };

              return (
                <div
                  key={q.id}
                  id={`qa-item-${q.id}`}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-cyan-400">{q.category}</span>
                      <span className="text-[10px] text-slate-500">•</span>
                      <span className="text-[11px] text-slate-400">Asked by {q.requesterName}</span>
                      <span className="text-[10px] text-slate-500">•</span>
                      <span className="text-[11px] text-slate-500">{q.createdAt}</span>
                    </div>

                    <h4 className="text-sm sm:text-base font-semibold text-white leading-snug">
                      "{q.question}"
                    </h4>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${
                          statusBadges[q.status]
                        }`}
                      >
                        {statusLabels[q.status]}
                      </span>

                      {q.answeredEpisodeTitle && (
                        <span className="text-[11px] text-cyan-400 italic">
                          ({q.answeredEpisodeTitle})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Upvote Button */}
                  <button
                    id={`upvote-btn-${q.id}`}
                    onClick={() => upvoteQAQuestion(q.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border min-w-[54px] cursor-pointer transition-all ${
                      q.isUpvoted
                        ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-sm shadow-cyan-500/20'
                        : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${q.isUpvoted ? 'fill-cyan-400' : ''}`} />
                    <span className="text-xs font-mono font-bold mt-1">{q.upvotes}</span>
                  </button>
                </div>
              );
            })
            )}
          </div>
        </div>
      )}

      {/* New Discussion Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 text-white">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold">Start a Community Discussion</h4>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Topic Title</label>
                <input
                  type="text"
                  required
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="e.g. Best practices for testing Next.js server actions"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Category Tag</label>
                <select
                  value={newPostTag}
                  onChange={(e) => setNewPostTag(e.target.value as DiscussionPost['tag'])}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                >
                  <option value="AI & Tools">AI & Tools</option>
                  <option value="SQA Testing">SQA Testing</option>
                  <option value="Creator Workflow">Creator Workflow</option>
                  <option value="Career">Career</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Details / Thoughts</label>
                <textarea
                  required
                  rows={4}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share the problem, your current approach, or context..."
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-bold"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
