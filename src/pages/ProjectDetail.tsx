import '../styles/pages/project.css'
import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowUpRight } from 'lucide-react'
import { EASE, Reveal, SplitText, gsap, prefersReducedMotion, useGSAP, useLoader, useRefreshOnLoad } from '../lib/motion'
import { BeforeAfter, Magnetic, ParallaxImage, ScrollText } from '../components/Effects'
import { PROJECTS, getProject, type Project } from '../data/projects'
import { img, IMG } from '../data/site'

const pad = (n: number) => String(n).padStart(2, '0')

/* ------------------------------------------------------------------ */
/* Not found                                                           */
/* ------------------------------------------------------------------ */

function ProjectNotFound() {
  return (
    <section className="pj-missing">
      <div className="container pj-missing__inner">
        <motion.span className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1, ease: EASE }}>
          Error · 404
        </motion.span>
        <SplitText as="h1" text={'This project\nhas *moved on*'} className="pj-missing__title" play delay={0.45} />
        <motion.p className="lead" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 1, ease: EASE }}>
          We couldn’t find the home you were looking for. It may have been renamed, or it lives somewhere else in our portfolio.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 1 }}>
          <Link to="/portfolio" className="btn">
            <ArrowLeft size={16} strokeWidth={1.4} /> Back to portfolio
          </Link>
        </motion.div>
      </div>
      <div className="pj-missing__art arch" aria-hidden>
        <img src={img(IMG.emptyRoom, 900)} alt="" />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Gallery — mixed editorial layout                                    */
/* ------------------------------------------------------------------ */

