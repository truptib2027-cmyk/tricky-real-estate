/**
 * TRICKY REAL ESTATE - SAMPLE DATASET
 * 5 Developers, 6 Off-Plan Projects, 15 Ready Properties, Staff/Admin Accounts, 40 Scored Leads, 10 Viewings, 5 Sales
 */

const developers = [
  {
    id: 1,
    name: 'Aurelia Signature Developments',
    slug: 'aurelia-signature',
    established_year: 2012,
    headquarters: 'DIFC, Dubai, UAE',
    description: 'Pioneers of sculptural high-rise architecture and ultra-luxury residential towers with cantilevered glass sky pools and private concierge clubs.',
    total_projects: 14
  },
  {
    id: 2,
    name: 'Solstice Prime Holdings',
    slug: 'solstice-prime',
    established_year: 2015,
    headquarters: 'Dubai Marina Promenade, Dubai, UAE',
    description: 'Specialists in prime waterfront living, signature yacht-berth estates, and private island developments crafted in rare natural travertine.',
    total_projects: 9
  },
  {
    id: 3,
    name: 'Mirage Architectural Group',
    slug: 'mirage-architectural',
    established_year: 2008,
    headquarters: 'Emaar Square, Downtown Dubai, UAE',
    description: 'Internationally awarded developers renowned for desert-oasis private estates, championship golf course villas, and minimalist mansions.',
    total_projects: 18
  },
  {
    id: 4,
    name: 'Valence Living Dubai',
    slug: 'valence-living',
    established_year: 2017,
    headquarters: 'Business Bay Canal, Dubai, UAE',
    description: 'Curators of boutique, tech-integrated urban residences and canal-facing executive sky suites with sustainable zero-carbon engineering.',
    total_projects: 7
  },
  {
    id: 5,
    name: 'Elysian Heritage Developments',
    slug: 'elysian-heritage',
    established_year: 2014,
    headquarters: 'Palm Jumeirah Gateway, Dubai, UAE',
    description: 'Bespoke ultra-prime developers dedicated to low-density luxury beachfront villas, curated private islands, and branded penthouses.',
    total_projects: 11
  }
];

const staff_logins = [
  {
    id: 0,
    name: 'Jay (Managing Director)',
    email: 'admin@trickyrealestate.ae',
    password: 'TrickyAdmin2026!',
    role: 'admin',
    phone: '+971 4 800 8742',
    bio: 'Founder and Principal Managing Director overseeing sovereign family office mandates and prime portfolio acquisitions.',
    avatar_url: 'assets/images/agent_tariq.jpg',
    monthly_target_aed: 50000000
  },
  {
    id: 1,
    name: 'Tariq Al-Mansoor',
    email: 'tariq@trickyrealestate.ae',
    password: 'Tariq2026!',
    role: 'agent',
    phone: '+971 50 821 9901',
    bio: 'Over 16 years specializing in trophy Palm Jumeirah mansions and confidential sovereign asset acquisitions.',
    avatar_url: 'assets/images/agent_tariq.jpg',
    monthly_target_aed: 35000000
  },
  {
    id: 2,
    name: 'Elena Rostova',
    email: 'elena@trickyrealestate.ae',
    password: 'Elena2026!',
    role: 'agent',
    phone: '+971 52 443 8812',
    bio: 'Renowned authority on Dubai Marina tri-level sky penthouses and Downtown view residences.',
    avatar_url: 'assets/images/agent_elena.jpg',
    monthly_target_aed: 30000000
  },
  {
    id: 3,
    name: 'Marcus Sterling',
    email: 'marcus@trickyrealestate.ae',
    password: 'Marcus2026!',
    role: 'agent',
    phone: '+971 55 119 7734',
    bio: 'Specialist in early institutional allocation, high-yield off-plan portfolios, and UAE Golden Visa structuring.',
    avatar_url: 'assets/images/agent_marcus.jpg',
    monthly_target_aed: 25000000
  }
];

const off_plan_projects = [
  {
    id: 1,
    slug: 'the-aurelia-residences',
    name: 'The Aurelia Residences',
    developer_id: 1,
    community: 'Downtown Dubai',
    starting_price_aed: 6200000,
    handover_date: 'Q4 2026',
    payment_plan_summary: '60/40 Milestone Plan (20% Down)',
    down_payment_pct: 20,
    during_construction_pct: 40,
    on_handover_pct: 40,
    description: 'An avant-garde sculptural tower ascending over Downtown Dubai with cascading sky gardens and private cantilevered glass plunge pools. Unhindered vistas of Burj Khalifa and Dubai Canal with 7-star branded concierge services.',
    bedrooms_available: '2, 3 & 4 Bedrooms',
    roi_estimate: '8.4% Net Yield',
    image_url: 'assets/images/offplan_tower.jpg',
    featured: true
  },
  {
    id: 2,
    slug: 'solstice-water-tower',
    name: 'Solstice Water Tower',
    developer_id: 2,
    community: 'Dubai Marina',
    starting_price_aed: 4950000,
    handover_date: 'Q2 2027',
    payment_plan_summary: '70/30 Construction Plan',
    down_payment_pct: 20,
    during_construction_pct: 50,
    on_handover_pct: 30,
    description: 'Visionary waterfront architecture directly on the marina promenade. Features floor-to-ceiling panoramic glass, sunset yacht decks, lagoon wellness club, and direct water taxi connectivity to Downtown.',
    bedrooms_available: '1, 2, 3 & 4 Bedrooms',
    roi_estimate: '9.1% Net Yield',
    image_url: 'assets/images/offplan_tower.jpg',
    featured: true
  },
  {
    id: 3,
    slug: 'mirage-reserve-villas',
    name: 'Mirage Reserve Villas',
    developer_id: 3,
    community: 'Dubai Hills Estate',
    starting_price_aed: 18500000,
    handover_date: 'Q1 2027',
    payment_plan_summary: '80/20 Flexible Plan',
    down_payment_pct: 20,
    during_construction_pct: 60,
    on_handover_pct: 20,
    description: 'A discreet enclave of 38 contemporary estate villas overlooking the pristine championship fairway. Boasts private basement galleries, zen courtyards, and zero-edge horizon lap pools.',
    bedrooms_available: '5 & 6 Bedrooms',
    roi_estimate: '7.8% Net Yield',
    image_url: 'assets/images/golf_mansion.jpg',
    featured: true
  },
  {
    id: 4,
    slug: 'valence-horizon-suites',
    name: 'Valence Horizon Suites',
    developer_id: 4,
    community: 'Business Bay',
    starting_price_aed: 2800000,
    handover_date: 'Q3 2026',
    payment_plan_summary: '50/50 Post-Handover 2yr Option',
    down_payment_pct: 20,
    during_construction_pct: 30,
    on_handover_pct: 50,
    description: 'Tech-enabled executive canal-front residences equipped with AI climate controls, biometric access, and floor-to-ceiling views of the Dubai Water Canal and Downtown skyline.',
    bedrooms_available: '1, 2 & 3 Bedrooms',
    roi_estimate: '8.8% Net Yield',
    image_url: 'assets/images/hero_skyline.jpg',
    featured: false
  },
  {
    id: 5,
    slug: 'elysian-palm-crest',
    name: 'Elysian Palm Crest',
    developer_id: 5,
    community: 'Palm Jumeirah',
    starting_price_aed: 24000000,
    handover_date: 'Q4 2027',
    payment_plan_summary: '60/40 Construction Milestone',
    down_payment_pct: 25,
    during_construction_pct: 35,
    on_handover_pct: 40,
    description: 'Ultra-exclusive low-rise beachfront sanctuary on the Crescent. Only 22 limited-edition residences with private plunge pools, private beach access, and signature wellness spa.',
    bedrooms_available: '3, 4 & 5 Bedrooms',
    roi_estimate: '7.5% Net Yield',
    image_url: 'assets/images/palm_villa.jpg',
    featured: true
  },
  {
    id: 6,
    slug: 'the-zenith-courtyard-jvc',
    name: 'The Zenith Courtyard',
    developer_id: 1,
    community: 'Jumeirah Village Circle (JVC)',
    starting_price_aed: 980000,
    handover_date: 'Q1 2026',
    payment_plan_summary: '60/40 Investor Yield Plan',
    down_payment_pct: 15,
    during_construction_pct: 45,
    on_handover_pct: 40,
    description: 'High-yield boutique urban residence in District 12 of JVC. Designed for modern investors seeking strong cashflow, complete with private rooftop cinema, coworking lounge, and resort pool.',
    bedrooms_available: 'Studio, 1 & 2 Bedrooms',
    roi_estimate: '10.2% Net Yield',
    image_url: 'assets/images/beachfront_residence.jpg',
    featured: false
  }
];

