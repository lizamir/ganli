# גנלי · Ganli Daycare

Brand, marketing site and management app for a daycare for ages 6 months to 3 years.
Next.js (App Router) · React · TypeScript · React Three Fiber · Supabase.

## Getting started

```bash
nvm use
npm install
npm run dev
```

Without Supabase settings the app runs in **demo mode** on mock data. To connect a server, copy `.env.example` to `.env.local` (see "Data" below).

## Scripts

| Command                   | What it does                                                         |
| ------------------------- | -------------------------------------------------------------------- |
| `npm run dev`             | Development server                                                   |
| `npm run build`           | Static export to `out/`                                              |
| `npm run build:demo`      | The same, forced to demo mode with no server settings                |
| `npm run build:portfolio` | Demo build copied into the portfolio                                 |
| `npm run check`           | Lint, types, formatting and unit tests                               |
| `npm test`                | Unit tests (Vitest)                                                  |
| `npm run test:e2e`        | Browser tests of the demo build (Playwright); run `build:demo` first |

## Conventions

- **Commits** follow [Conventional Commits](https://www.conventionalcommits.org); a hook checks each message.
- **Versions** follow [SemVer](https://semver.org). Changes are listed in `CHANGELOG.md`.
- **CI** runs every check and the browser tests on each pull request (`.github/workflows/ci.yml`).
- **Formatting** is Prettier and ESLint, run on staged files before each commit. Prettier also sorts Tailwind classes.
- **Styling** is [Tailwind CSS](https://tailwindcss.com) v4. Components carry utility classes; class lists that repeat live in small modules next to the components (`components/dashboard/ui/form.ts`, `lists.ts`, `stats.ts`, `components/site/form.ts`), joined with `cn()` (`lib/ui/cn.ts`). Brand colors, fonts and breakpoints (`tablet`, `mobile`, `small`, `xs`, `touch`…) are Tailwind tokens in `app/styles/theme.css`. Plain CSS is kept for what reads better as CSS: tokens and element defaults, the button component, keyframes, scroll reveals and the 3D stages.

## Design system

- **Idea:** a doorway. The arch from the logo is the recurring shape (hero window, group cards, space cards). Things get _built_: blocks drop, the castle rises as you scroll, the day crosses a sky.
- **Type:** Heebo (from `app/fonts/`, variable 100–900) is the main face for everything. Gveret Levin (Hebrew handwriting) is the accent: one handwritten word per headline, big numerals and the margin notes. Never for running text.
- **Color:** cream, wood, cocoa, with teal, tomato, mustard and blush. The bright colors are for fills; text uses darker `-ink` / `-deep` twins. Every text pair is WCAG AA (tokens and notes in `app/styles/base/tokens.css`).
- **Motion:** smooth scroll (Lenis), scroll-driven 3D castle (`components/site/sections/Story.tsx`), pinned day timeline (`components/site/sections/Day.tsx`), masked headline reveals, marquee, cursor ring. All of it turns off with "reduce motion" or the in-page switch, and the content stays the same.

## Accessibility

- Floating accessibility menu: text size (4 steps), high contrast, stop animations, underline links, extra spacing (`components/common/AccessibilityToolbar.tsx`, state in `lib/stores/a11y.ts`). Saved in localStorage.
- Skip link, landmarks, one `h1` per page, labelled controls, visible focus, 44px touch targets, `prefers-reduced-motion`.
- Statement page at `/accessibility`. It is a template: the accessibility contact and date must be filled in before real use.
- Checked with axe-core (WCAG 2.1 A/AA + best practices) on the landing page, login and all 3 dashboards. Run it again after design changes.

## Pages

- `/` marketing site, including an enrollment form
- `/login` and `/app/{parent,staff,admin}/…` the personal area (desktop sidebar, mobile bottom tabs)

### Features (researched against Brightwheel, Famly, Lillio/HiMama, Daily Connect)

| For    | What                                                                                                                                                                                                                                    |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Parent | Day strip, auto day summary (a template over the care log, no AI model), photos and album choice, **pickup QR + daily code**, **weekly menu with allergy warnings**, messages, **absence report**, **event RSVP**, payments, child card |
| Staff  | Group board with a mini day strip per child, allergy and pickup alerts, group updates, care log, **pickup code verification**, **menu with children to watch**                                                                          |
| Admin  | Attendance, update coverage, **weekly attendance chart**, payments, to-dos, children and staff, finance, messages, parent inquiries, **enrollment requests**                                                                            |

Live updates: in demo mode a change in one tab shows up in another (e.g. staff logs a meal, the parent window shows a notice). With Supabase the app checks every 30 seconds.

## Data

- **Demo mode (default, and always for the portfolio build):** mock data in `lib/mock/demoSnapshot.ts`, saved in the browser's localStorage.
- **Supabase:** `.env.local` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_GANLI_INSTITUTION_ID` (the institution that receives enrollment requests). Email and password sign in; RLS decides what each role sees. Migrations are in `beyachad-daycare/supabase/migrations/` (core, demo day reset, parent inquiries and leads).
- Not in the schema yet: photos, events and RSVP, planned pickups, menu. Those show empty or are demo-only in Supabase mode.

## Add to the portfolio

```bash
npm run build:portfolio
```

Builds a static, demo-mode export under `/demos/ganli` and copies it to `../liz-portfolio/public/demos/ganli`. No Supabase keys are included.

## Structure

```
app/                  routes only: metadata and composing a page
  styles/             index.css (cascade layers and imports), theme.css (Tailwind tokens and breakpoints)
    base/             brand tokens, element defaults, type system
    components/       buttons, accessibility menu, cursor, dashboard table and switch
    motion/           keyframes, scroll reveals, grain, the story stage, the pickup tag
    accessibility-modes.css   contrast, no motion, underlined links, spacing (a layer above components)
content/              all marketing copy, by topic
components/
  common/             used everywhere: accessibility menu, reveal, smooth scroll, shapes
  site/               the marketing site
    layout/           header, footer, phone bar
    sections/         one component per section (booking/ and app-showcase/ have their own parts)
    scene/            the 3D block castle
  dashboard/          the personal area
    shell/            sidebar, phone navigation, sheet, live notices
    ui/               card, badge, avatar, icon and other small pieces
    care/             shared by roles: day strip, log form, menu, QR code
    login/, parent/, staff/, admin/   the parts of each role's pages
lib/
  api/                every call to Supabase: client, reads, writes, row mappers, error messages
  data/               the data layer screens use (useGanli), with a demo source and a server source
  domain/             business rules with no UI and no server: pickup codes, allergens, day summary, payments
  automations/        meetings, sign-up lists, calendar files and WhatsApp links
  mock/               made-up demo data
  stores/, hooks/     accessibility state and shared React hooks
tests/                unit tests, mirroring lib/
e2e/                  browser tests of the demo
```

Screens never call Supabase directly: they use `useGanli`, which picks the demo or the server source, so the same screens run in both modes.