function Gallery({ project }: { project: Project }) {
  const [first, ...rest] = project.gallery
  const pairs: string[][] = []
  for (let i = 0; i < rest.length; i += 2) pairs.push(rest.slice(i, i + 2))
  let fig = 1
  const label = (n: number) => `${project.title}, view ${n}`

  return (
    <section className="pj-gallery" aria-label="Project gallery">
      <div className="container">
        {first && (
          <figure className="pj-fig pj-fig--wide">
            <div className="pj-fig__frame">
              <ParallaxImage src={first} alt={label(fig)} width={2200} speed={10} cursor="Zoom" />
            </div>
            <figcaption>
              <span>Fig. {pad(fig++)}</span>
              <span className="muted">{project.location}</span>
            </figcaption>
          </figure>
        )}

        {pairs.map((pair, pi) =>
          pair.length === 2 ? (
            <div key={pi} className={`pj-pair${pi % 2 ? ' pj-pair--flip' : ''}`}>
              {pair.map((src, k) => {
                const n = fig++
                return (
                  <figure key={src} className={`pj-fig ${k === 0 ? 'pj-fig--arch' : 'pj-fig--offset'}`}>
                    <div className="pj-fig__frame">
                      <ParallaxImage src={src} alt={label(n)} width={1200} speed={k === 0 ? 8 : 14} />
                    </div>
                    <figcaption>
                      <span>Fig. {pad(n)}</span>
                    </figcaption>
                  </figure>
                )
              })}
            </div>
          ) : (
            <div key={pi} className="pj-solo">
              <Reveal className="pj-solo__text">
                <span className="eyebrow">Detail</span>
                <p className="serif pj-solo__quote">
                  Every material chosen to age <span className="italic">beautifully</span> — {project.materials.slice(0, 2).join(' and ').toLowerCase()}.
                </p>
              </Reveal>
              <figure className="pj-fig pj-fig--solo">
                <div className="pj-fig__frame">
                  <ParallaxImage src={pair[0]} alt={label(fig)} width={1600} speed={12} />
                </div>
                <figcaption>
                  <span>Fig. {pad(fig++)}</span>
                </figcaption>
              </figure>
            </div>
          ),
        )}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Project view                                                        */
/* ------------------------------------------------------------------ */

function ProjectView({ project }: { project: Project }) {
  const root = useRef<HTMLDivElement>(null)
  const { ready } = useLoader()
  useRefreshOnLoad()

  const index = PROJECTS.findIndex((p) => p.slug === project.slug)
  const next = PROJECTS[(index + 1) % PROJECTS.length]

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      // hero image expands to full-bleed while it zooms out
      gsap.fromTo(
        '.pj-hero__media',
        { clipPath: 'inset(0% 5% 0% 5% round 22px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: '.pj-hero__media', start: 'top 80%', end: 'top 10%', scrub: true } },
      )
      gsap.fromTo(
        '.pj-hero__media img',
        { scale: 1.32, yPercent: -4 },
        { scale: 1.02, yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.pj-hero__media', start: 'top bottom', end: 'bottom top', scrub: true } },
      )
      gsap.to('.pj-hero__head', { yPercent: -18, opacity: 0.25, ease: 'none', scrollTrigger: { trigger: '.pj-hero', start: 'top top', end: 'bottom 30%', scrub: true } })

      // meta dividers draw in
      gsap.fromTo('.pj-meta__item', { '--pj-line': 0 }, { '--pj-line': 1, duration: 1.4, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.pj-meta', start: 'top 85%' } })

      // next project title slides in from the right as it nears
      gsap.fromTo('.pj-next__title', { xPercent: 12 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: '.pj-next', start: 'top bottom', end: 'center center', scrub: true } })
    },
    { scope: root, dependencies: [project.slug] },
  )

  const meta = [
    { k: 'Location', v: project.location },
    { k: 'Area', v: project.area },
    { k: 'Budget', v: project.budget },
    { k: 'Duration', v: project.duration },
    { k: 'Year', v: String(project.year) },
  ]

  return (
    <div ref={root} className="pj">
      {/* ---------- hero ---------- */}
      <header className="pj-hero">
        <div className="container pj-hero__head">
          <motion.nav className="crumbs" aria-label="Breadcrumb" initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ delay: 0.6, duration: 1 }}>
            <Link to="/">Home</Link>
            <span aria-hidden> / </span>
            <Link to="/portfolio">Portfolio</Link>
            <span aria-hidden> / </span>
            <span aria-current="page">{project.title}</span>
          </motion.nav>
          <motion.div
            className="pj-hero__eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ delay: 0.5, duration: 1, ease: EASE }}
          >
            <Link to={`/portfolio?category=${project.category}`} className="eyebrow pj-hero__cat">
              {project.category}
            </Link>
            <span className="pj-hero__loc muted">{project.location}</span>
          </motion.div>
          <SplitText as="h1" text={project.title} className="pj-hero__title" play={ready} delay={0.55} />
          <motion.div
            className="pj-hero__foot"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 1.05, duration: 1.1, ease: EASE }}
          >
            <p className="lead">{project.summary}</p>
            <div className="pj-hero__index">
              <span className="serif">
                <span className="italic">{pad(index + 1)}</span> / {pad(PROJECTS.length)}
              </span>
              <span className="pj-hero__scroll" aria-hidden>
                <ArrowDown size={16} strokeWidth={1.3} />
              </span>
            </div>
          </motion.div>
        </div>
        <motion.div
          className="pj-hero__reveal"
          initial={{ opacity: 0, y: 80 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
          transition={{ delay: 0.75, duration: 1.5, ease: EASE }}
        >
          <div className="pj-hero__media">
            <img src={img(project.cover, 2400)} alt={`${project.title} — ${project.summary}`} />
          </div>
        </motion.div>
      </header>

      {/* ---------- meta ---------- */}
      <section className="pj-meta-wrap" aria-label="Project facts">
        <div className="container">
          <dl className="pj-meta">
            {meta.map((m, i) => (
              <Reveal key={m.k} className="pj-meta__item" delay={i * 0.07}>
                <dt>{m.k}</dt>
                <dd className="serif">{m.v}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- overview ---------- */}
      <section className="section pj-overview">
        <div className="container pj-overview__grid">
          <div className="pj-overview__side">
            <Reveal>
              <span className="eyebrow">The story</span>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="pj-overview__num serif" aria-hidden>
                {pad(index + 1)}
              </p>
            </Reveal>
          </div>
          <div className="pj-overview__main">
            <ScrollText text={project.summary.replace(/(\S+[.!?])$/, '*$1*')} className="pj-overview__lead" />
            <div className="pj-overview__story">
              {project.story.map((para, i) => (
                <Reveal key={i} delay={i * 0.12}>
                  <p className={i === 0 ? 'pj-dropcap' : undefined}>{para}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Gallery project={project} />

      {/* ---------- before / after ---------- */}
      <section className="section pj-ba">
        <div className="container">
          <div className="pj-ba__head">
            <div>
              <Reveal>
                <span className="eyebrow">The transformation</span>
              </Reveal>
              <SplitText text={'From bare shell\nto *finished home*'} className="pj-ba__title" />
            </div>
            <Reveal delay={0.15}>
              <p className="lead">Drag the handle to see how {project.duration} of design and on-site craft turned an empty shell into {project.title}.</p>
            </Reveal>
          </div>
          <Reveal y={60}>
            <BeforeAfter before={IMG.emptyRoom} after={project.cover} beforeLabel="Bare shell" afterLabel="Finished" />
          </Reveal>
        </div>
      </section>

      {/* ---------- palette & materials ---------- */}
      <section className="section section--sand pj-palette">
        <div className="container pj-palette__grid">
          <div>
            <Reveal>
              <span className="eyebrow">Material palette</span>
            </Reveal>
            <SplitText text={'Colours drawn\nfrom *the site*'} className="pj-palette__title" />
            <ul className="pj-swatches" aria-label="Colour palette">
              {project.palette.map((c, i) => (
                <motion.li
                  key={c.hex}
                  className="pj-swatch"
                  initial={{ opacity: 0, scale: 0.4, y: 40 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.15 + i * 0.12 }}
                >
                  <span className="pj-swatch__chip" style={{ background: c.hex }} aria-hidden />
                  <span className="pj-swatch__name serif">{c.name}</span>
                  <span className="pj-swatch__hex">{c.hex.toUpperCase()}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="pj-materials">
            <Reveal>
              <h2 className="pj-materials__title">Materials &amp; finishes</h2>
            </Reveal>
            <ol className="pj-materials__list">
              {project.materials.map((m, i) => (
                <Reveal as="li" key={m} delay={i * 0.06}>
                  <span className="pj-materials__num">{pad(i + 1)}</span>
                  <span className="serif">{m}</span>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------- quote ---------- */}
      {project.quote && (
        <section className="section pj-quote">
          <div className="container pj-quote__inner">
            <span className="pj-quote__mark serif" aria-hidden>
              “
            </span>
            <figure>
              <SplitText as="blockquote" text={project.quote.text} className="pj-quote__text serif" />
              <Reveal delay={0.3}>
                <figcaption className="pj-quote__author">
                  <span className="pj-quote__rule" aria-hidden />
                  <strong>{project.quote.author}</strong>
                  <span className="muted">Homeowners · {project.location}</span>
                </figcaption>
              </Reveal>
            </figure>
          </div>
        </section>
      )}

      {/* ---------- next project ---------- */}
      <section className="pj-next" aria-label="Next project">
        <Link to={`/portfolio/${next.slug}`} className="pj-next__link" data-cursor="Next">
          <span className="pj-next__bg" aria-hidden>
            <img src={img(next.cover, 2000)} alt="" loading="lazy" />
          </span>
          <span className="container pj-next__inner">
            <span className="pj-next__top">
              <span className="eyebrow">Next project</span>
              <span className="pj-next__meta">
                {next.category} · {next.location}
              </span>
            </span>
            <span className="pj-next__title">
              {next.title}
              <ArrowUpRight className="pj-next__arrow" strokeWidth={0.9} aria-hidden />
            </span>
            <span className="pj-next__thumb arch" aria-hidden>
              <img src={img(next.cover, 500)} alt="" loading="lazy" />
            </span>
          </span>
        </Link>
        <div className="container pj-next__back">
          <Magnetic>
            <Link to="/portfolio" className="link-line">
              <ArrowLeft size={14} strokeWidth={1.4} /> All projects
            </Link>
          </Magnetic>
        </div>
      </section>

    </div>
  )
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = getProject(slug)
  if (!project) return <ProjectNotFound />
  // keyed so every effect, trigger and animation starts fresh per project
  return <ProjectView key={project.slug} project={project} />
}
