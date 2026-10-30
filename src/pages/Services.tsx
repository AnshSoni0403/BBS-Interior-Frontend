import '../styles/pages/services.css'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Check, ClipboardCheck, Receipt, ShieldCheck, Timer, type LucideIcon } from 'lucide-react'
import { Reveal, SplitText, gsap, ScrollTrigger, useGSAP, prefersReducedMotion, useRefreshOnLoad } from '../lib/motion'
import { Counter, Magnetic, Marquee, ParallaxImage } from '../components/Effects'
import { Accordion, CTA, PageHero, Process, SectionHead } from '../components/Sections'
import { IMG, img } from '../data/site'
import { PACKAGES, SERVICES } from '../data/content'

const WHY: { icon: LucideIcon; value: number; suffix: string; title: string; text: string }[] = [
  { icon: ShieldCheck, value: 10, suffix: '-year', title: 'Warranty', text: 'On every modular kitchen and wardrobe, backed by our in-house service team.' },
  { icon: Timer, value: 45, suffix: '-day', title: 'Delivery', text: 'Move-in ready apartments, tracked weekly by your project manager.' },
  { icon: ClipboardCheck, value: 146, suffix: '', title: 'Quality checks', text: 'From board density to hinge alignment, before anything leaves our workshop.' },
  { icon: Receipt, value: 0, suffix: '', title: 'Hidden costs', text: 'Itemised, fixed quotes. The number you sign is the number you pay.' },
]

const MATERIALS = [
  'Marine ply',
  'Italian marble',
  'Soft-close hardware',
  'Fluted veneer',
  'Quartz counters',
  'Brushed brass',
  'Lacquered glass',
  'Hand-loomed linen',
  'Terrazzo',
  'Teak & walnut',
  'Acrylic shutters',
  'Profile lighting',
]

