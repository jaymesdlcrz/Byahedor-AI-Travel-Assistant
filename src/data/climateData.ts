export type MonsoonSeason = 'amihan' | 'habagat' | 'tag_init';

export interface MonsoonInfo {
  id: MonsoonSeason;
  name: string;
  tagalogName: string;
  period: string;
  windDirection: string;
  weatherPattern: string;
  seaStateWest: string;
  seaStateEast: string;
  bestRegions: string[];
  cautionRegions: string[];
  averageTemp: string;
  color: string;
  badgeBg: string;
  advice: string;
  keyActivities: string[];
}

export const MONSOON_SEASONS: Record<MonsoonSeason, MonsoonInfo> = {
  amihan: {
    id: 'amihan',
    name: 'Amihan (Northeast Monsoon)',
    tagalogName: 'Hanging Amihan',
    period: 'Late October to May (Peak: Dec – Feb)',
    windDirection: 'Northeast (from Siberia & Pacific)',
    weatherPattern: 'Cool, crisp breezes, lower humidity, clear blue skies on the western seaboard.',
    seaStateWest: 'Glass-flat & crystal clear (Mirror lagoons in El Nido, Boracay White Beach).',
    seaStateEast: 'Active Pacific swells & waves (Prime surf swells in Siargao & Baler).',
    bestRegions: [
      'Boracay (White Beach is flat & crystal turquoise)',
      'Palawan (El Nido, Coron, Puerto Princesa)',
      'Cordillera Highlands (Baguio, Sagada - chilly 12°C mornings)',
      'Ilocos Region (Vigan cobblestones & Pagudpud)',
      'Batangas & Zambales beaches'
    ],
    cautionRegions: [
      'Pacific seaboard islands during tropical depressions',
      'Eastern Bicol (Catanduanes) - higher rainfall'
    ],
    averageTemp: '24°C – 29°C (Highlands: 12°C – 18°C)',
    color: '#087EA4',
    badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    advice: 'The undisputed golden window for beach lovers. Boracay White Beach is flat as a swimming pool with no algae, and El Nido lagoons have maximum underwater visibility. Chilly evenings in the mountains make Sagada and Baguio feel like a romantic European escape.',
    keyActivities: [
      'Island hopping in mirror-calm lagoons',
      'Beach lounging without oppressive humidity',
      'Mountain trekking to Sea of Clouds (Mt. Pulag, Sagada)',
      'Heritage walking tours in Vigan and Intramuros'
    ]
  },
  habagat: {
    id: 'habagat',
    name: 'Habagat (Southwest Monsoon)',
    tagalogName: 'Hanging Habagat',
    period: 'June to October (Peak: July – Sept)',
    windDirection: 'Southwest (from Indian Ocean & Equator)',
    weatherPattern: 'Warm, moisture-rich air with afternoon monsoon rainbands and occasional tropical cyclones.',
    seaStateWest: 'Choppy seas & onshore wind (Boracay sets up windbreak nets on White Beach).',
    seaStateEast: 'World-class Pacific swell season (Siargao International Cup waves).',
    bestRegions: [
      'Siargao (Cloud 9 surf season peaks Sept-Nov)',
      'Baler & La Union (Surfing breaks in full throttle)',
      'Davao & Samal Island (Shielded below the typhoon belt)',
      'Cebu & Bohol (Sheltered inland sea channels)',
      'Cagayan de Oro (High-water white water rafting)'
    ],
    cautionRegions: [
      'Batanes (Prone to typhoon flight & ferry cancellations)',
      'Western Palawan open-sea crossings (Calamianes fast ferries during gale warnings)'
    ],
    averageTemp: '27°C – 32°C',
    color: '#39A96B',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    advice: 'The secret weapon for budget travelers, surfers, and waterfall lovers. Waterfalls across Laguna, Cebu, and Mindanao roar with epic volume. Hotel rates drop by 30% to 50%. In Boracay, kitesurfing migrates to Bulabog Beach, while nightlife stays vibrant.',
    keyActivities: [
      'Surfing world-class Cloud 9 & Baler breaks',
      'Waterfalls roaring at maximum volume (Kawasan, Tinuy-an)',
      'White water rafting in Cagayan de Oro',
      'Budget luxury resort staycations at low-season rates'
    ]
  },
  tag_init: {
    id: 'tag_init',
    name: 'Tag-init (Dry Summer Transition)',
    tagalogName: 'Panahon ng Tag-araw',
    period: 'March to May (Peak Summer)',
    windDirection: 'Light, variable tropical trade winds',
    weatherPattern: 'Intense tropical sunshine, lowest annual precipitation nationwide, hot humid afternoons.',
    seaStateWest: 'Calm, gentle, warm waters with extraordinary underwater visibility.',
    seaStateEast: 'Gentle to moderate seas (Diving season opens across the Pacific).',
    bestRegions: [
      'Tubbataha Reefs (Strict liveaboard window: March – June ONLY)',
      'Apo Reef Natural Park (Mindoro)',
      'Batanes (Calmest sea crossings between Batan & Sabtang)',
      'Siquijor & Apo Island (Giant sea turtles & cliff diving)',
      'Hundred Islands & Romblon marble sanctuaries'
    ],
    cautionRegions: [
      'Dense urban centers (Metro Manila heat index often hits 42°C+)',
      'Very crowded beach hubs during Holy Week (Semana Santa)'
    ],
    averageTemp: '31°C – 36°C (Heat index can reach 40°C+)',
    color: '#F59E0B',
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    advice: 'The ultimate Philippine summer! This is the ONLY time of the year liveaboard dive vessels can visit the UNESCO Tubbataha Reefs in the Sulu Sea. Sea crossings to Batanes and remote sandbars are safest now. Always book ferries and flights early due to Holy Week rush.',
    keyActivities: [
      'Deep reef scuba diving (Tubbataha, Apo Reef, Dauin)',
      'Sandbar hopping (Kalanggaman, Manjuyod, Naked Island)',
      'Sunset paraw sailing & freediving',
      'Caving and cold spring swimming to beat the heat'
    ]
  }
};

