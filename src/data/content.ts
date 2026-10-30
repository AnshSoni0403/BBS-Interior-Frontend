import { IMG } from './site'

export const STATS = [
  { value: 14, suffix: '+', label: 'Years of craft' },
  { value: 850, suffix: '+', label: 'Homes delivered' },
  { value: 45, suffix: ' days', label: 'Average move-in' },
  { value: 10, suffix: ' yr', label: 'Warranty on modules' },
]

export const MARQUEE = ['Residential', 'Modular Kitchens', 'Wardrobes', 'Living Spaces', 'Villas', 'Workspaces', 'Turnkey Execution', 'Bespoke Furniture']

export interface Service {
  slug: string
  title: string
  short: string
  description: string
  image: string
  features: string[]
}

export const SERVICES: Service[] = [
  {
    slug: 'full-home',
    title: 'Full Home Interiors',
    short: 'Turnkey design for apartments and villas, from concept to keys.',
    description: 'One team, one timeline, one point of contact. We handle design, civil work, carpentry, lighting, décor and styling so you simply move in.',
    image: IMG.livingLuxe,
    features: ['3D walkthroughs before execution', 'Dedicated project manager', 'Site updates every week', 'Professional deep-clean & styling'],
  },
  {
    slug: 'modular-kitchens',
    title: 'Modular Kitchens',
    short: 'Ergonomic kitchens engineered for Indian cooking.',
    description: 'Factory-finished cabinets, soft-close hardware and layouts planned around how you actually cook — tadka, pressure cooker and all.',
    image: IMG.kitchenIsland,
    features: ['BWP marine ply carcass', 'Premium soft-close hardware', 'Chimney & hob integration', '10-year module warranty'],
  },
  {
    slug: 'wardrobes',
    title: 'Wardrobes & Storage',
    short: 'Walk-ins, sliding wardrobes and storage that disappears.',
    description: 'Made-to-measure storage with internal organisers, lofts and profile lighting, finished in lacquer, veneer, fabric or glass.',
    image: IMG.bedroomChandelier,
    features: ['Walk-in & sliding systems', 'Internal LED profiles', 'Jewellery & accessory drawers', 'Anti-termite treatment'],
  },
  {
    slug: 'living-bedroom',
    title: 'Living & Bedrooms',
    short: 'Layered, liveable rooms with bespoke furniture.',
    description: 'From TV walls and pooja units to upholstered headboards, we design furniture, lighting and soft furnishings as one composed story.',
    image: IMG.livingRattan,
    features: ['Custom furniture & upholstery', 'Pooja & display units', 'Layered lighting plans', 'Curtains, rugs & art curation'],
  },
  {
    slug: 'villas',
    title: 'Villas & Luxury Homes',
    short: 'Architectural interiors for large, statement homes.',
    description: 'For villas and penthouses we collaborate with your architect on space planning, material palettes, automation and landscape-led interiors.',
    image: IMG.villaPoolStair,
    features: ['Architect collaboration', 'Home automation & AV', 'Imported stone & finishes', 'Landscape & terrace design'],
  },
  {
    slug: 'commercial',
    title: 'Workspaces & Commercial',
    short: 'Offices, studios and boutiques that reflect your brand.',
    description: 'Design-and-build for offices, clinics, cafés and retail — planned for people, acoustics and brand experience.',
    image: IMG.officeLounge,
    features: ['Space planning & test-fits', 'Acoustic & lighting design', 'Brand-led material palettes', 'Phased, after-hours execution'],
  },
]

export const PACKAGES = [
  {
    name: 'Essential',
    price: '₹4.5 L',
    note: 'Starting · 1 BHK',
    description: 'Smart, durable essentials for a beautiful first home.',
    features: ['Modular kitchen & wardrobes', 'TV unit & storage', 'Standard laminate finishes', '2D layouts & 3D views', '45-day delivery'],
  },
  {
    name: 'Signature',
    price: '₹9 L',
    note: 'Starting · 2 BHK',
    description: 'Our most-loved package — full rooms, fully styled.',
    features: ['Everything in Essential', 'False ceiling & lighting', 'Premium acrylic / veneer finishes', 'Bespoke furniture & décor', 'Dedicated design lead'],
    featured: true,
  },
  {
    name: 'Luxe',
    price: '₹18 L',
    note: 'Starting · 3 BHK+',
    description: 'Couture interiors with imported finishes and full turnkey.',
    features: ['Everything in Signature', 'Civil & electrical work', 'Imported stone & hardware', 'Home automation', 'Art & styling concierge'],
  },
]

export const PROCESS = [
  { title: 'Meet & Discover', text: 'A relaxed conversation at our studio or your home about how you live, what you love and what you need.', image: IMG.livingWarm },
  { title: 'Concept & Moodboard', text: 'Layouts, material palettes and moodboards that capture the feeling before a single line is fixed.', image: IMG.consoleOrange },
  { title: '3D Visualisation', text: 'Photo-real 3D views of every room so you can walk through your home before we build it.', image: IMG.openLivingModern },
  { title: 'Craft & Execute', text: 'Factory-made modules, skilled site teams and weekly updates — tracked by your project manager.', image: IMG.kitchenDark },
  { title: 'Style & Handover', text: 'We deep-clean, style every shelf and hand you the keys to a home that is ready to live in.', image: IMG.bedroomLuxe },
]

