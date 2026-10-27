import type { IconName } from '@ds';

/* Fictional demo data. Numbers line up across pages: halo, campaign results and the agent run all describe Fernway Outdoor. */

export type Role = 'brand' | 'smm' | 'creator';
export type ToolId = 'campaigns' | 'insights' | 'plan' | 'engage' | 'analyze' | 'listen' | 'create' | 'linkinbio' | 'earn' | 'services';
export type Group = 'publish' | 'grow' | 'creators';

export const TOOLS: Record<ToolId, { label: string; icon: IconName; group: Group; desc: string }> = {
  plan: { label: 'Plan + publish', icon: 'calendar', group: 'publish', desc: 'Plan, approve and publish in one calendar. Creator collabs land here for approval, then publish from the creator’s own account.' },
  create: { label: 'Create', icon: 'image', group: 'publish', desc: 'Uploads, Canva exports, creator content and UGC in one library, with AI ideas and captions.' },
  linkinbio: { label: 'Link in bio', icon: 'link', group: 'publish', desc: 'A shoppable page that updates when posts publish and when creators add affiliate links.' },
  engage: { label: 'Engage', icon: 'inbox', group: 'grow', desc: 'Instagram, Facebook and TikTok conversations in one inbox, with context from Campaigns and Listen beside each one.' },
  analyze: { label: 'Analyze', icon: 'chart', group: 'grow', desc: 'Organic, paid and creator content measured side by side, with sales attributed through Link in bio and creator links.' },
  listen: { label: 'Listen', icon: 'radar', group: 'grow', desc: 'Trends, competitors, brand health and mentions.' },
  insights: { label: 'Insights', icon: 'trend', group: 'grow', desc: 'Answers that need your social, creator and sales data together.' },
  campaigns: { label: 'Campaigns', icon: 'people', group: 'creators', desc: 'Every creator program in one place, whether your team runs it or Later’s does.' },
  earn: { label: 'Earn', icon: 'wallet', group: 'creators', desc: 'Affiliate links, real-time sales and payouts for creators.' },
  services: { label: 'Services', icon: 'briefcase', group: 'creators', desc: 'Hand a campaign to Later’s team. Everything they run shows up in Campaigns and Analyze.' },
};

export const ROLES: Record<Role, { name: string; title: string; workspace: string; email: string; label: string; order: ToolId[]; more: ToolId[]; greeting: string }> = {
  brand: {
    name: 'Maya Chen', title: 'Influencer marketing lead', workspace: 'Fernway Outdoor', email: 'maya@fernway.example', label: 'Brand marketer',
    order: ['campaigns', 'insights', 'analyze', 'listen', 'plan', 'engage', 'services'], more: ['create', 'linkinbio', 'earn'],
    greeting: 'Fernway Outdoor · Fall Trail ’26 is live with 9 creators and 3 more in contracting.',
  },
  smm: {
    name: 'Priya Shah', title: 'Social media manager', workspace: 'Fernway Outdoor', email: 'priya@fernway.example', label: 'Social manager',
    order: ['plan', 'engage', 'analyze', 'create', 'linkinbio', 'listen', 'campaigns'], more: ['insights', 'earn', 'services'],
    greeting: 'Fernway Outdoor · 8 profiles across Instagram, TikTok, Facebook, YouTube, Pinterest, LinkedIn and Threads.',
  },
  creator: {
    name: 'Jules Ortiz', title: 'Creator', workspace: 'Jules Ortiz', email: 'jules@julesoutside.example', label: 'Creator',
    order: ['earn', 'campaigns', 'linkinbio', 'plan', 'analyze', 'create', 'engage'], more: ['listen', 'services', 'insights'],
    greeting: 'Your posts, links and brand deals in one place. October is your best month so far.',
  },
};

export const toolLabel = (id: ToolId, role: Role) => (id === 'campaigns' && role === 'creator' ? 'Opportunities' : TOOLS[id].label);

