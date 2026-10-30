import '../styles/pages/portfolio.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { ArrowUpRight, LayoutGrid, List } from 'lucide-react'
import { EASE, Reveal, SplitText, gsap, prefersReducedMotion, useRefreshOnLoad, ScrollTrigger } from '../lib/motion'
import { Counter, Marquee } from '../components/Effects'
import { CTA } from '../components/Sections'
import { CATEGORIES, PROJECTS, type Project } from '../data/projects'
import { STATS } from '../data/content'
import { img, IMG } from '../data/site'

type Filter = (typeof CATEGORIES)[number]
type View = 'grid' | 'list'

const pad = (n: number) => String(n).padStart(2, '0')
const indexOf = (p: Project) => PROJECTS.indexOf(p) + 1

/* ------------------------------------------------------------------ */
/* Filter pills — sliding brass indicator via layoutId                 */
/* ------------------------------------------------------------------ */

function Filters({ active, onChange }: { active: Filter; onChange: (f: Filter) => void }) {
  const counts = useMemo(() => {
    const map = new Map<Filter, number>()
    CATEGORIES.forEach((c) => map.set(c, c === 'All' ? PROJECTS.length : PROJECTS.filter((p) => p.category === c).length))
    return map
  }, [])

  return (
    <div className="pf-filters" role="group" aria-label="Filter projects by category">
      {CATEGORIES.map((c) => {
        const isActive = c === active
        return (
          <button key={c} type="button" className={`pf-pill${isActive ? ' is-active' : ''}`} aria-pressed={isActive} onClick={() => onChange(c)}>
            {isActive && <motion.span layoutId="pf-pill-indicator" className="pf-pill__bg" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />}
            <span className="pf-pill__label">{c}</span>
            <sup className="pf-pill__count">{pad(counts.get(c) ?? 0)}</sup>
          </button>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Grid view — editorial asymmetric grid with layout animations        */
/* ------------------------------------------------------------------ */

function GridView({ items }: { items: Project[] }) {
  const reduce = prefersReducedMotion()
  return (
    <motion.ul className="pf-grid" layout={!reduce} aria-label="Projects">
      <AnimatePresence mode="popLayout">
        {items.map((p, i) => (
          <motion.li
            key={p.slug}
            layout={!reduce}
            className={`pf-item${p.size ? ` pf-item--${p.size}` : ''}`}
            initial={reduce ? false : { opacity: 0, y: 70, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '0px 0px -8% 0px' }}
            exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.4, ease: EASE } }}
            transition={{ duration: 1, ease: EASE, delay: (i % 3) * 0.09, layout: { duration: 0.8, ease: EASE } }}
          >
            <Link to={`/portfolio/${p.slug}`} className="pf-card" data-cursor="View">
              <div className="pf-card__media">
                <img src={img(p.cover, p.size === 'wide' ? 1600 : 1100)} alt={`${p.title} — ${p.category.toLowerCase()} interior in ${p.location}`} loading="lazy" />
                <span className="pf-card__tag">{p.category}</span>
                <span className="pf-card__num serif" aria-hidden>
                  {pad(indexOf(p))}
                </span>
                <span className="pf-card__veil" aria-hidden>
                  <span className="pf-card__view">
                    View project <ArrowUpRight size={16} strokeWidth={1.4} />
                  </span>
                </span>
              </div>
              <div className="pf-card__body">
                <div>
                  <h3 className="pf-card__title">{p.title}</h3>
                  <p className="muted">
                    {p.location} · {p.year}
                  </p>
                </div>
                <span className="pf-card__arrow" aria-hidden>
                  <ArrowUpRight size={18} strokeWidth={1.25} />
                </span>
              </div>
            </Link>
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  )
}

/* ------------------------------------------------------------------ */
/* List view — index table with cursor-following preview               */
/* ------------------------------------------------------------------ */

function ListView({ items }: { items: Project[] }) {
  const root = useRef<HTMLDivElement>(null)
  const preview = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  useEffect(() => {
    const el = preview.current
    const area = root.current
    if (!el || !area || !window.matchMedia('(pointer: fine)').matches) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.65, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.65, ease: 'power3' })
    const rTo = gsap.quickTo(el, 'rotate', { duration: 0.9, ease: 'power3' })
    let lastX = 0
    const move = (e: MouseEvent) => {
      const r = area.getBoundingClientRect()
      xTo(e.clientX - r.left)
      yTo(e.clientY - r.top)
      if (!prefersReducedMotion()) rTo(Math.max(-8, Math.min(8, (e.clientX - lastX) * 0.4)))
      lastX = e.clientX
    }
    area.addEventListener('mousemove', move)
    return () => area.removeEventListener('mousemove', move)
  }, [])

  return (
    <div ref={root} className="pf-index" onMouseLeave={() => setHovered(null)}>
      <div className="pf-index__head" aria-hidden>
        <span>No.</span>
        <span>Project</span>
        <span>Location</span>
        <span>Category</span>
        <span>Year</span>
        <span />
      </div>
      <ol className="pf-index__rows" aria-label="Projects index">
        <AnimatePresence mode="popLayout">
          {items.map((p, i) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.05 }}
            >
              <Link
                to={`/portfolio/${p.slug}`}
                className={`pf-row${hovered && hovered !== p.slug ? ' is-dim' : ''}`}
                data-cursor="Open"
                onMouseEnter={() => setHovered(p.slug)}
                onFocus={() => setHovered(p.slug)}
                onBlur={() => setHovered(null)}
              >
                <span className="pf-row__num">{pad(indexOf(p))}</span>
                <span className="pf-row__thumb" aria-hidden>
                  <img src={img(p.cover, 240)} alt="" loading="lazy" />
                </span>
                <span className="pf-row__title serif">{p.title}</span>
                <span className="pf-row__loc muted">{p.location}</span>
                <span className="pf-row__cat">{p.category}</span>
                <span className="pf-row__year muted">{p.year}</span>
                <span className="pf-row__arrow" aria-hidden>
                  <ArrowUpRight size={20} strokeWidth={1.25} />
                </span>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
      <div ref={preview} className={`pf-preview${hovered ? ' is-visible' : ''}`} aria-hidden>
        <div className="pf-preview__frame">
          {items.map((p) => (
            <img key={p.slug} src={img(p.cover, 700)} alt="" className={p.slug === hovered ? 'is-active' : ''} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Portfolio() {
  useRefreshOnLoad()
  const [params, setParams] = useSearchParams()
  const raw = params.get('category')
  const active: Filter = (CATEGORIES as string[]).includes(raw ?? '') ? (raw as Filter) : 'All'
  const view: View = params.get('view') === 'list' ? 'list' : 'grid'

  const items = useMemo(() => (active === 'All' ? PROJECTS : PROJECTS.filter((p) => p.category === active)), [active])

  const update = (key: 'category' | 'view', value: string | null) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  // grid height changes after filtering — keep downstream triggers in sync
  useEffect(() => {
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 900)
    return () => window.clearTimeout(t)
  }, [active, view])

  const cities = useMemo(() => Array.from(new Set(PROJECTS.map((p) => p.location.split(',').pop()!.trim()))), [])

  return (
    <>
      {/* ---------- intro ---------- */}
      <header className="pf-hero">
        <div className="container">
          <motion.nav className="crumbs" aria-label="Breadcrumb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }}>
            <Link to="/">Home</Link>
            <span aria-hidden> / </span>
            <span aria-current="page">Portfolio</span>
          </motion.nav>

          <div className="pf-hero__grid">
            <div className="pf-hero__titlewrap">
              <motion.span className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1, ease: EASE }}>
                Portfolio · 2012 — {new Date().getFullYear()}
              </motion.span>
              <div className="pf-hero__title-row">
                <SplitText as="h1" text={'Selected\n*works*'} className="pf-hero__title" play delay={0.55} />
                <motion.span
                  className="pf-hero__count serif"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 1, ease: EASE }}
                  aria-label={`${PROJECTS.length} projects`}
                >
                  ({pad(PROJECTS.length)})
                </motion.span>
              </div>
            </div>
            <motion.div className="pf-hero__aside" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1.1, ease: EASE }}>
              <div className="pf-hero__thumb arch">
                <img src={img(IMG.bedroomChandelier, 600)} alt="Master suite with crystal chandelier by BBS Interior" />
              </div>
              <p className="lead">
                Homes, villas, kitchens and workspaces across India — each one drawn by hand, detailed in our studio and finished by our own craftsmen.
              </p>
            </motion.div>
          </div>
        </div>
      </header>

      {/* ---------- works ---------- */}
      <section className="pf-works" aria-label="Projects">
        <div className="container">
          <div className="pf-toolbar">
            <LayoutGroup id="pf-filters">
              <Filters active={active} onChange={(c) => update('category', c === 'All' ? null : c)} />
            </LayoutGroup>
            <div className="pf-toolbar__right">
              <p className="pf-showing muted" aria-live="polite">
                Showing <strong>{pad(items.length)}</strong> {items.length === 1 ? 'project' : 'projects'}
              </p>
              <div className="pf-views" role="group" aria-label="Layout">
                {(
                  [
                    ['grid', LayoutGrid, 'Grid'],
                    ['list', List, 'Index'],
                  ] as const
                ).map(([v, Icon, label]) => (
                  <button key={v} type="button" className={`pf-view${view === v ? ' is-active' : ''}`} aria-pressed={view === v} onClick={() => update('view', v === 'grid' ? null : v)}>
                    {view === v && <motion.span layoutId="pf-view-indicator" className="pf-view__bg" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
                    <Icon size={15} strokeWidth={1.4} aria-hidden />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {view === 'grid' ? <GridView items={items} /> : <ListView items={items} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ---------- numbers ---------- */}
      <section className="pf-numbers section--dark" aria-label="Studio in numbers">
        <Marquee items={['Residential', 'Villas', 'Kitchens', 'Bedrooms', 'Workspaces', ...cities]} className="pf-marquee" />
        <div className="container">
          <div className="pf-numbers__grid">
            <Reveal className="pf-numbers__intro">
              <span className="eyebrow">By the numbers</span>
              <p className="pf-numbers__title serif">
                Fourteen years, one <span className="italic">obsession</span> — rooms that feel effortless.
              </p>
            </Reveal>
            <dl className="pf-stats">
              {STATS.map((s, i) => (
                <Reveal key={s.label} className="pf-stat" delay={i * 0.08}>
                  <dt className="muted">{s.label}</dt>
                  <dd className="serif">
                    <Counter value={s.value} suffix={s.suffix} />
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <CTA title={'Your home could be\nour next *story*'} image={IMG.livingPendants} />
    </>
  )
}
