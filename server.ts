import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const portArgIndex = process.argv.indexOf("--port");
const argPort = portArgIndex !== -1 && process.argv[portArgIndex + 1] ? parseInt(process.argv[portArgIndex + 1], 10) : null;
const envPort = process.env.PORT && process.env.PORT !== "8080" ? parseInt(process.env.PORT, 10) : null;
const defaultAppPort = process.env.DEFAULT_APP_PORT ? parseInt(process.env.DEFAULT_APP_PORT, 10) : null;
const PORT = argPort || defaultAppPort || envPort || 3000;

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
}

const CANDIDATE_AI_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest"
];

// Robust JSON parser for AI outputs that may contain markdown or extra wrapping
function safeParseAiJson(rawText: string): any {
  if (!rawText || !rawText.trim()) return null;
  let text = rawText.trim();
  // Strip code fences
  text = text.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(text);
  } catch {
    // If wrapped in commentary, extract the JSON object or array bounds
    const firstBrace = text.indexOf("{");
    const firstBracket = text.indexOf("[");
    let start = -1;
    if (firstBrace !== -1 && firstBracket !== -1) {
      start = Math.min(firstBrace, firstBracket);
    } else if (firstBrace !== -1) {
      start = firstBrace;
    } else {
      start = firstBracket;
    }

    const lastBrace = text.lastIndexOf("}");
    const lastBracket = text.lastIndexOf("]");
    const end = Math.max(lastBrace, lastBracket);

    if (start !== -1 && end !== -1 && end > start) {
      try {
        const sliced = text.substring(start, end + 1);
        return JSON.parse(sliced);
      } catch {
        return null;
      }
    }
    return null;
  }
}

let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = (process.env.GEMINI_API_KEY || "").trim();
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    try {
      aiClient = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    } catch (e) {
      console.warn("Failed to initialize GoogleGenAI client:", e);
      return null;
    }
  }
  return aiClient;
}

// Resilient multi-model Gemini execution helper with timeout protection
async function generateGeminiContentWithFallback(ai: GoogleGenAI, options: {
  contents: any;
  systemInstruction?: string;
  responseMimeType?: string;
  temperature?: number;
  timeoutMs?: number;
}): Promise<{ text: string; model: string } | null> {
  const models = CANDIDATE_AI_MODELS;
  const timeoutMs = options.timeoutMs || 25000;

  for (const model of models) {
    try {
      const result = await Promise.race([
        ai.models.generateContent({
          model,
          contents: options.contents,
          config: {
            systemInstruction: options.systemInstruction,
            responseMimeType: options.responseMimeType,
            temperature: options.temperature ?? 0.7,
          }
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout with model ${model}`)), timeoutMs)
        )
      ]);

      if (result && result.text && result.text.trim()) {
        return { text: result.text.trim(), model };
      }
    } catch (err: any) {
      console.warn(`[Gemini generateContent] Model ${model} failed:`, err?.message || err);
    }
  }
  return null;
}

// Resilient multi-model streaming helper
async function streamGeminiContentWithFallback(ai: GoogleGenAI, options: {
  contents: any;
  systemInstruction?: string;
  temperature?: number;
  timeoutMs?: number;
}): Promise<{ stream: any; model: string } | null> {
  const models = CANDIDATE_AI_MODELS;
  const timeoutMs = options.timeoutMs || 20000;

  for (const model of models) {
    try {
      const streamPromise = ai.models.generateContentStream({
        model,
        contents: options.contents,
        config: {
          systemInstruction: options.systemInstruction,
          temperature: options.temperature ?? 0.7,
        }
      });

      const stream = await Promise.race([
        streamPromise,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Stream connection timeout with model ${model}`)), timeoutMs)
        )
      ]);

      return { stream, model };
    } catch (err: any) {
      console.warn(`[Gemini Stream] Model ${model} failed:`, err?.message || err);
    }
  }
  return null;
}


const BYAHEDOR_SYSTEM_INSTRUCTION = `You are "Byahedor" (meaning traveler/commuter in Filipino), a warm, ultra-knowledgeable, and encouraging Filipino AI Travel Companion & Trip Assistant.

Your Mission:
Help users discover incredible destinations, plan realistic and unforgettable itineraries, optimize travel budgets in Philippine Peso (PHP ₱) or requested currency, provide authentic local foodie tips, packing checklists, and reliable transit advice (jeepneys, tricycles, RORO ferries, habal-habal, UV express, domestic flights, bangka island-hopping).

Personality & Tone:
- Friendly, hospitable (Bayanihan spirit), adventurous, practical, and culturally deep.
- Can seamlessly speak and understand English, Filipino/Tagalog (e.g., "Tara, byahe tayo!", "Ingat sa byahe!"), and Bisaya ("Maayong adlaw!", "Larga na ta!"). Adapt naturally to whatever language or dialect the user uses.
- Always prioritize safety, responsible ecotourism (Leave No Trace), and supporting local community guides and homestays.
- Clearly distinguish rough estimates from verified data and remind users to verify seasonal ferry schedules or weather advisories (especially during typhoon season from July to October).
- When providing itineraries, organize them neatly by Day, Time, Activity, Location, Duration, and Estimated Cost in PHP.`;

