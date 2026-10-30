import '../styles/pages/about.css'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Reveal, SplitText, gsap, ScrollTrigger, useGSAP, prefersReducedMotion, useRefreshOnLoad } from '../lib/motion'
import { Counter, Marquee, ParallaxImage, ScrollText } from '../components/Effects'
import { CTA, PageHero, SectionHead } from '../components/Sections'
import { IMG, img } from '../data/site'
import { STATS, TEAM, TIMELINE, VALUES } from '../data/content'

const TIMELINE_IMAGES = [IMG.livingLuxe, IMG.kitchenDark, IMG.livingRattan, IMG.villaPoolStair, IMG.livingPendants]

const PRESS = [
  'AD Design Show 2025',
  'India Interior Awards — Residential',
  'Top 50 Design Studios 2024',
  'Mumbai Design Week',
  'Craft & Material Honour 2023',
  'Sustainable Studio Citation',
  'Best Kitchen Design 2022',
]

export default function About() {
  useRefreshOnLoad()
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      /* timeline: active state (no motion, so always on) */
      gsap.utils.toArray<HTMLElement>('.about-tl__item').forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: 'top 65%',
          onEnter: () => item.classList.add('is-active'),
          onLeaveBack: () => item.classList.remove('is-active'),
        })
      })

      if (prefersReducedMotion()) return

      /* story — floating second image + spinning badge */
      gsap.fromTo(
        '.about-story__small',
        { yPercent: 20 },
        { yPercent: -25, ease: 'none', scrollTrigger: { trigger: '.about-story', start: 'top bottom', end: 'bottom top', scrub: true } },
      )
      gsap.to('.about-story__badge svg', {
        rotate: 360,
        ease: 'none',
        scrollTrigger: { trigger: '.about-story', start: 'top bottom', end: 'bottom top', scrub: true },
      })

      /* timeline: line draws with scroll */
      gsap.fromTo(
        '.about-tl__fill',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.about-tl__wrap', start: 'top 65%', end: 'bottom 65%', scrub: true } },
      )
      gsap.utils.toArray<HTMLElement>('.about-tl__item').forEach((item) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 80%' } })
        tl.from(item.querySelector('.about-tl__year'), { yPercent: 100, duration: 1.2, ease: 'expo.out' })
          .from(item.querySelectorAll('.about-tl__text > *'), { y: 30, opacity: 0, duration: 1, stagger: 0.08, ease: 'power3.out' }, '<0.15')
          .fromTo(
            item.querySelector('.about-tl__media'),
            { clipPath: 'inset(0% 0% 100% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.out' },
            '<',
          )
        gsap.fromTo(
          item.querySelector('.about-tl__media img'),
          { yPercent: -10 },
          { yPercent: 10, ease: 'none', scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: true } },
        )
      })

      /* team cards rise in a stagger */
      gsap.from('.about-team__card', {
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.about-team__grid', start: 'top 82%' },
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className="about">
      <PageHero
        eyebrow="Our story · Since 2012"
        title={'Fourteen years of\nrooms with *soul*'}
        intro="BBS Interior is a Mumbai-born design studio crafting calm, characterful homes for families across India — designed around how you live, built in our own workshop."
        image={IMG.livingRattan}
        crumbs={[{ label: 'About' }]}
      />

      {/* ---------------- Story ---------------- */}
      <section className="section about-story">
        <div className="container about-story__grid">
          <div className="about-story__media">
            <div className="about-story__large arch">
              <ParallaxImage src={IMG.livingWarm} alt="Warm minimal living room with soft daylight" speed={10} width={1200} />
            </div>
            <div className="about-story__small">
              <ParallaxImage src={IMG.consoleOrange} alt="Styled console with sculptural décor" speed={8} width={800} />
            </div>
            <div className="about-story__badge" aria-hidden>
              <svg viewBox="0 0 200 200">
                <defs>
                  <path id="about-badge-path" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
                </defs>
                <text>
                  <textPath href="#about-badge-path">Est. 2012 · Mumbai · BBS Interior · Est. 2012 · Mumbai ·</textPath>
                </text>
              </svg>
              <span className="serif italic">B</span>
            </div>
          </div>

          <div className="about-story__text">
            <Reveal>
              <span className="eyebrow">The studio</span>
            </Reveal>
            <SplitText as="h2" text={'It began with one room\nand a *promise*'} className="about-story__title" />
            <Reveal delay={0.1}>
              <p className="lead">
                In 2012, Bhavna B. Shah opened a 300 sq.ft studio in Lower Parel with a sketchbook, a single carpenter and one belief: a home should feel
                like the people who live in it — not like a catalogue.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="muted">
                Trained in architecture and obsessed with Indian craft, Bhavna built BBS Interior on listening first. Today our team of designers,
                engineers and craftspeople has delivered more than 850 homes, yet every project still starts the same way — with chai, a long
                conversation and a walk through the way you live.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="muted">
                We design and build under one roof, so the brass handle you choose in the moodboard is the one that arrives on site — fitted, finished
                and guaranteed.
              </p>
            </Reveal>
            <Reveal delay={0.4} className="about-story__sign">
              <span className="serif italic">Bhavna B. Shah</span>
              <span className="muted">Founder &amp; Principal Designer</span>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- Founder quote ---------------- */}
      <section className="section section--paper about-quote">
        <div className="container about-quote__inner">
          <span className="about-quote__mark serif" aria-hidden>
            “
          </span>
          <figure>
            <blockquote>
              <ScrollText
                className="about-quote__text"
                text="Luxury is not marble or gold. It is the *quiet* feeling of walking into a room that already *knows* you — where the light, the textures and every drawer are exactly where your life needs them."
              />
            </blockquote>
            <figcaption>
              <Reveal className="about-quote__cite">
                <img src={img(IMG.p4, 160, 160)} alt="Portrait of Bhavna B. Shah" loading="lazy" />
                <span>
                  <strong>Bhavna B. Shah</strong>
                  <span className="muted">Founder, BBS Interior</span>
                </span>
              </Reveal>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---------------- Values ---------------- */}
      <section className="section about-values">
        <div className="container">
          <SectionHead
            eyebrow="What we believe"
            title={'Four values,\n*every* project'}
            intro="The principles that shape every sketch, every quote and every hinge we fit."
          />
          <ol className="about-values__grid">
            {VALUES.map((v, i) => (
              <Reveal as="li" key={v.title} className="about-values__item" delay={i * 0.08}>
                <span className="about-values__line" aria-hidden />
                <span className="about-values__num serif">{String(i + 1).padStart(2, '0')}</span>
                <h3>{v.title}</h3>
                <p className="muted">{v.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- Timeline ---------------- */}
      <section className="section section--sand about-tl">
        <div className="container">
          <SectionHead eyebrow="Milestones" title={'A studio that\n*grew* with you'} center />
          <div className="about-tl__wrap">
            <span className="about-tl__line" aria-hidden>
              <span className="about-tl__fill" />
            </span>
            <ol className="about-tl__list">
            {TIMELINE.map((t, i) => (
              <li key={t.year} className={`about-tl__item${i % 2 ? ' is-flip' : ''}`}>
                <span className="about-tl__dot" aria-hidden />
                <div className="about-tl__head">
                  <span className="about-tl__year-mask">
                    <span className="about-tl__year serif">{t.year}</span>
                  </span>
                  <div className="about-tl__text">
                    <h3>{t.title}</h3>
                    <p className="muted">{t.text}</p>
                  </div>
                </div>
                <div className="about-tl__media">
                  <img src={img(TIMELINE_IMAGES[i % TIMELINE_IMAGES.length], 900)} alt="" loading="lazy" />
                </div>
              </li>
            ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------------- Stats ---------------- */}
      <section className="section section--dark about-stats">
        <div className="container">
          <Reveal>
            <span className="eyebrow">By the numbers</span>
          </Reveal>
          <dl className="about-stats__grid">
            {STATS.map((s, i) => (
              <Reveal key={s.label} className="about-stats__item" delay={i * 0.1}>
                <dt className="muted">{s.label}</dt>
                <dd className="serif">
                  <Counter value={s.value} suffix={s.suffix} />
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------- Team ---------------- */}
      <section className="section about-team">
        <div className="container">
          <SectionHead
            eyebrow="The people"
            title={'Meet the *hands*\nbehind the homes'}
            intro="Designers, engineers and makers who treat your home as carefully as their own."
            action={
              <Link to="/contact" className="link-line">
                Join the studio <ArrowUpRight size={16} strokeWidth={1.25} />
              </Link>
            }
          />
          <ul className="about-team__grid">
            {TEAM.map((m, i) => (
              <li key={m.name} className={`about-team__card${i % 2 ? ' is-offset' : ''}`}>
                <div className="about-team__media" data-cursor="Hello">
                  <img src={img(m.image, 800, 1000)} alt={`Portrait of ${m.name}, ${m.role}`} loading="lazy" />
                  <span className="about-team__index">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="about-team__info">
                  <span className="about-team__name-mask">
                    <h3 className="about-team__name">{m.name}</h3>
                  </span>
                  <p className="muted">{m.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- Press marquee ---------------- */}
      <section className="about-press" aria-label="Awards and press">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Recognition &amp; press</span>
          </Reveal>
        </div>
        <Marquee items={PRESS} className="about-press__marquee" separator="✦" />
      </section>

      <CTA title={'Your story could be\nour *next* chapter'} image={IMG.livingPendants} />
    </div>
  )
}
