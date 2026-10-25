import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ContentFeedItem,
  ResourceItem,
  DiscussionPost,
  CommunityQAQuestion,
  ServiceTier,
  ServiceBooking,
  ContentScheduleItem,
  UserProfile,
  ScheduleStatus,
} from '../types';
import {
  CREATOR_PROFILE,
  USER_DEFAULT_AVATAR,
  INITIAL_FEED_ITEMS,
  INITIAL_RESOURCES,
  INITIAL_DISCUSSIONS,
  INITIAL_QA_QUESTIONS,
  INITIAL_BOOKINGS,
  INITIAL_SCHEDULE_ITEMS,
  INITIAL_SERVICE_TIERS,
} from '../data/mockData';

export type ActiveTab = 'feed' | 'ai-lab' | 'engagement' | 'hub' | 'services' | 'community' | 'profile' | 'admin';

interface PulseState {
  currentTab: ActiveTab;
  setCurrentTab: (tab: ActiveTab) => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;

  // Mode (Audience vs Creator/Admin)
  isAdminMode: boolean;
  toggleAdminMode: () => void;
  setIsAdminMode: (admin: boolean) => void;

  // Onboarding
  hasCompletedOnboarding: boolean;
  completeOnboarding: (interests: string[], name?: string) => void;
  resetOnboarding: () => void;

  // Current User
  currentUser: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // Video Media Stream
  feedItems: ContentFeedItem[];
  activeVideo: ContentFeedItem | null;
  setActiveVideo: (item: ContentFeedItem | null) => void;
  toggleLikeFeedItem: (id: string) => void;
  toggleBookmarkFeedItem: (id: string) => void;
  addNewFeedItem: (item: Omit<ContentFeedItem, 'id' | 'views' | 'likes' | 'publishedAt'>) => void;
  deleteFeedItem: (id: string) => void;

  // Resources (Prompts, SQA logs, tools)
  resources: ResourceItem[];
  bookmarkedResourceIds: string[];
  toggleBookmarkResource: (id: string) => void;
  completedTasks: Record<string, boolean>;
  toggleTaskCompleted: (taskId: string) => void;
  resetChecklist: (resourceId: string) => void;
  recordResourceCopy: (id: string) => void;

  // Community Discussions
  discussions: DiscussionPost[];
  addDiscussionPost: (title: string, content: string, tag: DiscussionPost['tag']) => void;
  likeDiscussionPost: (id: string) => void;
  addDiscussionReply: (postId: string, content: string) => void;

  // Direct Q&A
  qaQuestions: CommunityQAQuestion[];
  submitQAQuestion: (question: string, category: string, requesterName?: string) => void;
  upvoteQAQuestion: (id: string) => void;
  adminUpdateQAStatus: (id: string, status: CommunityQAQuestion['status'], episodeTitle?: string) => void;

  // Premium Services & Bookings
  serviceTiers: ServiceTier[];
  selectedTierForBooking: ServiceTier | null;
  setSelectedTierForBooking: (tier: ServiceTier | null) => void;
  bookings: ServiceBooking[];
  createBooking: (booking: Omit<ServiceBooking, 'id' | 'createdAt' | 'status'>) => ServiceBooking;
  adminUpdateBookingStatus: (id: string, status: ServiceBooking['status'], note?: string) => void;

  // Creator Content Scheduler
  scheduleItems: ContentScheduleItem[];
  addScheduleItem: (item: Omit<ContentScheduleItem, 'id'>) => void;
  updateScheduleStatus: (id: string, status: ScheduleStatus) => void;
  deleteScheduleItem: (id: string) => void;
}