// Helper: Destination-specific fallback itinerary generator
function getFallbackDestinationPlan(destination: string, days: number, travelers: number, budget: number, travelStyles?: string[]) {
  const numDays = Math.max(1, Math.min(14, Number(days) || 3));
  const numTravelers = Math.max(1, Number(travelers) || 1);
  const budgetNum = Number(budget) || 12000;
  const dLower = (destination || "").toLowerCase();

  const transpoCost = Math.round(budgetNum * 0.25);
  const stayCost = Math.round(budgetNum * 0.35);
  const foodCost = Math.round(budgetNum * 0.20);
  const actCost = Math.round(budgetNum * 0.15);
  const emergCost = Math.round(budgetNum * 0.05);

  let overview = `An unforgettable ${numDays}-day getaway to ${destination} curated for ${travelStyles?.join(", ") || "adventure, relaxation, and local discoveries"}.`;
  let customDays: any[] = [];
  let tips: string[] = [
    "Always carry Philippine Peso cash (₱) as island ATMs and terminal ticket counters may run out of cash.",
    "Wear reef-safe sunscreen (SPF 50+) and bring a 20L waterproof dry bag for bangka transfers.",
    "Book sea ferries (OceanJet, Montenegro, 2GO) 2–3 days in advance during dry peak season.",
    "Pay the municipal Environmental Tourism Development Fee (ETDF) upon arrival at ports."
  ];

  if (dLower.includes("siargao")) {
    overview = `Surfing capital adventure featuring Cloud 9 breaks, secret coconut rivers, tidal lagoons, and world-class island hopping across Guyam, Daku, and Naked Island.`;
    tips = [
      "Rent a scooter in General Luna (₱350/day) for maximum flexibility to explore North Siargao (Pacifico & Alegria).",
      "Visit Magpupungko Rock Pools strictly at low tide for calm, crystal-clear swimming conditions.",
      "Check out Kermit or Shaka for fresh smoothie bowls, and enjoy a seaside seafood boodle fight on Daku Island."
    ];
  } else if (dLower.includes("palawan") || dLower.includes("el nido") || dLower.includes("coron")) {
    overview = `World-renowned limestone karst paradise featuring turquoise lagoons, pristine coral reefs, WWII shipwrecks in Coron, and sunset sailing in El Nido.`;
    tips = [
      "Bring your own snorkel mask and aqua shoes to protect against sharp sea urchins and rocky coral entries.",
      "Book the Montenegro / Atienza high-speed ferry between El Nido and Coron (takes ~3.5 hours).",
      "Pre-pay the El Nido ETDF fee (₱400 valid for 10 days) before boarding Tour A or Tour C."
    ];
  } else if (dLower.includes("cebu")) {
    overview = `Epic central Visayas journey combining exhilarating Badian Kawasan canyoneering, swimming alongside millions of sardines in Moalboal, and powder-white sands in Bantayan.`;
    tips = [
      "Moalboal sardine run requires no boat; snorkel right off Panagsama Beach reef drop-off 20 meters from shore.",
      "Do Kawasan canyoneering with licensed local guides who provide full safety helmets and life vests.",
      "Do not miss authentic Carcar or Zubuchon spicy roast lechon with hanging rice (Puso)."
    ];
  } else if (dLower.includes("batanes")) {
    overview = `The tranquil Home of the Winds: rolling emerald hills, traditional Ivatan stone houses, Basco lighthouse sunsets, and profound cultural heritage.`;
    tips = [
      "Bring windbreakers and sturdy hiking footwear as coastal gusts in Marlboro Hills can be strong.",
      "Experience the Ivana Honesty Coffee Shop — leave exact payments in the jar with honesty and respect.",
      "Fly into Basco Airport (BSO) on morning flights to avoid afternoon fog or turbulent weather."
    ];
  } else if (dLower.includes("boracay")) {
    overview = `Iconic 4km White Beach getaway with legendary sunsets, paraw sailing, crystal kayak photos, and vibrant beachfront dining in Station 1 and 2.`;
    tips = [
      "Book a DOT-accredited resort prior to arriving at Caticlan Jetty Port as confirmation is required by marshals.",
      "Take an e-trike (₱15–₱50) for comfortable transit between Station 1, D'Mall, and Station 3.",
      "Catch the Paraw sunset sail around 5:00 PM for the most breathtaking golden hour view."
    ];
  } else if (dLower.includes("baguio")) {
    overview = `Cool mountain pines getaway in the Summer Capital featuring strawberry picking, Camp John Hay historical trails, Burnham Park lake boating, and BenCab Museum arts.`;
    tips = [
      "Bring fleece jackets or sweaters; evening temperatures in the mountain city easily drop below 14°C.",
      "Ride JoyBus or Genesis point-to-point luxury sleeper buses from Cubao via TPLEX for the smoothest 4-hour ride.",
      "Wake up early to buy fresh Good Shepherd Ube Jam before afternoon queues form."
    ];
  } else if (dLower.includes("camiguin")) {
    overview = `Volcanic wonder born of fire: gleaming white sandbars at White Island, diving around the Sunken Cemetery, roaring Katibawasan plunge falls, and sweet lanzones.`;
    tips = [
      "Rent a scooter (₱350/day) at Benoni Port or Mambajao to easily circle the scenic 64km island highway.",
      "Catch the first outrigger boat to White Island at 5:30 AM before sunrise as the sandbar has zero natural shade.",
      "Soak in the Ardent Geothermal Hot Springs in the late evening after a full day of trekking."
    ];
  } else if (dLower.includes("mayon") || dLower.includes("bicol") || dLower.includes("albay")) {
    overview = `Adventure in Albay under the shadow of the world's most perfect cone volcano, featuring black lava ATV rides, 1814 Cagsawa ruins, and spicy coconut Bicol Express.`;
    tips = [
      "Schedule your Mayon ATV adventure early (6:00–8:30 AM) when skies are clear before cloud cover blankets the peak.",
      "Fly directly into Bicol International Airport (DRP) in Daraga, just 20 minutes from Legazpi City proper.",
      "Sample Level 1 Sili Ice Cream at 1st Colonial Grill before attempting Level 3 Volcano heat."
    ];
  } else if (dLower.includes("tagaytay")) {
    overview = `Scenic ridge weekend escape overlooking Taal Crater Lake, savoring steaming pots of bone marrow Bulalo at Mahogany Market, and relaxing in boutique organic farm cafes.`;
    tips = [
      "Easily accessible via frequent buses from Metro Manila (PITX Terminal) via CAVITEX in 1.5 to 2 hours.",
      "Head up to the second floor of Mahogany Market for the freshest, most authentic beef Bulalo in town.",
      "Buy warm Buko Pie fresh from the oven at Cecilia’s or original roadside Aguinaldo Highway bakeries."
    ];
  }

  // Generate day plan
  for (let i = 1; i <= numDays; i++) {
    let dayTheme = `Day ${i}: Exploration & Island Highlights`;
    let acts: any[] = [];

    if (i === 1) {
      dayTheme = `Day 1: Arrival, Check-in & Orientation`;
      acts = [
        { time: "08:30 AM", activity: `Arrival at ${destination}, hotel/homestay check-in & welcome breakfast`, location: `${destination} Town Center`, duration: "2 hrs", estimatedCostPHP: 350, icon: "coffee" },
        { time: "11:00 AM", activity: "Scooter rental or meeting local tricycle guide for trip orientation", location: "Local Transport Hub", duration: "1.5 hrs", estimatedCostPHP: 450, icon: "compass" },
        { time: "01:30 PM", activity: "Authentic Filipino lunch (Sinigang / Grilled Inasal / Seafood)", location: "Local Carinderia", duration: "1.5 hrs", estimatedCostPHP: 300, icon: "utensils" },
        { time: "04:30 PM", activity: "Sunset beach walk, photography & tropical fruit shake", location: "Coastline Sunset Point", duration: "2 hrs", estimatedCostPHP: 150, icon: "camera" },
        { time: "07:30 PM", activity: "Welcome dinner with acoustic live music and local delicacies", location: "Beachfront Food Hub", duration: "2 hrs", estimatedCostPHP: 450, icon: "moon" }
      ];
    } else if (i === numDays) {
      dayTheme = `Day ${numDays}: Souvenir Shopping & Scenic Farewell`;
      acts = [
        { time: "08:00 AM", activity: "Farewell breakfast & scenic morning walk", location: "Seaside Café", duration: "1.5 hrs", estimatedCostPHP: 300, icon: "coffee" },
        { time: "10:00 AM", activity: "Pasalubong souvenir shopping (local snacks, dried mangoes, handmade crafts)", location: "Public Market / Souvenir Village", duration: "2 hrs", estimatedCostPHP: 800, icon: "shopping-bag" },
        { time: "01:00 PM", activity: "Check-out, final scenic photo-op, and transit to airport/port", location: "Departure Terminal", duration: "2 hrs", estimatedCostPHP: 350, icon: "compass" }
      ];
    } else {
      dayTheme = `Day ${i}: Signature Island & Nature Excursion`;
      acts = [
        { time: "07:30 AM", activity: "Early energizing breakfast & gear preparation (dry bags & snorkel)", location: "Resort Dining", duration: "1.5 hrs", estimatedCostPHP: 250, icon: "coffee" },
        { time: "09:30 AM", activity: "Island hopping outrigger bangka tour / waterfalls & lagoon trekking", location: `${destination} Famous Attractions`, duration: "4.5 hrs", estimatedCostPHP: 1400, icon: "compass" },
        { time: "02:30 PM", activity: "Seafood boodle fight lunch on a secluded island or beach", location: "Floating Cottage / Island Stop", duration: "1.5 hrs", estimatedCostPHP: 500, icon: "utensils" },
        { time: "05:00 PM", activity: "Return to mainland, relaxation, and fresh coconut water", location: "Main Beach", duration: "1.5 hrs", estimatedCostPHP: 100, icon: "camera" },
        { time: "07:30 PM", activity: "Evening night market exploration & grilled street skewers (Isaw / Inasal)", location: "Night Market", duration: "2.5 hrs", estimatedCostPHP: 350, icon: "moon" }
      ];
    }

    customDays.push({
      dayNumber: i,
      theme: dayTheme,
      activities: acts
    });
  }

  return {
    title: `${numDays}-Day ${destination} Journey`,
    destination,
    days: numDays,
    travelers: numTravelers,
    totalBudget: budgetNum,
    budgetBreakdown: {
      transportation: transpoCost,
      accommodation: stayCost,
      food: foodCost,
      activities: actCost,
      emergency: emergCost,
    },
    overview,
    daysPlan: customDays,
    localTips: tips,
    rawText: ""
  };
}

