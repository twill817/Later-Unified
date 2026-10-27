import type { IconName, MetricKind } from '@ds';

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

export interface QueueItem { group: Group; icon: IconName; tone?: 'warning' | 'danger'; title: string; meta: string; to: Route; profile?: string }

export const QUEUE: Record<Role, QueueItem[]> = {
  brand: [
    { group: 'creators', icon: 'calendar', title: 'Jules Ortiz sent a draft for your review', meta: 'Fall Trail ’26 · approves in Plan, publishes from Jules’s account', to: { page: 'campaign', id: 'ft', tab: 'creators' }, profile: 'jo' },
    { group: 'creators', icon: 'alert', tone: 'warning', title: '1 recommended creator needs a brand-safety review', meta: '@grayholloway · flagged by EdgeAI', to: { page: 'campaign', id: 'ft', tab: 'creators' }, profile: 'd3' },
    { group: 'grow', icon: 'trend', title: 'Creators drove an estimated $38–52K beyond their links', meta: 'Fall Trail ’26 · sales through your own Link in bio after creator posts', to: { page: 'insights', tab: 'halo' } },
    { group: 'grow', icon: 'people', title: '6 fans already sell your products and could be creators', meta: 'Found across UGC, your inbox and Later Creator links', to: { page: 'insights', tab: 'audience' } },
    { group: 'creators', icon: 'spark', title: 'Winter Layers drop is still a draft', meta: 'EdgeAI can plan it for you and check with you before spending', to: { page: 'campaign', id: 'wl' } },
  ],
  smm: [
    { group: 'publish', icon: 'calendar', title: '3 posts are waiting for approval', meta: '2 from your team and 1 creator collab from Jules Ortiz', to: { page: 'tool', tool: 'plan' } },
    { group: 'publish', icon: 'alert', tone: 'danger', title: 'A TikTok post failed to publish', meta: 'Tent pitch speedrun · Thu 7:00 PM · reconnect TikTok to retry', to: { page: 'tool', tool: 'plan' } },
    { group: 'grow', icon: 'inbox', title: '3 unread conversations', meta: '1 TikTok comment flagged as negative sentiment', to: { page: 'tool', tool: 'engage' } },
    { group: 'grow', icon: 'radar', title: '#shoulderseason is up 212% this week', meta: 'Trend from Listen · included in the Scale plan', to: { page: 'tool', tool: 'listen' } },
  ],
  creator: [
    { group: 'creators', icon: 'calendar', title: 'Fernway asked for a small revision', meta: 'Summit morning · name the pack first and add #ad · due Wed', to: { page: 'tool', tool: 'plan' } },
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

export const BADGES: Record<Role, Partial<Record<ToolId, number>>> = {
  brand: { plan: 2, engage: 3 },
  smm: { plan: 3, engage: 3 },
  creator: { campaigns: 1, earn: 2, plan: 1, engage: 3 },
};

export interface Metric { label: string; value: string; kind: MetricKind; delta?: string; down?: boolean; note?: string }

/** Headline numbers for tools that keep a simpler page in this first pass. */
export const TOOL_METRICS: Partial<Record<ToolId, Metric[]>> = {
  plan: [{ label: 'Scheduled this week', value: '8', kind: 'volume' }, { label: 'Awaiting approval', value: '3', kind: 'people' }, { label: 'Best time today', value: '6:30 PM', kind: 'rate', note: 'Instagram' }],
  engage: [{ label: 'Unread conversations', value: '3', kind: 'volume' }, { label: 'Median reply time', value: '42 min', kind: 'rate', delta: '-18%', note: 'vs last week' }, { label: 'Flagged', value: '1', kind: 'people', note: 'Negative sentiment' }],
  analyze: [{ label: 'Reach', value: '412K', kind: 'volume', delta: '+11%', note: 'vs prior 30 days' }, { label: 'Engagement rate', value: '4.2%', kind: 'rate', delta: '+0.3 pts' }, { label: 'Link clicks', value: '4,906', kind: 'clicks', delta: '+12%' }, { label: 'Attributed sales', value: '$207K', kind: 'money', delta: '+19%' }],
  listen: [{ label: 'Brand health', value: '78 / 100', kind: 'rate' }, { label: 'Top trend', value: '+212%', kind: 'volume', note: '#shoulderseason' }, { label: 'Competitors tracked', value: '3 of 20', kind: 'people' }],
  create: [{ label: 'Assets', value: '248', kind: 'volume' }, { label: 'UGC with rights', value: '31', kind: 'people' }, { label: 'AI credits left', value: '88', kind: 'rate' }],
  linkinbio: [{ label: 'Page views', value: '18,420', kind: 'volume', delta: '+9%' }, { label: 'Clicks', value: '4,906', kind: 'clicks', delta: '+12%' }, { label: 'Click-through', value: '26.6%', kind: 'rate', delta: '+0.8 pts' }, { label: 'Attributed sales', value: '$21,380', kind: 'money', delta: '+15%' }],
  earn: [{ label: 'October', value: '$4,812.40', kind: 'money', delta: '+38%' }, { label: 'Pending', value: '$1,236.00', kind: 'money', note: 'Return window' }, { label: 'Orders', value: '484', kind: 'volume', delta: '+29%' }],
  services: [{ label: 'Programs', value: '2', kind: 'volume', note: '1 planning, 1 complete' }, { label: 'Spring Trail ’26 sales', value: '$241,000', kind: 'money' }],
  campaigns: [{ label: 'Active deals', value: '1', kind: 'volume' }, { label: 'New invites', value: '1', kind: 'people' }, { label: 'Campaign earnings, Oct', value: '$2,089', kind: 'money' }],
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