export const TESTIMONIALS = [
  { quote: 'They listened more than they spoke, and somehow designed a home that feels like it has always been ours. Delivered a week early, too.', name: 'Ananya Mehta', role: '3 BHK · Bandra, Mumbai', avatar: IMG.p1 },
  { quote: 'The 3D walkthrough was exactly what we got — down to the brass handles. The most stress-free renovation we have ever done.', name: 'Vikram Rao', role: 'Villa · Lonavala', avatar: IMG.p2 },
  { quote: 'Our kitchen finally works the way we cook. Every drawer, every corner has been thought about.', name: 'Sanjay Kulkarni', role: 'Kitchen · Pune', avatar: IMG.p3 },
  { quote: 'Our team actually wants to come to the office now. BBS turned a bare shell into the best part of our culture.', name: 'Meera Iyer', role: 'Workspace · BKC', avatar: IMG.p4 },
]

export const FAQS = [
  { q: 'How long does a full home take?', a: 'Most 2–3 BHK apartments are delivered in 45–60 working days after design sign-off. Villas and large homes typically take 3–5 months.' },
  { q: 'Do you offer a free consultation?', a: 'Yes. Your first consultation — at our studio, your site or on video — is complimentary and comes with an indicative estimate.' },
  { q: 'Can I see my home before it is built?', a: 'Always. Every project includes photo-realistic 3D views, and Signature and Luxe projects include walkthrough videos.' },
  { q: 'What warranty do you provide?', a: 'Modular kitchens and wardrobes carry a 10-year warranty, with a 1-year on-site service warranty for all other work.' },
  { q: 'Do you offer EMI options?', a: 'Yes, we partner with leading banks and NBFCs to offer no-cost EMI on select packages.' },
]

export const TEAM = [
  { name: 'Bhavna B. Shah', role: 'Founder & Principal Designer', image: IMG.p4 },
  { name: 'Arjun Bhatia', role: 'Head of Design', image: IMG.p2 },
  { name: 'Sara Fernandes', role: 'Lead — Kitchens & Joinery', image: IMG.p5 },
  { name: 'Kabir Sethi', role: 'Director, Projects', image: IMG.p3 },
]

export const VALUES = [
  { title: 'Rooted in you', text: 'We design around rituals — morning chai, Sunday lunches, quiet reading — not trends.' },
  { title: 'Honest materials', text: 'Solid craftsmanship, certified boards and finishes that age gracefully.' },
  { title: 'Radically transparent', text: 'Itemised quotes, fixed timelines and a live tracker for every project.' },
  { title: 'Made to last', text: 'A 10-year warranty and a service team that answers long after handover.' },
]

export const TIMELINE = [
  { year: '2012', title: 'A two-person studio', text: 'Bhavna B. Shah opens BBS Interior in a 300 sq.ft studio in Lower Parel.' },
  { year: '2016', title: 'Our own workshop', text: 'A 20,000 sq.ft carpentry and finishing facility brings quality in-house.' },
  { year: '2019', title: 'Bengaluru opens', text: 'Our first experience centre outside Mumbai, with live kitchen displays.' },
  { year: '2023', title: '500 homes', text: 'We pass 500 delivered homes and launch the Luxe villa practice.' },
  { year: '2026', title: 'Design Lab, Pune', text: 'A materials library and 3D studio for clients to touch, feel and walk through.' },
]

export const ROOMS = ['Living', 'Bedroom', 'Kitchen', 'Dining', 'Bath', 'Workspace', 'Exteriors'] as const
export type Room = (typeof ROOMS)[number]