export const usePulseStore = create<PulseState>()(
  persist(
    (set, get) => ({
      currentTab: 'feed',
      setCurrentTab: (tab) => set({ currentTab: tab }),

      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      categoryFilter: 'All',
      setCategoryFilter: (category) => set({ categoryFilter: category }),

      isAdminMode: false,
      toggleAdminMode: () => set((state) => ({ isAdminMode: !state.isAdminMode })),
      setIsAdminMode: (admin) => set({ isAdminMode: admin }),

      hasCompletedOnboarding: false,
      completeOnboarding: (interests, name) =>
        set((state) => ({
          hasCompletedOnboarding: true,
          currentUser: {
            ...state.currentUser,
            name: name || state.currentUser.name,
            interests: interests.length > 0 ? interests : state.currentUser.interests,
          },
        })),
      resetOnboarding: () => set({ hasCompletedOnboarding: false }),

      currentUser: {
        id: 'user_audience_default',
        name: 'Tech Explorer',
        handle: '@techexplorer',
        avatar: USER_DEFAULT_AVATAR,
        role: 'subscriber',
        interests: ['AI & Prompts', 'SQA Engineering'],
        joinedDate: 'September 2026',
        bio: 'Aspiring full-stack engineer and automation builder.',
      },
      updateUserProfile: (updates) =>
        set((state) => ({ currentUser: { ...state.currentUser, ...updates } })),

      feedItems: INITIAL_FEED_ITEMS,
      activeVideo: INITIAL_FEED_ITEMS[0],
      setActiveVideo: (item) => set({ activeVideo: item }),
      toggleLikeFeedItem: (id) =>
        set((state) => ({
          feedItems: state.feedItems.map((item) =>
            item.id === id
              ? {
                  ...item,
                  isLiked: !item.isLiked,
                  likes: item.isLiked ? item.likes - 1 : item.likes + 1,
                }
              : item
          ),
          activeVideo:
            state.activeVideo?.id === id
              ? {
                  ...state.activeVideo,
                  isLiked: !state.activeVideo.isLiked,
                  likes: state.activeVideo.isLiked
                    ? state.activeVideo.likes - 1
                    : state.activeVideo.likes + 1,
                }
              : state.activeVideo,
        })),
      toggleBookmarkFeedItem: (id) =>
        set((state) => ({
          feedItems: state.feedItems.map((item) =>
            item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
          ),
          activeVideo:
            state.activeVideo?.id === id
              ? { ...state.activeVideo, isBookmarked: !state.activeVideo.isBookmarked }
              : state.activeVideo,
        })),
      addNewFeedItem: (newItem) =>
        set((state) => {
          const item: ContentFeedItem = {
            ...newItem,
            id: `pulse_video_${Date.now()}`,
            views: 120,
            likes: 18,
            publishedAt: 'Just now',
          };
          return { feedItems: [item, ...state.feedItems] };
        }),
      deleteFeedItem: (id) =>
        set((state) => {
          const updated = state.feedItems.filter((item) => item.id !== id);
          return {
            feedItems: updated,
            activeVideo: state.activeVideo?.id === id ? updated[0] || null : state.activeVideo,
          };
        }),

      resources: INITIAL_RESOURCES,
      bookmarkedResourceIds: ['res_prompt_01', 'res_sqa_01'],
      toggleBookmarkResource: (id) =>
        set((state) => {
          const exists = state.bookmarkedResourceIds.includes(id);
          return {
            bookmarkedResourceIds: exists
              ? state.bookmarkedResourceIds.filter((item) => item !== id)
              : [...state.bookmarkedResourceIds, id],
          };
        }),
      completedTasks: {
        task_01: true,
        task_02: true,
      },
      toggleTaskCompleted: (taskId) =>
        set((state) => ({
          completedTasks: {
            ...state.completedTasks,
            [taskId]: !state.completedTasks[taskId],
          },
        })),
      resetChecklist: (resourceId) =>
        set((state) => {
          const res = state.resources.find((r) => r.id === resourceId);
          if (!res?.sqaTasks) return state;
          const updated = { ...state.completedTasks };
          res.sqaTasks.forEach((t) => {
            delete updated[t.id];
          });
          return { completedTasks: updated };
        }),
      recordResourceCopy: (id) =>
        set((state) => ({
          resources: state.resources.map((r) =>
            r.id === id ? { ...r, copyCount: r.copyCount + 1 } : r
          ),
        })),

      discussions: INITIAL_DISCUSSIONS,
      addDiscussionPost: (title, content, tag) =>
        set((state) => {
          const newPost: DiscussionPost = {
            id: `disc_${Date.now()}`,
            title,
            content,
            tag,
            authorName: state.isAdminMode ? CREATOR_PROFILE.name : state.currentUser.name,
            authorHandle: state.isAdminMode ? CREATOR_PROFILE.handle : state.currentUser.handle,
            authorAvatar: state.isAdminMode ? CREATOR_PROFILE.avatar : state.currentUser.avatar,
            isCreator: state.isAdminMode,
            createdAt: 'Just now',
            likes: 1,
            isLiked: true,
            replies: [],
          };
          return { discussions: [newPost, ...state.discussions] };
        }),
      likeDiscussionPost: (id) =>
        set((state) => ({
          discussions: state.discussions.map((d) =>
            d.id === id
              ? {
                  ...d,
                  isLiked: !d.isLiked,
                  likes: d.isLiked ? d.likes - 1 : d.likes + 1,
                }
              : d
          ),
        })),
      addDiscussionReply: (postId, content) =>
        set((state) => ({
          discussions: state.discussions.map((d) =>
            d.id === postId
              ? {
                  ...d,
                  replies: [
                    ...d.replies,
                    {
                      id: `rep_${Date.now()}`,
                      authorName: state.isAdminMode ? CREATOR_PROFILE.name : state.currentUser.name,
                      authorHandle: state.isAdminMode ? CREATOR_PROFILE.handle : state.currentUser.handle,
                      authorAvatar: state.isAdminMode ? CREATOR_PROFILE.avatar : state.currentUser.avatar,
                      isCreator: state.isAdminMode,
                      content,
                      createdAt: 'Just now',
                    },
                  ],
                }
              : d
          ),
        })),

      qaQuestions: INITIAL_QA_QUESTIONS,
      submitQAQuestion: (question, category, requesterName) =>
        set((state) => {
          const newQ: CommunityQAQuestion = {
            id: `qa_${Date.now()}`,
            question,
            category,
            requesterName: requesterName || state.currentUser.name,
            requesterHandle: state.currentUser.handle,
            upvotes: 1,
            isUpvoted: true,
            status: 'pending',
            createdAt: 'Just now',
          };
          return { qaQuestions: [newQ, ...state.qaQuestions] };
        }),
      upvoteQAQuestion: (id) =>
        set((state) => ({
          qaQuestions: state.qaQuestions.map((q) =>
            q.id === id
              ? {
                  ...q,
                  isUpvoted: !q.isUpvoted,
                  upvotes: q.isUpvoted ? q.upvotes - 1 : q.upvotes + 1,
                }
              : q
          ),
        })),
      adminUpdateQAStatus: (id, status, episodeTitle) =>
        set((state) => ({
          qaQuestions: state.qaQuestions.map((q) =>
            q.id === id
              ? {
                  ...q,
                  status,
                  answeredEpisodeTitle: episodeTitle || q.answeredEpisodeTitle,
                }
              : q
          ),
        })),

      serviceTiers: INITIAL_SERVICE_TIERS,
      selectedTierForBooking: null,
      setSelectedTierForBooking: (tier) => set({ selectedTierForBooking: tier }),

      bookings: INITIAL_BOOKINGS,
      createBooking: (bookingData) => {
        const newBooking: ServiceBooking = {
          ...bookingData,
          id: `book_${Date.now()}`,
          status: 'pending_verification',
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({ bookings: [newBooking, ...state.bookings] }));
        return newBooking;
      },
      adminUpdateBookingStatus: (id, status, note) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id
              ? {
                  ...b,
                  status,
                  proofNote: note || b.proofNote,
                  verifiedAt: status === 'verified' ? new Date().toLocaleString() : b.verifiedAt,
                }
              : b
          ),
        })),

      scheduleItems: INITIAL_SCHEDULE_ITEMS,
      addScheduleItem: (itemData) =>
        set((state) => ({
          scheduleItems: [
            ...state.scheduleItems,
            { ...itemData, id: `sched_${Date.now()}` },
          ],
        })),
      updateScheduleStatus: (id, status) =>
        set((state) => ({
          scheduleItems: state.scheduleItems.map((s) =>
            s.id === id ? { ...s, status } : s
          ),
        })),
      deleteScheduleItem: (id) =>
        set((state) => ({
          scheduleItems: state.scheduleItems.filter((s) => s.id !== id),
        })),
    }),
    {
      name: 'ogojipulse_storage_v9',
      partialize: (state) => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        currentUser: state.currentUser,
        bookmarkedResourceIds: state.bookmarkedResourceIds,
        completedTasks: state.completedTasks,
        bookings: state.bookings,
        discussions: state.discussions,
        qaQuestions: state.qaQuestions,
        scheduleItems: state.scheduleItems,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.feedItems = INITIAL_FEED_ITEMS.filter((i) => i.id !== 'tiktok_photo_01');
          state.serviceTiers = INITIAL_SERVICE_TIERS;
          state.activeVideo = INITIAL_FEED_ITEMS[0];
          // Clear any legacy mock items
          if (state.discussions?.some((d) => d.id === 'disc_01')) {
            state.discussions = [];
          }
          if (state.qaQuestions?.some((q) => q.id === 'qa_01')) {
            state.qaQuestions = [];
          }
          if (state.bookings?.some((b) => b.id === 'book_101')) {
            state.bookings = [];
          }
          if (state.scheduleItems?.some((s) => s.id === 'sched_01')) {
            state.scheduleItems = [];
          }
        }
      },
    }
  )
);
