import { IMG } from './site'

export type Category = 'Residential' | 'Kitchen' | 'Bedroom' | 'Villa' | 'Commercial'

export interface Project {
  slug: string
  title: string
  category: Category
  location: string
  year: number
  area: string
  budget: string
  duration: string
  cover: string
  gallery: string[]
  summary: string
  story: string[]
  palette: { name: string; hex: string }[]
  materials: string[]
  quote?: { text: string; author: string }
  /** grid hint for the portfolio layout */
  size?: 'tall' | 'wide'
}

export const PROJECTS: Project[] = [
  {
    slug: 'the-rattan-residence',
    title: 'The Rattan Residence',
    category: 'Residential',
    location: 'Bandra West, Mumbai',
    year: 2026,
    area: '2,400 sq.ft · 3 BHK',
    budget: '₹38 – 42 L',
    duration: '68 days',
    cover: IMG.livingRattan,
    gallery: [IMG.livingPendants, IMG.bedroomBoho, IMG.diningGreen, IMG.consoleOrange],
    summary: 'A sun-washed sea-facing apartment layered in cane, linen and hand-thrown ceramics.',
    story: [
      'The brief was simple: a home that slows you down. We stripped the apartment back to its bones, opened the kitchen to the living room and let the Arabian Sea light do the heavy lifting.',
      'Rattan pendants, bouclé seating and a palette of oat, clay and sage keep the rooms soft through the day, while walnut joinery anchors everything with quiet warmth.',
    ],
    palette: [
      { name: 'Oat', hex: '#E9DFCF' },
      { name: 'Clay', hex: '#B9825C' },
      { name: 'Sage', hex: '#9AA58C' },
      { name: 'Walnut', hex: '#5A4031' },
    ],
    materials: ['Natural cane', 'Bouclé upholstery', 'Smoked walnut veneer', 'Lime plaster', 'Handmade terracotta'],
    quote: { text: 'Every evening it feels like we are on holiday. BBS understood us better than we understood ourselves.', author: 'Ananya & Rohan Mehta' },
    size: 'tall',
  },
  {
    slug: 'casa-noir-villa',
    title: 'Casa Noir Villa',
    category: 'Villa',
    location: 'Alibaug, Maharashtra',
    year: 2025,
    area: '6,800 sq.ft · 5 BHK',
    budget: '₹1.6 Cr',
    duration: '5 months',
    cover: IMG.villaNight,
    gallery: [IMG.villaPoolStair, IMG.bedroomGlass, IMG.livingDiningWood, IMG.bathDark],
    summary: 'A weekend villa where charcoal, glass and teak frame the garden at every turn.',
    story: [
      'Designed around an ancient rain tree, Casa Noir pulls the outdoors inside through floor-to-ceiling glazing and a floating teak staircase.',
      'We kept the interiors deliberately tonal — charcoal, smoked oak and travertine — so the landscape remains the hero from dawn to dusk.',
    ],
    palette: [
      { name: 'Charcoal', hex: '#2E2C2A' },
      { name: 'Travertine', hex: '#D8CBB5' },
      { name: 'Teak', hex: '#8A5A36' },
      { name: 'Moss', hex: '#5E6B4E' },
    ],
    materials: ['Burma teak', 'Travertine', 'Fluted glass', 'Micro-cement', 'Blackened steel'],
    quote: { text: 'Calm, confident and impossibly detailed. Our guests never want to leave.', author: 'The Kapoor Family' },
    size: 'wide',
  },
  {
    slug: 'sage-and-walnut-kitchen',
    title: 'Sage & Walnut Kitchen',
    category: 'Kitchen',
    location: 'Koregaon Park, Pune',
    year: 2026,
    area: '220 sq.ft · Parallel',
    budget: '₹9.5 L',
    duration: '32 days',
    cover: IMG.kitchenIsland,
    gallery: [IMG.kitchenDark, IMG.openKitchenDining, IMG.livingKitchenOpen],
    summary: 'A chef’s kitchen with a marble-topped island, hidden appliances and fluted cabinetry.',
    story: [
      'For a family that cooks together every night, we designed a kitchen built around the island — prep, conversation and homework all happen here.',
      'Handle-less shutters, a tall appliance wall and a concealed pantry keep the counters clear, while brass details catch the evening light.',
    ],
    palette: [
      { name: 'Chalk', hex: '#F1ECE3' },
      { name: 'Sage', hex: '#8F9B83' },
      { name: 'Brass', hex: '#B08D57' },
      { name: 'Graphite', hex: '#3B3A38' },
    ],
    materials: ['Italian marble', 'Acrylic shutters', 'Brushed brass', 'Quartz backsplash', 'BWP marine ply'],
  },
  {
    slug: 'the-quiet-suite',
    title: 'The Quiet Suite',
    category: 'Bedroom',
    location: 'Indiranagar, Bengaluru',
    year: 2025,
    area: '420 sq.ft · Master suite',
    budget: '₹7.8 L',
    duration: '28 days',
    cover: IMG.bedroomChandelier,
    gallery: [IMG.bedroomLuxe, IMG.bedroomClassic, IMG.bedroomArt],
    summary: 'A hotel-calm master suite with an upholstered headwall, crystal light and layered linen.',
    story: [
      'Our clients wanted the feeling of their favourite boutique hotel, every single night. We softened the room with a full-height upholstered headwall and wall-to-wall drapery.',
      'A walk-in wardrobe in smoked glass, bedside niches with dimmable lighting and a reading corner complete the retreat.',
    ],
    palette: [
      { name: 'Ivory', hex: '#F3EEE6' },
      { name: 'Mink', hex: '#9C8C7C' },
      { name: 'Ink', hex: '#22252B' },
      { name: 'Champagne', hex: '#CDB68C' },
    ],
    materials: ['Velvet headwall', 'Crystal chandelier', 'Smoked glass', 'Engineered oak', 'Linen drapery'],
    size: 'tall',
  },
  {
    slug: 'atelier-workspace',
    title: 'Atelier Workspace',
    category: 'Commercial',
    location: 'BKC, Mumbai',
    year: 2024,
    area: '9,200 sq.ft · 120 seats',
    budget: '₹2.1 Cr',
    duration: '4 months',
    cover: IMG.officeLounge,
    gallery: [IMG.officeCorridor, IMG.livingOpen],
    summary: 'A design-led office for a creative agency — part studio, part living room.',
    story: [
      'We replaced cubicles with neighbourhoods: focus booths, a library lounge and a café that doubles as a town-hall space.',
      'Acoustic felt, warm timber and residential-style lighting make long days feel human.',
    ],
    palette: [
      { name: 'Paper', hex: '#EEEAE3' },
      { name: 'Teal', hex: '#2F5E5B' },
      { name: 'Oak', hex: '#B89470' },
      { name: 'Slate', hex: '#4A4E54' },
    ],
    materials: ['Acoustic felt', 'White oak', 'Polished concrete', 'Glass partitions', 'Linoleum'],
    size: 'wide',
  },
  {
    slug: 'linen-and-light',
    title: 'Linen & Light',
    category: 'Residential',
    location: 'Baner, Pune',
    year: 2026,
    area: '1,450 sq.ft · 2 BHK',
    budget: '₹22 L',
    duration: '52 days',
    cover: IMG.livingNeutral,
    gallery: [IMG.livingSage, IMG.bedroomPlants, IMG.wallShelves],
    summary: 'A young couple’s first home — airy, gallery-like and full of plants.',
    story: [
      'We used a single warm-white base throughout so the couple’s collected art and ceramics could shine.',
      'Floating shelves, a reading nook by the window and a compact study tucked into the hallway make every square foot count.',
    ],
    palette: [
      { name: 'Linen', hex: '#EFE9DF' },
      { name: 'Stone', hex: '#BDB3A5' },
      { name: 'Fern', hex: '#6E7D5C' },
      { name: 'Cocoa', hex: '#6B4E3D' },
    ],
    materials: ['Linen', 'Ash veneer', 'Jute', 'Matte laminate', 'Cement tiles'],
  },
  {
    slug: 'monsoon-house',
    title: 'Monsoon House',
    category: 'Villa',
    location: 'Lonavala, Maharashtra',
    year: 2024,
    area: '4,900 sq.ft · 4 BHK',
    budget: '₹96 L',
    duration: '4 months',
    cover: IMG.livingDiningWood,
    gallery: [IMG.villaExterior, IMG.bedroomGlass, IMG.balcony],
    summary: 'A hillside retreat made for long rainy afternoons and big family lunches.',
    story: [
      'Deep verandas, a sunken living room and a 12-seater dining table bring three generations together.',
      'Weather-proof teak, stone floors and wool rugs make the house as comfortable in the monsoon as it is in winter.',
    ],
    palette: [
      { name: 'Mist', hex: '#DCDAD3' },
      { name: 'Teak', hex: '#7E5636' },
      { name: 'Basalt', hex: '#3A3835' },
      { name: 'Leaf', hex: '#667155' },
    ],
    materials: ['Kota stone', 'Teak', 'Wool rugs', 'Lime wash', 'Wrought iron'],
    size: 'tall',
  },
  {
    slug: 'midnight-master',
    title: 'Midnight Master',
    category: 'Bedroom',
    location: 'Jubilee Hills, Hyderabad',
    year: 2025,
    area: '380 sq.ft · Master suite',
    budget: '₹6.4 L',
    duration: '26 days',
    cover: IMG.bedroomDark,
    gallery: [IMG.bedroomNavy, IMG.bedroomWhite],
    summary: 'A moody, cocooning bedroom in ink-black panelling and soft brass light.',
    story: [
      'Dark walls make a room feel endless at night. We wrapped this suite in matte ink panelling and let warm brass sconces glow against it.',
      'Blackout drapery, a padded bench and a hidden TV unit keep the room calm and uncluttered.',
    ],
    palette: [
      { name: 'Ink', hex: '#1F1F22' },
      { name: 'Smoke', hex: '#77726C' },
      { name: 'Brass', hex: '#B79257' },
      { name: 'Cream', hex: '#EEE7DA' },
    ],
    materials: ['Matte PU panelling', 'Brass', 'Velvet', 'Oak flooring', 'Blackout drapery'],
  },
  {
    slug: 'the-green-dining',
    title: 'The Green Dining',
    category: 'Residential',
    location: 'Satellite, Ahmedabad',
    year: 2025,
    area: '1,900 sq.ft · 3 BHK',
    budget: '₹27 L',
    duration: '58 days',
    cover: IMG.diningGreen,
    gallery: [IMG.livingGreenWall, IMG.foyerConsole, IMG.livingPlants],
    summary: 'Emerald velvet, a round marble table and a foyer that sets the tone.',
    story: [
      'This family loves to host, so the dining room became the heart of the home — emerald chairs around a round marble table under a sculptural pendant.',
      'A mirrored foyer console and a plant-filled living room carry the green story throughout.',
    ],
    palette: [
      { name: 'Emerald', hex: '#2F5A47' },
      { name: 'Marble', hex: '#EFEDE8' },
      { name: 'Rattan', hex: '#C49A62' },
      { name: 'Ebony', hex: '#2B2522' },
    ],
    materials: ['Velvet', 'Statuario marble', 'Cane', 'Brass inlay', 'Herringbone oak'],
    size: 'wide',
  },
]

export const CATEGORIES: ('All' | Category)[] = ['All', 'Residential', 'Villa', 'Kitchen', 'Bedroom', 'Commercial']

export const getProject = (slug?: string) => PROJECTS.find((p) => p.slug === slug)