export const IDEAS: { room: Room; title: string; image: string }[] = [
  { room: 'Living', title: 'Rattan & bouclé living', image: IMG.livingRattan },
  { room: 'Living', title: 'Warm minimal lounge', image: IMG.livingWarm },
  { room: 'Living', title: 'Coffered classic', image: IMG.livingCoffered },
  { room: 'Living', title: 'Sage sofa nook', image: IMG.livingSage },
  { room: 'Living', title: 'Statement green wall', image: IMG.livingGreenWall },
  { room: 'Living', title: 'Gallery shelves', image: IMG.wallShelves },
  { room: 'Living', title: 'Boho afternoon', image: IMG.livingBoho },
  { room: 'Living', title: 'Pendant-lit lounge', image: IMG.livingPendants },
  { room: 'Bedroom', title: 'Chandelier suite', image: IMG.bedroomChandelier },
  { room: 'Bedroom', title: 'Tufted classic', image: IMG.bedroomLuxe },
  { room: 'Bedroom', title: 'Ink-black panelling', image: IMG.bedroomDark },
  { room: 'Bedroom', title: 'Linen & plants', image: IMG.bedroomPlants },
  { room: 'Bedroom', title: 'Boho layered bed', image: IMG.bedroomBoho },
  { room: 'Bedroom', title: 'Line-art calm', image: IMG.bedroomArt },
  { room: 'Kitchen', title: 'Marble island', image: IMG.kitchenIsland },
  { room: 'Kitchen', title: 'Graphite & brass', image: IMG.kitchenDark },
  { room: 'Kitchen', title: 'Open kitchen living', image: IMG.livingKitchenOpen },
  { room: 'Dining', title: 'Emerald dining', image: IMG.diningGreen },
  { room: 'Dining', title: 'Timber dining hall', image: IMG.livingDiningWood },
  { room: 'Dining', title: 'Breakfast corner', image: IMG.openKitchenDining },
  { room: 'Bath', title: 'Dark spa bath', image: IMG.bathDark },
  { room: 'Bath', title: 'Fresh white bath', image: IMG.bathWhite },
  { room: 'Workspace', title: 'Creative lounge', image: IMG.officeLounge },
  { room: 'Workspace', title: 'Studio corridor', image: IMG.officeCorridor },
  { room: 'Exteriors', title: 'Glass villa at dusk', image: IMG.villaNight },
  { room: 'Exteriors', title: 'Poolside stair', image: IMG.villaPoolStair },
  { room: 'Exteriors', title: 'Garden balcony', image: IMG.balcony },
]

export interface Post {
  slug: string
  title: string
  /** ISO date, display only */
  date: string
  category: string
  readTime: string
  cover: string
  excerpt: string
  body: string[]
  pull?: string
}

export const POSTS: Post[] = [
  {
    slug: 'designing-for-indian-light',
    title: 'Designing for Indian light: warm whites, deep shade',
    date: '2026-09-14',
    category: 'Guides',
    readTime: '6 min',
    cover: IMG.livingWarm,
    excerpt: 'Why the same paint looks completely different in Mumbai and Bengaluru — and how to choose a palette that works all day.',
    body: [
      'Light in India is generous, but it is rarely gentle. A west-facing living room in Mumbai can go from soft gold to harsh glare in the space of an hour.',
      'We start every palette with a light study: we photograph the room at morning, noon and evening, then test paint, fabric and veneer samples in each light.',
      'Warm whites with a hint of yellow or pink feel calm under strong sun, while deeper, earthy tones make shaded north rooms feel cosy instead of gloomy.',
      'Layer your lighting at night — ambient, task and accent — and keep colour temperatures between 2700K and 3000K for that soft, residential glow.',
    ],
    pull: 'Choose your palette in your own light, never in the showroom.',
  },
  {
    slug: 'the-modern-pooja-room',
    title: 'The modern pooja room: sacred, simple, beautiful',
    date: '2026-08-22',
    category: 'Ideas',
    readTime: '5 min',
    cover: IMG.foyerConsole,
    excerpt: 'Compact mandirs, backlit jaali and stone — five ways to design a serene prayer corner in a city apartment.',
    body: [
      'A pooja space does not need a full room. A well-proportioned niche with good lighting can feel just as sacred.',
      'Backlit CNC jaali panels, a solid wood base and a brass bell create a focal point without overwhelming the living room.',
      'Choose easy-to-clean surfaces like quartz or marble for the base, and plan concealed storage for diyas, incense and books.',
    ],
    pull: 'Light, proportion and stillness matter more than size.',
  },
  {
    slug: 'kitchen-layouts-that-work',
    title: 'Kitchen layouts that actually work for Indian cooking',
    date: '2026-07-30',
    category: 'Kitchens',
    readTime: '8 min',
    cover: IMG.kitchenIsland,
    excerpt: 'Parallel, L-shape or island? A practical guide to the work triangle, tall units and wet & dry zones.',
    body: [
      'Indian kitchens work hard: high-heat cooking, pressure cookers, daily grinding and lots of storage for grains and spices.',
      'We plan every kitchen around a wet zone, a dry zone and a cooking zone, then size the counters for real utensils, not catalogue ones.',
      'Tall units for appliances, a dedicated utility area and a powerful chimney make the biggest difference to everyday comfort.',
    ],
    pull: 'Design for the pressure cooker, not the photo shoot.',
  },
  {
    slug: 'small-bedroom-big-calm',
    title: 'Small bedroom, big calm: 7 tricks we use',
    date: '2026-06-18',
    category: 'Guides',
    readTime: '4 min',
    cover: IMG.bedroomPlants,
    excerpt: 'Floor-to-ceiling drapes, floating side tables and the one wardrobe finish that makes any room feel larger.',
    body: [
      'Hang curtains from the ceiling, not the window frame — it instantly makes the room feel taller.',
      'Use wall-mounted bedside tables and sconces to free up the floor, and choose a wardrobe finish close to your wall colour so it visually recedes.',
      'Finally, edit ruthlessly: one statement piece is calmer than five small ones.',
    ],
  },
]