export interface MonthClimateData {
  month: number;
  name: string;
  shortName: string;
  season: MonsoonSeason;
  seasonLabel: string;
  seaRoughness: 'Calm' | 'Moderate' | 'Choppy / Swell';
  seaRatingColor: string;
  rainfall: 'Low' | 'Moderate' | 'High';
  typhoonRisk: 'Very Low' | 'Low' | 'Moderate' | 'High';
  tempRange: string;
  verdict: string;
  recommended: string[];
  caution: string[];
  packingTip: string;
}

export const MONTHLY_CLIMATE_CALENDAR: MonthClimateData[] = [
  {
    month: 1,
    name: 'January',
    shortName: 'Jan',
    season: 'amihan',
    seasonLabel: 'Peak Amihan (Cool & Crisp)',
    seaRoughness: 'Calm',
    seaRatingColor: '#39A96B',
    rainfall: 'Low',
    typhoonRisk: 'Very Low',
    tempRange: '23°C – 28°C',
    verdict: 'Prime travel month. Coolest temperatures of the year. Boracay, Palawan, and Cebu are postcard perfect. Baguio Panagbenga prep season.',
    recommended: ['Boracay', 'El Nido', 'Coron', 'Baguio', 'Cebu', 'Bohol'],
    caution: ['Eastern Samar (Amihan rain on Pacific face)'],
    packingTip: 'Light windbreaker for boat rides & chilly mountain nights; coral-safe sunscreen.'
  },
  {
    month: 2,
    name: 'February',
    shortName: 'Feb',
    season: 'amihan',
    seasonLabel: 'Peak Amihan (Dry & Sunny)',
    seaRoughness: 'Calm',
    seaRatingColor: '#39A96B',
    rainfall: 'Low',
    typhoonRisk: 'Very Low',
    tempRange: '24°C – 29°C',
    verdict: 'Golden dry season. Celebrations include Baguio Panagbenga Flower Festival. Spectacular diving in Palawan and Bohol with pristine visibility.',
    recommended: ['El Nido', 'Baguio', 'Bohol', 'Boracay', 'Sagada', 'Siquijor'],
    caution: ['Pacific side exposed spots with strong wind gusts'],
    packingTip: 'Hiking boots for Cordillera trails, dry bag for island hopping.'
  },
  {
    month: 3,
    name: 'March',
    shortName: 'Mar',
    season: 'tag_init',
    seasonLabel: 'Early Tag-init (Summer Start)',
    seaRoughness: 'Calm',
    seaRatingColor: '#39A96B',
    rainfall: 'Low',
    typhoonRisk: 'Very Low',
    tempRange: '26°C – 32°C',
    verdict: 'Summer kicks off. Waters turn glass-calm across both western and central waters. Tubbataha liveaboard dive season officially opens.',
    recommended: ['Tubbataha Reefs', 'Coron', 'Palawan', 'Apo Reef', 'Romblon', 'Boracay'],
    caution: ['Book early for Holy Week migrations'],
    packingTip: 'Polarized sunglasses, SPF 50+ reef-safe sunscreen, electrolyte sachets.'
  },
  {
    month: 4,
    name: 'April',
    shortName: 'Apr',
    season: 'tag_init',
    seasonLabel: 'Peak Tag-init (Fiesta Season)',
    seaRoughness: 'Calm',
    seaRatingColor: '#39A96B',
    rainfall: 'Low',
    typhoonRisk: 'Very Low',
    tempRange: '28°C – 35°C',
    verdict: 'Hottest month of the year nationwide. Zero rain on most islands. Batanes sea routes are the calmest. Expect busy domestic crowds during Semana Santa.',
    recommended: ['Batanes', 'El Nido', 'Hundred Islands', 'Siquijor', 'Camiguin', 'Bohol'],
    caution: ['Metro Manila & lowlands (extreme afternoon heat index)'],
    packingTip: 'Wide-brim hat, UV rashguard, breathable linen clothes, 2L water tumbler.'
  },
  {
    month: 5,
    name: 'May',
    shortName: 'May',
    season: 'tag_init',
    seasonLabel: 'Late Tag-init (Flores de Mayo)',
    seaRoughness: 'Calm',
    seaRatingColor: '#39A96B',
    rainfall: 'Low',
    typhoonRisk: 'Low',
    tempRange: '28°C – 34°C',
    verdict: 'Warmest seas with highest underwater clarity. Perfect for diving, whale shark watching in southern Leyte, and sandbar camping.',
    recommended: ['Tubbataha', 'Coron', 'Batanes', 'Siargao (calm lagoons)', 'Apo Island'],
    caution: ['Late afternoon localized heat storms (isolated)'],
    packingTip: 'Snorkel mask & snorkel, dry bag, Aloe Vera after-sun gel.'
  },
  {
    month: 6,
    name: 'June',
    shortName: 'Jun',
    season: 'habagat',
    seasonLabel: 'Habagat Arrival (Monsoon Shift)',
    seaRoughness: 'Moderate',
    seaRatingColor: '#F59E0B',
    rainfall: 'Moderate',
    typhoonRisk: 'Moderate',
    tempRange: '27°C – 32°C',
    verdict: 'Winds shift southwest. Boracay sets up protective screens on White Beach; Bulabog side wakes up. Low-season deals begin across luxury resorts.',
    recommended: ['Davao', 'Samal Island', 'Cebu', 'Bohol', 'Siargao (surf starts)'],
    caution: ['Western coastal boat tours during squalls'],
    packingTip: 'Waterproof phone casing, lightweight rain jacket, 10L dry bag.'
  },
  {
    month: 7,
    name: 'July',
    shortName: 'Jul',
    season: 'habagat',
    seasonLabel: 'Active Habagat (Rain & Swells)',
    seaRoughness: 'Choppy / Swell',
    seaRatingColor: '#EF4444',
    rainfall: 'High',
    typhoonRisk: 'Moderate',
    tempRange: '26°C – 31°C',
    verdict: 'Monsoon rains replenish lush rice terraces and waterfalls. Surfing in Baler and La Union ramps up. Southern Mindanao remains dry and protected.',
    recommended: ['Davao (typhoon-free zone)', 'Cagayan de Oro (rafting)', 'Siargao', 'Baler'],
    caution: ['Luzon mountain roads prone to landslide closures', 'Batanes ferries'],
    packingTip: 'Trekking sandals with grip, quick-dry clothes, heavy-duty 20L dry bag.'
  },
  {
    month: 8,
    name: 'August',
    shortName: 'Aug',
    season: 'habagat',
    seasonLabel: 'Peak Habagat (Tropical Rhythms)',
    seaRoughness: 'Choppy / Swell',
    seaRatingColor: '#EF4444',
    rainfall: 'High',
    typhoonRisk: 'High',
    tempRange: '26°C – 31°C',
    verdict: 'Kadayawan Festival in Davao makes it the #1 cultural hotspot (Davao is outside the typhoon belt). Great hotel promos in Boracay and Cebu.',
    recommended: ['Davao City & Samal Island', 'Camiguin', 'Siargao', 'Cebu City Heritage'],
    caution: ['Luzon west coast & Batanes open water'],
    packingTip: 'Waterproof dry bag, umbrella, insect repellent, travel insurance.'
  },
  {
    month: 9,
    name: 'September',
    shortName: 'Sep',
    season: 'habagat',
    seasonLabel: 'Habagat Surfing Peak',
    seaRoughness: 'Moderate',
    seaRatingColor: '#F59E0B',
    rainfall: 'High',
    typhoonRisk: 'High',
    tempRange: '26°C – 31°C',
    verdict: 'The global surf world descends upon Siargao for the International Surfing Cup. Huge Pacific barrels at Cloud 9. Best waterfall trekking in Mindanao.',
    recommended: ['Siargao (World-class surfing)', 'Baler', 'Davao', 'Iloilo & Bacolod Food'],
    caution: ['Northern Luzon coastal shipping lanes during storm alerts'],
    packingTip: 'Surfing zinc sunblock, reef booties, waterproof backpack.'
  },
  {
    month: 10,
    name: 'October',
    shortName: 'Oct',
    season: 'amihan',
    seasonLabel: 'Monsoon Transition to Amihan',
    seaRoughness: 'Moderate',
    seaRatingColor: '#F59E0B',
    rainfall: 'Moderate',
    typhoonRisk: 'Moderate',
    tempRange: '25°C – 31°C',
    verdict: 'The shift begins! Habagat winds die down and cool Amihan breezes enter from the northeast. MassKara Festival in Bacolod brings high-energy street parties.',
    recommended: ['Bacolod (MassKara Festival)', 'Siargao', 'Cebu', 'Bohol', 'Palawan (re-opening calm)'],
    caution: ['Late-season tropical depressions passing east of Luzon'],
    packingTip: 'Party outfit for MassKara, quick-dry shorts, rain poncho just in case.'
  },
  {
    month: 11,
    name: 'November',
    shortName: 'Nov',
    season: 'amihan',
    seasonLabel: 'Amihan Awakening (Breezy & Cool)',
    seaRoughness: 'Calm',
    seaRatingColor: '#39A96B',
    rainfall: 'Low',
    typhoonRisk: 'Low',
    tempRange: '24°C – 30°C',
    verdict: 'Amihan is fully established. West coast waters turn flat and clear. Boracay White Beach takes down wind nets. Excellent month before peak holiday crowds.',
    recommended: ['Boracay', 'Coron', 'El Nido', 'Baguio', 'Vigan', 'Batangas'],
    caution: ['Pacific seaboard swells continue for surfers'],
    packingTip: 'Light cardigan for evening breezes, sunglasses, camera with polarizing filter.'
  },
  {
    month: 12,
    name: 'December',
    shortName: 'Dec',
    season: 'amihan',
    seasonLabel: 'Festive Amihan (Cold & Sunny)',
    seaRoughness: 'Calm',
    seaRatingColor: '#39A96B',
    rainfall: 'Low',
    typhoonRisk: 'Low',
    tempRange: '23°C – 28°C',
    verdict: 'World-famous Philippine Christmas season! Crisp Siberian winds bring chilly evenings. Western beaches are postcard perfection. Festive night markets nationwide.',
    recommended: ['Boracay', 'El Nido', 'Baguio (Christmas Village)', 'Coron', 'Bohol', 'Cebu'],
    caution: ['Book flights & hotels 2-3 months early for Pasko holidays'],
    packingTip: 'Festive holiday wear, sweater for Baguio, reef-safe sunscreen for beach days.'
  }
];