const properties = [
  {
    id: 1,
    slug: 'villa-seraphina-palm-jumeirah',
    title: 'Villa Seraphina',
    property_type: 'Villa',
    community: 'Palm Jumeirah',
    sub_community: 'Frond N',
    price_aed: 54000000,
    bedrooms: 6,
    bathrooms: 8,
    built_up_sqft: 14200,
    status: 'Ready',
    featured: true,
    description: 'A bespoke beachfront sanctuary on the exclusive Fronds of Palm Jumeirah. Features private infinity pool, travertine marble terraces, direct Persian Gulf beach frontage, Italian artisan interiors, staff quarters, and 5-car subterranean gallery.',
    image_url: 'assets/images/palm_villa.jpg',
    amenities: ['Private Beach Frontage', 'Infinity Lap Pool', 'Subterranean Car Gallery', 'Italian Artisan Kitchen', 'Smart Home Automation', 'Staff Quarters'],
    agent_id: 1
  },
  {
    id: 2,
    slug: 'the-grand-sky-penthouse-marina',
    title: 'The Grand Sky Penthouse',
    property_type: 'Penthouse',
    community: 'Dubai Marina',
    sub_community: 'Marina Promenade',
    price_aed: 28500000,
    bedrooms: 5,
    bathrooms: 6,
    built_up_sqft: 9800,
    status: 'Ready',
    featured: true,
    description: 'Crown jewel tri-level sky penthouse perched above glittering Dubai Marina yachts. Boasting double-height 7-meter ceilings, private internal elevator, rooftop sunset deck with infinity jacuzzi, and 360-degree marine and city views.',
    image_url: 'assets/images/penthouse.jpg',
    amenities: ['Tri-Level Layout', 'Double-Height Ceilings', 'Private Elevator', 'Rooftop Sunset Jacuzzi', 'Yacht Berth Access', '24/7 Concierge'],
    agent_id: 2
  },
  {
    id: 3,
    slug: 'the-opera-crown-suite-downtown',
    title: 'The Opera Crown Suite',
    property_type: 'Apartment',
    community: 'Downtown Dubai',
    sub_community: 'Opera District',
    price_aed: 7800000,
    bedrooms: 3,
    bathrooms: 4,
    built_up_sqft: 2850,
    status: 'Ready',
    featured: true,
    description: 'Prestigious corner residence located directly within the Opera District. Features unobstructed views of the Dubai Fountain, bespoke herringbone oak flooring, and wrap-around viewing terrace.',
    image_url: 'assets/images/hero_skyline.jpg',
    amenities: ['Direct Fountain Views', 'Burj Khalifa Panorama', 'Valet Parking', 'Opera House Proximity', 'Residents Club Lounge'],
    agent_id: 2
  },
  {
    id: 4,
    slug: 'belvedere-park-estate-dubai-hills',
    title: 'Belvedere Park Estate',
    property_type: 'Villa',
    community: 'Dubai Hills Estate',
    sub_community: 'Fairways Enclave',
    price_aed: 32500000,
    bedrooms: 6,
    bathrooms: 7,
    built_up_sqft: 12600,
    status: 'Ready',
    featured: true,
    description: 'Ultra-contemporary architectural mansion fronting the 18-hole championship golf course in Dubai Hills Estate. Features seamless indoor-outdoor living, dual gourmet kitchens, sunken fire pit, and skyline backdrop at sunset.',
    image_url: 'assets/images/golf_mansion.jpg',
    amenities: ['Direct Golf Course Views', 'Sunken Garden Lounge', 'Dual Kitchens', 'Home Cinema', 'Private Spa & Sauna', '24/7 Gated Security'],
    agent_id: 1
  },
  {
    id: 5,
    slug: 'canal-crest-sky-villa-business-bay',
    title: 'Canal Crest Sky Villa',
    property_type: 'Penthouse',
    community: 'Business Bay',
    sub_community: 'Waterfront Terrace',
    price_aed: 16800000,
    bedrooms: 4,
    bathrooms: 5,
    built_up_sqft: 6100,
    status: 'Ready',
    featured: true,
    description: 'Spectacular duplex sky villa hovering over the Dubai Water Canal. Features private cantilevered heated pool, floor-to-ceiling motorized glazing, and designer Poggenpohl kitchen.',
    image_url: 'assets/images/penthouse.jpg',
    amenities: ['Private Heated Plunge Pool', 'Canal Frontage', 'Duplex Design', 'Poggenpohl Kitchen', 'Direct Boardwalk Access'],
    agent_id: 2
  },
  {
    id: 6,
    slug: 'parkview-luxury-townhouse-jvc',
    title: 'Parkview Luxury Townhouse',
    property_type: 'Townhouse',
    community: 'Jumeirah Village Circle (JVC)',
    sub_community: 'District 14',
    price_aed: 2450000,
    bedrooms: 4,
    bathrooms: 4,
    built_up_sqft: 3400,
    status: 'Ready',
    featured: true,
    description: 'Expansive modern 4-bedroom family townhouse facing tranquil community parkland. Features private landscaped rooftop terrace, maid quarters, smart lighting, and 2-car covered garage.',
    image_url: 'assets/images/beachfront_residence.jpg',
    amenities: ['Park Facing', 'Private Rooftop Terrace', 'Maid Room', 'Smart Lighting', 'Covered Parking', 'Close to Circle Mall'],
    agent_id: 3
  },
  {
    id: 7,
    slug: 'palm-horizon-water-villa',
    title: 'Palm Horizon Signature Villa',
    property_type: 'Villa',
    community: 'Palm Jumeirah',
    sub_community: 'Frond M',
    price_aed: 42000000,
    bedrooms: 5,
    bathrooms: 6,
    built_up_sqft: 11200,
    status: 'Ready',
    featured: false,
    description: 'Sublime contemporary waterfront villa with private sandy cove, customized zero-edge pool, Portuguese limestone facade, and panoramic sunsets over Dubai Marina skyline.',
    image_url: 'assets/images/palm_villa.jpg',
    amenities: ['Private Sandy Beach', 'Zero-Edge Pool', 'Portuguese Limestone', 'Marina Skyline Sunset View', 'Private Boat Mooring'],
    agent_id: 1
  },
  {
    id: 8,
    slug: 'boulevard-royal-residence-downtown',
    title: 'Boulevard Royal Residence',
    property_type: 'Apartment',
    community: 'Downtown Dubai',
    sub_community: 'Sheikh Mohammed bin Rashid Blvd',
    price_aed: 14200000,
    bedrooms: 4,
    bathrooms: 5,
    built_up_sqft: 4800,
    status: 'Sold', // Sold deal
    featured: false,
    description: 'Unrivaled luxury duplex perched directly on the Boulevard with direct Burj Khalifa views. Features grand double reception salon, service quarters, and private elevator landing.',
    image_url: 'assets/images/hero_skyline.jpg',
    amenities: ['Direct Burj Khalifa Views', 'Private Elevator Landing', 'Grand Double Salon', 'Boulevard Dining Access', 'Swimming Pool & Spa'],
    agent_id: 2
  },
  {
    id: 9,
    slug: 'marina-horizon-waterfront-suite',
    title: 'Marina Horizon Suite',
    property_type: 'Apartment',
    community: 'Dubai Marina',
    sub_community: 'Marina Gate',
    price_aed: 3250000,
    bedrooms: 2,
    bathrooms: 3,
    built_up_sqft: 1750,
    status: 'Ready',
    featured: false,
    description: 'High-floor prime waterfront residence overlooking yachts gliding into the Arabian Gulf. Finished in bright minimalist stones with generous deep balcony and infinity pool access.',
    image_url: 'assets/images/penthouse.jpg',
    amenities: ['Yacht Marina Views', 'Deep Balcony', 'Infinity Pool Access', 'State of the Art Gym', 'Direct Marina Walk Entry'],
    agent_id: 2
  },
  {
    id: 10,
    slug: 'fairway-contemporary-villa-dubai-hills',
    title: 'Fairway Contemporary Villa',
    property_type: 'Villa',
    community: 'Dubai Hills Estate',
    sub_community: 'Parkway Vistas',
    price_aed: 19500000,
    bedrooms: 5,
    bathrooms: 6,
    built_up_sqft: 8900,
    status: 'Ready',
    featured: false,
    description: 'Modern architectural masterpiece offering uninterrupted panoramas of the rolling greens and Dubai skyline. Boasts floor-to-ceiling sliding glass, courtyard water feature, and private elevator.',
    image_url: 'assets/images/golf_mansion.jpg',
    amenities: ['Unobstructed Fairway Views', 'Courtyard Water Feature', 'Private Elevator', 'Ensuite Bedrooms', 'Gated Community'],
    agent_id: 1
  },
  {
    id: 11,
    slug: 'executive-canal-suite-business-bay',
    title: 'Executive Canal Suite',
    property_type: 'Apartment',
    community: 'Business Bay',
    sub_community: 'Marasi Marina',
    price_aed: 1650000,
    bedrooms: 1,
    bathrooms: 2,
    built_up_sqft: 980,
    status: 'Ready',
    featured: false,
    description: 'Sleek luxury 1-bedroom suite overlooking the Marasi Marina promenade. Exceptional rental cashflow potential, fully furnished with Italian bespoke designer pieces.',
    image_url: 'assets/images/hero_skyline.jpg',
    amenities: ['Marasi Marina Views', 'Fully Furnished', 'High Rental Yield', 'Infinity Pool', 'Walking Distance to Metro'],
    agent_id: 3
  },
  {
    id: 12,
    slug: 'verona-modern-townhome-jvc',
    title: 'Verona Modern Townhome',
    property_type: 'Townhouse',
    community: 'Jumeirah Village Circle (JVC)',
    sub_community: 'District 11',
    price_aed: 1890000,
    bedrooms: 3,
    bathrooms: 3,
    built_up_sqft: 2600,
    status: 'Ready',
    featured: false,
    description: 'Stylishly designed 3-bedroom townhome with private garden and rooftop pergola. Features open-plan living, stone benchtops, and low service fees.',
    image_url: 'assets/images/beachfront_residence.jpg',
    amenities: ['Private Garden', 'Rooftop Pergola', 'Low Service Fees', 'Family Friendly Park', 'Smart Keyless Access'],
    agent_id: 3
  },
  {
    id: 13,
    slug: 'the-royal-crescent-penthouse-palm',
    title: 'The Royal Crescent Penthouse',
    property_type: 'Penthouse',
    community: 'Palm Jumeirah',
    sub_community: 'The Crescent',
    price_aed: 38000000,
    bedrooms: 4,
    bathrooms: 5,
    built_up_sqft: 8200,
    status: 'Ready',
    featured: false,
    description: 'Bespoke single-floor sky mansion on Palm Jumeirah Crescent. Enjoy 360-degree ocean views, sunrise over the Gulf and sunset over the Dubai skyline, with private wellness spa.',
    image_url: 'assets/images/palm_villa.jpg',
    amenities: ['Private Beach Access', 'Wellness Spa & Steam Room', '360-Degree Ocean Panorama', 'Private Pool on Terrace', 'Chauffeur Valet'],
    agent_id: 1
  },
  {
    id: 14,
    slug: 'downtown-skyview-apartment',
    title: 'Downtown Skyview Apartment',
    property_type: 'Apartment',
    community: 'Downtown Dubai',
    sub_community: 'Standpoint Towers',
    price_aed: 4950000,
    bedrooms: 2,
    bathrooms: 3,
    built_up_sqft: 1820,
    status: 'Ready',
    featured: false,
    description: 'Corner high-floor apartment offering direct front-row view of the Burj Khalifa light shows and Downtown skyline. Finished in light travertine and brass accents.',
    image_url: 'assets/images/hero_skyline.jpg',
    amenities: ['Front-Row Burj Khalifa Views', 'Corner Unit', 'Travertine & Brass Detailing', 'Gym & Pool', 'Concierge Desk'],
    agent_id: 2
  },
  {
    id: 15,
    slug: 'jvc-urban-garden-apartment',
    title: 'JVC Urban Garden Apartment',
    property_type: 'Apartment',
    community: 'Jumeirah Village Circle (JVC)',
    sub_community: 'District 15',
    price_aed: 890000,
    bedrooms: 1,
    bathrooms: 2,
    built_up_sqft: 850,
    status: 'Ready',
    featured: false,
    description: 'Chic 1-bedroom sanctuary with expansive 300 sq.ft private garden terrace. Ideal high-yield investment delivering 9.4% estimated net yield.',
    image_url: 'assets/images/beachfront_residence.jpg',
    amenities: ['Private Garden Terrace', 'High Rental Yield (9.4%)', 'Modern Kitchen Appliances', 'Rooftop Infinity Pool', 'Pet Friendly'],
    agent_id: 3
  }
];

