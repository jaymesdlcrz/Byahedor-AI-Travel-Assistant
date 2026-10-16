import { Destination } from '../types';

export const DESTINATIONS: Destination[] = [
  {
    id: 'siargao',
    name: 'Siargao Island',
    location: 'Surigao del Norte, Philippines',
    region: 'Mindanao',
    tagline: 'The Surfing Capital of the Philippines & Tropical Paradise',
    description: 'A teardrop-shaped island famous for world-class surf breaks like Cloud 9, secluded turquoise tidal rock pools, coconut palm tree roads, and pristine island hopping.',
    heroImage: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'
    ],
    estimatedDailyBudgetPHP: 3200,
    bestTimeToVisit: 'March to October (Dry & Sunny), Sept-Nov (Prime Surf Waves)',
    idealDurationDays: 4,
    tags: ['Beach & Surf', 'Island Hopping', 'Nature', 'Nightlife', 'Cafes'],
    coordinates: { lat: 9.8584, lng: 126.0469 },
    popularActivities: [
      {
        title: 'Cloud 9 Surfing & Sunset Boardwalk',
        description: 'Catch waves with an accredited surf instructor or watch the sun dip beneath the Pacific.',
        costPHP: 500,
        duration: '2 hours'
      },
      {
        title: 'Tri-Island Tour (Guyam, Daku, Naked Island)',
        description: 'Cruise crystal azure coves, swim on sandbars, and enjoy a giant seafood boodle fight.',
        costPHP: 1500,
        duration: '7 hours'
      },
      {
        title: 'Magpupungko Tidal Rock Pools & Caves',
        description: 'Swim in natural sapphire saltwater infinity pools exposed during morning low tide.',
        costPHP: 150,
        duration: '3 hours'
      },
      {
        title: 'Maasin Secret River Palm Tree Rope Swing',
        description: 'Swing into emerald waters surrounded by lush coconut tree forests.',
        costPHP: 100,
        duration: '1.5 hours'
      }
    ],
    localSpecialties: ['Pan de Coco at local bakeries', 'Seafood Boodle Fight', 'Açai & Smoothie Bowls in General Luna', 'Fresh grilled Yellowfin Tuna'],
    travelTips: [
      'Rent a scooter with surfboard rack for ₱350/day to explore at your own pace.',
      'Check tide charts before heading to Magpupungko Rock Pools (only swimmable at low tide).',
      'Bring cash; many smaller warungs and cafes in northern towns do not take cards.'
    ],
    rating: 4.9,
    reviewCount: 428
  },
  {
    id: 'el-nido',
    name: 'El Nido',
    location: 'Palawan, Philippines',
    region: 'Luzon',
    tagline: 'Towering Limestone Karsts & Secret Emerald Lagoons',
    description: 'World-renowned for striking karst cliffs emerging dramatically from neon turquoise seas, pristine hidden beaches, and unforgettable marine biodiversity in Bacuit Bay.',
    heroImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?auto=format&fit=crop&w=800&q=80'
    ],
    estimatedDailyBudgetPHP: 3800,
    bestTimeToVisit: 'November to May (Dry Season)',
    idealDurationDays: 4,
    tags: ['Island Hopping', 'Kayaking', 'Snorkeling', 'Limestone Karsts', 'Scuba Diving'],
    coordinates: { lat: 11.2001, lng: 119.4167 },
    popularActivities: [
      {
        title: 'Tour A: Big Lagoon & Secret Lagoon',
        description: 'Kayak through dramatic limestone corridors into calm translucent waters.',
        costPHP: 1200,
        duration: '7 hours'
      },
      {
        title: 'Tour C: Hidden Beach & Matinloc Shrine',
        description: 'Snorkel among vibrant coral gardens and swim through limestone fissures.',
        costPHP: 1400,
        duration: '7 hours'
      },
      {
        title: 'Nacpan Beach & Sunset Glamping',
        description: '4km stretch of golden sand lined with coconut palms and chill beach bars.',
        costPHP: 400,
        duration: '4 hours'
      }
    ],
    localSpecialties: ['Chao Long (Palawan Beef Noodle Soup)', 'Fresh Uni (Sea Urchin)', 'Danggit Lamayo', 'Cashew nuts'],
    travelTips: [
      'Pay the Eco-Tourism Development Fee (₱200) valid for 10 days.',
      'Rent a kayak in Big Lagoon early to avoid peak mid-day boat traffic.',
      'Take the scenic ferry between El Nido and Coron for a 2-in-1 Palawan adventure.'
    ],
    rating: 4.95,
    reviewCount: 612
  },
  {
    id: 'coron',
    name: 'Coron Island',
    location: 'Palawan, Philippines',
    region: 'Luzon',
    tagline: 'Sunken WWII Shipwrecks & Enchanted Kayangan Lake',
    description: 'A diver and nature lover paradise characterized by crystal-clear freshwater lakes nestled in karst mountains, surreal thermoclines, and coral-encrusted Japanese shipwrecks.',
    heroImage: 'https://images.unsplash.com/photo-1578922746465-3a80a228f223?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
    ],
    estimatedDailyBudgetPHP: 3400,
    bestTimeToVisit: 'December to May (Calm waters, high underwater visibility)',
    idealDurationDays: 3,
    tags: ['Wreck Diving', 'Lakes', 'Hot Springs', 'Coral Sanctuaries'],
    coordinates: { lat: 11.9986, lng: 120.2043 },
    popularActivities: [
      {
        title: 'Kayangan Lake & Barracuda Lake Tour',
        description: 'Hike to the iconic Coron viewpoint and dive into the cleanest freshwater lake in Asia.',
        costPHP: 1600,
        duration: '8 hours'
      },
      {
        title: 'Skeleton Wreck & Coral Garden Snorkeling',
        description: 'Snorkel directly above a sunken WWII vessel swarming with clownfish and sea turtles.',
        costPHP: 600,
        duration: '3 hours'
      },
      {
        title: 'Maquinit Natural Saltwater Hot Springs',
        description: 'Soak in 38-40°C mineral hot springs fringed by mangrove forests under the stars.',
        costPHP: 250,
        duration: '2 hours'
      }
    ],
    localSpecialties: ['Lato (Sea Grape Salad)', 'Grilled Stuffed Squid', 'Palawan Honey', 'Cashew treats'],
    travelTips: [
      'Hike Mt. Tapyas (724 steps) at 4:30 PM for a 360-degree sunset over Coron Bay.',
      'Aqua shoes are essential because limestone rocks can be sharp.',
      'Respect the ancestral domain rules of the indigenous Tagbanwa people.'
    ],
    rating: 4.88,
    reviewCount: 390
  },
  {
    id: 'cebu',
    name: 'Cebu & Moalboal',
    location: 'Central Visayas, Philippines',
    region: 'Visayas',
    tagline: 'Kawasan Canyoneering, Sardine Runs & Historic Heart',
    description: 'The queen city of the south blending deep 500-year colonial heritage with adrenaline adventures like Kawasan canyon jumps, million-fish sardine balls, and pristine island escapes.',
    heroImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
    ],
    estimatedDailyBudgetPHP: 2600,
    bestTimeToVisit: 'January to May (Sinulog Festival in 3rd Sunday of January)',
    idealDurationDays: 4,
    tags: ['Adrenaline', 'Waterfalls', 'Heritage', 'Food & Lechon', 'Marine Life'],
    coordinates: { lat: 10.3157, lng: 123.8854 },
    popularActivities: [
      {
        title: 'Kawasan Falls Gatorade Canyoneering',
        description: 'Cliff jump from 5m to 12m into surreal neon-blue canyon rapids guided by certified pros.',
        costPHP: 1500,
        duration: '5 hours'
      },
      {
        title: 'Moalboal Sardine Run & Turtle Snorkel',
        description: 'Step right off the beach to swim amid millions of swirling sardines and gentle turtles.',
        costPHP: 300,
        duration: '2.5 hours'
      },
      {
        title: 'Cebu City Heritage Trail & Lechon Crawl',
        description: 'Visit Magellan’s Cross, Basilica del Sto. Niño, and feast on crispy Carcar lechon.',
        costPHP: 600,
        duration: '4 hours'
      }
    ],
    localSpecialties: ['Authentic Cebu Lechon with spicy vinegar', 'Danggit dried fish from Taboan Market', 'Pochero', 'Ngohiong', 'Mango Float'],
    travelTips: [
      'Take Ceres buses from South Bus Terminal for cheap, comfortable transit across Cebu province.',
      'Canyoneering guides provide mandatory helmets, life vests, and water booties.',
      'Do not touch or harass the sea turtles in Moalboal.'
    ],
    rating: 4.85,
    reviewCount: 520
  },
  {
    id: 'batanes',
    name: 'Batanes',
    location: 'Cagayan Valley, Philippines',
    region: 'Luzon',
    tagline: 'The Home of the Winds, Rolling Hills & Ivatan Culture',
    description: 'The northernmost frontier of the Philippines. Marvel at rolling emerald hills meeting tempestuous seas, historic Ivatan stone houses, lighthouses, and legendary zero-crime honesty coffee shops.',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=80'
    ],
    estimatedDailyBudgetPHP: 4500,
    bestTimeToVisit: 'December to May (Pleasant cool winds, blooming pasturelands)',
    idealDurationDays: 4,
    tags: ['Scenic Hills', 'Heritage', 'Culture', 'Lighthouses', 'Photography'],
    coordinates: { lat: 20.4485, lng: 121.9708 },
    popularActivities: [
      {
        title: 'North & South Batan Island Tour',
        description: 'Explore Marlboro Hills (Rakuh a Payaman), Basco Lighthouse, and Valugan Boulder Beach.',
        costPHP: 2000,
        duration: '8 hours'
      },
      {
        title: 'Sabtang Island Heritage & Stone Houses',
        description: 'Cross the channel on a traditional Faluwa boat to Chavayan and Savidug Ivatan villages.',
        costPHP: 1800,
        duration: '7 hours'
      },
      {
        title: 'Honesty Coffee Shop Experience',
        description: 'Visit the world-famous unstaffed coffee shop built entirely on honesty and trust.',
        costPHP: 150,
        duration: '1 hour'
      }
    ],
    localSpecialties: ['Luñis (Ivatan pork confit)', 'Uvud Balls', 'Dibang (Flying Fish)', 'Vunung meal wrapped in kabaya leaf'],
    travelTips: [
      'Book flights well in advance as Basco (BSO) has limited small-aircraft daily slots.',
      'Wear a windbreaker even during sunny months; Batanes is famously breezy.',
      'Learn basic Ivatan greetings: "Capian ka pa nu Dios!" (God bless you).'
    ],
    rating: 4.98,
    reviewCount: 285
  },
  {
    id: 'boracay',
    name: 'Boracay Island',
    location: 'Aklan, Philippines',
    region: 'Visayas',
    tagline: 'World-Renowned 4km White Beach & Sunset Paraw Sailing',
    description: 'Consistently ranked among the world best beaches for its sugar-fine powder white sand, calm shallow waters, world-class nightlife, and iconic sunset Paraw sailboats.',
    heroImage: 'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80'
    ],
    estimatedDailyBudgetPHP: 3500,
    bestTimeToVisit: 'November to May (Amihan Season with mirror-flat glassy waters)',
    idealDurationDays: 3,
    tags: ['White Sand Beach', 'Water Sports', 'Nightlife', 'Sunset Sailing', 'Dining'],
    coordinates: { lat: 11.9674, lng: 121.9248 },
    popularActivities: [
      {
        title: 'Sunset Paraw Sailing',
        description: 'Glide silently across Boracay crystal waters on a traditional double-outrigger sailboat during sunset.',
        costPHP: 800,
        duration: '1 hour'
      },
      {
        title: 'Helmet Diving & Scuba Discovery',
        description: 'Walk on the ocean floor surrounded by friendly tropical damselfish and coral reefs.',
        costPHP: 1200,
        duration: '1.5 hours'
      },
      {
        title: 'Puka Shell Beach & Bulabog Kite Surfing',
        description: 'Escape the crowd for natural shell sands and vibrant kitesurfing action on the eastern shore.',
        costPHP: 300,
        duration: '3 hours'
      }
    ],
    localSpecialties: ['Jonah’s Fruit Shakes (Mango Banana)', 'Chori Burger (Sweet Chorizo burger)', 'Four Cheese Pizza at Two Seasons', 'Calamansi Muffin'],
    travelTips: [
      'Book DOT-accredited accommodations before arrival; proof of booking is required at Caticlan jetty.',
      'Single-use plastics and smoking/drinking on the main beachfront are strictly prohibited.'
    ],
    rating: 4.82,
    reviewCount: 780
  },
  {
    id: 'bohol',
    name: 'Bohol & Panglao',
    location: 'Central Visayas, Philippines',
    region: 'Visayas',
    tagline: 'Chocolate Hills, World’s Smallest Tarsiers & Loboc River',
    description: 'A diverse natural sanctuary featuring over 1,700 conical Chocolate Hills, the world smallest primates, serene emerald river cruises, and vibrant Balicasag sea turtle dives.',
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80'
    ],
    estimatedDailyBudgetPHP: 2800,
    bestTimeToVisit: 'December to May (Hills turn chocolate brown during dry March-May)',
    idealDurationDays: 3,
    tags: ['Chocolate Hills', 'Wildlife', 'River Cruise', 'Scuba Diving', 'Heritage Churches'],
    coordinates: { lat: 9.8500, lng: 124.1435 },
    popularActivities: [
      {
        title: 'Chocolate Hills Viewing & ATV Trail',
        description: 'Climb the viewing deck or ride all-terrain quad bikes through the base of the geological domes.',
        costPHP: 1100,
        duration: '3 hours'
      },
      {
        title: 'Loboc Floating River Buffet Cruise',
        description: 'Dine on traditional Filipino specialties while serenaded by local folk musicians down the emerald river.',
        costPHP: 950,
        duration: '2 hours'
      },
      {
        title: 'Balicasag Marine Sanctuary Dolphin & Turtle Tour',
        description: 'Early morning dolphin watching followed by drift snorkeling with green sea turtles.',
        costPHP: 1600,
        duration: '5 hours'
      }
    ],
    localSpecialties: ['Peanut Kisses', 'Calamay in coconut shell', 'Boholano Humba', 'Organic farm dining at Bohol Bee Farm'],
    travelTips: [
      'Keep quiet and turn off camera flashes when visiting the Corella Tarsier Sanctuary.',
      'Rent a car or hire a local van for the countryside tour to hit all landmarks efficiently.'
    ],
    rating: 4.86,
    reviewCount: 460
  },
  {
    id: 'sagada',
    name: 'Sagada & Banaue',
    location: 'Mountain Province, Cordillera, Philippines',
    region: 'Luzon',
    tagline: 'Hanging Coffins, Sea of Clouds & Ancient Rice Terraces',
    description: 'A serene mountain haven perched high in the Cordilleras. Experience 2,000-year-old UNESCO rice terraces, hanging cliff coffins, mystical cave spelunking, and crisp mountain Arabica coffee.',
    heroImage: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=80'
    ],
    estimatedDailyBudgetPHP: 2200,
    bestTimeToVisit: 'November to February (Coolest weather and magical sea of clouds)',
    idealDurationDays: 3,
    tags: ['Mountain & Trekking', 'Sea of Clouds', 'Cave Spelunking', 'Indigenous Culture', 'Coffee'],
    coordinates: { lat: 17.0833, lng: 120.9000 },
    popularActivities: [
      {
        title: 'Kiltepan / Marlboro Hills Sunrise & Sea of Clouds',
        description: 'Wake up at 4:30 AM to witness the sun piercing through a vast fluffy sea of clouds.',
        costPHP: 450,
        duration: '3 hours'
      },
      {
        title: 'Sumaguing Cave & Lumiang Cave Connection',
        description: 'Spelunk through glittering limestone stalactites and subterranean cold pools.',
        costPHP: 800,
        duration: '4 hours'
      },
      {
        title: 'Echo Valley & Ancient Hanging Coffins Walk',
        description: 'Trek pine-forested trails to view the centuries-old Igorot cliff burial site.',
        costPHP: 300,
        duration: '2 hours'
      }
    ],
    localSpecialties: ['Sagada Arabica Coffee with Muscovado', 'Etag (Smoked mountain pork)', 'Lemon Pie House', 'Yoghurt House bowls', 'Pinikpikan'],
    travelTips: [
      'Register at the Sagada Municipal Tourist Information Center upon arrival (₱100 fee).',
      'Local DOT-certified guides are mandatory for all caves and treks for your safety.',
      'Pack warm layers; temperatures drop below 12°C at night.'
    ],
    rating: 4.91,
    reviewCount: 310
  },
  {
    id: 'siquijor',
    name: 'Siquijor Island',
    location: 'Central Visayas, Philippines',
    region: 'Visayas',
    tagline: 'The Mystical Island of Fire, Healing & Enchanting Falls',
    description: 'An enchanting island famed for turquoise multi-tiered Cambugahay Falls, cliff jumping at Salagdoong, centuries-old Balete fish spa trees, and peaceful untouched coastal roads.',
    heroImage: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'
    ],
    estimatedDailyBudgetPHP: 2300,
    bestTimeToVisit: 'November to May (Calm seas & optimal cliff jumping)',
    idealDurationDays: 3,
    tags: ['Waterfalls', 'Cliff Jumping', 'Mystical Lore', 'Relaxation', 'Snorkeling'],
    coordinates: { lat: 9.1999, lng: 123.5952 },
    popularActivities: [
      {
        title: 'Cambugahay 3-Tier Falls Tarzan Swing',
        description: 'Swing into clear jade waters under the shade of tropical forest canopies.',
        costPHP: 100,
        duration: '3 hours'
      },
      {
        title: '400-Year-Old Old Enchanted Balete Tree Fish Spa',
        description: 'Dip your feet into spring water while tiny doctor fish provide a gentle exfoliating tickle.',
        costPHP: 50,
        duration: '1 hour'
      },
      {
        title: 'Salagdoong Beach 35ft Cliff Jump',
        description: 'Leap from concrete diving boards into sparkling sapphire waters.',
        costPHP: 150,
        duration: '3 hours'
      }
    ],
    localSpecialties: ['Torta Siquijor', 'Pan Bisaya baked in coconut husks', 'Fresh sea urchin', 'Local herbal healing oils'],
    travelTips: [
      'Rent a scooter at Siquijor Port for ₱300-₱350/day — the 75km coastal circumferential road is smooth and easy to navigate.',
      'Easily accessible via a 45-minute fast craft ferry from Dumaguete.'
    ],
    rating: 4.89,
    reviewCount: 340
  },
  {
    id: 'vigan',
    name: 'Vigan Heritage City',
    location: 'Ilocos Sur, Philippines',
    region: 'Luzon',
    tagline: 'UNESCO World Heritage Spanish Colonial Gem',
    description: 'One of the finest preserved Spanish colonial towns in Asia. Stroll cobblestone streets along Calle Crisologo illuminated by antique lanterns, ride traditional kalesas, and savor crispy Ilocos empanadas.',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?auto=format&fit=crop&w=800&q=80'
    ],
    estimatedDailyBudgetPHP: 2000,
    bestTimeToVisit: 'November to March (Cooler dry climate for leisurely walking tours)',
    idealDurationDays: 2,
    tags: ['Heritage & History', 'Cobblestone Streets', 'Street Food', 'Colonial Architecture'],
    coordinates: { lat: 17.5747, lng: 120.3869 },
    popularActivities: [
      {
        title: 'Calle Crisologo Twilight Walk & Kalesa Ride',
        description: 'Step back into the 16th century along heritage ancestral homes lit by amber lanterns.',
        costPHP: 250,
        duration: '2 hours'
      },
      {
        title: 'Bantay Bell Tower & St. Augustine Church',
        description: 'Climb the historic belfry hill offering sweeping vistas over Ilocos Sur countryside.',
        costPHP: 100,
        duration: '1.5 hours'
      },
      {
        title: 'Pagburnayan Traditional Pottery Making',
        description: 'Try crafting earthen Burnay jars on a foot-powered potter’s wheel with master artisans.',
        costPHP: 100,
        duration: '1 hour'
      }
    ],
    localSpecialties: ['Vigan Longganisa (Garlicky sausage)', 'Crispy Orange Ilocos Empanada', 'Bagnet (Crispy fried pork belly)', 'Poqui-Poqui (Eggplant scramble)', 'Royal Bibingka'],
    travelTips: [
      'Visit Calle Crisologo between 6:00 AM (empty photo ops) and 7:00 PM (illuminated lanterns).',
      'Pair Vigan with a day trip to the sand dunes of Paoay for thrilling 4x4 rides.'
    ],
    rating: 4.84,
    reviewCount: 375
  }
];