export interface CoronaClimateType {
  type: 'Type I' | 'Type II' | 'Type III' | 'Type IV';
  title: string;
  seasons: string;
  rainPattern: string;
  coveredAreas: string[];
  bestTravelPeriod: string;
  color: string;
}

export const CORONA_CLIMATE_TYPES: CoronaClimateType[] = [
  {
    type: 'Type I',
    title: 'Two Pronounced Seasons: Dry & Wet',
    seasons: 'Dry: Nov – Apr | Wet: May – Oct',
    rainPattern: 'Shielded by mountains from Amihan; exposed to Habagat rains and typhoons.',
    coveredAreas: ['Metro Manila', 'Ilocos', 'Zambales', 'Bataan', 'Batangas', 'Mindoro Occidental', 'Western Palawan'],
    bestTravelPeriod: 'November to April (Amihan and Summer)',
    color: '#087EA4'
  },
  {
    type: 'Type II',
    title: 'No Dry Season, Maximum Winter Rain',
    seasons: 'Heavy Rain: Nov – Jan | Moderate rest of year',
    rainPattern: 'Exposed to Pacific Amihan winds dumping moisture onto eastern mountain ranges.',
    coveredAreas: ['Bicol (Catanduanes, Albay)', 'Eastern Samar', 'Southern Leyte', 'Surigao del Norte (Siargao)', 'Davao Oriental'],
    bestTravelPeriod: 'March to October (Summer & Habagat surf months)',
    color: '#39A96B'
  },
  {
    type: 'Type III',
    title: 'Intermediate Seasons (Short Dry Spell)',
    seasons: 'Relatively Dry: Nov – Apr | Moderate Rain: May – Oct',
    rainPattern: 'Sheltered inland by surrounding island landmasses; milder extremes.',
    coveredAreas: ['Cebu', 'Bohol', 'Negros Oriental (Dumaguete)', 'Romblon', 'Northern Palawan'],
    bestTravelPeriod: 'Year-round friendly, peak from December to May',
    color: '#F59E0B'
  },
  {
    type: 'Type IV',
    title: 'Rainfall Evenly Distributed Year-Round',
    seasons: 'No pronounced dry or wet season',
    rainPattern: 'Far south, mostly below the Philippine typhoon belt with gentle tropical microclimates.',
    coveredAreas: ['Davao Region', 'Samal Island', 'Bukidnon', 'Zamboanga', 'Cotabato'],
    bestTravelPeriod: 'Year-round (Safe haven during typhoon months July-Sept)',
    color: '#8B5CF6'
  }
];