// Helper to determine score and label
function calculateLeadScore(item) {
  let score = 0;
  if (item.phone && item.phone.trim().length >= 7) score += 15;
  if (item.property_id || item.project_id) score += 15;
  if (item.is_cash_buyer) score += 25;
  if (item.purchase_timeframe === 'Immediately') score += 25;
  else if (item.purchase_timeframe === 'Within 1 Month') score += 15;
  else score += 5;

  const b = String(item.budget_aed || '');
  if (/50m|30m/i.test(b)) score += 20;
  else if (/25m|15m/i.test(b)) score += 15;
  else if (/5m|10m/i.test(b)) score += 10;
  else score += 5;

  score = Math.min(100, Math.max(0, score));
  let label = 'COLD';
  if (score >= 70) label = 'HOT';
  else if (score >= 40) label = 'WARM';

  return { score, label };
}

// 40 Sample Leads with Realistic Scored Attributes & Stages
const rawLeads = [
  { id: 1, reference_no: 'TRK-108214', full_name: 'Lord Alistair Sterling', email: 'a.sterling@kensington-holdings.co.uk', phone: '+44 7700 900123', lead_type: 'General Inquiry', source_form: 'Home: Register Interest', property_id: 1, budget_aed: 'AED 50M+', preferred_community: 'Palm Jumeirah', is_cash_buyer: true, purchase_timeframe: 'Immediately', stage: 'Viewing', assigned_agent_id: 1, days_inactive: 0, message: 'Looking for a private beachfront mansion on Palm Jumeirah with private boat mooring.' },
  { id: 2, reference_no: 'TRK-108215', full_name: 'Sheikh Hamdan Bin Khalid', email: 'hamdan.khalid@capital-advisory.ae', phone: '+971 50 998 1234', lead_type: 'Viewing Request', source_form: 'Property Page: Book a Viewing', property_id: 4, budget_aed: 'AED 25M - 50M', preferred_community: 'Dubai Hills Estate', is_cash_buyer: true, purchase_timeframe: 'Immediately', stage: 'Offer', assigned_agent_id: 1, days_inactive: 1, message: 'Interested in Belvedere Park Estate. Sunset walkthrough completed. Preparing formal offer.' },
  { id: 3, reference_no: 'TRK-108216', full_name: 'Dr. Maximilien Dubois', email: 'm.dubois@geneva-wealth.ch', phone: '+41 79 123 4567', lead_type: 'Brochure Download', source_form: 'Off-Plan: Download Brochure', project_id: 1, budget_aed: 'AED 10M - 25M', preferred_community: 'Downtown Dubai', is_cash_buyer: false, purchase_timeframe: 'Within 1 Month', stage: 'Contacted', assigned_agent_id: 2, days_inactive: 4, message: 'Downloaded brochure for The Aurelia Residences. Inquiring about 4BR high-floor allocations.' }, // Stale (4 days)
  { id: 4, reference_no: 'TRK-108217', full_name: 'Sophia Van Der Bilt', email: 'sophia@vanderbilt-enterprises.com', phone: '+1 212 555 0192', lead_type: 'Viewing Request', source_form: 'Property Page: Book a Viewing', property_id: 2, budget_aed: 'AED 25M - 50M', preferred_community: 'Dubai Marina', is_cash_buyer: true, purchase_timeframe: 'Immediately', stage: 'Won', assigned_agent_id: 2, days_inactive: 0, message: 'Purchased The Grand Sky Penthouse.' },
  { id: 5, reference_no: 'TRK-108218', full_name: 'Ravi Narayanan', email: 'ravi@singapore-techfund.sg', phone: '+65 9123 4567', lead_type: 'General Inquiry', source_form: 'Home: Register Interest', project_id: 6, budget_aed: 'Under AED 5M', preferred_community: 'Jumeirah Village Circle (JVC)', is_cash_buyer: true, purchase_timeframe: 'Within 1 Month', stage: 'New', assigned_agent_id: 3, days_inactive: 0, message: 'Evaluating 10-unit bulk purchase in JVC for 9%+ rental yield portfolio.' },
  { id: 6, reference_no: 'TRK-108219', full_name: 'Baroness Charlotte von Berg', email: 'c.vonberg@munich-invest.de', phone: '+49 171 2345678', lead_type: 'Call Me Back', source_form: 'Floating: Call Me Back', property_id: 13, budget_aed: 'AED 25M - 50M', preferred_community: 'Palm Jumeirah', is_cash_buyer: true, purchase_timeframe: 'Immediately', stage: 'Won', assigned_agent_id: 1, days_inactive: 0, message: 'Purchased Fairway Contemporary Villa.' },
  { id: 7, reference_no: 'TRK-108220', full_name: 'Tariq Mansoor Al-Nuaimi', email: 'tariq.nuaimi@ad-petroleum.ae', phone: '+971 52 334 8871', lead_type: 'Valuation', source_form: 'Sell Page: Valuation Form', property_id: null, budget_aed: 'AED 50M+', preferred_community: 'Palm Jumeirah', is_cash_buyer: true, purchase_timeframe: 'Within 1 Month', stage: 'Viewing', assigned_agent_id: 1, days_inactive: 1, message: 'Requesting confidential valuation for Frond K signature villa.' },
  { id: 8, reference_no: 'TRK-108221', full_name: 'Jonathan Davies QC', email: 'jdavies@templechambers.co.uk', phone: '+44 7891 234567', lead_type: 'General Inquiry', source_form: 'Properties: Enquire', property_id: 6, budget_aed: 'Under AED 5M', preferred_community: 'JVC', is_cash_buyer: true, purchase_timeframe: 'Immediately', stage: 'Won', assigned_agent_id: 3, days_inactive: 0, message: 'Purchased Parkview Luxury Townhouse.' },
  { id: 9, reference_no: 'TRK-108222', full_name: 'Sergei Volkov', email: 's.volkov@nordic-shipping.fi', phone: '+358 40 1234567', lead_type: 'Viewing Request', source_form: 'Property Page: Book a Viewing', property_id: 5, budget_aed: 'AED 10M - 25M', preferred_community: 'Business Bay', is_cash_buyer: false, purchase_timeframe: 'Within 1 Month', stage: 'Contacted', assigned_agent_id: 2, days_inactive: 5, message: 'Interested in Canal Crest Sky Villa. Requesting video tour and floor plans.' }, // Stale (5 days)
  { id: 10, reference_no: 'TRK-108223', full_name: 'Amara Okafor', email: 'amara@lagos-capital.ng', phone: '+234 803 123 4567', lead_type: 'Brochure Download', source_form: 'Off-Plan: Download Brochure', project_id: 2, budget_aed: 'AED 5M - 10M', preferred_community: 'Dubai Marina', is_cash_buyer: false, purchase_timeframe: '3+ Months', stage: 'Contacted', assigned_agent_id: 2, days_inactive: 3, message: 'Inquiring about Solstice Water Tower 2-bedroom units and 70/30 payment plan.' }, // Stale (3 days)
  { id: 11, reference_no: 'TRK-108224', full_name: 'Hiroshi Tanaka', email: 'tanaka@tokyo-familyoffice.jp', phone: '+81 90 1234 5678', lead_type: 'General Inquiry', source_form: 'Contact Page: Office Inquiry', property_id: 10, budget_aed: 'AED 10M - 25M', preferred_community: 'Dubai Hills Estate', is_cash_buyer: true, purchase_timeframe: 'Immediately', stage: 'Offer', assigned_agent_id: 1, days_inactive: 0, message: 'Client seeking championship golf course villa for long-term residency.' },
  { id: 12, reference_no: 'TRK-108225', full_name: 'Matteo Rossi', email: 'rossi@milan-designgroup.it', phone: '+39 335 1234567', lead_type: 'Viewing Request', source_form: 'Property Page: Book a Viewing', property_id: 8, budget_aed: 'AED 10M - 25M', preferred_community: 'Downtown Dubai', is_cash_buyer: true, purchase_timeframe: 'Immediately', stage: 'Viewing', assigned_agent_id: 2, days_inactive: 1, message: 'Viewing requested for Boulevard Royal Residence on Friday afternoon.' },
  { id: 13, reference_no: 'TRK-108226', full_name: 'Guillaume Laurent', email: 'g.laurent@paris-fund.fr', phone: '+33 6 12 34 56 78', lead_type: 'Call Me Back', source_form: 'Floating: Call Me Back', project_id: 3, budget_aed: 'AED 10M - 25M', preferred_community: 'Dubai Hills Estate', is_cash_buyer: false, purchase_timeframe: '1-3 Months', stage: 'Contacted', assigned_agent_id: 1, days_inactive: 4, message: 'Please call to discuss Mirage Reserve Villa pricing and handover schedule.' }, // Stale (4 days)
  { id: 14, reference_no: 'TRK-108227', full_name: 'Farah El-Masri', email: 'farah.masri@beirut-invest.com', phone: '+961 3 123 456', lead_type: 'General Inquiry', source_form: 'Properties: Enquire', property_id: 6, budget_aed: 'Under AED 5M', preferred_community: 'Jumeirah Village Circle (JVC)', is_cash_buyer: false, purchase_timeframe: 'Within 1 Month', stage: 'Contacted', assigned_agent_id: 3, days_inactive: 1, message: 'Seeking Parkview townhouse for family relocation.' },
  { id: 15, reference_no: 'TRK-108228', full_name: 'Alexander Lindqvist', email: 'a.lindqvist@stockholm-tech.se', phone: '+46 70 123 4567', lead_type: 'Viewing Request', source_form: 'Property Page: Book a Viewing', property_id: 9, budget_aed: 'Under AED 5M', preferred_community: 'Dubai Marina', is_cash_buyer: true, purchase_timeframe: 'Immediately', stage: 'New', assigned_agent_id: 2, days_inactive: 0, message: 'Interested in Marina Horizon Suite. Cash buyer ready to move quickly.' },
  { id: 16, reference_no: 'TRK-108229', full_name: 'Khadija Al-Husseini', email: 'khadija@kuwait-holdings.kw', phone: '+965 9912 3456', lead_type: 'Valuation', source_form: 'Sell Page: Valuation Form', property_id: null, budget_aed: 'AED 25M - 50M', preferred_community: 'Downtown Dubai', is_cash_buyer: true, purchase_timeframe: 'Immediately', stage: 'Offer', assigned_agent_id: 2, days_inactive: 1, message: 'Looking to sell high-floor 4BR penthouse in Downtown Dubai.' },
  { id: 17, reference_no: 'TRK-108230', full_name: 'William Montgomery', email: 'w.montgomery@mayfair-partners.co.uk', phone: '+44 7711 223344', lead_type: 'General Inquiry', source_form: 'Properties: Enquire', property_id: 7, budget_aed: 'AED 25M - 50M', preferred_community: 'Palm Jumeirah', is_cash_buyer: true, purchase_timeframe: 'Immediately', stage: 'Viewing', assigned_agent_id: 1, days_inactive: 1, message: 'Requesting confidential viewing for Palm Horizon Signature Villa.' },
  { id: 18, reference_no: 'TRK-108231', full_name: 'Elena Danilova', email: 'elena.d@monaco-yachts.mc', phone: '+377 98 12 34 56', lead_type: 'Brochure Download', source_form: 'Off-Plan: Download Brochure', project_id: 5, budget_aed: 'AED 25M - 50M', preferred_community: 'Palm Jumeirah', is_cash_buyer: false, purchase_timeframe: '3+ Months', stage: 'Contacted', assigned_agent_id: 1, days_inactive: 6, message: 'Elysian Palm Crest brochure requested with full floorplate drawings.' }, // Stale (6 days)
  { id: 19, reference_no: 'TRK-108232', full_name: 'Nasser Al-Subaie', email: 'nasser@riyadh-capital.sa', phone: '+966 50 123 4567', lead_type: 'Viewing Request', source_form: 'Property Page: Book a Viewing', property_id: 1, budget_aed: 'AED 50M+', preferred_community: 'Palm Jumeirah', is_cash_buyer: true, purchase_timeframe: 'Immediately', stage: 'Viewing', assigned_agent_id: 1, days_inactive: 0, message: 'Private helicopter arrival next Thursday for Villa Seraphina inspection.' },
  { id: 20, reference_no: 'TRK-108233', full_name: 'Oliver Hudson', email: 'oliver@sydney-invest.com.au', phone: '+61 412 345 678', lead_type: 'Call Me Back', source_form: 'Floating: Call Me Back', project_id: 4, budget_aed: 'Under AED 5M', preferred_community: 'Business Bay', is_cash_buyer: false, purchase_timeframe: '1-3 Months', stage: 'New', assigned_agent_id: 3, days_inactive: 0, message: 'Call required to discuss rental yields on Valence Horizon Suites.' },
  { id: 21, reference_no: 'TRK-108234', full_name: 'Chloe Tremblay', email: 'chloe@montreal-advisors.ca', phone: '+1 514 555 0184', lead_type: 'General Inquiry', source_form: 'Mortgage: Speak to Advisor', property_id: 11, budget_aed: 'Under AED 5M', preferred_community: 'Business Bay', is_cash_buyer: false, purchase_timeframe: 'Within 1 Month', stage: 'Contacted', assigned_agent_id: 3, days_inactive: 2, message: 'Executive Canal Suite inquiry regarding immediate tenancy contract.' },
  { id: 22, reference_no: 'TRK-108235', full_name: 'Vikram Mehta', email: 'vikram@mumbai-equities.in', phone: '+91 98200 12345', lead_type: 'Viewing Request', source_form: 'Property Page: Book a Viewing', property_id: 12, budget_aed: 'Under AED 5M', preferred_community: 'Jumeirah Village Circle (JVC)', is_cash_buyer: true, purchase_timeframe: 'Immediately', stage: 'New', assigned_agent_id: 3, days_inactive: 0, message: 'Viewing requested for Verona Modern Townhome this weekend.' },
  { id: 23, reference_no: 'TRK-108236', full_name: 'Lucas Ferreira', email: 'lucas@lisbon-realestate.pt', phone: '+351 912 345 678', lead_type: 'Brochure Download', source_form: 'Off-Plan: Download Brochure', project_id: 1, budget_aed: 'AED 5M - 10M', preferred_community: 'Downtown Dubai', is_cash_buyer: false, purchase_timeframe: '3+ Months', stage: 'Lost', assigned_agent_id: 2, days_inactive: 10, message: 'Decided to invest in Portugal instead.' },
  { id: 24, reference_no: 'TRK-108237', full_name: 'Countess Beatrix Szapary', email: 'beatrix@vienna-trust.at', phone: '+43 664 1234567', lead_type: 'General Inquiry', source_form: 'Properties: Enquire', property_id: 4, budget_aed: 'AED 25M - 50M', preferred_community: 'Dubai Hills Estate', is_cash_buyer: true, purchase_timeframe: 'Immediately', stage: 'Viewing', assigned_agent_id: 1, days_inactive: 1, message: 'Private tour for golf estate residence in Dubai Hills.' },
  { id: 25, reference_no: 'TRK-108238', full_name: 'Zaid Al-Bahar', email: 'zaid@kuwait-advisory.kw', phone: '+965 9944 5566', lead_type: 'Viewing Request', source_form: 'Property Page: Book a Viewing', property_id: 14, budget_aed: 'Under AED 5M', preferred_community: 'Downtown Dubai', is_cash_buyer: false, purchase_timeframe: 'Within 1 Month', stage: 'New', assigned_agent_id: 2, days_inactive: 0, message: 'Interested in Downtown Skyview Apartment with Burj views.' },
  { id: 26, reference_no: 'TRK-108239', full_name: 'Henrik Vanger', email: 'henrik@vanger-corp.se', phone: '+46 73 987 6543', lead_type: 'General Inquiry', source_form: 'Contact Page: Office Inquiry', property_id: 2, budget_aed: 'AED 25M - 50M', preferred_community: 'Dubai Marina', is_cash_buyer: true, purchase_timeframe: 'Within 1 Month', stage: 'Contacted', assigned_agent_id: 2, days_inactive: 3, message: 'Requesting private elevator specifications and security protocols.' }, // Stale (3 days)
  { id: 27, reference_no: 'TRK-108240', full_name: 'Yasmin Qasim', email: 'yasmin@doha-ventures.qa', phone: '+974 5512 3456', lead_type: 'Valuation', source_form: 'Sell Page: Valuation Form', property_id: null, budget_aed: 'AED 10M - 25M', preferred_community: 'Dubai Marina', is_cash_buyer: true, purchase_timeframe: 'Immediately', stage: 'Contacted', assigned_agent_id: 2, days_inactive: 2, message: 'Looking to list a 3BR duplex in Marina Gate.' },
  { id: 28, reference_no: 'TRK-108241', full_name: 'Arthur Pendelton', email: 'arthur@boston-biotech.com', phone: '+1 617 555 0142', lead_type: 'Call Me Back', source_form: 'Floating: Call Me Back', project_id: 2, budget_aed: 'AED 5M - 10M', preferred_community: 'Dubai Marina', is_cash_buyer: false, purchase_timeframe: '3+ Months', stage: 'New', assigned_agent_id: 2, days_inactive: 0, message: 'Please arrange callback during US Eastern morning hours.' },
  { id: 29, reference_no: 'TRK-108242', full_name: 'Leila Al-Sabah', email: 'leila@bahrain-bank.bh', phone: '+973 3912 3456', lead_type: 'Viewing Request', source_form: 'Property Page: Book a Viewing', property_id: 3, budget_aed: 'AED 5M - 10M', preferred_community: 'Downtown Dubai', is_cash_buyer: true, purchase_timeframe: 'Immediately', stage: 'Viewing', assigned_agent_id: 2, days_inactive: 1, message: 'Opera District suite viewing requested for Wednesday.' },
  { id: 30, reference_no: 'TRK-108243', full_name: 'Sebastian Morales', email: 'sebastian@madrid-capital.es', phone: '+34 612 345 678', lead_type: 'General Inquiry', source_form: 'Properties: Enquire', property_id: 15, budget_aed: 'Under AED 5M', preferred_community: 'Jumeirah Village Circle (JVC)', is_cash_buyer: false, purchase_timeframe: '1-3 Months', stage: 'New', assigned_agent_id: 3, days_inactive: 0, message: 'Inquiring about JVC Urban Garden apartment with tenant in place.' },
  { id: 31, reference_no: 'TRK-108244', full_name: 'Sir Charles Higgins', email: 'charles@higgins-holdings.co.uk', phone: '+44 7722 334455', lead_type: 'Viewing Request', source_form: 'Property Page: Book a Viewing', property_id: 1, budget_aed: 'AED 50M+', preferred_community: 'Palm Jumeirah', is_cash_buyer: true, purchase_timeframe: 'Immediately', stage: 'Won', assigned_agent_id: 1, days_inactive: 0, message: 'Purchased Villa Seraphina.' },
  { id: 32, reference_no: 'TRK-108245', full_name: 'Natalia Romanova', email: 'natalia@geneva-inter.ch', phone: '+41 78 987 6543', lead_type: 'Brochure Download', source_form: 'Off-Plan: Download Brochure', project_id: 5, budget_aed: 'AED 25M - 50M', preferred_community: 'Palm Jumeirah', is_cash_buyer: true, purchase_timeframe: 'Within 1 Month', stage: 'Contacted', assigned_agent_id: 1, days_inactive: 1, message: 'Downloaded Elysian Palm Crest brochure. Seeking 5BR penthouse floor plan.' },
  { id: 33, reference_no: 'TRK-108246', full_name: 'Majid Al-Husseini', email: 'majid@oman-oil.om', phone: '+968 9123 4567', lead_type: 'Viewing Request', source_form: 'Property Page: Book a Viewing', property_id: 10, budget_aed: 'AED 10M - 25M', preferred_community: 'Dubai Hills Estate', is_cash_buyer: false, purchase_timeframe: 'Within 1 Month', stage: 'New', assigned_agent_id: 1, days_inactive: 0, message: 'Seeking viewing of Fairway Contemporary Villa this Saturday.' },
  { id: 34, reference_no: 'TRK-108247', full_name: 'Frederik De Groot', email: 'frederik@amsterdam-invest.nl', phone: '+31 6 12345678', lead_type: 'Call Me Back', source_form: 'Floating: Call Me Back', project_id: 1, budget_aed: 'AED 5M - 10M', preferred_community: 'Downtown Dubai', is_cash_buyer: false, purchase_timeframe: '3+ Months', stage: 'Contacted', assigned_agent_id: 2, days_inactive: 5, message: 'Call requested regarding off-plan mortgage financing options.' }, // Stale (5 days)
  { id: 35, reference_no: 'TRK-108248', full_name: 'Daria Petrova', email: 'daria@dubai-creatives.ae', phone: '+971 54 221 9988', lead_type: 'General Inquiry', source_form: 'Properties: Enquire', property_id: 5, budget_aed: 'AED 10M - 25M', preferred_community: 'Business Bay', is_cash_buyer: true, purchase_timeframe: 'Within 1 Month', stage: 'New', assigned_agent_id: 2, days_inactive: 0, message: 'Inquiring about Canal Crest Sky Villa private plunge pool maintenance.' },
  { id: 36, reference_no: 'TRK-108249', full_name: 'Hassan Al-Kuwari', email: 'hassan@doha-family.qa', phone: '+974 6612 3456', lead_type: 'Viewing Request', source_form: 'Property Page: Book a Viewing', property_id: 7, budget_aed: 'AED 25M - 50M', preferred_community: 'Palm Jumeirah', is_cash_buyer: true, purchase_timeframe: 'Immediately', stage: 'Viewing', assigned_agent_id: 1, days_inactive: 1, message: 'Palm Horizon Villa private walkthrough confirmed.' },
  { id: 37, reference_no: 'TRK-108250', full_name: 'Benjamin Vance', email: 'ben@sanfrancisco-vc.com', phone: '+1 415 555 0199', lead_type: 'Brochure Download', source_form: 'Off-Plan: Download Brochure', project_id: 4, budget_aed: 'Under AED 5M', preferred_community: 'Business Bay', is_cash_buyer: false, purchase_timeframe: '3+ Months', stage: 'Contacted', assigned_agent_id: 3, days_inactive: 7, message: 'AI and tech integration specifications for Valence Horizon Suites.' }, // Stale (7 days)
  { id: 38, reference_no: 'TRK-108251', full_name: 'Fatima Al-Marzouqi', email: 'fatima@sharjah-invest.ae', phone: '+971 50 112 3344', lead_type: 'Valuation', source_form: 'Sell Page: Valuation Form', property_id: null, budget_aed: 'AED 5M - 10M', preferred_community: 'Business Bay', is_cash_buyer: true, purchase_timeframe: 'Within 1 Month', stage: 'New', assigned_agent_id: 3, days_inactive: 0, message: 'Valuation requested for 2-bedroom executive canal suite.' },
  { id: 39, reference_no: 'TRK-108252', full_name: 'Edward Sterling-Hall', email: 'edward@cotswolds-estates.co.uk', phone: '+44 7733 445566', lead_type: 'General Inquiry', source_form: 'Home: Register Interest', property_id: 4, budget_aed: 'AED 25M - 50M', preferred_community: 'Dubai Hills Estate', is_cash_buyer: true, purchase_timeframe: 'Immediately', stage: 'Contacted', assigned_agent_id: 1, days_inactive: 2, message: 'Inquiring regarding school accessibility and championship golf memberships.' },
  { id: 40, reference_no: 'TRK-108253', full_name: 'Reem Al-Falasi', email: 'reem@dubai-holdings.ae', phone: '+971 55 998 7766', lead_type: 'Viewing Request', source_form: 'Property Page: Book a Viewing', property_id: 8, budget_aed: 'AED 10M - 25M', preferred_community: 'Downtown Dubai', is_cash_buyer: true, purchase_timeframe: 'Immediately', stage: 'Won', assigned_agent_id: 2, days_inactive: 0, message: 'Purchased Boulevard Royal Residence.' }
];

