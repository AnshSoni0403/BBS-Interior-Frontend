# BBS-Interior-Frontend

Multi-page website for **BBS Interior** — a warm, luxe-editorial interior design studio site with rich scroll motion.

## Stack

React 18 · Vite · TypeScript · GSAP + ScrollTrigger · Lenis smooth scroll · Framer Motion · React Router

## Pages

| Route | Page |
| --- | --- |
| `/` | Home — hero, services, pinned horizontal portfolio, before/after, process, testimonials |
| `/about` | Story, values, timeline, team |
| `/services` | Services, packages, process, FAQ |
| `/portfolio` | Filterable grid / index view |
| `/portfolio/:slug` | Project detail with gallery, before/after, palette |
| `/ideas` | Design ideas by room (lightbox) + journal |
| `/journal/:slug` | Journal article |
| `/contact` | Consultation form, studios, FAQ |

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Editing content

- Business details, studios, nav, image library: `src/data/site.ts`
- Projects: `src/data/projects.ts`
- Services, packages, testimonials, FAQs, team, ideas, journal posts: `src/data/content.ts`

Images are placeholders from Unsplash — replace the ids in `IMG` (`src/data/site.ts`) with real project photos.
The contact form is frontend-only; connect it to an email/CRM service in `src/pages/Contact.tsx`.
