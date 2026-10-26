# Later One design system

Tokens, components and patterns for Later One, an unofficial concept that brings Later's products into one account. Not affiliated with Later; all data is fictional.

## Run it

```
npm install
npm run storybook
```

Storybook opens at http://localhost:6006. Use **Theme** in the toolbar to switch between light and dark.

On Windows PowerShell, use `npm.cmd` instead of `npm` if scripts are blocked.

## What's inside

- **Foundations**: color, typography, spacing and radius, icons
- **Components**: Button, Pill, Count badge and wordmark, Segmented control, Metric card, Creator row
- **Patterns**: Agent step card, for EdgeAI steps that work, wait for review, or get blocked

## Tokens

`src/tokens/tokens.json` is the source of truth. `npm run tokens` generates `src/tokens/tokens.css` (`--lo-*` CSS variables, light and dark), and runs on its own before `npm run storybook` and `npm run build-storybook`. Components use only these variables.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run storybook` | Starts Storybook |
| `npm run build-storybook` | Builds a static Storybook into `storybook-static/` |
| `npm run tokens` | Regenerates `tokens.css` from `tokens.json` |
| `npx vitest --project=storybook` | Runs every story as a test, including accessibility checks (needs `npx playwright install chromium` once) |
| `npm run dev` | Shows the components in a small Vite page |