export default function Services() {
  useRefreshOnLoad()
  const root = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('.services-block').forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (s) => s.isActive && setActive(i),
        })
      })

      if (prefersReducedMotion()) return

      gsap.fromTo(
        '.services-list__progress span',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.services-list__blocks', start: 'top 55%', end: 'bottom 55%', scrub: true } },
      )

      gsap.utils.toArray<HTMLElement>('.services-block').forEach((el) => {
        gsap.from(el.querySelectorAll('.services-block__feat li'), {
          x: -24,
          opacity: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: el.querySelector('.services-block__feat'), start: 'top 85%' },
        })
        gsap.fromTo(
          el.querySelector('.services-block__num'),
          { yPercent: 30 },
          { yPercent: -30, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
        )
      })

      gsap.from('.services-why__item', {
        y: 60,
        opacity: 0,
        duration: 1.1,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.services-why__grid', start: 'top 85%' },
      })
    },
    { scope: root },
  )

  const current = SERVICES[active]

  return (
    <div ref={root} className="services">
      <PageHero
        eyebrow="Services · Design & build"
        title={'Everything your home\nneeds, *under one roof*'}
        intro="From a single modular kitchen to a turnkey villa, our designers, engineers and craftspeople take you from first sketch to styled handover."
        image={IMG.kitchenIsland}
        crumbs={[{ label: 'Services' }]}
      />

      {/* ---------------- Service list with sticky swapping image ---------------- */}
      <section className="section services-list" aria-label="Our services">
        <div className="container services-list__grid">
          <div className="services-list__sticky" aria-hidden>
            <div className="services-list__frame">
              {SERVICES.map((s, i) => (
                <img
                  key={s.slug}
                  src={img(s.image, 1200)}
                  alt=""
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className={`services-list__img${i <= active ? ' is-shown' : ''}${i === active ? ' is-active' : ''}`}
                  style={{ zIndex: i + 1 }}
                />
              ))}
              <span className="services-list__tag">
                <span className="serif">{String(active + 1).padStart(2, '0')}</span> / {String(SERVICES.length).padStart(2, '0')}
              </span>
            </div>
            <div className="services-list__caption">
              <span className="services-list__progress">
                <span />
              </span>
              <p key={current.slug} className="services-list__caption-text serif italic">
                {current.title}
              </p>
            </div>
          </div>

          <div className="services-list__blocks">
            {SERVICES.map((s, i) => (
              <article key={s.slug} id={s.slug} className={`services-block${i === active ? ' is-active' : ''}`}>
                <div className="services-block__media">
                  <ParallaxImage src={s.image} alt={s.title} speed={8} width={1000} />
                </div>
                <span className="services-block__num serif" aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Reveal>
                  <span className="eyebrow">{s.short}</span>
                </Reveal>
                <SplitText as="h2" text={s.title} className="services-block__title" />
                <Reveal delay={0.1}>
                  <p className="lead">{s.description}</p>
                </Reveal>
                <ul className="services-block__feat">
                  {s.features.map((f) => (
                    <li key={f}>
                      <span className="services-block__check" aria-hidden>
                        <Check size={14} strokeWidth={1.75} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Reveal delay={0.2}>
                  <Link to="/contact" className="link-line" data-cursor="Enquire">
                    Discuss this service <ArrowUpRight size={16} strokeWidth={1.25} />
                  </Link>
                </Reveal>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Why BBS ---------------- */}
      <section className="section section--sand services-why">
        <div className="container">
          <div className="services-why__head">
            <Reveal>
              <span className="eyebrow">Why BBS</span>
            </Reveal>
            <SplitText text={'Promises we put\nin *writing*'} className="services-why__title" />
          </div>
          <ul className="services-why__grid">
            {WHY.map(({ icon: Icon, value, suffix, title, text }) => (
              <li key={title} className="services-why__item">
                <span className="services-why__icon" aria-hidden>
                  <Icon size={24} strokeWidth={1.2} />
                </span>
                <p className="services-why__value serif">
                  <Counter value={value} suffix={suffix} />
                </p>
                <h3>{title}</h3>
                <p className="muted">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- Packages ---------------- */}
      <section className="section services-pkg">
        <div className="container">
          <SectionHead
            eyebrow="Packages"
            title={'Transparent pricing,\n*tailored* to you'}
            intro="Indicative starting prices including design, materials, manufacturing and installation. Every quote is itemised after your free consultation."
            center
          />
          <div className="services-pkg__grid">
            {PACKAGES.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.12} className="services-pkg__cell">
                <article className={`services-pkg__card${p.featured ? ' is-featured' : ''}`}>
                  {p.featured && <span className="services-pkg__badge">Most loved</span>}
                  <header>
                    <h3 className="services-pkg__name">{p.name}</h3>
                    <p className="muted">{p.description}</p>
                  </header>
                  <div className="services-pkg__price">
                    <span className="serif">{p.price}</span>
                    <span className="services-pkg__note">{p.note}</span>
                  </div>
                  <ul className="services-pkg__feat">
                    {p.features.map((f) => (
                      <li key={f}>
                        <Check size={16} strokeWidth={1.5} aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Magnetic strength={0.2} className="services-pkg__cta">
                    <Link to="/contact" className={`btn${p.featured ? ' btn--light' : ' btn--ghost'}`} data-cursor="Quote">
                      Get a quote <ArrowUpRight size={16} strokeWidth={1.25} />
                    </Link>
                  </Magnetic>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="services-pkg__fine muted">Prices exclude GST and appliances. No-cost EMI available on select packages.</p>
          </Reveal>
        </div>
      </section>

      <Process />

      {/* ---------------- Materials marquee ---------------- */}
      <section className="section--dark services-materials" aria-label="Materials we work with">
        <div className="container services-materials__head">
          <Reveal>
            <span className="eyebrow">Materials &amp; finishes</span>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="muted">Certified boards, honest hardware and finishes chosen to age gracefully in Indian homes.</p>
          </Reveal>
        </div>
        <Marquee items={MATERIALS} className="services-materials__marquee" />
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="section services-faq">
        <div className="container services-faq__grid">
          <div className="services-faq__side">
            <Reveal>
              <span className="eyebrow">Questions</span>
            </Reveal>
            <SplitText text={'Good to know\n*before* we begin'} className="services-faq__title" />
            <Reveal delay={0.1}>
              <p className="lead">Can’t find what you’re looking for? Our design team replies within one working day.</p>
            </Reveal>
            <Reveal delay={0.2}>
              <Link to="/contact" className="btn">
                Ask a question <ArrowUpRight size={16} strokeWidth={1.25} />
              </Link>
            </Reveal>
          </div>
          <Accordion />
        </div>
      </section>

      <CTA title={'Start with a free\n*design* consultation'} image={IMG.livingLuxe} />
    </div>
  )
}
