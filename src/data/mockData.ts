import {
  ContentFeedItem,
  ResourceItem,
  DiscussionPost,
  CommunityQAQuestion,
  ServiceTier,
  ServiceBooking,
  ContentScheduleItem,
  UserProfile,
} from '../types';

export const VICTOR_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='og' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2306b6d4'/%3E%3Cstop offset='100%25' stop-color='%233b82f6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' rx='28' fill='%230b1329'/%3E%3Crect x='4' y='4' width='112' height='112' rx='24' fill='none' stroke='url(%23og)' stroke-width='2' opacity='0.8'/%3E%3Ctext x='60' y='68' fill='%23ffffff' font-family='system-ui, sans-serif' font-size='38' font-weight='900' text-anchor='middle' letter-spacing='-1'%3EVO%3C/text%3E%3Ccircle cx='96' cy='24' r='7' fill='%2310b981'/%3E%3C/svg%3E";

export const POSTER_LINKEDIN_AFTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'%3E%3Cdefs%3E%3ClinearGradient id='g1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%230f172a'/%3E%3Cstop offset='100%25' stop-color='%23020617'/%3E%3C/linearGradient%3E%3ClinearGradient id='accent' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' stop-color='%23ec4899'/%3E%3Cstop offset='100%25' stop-color='%23a855f7'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='450' fill='url(%23g1)'/%3E%3Ccircle cx='700' cy='100' r='180' fill='%23ec4899' opacity='0.08' filter='blur(40px)'/%3E%3Crect x='40' y='40' width='160' height='32' rx='16' fill='%23ec4899' fill-opacity='0.2' stroke='%23ec4899' stroke-width='1.5'/%3E%3Ctext x='120' y='61' fill='%23f472b6' font-family='system-ui, sans-serif' font-size='13' font-weight='800' text-anchor='middle'%3ETIKTOK VLOG %2304%3C/text%3E%3Ctext x='40' y='160' fill='%23ffffff' font-family='system-ui, sans-serif' font-size='34' font-weight='900'%3ELinkedIn Profile Optimization%3C/text%3E%3Ctext x='40' y='210' fill='url(%23accent)' font-family='system-ui, sans-serif' font-size='32' font-weight='800'%3ETHE AFTER TRANSFORMATION%3C/text%3E%3Ctext x='40' y='270' fill='%2394a3b8' font-family='system-ui, sans-serif' font-size='18'%3EResults, Algorithmic Reach %26 Inbound Recruiter Pipelines%3C/text%3E%3Crect x='40' y='360' width='280' height='42' rx='12' fill='%231e293b' stroke='%23334155' stroke-width='1'/%3E%3Ctext x='55' y='387' fill='%2338bdf8' font-family='monospace' font-size='14' font-weight='bold'%3E@ogojithecreator._%3C/text%3E%3Ccircle cx='720' cy='380' r='36' fill='%2306b6d4' fill-opacity='0.2'/%3E%3Cpolygon points='713,365 733,380 713,395' fill='%2322d3ee'/%3E%3C/svg%3E";