export type Route =
  | { page: 'home' }
  | { page: 'workspace' }
  | { page: 'tool'; tool: ToolId }
  | { page: 'campaign'; id: string; tab?: CampTab }
  | { page: 'agent' }
  | { page: 'insights'; tab: 'halo' | 'audience' };

export type CampTab = 'overview' | 'creators' | 'results';

export interface QueueItem { group: Group; icon: IconName; tone?: 'warning' | 'danger'; title: string; meta: string; to: Route; profile?: string; post?: string }

export const QUEUE: Record<Role, QueueItem[]> = {
  brand: [
    { group: 'creators', icon: 'calendar', title: 'Jules Ortiz sent a draft for your review', meta: 'Fall Trail ’26 · approves in Plan, publishes from Jules’s account', to: { page: 'tool', tool: 'plan' }, post: 'p3' },
    { group: 'creators', icon: 'alert', tone: 'warning', title: '1 recommended creator needs a brand-safety review', meta: '@grayholloway · flagged by EdgeAI', to: { page: 'campaign', id: 'ft', tab: 'creators' }, profile: 'd3' },
    { group: 'grow', icon: 'trend', title: 'Creators drove an estimated $38–52K beyond their links', meta: 'Fall Trail ’26 · sales through your own Link in bio after creator posts', to: { page: 'insights', tab: 'halo' } },
    { group: 'grow', icon: 'people', title: '6 fans already sell your products and could be creators', meta: 'Found across UGC, your inbox and Later Creator links', to: { page: 'insights', tab: 'audience' } },
    { group: 'creators', icon: 'spark', title: 'Winter Layers drop is still a draft', meta: 'EdgeAI can plan it for you and check with you before spending', to: { page: 'campaign', id: 'wl' } },
  ],
  smm: [
    { group: 'publish', icon: 'calendar', title: '2 posts are waiting for approval', meta: '1 from your team and 1 creator collab from Jules Ortiz', to: { page: 'tool', tool: 'plan' } },
    { group: 'publish', icon: 'alert', tone: 'danger', title: 'A TikTok post failed to publish', meta: 'Tent pitch speedrun · Thu 7:00 PM · reconnect TikTok to retry', to: { page: 'tool', tool: 'plan' }, post: 'p7' },
    { group: 'grow', icon: 'inbox', title: '3 unread conversations', meta: '1 TikTok comment flagged as negative sentiment', to: { page: 'tool', tool: 'engage' } },
    { group: 'grow', icon: 'radar', title: '#shoulderseason is up 212% this week', meta: 'Trend from Listen · included in the Scale plan', to: { page: 'tool', tool: 'listen' } },
  ],
  creator: [
    { group: 'creators', icon: 'calendar', title: 'Your Fernway draft is with Maya for review', meta: 'Summit morning · Tue 12:00 PM · you’ll see any notes on the post', to: { page: 'tool', tool: 'plan' }, post: 'p3' },
    { group: 'creators', icon: 'people', title: 'New invite: Northline Coffee', meta: '$1,200 + 15% commission · 92% match · reply by Oct 30', to: { page: 'tool', tool: 'campaigns' } },
    { group: 'grow', icon: 'alert', tone: 'warning', title: '2 links point to expired promos', meta: 'Altus Optics and Pinecrest Supply · swap to live offers', to: { page: 'tool', tool: 'earn' } },
    { group: 'grow', icon: 'inbox', title: '2 followers asked where your jacket is from', meta: 'Reply with your Alder jacket link in one tap', to: { page: 'tool', tool: 'engage' } },
  ],
};