// Helper: Detect whether text is primarily Bisaya, Filipino/Tagalog, or English
function detectLanguage(text: string): 'Bisaya' | 'Filipino' | 'English' {
  if (!text || !text.trim()) return 'English';
  const lower = text.toLowerCase();
  
  const bisayaKeywords = [
    'maayong', 'adlaw', 'buntag', 'udto', 'hapon', 'gabii',
    'unsa', 'unsay', 'asa', 'ngano', 'kinsa', 'kanus-a', 'pila', 
    'kaon', 'mokaon', 'nindot', 'karon', 'laag', 'suroy', 'kan-anan', 
    'lami', 'palihug', 'balay', 'barko', 'sakay', 'plete', 'habal', 
    'tibuok', 'anhi', 'didto', 'diri', 'kahibalo', 'kamo', 'nimo', 
    'nako', 'nato', 'namo', 'dili', 'kaayo', 'gani', 'pod', 'sab', 
    'gyud', 'jud', 'unta', 'baya'
  ];
  
  const filipinoKeywords = [
    'magandang', 'araw', 'umaga', 'tanghali', 'gabi',
    'ano', 'anong', 'saan', 'bakit', 'sino', 'kailan', 'magkano', 
    'kumain', 'masarap', 'ngayon', 'byahe', 'gala', 'pasyal', 'kainan', 
    'paki', 'bahay', 'bapor', 'pamasahe', 'buong', 'pumunta', 'dito', 
    'doon', 'alam', 'kayo', 'tayo', 'namin', 'hindi', 'maayos', 
    'sobra', 'nga', 'din', 'rin', 'talaga', 'sana', 'kumusta', 'kamusta'
  ];

  let bisScore = 0;
  for (const w of bisayaKeywords) {
    if (new RegExp(`\\b${w}\\b`, 'i').test(lower)) bisScore++;
  }

  let filScore = 0;
  for (const w of filipinoKeywords) {
    if (new RegExp(`\\b${w}\\b`, 'i').test(lower)) filScore++;
  }

  if (bisScore > 0 && bisScore >= filScore) return 'Bisaya';
  if (filScore > 0 && filScore > bisScore) return 'Filipino';
  return 'English';
}

