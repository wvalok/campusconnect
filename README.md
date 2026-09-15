# CampusConnect

A student-facing platform for Bennett University: events, societies and clubs,
hackathons, announcements, and a campus guide. Built with Next.js (App Router),
Prisma, and SQLite.

> Sample project. Campus timings, room numbers, hostel and library details, and
> the map pin are illustrative placeholders, not official information.

## What a student can do

- **Home** — a personalised digest: next events they have RSVP'd to, upcoming
  events, open hackathons, recent announcements, quick links into the campus
  guide, and their societies.
- **Events** — browse everything coming up with photos, filter by category or
  "my societies only", open an event for details and the guest list, and RSVP as
  *Going* or *Interested*. Events with a capacity stop taking *Going* RSVPs when
  full.
- **Societies & Clubs** — browse societies and clubs separately or together,
  join or leave, and see each group's description, meeting time, members,
  upcoming events, and announcements.
- **Hackathons** — browse hackathons run by clubs and campus partners, split
  into *registration open* and *closed & upcoming*, and register or withdraw.
  Registration closes automatically at the deadline.
- **Announcements** — campus-wide notices plus updates from joined societies,
  pinned first.
- **Campus guide** — reference pages for the **Hostel** (room types, mess
  timings, rules, contacts), the **Library** (hours, borrowing, databases), the
  **LRC** (access, floor guide, facilities, etiquette), and a **campus map**
  with an embedded OpenStreetMap view and a directory of key buildings.
- **Profile** — their RSVPs, hackathon registrations, societies, and a count of
  events attended.
- **Dark mode** — a header toggle, following the system setting by default and
  remembered per browser.

## Requirements

- Node.js 20 or newer

## Setup

```bash
npm install          # also runs prisma generate
npm run setup        # prisma generate + db push + seed
npm run dev          # http://localhost:3000
```

If you change `prisma/schema.prisma`, re-run `npm run db:push`. To wipe and
reseed, run `npm run db:reset`.

## Demo accounts

All demo accounts use the password `password123`.

| Email             | Name         |
| ----------------- | ------------ |
| aarav@campus.edu  | Aarav Sharma |
| diya@campus.edu   | Diya Patel   |
| kabir@campus.edu  | Kabir Nair   |
| meera@campus.edu  | Meera Iyer   |

`aarav@campus.edu` starts with societies joined, events on the calendar, and
hackathon registrations, so it is the best account for a first look.

## Project layout

| Path                       | What's there                                          |
| -------------------------- | ---------------------------------------------------- |
| `app/(app)/`               | Authenticated pages: home, events, clubs, hackathons, announcements, campus, profile. |
| `app/login/`               | Login screen and the `login` / `logout` actions.     |
| `app/actions.ts`           | RSVP, society membership, and hackathon registration actions. |
| `components/ThemeProvider` / `ThemeToggle` | Dark mode via `next-themes`.         |
| `components/cards.tsx`     | Shared card, header, and empty-state components.      |
| `components/CoverImage.tsx`| Image with a graceful icon fallback.                  |
| `lib/session.ts`           | Signed JWT session cookie (`jose`).                   |
| `lib/campus.ts`            | Static hostel / library / LRC / map content.         |
| `middleware.ts`            | Redirects unauthenticated visitors to `/login`.      |
| `prisma/schema.prisma`     | Data model.                                          |
| `prisma/seed.mjs`          | Demo students, societies, events, hackathons, announcements. |
| `public/img/`              | Local photos used across the app.                    |
| `public/bennett-*.png`     | Bennett University logo and shield mark.             |
| `scripts/`                 | `logo.mjs`, `fetch-images.mjs`, and the smoke / e2e tests. |

## Icons and images

- Icons come from `lucide-react`.
- Photos are downloaded once into `public/img/` by `node scripts/fetch-images.mjs`
  (sourced from Unsplash) and committed, so the app needs no image CDN at
  runtime. `CoverImage` shows a placeholder if a file is missing.
- The Bennett University logo is used for a student project about the
  university; swap `public/bennett-logo.png` and `public/bennett-mark.png` (and
  re-run `node scripts/logo.mjs`) to change it.

## Notes and next steps

- Auth is email + password with a signed session cookie; there is no sign-up
  flow. `SESSION_SECRET` in `.env` is a development placeholder — set a real
  random value before deploying.
- Only the **student** role exists. Club-admin and college-admin roles (creating
  events and hackathons, posting announcements, approving societies) are the
  natural next build.
- Going live means moving the database from SQLite to hosted Postgres and
  deploying to a host such as Vercel.