export const TILES: Record<Role, Partial<Record<ToolId, [string, string]>>> = {
  brand: { campaigns: ['6.3×', 'ROAS, Fall Trail ’26'], insights: ['$38–52K', 'creator halo sales'], analyze: ['$186K', 'creator-attributed sales'], listen: ['78', 'brand health'], plan: ['2', 'awaiting approval'], engage: ['3', 'unread'], services: ['1', 'program in planning'] },
  smm: { plan: ['8', 'scheduled this week'], engage: ['3', 'unread'], analyze: ['412K', 'reach, 30 days'], create: ['248', 'assets'], linkinbio: ['26.6%', 'click-through'], listen: ['+212%', 'top trend'], campaigns: ['9', 'creators live or in content'] },
  creator: { earn: ['$4,812', 'October earnings'], campaigns: ['1', 'new invite'], linkinbio: ['9.1K', 'clicks this month'], plan: ['3', 'scheduled'], analyze: ['184K', 'followers'], create: ['96', 'assets'], engage: ['3', 'unread'] },
};

export interface Campaign { id: string; name: string; status: 'live' | 'planning' | 'draft' | 'complete'; goal: string; dates: string; mode: string; budget: number; spent: number; sales: number; roas: string }
export const CAMPAIGNS: Campaign[] = [
  { id: 'ft', name: 'Fall Trail ’26', status: 'live', goal: 'Drive sales', dates: 'Oct 8 – Nov 7', mode: 'Self-run', budget: 48000, spent: 29400, sales: 186200, roas: '6.3×' },
  { id: 'hg', name: 'Holiday Gifting ’26', status: 'planning', goal: 'Gifting sales', dates: 'Nov 20 – Dec 15', mode: 'Full-service · Later team', budget: 60000, spent: 0, sales: 0, roas: '—' },
  { id: 'wl', name: 'Winter Layers drop', status: 'draft', goal: 'Launch a product', dates: 'Jan 12 – Feb 8', mode: 'Self-run', budget: 30000, spent: 0, sales: 0, roas: '—' },
  { id: 'st', name: 'Spring Trail ’26', status: 'complete', goal: 'Awareness', dates: 'Apr 1 – May 15', mode: 'Full-service · Later team', budget: 72000, spent: 70850, sales: 241000, roas: '3.4×' },
];
export const CAMP_STATUS = { live: ['Live', 'success'], planning: ['Planning', 'warning'], draft: ['Draft', 'neutral'], complete: ['Complete', 'neutral'] } as const;

export interface Creator { id: string; name: string; handle: string; followers: string; tier?: 'Micro' | 'Mid' | 'Macro'; fit: number; reason: string; rate?: string; risk?: 'review'; stage?: number; note?: string; overlap?: string; source?: 'audience' }