// Helper: Rich local knowledge fallback generator for Philippine travel
function getFallbackChatResponse(latestUserMessage: string, language?: string, clientHour?: number): string {
  const query = (latestUserMessage || "").toLowerCase().trim();
  const targetLanguage = (!language || language === 'Auto') 
    ? detectLanguage(latestUserMessage)
    : language;

  const hour = typeof clientHour === 'number' ? clientHour : new Date().getHours();
  const isMorning = hour >= 5 && hour < 12;
  const isNoon = hour >= 12 && hour < 13;
  const isAfternoon = hour >= 13 && hour < 18;
  const isEvening = hour >= 18 || hour < 5;

  let bisayaGreeting = 'Maayong adlaw';
  if (isMorning) bisayaGreeting = 'Maayong buntag ug maayong adlaw';
  else if (isNoon) bisayaGreeting = 'Maayong udto ug maayong adlaw';
  else if (isAfternoon) bisayaGreeting = 'Maayong hapon ug maayong adlaw';
  else if (isEvening) bisayaGreeting = 'Maayong gabii';

  let filipinoGreeting = 'Magandang araw';
  if (isMorning) filipinoGreeting = 'Magandang umaga';
  else if (isNoon) filipinoGreeting = 'Magandang tanghali';
  else if (isAfternoon) filipinoGreeting = 'Magandang hapon';
  else if (isEvening) filipinoGreeting = 'Magandang gabi';

  let englishGreeting = 'Good day';
  if (isMorning) englishGreeting = 'Good morning';
  else if (isNoon || isAfternoon) englishGreeting = 'Good afternoon';
  else if (isEvening) englishGreeting = 'Good evening';

  // 1. Casual Greetings & Intro
  if (/^(hi|hello|hey|kumusta|musta|hoy|uy|yo|good\s*(morning|day|afternoon|evening)|maayong\s*(adlaw|buntag|udto|hapon|gabii)|magandang\s*(umaga|tanghali|hapon|gabi|araw))[\s!.,?]*$/i.test(query) || query === "hi" || query === "hello") {
    if (targetLanguage === 'Bisaya') {
      return `${bisayaGreeting}! 🌴 Ako si **Byahedor**, imong Bisaya AI travel guide! Asa man imong plano maglaag karon? 

Pwede ko mutabang nimo sa:
- 🏝️ **Mga nindot nga isla** (Siargao, Palawan, Cebu, Bantayan, Siquijor)
- 💰 **Budget ug pletehan** sa barko, eroplano, ug habal-habal
- 🗺️ **Day-by-day Itinerary** ug lami nga kan-anan!

Unsa may naa sa imong huna-huna?`;
    }
    if (targetLanguage === 'Filipino') {
      return `${filipinoGreeting}! Mabuhay! 🌴 Ako si **Byahedor**, ang iyong personal AI Philippine travel concierge!

Saan mo gustong mag-byahe next? Matutulungan kita sa:
- 🏖️ **Itinerary & Day-by-Day Guides** (Siargao, El Nido, Coron, Cebu, Batanes, Bohol)
- 💰 **Budget at Gastos** sa tricycle, bangka, ferry, at homestays
- 🍱 **Saan Masarap Kumain** at mga secret spots na hindi crowded!

I-type mo lang ang pupuntahan mo o itanong kahit ano tungkol sa byahe!`;
    }
    return `Mabuhay & ${englishGreeting}! 🌴 I'm **Byahedor**, your friendly Philippine AI travel concierge!

How can I help you plan your next island adventure?
- 🏖️ **Custom Itineraries:** Siargao, Palawan, Cebu, Bohol, Batanes, Boracay, Sagada, and 7,640+ islands
- 💰 **Budget Optimization:** Real itemized costs in ₱ PHP (tricycle fares, fast craft ferries, joiner tours)
- 🍱 **Culinary Gems:** Authentic local carinderias, seafood boodle fights, and regional dishes
- 🎒 **Packing & Island Safety:** Ferry schedules, marine park fees, and weather hacks

Which island or city is on your bucket list today?`;
  }

  if (query.includes("siargao") || query.includes("surf") || query.includes("cloud 9")) {
    return `### 🌴 Siargao Island Adventure Guide

**Best Time to Visit:** September to November for prime surf swells at Cloud 9, or March to May for glassy waters and calm island hopping.

#### 🏄‍♂️ Must-Do Highlights & Activities:
1. **Cloud 9 Boardwalk & Surfing** — ₱500/hour beginner surf lesson with licensed local instructor.
2. **Sugba Lagoon (Del Carmen)** — ₱1,600 boat rental (shared by up to 6 pax) for paddleboarding & 3m diving board.
3. **Magpupungko Natural Tidal Pools** — ₱50 entrance fee (Visit strictly during low tide!).
4. **Maasin Secret Coconut Palm River** — ₱20 rope swing & canoe ride.
5. **Tri-Island Tour (Guyam, Daku, Naked Island)** — ₱1,500/pax joiner boat with lavish seafood boodle fight lunch on Daku Island.

#### 🛵 Transit & Budget Advice:
- **Motorbike Rental:** ₱350–₱400/day (best way to explore from General Luna to Pacifico).
- **Tricycle Fare:** ₱30–₱50 within General Luna; ₱150–₱300 for long stretches.
- **Daily Budget:** ₱2,500 – ₱4,500/day per person.

*Tip:* ATMs in General Luna often run out of cash during long weekends. Keep at least ₱3,000 emergency cash on hand!

Would you like me to build a custom multi-day itinerary for Siargao?`;
  } else if (query.includes("el nido") || query.includes("coron") || query.includes("palawan")) {
    return `### 🏝️ Palawan (El Nido & Coron) Paradise Guide

**Best Time to Visit:** December to May (Dry summer season with turquoise glass water).

#### 🚤 Signature Island-Hopping Tours:
- **El Nido Tour A:** Big Lagoon (kayaking ₱300), Secret Lagoon, 7 Commandos Beach (~₱1,200/pax).
- **El Nido Tour C:** Hidden Beach, Matinloc Shrine, Helicopter Island (~₱1,400/pax).
- **Coron Ultimate Tour:** Kayangan Lake (cleanest lake in Asia), Twin Lagoon, Barracuda Lake, Skeleton Wreck (~₱1,600/pax).

#### 🚢 Travel Hack: El Nido to Coron
- Take the high-speed ferry (Montenegro Lines or Atienza Shipping) taking ~3.5 to 4 hours (₱2,800–₱3,200/pax).
- Alternatively, take an adventurous 3D2N expedition boat (like Tao or Big Dream Boatman) for uninhabited island camping!

#### 💡 Byahedor Insider Tips:
1. Pay the mandatory **ETDF (Eco-Tourism Development Fee)**: ₱400 valid for 10 days in El Nido; ₱200 in Coron.
2. Bring a 20L waterproof dry bag and reef-safe sunscreen. Single-use plastics are strictly prohibited on all boats!`;
  } else if (query.includes("cebu") || query.includes("kawasan") || query.includes("moalboal") || query.includes("bantayan")) {
    return `### 🌊 Cebu Ultimate Exploration Guide

**Why Visit:** The adventure capital of Central Visayas combining canyoneering thrills, marine wildlife, and white sand islands!

#### 🌟 Top Itinerary Highlights:
1. **Kawasan Falls Canyoneering (Badian):** ₱1,500–₱2,100/pax including life vest, helmet, shoes, recovery meal, and licensed local guide.
2. **Moalboal Sardine Run & Turtle Bay:** Snorkel just 20 meters off Panagsama Beach without needing a boat (₱100 environmental fee).
3. **Bantayan Island & Kota Beach:** Powder-white sandbars and fresh seafood. Take a ferry from Hagnaya Port (₱300 + ₱30 terminal fee).
4. **Cebu City Heritage & Food:** Magellan's Cross, Basilica del Santo Niño, followed by iconic spicy Lechon at Carcar Public Market or House of Lechon!

#### 💰 Daily Estimated Budget:
- **Backpacker:** ₱1,800 – ₱2,500/day
- **Comfort:** ₱3,500 – ₱5,000/day

*Suroy-suroy ta sa Cebu!* Need ferry schedules or a day-by-day route plan?`;
  } else if (query.includes("bohol") || query.includes("panglao") || query.includes("tarsier") || query.includes("chocolate hills")) {
    return `### 🐒 Bohol Eco-Adventure & Beach Guide

**Best Time to Visit:** December to June for sunshine and green-to-brown Chocolate Hills scenery!

#### 🌿 Must-See Highlights:
1. **Chocolate Hills (Carmen):** Over 1,260 geological mounds. Enjoy the panoramic observation deck.
2. **Philippine Tarsier Sanctuary (Corella):** See world's smallest primates in a quiet natural habitat (₱80).
3. **Loboc River Floating Lunch Cruise:** ₱1,000/pax buffet featuring authentic Filipino dishes and live acoustic folk music.
4. **Panglao & Balicasag Island:** Snorkel with sea turtles and dive at the legendary Balicasag marine sanctuary.

#### 🚢 Fast Ferry Hack:
Take the OceanJet high-speed ferry from Cebu Pier 1 to Tagbilaran Port (takes 2 hours, ~₱800/pax).`;
  } else if (query.includes("siquijor") || query.includes("cambugahay") || query.includes("healing")) {
    return `### ✨ Siquijor: The Mystical Island of Fire

**Vibe:** Quiet beaches, turquoise cascades, ancient balete trees, and magical sunsets!

#### 💦 Highlights:
1. **Cambugahay Falls:** 3-tiered turquoise waterfall with famous Tarzan rope swings (₱50 unlimited swings).
2. **Old Enchanted Balete Tree & Fish Spa:** Dip your feet for a natural fish pedicure (₱20).
3. **Salagdoong Beach Cliff Jump:** 7m & 10m platforms into deep turquoise water.
4. **Paliton Beach:** The premier sunset haven with towering coconut palms and bohemian chill bars.

#### 🛵 Getting Around:
Rent a scooter right at Siquijor or Larena Port for ₱350/day. The circular coastal road is 75km of scenic smooth pavement.`;
  } else if (query.includes("batanes") || query.includes("basco") || query.includes("ivatan")) {
    return `### ⛰️ Batanes: The Home of the Winds

**Best Time to Visit:** March to June for calm seas and emerald rolling hills, or November to February for cool, breezy weather.

#### 🛖 Highlights:
- **North Batan:** Basco Lighthouse, Naidi Hills, Vayang Rolling Hills, Mt. Carmel Chapel.
- **South Batan:** Honesty Coffee Shop in Ivana, Marlboro Hills (Rakuh a Payaman), Chawa Viewdeck.
- **Sabtang Island:** Traditional stone houses in Savidug & Chavayan villages, Nakabuang Beach & Arc.

#### 💡 Travel Notes:
- Flights to Basco (BSO) via Philippine Airlines or Cebgo sell out fast; book 3–6 months ahead.
- Bring a windbreaker and sturdy hiking shoes. Support the Ivatan communities with respect and *Dios Mamajes* (Thank you)!`;
  } else if (query.includes("budget") || query.includes("cost") || query.includes("gastos") || query.includes("pera") || query.includes("magkano") || query.includes("tipid")) {
    return `### 💰 Byahedor Practical Budget Optimization Guide

Here is how to travel the Philippines smartly without breaking the bank:

| Expense Category | Typical Tourist Cost | Byahedor Smart Swap | Average Savings |
| :--- | :--- | :--- | :--- |
| **Baggage** | ₱1,200 checked bag | 7kg carry-on backpack | **₱1,200 / flight** |
| **Local Transit** | ₱250 private tricycle | ₱350/day scooter or ₱15 jeepney | **50%–70%** |
| **Island Tours** | ₱6,000 private charter | ₱1,200–₱1,500 joiner tour | **₱4,500 / day** |
| **Dining** | ₱600 resort meals | ₱100 carinderia & ₱350 boodle fight | **65%** |
| **Snorkel Gear** | ₱300 daily rental | Bring personal aqua shoes & mask | **₱900 / trip** |

Tell me which specific province or island you are planning to visit, and I will compute a day-by-day itemized budget in ₱ PHP!`;
  } else if (query.includes("baguio") || query.includes("sagada") || query.includes("cordillera")) {
    return `### 🌲 Baguio & Sagada Highland Escape

**Climate:** Refreshingly cool (15°C–22°C year-round).

#### 🧗 Sagada Must-Visit Attractions:
- **Sumaguing & Lumiang Cave Connection:** Spelunking adventure (₱1,000/group of 4).
- **Kiltepan / Marlboro Hills Sunrise:** Sea of clouds with native Mountain Province brewed coffee.
- **Echo Valley & Hanging Coffins:** Sacred cultural burial heritage site.

#### 🍓 Baguio Highlights:
- Camp John Hay pine trails, Mines View Park, Strawberry Farm picking in La Trinidad, and warm strawberry taho!`;
  } else if (query.includes("boracay")) {
    return `### 🏖️ Boracay Island Travel Guide

**Stations Breakdown:**
- **Station 1:** Widest powdery white beach, upscale resorts, Willy's Rock.
- **Station 2:** Epicenter of nightlife, D'Mall dining, shopping, and water sports.
- **Station 3:** Quiet, backpacker hostels, lush palm trees, and affordable chill bars.

**Activities:** Paraw sunset sailing (₱1,500/boat), helmet diving, and cliff jumping at Ariel's Point!
**Mandatory Requirement:** Pre-book a DOT-accredited hotel before arriving at Caticlan Jetty Port.`;
  } else if (query.includes("food") || query.includes("kain") || query.includes("eat") || query.includes("restaurant") || query.includes("delicacy") || query.includes("ulam")) {
    return `### 🍲 Authentic Philippine Foodie Recommendations

The Philippine culinary landscape is regional and diverse:
1. **Bacolod & Iloilo:** Authentic Chicken Inasal marinated in calamansi and annatto oil, and hot bowls of La Paz Batchoy.
2. **Cebu:** World-famous crunchy Lechon dipped in vinegar with spicy siling labuyo and hanging rice (*puso*).
3. **Pampanga (Culinary Capital):** Sizzling pork sisig, bringhe, and authentic kare-kare.
4. **Bicol:** Fiery Bicol Express and creamy Laing cooked in pure coconut milk and fresh chilies.
5. **Vigan (Ilocos):** Crisp Vigan empanada with longganisa and egg, Bagnet, and Poqui-poqui.

Which region are you visiting so I can pinpoint the best specific local spots?`;
  }

  // Default warm concierge response
  return `Mabuhay! I am **Byahedor**, your friendly Philippine AI travel concierge! 🇵🇭✈️

I can assist you with:
- 🗺️ **Personalized Itineraries** for 82 Philippine provinces
- 💰 **Itemized Budget Calculations** in Philippine Peso (₱)
- 🛵 **Transit Guides** (Jeepney routes, fast craft ferries, RORO, habal-habal, flights)
- 🍱 **Authentic Foodie Guides** & carinderia hidden gems
- 🎒 **Tailored Packing Checklists** and local weather advice

Where are you dreaming of traveling next? (e.g., *Siargao, Palawan, Cebu, Batanes, Bohol, Vigan, Siquijor, Davao, Iloilo*) — *Tara, byahe tayo!* 🌴🌊`;
}

