import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { EASE, gsap, useGSAP, useLoader, useRefreshOnLoad, prefersReducedMotion } from '../lib/motion'
import { Magnetic } from '../components/Effects'
import { img, IMG } from '../data/site'
import '../styles/pages/contact.css'

interface NotFoundProps {
  line?: string
  text?: string
  secondary?: { label: string; to: string }
}

export default function NotFound({
  line = 'This room hasn’t been designed yet.',
  text = 'The page you were looking for has moved, or never existed. Let us walk you back somewhere beautiful.',
  secondary = { label: 'View portfolio', to: '/portfolio' },
}: NotFoundProps) {
  useRefreshOnLoad()
  const root = useRef<HTMLElement>(null)
  const { ready } = useLoader()

  useGSAP(
    () => {
      if (prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return
      const layers = gsap.utils.toArray<HTMLElement>('[data-depth]')
      const setters = layers.map((el) => ({
        depth: Number(el.dataset.depth),
        x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3' }),
        y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3' }),
      }))
      const move = (e: MouseEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5
        const ny = e.clientY / window.innerHeight - 0.5
        setters.forEach((s) => {
          s.x(nx * s.depth)
          s.y(ny * s.depth)
        })
      }
      window.addEventListener('mousemove', move)
      gsap.to('.nf-orbit', { rotate: 360, duration: 40, ease: 'none', repeat: -1 })
      return () => window.removeEventListener('mousemove', move)
    },
    { scope: root },
  )

  const rise = (d: number) => ({
    initial: { y: '105%' },
    animate: ready ? { y: '0%' } : { y: '105%' },
    transition: { duration: 1.3, ease: EASE, delay: d },
  })

  return (
    <section ref={root} className="nf">
      <div className="container nf__inner">
        <motion.span className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ delay: 0.3, duration: 1 }}>
          Error 404 · Page not found
        </motion.span>

        <h1 className="nf__digits" aria-label="404">
          <span className="nf__mask" aria-hidden data-depth="-18">
            <motion.span className="nf__digit" {...rise(0.35)}>
              4
            </motion.span>
          </span>
          <span className="nf__zero" aria-hidden data-depth="30">
            <motion.span
              className="nf__zero-frame arch"
              initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
              animate={{ clipPath: ready ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)' }}
              transition={{ duration: 1.5, ease: EASE, delay: 0.5 }}
            >
              <img src={img(IMG.emptyRoom, 700)} alt="" />
            </motion.span>
            <span className="nf__zero-word italic">0</span>
            <svg className="nf-orbit" viewBox="0 0 200 200" aria-hidden>
              <defs>
                <path id="nf-circle" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
              </defs>
              <text>
                <textPath href="#nf-circle">BBS Interior · Spaces crafted with soul · </textPath>
              </text>
            </svg>
          </span>
          <span className="nf__mask" aria-hidden data-depth="-18">
            <motion.span className="nf__digit" {...rise(0.45)}>
              4
            </motion.span>
          </span>
        </h1>

        <motion.div
          className="nf__copy"
          initial={{ opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.9 }}
        >
          <p className="nf__line serif">{line}</p>
          <p className="muted">{text}</p>
          <div className="nf__actions">
            <Magnetic>
              <Link to="/" className="btn">
                Back to home <ArrowUpRight size={16} strokeWidth={1.5} />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link to={secondary.to} className="btn btn--ghost">
                {secondary.label} <ArrowUpRight size={16} strokeWidth={1.5} />
              </Link>
            </Magnetic>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