export const POSTER_LINKEDIN_AUDIT =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'%3E%3Cdefs%3E%3ClinearGradient id='g2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%230f172a'/%3E%3Cstop offset='100%25' stop-color='%23020617'/%3E%3C/linearGradient%3E%3ClinearGradient id='accent2' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' stop-color='%2306b6d4'/%3E%3Cstop offset='100%25' stop-color='%233b82f6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='450' fill='url(%23g2)'/%3E%3Ccircle cx='100' cy='350' r='180' fill='%2306b6d4' opacity='0.08' filter='blur(40px)'/%3E%3Crect x='40' y='40' width='160' height='32' rx='16' fill='%2306b6d4' fill-opacity='0.2' stroke='%2306b6d4' stroke-width='1.5'/%3E%3Ctext x='120' y='61' fill='%2338bdf8' font-family='system-ui, sans-serif' font-size='13' font-weight='800' text-anchor='middle'%3ETECH WORKFLOWS%3C/text%3E%3Ctext x='40' y='160' fill='%23ffffff' font-family='system-ui, sans-serif' font-size='34' font-weight='900'%3ELinkedIn Profile Audit%3C/text%3E%3Ctext x='40' y='210' fill='url(%23accent2)' font-family='system-ui, sans-serif' font-size='32' font-weight='800'%3EBEFORE %26 AFTER BLUEPRINT%3C/text%3E%3Ctext x='40' y='270' fill='%2394a3b8' font-family='system-ui, sans-serif' font-size='18'%3EWhy Unoptimized Profiles Get Skipped by Recruiters%3C/text%3E%3Crect x='40' y='360' width='280' height='42' rx='12' fill='%231e293b' stroke='%23334155' stroke-width='1'/%3E%3Ctext x='55' y='387' fill='%2338bdf8' font-family='monospace' font-size='14' font-weight='bold'%3E@ogojithecreator._%3C/text%3E%3Ccircle cx='720' cy='380' r='36' fill='%2306b6d4' fill-opacity='0.2'/%3E%3Cpolygon points='713,365 733,380 713,395' fill='%2322d3ee'/%3E%3C/svg%3E";

export const POSTER_SQA_CAREER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'%3E%3Cdefs%3E%3ClinearGradient id='g3' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%230f172a'/%3E%3Cstop offset='100%25' stop-color='%23020617'/%3E%3C/linearGradient%3E%3ClinearGradient id='accent3' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' stop-color='%2310b981'/%3E%3Cstop offset='100%25' stop-color='%2306b6d4'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='450' fill='url(%23g3)'/%3E%3Ccircle cx='700' cy='350' r='180' fill='%2310b981' opacity='0.08' filter='blur(40px)'/%3E%3Crect x='40' y='40' width='180' height='32' rx='16' fill='%2310b981' fill-opacity='0.2' stroke='%2310b981' stroke-width='1.5'/%3E%3Ctext x='130' y='61' fill='%2334d399' font-family='system-ui, sans-serif' font-size='13' font-weight='800' text-anchor='middle'%3ESQA ENGINEERING%3C/text%3E%3Ctext x='40' y='160' fill='%23ffffff' font-family='system-ui, sans-serif' font-size='34' font-weight='900'%3ESQA Career Playbook%3C/text%3E%3Ctext x='40' y='210' fill='url(%23accent3)' font-family='system-ui, sans-serif' font-size='32' font-weight='800'%3EGROWTH, STRATEGY %26 LEVERAGE%3C/text%3E%3Ctext x='40' y='270' fill='%2394a3b8' font-family='system-ui, sans-serif' font-size='18'%3EUniting Software Testing with Digital Brand Building%3C/text%3E%3Crect x='40' y='360' width='280' height='42' rx='12' fill='%231e293b' stroke='%23334155' stroke-width='1'/%3E%3Ctext x='55' y='387' fill='%2334d399' font-family='monospace' font-size='14' font-weight='bold'%3E@ogojithecreator._%3C/text%3E%3Ccircle cx='720' cy='380' r='36' fill='%2310b981' fill-opacity='0.2'/%3E%3Cpolygon points='713,365 733,380 713,395' fill='%2334d399'/%3E%3C/svg%3E";

export const USER_DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='28' fill='%230f172a'/%3E%3Ccircle cx='60' cy='48' r='22' fill='%23334155'/%3E%3Cpath d='M28 100 C28 78 44 72 60 72 C76 72 92 78 92 100 Z' fill='%23334155'/%3E%3C/svg%3E";

export const CREATOR_PROFILE: UserProfile = {
  id: 'ogoji_creator_01',
  name: 'Victor Oladapo Olufemi',
  handle: '@ogojithecreator._',
  avatar: VICTOR_AVATAR,
  email: 'victor@ogojipulse.com',
  role: 'admin',
  interests: ['AI & Prompts', 'SQA Engineering', 'Tech Workflows', 'Professional Services'],
  joinedDate: 'Jan 2024',
  bio: 'Tech Creator & QA Engineer. Transforming complex AI systems, testing methodologies, and personal branding into high-growth digital leverage.',
  snapchat: 'ogojithecreator',
};