// Enrich sample leads with computed scores
const sample_leads = rawLeads.map(l => {
  const { score, label } = calculateLeadScore(l);
  const actDate = new Date();
  actDate.setDate(actDate.getDate() - (l.days_inactive || 0));
  return {
    ...l,
    score,
    score_label: label,
    last_activity_date: actDate.toISOString(),
    is_read: l.stage !== 'New'
  };
});

// Sample Viewings
const sample_viewings = [
  { id: 1, lead_id: 1, property_id: 1, staff_id: 1, viewing_date: '2026-10-04', viewing_time: '16:00 GST', status: 'Scheduled', feedback: 'Client arriving with private architectural advisor.' },
  { id: 2, lead_id: 2, property_id: 4, staff_id: 1, viewing_date: '2026-10-02', viewing_time: '17:30 GST', status: 'Scheduled', feedback: 'Sunset timing requested to inspect fairway lighting.' },
  { id: 3, lead_id: 4, property_id: 2, staff_id: 2, viewing_date: '2026-10-06', viewing_time: '14:00 GST', status: 'Completed', feedback: 'Client completed inspection and signed booking deposit.' },
  { id: 4, lead_id: 7, property_id: 1, staff_id: 1, viewing_date: '2026-10-05', viewing_time: '11:00 GST', status: 'Scheduled', feedback: 'Comparison inspection with Frond K estate.' },
  { id: 5, lead_id: 12, property_id: 8, staff_id: 2, viewing_date: '2026-10-03', viewing_time: '15:30 GST', status: 'Scheduled', feedback: 'Milan design team attending to inspect finishes.' },
  { id: 6, lead_id: 17, property_id: 7, staff_id: 1, viewing_date: '2026-10-07', viewing_time: '16:30 GST', status: 'Scheduled', feedback: 'Private boat access inspection requested.' },
  { id: 7, lead_id: 19, property_id: 1, staff_id: 1, viewing_date: '2026-10-08', viewing_time: '12:00 GST', status: 'Scheduled', feedback: 'Helicopter transfer to Palm Jumeirah helipad.' },
  { id: 8, lead_id: 24, property_id: 4, staff_id: 1, viewing_date: '2026-10-05', viewing_time: '10:00 GST', status: 'Scheduled', feedback: 'Family estate inspection.' },
  { id: 9, lead_id: 29, property_id: 3, staff_id: 2, viewing_date: '2026-10-04', viewing_time: '18:00 GST', status: 'Scheduled', feedback: 'Evening fountain show viewing alignment.' },
  { id: 10, lead_id: 36, property_id: 7, staff_id: 1, viewing_date: '2026-10-09', viewing_time: '15:00 GST', status: 'Scheduled', feedback: 'High tide inspection for beach depth.' }
];

