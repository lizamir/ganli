# גנלי · Ganli Daycare

Brand, marketing site and management app for a daycare for ages 6 months to 3 years.
Next.js (App Router) · React · TypeScript · React Three Fiber · Supabase.

## Run locally

```bash
npm install
npm run dev
```

Without Supabase settings the app runs in **demo mode** on mock data. To connect a server, copy `.env.example` to `.env.local` (see "Data" below).

## Design system

- **Idea:** a doorway. The arch from the logo is the recurring shape (hero window, group cards, space cards). Things get *built*: blocks drop, the castle rises as you scroll, the day crosses a sky.
- **Type:** Heebo (from `app/fonts/`, variable 100–900) is the main face for everything. Gveret Levin (Hebrew handwriting) is the accent: one handwritten word per headline, big numerals and the margin notes. Never for running text.
- **Color:** cream, wood, cocoa, with teal, tomato, mustard and blush. The bright colors are for fills; text uses darker `-ink` / `-deep` twins. Every text pair is WCAG AA (tokens and notes at the top of `app/globals.css`).
- **Motion:** smooth scroll (Lenis), scroll-driven 3D castle (`components/Story.tsx`), pinned day timeline (`components/Day.tsx`), masked headline reveals, marquee, cursor ring. All of it turns off with "reduce motion" or the in-page switch, and the content stays the same.

## Accessibility

- Floating accessibility menu: text size (4 steps), high contrast, stop animations, underline links, extra spacing (`components/AccessibilityToolbar.tsx`, state in `lib/a11y.ts`). Saved in localStorage.
- Skip link, landmarks, one `h1` per page, labelled controls, visible focus, 44px touch targets, `prefers-reduced-motion`.
- Statement page at `/accessibility`. It is a template: the accessibility contact and date must be filled in before real use.
- Checked with axe-core (WCAG 2.1 A/AA + best practices) on the landing page, login and all 3 dashboards. Run it again after design changes.

## Pages

- `/` marketing site, including an enrollment form
- `/login` and `/app/{parent,staff,admin}/…` the personal area (desktop sidebar, mobile bottom tabs)

### Features (researched against Brightwheel, Famly, Lillio/HiMama, Daily Connect)

| For | What |
|---|---|
| Parent | Day strip, auto day summary (a template over the care log, no AI model), photos and album choice, **pickup QR + daily code**, **weekly menu with allergy warnings**, messages, **absence report**, **event RSVP**, payments, child card |
| Staff | Group board with a mini day strip per child, allergy and pickup alerts, group updates, care log, **pickup code verification**, **menu with children to watch** |
| Admin | Attendance, update coverage, **weekly attendance chart**, payments, to-dos, children and staff, finance, messages, parent inquiries, **enrollment requests** |

Live updates: in demo mode a change in one tab shows up in another (e.g. staff logs a meal, the parent window shows a notice). With Supabase the app checks every 30 seconds.

## Data

- **Demo mode (default, and always for the portfolio build):** mock data in `lib/app/mock.ts`, saved in the browser's localStorage.
- **Supabase:** `.env.local` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_GANLI_INSTITUTION_ID` (the institution that receives enrollment requests). Email and password sign in; RLS decides what each role sees. Migrations are in `beyachad-daycare/supabase/migrations/` (core, demo day reset, parent inquiries and leads).
- Not in the schema yet: photos, events and RSVP, planned pickups, menu. Those show empty or are demo-only in Supabase mode.

## Add to the portfolio

```bash
npm run build:portfolio
```

Builds a static, demo-mode export under `/demos/ganli` and copies it to `../liz-portfolio/public/demos/ganli`. No Supabase keys are included.

## Structure

- `app/layout.tsx` fonts, providers, accessibility menu · `app/globals.css` tokens, base, a11y modes · `app/site.css` marketing site · `app/dashboard.css` the app
- `components/` marketing sections · `components/app/` dashboard pieces
- `lib/content.ts` all site copy and the menu · `lib/app/` types, mock data, helpers, Supabase adapter, store
