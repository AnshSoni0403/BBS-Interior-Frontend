import { createContext, useContext, useEffect, useState, type ElementType, type ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export { gsap, ScrollTrigger, useGSAP }

export const EASE = [0.22, 1, 0.36, 1] as const
export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ------------------------------------------------------------------ */
/* Smooth scroll (Lenis driven by the GSAP ticker)                     */
/* ------------------------------------------------------------------ */

const LenisContext = createContext<Lenis | null>(null)
export const useLenis = () => useContext(LenisContext)

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const instance = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    instance.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    setLenis(instance)
    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

/** Jump to top instantly — used between page transitions. */
export function resetScroll(lenis: Lenis | null) {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo(0, 0)
}

/* ------------------------------------------------------------------ */
/* Loader state — hero animations wait until the preloader is gone.    */
/* ------------------------------------------------------------------ */

const LoaderContext = createContext<{ ready: boolean; setReady: (v: boolean) => void }>({
  ready: true,
  setReady: () => {},
})

export function LoaderProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  return <LoaderContext.Provider value={{ ready, setReady }}>{children}</LoaderContext.Provider>
}

export const useLoader = () => useContext(LoaderContext)

/* ------------------------------------------------------------------ */
/* Reveal — fade/slide up when scrolled into view.                     */
/* ------------------------------------------------------------------ */

interface RevealProps {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'article' | 'span' | 'p'
}

export function Reveal({ children, delay = 0, y = 40, className, as = 'div' }: RevealProps) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/* SplitText — words rise out of a mask, staggered.                    */
/* Use `*word*` in text to italicise a word in the display serif.      */
/* `\n` forces a line break.                                           */
/* ------------------------------------------------------------------ */

const wordVariants: Variants = {
  hidden: { y: '110%', rotate: 4 },
  show: (i: number) => ({ y: '0%', rotate: 0, transition: { duration: 1.1, ease: EASE, delay: i * 0.06 } }),
}

interface SplitTextProps {
  text: string
  as?: ElementType
  className?: string
  delay?: number
  /** when provided, animation waits for this to be true instead of scroll-in-view */
  play?: boolean
  id?: string
}

export function SplitText({ text, as: Tag = 'h2', className, delay = 0, play, id }: SplitTextProps) {
  const lines = text.split('\n')
  let index = 0
  let inItalic = false
  const controlled = play !== undefined
  const label = text.replace(/\*/g, '').replace(/\n/g, ' ')

  return (
    <Tag id={id} className={className} aria-label={label}>
      <motion.span
        aria-hidden
        style={{ display: 'block' }}
        initial="hidden"
        {...(controlled ? { animate: play ? 'show' : 'hidden' } : { whileInView: 'show', viewport: { once: true, margin: '0px 0px -10% 0px' } })}
      >
        {lines.map((line, li) => (
          <span key={li} style={{ display: 'block' }}>
            {line.split(' ').filter(Boolean).map((raw, wi) => {
              // `*a b c*` italicises a whole phrase; markers may sit on different words
              if (raw.startsWith('*')) inItalic = true
              const italic = inItalic
              if (raw.endsWith('*')) inItalic = false
              const word = raw.replace(/^\*|\*$/g, '')
              const i = index++
              return (
                <span key={wi} className="split-mask">
                  <motion.span
                    className={`split-word${italic ? ' italic' : ''}`}
                    variants={wordVariants}
                    custom={i + delay / 0.06}
                  >
                    {word}
                  </motion.span>
                  {' '}
                </span>
              )
            })}
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}

/** Refresh ScrollTrigger once images on the page have loaded (layout shifts). */
export function useRefreshOnLoad() {
  useEffect(() => {
    const imgs = Array.from(document.images).filter((i) => !i.complete)
    let pending = imgs.length
    const done = () => {
      pending -= 1
      if (pending <= 0) ScrollTrigger.refresh()
    }
    imgs.forEach((i) => {
      i.addEventListener('load', done, { once: true })
      i.addEventListener('error', done, { once: true })
    })
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 1200)
    return () => window.clearTimeout(t)
  }, [])
}
