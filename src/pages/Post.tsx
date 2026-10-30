import { Fragment, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Check, Link2, Mail, MessageCircle } from 'lucide-react'
import { EASE, Reveal, SplitText, gsap, useGSAP, useLoader, useRefreshOnLoad, prefersReducedMotion } from '../lib/motion'
import { CTA } from '../components/Sections'
import { ParallaxImage } from '../components/Effects'
import { img } from '../data/site'
import { POSTS } from '../data/content'
import { formatDate } from './Ideas'
import NotFound from './NotFound'
import '../styles/pages/post.css'

function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 })
  return <motion.div className="post-progress" style={{ scaleX: prefersReducedMotion() ? scrollYProgress : smooth }} aria-hidden />
}

function Share({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''

  useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(false), 2200)
    return () => window.clearTimeout(t)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch {
      window.prompt('Copy this link', url)
    }
  }

  return (
    <div className="post-share">
      <span className="eyebrow">Share this story</span>
      <div className="post-share__row">
        <button type="button" className={`post-share__btn${copied ? ' is-copied' : ''}`} onClick={copy} aria-live="polite">
          {copied ? <Check size={16} strokeWidth={1.5} /> : <Link2 size={16} strokeWidth={1.5} />}
          <span>{copied ? 'Copied' : 'Copy link'}</span>
        </button>
        <a className="post-share__btn" href={`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`} target="_blank" rel="noopener noreferrer">
          <MessageCircle size={16} strokeWidth={1.5} />
          <span>WhatsApp</span>
        </a>
        <a className="post-share__btn" href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`}>
          <Mail size={16} strokeWidth={1.5} />
          <span>Email</span>
        </a>
      </div>
    </div>
  )
}

export default function Post() {
  useRefreshOnLoad()
  const { slug } = useParams()
  const post = POSTS.find((p) => p.slug === slug)
  const root = useRef<HTMLElement>(null)
  const { ready } = useLoader()

  useGSAP(
    () => {
      if (!post || prefersReducedMotion()) return
      gsap.fromTo(
        '.post-pull__rule',
        { scaleX: 0 },
        { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.post-pull', start: 'top 85%', end: 'top 40%', scrub: true } },
      )
      gsap.fromTo(
        '.post-pull__text',
        { opacity: 0.15 },
        { opacity: 1, ease: 'none', scrollTrigger: { trigger: '.post-pull', start: 'top 80%', end: 'center 50%', scrub: true } },
      )
    },
    { scope: root, dependencies: [slug] },
  )

  if (!post) {
    return <NotFound line="This story hasn’t been written yet." text="We couldn’t find that journal entry. Browse our latest notes and design ideas instead." secondary={{ label: 'Read the journal', to: '/ideas#journal' }} />
  }

  const pullAt = Math.ceil(post.body.length / 2)
  const related = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <article ref={root} className="post">
      <ReadingProgress />

      <header className="post-hero">
        <div className="container">
          <motion.nav className="crumbs" aria-label="Breadcrumb" initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ delay: 0.5, duration: 1 }}>
            <Link to="/">Home</Link>
            <span aria-hidden> / </span>
            <Link to="/ideas#journal">Journal</Link>
            <span aria-hidden> / </span>
            <span aria-current="page">{post.category}</span>
          </motion.nav>

          <motion.p
            className="post-meta"
            initial={{ opacity: 0, y: 12 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ delay: 0.5, duration: 1, ease: EASE }}
          >
            <span className="post-meta__cat">{post.category}</span>
            <span aria-hidden>·</span>
            <span>{post.readTime} read</span>
            <span aria-hidden>·</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </motion.p>

          <SplitText as="h1" text={post.title} className="post-hero__title" play={ready} delay={0.55} />

          <motion.p
            className="lead post-hero__excerpt"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 1, duration: 1.1, ease: EASE }}
          >
            {post.excerpt}
          </motion.p>
        </div>

        <div className="container post-hero__media-wrap">
          <motion.div
            className="post-hero__media"
            initial={{ clipPath: 'inset(40% 18% 0% 18% round 999px 999px 0px 0px)' }}
            animate={ready ? { clipPath: 'inset(0% 0% 0% 0% round 6px 6px 6px 6px)' } : undefined}
            transition={{ duration: 1.7, ease: EASE, delay: 0.75 }}
          >
            <ParallaxImage src={post.cover} alt={post.title} reveal={false} speed={10} width={2200} />
          </motion.div>
        </div>
      </header>

      <div className="container">
        <div className="post-layout">
          <aside className="post-aside">
            <Link to="/ideas#journal" className="link-line">
              <ArrowLeft size={14} strokeWidth={1.5} /> All stories
            </Link>
            <Share title={post.title} />
          </aside>

          <div className="post-body">
            {post.body.map((para, i) => (
              <Fragment key={i}>
                {post.pull && i === pullAt && (
                  <figure className="post-pull">
                    <span className="post-pull__rule" aria-hidden />
                    <blockquote className="post-pull__text serif">“{post.pull}”</blockquote>
                    <figcaption className="eyebrow">BBS Interior studio note</figcaption>
                  </figure>
                )}
                <Reveal as="p" y={24} className={i === 0 ? 'post-body__first' : undefined}>
                  {para}
                </Reveal>
              </Fragment>
            ))}

            <div className="post-sign">
              <span className="post-sign__mark serif" aria-hidden>
                ✦
              </span>
              <p className="muted">
                Planning something similar? <Link to="/contact" className="post-sign__link">Book a free consultation</Link> and bring this story along.
              </p>
            </div>

            <div className="post-share--mobile">
              <Share title={post.title} />
            </div>
          </div>
        </div>
      </div>

      <section className="section section--paper post-related" aria-label="More from the journal">
        <div className="container">
          <div className="post-related__head">
            <div>
              <Reveal>
                <span className="eyebrow">Keep reading</span>
              </Reveal>
              <SplitText as="h2" text={'More from the *journal*'} className="post-related__title" />
            </div>
            <Reveal delay={0.1}>
              <Link to="/ideas#journal" className="link-line">
                View all <ArrowUpRight size={14} strokeWidth={1.5} />
              </Link>
            </Reveal>
          </div>
          <div className="post-related__grid">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.1}>
                <Link to={`/journal/${p.slug}`} className="post-card" data-cursor="Read">
                  <span className="post-card__media">
                    <img src={img(p.cover, 900)} alt={p.title} loading="lazy" />
                  </span>
                  <span className="post-card__meta">
                    <span>{p.category}</span>
                    <span aria-hidden>·</span>
                    <time dateTime={p.date}>{formatDate(p.date)}</time>
                  </span>
                  <span className="post-card__title serif">{p.title}</span>
                  <span className="post-card__more">
                    Read story <ArrowUpRight size={14} strokeWidth={1.5} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </article>
  )
}