export interface CoastalSeaZone {
  name: string;
  currentStatus: 'Glass-Calm' | 'Moderate Swell' | 'Heavy Swell';
  statusColor: string;
  amihanState: string;
  habagatState: string;
  divingRating: 'Prime 5★' | 'Good 4★' | 'Challenging 3★';
  surfingRating: 'Flat' | 'Gentle' | 'Epic 5★';
  topIslands: string[];
}

export const COASTAL_SEAS_STATUS: CoastalSeaZone[] = [
  {
    name: 'West Philippine Sea & Palawan Coast',
    currentStatus: 'Glass-Calm',
    statusColor: '#39A96B',
    amihanState: 'Mirror-flat water, 30m+ underwater visibility, turquoise coves.',
    habagatState: 'Onshore wind chop, rolling waves, occasional gale warnings.',
    divingRating: 'Prime 5★',
    surfingRating: 'Flat',
    topIslands: ['Coron', 'El Nido', 'Boracay White Beach', 'Puerto Princesa', 'Zambales']
  },
  {
    name: 'Pacific Seaboard (Eastern Coast)',
    currentStatus: 'Moderate Swell',
    statusColor: '#F59E0B',
    amihanState: 'Active ocean swell, exhilarating coastal waves, great for experienced surfers.',
    habagatState: 'Premier surf season; international surfing barrels at Cloud 9.',
    divingRating: 'Good 4★',
    surfingRating: 'Epic 5★',
    topIslands: ['Siargao (Cloud 9)', 'Baler (Sabang)', 'Catanduanes (Puraran)', 'Eastern Samar']
  },
  {
    name: 'Inland Visayan Seas (Sheltered Channels)',
    currentStatus: 'Glass-Calm',
    statusColor: '#39A96B',
    amihanState: 'Sheltered by surrounding large islands, highly predictable fast ferry schedules.',
    habagatState: 'Gentle to moderate chop, reliable RoRo and OceanJet ferry crossings.',
    divingRating: 'Prime 5★',
    surfingRating: 'Flat',
    topIslands: ['Cebu Mactan', 'Bohol Strait', 'Siquijor Island', 'Guimaras Strait']
  },
  {
    name: 'Sulu Sea & Celebes Basin',
    currentStatus: 'Glass-Calm',
    statusColor: '#39A96B',
    amihanState: 'Breezy northern perimeter; tranquil southern basin.',
    habagatState: 'Calm in Davao Gulf, choppy in deep open ocean channels.',
    divingRating: 'Prime 5★',
    surfingRating: 'Flat',
    topIslands: ['Tubbataha Reefs (Mar-Jun)', 'Samal Island', 'Davao Gulf', 'Tawi-Tawi']
  }
];