export const STAGES = ['Discover', 'Invited', 'Contracted', 'Content', 'Live'];
export const PIPELINE: Creator[] = [
  { id: 'jo', name: 'Jules Ortiz', handle: '@julesoutside', followers: '184K', tier: 'Mid', fit: 94, stage: 3, note: 'Draft revision due Wed', reason: 'Strong saves on summit content; rebooked from Spring Trail ’26', rate: '$1,500–2,100' },
  { id: 'ar', name: 'Ari Bennett', handle: '@aribennett', followers: '61K', tier: 'Micro', fit: 91, stage: 4, note: 'Live · 3 posts', reason: 'High purchase intent on outerwear', rate: '$1,000–1,400' },
  { id: 'lt', name: 'Lena Tor', handle: '@lenatrails', followers: '322K', tier: 'Macro', fit: 88, stage: 4, note: 'Live · 2 posts', reason: 'Biggest halo in Fall Trail ’26', rate: '$3,400–4,300' },
  { id: 'mo', name: 'Mo Farah-Lind', handle: '@mofl', followers: '19K', tier: 'Micro', fit: 93, stage: 4, note: 'Live · 1 post', reason: 'Highest purchase rate in the campaign', rate: '$400–600' },
  { id: 'ss', name: 'Sun Shin', handle: '@sunshinehikes', followers: '73K', tier: 'Micro', fit: 87, stage: 3, note: 'Content in review', reason: 'Steady sales through her link', rate: '$1,100–1,500' },
  { id: 'dm', name: 'Dev Mehta', handle: '@devclimbs', followers: '45K', tier: 'Micro', fit: 90, stage: 2, note: 'Contract signed Oct 22', reason: 'Climbing audience that buys layers', rate: '$750–1,050' },
  { id: 'ny', name: 'Noa Yi', handle: '@noaoutside', followers: '97K', tier: 'Mid', fit: 86, stage: 2, note: 'Shipping product', reason: 'Family camping audience', rate: '$1,200–1,700' },
  { id: 'rc', name: 'Rosa Cruz', handle: '@rosacamps', followers: '28K', tier: 'Micro', fit: 89, stage: 1, note: 'Invited Oct 23', reason: 'Low overlap with your roster', rate: '$500–750' },
  { id: 'bk', name: 'Ben Kalu', handle: '@benkalu', followers: '510K', tier: 'Macro', fit: 79, stage: 1, note: 'Asked $6,500, above the fair range', reason: 'Largest reach in the outdoor category', rate: '$4,200–5,300' },
];
export const RECOMMENDED: Creator[] = [
  { id: 'd1', name: 'Tess Alder', handle: '@tessalder', followers: '88K', tier: 'Micro', fit: 95, rate: '$1,400–1,900', overlap: '8%', reason: 'Audience 71% hikers 25–34; 3 past outdoor collabs averaged 5.1% saves' },
  { id: 'd2', name: 'Kofi Mensah', handle: '@kofiwalks', followers: '142K', tier: 'Mid', fit: 92, rate: '$2,100–2,800', overlap: '14%', reason: 'High purchase intent: 1.9K linked-post clicks per post' },
  { id: 'd3', name: 'Gray Holloway', handle: '@grayholloway', followers: '230K', tier: 'Mid', fit: 84, rate: '$3,200–4,000', overlap: '22%', risk: 'review', reason: 'Strong reach, but a 2025 post about a competitor recall needs review' },
  { id: 'd4', name: 'Iris Park', handle: '@irisparkoutdoors', followers: '36K', tier: 'Micro', fit: 90, rate: '$600–850', overlap: '5%', reason: 'Low overlap with current roster; strong Pinterest saves' },
];
export const AUDIENCE: (Creator & { ugc: number; inbox: boolean; sold: number })[] = [
  { id: 'a1', name: 'Kai Morales', handle: '@wanderwithkai', followers: '12.4K', fit: 93, ugc: 4, inbox: true, sold: 1840, rate: '$300–450', source: 'audience', reason: 'Posted about Fernway 4 times this year, already sells the Ridge 28 and asked a sizing question in your inbox' },
  { id: 'a3', name: 'Lu Andersen', handle: '@lake.days.lu', followers: '22K', fit: 91, ugc: 3, inbox: false, sold: 2960, rate: '$450–700', source: 'audience', reason: 'Earned commission on $2,960 of Fernway gear in 90 days without being asked' },
  { id: 'a4', name: 'Nina Okafor', handle: '@northbound.nina', followers: '41K', fit: 89, ugc: 0, inbox: true, sold: 4120, rate: '$800–1,200', source: 'audience', reason: 'Your top unpaid seller: $4,120 in Fernway sales through her links, plus 2 product questions in your DMs' },
  { id: 'a2', name: 'Sierra Patel', handle: '@sierrahikes', followers: '8.9K', fit: 88, ugc: 3, inbox: true, sold: 0, rate: '$200–350', source: 'audience', reason: 'Tagged Fernway in 3 stories, including “best $90 I spent this year”; not on Later Creator yet' },
  { id: 'a5', name: 'Mo Reyes', handle: '@mo.miles', followers: '5.4K', fit: 84, ugc: 2, inbox: true, sold: 610, rate: '$150–250', source: 'audience', reason: 'Small but loyal audience; 11% of his link clicks become orders' },
  { id: 'a6', name: 'Kaia Brooks', handle: '@kai.wanders', followers: '3.1K', fit: 79, ugc: 0, inbox: true, sold: 390, rate: '$100–200', source: 'audience', reason: 'Asked about the Ridge 28 in DMs, then sold 3 of them through her own Later link' },
];
export const allCreators = () => [...PIPELINE, ...RECOMMENDED, ...AUDIENCE];