export const INITIAL_SERVICE_TIERS: ServiceTier[] = [
  {
    id: 'yearly_video_creation',
    name: 'Yearly Video Creation Pass',
    tagline: 'Continuous talking-head & short-form video creation, editing & scripting all year long',
    priceNgn: 3000,
    priceUsd: 4,
    billingFrequency: 'per year (Annual Pass • ₦3k Promo)',
    popular: true,
    turnaroundTime: 'Year-Round Rolling Drops (Weekly/Monthly Batches)',
    idealFor: 'Creators, tech builders, entrepreneurs, and developers seeking continuous, viral video creation on TikTok, YouTube & Snapchat.',
    deliverables: [
      'Full year talking-head video concepting, script outlines & viral hook generation',
      'Professional video editing with dynamic captions, sound design & B-roll',
      'AI prompt workflows & visual asset generation for high-impact reels',
      'Multi-platform optimization for TikTok (@ogojithecreator._ style), Reels & YouTube Shorts',
      'Priority topic queue for tech workflows, SQA bug stories & AI tutorials',
      'Direct WhatsApp access (07120037624 / 08114676752) for scripts & revisions',
      'Exclusive community spotlight in OgojiPulse creator feed & drops',
    ],
  },
  {
    id: 'linkedin_optimization',
    name: 'LinkedIn Profile Optimization',
    tagline: 'Transform your profile into an inbound opportunity magnet',
    priceNgn: 35000,
    priceUsd: 45,
    billingFrequency: 'One-time setup per profile',
    popular: false,
    turnaroundTime: '3 - 5 Business Days',
    idealFor: 'Software engineers, tech leads, career switchers, and founders looking for global tech roles.',
    deliverables: [
      'High-impact headline targeting ATS & recruiter search algorithms',
      'Story-driven "About" section rewrite with measurable achievements',
      'Impact-focused Experience section bullet points (STAR methodology)',
      'Custom banner graphic design recommendations & visual styling',
      'SEO keyword alignment across skills and featured sections',
      'Recommendations for featured media & portfolio assets',
    ],
  },
  {
    id: 'multi_social_bundle',
    name: 'Multi-Social Optimization Bundle',
    tagline: 'Complete digital branding overhaul across 4 key networks',
    priceNgn: 60000,
    priceUsd: 75,
    billingFrequency: 'One-time overhaul',
    popular: true,
    turnaroundTime: '5 - 7 Business Days',
    idealFor: 'Tech creators, startup founders, consultants, and developers building a personal brand.',
    deliverables: [
      'Cohesive bio refinement for Instagram, TikTok, X (Twitter), & Threads',
      'Unified handle strategy & cross-platform discoverability',
      'Niche positioning map & content pillar definitions',
      'Grid & aesthetic audit with typography and color suggestions',
      'Custom highlight cover structure & story frameworks',
      'High-converting link-in-bio page architecture & call-to-action strategy',
      'Bonus: 10 viral video hook formulas tailored to your niche',
    ],
  },
  {
    id: 'vip_management',
    name: 'Monthly Social Media Management & Growth (VIP)',
    tagline: 'End-to-end done-for-you content creation, scheduling, and community scaling',
    priceNgn: 120000,
    priceUsd: 150,
    billingFrequency: 'per month',
    popular: false,
    turnaroundTime: 'Ongoing Monthly Retainer',
    idealFor: 'Busy tech executives, high-ticket agencies, and tech brands needing consistent organic growth.',
    deliverables: [
      'Bespoke multi-platform content strategy & viral trend research',
      'Full monthly content calendar planning (12-16 posts/reels)',
      'High-converting caption copywriting, hooks, and script drafting',
      'Multi-platform scheduling & asset management (up to 3 platforms)',
      'Daily proactive engagement & comment management in target tech circles',
      'Bi-weekly performance analytics report & strategic growth consultation',
      'Priority direct WhatsApp/Slack channel with Victor',
    ],
  },
];