export const PCG_ADVISORY_RULES = [
  {
    signal: 'TCWS Signal #1',
    windSpeed: '39 to 61 km/h',
    rule: 'MANDATORY PCG VOYAGE SUSPENSION',
    description: 'All motorized bancas, outrigger island hopping boats, and fastcraft vessels are legally grounded by the Philippine Coast Guard (PCG). No island hopping allowed.',
    action: 'Reschedule sea crossings immediately. Switch itinerary to inland tours, waterfalls, museums, or local food crawls.'
  },
  {
    signal: 'Thermal Wind Rule (8 AM - 1 PM)',
    windSpeed: 'Daily Island Breeze',
    rule: 'EARLY MORNING ISLAND HOPPING MANDATE',
    description: 'During both Amihan and Habagat, open tropical sea breezes strengthen significantly after 1:30 PM due to island land heating.',
    action: 'Always schedule banca departure at 7:30 AM – 8:30 AM to enjoy glass-calm waters before afternoon chop sets in.'
  },
  {
    signal: 'Ferry Buffer Day Strategy',
    windSpeed: 'Travel Logistics Protocol',
    rule: 'AIRPORT BUFFER DAY RULE',
    description: 'If staying on a remote island requiring a fastcraft ferry (e.g., Siquijor to Cebu, Coron to El Nido, Bantayan to Hagnaya), always return to the mainland 1 full day before your international or domestic flight.',
    action: 'Never book a morning ferry and afternoon departure flight on the same day during monsoon transition months.'
  }
];