/** reach (K), engagement %, clicks, orders, sales, cost */
export const RESULTS: Record<string, [number, number, number, number, number, number]> = {
  lt: [640, 4.4, 6120, 302, 39260, 3800], ar: [182, 6.1, 3940, 214, 27820, 3982], mo: [61, 9.2, 2880, 268, 34840, 5726], ss: [121, 5.0, 1410, 74, 9620, 2262], jo: [41, 7.4, 1212, 19, 2410, 2089],
};

export const HALO = [
  { id: 'lt', posts: 2, tracked: 39260, lo: 15000, hi: 20000, followers: 2310, mentions: '+38%', conf: 'High' },
  { id: 'ar', posts: 3, tracked: 27820, lo: 11000, hi: 14000, followers: 1640, mentions: '+21%', conf: 'High' },
  { id: 'mo', posts: 1, tracked: 34840, lo: 7000, hi: 10000, followers: 880, mentions: '+12%', conf: 'Medium' },
  { id: 'jo', posts: 1, tracked: 2410, lo: 5000, hi: 8000, followers: 1120, mentions: '+17%', conf: 'Medium' },
] as const;

export const OPPORTUNITIES = [
  { id: 'o0', brand: 'Fernway Outdoor', name: 'Fall Trail ’26', pay: '$1,800 + 12% commission', match: 97, status: 'active', due: 'Content due Wed' },
  { id: 'o1', brand: 'Northline Coffee', name: 'Camp brew season', pay: '$1,200 + 15% commission', match: 92, status: 'invite', due: 'Reply by Oct 30' },
  { id: 'o2', brand: 'Altus Optics', name: 'Golden hour', pay: '$850 flat', match: 81, status: 'open', due: 'Apply by Nov 4' },
  { id: 'o3', brand: 'Kestrel Bikes', name: 'Gravel winter', pay: '$2,000 + gear', match: 64, status: 'open', due: 'Apply by Nov 9' },
];

export const money = (n: number) => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 2 });
export const findCreator = (id: string) => allCreators().find(c => c.id === id);