// Sample Notes
const sample_notes = [
  { id: 1, lead_id: 1, staff_id: 1, staff_name: 'Tariq Al-Mansoor', note_text: 'Spoke with client personal assistant. Funds confirmed via Barclays Private Bank UK. Viewing arranged for Frond N beachfront villa.' },
  { id: 2, lead_id: 2, staff_id: 1, staff_name: 'Tariq Al-Mansoor', note_text: 'Client submitted LOI at AED 32M for Belvedere Park Estate. Seller reviewing counter.' },
  { id: 3, lead_id: 4, staff_id: 2, staff_name: 'Elena Rostova', note_text: 'Contract of sale executed at AED 28.5M. 2% advisory commission earned (AED 570,000).' }
];

// 5 Completed Sales
const sample_sales = [
  { id: 1, property_id: 1, property_title: 'Villa Seraphina', community: 'Palm Jumeirah', buyer_name: 'Sir Charles Higgins', staff_id: 1, sale_price_aed: 54000000, commission_aed: 1080000, sale_date: '2026-09-18' },
  { id: 2, property_id: 8, property_title: 'Boulevard Royal Residence', community: 'Downtown Dubai', buyer_name: 'Reem Al-Falasi', staff_id: 2, sale_price_aed: 14200000, commission_aed: 284000, sale_date: '2026-09-22' },
  { id: 3, property_id: 10, property_title: 'Fairway Contemporary Villa', community: 'Dubai Hills Estate', buyer_name: 'Baroness Charlotte von Berg', staff_id: 1, sale_price_aed: 19500000, commission_aed: 390000, sale_date: '2026-09-11' },
  { id: 4, property_id: 2, property_title: 'The Grand Sky Penthouse', community: 'Dubai Marina', buyer_name: 'Sophia Van Der Bilt', staff_id: 2, sale_price_aed: 28500000, commission_aed: 570000, sale_date: '2026-08-29' },
  { id: 5, property_id: 6, property_title: 'Parkview Luxury Townhouse', community: 'Jumeirah Village Circle (JVC)', buyer_name: 'Jonathan Davies QC', staff_id: 3, sale_price_aed: 2450000, commission_aed: 49000, sale_date: '2026-08-15' }
];

module.exports = {
  developers,
  staff_logins,
  off_plan_projects,
  properties,
  sample_leads,
  sample_viewings,
  sample_notes,
  sample_sales,
  calculateLeadScore
};
