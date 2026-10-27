# Later One

An unofficial concept prototype, working name **Later One**, that brings Later's products into one account and one interface with a home screen that adapts to each role.

> Not affiliated with Later. All people, brands and figures in the prototype are fictional.

## Run it

Open `index.html` in a browser. It's the built app in one self-contained file, so GitHub Pages can serve it from the root.

## What's where

| Folder | What it is |
| --- | --- |
| `app/` | The Later One app in React, built only from the design system's components and tokens |
| `design-system/` | Tokens, components and patterns in Storybook |
| `legacy/` | The original hand-coded prototype, kept for reference |
| `docs/` | Feature inventory and design decisions |

To work on the app:

```
cd app
npm install
npm run dev
```

`npm run build` writes the single-file app to `app/dist/index.html`. On Windows PowerShell, use `npm.cmd` if scripts are blocked.

Every screen is built in React on the design system: sign-in, the home screen, Campaigns, Insights (creator halo and audience), the EdgeAI agent run, Plan, Engage, Analyze, Listen, Create, Link in bio, Earn and Services. Posts and inbox conversations live in one shared store, so changes carry across roles. The Creator view follows Later Creator (formerly Mavely): a paste-a-URL link bar, quick stats by date range, monthly bonus tiers, a brand catalog with commission rates and cookie windows, commission boosts and promotions, and one payout statement that combines commission, bonuses, brand deal fees and referrals. Try it: as Brand marketer, open the Jules × Fernway post and request changes; switch to Creator to see the note, edit and send it back; switch back to approve.

## What it shows

**The problem.** Later today is three products with separate front doors: Later Social for scheduling and analytics, Later Creator for affiliate links and payouts, and the influencer marketing platform and full-service programs for brands.

**The structure.** A home screen that answers "what needs me now," plus nine tools in three groups:

| Group | Tools |
| --- | --- |
| Publish | Plan + publish, Create, Link in bio |
| Grow | Engage, Analyze, Listen |
| Creators | Campaigns (Opportunities for creators), Earn, Services |

A shared Workspace layer holds social sets, people and roles, AI credits, plan and integrations.

**The roles.** Switch between three roles (Brand marketer, Social manager, Creator) with the "View as" control in the prototype bar at the bottom left. It sits outside the product UI on purpose; inside the app, the signed-in person appears at the bottom of the sidebar, with a menu for settings and sign-out.

- **Maya**, influencer marketing lead at a brand
- **Jules**, a creator in that brand's campaign
- **Priya**, the brand's social media manager

Each role gets its own "Needs you now" queue and tool order. Tools outside a role's core work stay under "More from Later."

## Design system

`design-system/` holds Later One's tokens and components in Storybook. See [design-system/README.md](design-system/README.md).

## Things to try

- Pick a demo account on the sign-in screen and watch the blurred, blank dashboard sharpen as its numbers load. Use Replay sign-in in the prototype bar, or Sign out in the user menu, to see it again.
- As Maya, open Jules's draft from the home screen and request changes. Switch to Jules to see the same post with Maya's note, then send it back.
- In Engage, see campaign context next to a creator's comment, or (as Jules) reply to a shopping question with an affiliate link.
- As Maya, open Campaigns: plan a new campaign with the EdgeAI forecast, then open Fall Trail '26 and work through its Overview, Brief, Creators, Content, Payments and Results tabs. Select any creator name for their full profile.
- As the brand marketer, open Insights. **Creator halo** estimates sales creators drove through the brand's own Link in bio, beyond their tracked links. Start on "What links see," press **Reveal what links can't see**, then press play under the chart to watch each creator post ripple out day by day. **From your audience** finds fans who already post about, message and sell the brand's products, as creator candidates.
- As the brand marketer, open **Ask EdgeAI** and choose **Plan the Winter Layers drop for me** (or open the draft in Campaigns and choose **Let EdgeAI plan it**). The agent drafts the brief, builds a shortlist and prices offers, and stops for you to review the brief, approve spend, resolve a creator conflict and send invites. Try editing the brief, raising an offer past the budget cap, or switching a guardrail to Continue.
- As Priya, open Listen to preview a plan-locked tool instead of having it hidden.
- Press ⌘K / Ctrl+K to search across posts, creators, links and conversations.

See [docs/ia-and-decisions.md](docs/ia-and-decisions.md) for the feature inventory and design rationale.
