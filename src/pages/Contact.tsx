import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Clock, LoaderCircle, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { EASE, Reveal, SplitText, gsap, useGSAP, useLoader, useRefreshOnLoad, prefersReducedMotion } from '../lib/motion'
import { Accordion } from '../components/Sections'
import { Magnetic } from '../components/Effects'
import { img, SITE } from '../data/site'
import '../styles/pages/contact.css'

const CITIES = ['Mumbai', 'Bengaluru', 'Pune', 'Other']
const PROPERTY = ['1 BHK', '2 BHK', '3 BHK', '4 BHK+', 'Villa', 'Office']
const BUDGET = ['₹5–10 L', '₹10–20 L', '₹20–40 L', '₹40 L+']
const SCOPE = ['Kitchen', 'Wardrobes', 'Full home', 'Living', 'Bedroom']

interface FormState {
  name: string
  phone: string
  email: string
  city: string
  property: string
  budget: string
  scope: string[]
  message: string
}
type Field = keyof FormState
type Errors = Partial<Record<Field, string>>

const EMPTY: FormState = { name: '', phone: '', email: '', city: '', property: '', budget: '', scope: [], message: '' }

const normalisePhone = (v: string) => v.replace(/[\s-]/g, '').replace(/^(\+91|91(?=\d{10}$)|0)/, '')

function validate(f: FormState): Errors {
  const e: Errors = {}
  if (f.name.trim().length < 2) e.name = 'Please tell us your name.'
  if (!/^[6-9]\d{9}$/.test(normalisePhone(f.phone))) e.phone = 'Enter a valid 10-digit Indian mobile number.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Enter a valid email address.'
  if (!f.city) e.city = 'Choose the city closest to you.'
  if (!f.property) e.property = 'Select your property type.'
  return e
}

const ORDER: Field[] = ['name', 'phone', 'email', 'city', 'property']

/* ------------------------------------------------------------------ */
/* Small form primitives                                               */
/* ------------------------------------------------------------------ */

