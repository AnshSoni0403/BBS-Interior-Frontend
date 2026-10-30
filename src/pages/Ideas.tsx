import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import { EASE, Reveal, ScrollTrigger, gsap, useGSAP, useLenis, useRefreshOnLoad, prefersReducedMotion } from '../lib/motion'
import { CTA, PageHero, SectionHead } from '../components/Sections'
import { ParallaxImage } from '../components/Effects'
import { img, IMG } from '../data/site'
import { IDEAS, POSTS, ROOMS, type Room } from '../data/content'
import '../styles/pages/ideas.css'

type Filter = 'All' | Room
type Idea = (typeof IDEAS)[number]

/** "14 Sep 2026" — en-IN, with a guaranteed three-letter month. */
export function formatDate(iso: string) {
  const parts = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).formatToParts(new Date(`${iso}T00:00:00`))
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  return `${get('day')} ${get('month').slice(0, 3)} ${get('year')}`
}

const RATIOS = ['4 / 5', '1 / 1', '3 / 4', '5 / 4', '2 / 3', '4 / 3']

function useColumns() {
  const calc = () => (typeof window === 'undefined' ? 3 : window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3)
  const [cols, setCols] = useState(calc)
  useEffect(() => {
    const onResize = () => setCols(calc())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return cols
}

/* ------------------------------------------------------------------ */
/* Lightbox                                                            */
/* ------------------------------------------------------------------ */

function Lightbox({ items, index, onClose, onIndex }: { items: Idea[]; index: number; onClose: () => void; onIndex: (i: number) => void }) {
  const dialog = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const [dir, setDir] = useState(1)
  const n = items.length
  const item = items[index]

  const go = useCallback(
    (step: number) => {
      setDir(step)
      onIndex((index + step + n) % n)
    },
    [index, n, onIndex],
  )

  useEffect(() => {
    closeBtn.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'Tab' && dialog.current) {
        const f = Array.from(dialog.current.querySelectorAll<HTMLElement>('button, a[href]'))
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, onClose])

  return (
    <motion.div
      ref={dialog}
      className="ideas-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} — ${item.room} idea, ${index + 1} of ${n}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      data-lenis-prevent
    >
      <div className="ideas-lightbox__top">
        <span className="ideas-lightbox__count serif" aria-live="polite">
          <span>{String(index + 1).padStart(2, '0')}</span> / {String(n).padStart(2, '0')}
        </span>
        <button ref={closeBtn} className="ideas-lightbox__btn" onClick={onClose} aria-label="Close gallery">
          <X size={20} strokeWidth={1.25} />
        </button>
      </div>

      <div className="ideas-lightbox__stage" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.figure
            key={item.image}
            className="ideas-lightbox__figure"
            custom={dir}
            initial={{ opacity: 0, x: dir * 80, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: dir * -80, scale: 0.96 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <img src={img(item.image, 1800)} alt={`${item.title} — ${item.room} interior by BBS Interior`} />
            <figcaption>
              <span className="eyebrow">{item.room}</span>
              <span className="serif">{item.title}</span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <button className="ideas-lightbox__btn ideas-lightbox__nav ideas-lightbox__nav--prev" onClick={() => go(-1)} aria-label="Previous image">
        <ChevronLeft size={22} strokeWidth={1.25} />
      </button>
      <button className="ideas-lightbox__btn ideas-lightbox__nav ideas-lightbox__nav--next" onClick={() => go(1)} aria-label="Next image">
        <ChevronRight size={22} strokeWidth={1.25} />
      </button>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Ideas() {
  useRefreshOnLoad()
  const root = useRef<HTMLDivElement>(null)
  const lenis = useLenis()
  const cols = useColumns()
  const [params, setParams] = useSearchParams()
  const raw = params.get('room')
  const active: Filter = raw && (ROOMS as readonly string[]).includes(raw) ? (raw as Room) : 'All'

  const [open, setOpen] = useState<number | null>(null)
  const lastFocus = useRef<HTMLElement | null>(null)

  const filtered = useMemo(() => (active === 'All' ? IDEAS : IDEAS.filter((i) => i.room === active)), [active])
  const counts = useMemo(() => {
    const c: Record<string, number> = { All: IDEAS.length }
    ROOMS.forEach((r) => (c[r] = IDEAS.filter((i) => i.room === r).length))
    return c
  }, [])

  const columns = useMemo(() => {
    const out: { item: Idea; index: number }[][] = Array.from({ length: cols }, () => [])
    filtered.forEach((item, index) => out[index % cols].push({ item, index }))
    return out
  }, [filtered, cols])

  const select = (f: Filter) => {
    if (f === active) return
    setParams(f === 'All' ? {} : { room: f }, { replace: true, preventScrollReset: true })
  }

  // layout height changes after a filter — let pinned/scrubbed triggers recompute
  useEffect(() => {
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 900)
    return () => window.clearTimeout(t)
  }, [active, cols])

  // deep link: /ideas#journal scrolls to the journal once the page has settled
  const { hash } = useLocation()
  useEffect(() => {
    if (hash !== '#journal') return
    const t = window.setTimeout(() => {
      const el = document.getElementById('journal')
      if (!el) return
      if (lenis) lenis.scrollTo(el, { offset: -40 })
      else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    }, 900)
    return () => window.clearTimeout(t)
  }, [hash, lenis])

  // lock scroll while the lightbox is open
  useEffect(() => {
    if (open === null) return
    lenis?.stop()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      lenis?.start()
      document.body.style.overflow = prev
    }
  }, [open, lenis])

  const openAt = (i: number) => {
    lastFocus.current = document.activeElement as HTMLElement
    setOpen(i)
  }
  const close = useCallback(() => {
    setOpen(null)
    requestAnimationFrame(() => lastFocus.current?.focus())
  }, [])

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        '.ideas-journal__row',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.ideas-journal__list', start: 'top 85%' } },
      )
    },
    { scope: root },
  )

  const [featured, ...rest] = POSTS

  return (
    <div ref={root} className="ideas">
      <PageHero
        eyebrow="Design ideas"
        title={'Rooms to *dream* in,\nideas to steal'}
        intro="A living library of spaces we have designed across India — browse by room, save what speaks to you and bring it to your first consultation."
        crumbs={[{ label: 'Design Ideas' }]}
      />

      {/* -------- sticky room filter -------- */}
      <div className="ideas-tabs">
        <div className="container">
          <div className="ideas-tabs__scroller" role="tablist" aria-label="Filter ideas by room">
            {(['All', ...ROOMS] as Filter[]).map((f) => {
              const isActive = f === active
              return (
                <button
                  key={f}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="ideas-gallery"
                  className={`ideas-tabs__tab${isActive ? ' is-active' : ''}`}
                  onClick={() => select(f)}
                >
                  <span>{f}</span>
                  <sup>{String(counts[f]).padStart(2, '0')}</sup>
                  {isActive && <motion.span layoutId="ideas-tab-line" className="ideas-tabs__line" transition={{ duration: 0.6, ease: EASE }} />}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* -------- masonry gallery -------- */}
      <section className="ideas-gallery" id="ideas-gallery" role="tabpanel" aria-label={`${active} ideas`}>
        <div className="container">
          <p className="ideas-gallery__meta muted" aria-live="polite">
            Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? 'idea' : 'ideas'}
            {active !== 'All' && <> for <em>{active.toLowerCase()}</em></>}
          </p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${active}-${cols}`}
              className="ideas-masonry"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
              exit={{ opacity: 0, y: 24, filter: 'blur(6px)', transition: { duration: 0.35, ease: EASE } }}
            >
              {columns.map((col, ci) => (
                <div key={ci} className="ideas-masonry__col">
                  {col.map(({ item, index }, ri) => (
                    <motion.figure
                      key={item.image}
                      className="ideas-card"
                      initial={{ opacity: 0, y: 60, clipPath: 'inset(12% 6% 0% 6%)' }}
                      whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
                      viewport={{ once: true, margin: '0px 0px -6% 0px' }}
                      transition={{ duration: 1.1, ease: EASE, delay: Math.min(ri * 0.08 + ci * 0.07, 0.45) }}
                    >
                      <button
                        className="ideas-card__btn"
                        style={{ aspectRatio: RATIOS[(index + ci) % RATIOS.length] }}
                        onClick={() => openAt(index)}
                        data-cursor="Open"
                        aria-label={`Open ${item.title}, ${item.room}`}
                      >
                        <img src={img(item.image, 900)} alt={`${item.title} — ${item.room} design`} loading="lazy" />
                        <span className="ideas-card__overlay" aria-hidden>
                          <span className="ideas-card__expand">
                            <Expand size={16} strokeWidth={1.25} />
                          </span>
                          <span className="ideas-card__caption">
                            <span className="eyebrow">{item.room}</span>
                            <span className="serif">{item.title}</span>
                          </span>
                        </span>
                      </button>
                    </motion.figure>
                  ))}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <AnimatePresence>{open !== null && filtered[open] && <Lightbox items={filtered} index={open} onClose={close} onIndex={setOpen} />}</AnimatePresence>

      {/* -------- journal -------- */}
      <section className="section section--paper ideas-journal" id="journal">
        <div className="container">
          <SectionHead
            eyebrow="The journal"
            title={'Notes from\nthe *studio*'}
            intro="Practical guides, material stories and the small decisions that make a home feel finished."
          />

          <Reveal>
            <Link to={`/journal/${featured.slug}`} className="ideas-feature" data-cursor="Read">
              <div className="ideas-feature__media arch">
                <ParallaxImage src={featured.cover} alt={featured.title} speed={8} width={1600} />
              </div>
              <div className="ideas-feature__body">
                <span className="ideas-feature__badge">Featured</span>
                <p className="ideas-meta">
                  <span>{featured.category}</span>
                  <span aria-hidden>·</span>
                  <time dateTime={featured.date}>{formatDate(featured.date)}</time>
                  <span aria-hidden>·</span>
                  <span>{featured.readTime} read</span>
                </p>
                <h3 className="ideas-feature__title">{featured.title}</h3>
                <p className="lead">{featured.excerpt}</p>
                <span className="link-line">
                  Read the story <ArrowUpRight size={16} strokeWidth={1.25} />
                </span>
              </div>
            </Link>
          </Reveal>

          <ul className="ideas-journal__list">
            {rest.map((p, i) => (
              <li key={p.slug} className="ideas-journal__row">
                <Link to={`/journal/${p.slug}`} className="ideas-post" data-cursor="Read">
                  <span className="ideas-post__num serif">{String(i + 2).padStart(2, '0')}</span>
                  <span className="ideas-post__thumb">
                    <img src={img(p.cover, 600)} alt="" loading="lazy" />
                  </span>
                  <span className="ideas-post__main">
                    <span className="ideas-meta">
                      <span>{p.category}</span>
                      <span aria-hidden>·</span>
                      <time dateTime={p.date}>{formatDate(p.date)}</time>
                    </span>
                    <span className="ideas-post__title serif">{p.title}</span>
                    <span className="ideas-post__excerpt muted">{p.excerpt}</span>
                  </span>
                  <span className="ideas-post__arrow" aria-hidden>
                    <ArrowUpRight size={22} strokeWidth={1.25} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTA title={'Seen something\nyou *love*?'} image={IMG.diningGreen} />
    </div>
  )
}