export const INITIAL_FEED_ITEMS: ContentFeedItem[] = [
  {
    id: 'tiktok_video_04',
    title: "LinkedIn Profile Optimization: The AFTER Transformation & Results | Victor Oladapo",
    category: 'Vlogs',
    description: "TikTok video release by Victor Oladapo Olufemi (@ogojithecreator._) showcasing the concrete results of the LinkedIn profile optimization overhaul. See the transformation in profile views, ATS algorithm ranking, recruiter direct messages, and high-converting personal brand positioning.",
    videoUrl: 'https://www.tiktok.com/@ogojithecreator._/video/7684476290304363784?is_from_webapp=1&sender_device=pc',
    thumbnail: POSTER_LINKEDIN_AFTER,
    duration: 'TikTok After Overhaul',
    publishedAt: 'Latest TikTok Overhaul',
    views: 31200,
    likes: 4180,
    isLiked: true,
    isBookmarked: true,
    tags: ['TikTok', 'LinkedIn Optimization', 'After Optimization', 'Results & Proof', 'Career Breakthrough', '@ogojithecreator._'],
    keyTakeaways: [
      'The Transformed Profile: Reaching the top 1% of candidate searches in target tech categories',
      'Inbound recruiter DMs: Transforming cold applications into weekly invitation pipelines',
      'Authority positioning: Converting profile visitors into high-ticket consulting and full-time offers',
    ],
    featured: true,
  },
  {
    id: 'tiktok_video_03',
    title: "LinkedIn Profile Optimization & Inbound Recruiter Audit | Victor's Breakdown",
    category: 'Tech Workflows',
    description: "TikTok video release by Victor Oladapo Olufemi (@ogojithecreator._) revealing the exact 'Before & After' LinkedIn profile optimization blueprint. Learn why unoptimized tech profiles get passed over by ATS algorithms, and how strategic headline rewrites and quantifiable impact bullet points transform profiles into inbound opportunity engines.",
    videoUrl: 'https://www.tiktok.com/@ogojithecreator._/video/7676635401334951186?is_from_webapp=1&sender_device=pc',
    thumbnail: POSTER_LINKEDIN_AUDIT,
    duration: 'TikTok Breakdown',
    publishedAt: 'New TikTok Release',
    views: 26400,
    likes: 3410,
    isLiked: true,
    isBookmarked: true,
    tags: ['TikTok', 'LinkedIn Optimization', 'Before & After', 'Career Growth', 'ATS Resume', '@ogojithecreator._', 'Tech Workflows'],
    keyTakeaways: [
      'The "Before" Profile Trap: Why 90% of tech profiles fail ATS filtering and get zero recruiter visibility',
      'High-impact headline restructuring: Combining domain specialty, tech stack, and business leverage',
      'Converting passive duties into STAR-method achievement bullets that attract 6-figure inbound inquiries',
    ],
    featured: true,
  },
  {
    id: 'tiktok_video_02',
    title: "SQA Career & Tech Creator Playbook: Growth, Strategy & Leverage | Victor Oladapo",
    category: 'SQA Engineering',
    description: "TikTok video release by Victor Oladapo Olufemi (@ogojithecreator._) breaking down how to combine Software Quality Assurance engineering, digital visibility, and strategic content creation to unlock global consulting and career leverage.",
    videoUrl: 'https://www.tiktok.com/@ogojithecreator._/video/7671754947985231122?is_from_webapp=1&sender_device=pc',
    thumbnail: POSTER_SQA_CAREER,
    duration: 'TikTok Reel',
    publishedAt: 'Featured TikTok',
    views: 18920,
    likes: 2430,
    isLiked: true,
    isBookmarked: true,
    tags: ['TikTok', 'SQA Career', 'Tech Creator', 'Personal Branding', 'Software QA', '@ogojithecreator._', 'SQA Engineering'],
    keyTakeaways: [
      'Multi-disciplinary skill stacking: uniting SQA engineering with digital brand leverage and strategy',
      'Using short-form tech video breakdowns to attract high-ticket clients, job offers, and speaking gigs',
      'The 3-pillar blueprint for tech builders to establish domain authority online',
    ],
    featured: true,
  },
];