// Helper: Format history into valid Gemini multiturn alternating contents, with optional file attachment
function formatGeminiContents(
  history: any[] | undefined, 
  messages: any[] | undefined, 
  latestMessage: string,
  file?: { mimeType: string; data: string; name?: string }
): any[] {
  const rawTurns: { role: 'user' | 'model'; text: string }[] = [];

  const sourceList = Array.isArray(history) && history.length > 0 
    ? history 
    : (Array.isArray(messages) ? messages : []);

  for (const item of sourceList) {
    const text = (item.text || item.content || '').trim();
    if (!text) continue;
    const role = (item.role === 'model' || item.role === 'assistant' || item.sender === 'ai') ? 'model' : 'user';
    rawTurns.push({ role, text });
  }

  const latestTrimmed = (latestMessage || '').trim();
  if (latestTrimmed) {
    const lastTurn = rawTurns[rawTurns.length - 1];
    if (!lastTurn || lastTurn.role !== 'user' || lastTurn.text !== latestTrimmed) {
      rawTurns.push({ role: 'user', text: latestTrimmed });
    }
  }

  // Remove leading 'model' turns as Gemini API requires the conversation to start with 'user'
  while (rawTurns.length > 0 && rawTurns[0].role === 'model') {
    rawTurns.shift();
  }

  if (rawTurns.length === 0) {
    const fallbackText = latestTrimmed || (file ? 'Please analyze this uploaded Philippine travel file.' : 'Mabuhay Byahedor! What Philippine travel adventures can you recommend?');
    const parts: any[] = [{ text: fallbackText }];
    if (file && file.data && file.mimeType) {
      parts.unshift({
        inlineData: {
          mimeType: file.mimeType,
          data: file.data
        }
      });
    }
    return [{ role: 'user', parts }];
  }

  // Enforce strict alternation between 'user' and 'model'
  const alternating: { role: 'user' | 'model'; parts: any[] }[] = [];
  for (const turn of rawTurns) {
    const last = alternating[alternating.length - 1];
    if (last && last.role === turn.role) {
      last.parts[0].text += `\n\n${turn.text}`;
    } else {
      alternating.push({ role: turn.role, parts: [{ text: turn.text }] });
    }
  }

  // Guarantee the last turn is 'user'
  if (alternating[alternating.length - 1]?.role !== 'user') {
    alternating.push({ role: 'user', parts: [{ text: latestTrimmed || 'Please advise.' }] });
  }

  // If a file is uploaded, attach it as an inlineData part to the final user turn
  if (file && file.data && file.mimeType) {
    const lastUserTurn = alternating[alternating.length - 1];
    if (lastUserTurn && lastUserTurn.role === 'user') {
      lastUserTurn.parts.unshift({
        inlineData: {
          mimeType: file.mimeType,
          data: file.data
        }
      });
    }
  }

  return alternating;
}

