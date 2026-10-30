import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Plus } from 'lucide-react'
import { EASE, Reveal, SplitText, gsap, useGSAP, prefersReducedMotion } from '../lib/motion'
import { Magnetic, ParallaxImage } from './Effects'
import { img, IMG } from '../data/site'
import { FAQS, PROCESS, TESTIMONIALS } from '../data/content'
import type { Project } from '../data/projects'

/* ------------------------------------------------------------------ */
/* PageHero — inner-page header with split title & parallax image.     */
/* ------------------------------------------------------------------ */

interface PageHeroProps {
  eyebrow: string
  title: string
  intro?: string
  image?: string
  crumbs?: { label: string; to?: string }[]
}

export function PageHero({ eyebrow, title, intro, image, crumbs }: PageHeroProps) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion() || !image) return
      gsap.to('.page-hero__media', {
        scale: 0.92,
        borderRadius: '28px',
        ease: 'none',
        scrollTrigger: { trigger: '.page-hero__media', start: 'top 60%', end: 'bottom top', scrub: true },
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className="page-hero">
      <div className="container">
        {crumbs && (
          <motion.nav className="crumbs" aria-label="Breadcrumb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }}>
            <Link to="/">Home</Link>
            {crumbs.map((c) => (
              <span key={c.label}>
                <span aria-hidden> / </span>
                {c.to ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
              </span>
            ))}
          </motion.nav>
        )}
        <div className="page-hero__head">
          <motion.span className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1, ease: EASE }}>
            {eyebrow}
          </motion.span>
          <SplitText as="h1" text={title} className="page-hero__title" play delay={0.55} />
          {intro && (
            <motion.p className="lead page-hero__intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1.1, ease: EASE }}>
              {intro}
            </motion.p>
          )}
        </div>
      </div>
      {image && (
        <div className="container">
          <motion.div
            className="page-hero__media"
            initial={{ clipPath: 'inset(30% 12% 0% 12%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            transition={{ duration: 1.6, ease: EASE, delay: 0.7 }}
          >
            <ParallaxImage src={image} alt={title.replace(/\*/g, '')} reveal={false} speed={10} width={2200} />
          </motion.div>
        </div>
      )}
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* SectionHead                                                         */
/* ------------------------------------------------------------------ */

export function SectionHead({ eyebrow, title, intro, action, center }: { eyebrow: string; title: string; intro?: string; action?: ReactNode; center?: boolean }) {
  return (
    <div className={`section-head${center ? ' section-head--center' : ''}`}>
      <div>
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
        <SplitText text={title} className="section-head__title" />
      </div>
      {(intro || action) && (
        <Reveal className="section-head__side" delay={0.15}>
          {intro && <p className="lead">{intro}</p>}
          {action}
        </Reveal>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* CTA — dark closing band with magnetic round button.                 */
/* ------------------------------------------------------------------ */

export function CTA({ title = 'Let’s design a home\nthat feels like *you*', image = IMG.livingLuxe }: { title?: string; image?: string }) {
  return (
    <section className="cta section--dark">
      <div className="cta__bg">
        <ParallaxImage src={image} alt="" reveal={false} speed={14} width={2200} />
      </div>
      <div className="container cta__inner">
        <Reveal>
          <span className="eyebrow">Free design consultation</span>
        </Reveal>
        <SplitText text={title} className="cta__title" />
        <div className="cta__row">
          <Reveal delay={0.2}>
            <p className="lead">Meet our designers at the studio, at your site or over video. Walk away with ideas, a layout and an honest estimate — no obligation.</p>
          </Reveal>
          <Magnetic strength={0.4}>
            <Link to="/contact" className="cta__circle" data-cursor="Book">
              <span>Book a visit</span>
              <ArrowUpRight size={28} strokeWidth={1.2} />
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Testimonials — cross-fading editorial quotes.                       */
/* ------------------------------------------------------------------ */

export function Testimonials() {
  const [i, setI] = useState(0)
  const n = TESTIMONIALS.length
  const t = TESTIMONIALS[i]

  useEffect(() => {
    const id = window.setTimeout(() => setI((v) => (v + 1) % n), 7000)
    return () => window.clearTimeout(id)
  }, [i, n])

  return (
    <section className="section testimonials">
      <div className="container">
        <div className="testimonials__grid">
          <Reveal className="testimonials__side">
            <span className="eyebrow">Kind words</span>
            <p className="testimonials__count serif">
              <span>{String(i + 1).padStart(2, '0')}</span> / {String(n).padStart(2, '0')}
            </p>
            <div className="testimonials__nav">
              <button className="icon-btn" aria-label="Previous testimonial" onClick={() => setI((i - 1 + n) % n)}>
                <ArrowLeft size={18} strokeWidth={1.25} />
              </button>
              <button className="icon-btn" aria-label="Next testimonial" onClick={() => setI((i + 1) % n)}>
                <ArrowRight size={18} strokeWidth={1.25} />
              </button>
            </div>
          </Reveal>
          <div className="testimonials__main" aria-live="polite">
            <span className="testimonials__mark serif" aria-hidden>
              “
            </span>
            <AnimatePresence mode="wait">
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
                transition={{ duration: 0.8, ease: EASE }}
              >
                <blockquote className="testimonials__quote serif">{t.quote}</blockquote>
                <figcaption className="testimonials__author">
                  <img src={img(t.avatar, 160, 160)} alt="" />
                  <div>
                    <strong>{t.name}</strong>
                    <span className="muted">{t.role}</span>
                  </div>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
            <div className="testimonials__progress" aria-hidden>
              <motion.span key={i} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 7, ease: 'linear' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Accordion (FAQ)                                                     */
/* ------------------------------------------------------------------ */

export function Accordion({ items = FAQS }: { items?: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="accordion">
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <Reveal key={it.q} className={`accordion__item${isOpen ? ' is-open' : ''}`} delay={i * 0.05}>
            <button className="accordion__q" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
              <span className="accordion__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="serif">{it.q}</span>
              <Plus className="accordion__icon" size={22} strokeWidth={1.2} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  className="accordion__a"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  <p className="muted">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Reveal>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* ProjectCard                                                         */
/* ------------------------------------------------------------------ */

export function ProjectCard({ project, className = '' }: { project: Project; className?: string }) {
  return (
    <Link to={`/portfolio/${project.slug}`} className={`project-card ${className}`} data-cursor="View">
      <div className="project-card__media">
        <img src={img(project.cover, 1200)} alt={project.title} loading="lazy" />
        <span className="project-card__tag">{project.category}</span>
      </div>
      <div className="project-card__body">
        <div>
          <h3>{project.title}</h3>
          <p className="muted">
            {project.location} · {project.year}
          </p>
        </div>
        <span className="project-card__arrow" aria-hidden>
          <ArrowUpRight size={20} strokeWidth={1.25} />
        </span>
      </div>
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/* Process — sticky heading + image, steps scroll past with progress.  */
/* ------------------------------------------------------------------ */

export function Process({ steps = PROCESS }: { steps?: typeof PROCESS }) {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('.process__step').forEach((el, i) => {
        gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 60%', end: 'bottom 60%', onToggle: (s) => s.isActive && setActive(i) } })
      })
      if (prefersReducedMotion()) return
      gsap.fromTo('.process__line-fill', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.process__steps', start: 'top 60%', end: 'bottom 60%', scrub: true } })
    },
    { scope: root },
  )

  return (
    <section ref={root} className="section process">
      <div className="container process__grid">
        <div className="process__sticky">
          <span className="eyebrow">How we work</span>
          <SplitText text={'Five calm steps\nto your *new home*'} className="process__title" />
          <div className="process__visual arch">
            <AnimatePresence mode="popLayout">
              <motion.img
                key={active}
                src={img(steps[active].image, 1000)}
                alt={steps[active].title}
                initial={{ opacity: 0, scale: 1.12 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: EASE }}
              />
            </AnimatePresence>
          </div>
        </div>
        <div className="process__track">
        <span className="process__line" aria-hidden>
          <span className="process__line-fill" />
        </span>
        <ol className="process__steps">
          {steps.map((s, i) => (
            <li key={s.title} className={`process__step${i === active ? ' is-active' : ''}`}>
              <span className="process__num serif">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>{s.title}</h3>
                <p className="muted">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* HoverList — rows reveal a floating image that trails the cursor.    */
/* ------------------------------------------------------------------ */

export interface HoverRow {
  title: string
  text: string
  image: string
  to: string
}

export function HoverList({ rows }: { rows: HoverRow[] }) {
  const root = useRef<HTMLDivElement>(null)
  const float = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  useEffect(() => {
    const el = float.current
    const area = root.current
    if (!el || !area || !window.matchMedia('(pointer: fine)').matches) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3' })
    const move = (e: MouseEvent) => {
      const r = area.getBoundingClientRect()
      xTo(e.clientX - r.left)
      yTo(e.clientY - r.top)
    }
    area.addEventListener('mousemove', move)
    return () => area.removeEventListener('mousemove', move)
  }, [])

  return (
    <div ref={root} className="hover-list" onMouseLeave={() => setHovered(null)}>
      {rows.map((r, i) => (
        <Reveal key={r.title} delay={i * 0.05}>
          <Link
            to={r.to}
            className={`hover-list__row${hovered !== null && hovered !== i ? ' is-dim' : ''}`}
            onMouseEnter={() => setHovered(i)}
            onFocus={() => setHovered(i)}
          >
            <span className="hover-list__num">{String(i + 1).padStart(2, '0')}</span>
            <span className="hover-list__title serif">{r.title}</span>
            <span className="hover-list__text muted">{r.text}</span>
            <span className="hover-list__arrow" aria-hidden>
              <ArrowUpRight size={22} strokeWidth={1.25} />
            </span>
          </Link>
        </Reveal>
      ))}
      <div ref={float} className={`hover-list__float${hovered !== null ? ' is-visible' : ''}`} aria-hidden>
        {rows.map((r, i) => (
          <img key={r.title} src={img(r.image, 700)} alt="" className={i === hovered ? 'is-active' : ''} />
        ))}
      </div>
    </div>
  )
}