export const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: 'res_prompt_01',
    type: 'prompt',
    title: 'Autonomous Full-Stack System Architect Prompt',
    description: 'A production-grade system prompt for ChatGPT/Claude/Gemini to generate enterprise-ready TypeScript, API routes, and database schemas with zero hallucinated imports.',
    category: 'AI & Prompts',
    tags: ['System Prompt', 'TypeScript', 'Full-Stack', 'Next.js / Vite'],
    readsCount: 2340,
    copyCount: 1180,
    author: '@ogojithecreator._',
    updatedAt: 'Updated Yesterday',
    promptTargetModel: 'Claude 3.7 / Gemini 2.5 Pro',
    promptTemplate: `You are an elite Staff Software Engineer and System Architect specializing in [TECH_STACK].
Your goal is to build a [APP_TYPE] designed for [TARGET_USER_AUDIENCE].

Follow these non-negotiable engineering mandates:
1. TYPE SAFETY: Strictly use TypeScript with strict null checks. No 'any'.
2. COMPONENT MODULARITY: Keep files under 150 lines. Extract sub-components into dedicated files.
3. PERSISTENCE: Structure database schemas with normalized relationships and clear primary keys for [DATABASE_TYPE].
4. ERROR BOUNDARIES: All async data fetching must have explicit loading, empty, and failed error states.
5. SECURITY: Validate inputs both client-side and server-side.

Generate the architecture blueprint, file tree, and core implementation for: [FEATURE_NAME].`,
    promptVariables: [
      { name: 'TECH_STACK', label: 'Tech Stack', placeholder: 'e.g. React 19 + Express + Tailwind CSS', defaultValue: 'React 19 + Express + Tailwind CSS' },
      { name: 'APP_TYPE', label: 'Application Type', placeholder: 'e.g. Creator Command Center', defaultValue: 'Creator Command Center' },
      { name: 'TARGET_USER_AUDIENCE', label: 'Target Audience', placeholder: 'e.g. Tech enthusiasts and QA engineers', defaultValue: 'Tech enthusiasts and QA engineers' },
      { name: 'DATABASE_TYPE', label: 'Database Type', placeholder: 'e.g. PostgreSQL / Supabase', defaultValue: 'PostgreSQL / Supabase' },
      { name: 'FEATURE_NAME', label: 'Core Feature', placeholder: 'e.g. Real-Time Service Booking Flow', defaultValue: 'Real-Time Service Booking Flow' },
    ],
  },
  {
    id: 'res_prompt_02',
    type: 'prompt',
    title: 'LinkedIn Viral Post & Career Hook Architect',
    description: 'Transform raw tech notes, bug fixes, or project launches into high-converting LinkedIn carousels and posts that attract hiring managers and clients.',
    category: 'AI & Prompts',
    tags: ['LinkedIn', 'Copywriting', 'Personal Branding', 'Client Inbound'],
    readsCount: 1890,
    copyCount: 940,
    author: '@ogojithecreator._',
    updatedAt: '3 days ago',
    promptTargetModel: 'ChatGPT / Claude / Gemini',
    promptTemplate: `Act as a top 0.1% Tech Creator & Personal Branding Strategist on LinkedIn.
Help me draft a compelling personal post based on my recent milestone: [MILESTONE_OR_TOPIC].

Target Audience: [TARGET_AUDIENCE] (e.g. CTOs, engineering managers, fellow developers).
Tone: Authoritative yet humble, actionable, highly readable with generous white space.

Format Requirements:
- Hook (Lines 1-2): Must stop the scroll within 1.5 seconds. No generic clichés like "I'm thrilled to announce".
- The Conflict: The hard engineering problem or career friction encountered.
- The Pivot: The specific mindset shift or technical breakthrough.
- 3 Actionable Bullet Points: Clean takeaways that readers can implement immediately.
- Open Call-to-Action: A genuine question inviting high-value comments in my niche.`,
    promptVariables: [
      { name: 'MILESTONE_OR_TOPIC', label: 'Milestone / Topic', placeholder: 'e.g. How I caught a critical race condition bug before release', defaultValue: 'How I caught a critical race condition bug before release' },
      { name: 'TARGET_AUDIENCE', label: 'Target Audience', placeholder: 'e.g. Engineering managers and tech recruiters', defaultValue: 'Engineering managers and tech recruiters' },
    ],
  },
  {
    id: 'res_sqa_01',
    type: 'sqa_log',
    title: 'Pre-Flight Production Release Checklist (Web & Mobile)',
    description: 'The exact 15-point software quality assurance test matrix executed before pushing code to live production environments.',
    category: 'SQA Engineering',
    tags: ['Checklist', 'Regression Testing', 'Release QA', 'Sanity Test'],
    readsCount: 3120,
    copyCount: 1450,
    author: 'Victor Oladapo Olufemi',
    updatedAt: '1 week ago',
    sqaTasks: [
      {
        id: 'task_01',
        task: 'Authentication & Session Expiration Verification',
        category: 'Security',
        priority: 'Critical',
        notes: 'Verify token refresh, expired session redirection, and protected route access without token.',
      },
      {
        id: 'task_02',
        task: 'Form Validation & Edge-Case Boundary Testing',
        category: 'Functional',
        priority: 'Critical',
        notes: 'Test extreme character counts, special characters, empty fields, and rapid double-submit clicks.',
      },
      {
        id: 'task_03',
        task: 'Payment & Webhook Idempotency Verification',
        category: 'API & Backend',
        priority: 'Critical',
        notes: 'Simulate duplicate webhook deliveries and confirm booking status updates only once.',
      },
      {
        id: 'task_04',
        task: 'Mobile Viewport Touch-Target Audit (375px & 414px)',
        category: 'UI/UX',
        priority: 'High',
        notes: 'Ensure all primary buttons have >=44px touch targets and no horizontal overflow scrollbars.',
      },
      {
        id: 'task_05',
        task: 'Lighthouse Performance & Core Web Vitals Audit',
        category: 'Performance',
        priority: 'High',
        notes: 'LCP under 2.5s, CLS under 0.1, and FID/INP under 100ms on simulated mobile throttling.',
      },
      {
        id: 'task_06',
        task: 'API Error Boundary & Offline State Fallback',
        category: 'Functional',
        priority: 'High',
        notes: 'Confirm graceful toast messages or retry cards when network is disconnected or server responds with 500.',
      },
    ],
    sqaBestPractices: [
      'Document every bug reproduction step with precise payload data',
      'Never mark a ticket resolved without verifying in the staging environment',
      'Automate the 20% of repetitive regression tests that catch 80% of breaks',
    ],
  },
  {
    id: 'res_tool_01',
    type: 'tool',
    title: 'Cursor AI & v0 Rapid Prototyping Pipeline',
    description: 'Victor’s recommended suite of developer-first AI tools to supercharge feature scaffolding, styling, and automated test generation.',
    category: 'Tech Workflows',
    tags: ['Developer Tools', 'AI Scaffolding', 'VS Code', 'Productivity'],
    readsCount: 1420,
    copyCount: 680,
    author: '@ogojithecreator._',
    updatedAt: '2 weeks ago',
    toolUrl: 'https://cursor.com',
    toolPricing: 'Free / $20/mo Pro',
    toolRating: 4.9,
  },
];

export const INITIAL_DISCUSSIONS: DiscussionPost[] = [];

export const INITIAL_QA_QUESTIONS: CommunityQAQuestion[] = [];

export const INITIAL_BOOKINGS: ServiceBooking[] = [];

export const INITIAL_SCHEDULE_ITEMS: ContentScheduleItem[] = [];

