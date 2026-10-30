import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { animate, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '../lib/motion'
import { img } from '../data/site'

/* ------------------------------------------------------------------ */
/* Magnetic — child is pulled toward the cursor.                       */
/* ------------------------------------------------------------------ */

export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia('(pointer: fine)').matches) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' })
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
    return () => {
      el.removeEventListener('mousemove', move)
      el.removeEventListener('mouseleave', leave)
    }
  }, [strength])

  return (
    <div ref={ref} className={className} style={{ display: 'inline-block' }}>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* ParallaxImage — image drifts inside its frame; optional clip reveal */
/* ------------------------------------------------------------------ */

interface ParallaxImageProps {
  src: string
  alt: string
  className?: string
  /** drift amount in percent */
  speed?: number
  reveal?: boolean
  width?: number
  cursor?: string
}

export function ParallaxImage({ src, alt, className = '', speed = 12, reveal = true, width = 1600, cursor }: ParallaxImageProps) {
  const frame = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const image = frame.current!.querySelector('img')
      gsap.fromTo(
        image,
        { yPercent: -speed },
        { yPercent: speed, ease: 'none', scrollTrigger: { trigger: frame.current, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
      if (reveal) {
        gsap.fromTo(
          frame.current,
          { clipPath: 'inset(18% 10% 18% 10%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: frame.current, start: 'top 88%' } },
        )
      }
    },
    { scope: frame },
  )

  return (
    <div ref={frame} className={`parallax ${className}`} data-cursor={cursor}>
      <img src={src.startsWith('http') ? src : img(src, width)} alt={alt} loading="lazy" style={{ transform: `scale(${1 + (speed * 2.4) / 100})` }} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Marquee — infinite strip that speeds up & reverses with scroll.     */
/* ------------------------------------------------------------------ */

export function Marquee({ items, className = '', separator = '✦' }: { items: string[]; className?: string; separator?: string }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const tween = gsap.to('.marquee__track', { xPercent: -50, ease: 'none', duration: 38, repeat: -1 })
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const boost = Math.min(Math.abs(self.getVelocity()) / 300, 6)
          gsap.to(tween, { timeScale: self.direction * (1 + boost), duration: 0.4, overwrite: true })
          gsap.to(tween, { timeScale: self.direction, duration: 1.2, delay: 0.4 })
        },
      })
    },
    { scope: root },
  )

  const row = (
    <>
      {items.map((t) => (
        <span key={t} className="marquee__item">
          {t}
          <span className="marquee__sep" aria-hidden>
            {separator}
          </span>
        </span>
      ))}
    </>
  )

  return (
    <div ref={root} className={`marquee ${className}`} aria-label={items.join(', ')}>
      <div className="marquee__track" aria-hidden>
        {row}
        {row}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* BeforeAfter — drag (or keyboard) to compare.                        */
/* ------------------------------------------------------------------ */

interface BeforeAfterProps {
  before: string
  after: string
  beforeLabel?: string
  afterLabel?: string
  className?: string
}

export function BeforeAfter({ before, after, beforeLabel = 'Before', afterLabel = 'After', className = '' }: BeforeAfterProps) {
  const [pos, setPos] = useState(50)
  const box = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const update = (clientX: number) => {
    const r = box.current!.getBoundingClientRect()
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)))
  }

  return (
    <div
      ref={box}
      className={`ba ${className}`}
      data-cursor="Drag"
      onPointerDown={(e) => {
        dragging.current = true
        ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
        update(e.clientX)
      }}
      onPointerMove={(e) => dragging.current && update(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <img className="ba__img" src={img(after, 1800)} alt={afterLabel} draggable={false} />
      <div className="ba__before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img className="ba__img" src={img(before, 1800)} alt={beforeLabel} draggable={false} />
      </div>
      <span className="ba__label ba__label--l">{beforeLabel}</span>
      <span className="ba__label ba__label--r">{afterLabel}</span>
      <div className="ba__handle" style={{ left: `${pos}%` }} aria-hidden>
        <span className="ba__knob">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </span>
      </div>
      <input
        className="ba__range"
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Compare before and after"
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Counter — counts up once in view.                                   */
/* ------------------------------------------------------------------ */

export function Counter({ value, suffix = '', className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })

  useEffect(() => {
    if (!inView || !ref.current) return
    const node = ref.current
    const controls = animate(0, value, {
      duration: 2.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => (node.textContent = Math.round(v).toLocaleString('en-IN') + suffix),
    })
    return () => controls.stop()
  }, [inView, value, suffix])

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* ScrollText — words light up one by one as you scroll.               */
/* ------------------------------------------------------------------ */

export function ScrollText({ text, className = '' }: { text: string; className?: string }) {
  const root = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        '.st-word',
        { opacity: 0.14 },
        { opacity: 1, stagger: 0.08, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'bottom 45%', scrub: true } },
      )
    },
    { scope: root },
  )

  return (
    <p ref={root} className={`scroll-text ${className}`}>
      {(() => {
        let inItalic = false
        return text.split(' ').map((w, i) => {
          if (w.startsWith('*')) inItalic = true
          const italic = inItalic
          if (/\*[.,;:!?—]*$/.test(w)) inItalic = false
          return (
            <span key={i} className={`st-word${italic ? ' italic brass' : ''}`}>
              {w.replace(/\*/g, '')}{' '}
            </span>
          )
        })
      })()}
    </p>
  )
}

/* ------------------------------------------------------------------ */
/* HorizontalGallery — pinned section scrolling sideways (desktop).    */
/* Falls back to native swipe with scroll-snap on small screens.       */
/* ------------------------------------------------------------------ */

export interface HItem {
  to: string
  image: string
  title: string
  meta: string
  index?: string
}

export function HorizontalGallery({ items, heading }: { items: HItem[]; heading: ReactNode }) {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const distance = () => track.current!.scrollWidth - window.innerWidth
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(bar.current, { scaleX: self.progress }),
          },
        })
        // images counter-drift inside their frames for depth
        gsap.utils.toArray<HTMLElement>('.hg__img img').forEach((el) => {
          gsap.fromTo(el, { xPercent: -8 }, { xPercent: 8, ease: 'none', scrollTrigger: { trigger: el.parentElement, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } })
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} className="hg">
      <div ref={track} className="hg__track">
        <div className="hg__intro">{heading}</div>
        {items.map((it, i) => (
          <Link key={it.to} to={it.to} className="hg__card" data-cursor="View">
            <div className="hg__img">
              <img src={img(it.image, 1400)} alt={it.title} loading="lazy" />
            </div>
            <div className="hg__meta">
              <span className="hg__index">{it.index ?? String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>{it.title}</h3>
                <p className="muted">{it.meta}</p>
              </div>
              <ArrowUpRight className="hg__arrow" size={22} strokeWidth={1.25} />
            </div>
          </Link>
        ))}
        <div className="hg__end">
          <Link to="/portfolio" className="hg__all" data-cursor="Explore">
            <span className="italic">All</span>
            <span>projects</span>
            <ArrowUpRight size={34} strokeWidth={1} />
          </Link>
        </div>
      </div>
      <div className="hg__progress" aria-hidden>
        <div ref={bar} className="hg__bar" />
      </div>
    </section>
  )
}