function FieldShell({ id, label, error, filled, children, wide }: { id: string; label: string; error?: string; filled: boolean; children: ReactNode; wide?: boolean }) {
  return (
    <div className={`contact-field${filled ? ' is-filled' : ''}${error ? ' has-error' : ''}${wide ? ' contact-field--wide' : ''}`}>
      {children}
      <label htmlFor={id} className="contact-field__label">
        {label}
      </label>
      <span className="contact-field__line" aria-hidden />
      <AnimatePresence>
        {error && (
          <motion.span
            id={`${id}-error`}
            className="contact-field__error"
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

function Chips({ id, label, options, value, onChange, error, optional }: { id: string; label: string; options: string[]; value: string; onChange: (v: string) => void; error?: string; optional?: boolean }) {
  return (
    <div className={`contact-chips${error ? ' has-error' : ''}`}>
      <span id={`${id}-label`} className="contact-group__label">
        {label} {optional && <span className="muted">(optional)</span>}
      </span>
      <div className="contact-chips__row" role="group" aria-labelledby={`${id}-label`} aria-describedby={error ? `${id}-error` : undefined} id={id} tabIndex={-1}>
        {options.map((o) => {
          const on = value === o
          return (
            <button key={o} type="button" className={`contact-chip${on ? ' is-on' : ''}`} aria-pressed={on} onClick={() => onChange(on ? '' : o)}>
              {on && <motion.span layoutId={`${id}-chip`} className="contact-chip__bg" transition={{ duration: 0.5, ease: EASE }} />}
              <span className="contact-chip__text">{o}</span>
            </button>
          )
        })}
      </div>
      <AnimatePresence>
        {error && (
          <motion.span id={`${id}-error`} className="contact-field__error" role="alert" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Consultation form                                                   */
/* ------------------------------------------------------------------ */

function ConsultationForm() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [sentName, setSentName] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'sent') successRef.current?.focus()
  }, [status])

  const set = <K extends Field>(k: K, v: FormState[K]) => {
    const next = { ...form, [k]: v }
    setForm(next)
    if (touched[k] || errors[k]) setErrors((e) => ({ ...e, [k]: validate(next)[k] }))
  }

  const onText = (k: 'name' | 'phone' | 'email' | 'city' | 'message') => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => set(k, e.target.value)

  const onBlur = (k: Field) => () => {
    setTouched((t) => ({ ...t, [k]: true }))
    setErrors((e) => ({ ...e, [k]: validate(form)[k] }))
  }

  const toggleScope = (s: string) => set('scope', form.scope.includes(s) ? form.scope.filter((x) => x !== s) : [...form.scope, s])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    const errs = validate(form)
    setErrors(errs)
    setTouched({ name: true, phone: true, email: true, city: true, property: true })
    const first = ORDER.find((k) => errs[k])
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`#contact-${first}`)?.focus()
      return
    }
    setStatus('sending')
    // Frontend only — simulate the request.
    window.setTimeout(() => {
      setSentName(form.name.trim().split(' ')[0])
      setStatus('sent')
    }, 1200)
  }

  const reset = () => {
    setForm(EMPTY)
    setErrors({})
    setTouched({})
    setStatus('idle')
  }

  const describe = (k: Field) => (errors[k] ? { 'aria-invalid': true as const, 'aria-describedby': `contact-${k}-error` } : {})

  return (
    <div className="contact-form-wrap">
      <AnimatePresence mode="wait" initial={false}>
        {status !== 'sent' ? (
          <motion.form
            key="form"
            ref={formRef}
            className="contact-form"
            onSubmit={submit}
            noValidate
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
            transition={{ duration: 0.6, ease: EASE }}
            aria-busy={status === 'sending'}
          >
            <div className="contact-form__head">
              <span className="eyebrow">Free consultation</span>
              <h2 className="contact-form__title">
                Tell us about your <em>home</em>
              </h2>
              <p className="muted">It takes under a minute. A design lead will call you within one working day.</p>
            </div>

            <div className="contact-form__grid">
              <FieldShell id="contact-name" label="Full name" error={errors.name} filled={!!form.name}>
                <input id="contact-name" name="name" type="text" autoComplete="name" placeholder=" " value={form.name} onChange={onText('name')} onBlur={onBlur('name')} required {...describe('name')} />
              </FieldShell>
              <FieldShell id="contact-phone" label="Mobile number" error={errors.phone} filled={!!form.phone}>
                <input id="contact-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder=" " maxLength={16} value={form.phone} onChange={onText('phone')} onBlur={onBlur('phone')} required {...describe('phone')} />
              </FieldShell>
              <FieldShell id="contact-email" label="Email address" error={errors.email} filled={!!form.email}>
                <input id="contact-email" name="email" type="email" autoComplete="email" placeholder=" " value={form.email} onChange={onText('email')} onBlur={onBlur('email')} required {...describe('email')} />
              </FieldShell>
              <FieldShell id="contact-city" label="City" error={errors.city} filled={!!form.city}>
                <select id="contact-city" name="city" value={form.city} onChange={onText('city')} onBlur={onBlur('city')} required {...describe('city')}>
                  <option value="" disabled hidden />
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </FieldShell>
            </div>

            <Chips id="contact-property" label="Property type" options={PROPERTY} value={form.property} onChange={(v) => set('property', v)} error={errors.property} />
            <Chips id="contact-budget" label="Approximate budget" options={BUDGET} value={form.budget} onChange={(v) => set('budget', v)} optional />

            <fieldset className="contact-scope">
              <legend className="contact-group__label">
                What should we design? <span className="muted">(select all that apply)</span>
              </legend>
              <div className="contact-scope__row">
                {SCOPE.map((s) => (
                  <label key={s} className={`contact-check${form.scope.includes(s) ? ' is-on' : ''}`}>
                    <input type="checkbox" name="scope" value={s} checked={form.scope.includes(s)} onChange={() => toggleScope(s)} />
                    <span className="contact-check__box" aria-hidden>
                      <svg viewBox="0 0 16 16">
                        <path d="M3.5 8.5l3 3 6-7" />
                      </svg>
                    </span>
                    <span>{s}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <FieldShell id="contact-message" label="Anything else? Possession date, style, must-haves…" filled={!!form.message} wide>
              <textarea id="contact-message" name="message" rows={4} placeholder=" " value={form.message} onChange={onText('message')} />
            </FieldShell>

            <div className="contact-form__foot">
              <button type="submit" className={`btn contact-submit${status === 'sending' ? ' is-loading' : ''}`} disabled={status === 'sending'}>
                <AnimatePresence mode="wait" initial={false}>
                  {status === 'sending' ? (
                    <motion.span key="l" className="contact-submit__inner" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }}>
                      <LoaderCircle size={16} strokeWidth={1.5} className="contact-spin" /> Sending
                    </motion.span>
                  ) : (
                    <motion.span key="s" className="contact-submit__inner" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }}>
                      Request a callback <ArrowUpRight size={16} strokeWidth={1.5} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <p className="contact-form__note muted">We never share your details. No spam, ever.</p>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="sent"
            ref={successRef}
            tabIndex={-1}
            className="contact-success"
            role="status"
            initial={{ opacity: 0, y: 30, clipPath: 'inset(10% 0% 10% 0% round 18px)' }}
            animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 18px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <svg className="contact-success__icon" viewBox="0 0 80 80" aria-hidden>
              <motion.circle cx="40" cy="40" r="37" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: EASE, delay: 0.2 }} />
              <motion.path d="M25 41l10 10 20-22" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: EASE, delay: 0.9 }} />
            </svg>
            <span className="eyebrow">Request received</span>
            <h2 className="contact-success__title">
              Thank you, <em>{sentName || 'friend'}</em>.
            </h2>
            <p className="lead">Your story has reached our studio. A design lead will call you within one working day to plan your free consultation.</p>
            <div className="contact-success__actions">
              <Link to="/portfolio" className="btn">
                Browse our work <ArrowUpRight size={16} strokeWidth={1.5} />
              </Link>
              <button type="button" className="link-line" onClick={reset}>
                Send another request
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Contact() {
  useRefreshOnLoad()
  const root = useRef<HTMLDivElement>(null)
  const { ready } = useLoader()

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.utils.toArray<HTMLElement>('.contact-studio__img').forEach((el) => {
        gsap.fromTo(el, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
      gsap.fromTo(
        '.contact-studio',
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '.contact-studios__grid', start: 'top 82%' } },
      )
    },
    { scope: root },
  )

  const details = [
    { icon: Phone, label: 'Call the studio', value: SITE.phone, href: `tel:${SITE.phone.replace(/\s/g, '')}` },
    { icon: MessageCircle, label: 'WhatsApp', value: 'Chat with a designer', href: `https://wa.me/${SITE.whatsapp}`, external: true },
    { icon: Mail, label: 'Write to us', value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: Clock, label: 'Studio hours', value: SITE.hours },
  ]

  return (
    <div ref={root} className="contact">
      <section className="contact-hero">
        <div className="container contact-hero__grid">
          <div className="contact-hero__intro">
            <motion.nav className="crumbs" aria-label="Breadcrumb" initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ delay: 0.5, duration: 1 }}>
              <Link to="/">Home</Link>
              <span aria-hidden> / </span>
              <span aria-current="page">Contact</span>
            </motion.nav>
            <motion.span className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }} transition={{ delay: 0.5, duration: 1, ease: EASE }}>
              Contact · Book a visit
            </motion.span>
            <SplitText as="h1" text={'Let’s begin\nyour *story*'} className="contact-hero__title" play={ready} delay={0.55} />
            <motion.p className="lead" initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ delay: 1, duration: 1.1, ease: EASE }}>
              Every home we design begins with a conversation. Share a few details and we’ll set up a relaxed, no-obligation consultation — at our studio, your site or on video.
            </motion.p>

            <motion.ul
              className="contact-details"
              initial="hidden"
              animate={ready ? 'show' : 'hidden'}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 1.15 } } }}
            >
              {details.map(({ icon: Icon, label, value, href, external }) => (
                <motion.li key={label} variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } } }}>
                  <span className="contact-details__icon" aria-hidden>
                    <Icon size={18} strokeWidth={1.25} />
                  </span>
                  <span className="contact-details__text">
                    <span className="contact-details__label">{label}</span>
                    {href ? (
                      <a href={href} className="contact-details__value contact-hoverline" {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                        {value}
                      </a>
                    ) : (
                      <span className="contact-details__value">{value}</span>
                    )}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <motion.div className="contact-hero__form" initial={{ opacity: 0, y: 60 }} animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }} transition={{ duration: 1.2, ease: EASE, delay: 0.8 }}>
            <ConsultationForm />
          </motion.div>
        </div>
      </section>

      <section className="section section--sand contact-studios" aria-label="Our studios">
        <div className="container">
          <div className="contact-studios__head">
            <div>
              <Reveal>
                <span className="eyebrow">Visit us</span>
              </Reveal>
              <SplitText text={'Three studios,\none *warm welcome*'} className="contact-studios__title" />
            </div>
            <Reveal delay={0.1}>
              <p className="lead">Touch the materials, open the drawers and walk through full-scale kitchens and wardrobes. Walk-ins are welcome; appointments get a dedicated designer.</p>
            </Reveal>
          </div>

          <div className="contact-studios__grid">
            {SITE.studios.map((s, i) => (
              <article key={s.city} className="contact-studio">
                <div className="contact-studio__media arch">
                  <img className="contact-studio__img" src={img(s.image, 900)} alt={`${s.label} in ${s.city}`} loading="lazy" />
                  <span className="contact-studio__num serif">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="contact-studio__body">
                  <span className="eyebrow">{s.label}</span>
                  <h3 className="contact-studio__city">{s.city}</h3>
                  <p className="muted contact-studio__addr">
                    <MapPin size={15} strokeWidth={1.25} aria-hidden /> <span>{s.address}</span>
                  </p>
                  <a
                    className="link-line"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Get directions to our ${s.city} ${s.label} (opens Google Maps)`}
                  >
                    Get directions <ArrowUpRight size={14} strokeWidth={1.5} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section contact-faq" aria-label="Frequently asked questions">
        <div className="container contact-faq__grid">
          <div className="contact-faq__side">
            <Reveal>
              <span className="eyebrow">Good to know</span>
            </Reveal>
            <SplitText text={'Questions,\n*answered*'} className="contact-faq__title" />
            <Reveal delay={0.15}>
              <p className="lead">Still curious? Our designers are a message away — and happy to talk through anything, from timelines to tiles.</p>
            </Reveal>
            <Reveal delay={0.25}>
              <Magnetic>
                <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
                  <MessageCircle size={16} strokeWidth={1.5} /> Ask on WhatsApp
                </a>
              </Magnetic>
            </Reveal>
          </div>
          <Accordion />
        </div>
      </section>
    </div>
  )
}