/* ---------- Plan ---------- */
export const DAYS = ['Mon 26', 'Tue 27', 'Wed 28', 'Thu 29', 'Fri 30', 'Sat 31', 'Sun 1'];
export const BEST = ['6:30 PM', '12:15 PM', '6:00 PM', '7:00 PM', '11:30 AM', '9:00 AM', '4:00 PM'];
export const PLATFORMS = ['IG', 'TT', 'FB', 'TH', 'YT', 'PIN', 'LI', 'SC'];
export type PostStatus = 'published' | 'scheduled' | 'approval' | 'draft' | 'failed' | 'changes';
export const POST_STATUS: Record<PostStatus, [string, 'success' | 'neutral' | 'action' | 'danger' | 'warning']> = {
  published: ['Published', 'success'], scheduled: ['Scheduled', 'neutral'], approval: ['Needs approval', 'action'],
  draft: ['Draft', 'neutral'], failed: ['Failed', 'danger'], changes: ['Changes requested', 'warning'],
};
export interface Comment { who: string; text: string; when: string }
export interface Post { id: string; day: number; time: string; title: string; platforms: string[]; status: PostStatus; by: string; caption: string; views: ('team' | 'creator')[]; collab?: boolean; error?: string; comments: Comment[] }
export const POSTS: Post[] = [
  { id: 'p1', day: 0, time: '9:00 AM', title: 'Trail-ready layers: the fall drop', platforms: ['IG', 'FB'], status: 'published', by: 'Priya', caption: 'Shoulder season calls for layers that pack down small. The fall drop is live.', views: ['team'], comments: [] },
  { id: 'p2', day: 0, time: '6:30 PM', title: 'Reel: 3 ways to pack the Ridge 28', platforms: ['IG', 'TT'], status: 'approval', by: 'Priya', caption: 'Three packing setups for one 28L pack. Which one are you?', views: ['team'], comments: [{ who: 'Sam Park', text: 'Cover frame swapped to the blue jacket shot.', when: 'Today 9:40 AM' }] },
  { id: 'p3', day: 1, time: '12:00 PM', title: 'Jules × Fernway: summit morning', platforms: ['IG'], status: 'approval', by: 'Jules Ortiz', collab: true, caption: '5:40am, 4,200 ft, and the Ridge 28 carrying everything. Partnered with @fernwayoutdoor.', views: ['team', 'creator'], comments: [] },
  { id: 'p4', day: 2, time: '8:15 AM', title: 'Fall camp checklist', platforms: ['PIN'], status: 'scheduled', by: 'Priya', caption: 'Save this for your next overnight.', views: ['team'], comments: [] },
  { id: 'p5', day: 2, time: '5:00 PM', title: 'Behind the stitch: factory visit', platforms: ['YT', 'LI'], status: 'scheduled', by: 'Sam', caption: 'How the Ridge line gets made.', views: ['team'], comments: [] },
  { id: 'p6', day: 3, time: '11:00 AM', title: 'UGC repost: @wanderwithkai', platforms: ['IG'], status: 'scheduled', by: 'Priya', caption: 'Kai took the Ridge 28 up Rainier. Rights granted.', views: ['team'], comments: [] },
  { id: 'p7', day: 3, time: '7:00 PM', title: 'Tent pitch speedrun', platforms: ['TT'], status: 'failed', by: 'Sam', caption: 'Can we pitch the Basecamp 2 in under 90 seconds?', error: 'TikTok needs reconnecting. The access token expired on Oct 24.', views: ['team'], comments: [] },
  { id: 'p8', day: 4, time: '10:00 AM', title: 'Weekend forecast + gear picks', platforms: ['TH', 'FB'], status: 'draft', by: 'Priya', caption: '', views: ['team'], comments: [] },
  { id: 'p9', day: 5, time: '9:30 AM', title: 'Story poll: lake or summit?', platforms: ['IG'], status: 'scheduled', by: 'Priya', caption: 'Vote in stories.', views: ['team'], comments: [] },
  { id: 'p10', day: 6, time: '4:00 PM', title: 'Sunday reset: gear care', platforms: ['IG', 'TT'], status: 'draft', by: 'Sam', caption: '', views: ['team'], comments: [] },
  { id: 'c1', day: 0, time: '7:00 AM', title: 'Sunrise on Mt. Si', platforms: ['IG'], status: 'published', by: 'Jules', caption: 'Worth the 4am alarm.', views: ['creator'], comments: [] },
  { id: 'c3', day: 2, time: '6:00 PM', title: 'Fall layers haul (affiliate)', platforms: ['TT'], status: 'scheduled', by: 'Jules', caption: 'Everything I am wearing this fall, links in bio.', views: ['creator'], comments: [] },
  { id: 'c4', day: 4, time: '8:00 AM', title: 'Trail mix, three ways', platforms: ['IG', 'YT'], status: 'draft', by: 'Jules', caption: '', views: ['creator'], comments: [] },
  { id: 'c5', day: 5, time: '10:00 AM', title: 'Q&A in stories', platforms: ['IG'], status: 'scheduled', by: 'Jules', caption: 'Ask me anything about solo overnights.', views: ['creator'], comments: [] },
];

