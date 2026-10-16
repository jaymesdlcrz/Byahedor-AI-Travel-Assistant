import { LocalDish } from '../types';

export const LOCAL_EATS: LocalDish[] = [
  {
    id: 'cebu-lechon',
    name: 'Cebu Roasted Lechon',
    nativeName: 'Lechon de Cebu',
    region: 'Cebu, Visayas',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    category: 'Main Dish',
    description: 'Whole suckling pig roasted to golden perfection over charcoal, stuffed with lemongrass (tanglad), garlic, scallions, and laurel leaves. Crispy glass-like skin and juicy meat that needs no sauce.',
    flavorProfile: ['Crispy', 'Savory', 'Garlicky', 'Lemongrass Herbaceous'],
    mustTrySpot: 'House of Lechon (Cebu City) or Carcar Public Market',
    averagePricePHP: '₱350 - ₱600 (per 1/2 kg)',
    dietaryNotes: 'Contains Pork'
  },
  {
    id: 'sinigang-sampalok',
    name: 'Sinigang na Hipon / Baboy',
    nativeName: 'Sinigang',
    region: 'Luzon / Nationwide',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    category: 'Soup/Stew',
    description: 'The soul of Filipino comfort cooking: a tart, tangy tamarind broth loaded with water spinach (kangkong), radish, string beans, eggplant, and jumbo prawns or tender pork belly.',
    flavorProfile: ['Sour & Tangy', 'Savory', 'Umami', 'Fresh Vegetal'],
    mustTrySpot: 'Locavore (Manila) / Seaside Carinderias in Batangas & Palawan',
    averagePricePHP: '₱280 - ₱480 per bowl',
    dietaryNotes: 'Gluten-Free Friendly, Seafood/Pork variations'
  },
  {
    id: 'chicken-inasal',
    name: 'Bacolod Chicken Inasal',
    nativeName: 'Manok Inasal',
    region: 'Bacolod, Negros Occidental',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
    category: 'Main Dish',
    description: 'Chicken marinated in calamansi juice, coconut vinegar, ginger, and lemongrass, grilled over fiery coals and basted with bright orange garlic annatto (atsuete) oil.',
    flavorProfile: ['Smoky', 'Tangy Citrus', 'Garlic Butter', 'Savory'],
    mustTrySpot: 'Manokan Country (Bacolod City) / Aida’s Manokan',
    averagePricePHP: '₱130 - ₱220 with unlimited garlic rice',
    dietaryNotes: 'Halal Friendly when certified'
  },
  {
    id: 'sizzling-sisig',
    name: 'Kapampangan Sizzling Sisig',
    nativeName: 'Sisig',
    region: 'Pampanga, Central Luzon',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    category: 'Main Dish',
    description: 'Finely chopped boiled, grilled, and pan-fried pork jowl and cheeks tossed with onions, chicken liver pate, calamansi, and chili peppers on a roaring cast iron hot plate.',
    flavorProfile: ['Crispy & Chewy', 'Zesty Citrus', 'Spicy Heat', 'Rich & Savory'],
    mustTrySpot: 'Aling Lucing Sisig (Angeles City, Pampanga) — The birthplace of modern Sisig',
    averagePricePHP: '₱180 - ₱320',
    dietaryNotes: 'Pairs best with ice-cold beverage & steaming rice'
  },
  {
    id: 'kinilaw-tanigue',
    name: 'Visayan Fish Kinilaw',
    nativeName: 'Kinilaw na Isda',
    region: 'Visayas & Mindanao',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    category: 'Seafood',
    description: 'Fresh raw yellowfin tuna or Spanish mackerel cured instantly in natural coconut vinegar (tuba), calamansi, tabon-tabon, ginger, red bird’s eye chilies, and creamy coconut milk.',
    flavorProfile: ['Fresh Seafood', 'Acidic Kick', 'Fiery Chili', 'Creamy Coconut'],
    mustTrySpot: 'Yellow Fin Seafood Restaurant (Davao) / General Luna beachfronts (Siargao)',
    averagePricePHP: '₱250 - ₱450',
    dietaryNotes: 'Pescatarian, Gluten-Free, Raw Cured'
  },
  {
    id: 'halo-halo-espesyal',
    name: 'Halo-Halo Espesyal',
    nativeName: 'Halo-Halo',
    region: 'Nationwide',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
    category: 'Dessert',
    description: 'The ultimate tropical summer cooler: shaved ice layered with sweet sweetened bananas, jackfruit, ube halaya, leche flan, coconut strips, pinipig, and topped with a scoop of purple yam (ube) ice cream.',
    flavorProfile: ['Sweet & Creamy', 'Velvety Ube', 'Caramel Flan', 'Refreshing Ice'],
    mustTrySpot: 'Milky Way Cafe (Makati) / Razon’s of Guagua / Island Fruit Carts',
    averagePricePHP: '₱110 - ₱240',
    dietaryNotes: 'Vegetarian Dessert'
  },
  {
    id: 'ilocos-empanada',
    name: 'Vigan / Batac Orange Empanada',
    nativeName: 'Ilocos Empanada',
    region: 'Ilocos Norte & Sur, Luzon',
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80',
    category: 'Street Food',
    description: 'Rice flour dough colored with achuete seed extract, filled with grated green papaya, seasoned Vigan garlic longganisa, and a whole fresh egg, deep fried until blistered and crunchy.',
    flavorProfile: ['Ultra-Crispy', 'Garlicky Sausage', 'Savory Papaya', 'Tangy Sukang Iloko'],
    mustTrySpot: 'Batac Riverside Riverside Empanadaan / Calle Crisologo food stalls',
    averagePricePHP: '₱50 - ₱90 each',
    dietaryNotes: 'Street Food Specialty, dip in spiced dark cane vinegar'
  },
  {
    id: 'bicol-express',
    name: 'Bicol Express',
    nativeName: 'Sinilihan',
    region: 'Bicol Region, Luzon',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    category: 'Main Dish',
    description: 'Pork belly simmered gently in rich coconut cream (gata), fermented shrimp paste (bagoong alamang), and an abundant mountain of green and red finger chilies.',
    flavorProfile: ['Creamy Coconut', 'Intense Chili Heat', 'Briny Umami', 'Pork Richness'],
    mustTrySpot: 'Small Talk Cafe (Legazpi, Albay) / Local Carinderias along Maharlika Highway',
    averagePricePHP: '₱200 - ₱350',
    dietaryNotes: 'Spicy Level: 🌶️🌶️🌶️'
  }
];
