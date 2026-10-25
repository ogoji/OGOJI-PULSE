export type UserRole = 'subscriber' | 'client' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  email?: string;
  role: UserRole;
  interests: string[];
  joinedDate: string;
  bio?: string;
  snapchat?: string;
}

export type ContentCategory = 'AI & Prompts' | 'SQA Engineering' | 'Tech Workflows' | 'Vlogs';

export interface VideoChapter {
  timeSeconds: number;
  label: string;
}

export interface ContentFeedItem {
  id: string;
  title: string;
  category: ContentCategory;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  publishedAt: string;
  views: number;
  likes: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  tags: string[];
  keyTakeaways: string[];
  transcript?: string;
  chapters?: VideoChapter[];
  featured?: boolean;
  linkedResourceId?: string;
}

export type ResourceType = 'prompt' | 'sqa_log' | 'framework' | 'tool';

export interface PromptVariable {
  name: string;
  label: string;
  placeholder: string;
  defaultValue: string;
}

export interface SQATaskItem {
  id: string;
  task: string;
  category: 'Functional' | 'UI/UX' | 'API & Backend' | 'Security' | 'Performance';
  priority: 'Critical' | 'High' | 'Medium';
  notes: string;
}

export interface ResourceItem {
  id: string;
  type: ResourceType;
  title: string;
  description: string;
  category: string;
  tags: string[];
  readsCount: number;
  copyCount: number;
  author: string;
  updatedAt: string;
  // Prompt specific
  promptTemplate?: string;
  promptVariables?: PromptVariable[];
  promptTargetModel?: string; // ChatGPT, Claude 3.7, Gemini 2.5, Cursor
  // SQA specific
  sqaTasks?: SQATaskItem[];
  sqaBestPractices?: string[];
  // Tool / Framework specific
  toolUrl?: string;
  toolPricing?: string;
  toolRating?: number;
  frameworkCodeSnippet?: string;
}

export interface DiscussionReply {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  isCreator: boolean;
  content: string;
  createdAt: string;
}

export interface DiscussionPost {
  id: string;
  title: string;
  content: string;
  tag: 'AI & Tools' | 'SQA Testing' | 'Creator Workflow' | 'Career';
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  isCreator: boolean;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replies: DiscussionReply[];
}

export interface CommunityQAQuestion {
  id: string;
  requesterName: string;
  requesterHandle: string;
  question: string;
  category: string;
  upvotes: number;
  isUpvoted?: boolean;
  status: 'pending' | 'queued_for_vlog' | 'answered_in_episode';
  answeredEpisodeTitle?: string;
  createdAt: string;
}

export type ServiceTierId =
  | 'yearly_video_creation'
  | 'linkedin_optimization'
  | 'multi_social_bundle'
  | 'vip_management';

export interface ServiceTier {
  id: ServiceTierId;
  name: string;
  tagline: string;
  priceNgn: number;
  priceUsd: number;
  billingFrequency: string;
  popular?: boolean;
  deliverables: string[];
  turnaroundTime: string;
  idealFor: string;
}

export type PaymentMethod = 'PalmPay' | 'USDT_BEP20';

export interface ServiceBooking {
  id: string;
  tierId: ServiceTierId;
  tierName: string;
  clientName: string;
  clientEmail: string;
  clientLinkedIn: string;
  clientPhone?: string;
  paymentMethod: PaymentMethod;
  amountFormatted: string;
  referenceCode: string;
  status: 'pending_verification' | 'verified' | 'completed';
  proofNote?: string;
  intakeAnswers?: {
    careerGoals: string;
    targetAudience: string;
    profileLinks: string;
    specialNotes?: string;
  };
  createdAt: string;
  verifiedAt?: string;
}

export type ScheduleStatus = 'draft' | 'scripting' | 'in_review' | 'scheduled' | 'published';

export interface ContentScheduleItem {
  id: string;
  title: string;
  format: 'Talking-Head' | 'Screen Tutorial' | 'Quick Reel' | 'Carousel Post';
  targetPlatform: 'YouTube' | 'TikTok' | 'Instagram' | 'LinkedIn' | 'X/Twitter';
  scheduledDate: string;
  status: ScheduleStatus;
  hook: string;
  scriptOutline: string;
  callToAction: string;
  tags: string[];
}

export interface NewsletterSubscriber {
  id?: string;
  email: string;
  name?: string;
  source: string;
  interests?: string[];
  status: 'subscribed' | 'unsubscribed';
  createdAt?: any;
}