// 1. Chat Endpoint (Supports both streaming SSE and standard JSON with file attachments)
app.post("/api/chat", async (req: Request, res: Response) => {
  const { 
    message, 
    messages, 
    history, 
    language, 
    detectedLanguage,
    userPreferences, 
    destinationContext, 
    stream, 
    file,
    clientTime,
    clientHour,
    timeOfDay 
  } = req.body;
  const isStream = stream === true || req.headers.accept?.includes("text/event-stream") || req.query.stream === "true";

  const ai = getAIClient();
  const rawLang = language || userPreferences?.language || "Auto";
  const now = new Date();
  const currentHour = typeof clientHour === 'number' ? clientHour : now.getHours();
  const period = timeOfDay || (currentHour >= 5 && currentHour < 12 ? 'morning' : (currentHour >= 12 && currentHour < 13 ? 'noon' : (currentHour >= 13 && currentHour < 18 ? 'afternoon' : 'evening')));
  const displayTime = clientTime || now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Determine the user's latest query
  let latestUserMessage = "";
  if (typeof message === "string" && message.trim()) {
    latestUserMessage = message.trim();
  } else if (Array.isArray(messages) && messages.length > 0) {
    const last = messages[messages.length - 1];
    latestUserMessage = last.content || last.text || "";
  }

  const promptLanguage = detectedLanguage || detectLanguage(latestUserMessage);
  const effectiveLang = rawLang === "Auto" ? promptLanguage : rawLang;

  let contextPrompt = `${BYAHEDOR_SYSTEM_INSTRUCTION}

### Multilingual Dialect & Language Instructions:
- Language Mode: "${rawLang}". Detected Language of Traveler Query: "${promptLanguage}".
- Target Response Language: "${effectiveLang}".
- CRITICAL MULTILINGUAL RULES:
  * When the traveler writes or asks in **Bisaya / Cebuano** (or uses Bisaya words such as 'unsa', 'asa', 'kaon', 'nindot', 'pila', 'maayong adlaw', 'laag', 'kan-anan', 'suroy', 'palihug', 'lami'):
    -> RESPOND FLUENTLY IN BISAYA. Use natural Bisaya idioms, welcoming warmth, and time greetings (Maayong adlaw / Maayong buntag / Maayong udto / Maayong hapon / Maayong gabii).
  * When the traveler writes or asks in **Filipino / Tagalog** (or Taglish):
    -> RESPOND IN NATURAL CONVERSATIONAL FILIPINO / TAGALOG with appropriate time greetings (Magandang umaga / tanghali / hapon / gabi / Mabuhay!).
  * When the traveler writes or asks in **English**:
    -> RESPOND IN WARM, CLEAR ENGLISH with Filipino hospitality (Mabuhay!).
  * If the user switches language from turn to turn (e.g. from English to Bisaya, or Tagalog to Bisaya), automatically match and mirror their newly chosen language immediately on each turn!

Always maintain warm Filipino hospitality (Mabuhay!), share realistic cost estimates in Philippine Pesos (₱), give safety and transit hacks (bangka, jeepney, tricycle, ferries), and format your response cleanly with clear markdown headings, bullet points, and numbered lists.
If the user uploads an image, photo, ticket, receipt, or travel document, analyze it thoroughly: identify Philippine landmarks, translate menus, extract itinerary or boarding times, check prices in PHP, or verify travel requirements.

### Time-Synchronized Philippine Greetings:
- The traveler's current local time is: ${displayTime} (${period}).
- Whenever greeting or beginning a conversation, synchronize your greeting with their current time of day:
  * In Bisaya: Use 'Maayong adlaw!' or time-specific greetings: 'Maayong buntag' (morning), 'Maayong udto' (noon), 'Maayong hapon' (afternoon), or 'Maayong gabii' (evening). Example: 'Maayong adlaw! 🌴' or 'Maayong buntag!'
  * In Filipino / Tagalog: Use 'Magandang umaga' (morning), 'Magandang tanghali' (noon), 'Magandang hapon' (afternoon), or 'Magandang gabi' (evening), alongside 'Mabuhay!'. Example: 'Magandang araw / Magandang hapon! Mabuhay! 🌴'
  * In English: Use 'Good morning', 'Good afternoon', or 'Good evening' alongside 'Mabuhay!'.`;

  if (!latestUserMessage && file) {
    latestUserMessage = file.mimeType?.startsWith("image/")
      ? "Please analyze this Philippine travel photo, identify the landmark, beach, island, or dish, and give me practical travel advice."
      : "Please review this uploaded Philippine travel document, extract key itinerary/booking details, flight/ferry numbers, costs in PHP, and advise me.";
  }

  // Sanitize and format history into valid Gemini alternating multiturn contents with optional file
  const contents = formatGeminiContents(history, messages, latestUserMessage, file);

  // Handle Server-Sent Events (SSE) Streaming
  if (isStream) {
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    if (typeof (res as any).flushHeaders === "function") {
      (res as any).flushHeaders();
    }

    const sendChunk = (data: { text?: string; done?: boolean }) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
      if (typeof (res as any).flush === "function") {
        (res as any).flush();
      }
    };

    let hasStreamedAnyChunk = false;
    if (ai) {
      try {
        const streamResult = await streamGeminiContentWithFallback(ai, {
          contents,
          systemInstruction: contextPrompt,
          temperature: 0.7,
          timeoutMs: 20000,
        });

        if (streamResult?.stream) {
          for await (const chunk of streamResult.stream) {
            if (chunk.text) {
              hasStreamedAnyChunk = true;
              sendChunk({ text: chunk.text, done: false });
            }
          }
          if (hasStreamedAnyChunk) {
            sendChunk({ done: true });
            return res.end();
          }
        }
      } catch (geminiError) {
        console.warn("Gemini stream error, falling back to rich knowledge engine:", geminiError);
        if (hasStreamedAnyChunk) {
          sendChunk({ done: true });
          return res.end();
        }
      }
    }

    // Stream fallback tokens smoothly if Gemini stream was unavailable
    const fallbackText = getFallbackChatResponse(latestUserMessage, effectiveLang, currentHour);
    const tokens = fallbackText.match(/\S+\s*|\n+/g) || [fallbackText];
    for (const token of tokens) {
      sendChunk({ text: token, done: false });
      // 8ms delay between tokens for instantaneous, real-time typing sensation
      await new Promise(r => setTimeout(r, 8));
    }
    sendChunk({ done: true });
    return res.end();
  }

  // Handle Standard Non-Streaming JSON
  if (ai) {
    try {
      const generated = await generateGeminiContentWithFallback(ai, {
        contents,
        systemInstruction: contextPrompt,
        temperature: 0.75,
        timeoutMs: 25000,
      });

      if (generated && generated.text) {
        return res.json({
          reply: generated.text,
          text: generated.text,
          model: generated.model,
          success: true
        });
      }
    } catch (geminiError) {
      console.warn("Gemini chat error, falling back to rich knowledge engine:", geminiError);
    }
  }

  const fallbackText = getFallbackChatResponse(latestUserMessage, effectiveLang, currentHour);
  return res.json({
    reply: fallbackText,
    text: fallbackText,
    success: true
  });
});

