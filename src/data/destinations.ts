import { Destination } from '../types';

export const DESTINATIONS: Destination[] = [
  {
    id: 'siargao',
    name: 'Siargao Island',
    location: 'Surigao del Norte, Philippines',
    region: 'Mindanao',
    tagline: 'The Surfing Capital of the Philippines & Tropical Paradise',
    description: 'A teardrop-shaped island famous for world-class surf breaks like Cloud 9, secluded turquoise tidal rock pools, coconut palm tree roads, and pristine island hopping.',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Cloud_9_Boardwalk%2C_Siargao.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/8/83/Cloud_9_Siargao_Island_Sunset.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/a/a4/The_calm_sea_of_cloud_9_siargao_island_philippines.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/1/1c/Siargao_island.jpg'
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
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/8/86/El_Nido_Palawan_Big_Lagoon.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/1/19/The_Last_Frontier%2C_El_Nido_Palawan_Big_Lagoon.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/a/a5/Big_Lagoon_at_El_Nido%2C_Palawan%2C_Philippines.jpg'
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
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Kayangan_Lake%2C_Coron%2C_Palawan.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/3/3b/Kayangan_Lake%2C_Coron_Island.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/c/ca/Coron_Kayangan_Lake_Entrance_%2873005283%29.jpeg'
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
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Kawasan_Falls_Cebu_Island.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/1/1e/Kawasan_Falls%2C_Cebu%2C_Philippines1.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/8/8b/Kawasan_Falls_Cebu.jpg'
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
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Basco_Lighthouse%2C_Day_Photo.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/4/48/Batanes_lighthouse_at_Basco_-_Flickr.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Sabtang_Batanes.jpg/1280px-Sabtang_Batanes.jpg'
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
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Boracay_White_Beach_in_day_%28985286231%29.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/3/3e/Boracay_white_beach_in_2014.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/c/cd/Boracay_White_Beach.png'
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
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Chocolate_Hills_-_edit.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/2/28/Chocolate_Hills_overview.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/5/52/Bohol_Hills%2C_Chocolate_Hills_4%2C_Philippines.jpg'
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
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Banaue_Philippines_Batad-Rice-Terraces-02.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/5/50/Banaue_Philippines_Banaue-Rice-Terraces-01.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Sagada_skyline_%28Sagada%2C_Mountain_Province%3B_12-01-2022%29.jpg/1280px-Sagada_skyline_%28Sagada%2C_Mountain_Province%3B_12-01-2022%29.jpg'
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
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Siquijor_-_Cambugahay_Falls.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/d/d3/Cambugahay_falls.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/3/35/Cambugahay_Falls_01.JPG'
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
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Calle_Crisologo%2C_Philippines.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/4/4e/Vigan_heritage_village_Calle_Crisologo-Gen_Luna_calesa_%28Vigan%2C_Ilocos_Sur%3B_11-14-2022%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/6/65/Calle_Crisologo%2C_Vigan_Ilocos_Sur_October%2C_2025.jpg'
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
  },
  {
    id: 'baguio',
    name: 'Baguio City',
    location: 'Benguet, Cordillera, Philippines',
    region: 'Luzon',
    tagline: 'The Summer Capital of the Philippines & City of Pines',
    description: 'Perched 1,500 meters above sea level in the Cordillera mountain range, Baguio offers crisp pine-scented mountain air, scenic boat rides at Burnham Park, sweet strawberry picking in La Trinidad, historic military heritage at Camp John Hay, and thriving indigenous arts.',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Baguio_city_proper_overlooking_Burnham-Harrison_side_%28Baguio_city%3B_12-04-2022%29.jpg/1280px-Baguio_city_proper_overlooking_Burnham-Harrison_side_%28Baguio_city%3B_12-04-2022%29.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Burnham_Park_Rose_Garden_with_city_hall_view_%28Baguio_City%3B_12-04-2022%29.jpg/1280px-Burnham_Park_Rose_Garden_with_city_hall_view_%28Baguio_City%3B_12-04-2022%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Army_Navy%2C_Camp_John_Hay.JPG/1280px-Army_Navy%2C_Camp_John_Hay.JPG'
    ],
    estimatedDailyBudgetPHP: 2200,
    bestTimeToVisit: 'November to February (Coolest months, Panagbenga Flower Festival in February)',
    idealDurationDays: 3,
    tags: ['Pine Forests', 'Cool Mountain Climate', 'Strawberry Picking', 'Art & Culture', 'Cafes'],
    coordinates: { lat: 16.4023, lng: 120.5960 },
    popularActivities: [
      {
        title: 'Strawberry Picking at La Trinidad Farm',
        description: 'Harvest ripe red strawberries directly from agricultural rows alongside local Benguet farmers.',
        costPHP: 500,
        duration: '2 hours'
      },
      {
        title: 'Camp John Hay Pine Trail & Historical Core',
        description: 'Trek serene pine tree-canopied paths, visit the Bell Amphitheater, and enjoy hot cocoa.',
        costPHP: 150,
        duration: '3 hours'
      },
      {
        title: 'BenCab Museum & Tam-awan Cultural Tour',
        description: 'Discover contemporary masterpieces by National Artist Benedicto Cabrera and traditional Ifugao huts.',
        costPHP: 300,
        duration: '3 hours'
      },
      {
        title: 'Burnham Park Swan Boat Rowing & Night Market',
        description: 'Row swan boats on the lake by day and thrift for vintage street finds along Harrison Road at night.',
        costPHP: 200,
        duration: '2 hours'
      }
    ],
    localSpecialties: ['Fresh Strawberry Taho with sago', 'Good Shepherd Ube Jam & Alfajores', 'Garlicky Baguio Longganisa', 'Sundot Kulangot candy', 'Benguet Arabica Coffee'],
    travelTips: [
      'Ride JoyBus or Genesis point-to-point luxury sleeper buses from Cubao or Pasay via TPLEX (approx. 4 hours).',
      'Bring warm jackets and fleece sweaters; evening temperatures regularly drop to 11–14°C.',
      'Visit Good Shepherd Convent early in the morning before ube jam stocks sell out.'
    ],
    rating: 4.87,
    reviewCount: 610
  },
  {
    id: 'camiguin',
    name: 'Camiguin Island',
    location: 'Northern Mindanao, Philippines',
    region: 'Mindanao',
    tagline: 'The Island Born of Fire, White Sandbars & Giant Clams',
    description: 'A breathtaking volcanic wonderland boasting more volcanoes than towns. Walk the crescent-shaped powdery white sandbar of White Island with Mt. Hibok-Hibok looming in the background, snorkel above the submerged crosses of the Sunken Cemetery, and plunge into Katibawasan and Tuasan forest waterfalls.',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Hibokwhiteisl.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Sunken_Cemetery_-_Camiguin_-_panoramio.jpg/1280px-Sunken_Cemetery_-_Camiguin_-_panoramio.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Timpoong_and_Hibok-Hibok_Natural_Monument_in_Camiguin_-_Allan_Jay_Quesada.jpg/1280px-Timpoong_and_Hibok-Hibok_Natural_Monument_in_Camiguin_-_Allan_Jay_Quesada.jpg'
    ],
    estimatedDailyBudgetPHP: 2400,
    bestTimeToVisit: 'March to October (Dry calm seas, Lanzones Festival in late October)',
    idealDurationDays: 3,
    tags: ['Volcanic Island', 'White Sandbar', 'Hot & Cold Springs', 'Snorkeling', 'Waterfalls'],
    coordinates: { lat: 9.1732, lng: 124.7299 },
    popularActivities: [
      {
        title: 'White Island Sandbar Sunrise Outrigger Cruise',
        description: 'Sail to an uninhabited gleaming white sandbar with 360-degree views of Camiguin volcanoes.',
        costPHP: 550,
        duration: '3 hours'
      },
      {
        title: 'Sunken Cemetery Giant Clam Snorkeling',
        description: 'Snorkel among thriving coral gardens and giant clams around the iconic giant sea cross.',
        costPHP: 300,
        duration: '2 hours'
      },
      {
        title: 'Katibawasan Falls & Ardent Hot Springs',
        description: 'Swim beneath a 250ft roaring plunge waterfall and soak in soothing natural geothermal hot springs.',
        costPHP: 200,
        duration: '3 hours'
      },
      {
        title: 'Mt. Hibok-Hibok Volcano Crater Trek',
        description: 'Ascend through mossy cloud forests to the crater summit with licensed community guides.',
        costPHP: 1200,
        duration: '6 hours'
      }
    ],
    localSpecialties: ['Sweet Camiguin Lanzones', 'Pastel de Camiguin (Custard filled sweet buns)', 'Kiping (Crispy cassava wafer with coconut caramel)', 'Chicken Surol in coconut milk with ginger'],
    travelTips: [
      'Accessible via ferry from Balingoan Port (Misamis Oriental) or domestic flights into Camiguin Airport (CGM).',
      'Rent a scooter for ₱350/day to tour the scenic, well-paved 64km circumferential island highway.',
      'Head out to White Island at 5:30 AM before sunrise as there is zero natural shade on the sandbar.'
    ],
    rating: 4.92,
    reviewCount: 330
  },
  {
    id: 'bicol-mayon',
    name: 'Bicol & Mount Mayon',
    location: 'Albay, Bicol Region, Philippines',
    region: 'Luzon',
    tagline: 'World’s Most Perfect Cone Volcano, Lava Trails & Fiery Gastronomy',
    description: 'Home to the world-famous, mathematically symmetrical Mount Mayon, Albay combines thrilling volcanic outdoor adventure with spicy, coconut-rich gastronomy. Ride all-terrain ATVs across rugged black lava fields, admire the historic 1814 Cagsawa bell tower ruins, and savor fiery authentic Bicol Express.',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Cagsawa_ruins.jpg/1280px-Cagsawa_ruins.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Mount_Mayon_Cagsawa_field_view_close-up_%28Busay%2C_Daraga%2C_Albay%3B_04-21-2023%29.jpg/1280px-Mount_Mayon_Cagsawa_field_view_close-up_%28Busay%2C_Daraga%2C_Albay%3B_04-21-2023%29.jpg'
    ],
    estimatedDailyBudgetPHP: 2500,
    bestTimeToVisit: 'March to May (Clear skies offering the most unobstructed views of Mayon peak)',
    idealDurationDays: 3,
    tags: ['Active Volcano', 'ATV Lava Trails', 'Historic Ruins', 'Spicy Food', 'Nature Adventures'],
    coordinates: { lat: 13.2548, lng: 123.6861 },
    popularActivities: [
      {
        title: 'Mayon Black Lava ATV Adventure',
        description: 'Trek on quad bikes across volcanic riverbeds up to the monumental 2006 Black Lava Wall front.',
        costPHP: 1800,
        duration: '3 hours'
      },
      {
        title: 'Cagsawa Ruins Park & Bell Tower Photography',
        description: 'Capture the classic postcard view of the 1814 church belfry with Mayon looming behind.',
        costPHP: 100,
        duration: '1.5 hours'
      },
      {
        title: 'Sumlang Lake Bamboo Rafting',
        description: 'Glide on quiet native bamboo rafts with mirror reflections of the volcano on clear mornings.',
        costPHP: 250,
        duration: '2 hours'
      },
      {
        title: 'Quitinday Green Hills & Pocket Caves Exploration',
        description: 'Hike Albay version of rolling karst hills and explore natural limestone caves.',
        costPHP: 400,
        duration: '3 hours'
      }
    ],
    localSpecialties: ['Authentic Bicol Express', 'Pinangat na Gabi', 'Sili Ice Cream (Chili Ice Cream at 1st Colonial)', 'Crispy Pili Nut candies', 'Toasted Siopao'],
    travelTips: [
      'Book morning ATV rides between 6:00 AM and 8:30 AM before cloud covers typically gather over Mayon cone.',
      'Bicol International Airport (DRP) in Daraga is only 20 minutes from Legazpi City proper.',
      'Test your spice tolerance with Level 1 Sili Ice Cream before daring Level 3 Volcano heat.'
    ],
    rating: 4.89,
    reviewCount: 415
  },
  {
    id: 'tagaytay',
    name: 'Tagaytay & Taal Lake',
    location: 'Cavite & Batangas, Philippines',
    region: 'Luzon',
    tagline: 'Scenic Ridge Views, Crater Lakes & Steaming Bulalo',
    description: 'Perched 600 meters above sea level overlooking the world-famous Taal Lake and Volcano island, Tagaytay is the premier quick cool-climate weekend getaway from Manila. Renowned for its steaming pots of beef marrow Bulalo, boutique farm-to-table restaurants, and panoramic volcanic vistas.',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Taal_Lake_and_Volcano%2C_Tagaytay%2C_Philippines.jpg/1280px-Taal_Lake_and_Volcano%2C_Tagaytay%2C_Philippines.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tagaytay_Highlands%2C_Philippines_%28lulaymb%29_3_-_Flickr.jpg/1280px-Tagaytay_Highlands%2C_Philippines_%28lulaymb%29_3_-_Flickr.jpg'
    ],
    estimatedDailyBudgetPHP: 2400,
    bestTimeToVisit: 'November to March (Cool mountain breezes and clear blue skies)',
    idealDurationDays: 2,
    tags: ['Crater Lake Views', 'Cool Weather', 'Foodie & Bulalo', 'Boutique Cafes', 'Weekend Getaway'],
    coordinates: { lat: 14.1153, lng: 120.9621 },
    popularActivities: [
      {
        title: 'Tagaytay Ridge & Picnic Grove Taal Lake Viewing',
        description: 'Admire dramatic views of the volcanic island within a lake, zipline, and ride horses.',
        costPHP: 150,
        duration: '2 hours'
      },
      {
        title: 'Mahogany Market Authentic Bulalo Feast',
        description: 'Feast on simmering pots of rich beef marrow soup fresh from the butchers on the lower level.',
        costPHP: 450,
        duration: '1.5 hours'
      },
      {
        title: 'Sonya’s Garden & Organic Farm Experience',
        description: 'Wander lush botanical gardens, savor freshly harvested edible flower salads, and relax with spa treatments.',
        costPHP: 650,
        duration: '3 hours'
      },
      {
        title: 'People’s Park in the Sky 360-Degree Panorama',
        description: 'Visit the highest point in Tagaytay overlooking Laguna de Bay, Taal Lake, and Batangas coastlines.',
        costPHP: 100,
        duration: '2 hours'
      }
    ],
    localSpecialties: ['Steaming Beef Bone Marrow Bulalo', 'Crispy Tawilis (Freshwater sardine)', 'Señorita miniature sweet bananas', 'Freshly baked Buko Pie from Cecilia’s or Colette’s', 'Kapeng Barako (Strong Liberica coffee)'],
    travelTips: [
      'Just a 1.5 to 2-hour bus or van ride from Metro Manila (PITX Terminal) via CAVITEX or SLEX.',
      'Head to Mahogany Market upper floor for the most generous, authentic Bulalo servings in town.',
      'Buy warm Buko Pie right out of the oven from original roadside bakeries along Aguinaldo Highway.'
    ],
    rating: 4.81,
    reviewCount: 590
  }
];
