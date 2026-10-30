import '../styles/pages/home.css'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react'
import { EASE, Reveal, SplitText, gsap, useGSAP, useLoader, useRefreshOnLoad, prefersReducedMotion } from '../lib/motion'
import { BeforeAfter, Counter, HorizontalGallery, Magnetic, Marquee, ParallaxImage, ScrollText, type HItem } from '../components/Effects'
import { CTA, HoverList, Process, SectionHead, Testimonials, type HoverRow } from '../components/Sections'
import { IMG, img } from '../data/site'
import { PROJECTS } from '../data/projects'
import { IDEAS, MARQUEE, POSTS, SERVICES, STATS, type Room } from '../data/content'

/* ------------------------------------------------------------------ */
/* Data shaping                                                        */
/* ------------------------------------------------------------------ */

const SERVICE_ROWS: HoverRow[] = SERVICES.map((s) => ({ title: s.title, text: s.short, image: s.image, to: '/services' }))

const GALLERY: HItem[] = PROJECTS.slice(0, 6).map((p) => ({
  to: `/portfolio/${p.slug}`,
  image: p.cover,
  title: p.title,
  meta: `${p.category} · ${p.location}`,
}))

/** Bento layout: each room gets a grid-area + a representative photo from IDEAS. */
const BENTO: { room: Room; area: string; image: string; note: string }[] = [
  { room: 'Living', area: 'living', image: IMG.livingPendants, note: 'Lounges, TV walls & reading nooks' },
  { room: 'Bedroom', area: 'bedroom', image: IMG.bedroomChandelier, note: 'Suites, headboards & wardrobes' },
  { room: 'Kitchen', area: 'kitchen', image: IMG.kitchenDark, note: 'Islands, parallels & L-shapes' },
  { room: 'Dining', area: 'dining', image: IMG.diningGreen, note: 'Tables, crockery & bar units' },
  { room: 'Bath', area: 'bath', image: IMG.bathDark, note: 'Spa-like vanities & stone' },
  { room: 'Workspace', area: 'work', image: IMG.officeLounge, note: 'Studios & offices' },
  { room: 'Exteriors', area: 'ext', image: IMG.villaNight, note: 'Facades, terraces & balconies' },
]

const ideaCount = (room: Room) => IDEAS.filter((i) => i.room === room).length

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