/* ---------- Engage ---------- */
export type ConvoContext =
  | { kind: 'customer'; orders: number; note: string }
  | { kind: 'creator'; campaign: string; sales: string; creatorId: string }
  | { kind: 'risk'; note: string }
  | { kind: 'ugc'; note: string }
  | { kind: 'brand'; campaign: string; note: string }
  | { kind: 'shop'; note: string }
  | { kind: 'fan'; note: string };
export interface Message { me: boolean; text: string; at: string }
export interface Convo { id: string; who: string; platform: string; type: string; unread: boolean; flag?: boolean; done?: boolean; messages: Message[]; ctx: ConvoContext; view: 'team' | 'creator' }
export const CONVOS: Convo[] = [
  { id: 'k1', view: 'team', who: '@kai.wanders', platform: 'IG', type: 'DM', unread: true, messages: [{ me: false, text: 'Is the Ridge 28 carry-on size for most airlines?', at: '11:02 AM' }], ctx: { kind: 'customer', orders: 2, note: 'Bought a Basecamp 2 in August.' } },
  { id: 'k2', view: 'team', who: '@julesoutside', platform: 'IG', type: 'Comment', unread: true, messages: [{ me: false, text: 'So stoked on how this one turned out!!', at: '10:48 AM' }], ctx: { kind: 'creator', campaign: 'Fall Trail ’26', sales: '$2,410', creatorId: 'jo' } },
  { id: 'k3', view: 'team', who: '@tentlife_tyler', platform: 'TT', type: 'Comment', unread: true, flag: true, messages: [{ me: false, text: 'zipper broke after 2 trips. not cool', at: '9:15 AM' }], ctx: { kind: 'risk', note: 'Negative sentiment. 1.1K likes on the comment.' } },
  { id: 'k4', view: 'team', who: 'Dana Whitfield', platform: 'FB', type: 'DM', unread: false, messages: [{ me: false, text: 'Do you ship to Canada?', at: 'Yesterday' }, { me: true, text: 'We do. Duties are included at checkout.', at: 'Yesterday' }], ctx: { kind: 'customer', orders: 0, note: 'New contact.' } },
  { id: 'k5', view: 'team', who: '@sierrahikes', platform: 'IG', type: 'Mention', unread: false, messages: [{ me: false, text: 'Tagged @fernwayoutdoor in a story: “best $90 I spent this year”', at: 'Sat' }], ctx: { kind: 'ugc', note: 'Ask for rights to repost this in Create.' } },
  { id: 'j1', view: 'creator', who: 'Maya Chen · Fernway', platform: 'Later', type: 'Brand', unread: true, messages: [{ me: false, text: 'Thanks for the summit draft. Notes are on the post in Plan if I have any.', at: '10:13 AM' }], ctx: { kind: 'brand', campaign: 'Fall Trail ’26', note: 'Active campaign. $1,800 flat + 12% commission.' } },
  { id: 'j2', view: 'creator', who: '@hannah.on.trail', platform: 'IG', type: 'Comment', unread: true, messages: [{ me: false, text: 'where is that jacket from?? need it', at: '9:51 AM' }], ctx: { kind: 'shop', note: 'Matches a product you have a link for.' } },
  { id: 'j3', view: 'creator', who: '@mtnmarco', platform: 'TT', type: 'Comment', unread: true, messages: [{ me: false, text: 'jacket link pls', at: '9:30 AM' }], ctx: { kind: 'shop', note: 'Matches a product you have a link for.' } },
  { id: 'j4', view: 'creator', who: '@liz_outdoors', platform: 'IG', type: 'DM', unread: false, messages: [{ me: false, text: 'Your Mt. Si post got me out the door this morning', at: 'Yesterday' }], ctx: { kind: 'fan', note: 'Follower for 2 years.' } },
];

