import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { EASE, EASE_IN_OUT, gsap, useGSAP, useLenis, useLoader, prefersReducedMotion } from '../lib/motion'
import { Magnetic } from './Effects'
import { img, NAV, SITE } from '../data/site'

/* ------------------------------------------------------------------ */
/* Preloader                                                           */
/* ------------------------------------------------------------------ */

export function Preloader() {
  const { ready, setReady } = useLoader()
  const lenis = useLenis()
  const [count, setCount] = useState(0)

  useEffect(() => {
    lenis?.stop()
    if (ready) lenis?.start()
  }, [lenis, ready])

  useEffect(() => {
    const total = prefersReducedMotion() ? 300 : 2300
    const start = performance.now()
    let raf = 0
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / total)
      // ease-out so the count settles gracefully
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100))
      if (p < 1) raf = requestAnimationFrame(step)
      else window.setTimeout(() => setReady(true), 350)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [setReady])

  const letters = 'BBS'.split('')

  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          className="preloader"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 1.1, ease: EASE_IN_OUT }}
          role="status"
          aria-label="Loading BBS Interior"
        >
          <div className="preloader__brand">
            <span className="preloader__word">
              {letters.map((l, i) => (
                <motion.span key={i} initial={{ y: '110%' }} animate={{ y: '0%' }} transition={{ delay: 0.15 + i * 0.09, duration: 1.1, ease: EASE }}>
                  {l}
                </motion.span>
              ))}
            </span>
            <motion.span className="preloader__sub italic" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1, ease: EASE }}>
              Interior
            </motion.span>
          </div>
          <div className="preloader__foot">
            <span>Spaces crafted with soul</span>
            <span className="preloader__count serif">{String(count).padStart(3, '0')}</span>
          </div>
          <div className="preloader__bar">
            <span style={{ transform: `scaleX(${count / 100})` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ */
/* Cursor — dot + trailing ring, labels on [data-cursor] elements.     */
/* ------------------------------------------------------------------ */

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const [hover, setHover] = useState(false)

  useEffect(() => {
    // elements are always rendered, so refs exist here; touch devices keep the native cursor
    if (!window.matchMedia('(pointer: fine)').matches || !dot.current || !ring.current) return

    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.55, ease: 'power3' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.55, ease: 'power3' })

    const move = (e: MouseEvent) => {
      // only hide the native cursor once the custom one is actually tracking
      document.documentElement.classList.add('has-cursor')
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      const labelled = t.closest<HTMLElement>('[data-cursor]')
      setLabel(labelled?.dataset.cursor ?? '')
      setHover(!!t.closest('a, button, input, select, textarea, [role="button"]'))
    }
    const leave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.3 })
    const enter = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 })

    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    document.documentElement.addEventListener('mouseleave', leave)
    document.documentElement.addEventListener('mouseenter', enter)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      document.documentElement.removeEventListener('mouseleave', leave)
      document.documentElement.removeEventListener('mouseenter', enter)
    }
  }, [])

  // clear label on navigation
  const { pathname } = useLocation()
  useEffect(() => setLabel(''), [pathname])

  return (
    <>
      <div ref={dot} className={`cursor-dot${label ? ' is-hidden' : ''}`} aria-hidden />
      <div ref={ring} className={`cursor-ring${hover ? ' is-hover' : ''}${label ? ' has-label' : ''}`} aria-hidden>
        <span>{label}</span>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Navbar + full-screen menu                                           */
/* ------------------------------------------------------------------ */

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const lenis = useLenis()
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (open) lenis?.stop()
    else lenis?.start()
    document.documentElement.classList.toggle('menu-open', open)
  }, [open, lenis])

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      setHidden(y > last && y > 240)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('nav-visible', scrolled && !hidden)
  }, [scrolled, hidden])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <header className={`nav${scrolled ? ' is-scrolled' : ''}${hidden && !open ? ' is-hidden' : ''}${open ? ' is-open' : ''}`}>
        <div className="nav__inner">
          <Link to="/" className="nav__logo" aria-label="BBS Interior — home">
            <span className="nav__logo-mark serif">BBS</span>
            <span className="nav__logo-word italic">Interior</span>
          </Link>

          <nav className="nav__links" aria-label="Primary">
            {NAV.slice(1).map((n) => (
              <NavLink key={n.to} to={n.to} className={({ isActive }) => `nav__link${isActive ? ' is-active' : ''}`}>
                <span data-text={n.label}>{n.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="nav__actions">
            <Magnetic strength={0.25} className="nav__cta-wrap">
              <Link to="/contact" className="btn nav__cta">
                Book consultation
              </Link>
            </Magnetic>
            <button className="nav__burger" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen((v) => !v)}>
              <span className="nav__burger-label">{open ? 'Close' : 'Menu'}</span>
              <span className="nav__burger-lines" aria-hidden>
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  )
}

function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [preview, setPreview] = useState(0)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="site-menu"
          className="menu"
          initial={{ clipPath: 'circle(0% at calc(100% - 60px) 44px)' }}
          animate={{ clipPath: 'circle(150% at calc(100% - 60px) 44px)' }}
          exit={{ clipPath: 'circle(0% at calc(100% - 60px) 44px)' }}
          transition={{ duration: 0.9, ease: EASE_IN_OUT }}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className="menu__inner container">
            <ul className="menu__list">
              {NAV.map((n, i) => (
                <li key={n.to} className="menu__item">
                  <motion.div initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '110%' }} transition={{ duration: 0.9, ease: EASE, delay: 0.25 + i * 0.06 }}>
                    <NavLink to={n.to} end={n.to === '/'} className="menu__link" onMouseEnter={() => setPreview(i)} onFocus={() => setPreview(i)} onClick={onClose}>
                      <span className="menu__num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="menu__label serif">{n.label}</span>
                    </NavLink>
                  </motion.div>
                </li>
              ))}
            </ul>
            <motion.div className="menu__preview arch" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.35 }}>
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={preview}
                  src={img(NAV[preview].image, 900)}
                  alt=""
                  initial={{ opacity: 0, scale: 1.15 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: EASE }}
                />
              </AnimatePresence>
            </motion.div>
            <motion.div className="menu__foot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.6 }}>
              <div>
                <span className="eyebrow">Say hello</span>
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                <a href={`tel:${SITE.phone.replace(/\s/g, '')}`}>{SITE.phone}</a>
              </div>
              <div className="menu__socials">
                {SITE.socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="link-line">
                    {s.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export function Footer() {
  const root = useRef<HTMLElement>(null)
  const lenis = useLenis()
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo('.footer__word span', { yPercent: 100 }, { yPercent: 0, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: '.footer__word', start: 'top bottom', end: 'bottom bottom', scrub: true } })
    },
    { scope: root },
  )

  return (
    <footer ref={root} className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__news">
            <h3 className="serif">
              Ideas, launches & <em>quiet inspiration</em> — once a month.
            </h3>
            {joined ? (
              <p className="footer__thanks">Thank you — see you in your inbox.</p>
            ) : (
              <form
                className="footer__form"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (/^\S+@\S+\.\S+$/.test(email)) setJoined(true)
                }}
              >
                <label className="visually-hidden" htmlFor="newsletter">
                  Email address
                </label>
                <input id="newsletter" type="email" required placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button type="submit" aria-label="Subscribe">
                  <ArrowUpRight size={20} strokeWidth={1.25} />
                </button>
              </form>
            )}
          </div>

          <div className="footer__cols">
            <div>
              <span className="eyebrow">Explore</span>
              <ul>
                {NAV.map((n) => (
                  <li key={n.to}>
                    <Link to={n.to}>{n.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="eyebrow">Studios</span>
              <ul>
                {SITE.studios.map((s) => (
                  <li key={s.city}>
                    <Link to="/contact">{s.city}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="eyebrow">Contact</span>
              <ul>
                <li>
                  <a href={`tel:${SITE.phone.replace(/\s/g, '')}`}>{SITE.phone}</a>
                </li>
                <li>
                  <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                </li>
                <li className="muted">{SITE.hours}</li>
              </ul>
            </div>
            <div>
              <span className="eyebrow">Follow</span>
              <ul>
                {SITE.socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer__word serif" aria-hidden>
          {'BBS Interior'.split('').map((c, i) => (
            <span key={i} className={c === ' ' ? 'footer__space' : i > 3 ? 'italic' : ''}>
              {c === ' ' ? ' ' : c}
            </span>
          ))}
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} BBS Interior Pvt. Ltd. All rights reserved.</span>
          <span>Designed with care in India</span>
          <button className="footer__top-btn" onClick={() => (lenis ? lenis.scrollTo(0, { duration: 2 }) : window.scrollTo({ top: 0, behavior: 'smooth' }))}>
            Back to top <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ */
/* PageTransition — curtain wipes between routes.                      */
/* ------------------------------------------------------------------ */

const TITLES: Record<string, string> = {
  '/': 'Home',
  '/about': 'Our Story',
  '/services': 'Services',
  '/portfolio': 'Portfolio',
  '/ideas': 'Design Ideas',
  '/contact': 'Contact',
  '/journal': 'Journal',
}

export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const key = '/' + (pathname.split('/')[1] ?? '')
  const title = TITLES[pathname] ?? TITLES[key] ?? 'BBS Interior'

  return (
    <>
      <motion.div
        className="curtain"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0, transition: { duration: 0.9, ease: EASE_IN_OUT, delay: 0.15 } }}
        exit={{ scaleY: 0 }}
        style={{ originY: 0 }}
        aria-hidden
      >
        <motion.span className="curtain__title serif italic" initial={{ opacity: 1 }} animate={{ opacity: 0, transition: { duration: 0.3 } }}>
          {title}
        </motion.span>
      </motion.div>
      <motion.div
        className="curtain curtain--exit"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1, transition: { duration: 0.7, ease: EASE_IN_OUT } }}
        style={{ originY: 1 }}
        aria-hidden
      />
      <motion.main
        id="main"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 1, ease: EASE, delay: 0.35 } }}
        exit={{ opacity: 0, y: -30, transition: { duration: 0.6, ease: EASE_IN_OUT } }}
      >
        {children}
      </motion.main>
    </>
  )
}
