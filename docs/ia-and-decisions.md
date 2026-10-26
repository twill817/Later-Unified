# IA and design decisions

## Feature inventory (from later.com, October 2026)

- **Plan + publish:** visual planner, multi-profile scheduling, drafts, saved captions, best time to post (Instagram, TikTok, Facebook), hashtag suggestions, first comment, product tagging, auto-publish across Instagram, Facebook, TikTok, Threads, YouTube, Pinterest, LinkedIn and Snapchat.
- **Create:** media library, Canva export, media editing, Chrome extension, UGC collection by profile, hashtag, tags and mentions, AI Ideas and Caption Writer (credit-metered).
- **Collaboration:** access groups, shared calendar, calendar notes, post comments and activity log, approval workflow, external review links.
- **Engage:** Instagram, Facebook and TikTok DMs, comments and mentions in one inbox.
- **Listen:** competitive benchmarking, future trend insights, brand health, brand mentions.
- **Analyze:** per-platform analytics, custom cross-profile analytics, Meta Ads paid + organic.
- **Link in bio:** buttons, linked shoppable posts, banners, product carousels, email capture, SEO, analytics, affiliate links.
- **Influencer platform (brands):** creator discovery with brand-fit and risk flags, incentive advisor for fair rates, paid + organic + sales reporting, Later EdgeAI.
- **Earn (creators):** affiliate links across thousands of brands, real-time click and sale tracking, payouts, brand campaigns, bonuses, referrals, coaching.
- **Services:** full-service influencer programs run by Later's team.

## Role priority

1. **Brand influencer marketer.** Highest value; where Later's positioning now leads.
2. **Creator.** Supply side of the marketplace; their sales data powers EdgeAI.
3. **Social media manager.** Self-serve base and funnel. Agency and team leads are a scale and permission variant of this role, not a separate hub.

These roles form a loop: social posts and creator links generate the data behind brand campaign decisions, and brand campaigns become creator earning opportunities.

## Design positions

- **The hub is a queue, not a menu.** It lists what needs the user and reorders spokes by role.
- **Shared objects cross spokes.** A post, creator, link or campaign is the same object everywhere.
- **Approvals stay inside Plan.** A separate spoke would split one workflow.
- **Locked features stay visible.** Plan-gated spokes show a preview and an upgrade path instead of disappearing.

## Campaigns spoke (deep dive)

Campaigns is the deepest spoke because brand influencer marketing is where Later now leads.

- **Portfolio.** Every campaign in one list, whether self-run or run by Later's full-service team, with budget used, sales and ROAS.
- **Plan with EdgeAI.** Goal, budget, products and audience produce a live forecast: sales and ROAS ranges, impressions, recommended creator mix by tier, and first-pick creators. Large budgets surface the full-service option.
- **Campaign workspace** with six tabs:
  - *Overview:* KPIs, spend pacing vs. plan, EdgeAI suggestions you can apply, deliverable status, top creators by return.
  - *Brief:* the single brief creators see in Opportunities.
  - *Creators:* pipeline from Discover to Live, plus recommended creators with fit, fair rate, overlap and brand-safety status.
  - *Content:* every deliverable with due date, status and usage rights. Approval happens in Plan, so the status here is the same post's status.
  - *Payments:* agreed rates against the incentive advisor's fair range, with counter-offers; creators are paid through Earn.
  - *Results:* sales by creator and by source, and per-creator reach, cost per order and ROAS.
- **Creator profile** opens from any creator name across the app: audience, performance, brand-safety checks, past brand work and fair rate.
- **Managed and completed campaigns** get their own views: a program timeline with the Later strategist for full-service, and results plus "reuse this brief" for completed ones.