// 2. Structured Trip Planner Endpoint
app.post("/api/plan-trip", async (req: Request, res: Response) => {
  const { destination, origin, departureDate, days, travelers, budget, travelStyles, customNotes } = req.body;
  const numDays = Math.max(1, Math.min(14, Number(days) || 3));
  const numTravelers = Math.max(1, Number(travelers) || 1);
  const budgetNum = Number(budget) || 12000;
  const dest = destination || "Siargao Island";

  const ai = getAIClient();

  if (ai) {
    try {
      const jsonPrompt = `You are Byahedor, an expert Philippine travel architect.
Create a complete day-by-day itinerary JSON for:
Destination: ${dest}
Origin: ${origin || "Manila"}
Departure Date: ${departureDate || "Upcoming"}
Duration: ${numDays} days
Travelers: ${numTravelers}
Budget: ₱${budgetNum} PHP
Travel Styles: ${travelStyles?.join(", ") || "Relaxation, Culture, Island Hopping, Local Food"}
Custom Notes: ${customNotes || "None"}

You MUST return a valid JSON object matching this structure exactly:
{
  "title": "${numDays}-Day ${dest} Journey",
  "destination": "${dest}",
  "days": ${numDays},
  "travelers": ${numTravelers},
  "totalBudget": ${budgetNum},
  "budgetBreakdown": {
    "transportation": ${Math.round(budgetNum * 0.25)},
    "accommodation": ${Math.round(budgetNum * 0.35)},
    "food": ${Math.round(budgetNum * 0.20)},
    "activities": ${Math.round(budgetNum * 0.15)},
    "emergency": ${Math.round(budgetNum * 0.05)}
  },
  "overview": "Rich 2-3 sentence overview describing the atmosphere, best time, and signature highlights.",
  "daysPlan": [
    {
      "dayNumber": 1,
      "theme": "Theme of the day",
      "activities": [
        {
          "time": "08:30 AM",
          "activity": "Detailed activity name with local flavor",
          "location": "Specific place or landmark",
          "duration": "2 hours",
          "estimatedCostPHP": 350,
          "icon": "coffee"
        }
      ]
    }
  ],
  "localTips": [
    "Practical cash/ATM advice",
    "Eco-tourism and reef protection tip",
    "Local transit and fare hack"
  ]
}`;

      const response = await generateGeminiContentWithFallback(ai, {
        contents: jsonPrompt,
        systemInstruction: BYAHEDOR_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.6,
        timeoutMs: 30000,
      });

      if (response && response.text) {
        const parsed = safeParseAiJson(response.text);
        if (parsed) {
          const root = parsed.plan || parsed.itinerary || parsed;
          const rawDays = root.daysPlan || root.itinerary || root.days || root.dailyPlan || root.schedule;
          
          if (Array.isArray(rawDays) && rawDays.length > 0) {
            const normalizedDaysPlan = rawDays.map((d: any, idx: number) => ({
              dayNumber: Number(d.dayNumber || d.day || idx + 1),
              theme: String(d.theme || d.title || `Day ${idx + 1} Adventure`),
              activities: Array.isArray(d.activities) ? d.activities.map((a: any) => ({
                time: String(a.time || "09:00 AM"),
                activity: String(a.activity || a.title || a.name || "Explore local highlights"),
                location: String(a.location || a.place || dest),
                duration: String(a.duration || "2 hours"),
                estimatedCostPHP: Number(a.estimatedCostPHP || a.cost || a.price || 300),
                icon: String(a.icon || "compass")
              })) : []
            }));

            const normalizedBreakdown = root.budgetBreakdown || {
              transportation: Math.round(budgetNum * 0.25),
              accommodation: Math.round(budgetNum * 0.35),
              food: Math.round(budgetNum * 0.20),
              activities: Math.round(budgetNum * 0.15),
              emergency: Math.round(budgetNum * 0.05)
            };

            const normalizedTips = Array.isArray(root.localTips) && root.localTips.length > 0
              ? root.localTips
              : Array.isArray(root.tips) ? root.tips
              : [
                  "Carry sufficient Philippine Peso (₱) cash as local tricycles and island boatmen are cash-only.",
                  "Support local community eco-guides and bring your own reusable tumbler and dry bag.",
                  "Confirm local pumpboat or ferry schedules early in the morning before tides change."
                ];

            return res.json({
              plan: {
                title: root.title || `${numDays}-Day ${dest} Journey`,
                destination: dest,
                days: numDays,
                travelers: numTravelers,
                totalBudget: budgetNum,
                overview: root.overview || `An unforgettable ${numDays}-day journey exploring ${dest}.`,
                budgetBreakdown: normalizedBreakdown,
                daysPlan: normalizedDaysPlan,
                localTips: normalizedTips
              },
              model: response.model,
              success: true
            });
          }
        }
      }
    } catch (genError) {
      console.warn("Trip planner Gemini JSON generation error, using fallback engine:", genError);
    }
  }

  // Fallback intelligent itinerary
  const fallbackPlan = getFallbackDestinationPlan(dest, numDays, numTravelers, budgetNum, travelStyles);
  return res.json({ plan: fallbackPlan, success: true });
});

// 3. Budget Optimizer Endpoint
app.post("/api/budget-optimize", async (req: Request, res: Response) => {
  try {
    const { destination, days, travelers, currentBudget, targetBudget } = req.body;
    const dest = destination || "Siargao Island";
    const numDays = Number(days) || 4;
    const numTravelers = Number(travelers) || 2;
    const curB = Number(currentBudget) || 24000;
    const tgtB = Number(targetBudget) || 18000;

    const ai = getAIClient();

    if (ai) {
      try {
        const prompt = `Analyze this Philippine travel budget:
Destination: ${dest} (${numDays} days, ${numTravelers} traveler(s))
Current benchmark budget: ₱${curB} PHP
Target budget: ₱${tgtB} PHP

Provide 5 practical, actionable money-saving swaps specific to ${dest} and Philippine travel (e.g. transport, homestays vs resorts, carinderias vs tourist spots, joiner tours vs private charters, bringing aqua gear).
Return ONLY a valid JSON array of objects:
[
  {
    "category": "Transportation",
    "original": "Private vans or on-demand tricycles",
    "alternative": "Scooter rental (₱350/day) or shared jeepney routes",
    "savingsPHP": 2500,
    "description": "Short explanation with local practical details."
  }
]`;

        const response = await generateGeminiContentWithFallback(ai, {
          contents: prompt,
          systemInstruction: BYAHEDOR_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          temperature: 0.5,
          timeoutMs: 25000,
        });

        if (response && response.text) {
          const parsed = safeParseAiJson(response.text);
          if (parsed) {
            const rawList = Array.isArray(parsed) 
              ? parsed 
              : (parsed.suggestions || parsed.swaps || parsed.items || parsed.recommendations || []);

            if (Array.isArray(rawList) && rawList.length > 0) {
              const suggestions = rawList.map((item: any) => ({
                category: String(item.category || item.type || "General"),
                original: String(item.original || item.standard || "Standard option"),
                alternative: String(item.alternative || item.swap || item.recommendation || "Smart budget alternative"),
                savingsPHP: Number(item.savingsPHP || item.savings || item.estimatedSavings || 1000),
                description: String(item.description || item.reason || item.tip || "Save money by choosing authentic local options.")
              }));

              const totalPotentialSavings = suggestions.reduce((sum, s) => sum + (Number(s.savingsPHP) || 0), 0);
              return res.json({ suggestions, totalPotentialSavings, model: response.model, success: true });
            }
          }
        }
      } catch (e) {
        console.warn("Budget optimizer JSON parsing error:", e);
      }
    }

    const defaultSuggestions = [
      {
        category: "Transportation",
        original: "Private vans / on-demand tricycles",
        alternative: `Rent a scooter (₱350/day) or take shared jeepneys in ${dest}`,
        savingsPHP: 2500,
        description: "Renting your own motorbike or sharing public jeepney routes cuts transit costs by over 60%."
      },
      {
        category: "Accommodation",
        original: "Beachfront luxury resort",
        alternative: "Cozy DOT-accredited homestay or boutique hostel with shared kitchenette",
        savingsPHP: 3800,
        description: "Homestays provide authentic Filipino hospitality, free water refills, and great local tips."
      },
      {
        category: "Food & Dining",
        original: "Tourist beachfront restaurants every meal",
        alternative: "Local carinderias, boodle fight markets, and night street food stalls",
        savingsPHP: 2000,
        description: "Enjoy authentic Sinigang, Inasal, and fresh grilled seafood at 1/3 the cost of resort menus."
      },
      {
        category: "Activities & Tours",
        original: "Exclusive private chartered outrigger boat",
        alternative: "Municipal-registered shared joiner island hopping tours",
        savingsPHP: 3000,
        description: "Joiner tours cover the exact same pristine lagoons and islands for just ₱1,200-₱1,500/person."
      },
      {
        category: "Gear & Extras",
        original: "Renting snorkel gear & aqua shoes daily at each stop",
        alternative: "Bring your own snorkel mask and aqua shoes in your backpack",
        savingsPHP: 800,
        description: "Avoid recurring ₱200-₱300 rental fees at every island stop."
      }
    ];

    return res.json({ 
      suggestions: defaultSuggestions, 
      totalPotentialSavings: 12100,
      success: true 
    });
  } catch (error: any) {
    console.error("Budget optimize error:", error);
    res.status(500).json({ error: error?.message || "Failed to optimize budget" });
  }
});