const BADGE_TEXT = 'BBS Interior • Since 2012 • Bespoke Design • '

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero() {
  const root = useRef<HTMLElement>(null)
  const { ready } = useLoader()

  // Intro: waits for the preloader, then reveals the arch, card & badge.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const hidden = () => {
        gsap.set('.home-hero__arch', { clipPath: 'inset(100% 0% 0% 0%)' })
        gsap.set('.home-hero__card, .home-hero__badge, .home-hero__meta > *', { autoAlpha: 0 })
      }
      if (!ready) {
        hidden()
        return
      }
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.fromTo('.home-hero__arch', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.7, ease: 'expo.inOut' }, 0.15)
        .fromTo('.home-hero__arch img', { scale: 1.45 }, { scale: 1, duration: 2.4 }, 0.35)
        .fromTo(
          '.home-hero__card',
          { autoAlpha: 0, y: 80, clipPath: 'inset(0% 0% 100% 0%)' },
          { autoAlpha: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6 },
          1.05,
        )
        .fromTo('.home-hero__badge', { autoAlpha: 0, scale: 0.4, rotate: -90 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 1.8 }, 1.25)
        .fromTo('.home-hero__meta > *', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.1 }, 1.4)
    },
    { scope: root, dependencies: [ready], revertOnUpdate: true },
  )

  // Scroll-out: copy drifts up & fades, image layers move at different speeds.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('.home-hero__copy', { y: -140, opacity: 0.15, ease: 'none', scrollTrigger: st })
      gsap.to('.home-hero__arch-inner', { yPercent: 12, ease: 'none', scrollTrigger: st })
      gsap.to('.home-hero__visual', { y: 60, ease: 'none', scrollTrigger: st })
      gsap.to('.home-hero__card-inner', { y: -170, ease: 'none', scrollTrigger: st })
      gsap.to('.home-hero__badge-spin', { rotate: 220, ease: 'none', scrollTrigger: st })
    },
    { scope: root },
  )

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 28 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
    transition: { duration: 1.2, ease: EASE, delay },
  })

  return (
    <section ref={root} className="home-hero" aria-label="Introduction">
      <div className="container home-hero__grid">
        <div className="home-hero__copy">
          <motion.span className="eyebrow" {...fade(0.1)}>
            Interior design studio · Est. 2012
          </motion.span>
          <SplitText as="h1" text={'Spaces that\nfeel like *home*'} className="home-hero__title" play={ready} delay={0.2} />
          <motion.p className="lead home-hero__lead" {...fade(0.75)}>
            BBS Interior designs warm, deeply personal homes across India — bespoke furniture, honest materials and turnkey execution, all under one calm roof.
          </motion.p>
          <motion.div className="home-hero__actions" {...fade(0.9)}>
            <Link to="/portfolio" className="btn" data-cursor="Explore">
              Explore portfolio <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
            <Magnetic strength={0.3}>
              <Link to="/contact" className="btn btn--ghost">
                Book consultation <ArrowUpRight size={16} strokeWidth={1.5} />
              </Link>
            </Magnetic>
          </motion.div>
        </div>

        <div className="home-hero__visual">
          <div className="home-hero__arch arch" data-cursor="BBS">
            <div className="home-hero__arch-inner">
              <img src={img(IMG.livingRattan, 1400)} alt="Sunlit living room with rattan pendant lights and bouclé seating" />
            </div>
          </div>

          <figure className="home-hero__card">
            <div className="home-hero__card-inner">
              <img src={img(IMG.consoleOrange, 700)} alt="Styled console with ceramics and warm terracotta tones" />
              <figcaption>
                <span className="home-hero__card-tag">Featured</span>
                <span className="serif">The Rattan Residence</span>
                <span className="muted">Bandra West, Mumbai</span>
              </figcaption>
            </div>
          </figure>

          <div className="home-hero__badge" aria-hidden>
            <div className="home-hero__badge-spin">
              <svg viewBox="0 0 200 200" className="home-hero__badge-svg">
                <defs>
                  <path id="home-badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
                </defs>
                <text>
                  <textPath href="#home-badge-circle" textLength="488">
                    {BADGE_TEXT}
                  </textPath>
                </text>
              </svg>
            </div>
            <span className="home-hero__badge-core serif">
              <span className="italic">b</span>bs
            </span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="home-hero__meta">
          <span>Mumbai · Bengaluru · Pune</span>
          <span className="home-hero__scroll">
            <span className="home-hero__scroll-line" aria-hidden />
            Scroll to explore <ArrowDown size={14} strokeWidth={1.5} />
          </span>
          <span className="home-hero__meta-end">850+ homes delivered</span>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Intro + stats                                                       */
/* ------------------------------------------------------------------ */

function Intro() {
  return (
    <section className="section home-intro" aria-labelledby="home-intro-label">
      <div className="container">
        <div className="home-intro__grid">
          <div className="home-intro__text">
            <Reveal>
              <span className="eyebrow" id="home-intro-label">
                The studio
              </span>
            </Reveal>
            <ScrollText
              className="home-intro__statement"
              text="We are a *Mumbai-born* studio designing homes that feel *calm,* personal and quietly *luxurious* — rooms shaped around your rituals, crafted in our own workshop and delivered with *care.*"
            />
            <Reveal delay={0.1} className="home-intro__links">
              <Link to="/about" className="link-line">
                Our story <ArrowUpRight size={14} strokeWidth={1.5} />
              </Link>
              <Link to="/services" className="link-line">
                What we do <ArrowUpRight size={14} strokeWidth={1.5} />
              </Link>
            </Reveal>
          </div>
          <div className="home-intro__media">
            <ParallaxImage src={IMG.foyerConsole} alt="Elegant foyer console styled with brass and ceramics" className="home-intro__img arch" speed={10} width={1100} />
            <Reveal className="home-intro__caption" delay={0.2}>
              <span className="serif italic">“Design is the art of slowing down.”</span>
              <span className="muted">— Bhavna B. Shah, Founder</span>
            </Reveal>
          </div>
        </div>

        <ul className="home-stats">
          {STATS.map((s, i) => (
            <Reveal as="li" key={s.label} className="home-stats__item" delay={i * 0.08}>
              <Counter value={s.value} suffix={s.suffix} className="home-stats__value serif" />
              <span className="home-stats__label">{s.label}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Before / After                                                      */
/* ------------------------------------------------------------------ */

function Transformation() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        '.home-ba__frame',
        { scale: 0.86, borderRadius: '200px' },
        { scale: 1, borderRadius: '18px', ease: 'none', scrollTrigger: { trigger: '.home-ba__frame', start: 'top bottom', end: 'center center', scrub: true } },
      )
    },
    { scope: root },
  )

  return (
    <section ref={root} className="section section--paper home-ba" aria-label="Before and after transformation">
      <div className="container">
        <div className="home-ba__head">
          <div>
            <Reveal>
              <span className="eyebrow">Transformation</span>
            </Reveal>
            <SplitText text={'From bare walls\nto *belonging*'} className="home-ba__title" />
          </div>
          <Reveal delay={0.15} className="home-ba__side">
            <p className="lead">Drag across to see an empty shell become a finished, lived-in home — the same walls, reimagined in 58 working days.</p>
            <dl className="home-ba__facts">
              <div>
                <dt>Area</dt>
                <dd className="serif">1,850 sq.ft</dd>
              </div>
              <div>
                <dt>Timeline</dt>
                <dd className="serif">58 days</dd>
              </div>
              <div>
                <dt>Scope</dt>
                <dd className="serif">Turnkey</dd>
              </div>
            </dl>
          </Reveal>
        </div>
        <div className="home-ba__frame">
          <BeforeAfter before={IMG.emptyRoom} after={IMG.openLivingModern} beforeLabel="Bare shell" afterLabel="Delivered" />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Explore by room — bento                                             */
/* ------------------------------------------------------------------ */

function Rooms() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const tiles = gsap.utils.toArray<HTMLElement>('.home-rooms__tile')
      gsap.set(tiles, { autoAlpha: 0, y: 70, clipPath: 'inset(12% 6% 0% 6% round 18px)' })
      gsap.to(tiles, {
        autoAlpha: 1,
        y: 0,
        clipPath: 'inset(0% 0% 0% 0% round 18px)',
        duration: 1.4,
        ease: 'expo.out',
        stagger: 0.09,
        scrollTrigger: { trigger: '.home-rooms__grid', start: 'top 82%' },
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className="section home-rooms">
      <div className="container">
        <SectionHead
          eyebrow="Design ideas"
          title={'Explore by *room*'}
          intro="Hundreds of real rooms we have designed and built — browse by space and save what speaks to you."
          action={
            <Link to="/ideas" className="link-line">
              All ideas <ArrowUpRight size={14} strokeWidth={1.5} />
            </Link>
          }
        />
        <div className="home-rooms__grid">
          {BENTO.map((b) => (
            <Link
              key={b.room}
              to={`/ideas?room=${encodeURIComponent(b.room)}`}
              className={`home-rooms__tile home-rooms__tile--${b.area}`}
              style={{ gridArea: b.area }}
              data-cursor="Browse"
            >
              <img src={img(b.image, b.area === 'living' || b.area === 'ext' ? 1400 : 900)} alt={`${b.room} interior idea`} loading="lazy" />
              <span className="home-rooms__shade" aria-hidden />
              <span className="home-rooms__count">{String(ideaCount(b.room)).padStart(2, '0')} ideas</span>
              <span className="home-rooms__body">
                <span className="home-rooms__name serif">{b.room}</span>
                <span className="home-rooms__note">{b.note}</span>
              </span>
              <span className="home-rooms__arrow" aria-hidden>
                <ArrowUpRight size={18} strokeWidth={1.25} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Journal teaser                                                      */
/* ------------------------------------------------------------------ */

function Journal() {
  return (
    <section className="section section--sand home-journal">
      <div className="container">
        <SectionHead
          eyebrow="Journal"
          title={'Notes from\nthe *studio*'}
          intro="Guides, ideas and honest advice from our designers on making a home that works as beautifully as it looks."
          action={
            <Link to="/ideas" className="link-line">
              Browse ideas <ArrowUpRight size={14} strokeWidth={1.5} />
            </Link>
          }
        />
        <div className="home-journal__grid">
          {POSTS.slice(0, 3).map((p, i) => (
            <Reveal as="article" key={p.slug} className="home-journal__card" delay={i * 0.12}>
              <Link to={`/journal/${p.slug}`} className="home-journal__link" data-cursor="Read">
                <div className="home-journal__media">
                  <img src={img(p.cover, 900)} alt={p.title} loading="lazy" />
                  <span className="home-journal__cat">{p.category}</span>
                </div>
                <div className="home-journal__meta">
                  <time dateTime={p.date}>{formatDate(p.date)}</time>
                  <span aria-hidden>·</span>
                  <span>{p.readTime} read</span>
                </div>
                <h3 className="home-journal__title">{p.title}</h3>
                <p className="muted home-journal__excerpt">{p.excerpt}</p>
                <span className="link-line home-journal__more">
                  Read article <ArrowUpRight size={14} strokeWidth={1.5} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  useRefreshOnLoad()

  return (
    <>
      <Hero />

      <Marquee items={MARQUEE} className="home-marquee" />

      <Intro />

      <section className="section section--paper home-services">
        <div className="container">
          <SectionHead
            eyebrow="What we do"
            title={'Interiors,\n*end to end*'}
            intro="Six specialist practices, one accountable team — from a single modular kitchen to a five-bedroom villa."
            action={
              <Link to="/services" className="btn btn--ghost">
                All services <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
            }
          />
          <HoverList rows={SERVICE_ROWS} />
        </div>
      </section>

      <HorizontalGallery
        items={GALLERY}
        heading={
          <div className="home-works__head">
            <span className="eyebrow">Portfolio</span>
            <h2 className="home-works__title">
              Selected <span className="italic">works</span>
            </h2>
            <p className="lead">Homes, villas and workspaces we have shaped across India — each one built around the people who live in it.</p>
          </div>
        }
      />

      <Transformation />

      <Process />

      <Rooms />

      <Testimonials />

      <Journal />

      <CTA />
    </>
  )
}
