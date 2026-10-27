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
  },
  {
    id: 'davao-samal',
    name: 'Davao City & Samal Island',
    location: 'Davao Region, Southern Mindanao',
    region: 'Mindanao',
    tagline: 'Durian Capital, Mount Apo Hiking & Island Garden of Samal',
    description: 'The sprawling, safe metropolitan hub of Southern Mindanao crowned by the majestic peak of Mount Apo (the Philippines’ highest summit at 2,954m). Just a 10-minute ferry ride across the gulf lies the Island Garden City of Samal, famed for turquoise marine sanctuaries, pearl farms, bat sanctuaries, and powder-white sandbars.',
    heroImage: '/src/assets/images/davao_samal_1793074899188.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Tuktok_ng_Pilipinas.jpg/1280px-Tuktok_ng_Pilipinas.jpg'
    ],
    estimatedDailyBudgetPHP: 2600,
    bestTimeToVisit: 'December to May (Pleasant weather; typhoon-free zone all year round)',
    idealDurationDays: 4,
    tags: ['Island Hopping', 'Wildlife & Nature', 'Mount Apo Trekking', 'Street Food & Durian', 'White Beaches'],
    coordinates: { lat: 7.1907, lng: 125.4553 },
    popularActivities: [
      {
        title: 'Samal Island Hopping & Coral Snorkeling',
        description: 'Cruise to Talicud Island, Wishing Island, and giant clam marine sanctuaries in crystal clear azure waters.',
        costPHP: 1200,
        duration: '7 hours'
      },
      {
        title: 'Philippine Eagle Center Conservation Sanctuary',
        description: 'See the magnificent, critically endangered Philippine Eagle (Pithecophaga jefferyi) and native rainforest raptors.',
        costPHP: 150,
        duration: '3 hours'
      },
      {
        title: 'Roxas Night Market Street Food & Durian Feast',
        description: 'Sample charcoal-grilled tuna jaw (panga), chicken isaw, marang fruit, and fresh creamy Puyat durian on the street.',
        costPHP: 300,
        duration: '2.5 hours'
      },
      {
        title: 'Monfort Bat Sanctuary Tour',
        description: 'Marvel at the Guinness World Record colony of over 1.8 million Geoffrey’s Rousette fruit bats in natural cave fissures.',
        costPHP: 120,
        duration: '1.5 hours'
      }
    ],
    localSpecialties: ['Grilled Tuna Panga & Belly', 'Sinuglaw (Grilled Pork + Tuna Ceviche)', 'Fresh Puyat & Arancillo Durian', 'Native Pomelo (Sweet Suha)', 'Malagos Artisanal Dark Chocolate'],
    travelTips: [
      'Davao is completely outside the Philippine typhoon belt, making it a great destination any month of the year.',
      'Take the 24/7 barge ferry from Sasa Wharf to Samal Island for just ₱15 passenger fare.',
      'Try fresh Durian along Magsaysay Park where vendors will gladly choose the perfect creamy fruit for beginners.'
    ],
    rating: 4.88,
    reviewCount: 395
  },
  {
    id: 'surigao-del-sur',
    name: 'Surigao del Sur & Hinatuan',
    location: 'Caraga Region, Northeastern Mindanao',
    region: 'Mindanao',
    tagline: 'Deep Cobalt Enchanted River & The Niagara of the Philippines',
    description: 'An enchanting eco-tourism frontier featuring the world-famous Hinatuan Enchanted River—a deep cobalt saltwater subterranean river whose underwater caverns remain unexplored. Down south lies Tinuy-an Falls, an awe-inspiring 95-meter wide 3-tiered curtain waterfall, and the 24 pristine uninhabited islands of Britania.',
    heroImage: '/src/assets/images/hinatuan_river_1793074914638.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Tinuy-an_Falls_in_Bislig.jpg/1280px-Tinuy-an_Falls_in_Bislig.jpg'
    ],
    estimatedDailyBudgetPHP: 2500,
    bestTimeToVisit: 'March to October (Dry and calm seas for island hopping)',
    idealDurationDays: 3,
    tags: ['Nature & Eco-Tourism', 'Enchanted Waters', 'Grand Waterfalls', 'Island Hopping', 'Hidden Gem'],
    coordinates: { lat: 8.4907, lng: 126.2952 },
    popularActivities: [
      {
        title: 'Hinatuan Enchanted River & Fish Feeding Ceremony',
        description: 'Witness the mystical 12:00 PM fish feeding ritual where schools of silver trevally surface to the sound of the hymn.',
        costPHP: 100,
        duration: '3 hours'
      },
      {
        title: 'Tinuy-an Falls Bamboo Rafting in Bislig',
        description: 'Ride a traditional bamboo raft directly under the thunderous 95-meter wide cascading curtain of water.',
        costPHP: 150,
        duration: '3 hours'
      },
      {
        title: 'Britania Group of 24 Islands Tour (San Agustin)',
        description: 'Island hop to Naked Island, Boslon Island, and Hagonoy Island’s powder-soft white sandbars.',
        costPHP: 1500,
        duration: '5 hours'
      },
      {
        title: 'Sibadan Fish Cage & Stingray Sanctuary',
        description: 'Interact with friendly wild stingrays and dine on freshly harvested mangrove mud crabs.',
        costPHP: 200,
        duration: '2 hours'
      }
    ],
    localSpecialties: ['Steamed Mangrove Mud Crabs (Alimango)', 'Fresh Lobster & Tiger Prawns', 'Sayongsong (sticky rice and coconut kakanin)', 'Grilled Kitang & Pompano'],
    travelTips: [
      'Fly into Bancasi Airport (BXU) in Butuan or Davao Airport, then hire a private van or take a Bachelor Express bus.',
      'Swimming directly in the main blue pool of the Enchanted River is prohibited to preserve water clarity; a dedicated swimming lagoon is available 20 meters downstream.',
      'Hire a licensed Habal-habal motorcycle driver with a DOT safety helmet for seamless transit between falls.'
    ],
    rating: 4.93,
    reviewCount: 312
  },
  {
    id: 'bukidnon',
    name: 'Bukidnon & Dahilayan Highlands',
    location: 'Northern Mindanao, Philippines',
    region: 'Mindanao',
    tagline: 'Highland Pine Ridges, Vast Pineapple Plains & Pure Alpine Adventure',
    description: 'The cool mountain heart of Mindanao perched on an elevated plateau between Mount Kitanglad and Mount Kalatungan. Known as the food basket of Mindanao, Bukidnon offers crisp alpine pine breezes, massive Del Monte pineapple fields, adrenaline-pumping mountain ziplines, and sacred monastic sanctuaries.',
    heroImage: '/src/assets/images/bukidnon_highlands_1793074929527.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Mt._Kalatungan_Sunrise.jpg/1280px-Mt._Kalatungan_Sunrise.jpg'
    ],
    estimatedDailyBudgetPHP: 2300,
    bestTimeToVisit: 'December to May (Crisp cool mornings and bright sunny afternoons)',
    idealDurationDays: 3,
    tags: ['Mountain & Highlands', 'Zipline & Adventure', 'Cool Climate', 'Pine Forests', 'Pineapple Farms'],
    coordinates: { lat: 8.2140, lng: 124.8690 },
    popularActivities: [
      {
        title: 'Dahilayan Adventure Park Ziplines & DropZone',
        description: 'Fly face-down through lush pine tree canopies on Asia’s longest 840-meter dual zipline at 90 km/h.',
        costPHP: 600,
        duration: '4 hours'
      },
      {
        title: 'Del Monte Camp Phillips Pineapple Plantation',
        description: 'Tour 25,000 hectares of sprawling green pineapple fields and pose with the giant roadside pineapple marker.',
        costPHP: 50,
        duration: '2 hours'
      },
      {
        title: 'Monastery of the Transfiguration Pilgrimage',
        description: 'Visit the peaceful pyramid-shaped church designed by National Artist Leandro Locsin in Malaybalay.',
        costPHP: 0,
        duration: '1.5 hours'
      },
      {
        title: 'Communal Ranch Impasug-ong Scenic Horseback Ride',
        description: 'Ride horses across rolling mountain pastures resembling the New Zealand countryside.',
        costPHP: 300,
        duration: '2.5 hours'
      }
    ],
    localSpecialties: ['Sweet Del Monte MD2 Pineapples', 'Bukidnon Grass-fed Beef Steaks', 'Monk’s Blend Premium Coffee', 'Binaki (Steamed Sweet Corn Cake)', 'Wild Mountain Honey'],
    travelTips: [
      'Fly into Laguindingan Airport (CGY) in Cagayan de Oro; Bukidnon is a scenic 1.5 to 2-hour drive via Sayre Highway.',
      'Pack a light windbreaker or fleece jacket; temperatures in Dahilayan can drop to 16°C in the evenings.',
      'Pick up fresh Monk’s Blend coffee grounds directly from the Monastery of the Transfiguration gift shop.'
    ],
    rating: 4.87,
    reviewCount: 284
  },
  {
    id: 'iloilo-guimaras',
    name: 'Iloilo & Guimaras Island',
    location: 'Western Visayas, Philippines',
    region: 'Visayas',
    tagline: 'The City of Love, UNESCO Heritage Churches & World’s Sweetest Mangoes',
    description: 'A charming cultural and culinary capital blessed with Spanish colonial baroque churches like UNESCO World Heritage Miag-ao, European-style Calle Real heritage buildings, and the raw island beauty of Islas de Gigantes sandbars. Across a short 15-minute boat ride lies Guimaras Island, producer of certified sweet carabaos mangoes.',
    heroImage: '/src/assets/images/iloilo_guimaras_1793074948168.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Miagao_Church_%28Iloilo-Antique_Road%2C_Miagao%2C_Iloilo%3B_04-05-2024%29.jpg/1280px-Miagao_Church_%28Iloilo-Antique_Road%2C_Miagao%2C_Iloilo%3B_04-05-2024%29.jpg'
    ],
    estimatedDailyBudgetPHP: 2600,
    bestTimeToVisit: 'November to May (January features the world-renowned Dinagyang Festival)',
    idealDurationDays: 4,
    tags: ['Heritage & UNESCO', 'World’s Sweetest Mangoes', 'Culinary & Batchoy', 'Island Hopping', 'Culture'],
    coordinates: { lat: 10.7202, lng: 122.5621 },
    popularActivities: [
      {
        title: 'Miag-ao UNESCO Fortress Church Heritage Tour',
        description: 'Admire the 1797 ochre-colored sandstone facade carved with a coconut tree of life and St. Christopher.',
        costPHP: 50,
        duration: '2 hours'
      },
      {
        title: 'Guimaras Island Mango Tour & Beach Hopping',
        description: 'Visit mango research orchards, Guisi Lighthouse ruins, and taste the famous sweet Mango Pizza at The Pitstop.',
        costPHP: 800,
        duration: '6 hours'
      },
      {
        title: 'Islas de Gigantes Day Tour (Cabugao Gamay)',
        description: 'Climb the iconic cliff viewpoint of Cabugao Gamay sandbar and feast on ₱1 scallops in Carles.',
        costPHP: 1400,
        duration: '8 hours'
      },
      {
        title: 'La Paz Public Market Authentic Batchoy Tasting',
        description: 'Sip legendary rich bone marrow soup with miki noodles and crunchy chicharon at Netong’s.',
        costPHP: 150,
        duration: '1.5 hours'
      }
    ],
    localSpecialties: ['Original La Paz Batchoy', 'Sweet Guimaras Carabao Mangoes', 'Pancit Molo (Dumpling Soup)', 'Fresh Scallops & Steamed Wasay-Wasay', 'Barquillos & Biscocho from De Ocampo’s'],
    travelTips: [
      'Pumpboats from Iloilo Parola Wharf to Jordan Wharf in Guimaras take only 15 minutes and cost ₱40.',
      'Scallops at Islas de Gigantes are as cheap as ₱1 to ₱2 per piece during peak harvest seasons!',
      'Stroll along the Iloilo River Esplanade at sunset for one of the cleanest, most pedestrian-friendly urban walks in the country.'
    ],
    rating: 4.91,
    reviewCount: 462
  },
  {
    id: 'dumaguete-apo',
    name: 'Dumaguete & Apo Island',
    location: 'Negros Oriental, Central Visayas',
    region: 'Visayas',
    tagline: 'The Gentle University City & Swimming with Wild Sea Turtles',
    description: 'A relaxed coastal haven known as the "City of Gentle People." Stroll down breezy acacia-lined Rizal Boulevard, visit historic Siliman University, and take a quick boat to Apo Island—one of the world’s most successful community marine sanctuaries where travelers swim alongside dozens of wild giant green sea turtles in shallow coral reefs.',
    heroImage: '/src/assets/images/dumaguete_apo_1793074963512.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Apo_Island_east.jpg/1280px-Apo_Island_east.jpg'
    ],
    estimatedDailyBudgetPHP: 2500,
    bestTimeToVisit: 'October to May (Calm seas and crystal-clear underwater visibility)',
    idealDurationDays: 3,
    tags: ['Sea Turtles & Diving', 'Marine Sanctuaries', 'Gentle City & Cafes', 'Sandbars', 'Waterfalls'],
    coordinates: { lat: 9.3068, lng: 123.3054 },
    popularActivities: [
      {
        title: 'Apo Island Snorkeling with Wild Sea Turtles',
        description: 'Snorkel in shallow, warm reef waters right beside gentle green sea turtles feeding on sea grass.',
        costPHP: 1200,
        duration: '6 hours'
      },
      {
        title: 'Manjuyod White Sandbar ("Maldives of the Philippines")',
        description: 'Cruise to a 7-kilometer pure white sandbar that emerges during low tide with stilt cottages over neon blue water.',
        costPHP: 1500,
        duration: '5 hours'
      },
      {
        title: 'Casaroro Waterfall Trek in Valencia',
        description: 'Descend a 350-step canyon trail to a sheer, roaring 100-foot waterfall framed by volcanic basalt rock walls.',
        costPHP: 150,
        duration: '3 hours'
      },
      {
        title: 'Rizal Boulevard Sunset Stroll & Street Food Tempura',
        description: 'Sip artisan coffee or sample Dumaguete’s famous deep-fried tempura with sweet and spicy leveled sauces.',
        costPHP: 100,
        duration: '2 hours'
      }
    ],
    localSpecialties: ['Silvanas & Sans Rival from Sans Rival Bistro', 'Dumaguete Jumbo Tempura & Balut', 'Budbod Tanjay (sticky chocolate millet kakanin)', 'Fresh Fried Flying Fish (Bangsi)'],
    travelTips: [
      'Tricycles around downtown Dumaguete charge a standardized fare of ₱15 to ₱20 per passenger.',
      'Boats to Apo Island depart from Malatapay Wharf in Zamboanguita (30 mins south of Dumaguete). Visit on Wednesdays for the lively Malatapay livestock & flea market!',
      'Do not touch or crowd the sea turtles at Apo Island; local community guides enforce a strict 3-meter distance policy.'
    ],
    rating: 4.89,
    reviewCount: 378
  },
  {
    id: 'bacolod',
    name: 'Bacolod & Negros Occidental',
    location: 'Western Visayas, Philippines',
    region: 'Visayas',
    tagline: 'The City of Smiles, The Ruins Mansion & Sugarlandia Heritage',
    description: 'The sweet capital of the Philippines famous for vibrant MassKara festival masks, historic 19th-century sugar barons’ ancestral mansions, and the world’s best charcoal-grilled Chicken Inasal. Explore the poignant grandeur of The Ruins in Talisay and escape to Lakawon Island’s floating beach club.',
    heroImage: '/src/assets/images/bacolod_ruins_1793074979127.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/The_Ruins_%28Talisay%2C_Negros_Occidental%29_2023-08-06.jpg/1280px-The_Ruins_%28Talisay%2C_Negros_Occidental%29_2023-08-06.jpg'
    ],
    estimatedDailyBudgetPHP: 2400,
    bestTimeToVisit: 'September to May (October hosts the electric MassKara Festival)',
    idealDurationDays: 3,
    tags: ['Chicken Inasal', 'Heritage Mansions', 'Sweet Treats & Piaya', 'Culture & Festivals', 'Sandbars'],
    coordinates: { lat: 10.6765, lng: 122.9509 },
    popularActivities: [
      {
        title: 'The Ruins Sunset Tour in Talisay',
        description: 'Explore the Taj Mahal of Negros, built out of egg-white concrete as a tribute to a sugar baron’s lost love.',
        costPHP: 150,
        duration: '2.5 hours'
      },
      {
        title: 'Manokan Country Chicken Inasal Feast',
        description: 'Dine with bare hands on chicken basted with orange annatto oil, calamansi, and garlic rice.',
        costPHP: 220,
        duration: '1.5 hours'
      },
      {
        title: 'Silay City Heritage Ancestral Houses Tour',
        description: 'Walk through the "Paris of Negros," featuring more than 30 registered Spanish-American heritage homes.',
        costPHP: 100,
        duration: '3 hours'
      },
      {
        title: 'Lakawon Island Day Trip & TawHai Floating Bar',
        description: 'Sunbathe on a 16-hectare banana-shaped island sandbar and sip cocktails on Asia’s largest floating bar.',
        costPHP: 1100,
        duration: '6 hours'
      }
    ],
    localSpecialties: ['Authentic Charcoal-grilled Chicken Inasal', 'Bacolod Beef Shank Cansi', 'Flaky Muscovado Piaya & Napoleones', 'Fresh Lumpiang Ubod from Emma Lacson’s', 'Calea Pastries Mudpie & Cheesecake'],
    travelTips: [
      'Bacolod-Silay International Airport (BCD) has frequent 1-hour flights from Manila and Cebu.',
      'FastCat or OceanJet ferries connect Bacolod to Iloilo in just 1 hour, making twin-city travel effortless!',
      'Make sure to drizzle fragrant orange Chicken Oil (Achuete Oil) over your garlic rice at Manokan Country.'
    ],
    rating: 4.86,
    reviewCount: 410
  },
  {
    id: 'la-union',
    name: 'La Union (San Juan & Bauang)',
    location: 'Ilocos Region, Northwestern Luzon',
    region: 'Luzon',
    tagline: 'The Surfing Capital of the North & Bohemian Coastal Sunsets',
    description: 'Affectionately known as "Elyu," this vibrant coastal stretch along the West Philippine Sea combines world-class surfing point breaks at Urbiztondo Beach with a bohemian corridor of indie third-wave cafes, sunset bars, and cliff jumps at Tangadan Falls.',
    heroImage: '/src/assets/images/la_union_surf_1793074996871.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Surf%E2%80%99s_up.jpg/1280px-Surf%E2%80%99s_up.jpg'
    ],
    estimatedDailyBudgetPHP: 2800,
    bestTimeToVisit: 'October to March (Peak North Swell surf waves), Year-round for beach culture',
    idealDurationDays: 3,
    tags: ['Surfing & Waves', 'Beach Cafes & Nightlife', 'Waterfalls', 'Sunsets', 'Road Trip'],
    coordinates: { lat: 16.6717, lng: 120.3204 },
    popularActivities: [
      {
        title: 'Surfing Lesson with Certified Instructors at Urbiztondo',
        description: 'Catch your first rolling wave on a longboard along the gentle sandy bottom point break.',
        costPHP: 500,
        duration: '1.5 hours'
      },
      {
        title: 'Tangadan Falls Trek & 30-Foot Cliff Jump',
        description: 'Hike through riverbeds in San Gabriel to a dramatic two-tiered waterfall with thrilling natural diving ledges.',
        costPHP: 650,
        duration: '4 hours'
      },
      {
        title: 'Lomboy Farms Grape Picking in Bauang',
        description: 'Harvest plump, sweet tropical table grapes directly from vineyard trellises in the sunshine.',
        costPHP: 250,
        duration: '2 hours'
      },
      {
        title: 'Urbiztondo Sunset & Cafe Crawl',
        description: 'Watch the sun sink into the West Philippine Sea while savoring iced horchata, craft beer, and fish tacos.',
        costPHP: 450,
        duration: '3 hours'
      }
    ],
    localSpecialties: ['Ilocano Bagnet with KBL (Kamatis, Bagoong, Lasona)', 'Halo-Halo de Iloko (San Fernando)', 'Buko Halo-Halo with Ube & Cheese', 'Artisan Third-Wave Pour-over Coffees', 'Fresh Catch Grilled Tuna & Blue Marlin'],
    travelTips: [
      'Take the Partas or Genesis deluxe bus from Cubao/Pasay directly to Urbiztondo, San Juan (approx. 4.5 hours via TPLEX).',
      'Morning surf sessions (6:00 AM - 9:00 AM) enjoy the cleanest glassy waves with light offshore breezes.',
      'Rent an electric scooter or tricycle to easily navigate between the cafe strip and northern cliff viewpoints.'
    ],
    rating: 4.84,
    reviewCount: 520
  },
  {
    id: 'intramuros-manila',
    name: 'Intramuros & Historic Manila',
    location: 'Metro Manila, Luzon',
    region: 'Luzon',
    tagline: 'The 400-Year-Old Walled City & Colonial Heart of the Philippines',
    description: 'Step into the storied cobblestone streets of "The Walled City," built by Spanish conquistadors in 1571. Intramuros is home to San Agustin Church (a UNESCO World Heritage Site that survived WWII bombings), the historic garrison of Fort Santiago, horse-drawn kalesa carriages, and the world-class National Museum complex.',
    heroImage: '/src/assets/images/intramuros_manila_1793075011986.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/San_Agustin_Church%2C_Intramuros%2C_Manila_City.jpg/1280px-San_Agustin_Church%2C_Intramuros%2C_Manila_City.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Fort_Santiago%2C_Intramuros.JPG/1280px-Fort_Santiago%2C_Intramuros.JPG'
    ],
    estimatedDailyBudgetPHP: 2200,
    bestTimeToVisit: 'November to April (Dry season, ideal for walking and cycling heritage tours)',
    idealDurationDays: 2,
    tags: ['UNESCO & History', 'Colonial Architecture', 'Museums & Art', 'Kalesa & Bamboo Bikes', 'City Walk'],
    coordinates: { lat: 14.5896, lng: 120.9747 },
    popularActivities: [
      {
        title: 'Bambike Eco-Tours on Handcrafted Bamboo Bicycles',
        description: 'Pedal atop 400-year-old volcanic tuff stone walls and through Spanish bastions on sustainable bamboo bikes.',
        costPHP: 600,
        duration: '2.5 hours'
      },
      {
        title: 'San Agustin Church & Baroque Monastery Museum',
        description: 'Marvel at 17th-century trompe l’oeil ceiling frescoes, antique silver altars, and cloister gardens.',
        costPHP: 200,
        duration: '2 hours'
      },
      {
        title: 'Fort Santiago & Jose Rizal Shrine Pilgrimage',
        description: 'Walk the final footsteps of national hero Dr. Jose Rizal from his prison cell to Luneta Park.',
        costPHP: 75,
        duration: '2 hours'
      },
      {
        title: 'National Museum of Fine Arts (The Spoliarium)',
        description: 'Stand in awe before Juan Luna’s colossal masterpiece "Spoliarium" and Filipino masterworks.',
        costPHP: 0,
        duration: '3 hours'
      }
    ],
    localSpecialties: ['Churros con Chocolate at La Cathedral Cafe', 'Ilustrado Restaurant Paella Valenciana', 'Street-side Binondo Pork Buns & Dumplings', 'Classic Manila Halo-Halo & Sorbetes'],
    travelTips: [
      'Easily accessible via LRT-1 Central Terminal station followed by a brief 5-minute walk or electronic trike ride.',
      'Book rooftop seats at La Cathedral Cafe at dusk to admire the illuminated facade of Manila Cathedral.',
      'All National Museum of the Philippines buildings nearby offer 100% FREE admission to all visitors.'
    ],
    rating: 4.85,
    reviewCount: 680
  },
  {
    id: 'caramoan',
    name: 'Caramoan Peninsula',
    location: 'Camarines Sur, Bicol Region, Luzon',
    region: 'Luzon',
    tagline: 'Untamed Limestone Karsts & Secret Pinkish Island Sanctuaries',
    description: 'An untouched coastal paradise tucked along the eastern coast of Camarines Sur. Famous as the recurring filming sanctuary for the international reality show "Survivor," Caramoan boasts dramatic towering limestone pinnacles, secluded lagoons, and the mystical hidden lake of Matukad Island.',
    heroImage: '/src/assets/images/caramoan_islands_1793075033864.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Caramoan_town.jpg/1280px-Caramoan_town.jpg'
    ],
    estimatedDailyBudgetPHP: 2600,
    bestTimeToVisit: 'March to July (Calm seas, low rainfall, and bright tropical sunshine)',
    idealDurationDays: 4,
    tags: ['Survivor Islands', 'Limestone Cliffs', 'Untouched Beaches', 'Snorkeling & Caves', 'Off-the-Beaten-Path'],
    coordinates: { lat: 13.7711, lng: 123.8653 },
    popularActivities: [
      {
        title: 'Matukad Island Secret Lagoon & Rock Climbing',
        description: 'Scale jagged limestone karsts to gaze down on an enclosed saltwater lagoon home to a legendary giant milkfish.',
        costPHP: 1500,
        duration: '6 hours'
      },
      {
        title: 'Lahos Island Twin Beach & Sandbar Exploration',
        description: 'Walk across a sandbar wedged between two monolithic limestone cliffs with ocean waves lapping both sides.',
        costPHP: 1200,
        duration: '5 hours'
      },
      {
        title: 'Cotivas Island Sandbar & Fresh Buko Picnic',
        description: 'Wade through vast shallow turquoise flats and sip fresh coconut water straight from palm trees.',
        costPHP: 1000,
        duration: '4 hours'
      },
      {
        title: 'Mount Caglago 500-Step Shrine to Our Lady of the Peace',
        description: 'Climb 524 steps to the gigantic statue atop the mountain with 360-degree vistas of the Bicol archipelago.',
        costPHP: 50,
        duration: '2 hours'
      }
    ],
    localSpecialties: ['Spicy Bicol Express with Albay Chilis', 'Steamed Sugpo (Giant Tiger Prawns)', 'Fresh Grilled Squid with Calamansi-Soy', 'Laing sa Dahon ng Gabi with Tinapa'],
    travelTips: [
      'Fly into Naga Airport (WNP) or take a luxury overnight sleeper bus from Manila to Naga City, then transfer via van and boat to Guijalo Port.',
      'Wear sturdy reef water shoes with rubber soles; the limestone formations on Matukad Island have razor-sharp volcanic edges.',
      'Hire a licensed community boatman from Bgy. Paniman for the best rates and authentic island lore.'
    ],
    rating: 4.92,
    reviewCount: 298
  }
];