// 4. Smart Packing Checklist Endpoint
app.post("/api/smart-checklist", async (req: Request, res: Response) => {
  try {
    const { destination, duration, durationDays, weather, activities } = req.body;
    const ai = getAIClient();
    const dest = destination || "Philippine Island";
    const days = duration || durationDays || 4;

    const formattedCategories = [
      {
        name: 'Travel Documents & Money',
        items: [
          { id: `doc-1`, label: `Valid Government ID / Passport for ${dest}`, category: 'Travel Documents & Money', isChecked: true, isEssential: true },
          { id: `doc-2`, label: 'Flight/Ferry E-Tickets & QR Codes saved offline', category: 'Travel Documents & Money', isChecked: true, isEssential: true },
          { id: `doc-3`, label: `Cash in Philippine Peso (₱) for ${dest} eco-fees, boat transfers & tricycles`, category: 'Travel Documents & Money', isChecked: false, isEssential: true },
          { id: `doc-4`, label: 'Digital Wallets (GCash / Maya) & ATM debit cards', category: 'Travel Documents & Money', isChecked: false, isEssential: true },
          { id: `doc-5`, label: 'Hotel / Homestay Booking Confirmations', category: 'Travel Documents & Money', isChecked: false, isEssential: false }
        ]
      },
      {
        name: 'Island Gear & Ocean Protection',
        items: [
          { id: `gear-1`, label: `15L–20L Waterproof Dry Bag (essential for ${dest} island hopping)`, category: 'Island Gear & Ocean Protection', isChecked: false, isEssential: true },
          { id: `gear-2`, label: 'Reef-safe Sunscreen (Oxybenzone-free SPF 50+)', category: 'Island Gear & Ocean Protection', isChecked: false, isEssential: true },
          { id: `gear-3`, label: 'Waterproof phone pouch with heavy-duty lanyard', category: 'Island Gear & Ocean Protection', isChecked: false, isEssential: true },
          { id: `gear-4`, label: 'Personal snorkel mask and aqua shoes for rocky corals', category: 'Island Gear & Ocean Protection', isChecked: false, isEssential: true },
          { id: `gear-5`, label: 'Quick-dry microfiber beach towel & rashguard', category: 'Island Gear & Ocean Protection', isChecked: false, isEssential: false }
        ]
      },
      {
        name: 'Electronics & Power',
        items: [
          { id: `elec-1`, label: 'Heavy-duty Power Bank (10,000–20,000 mAh)', category: 'Electronics & Power', isChecked: false, isEssential: true },
          { id: `elec-2`, label: 'Universal 220V Type A/B charging cables', category: 'Electronics & Power', isChecked: false, isEssential: true },
          { id: `elec-3`, label: 'Action Camera / Waterproof camera with extra SD cards', category: 'Electronics & Power', isChecked: false, isEssential: false },
        ]
      },
      {
        name: 'Health, Medicine & Hygiene',
        items: [
          { id: `med-1`, label: 'Anti-motion sickness pills (Bonamine/Dimenhydrinate for boat rides)', category: 'Health, Medicine & Hygiene', isChecked: false, isEssential: true },
          { id: `med-2`, label: 'DEET-free citronella mosquito & sandfly repellent', category: 'Health, Medicine & Hygiene', isChecked: false, isEssential: true },
          { id: `med-3`, label: 'Oral rehydration salts (Hydrite / Oralite) & Paracetamol', category: 'Health, Medicine & Hygiene', isChecked: false, isEssential: true },
          { id: `med-4`, label: 'First aid antiseptic wipes, bandages & stomach medicine (Diatabs)', category: 'Health, Medicine & Hygiene', isChecked: false, isEssential: true }
        ]
      }
    ];

    if (ai) {
      try {
        const prompt = `Generate a categorized packing checklist for a ${days}-day trip to ${dest}, Philippines.
Activities: ${activities?.join(", ") || "Beach, island hopping, snorkeling, local food exploring"}.
Weather: ${weather || "Tropical sun and occasional sea spray"}.

Return ONLY a JSON array of category objects:
[
  {
    "name": "Category Name",
    "items": [
      { "id": "unique-id", "label": "Item description tailored to ${dest}", "category": "Category Name", "isChecked": false, "isEssential": true }
    ]
  }
]`;

        const response = await generateGeminiContentWithFallback(ai, {
          contents: prompt,
          systemInstruction: BYAHEDOR_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          temperature: 0.5,
          timeoutMs: 25000,
        });

        if (response && response.text) {
          const parsed = safeParseAiJson(response.text);
          if (parsed) {
            const rawCategories = Array.isArray(parsed) 
              ? parsed 
              : (parsed.categories || parsed.checklist || parsed.items || parsed.sections || []);

            if (Array.isArray(rawCategories) && rawCategories.length > 0) {
              const categories = rawCategories.map((cat: any, cIdx: number) => ({
                name: String(cat.name || cat.category || cat.title || `Category ${cIdx + 1}`),
                items: Array.isArray(cat.items) ? cat.items.map((item: any, iIdx: number) => ({
                  id: String(item.id || `item-${cIdx}-${iIdx}-${Date.now()}`),
                  label: String(item.label || item.item || item.name || "Travel essential"),
                  category: String(cat.name || cat.category || cat.title || "Essentials"),
                  isChecked: Boolean(item.isChecked ?? false),
                  isEssential: Boolean(item.isEssential ?? true)
                })) : []
              })).filter(c => c.items.length > 0);

              if (categories.length > 0) {
                return res.json({
                  categories,
                  checklist: categories,
                  destination: dest,
                  days,
                  model: response.model,
                  success: true
                });
              }
            }
          }
        }
      } catch (e) {
        console.warn("Checklist Gemini generation error:", e);
      }
    }

    res.json({
      categories: formattedCategories,
      checklist: formattedCategories,
      destination: dest,
      days,
      success: true
    });
  } catch (error: any) {
    console.error("Checklist error:", error);
    res.status(500).json({ error: error?.message || "Failed to generate checklist" });
  }
});

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", app: "Byahedor", version: "1.0.0" });
});

// Serve generated assets statically
app.use("/src/assets", express.static(path.join(process.cwd(), "src", "assets")));

// Vite Middleware / Static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Byahedor Server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