/* ---------- Create ---------- */
export const MEDIA = [
  { title: 'Ridge 28 on granite', source: 'Upload', group: 'publish' }, { title: 'Factory: stitching', source: 'Upload', group: 'publish' }, { title: 'Summit morning (Jules)', source: 'Creator', group: 'creators' },
  { title: '@wanderwithkai on Rainier', source: 'UGC', group: 'grow', rights: 'Granted' }, { title: 'Fall drop carousel', source: 'Canva', group: 'publish' }, { title: '@sierrahikes story', source: 'UGC', group: 'grow', rights: 'Not requested' },
  { title: 'Tent pitch b-roll', source: 'Upload', group: 'publish' }, { title: 'Gear care graphic', source: 'Canva', group: 'publish' }, { title: '@lenatrails reel', source: 'Creator', group: 'creators' }, { title: 'Lake camp at dusk', source: 'Upload', group: 'publish' },
] as const;
export const IDEAS: [string, string][] = [
  ['Reel: “What I pack for a 40°F morning”', 'Ride #shoulderseason (+212%). Show the Alder jacket packing into its own pocket.'],
  ['Carousel: quiet hiking spots near you', 'Rising +148%. Ask followers to drop their spot; collect replies as UGC.'],
  ['Story series: gear care in 60 seconds', 'Answers the zipper complaints from Engage before they spread.'],
];

/* ---------- Link in bio ---------- */
export interface Block { name: string; desc: string; on: boolean; stat: string }
export const BLOCKS: Record<'team' | 'creator', Block[]> = {
  team: [
    { name: 'Featured banner', desc: 'Fall drop: layers that pack small', on: true, stat: '1,912 clicks' },
    { name: 'Linked posts', desc: 'Shoppable feed of your IG and TikTok posts', on: true, stat: '2,204 clicks' },
    { name: 'Product carousel', desc: 'Ridge 28, Alder jacket, Basecamp 2', on: true, stat: '640 clicks' },
    { name: 'Email signup', desc: 'Trail notes newsletter', on: true, stat: '150 signups' },
    { name: 'Social links', desc: 'Instagram, TikTok, YouTube, Pinterest', on: false, stat: '—' },
  ],
  creator: [
    { name: 'Featured banner', desc: 'My fall kit, all in one place', on: true, stat: '1,377 clicks' },
    { name: 'Affiliate links', desc: '5 links, synced from Earn', on: true, stat: '9,143 clicks' },
    { name: 'Linked posts', desc: 'Tap a post to shop it', on: true, stat: '3,021 clicks' },
    { name: 'Brand partner', desc: 'Fernway Outdoor collab', on: true, stat: '812 clicks' },
    { name: 'Email signup', desc: 'Weekend trail drops', on: false, stat: '—' },
  ],
};

/* ---------- Earn ---------- */
export interface AffLink { id: string; brand: string; product: string; url: string; clicks: number; orders: number; commission: number; live: boolean }
export const LINKS: AffLink[] = [
  { id: 'l1', brand: 'Fernway Outdoor', product: 'Ridge 28 pack', url: 'later.link/jules/ridge28', clicks: 3214, orders: 188, commission: 1128.4, live: true },
  { id: 'l2', brand: 'Fernway Outdoor', product: 'Alder insulated jacket', url: 'later.link/jules/alder', clicks: 2876, orders: 141, commission: 1269.0, live: true },
  { id: 'l3', brand: 'Northline Coffee', product: 'Cold brew camp kit', url: 'later.link/jules/coldbrew', clicks: 1540, orders: 96, commission: 432.0, live: true },
  { id: 'l4', brand: 'Altus Optics', product: 'Polar trail sunglasses', url: 'later.link/jules/polar', clicks: 902, orders: 37, commission: 288.6, live: false },
  { id: 'l5', brand: 'Pinecrest Supply', product: 'Ultralight stove', url: 'later.link/jules/stove', clicks: 611, orders: 22, commission: 143.0, live: false },
];
