# 🌴 Byahedor - AI Travel Companion & Trip Assistant

**Byahedor** (meaning *traveler* or *commuter* in Filipino) is an intelligent, culturally nuanced travel concierge, interactive archipelago mapping system, and trip planning platform engineered specifically for exploring the 7,641 islands of the Philippine archipelago.

Powered by Google Gemini AI and Google Maps Platform, Byahedor empowers international travelers, domestic wanderers, *barkadas*, solo backpackers, and families to discover hidden destinations, visualize inter-island ferry and sea lanes, create realistic day-by-day itineraries, optimize budgets in Philippine Pesos (PHP ₱), pack smart for tropical climates, and navigate local transit (jeepneys, tricycles, habal-habal, fast crafts, and bangkas).

---

## 📖 Overview

Across the **Philippine archipelago**, travel is an exhilarating, multi-layered journey. Yet navigating inter-island flights, pumpboat sea crossings, RORO ferry schedules, localized jeepney routes, and diverse regional dialects can be daunting.

Standard travel platforms often rely on Western transit assumptions and foreign currency averages, resulting in impractical schedules and inaccurate expense projections. **Byahedor bridges this gap** by serving as an authentic, culturally rooted, and comprehensive travel companion:

- **True Tri-Regional Archipelago Coverage**: Curated journeys, realistic transit routes, and verified high-resolution photography spanning **Luzon**, **Visayas**, **Mindanao**, and **Palawan**—from the windswept cliffs of Batanes and cobblestone ramparts of Intramuros, to the gentle sea turtles of Apo Island, the sugarlandia heritage of Bacolod, the pine highlands of Bukidnon, and the mystical cobalt depths of the Hinatuan Enchanted River.
- **Interactive Google Maps & Illustrated Sea Lanes**: Toggle between interactive Google Maps (Roadmap, Satellite Imagery, and Topographic Terrain with 24+ custom Advanced Markers) and a stylized vector nautical map depicting fast craft ferry routes, RORO corridors, flight paths, and seasonal monsoon patterns (Amihan and Habagat).
- **Regional Culinary Heritage (Local Eats)**: An authentic gastronomic directory featuring 23+ regional specialties—including Iloilo La Paz Batchoy, Bacolod Beef Shank Cansi, Davao Sinuglaw, Maguindanao Pastil, Tausug Tiula Itum, Zamboanga Curacha in Alavar Sauce, Batangas Special Lomi, and Pampanga Tocino—complete with flavor profiles, average price ranges, and historic must-visit eateries.
- **Culturally Rooted & Time-Synchronized Intelligence**: Greets travelers with culturally accurate greetings synchronized to Philippine Standard Time (PST):
  - **Tagalog**: *Magandang umaga*, *Magandang tanghali*, *Magandang hapon*, *Magandang gabi*
  - **Bisaya**: *Maayong buntag*, *Maayong udto*, *Maayong hapon*, *Maayong gabi-i*
  - **English**: *Good morning*, *Good afternoon*, *Good evening*
- **Multilingual Dialect Responsiveness**: Seamlessly responds in English, Tagalog/Filipino, or Bisaya depending on how you converse, explaining regional customs, island slang, and foundational Filipino values (*Bayanihan*, *Pakikisama*, and *Pasalubong*).
- **Multimodal Visual AI**: Upload photos of local carinderia chalkboards, boarding passes, ferry e-tickets, or mystery island landmarks for immediate contextual identification and itinerary integration.
- **Hands-Free Voice Commuting**: Integrated Speech-to-Text with multi-dialect support (English `en-PH`, Filipino `fil-PH`, and Bisaya) designed for hands-free queries while riding a tricycle, habal-habal, or waiting at an island port.
- **Realistic Transit & Cost Modeling**: Accurately factors in pumpboat tides, municipal eco-tourism fees, terminal fees, and habal-habal tariffs, ensuring schedules remain feasible and budgets in Philippine Pesos (PHP ₱) stay on track.
- **Eco-Conscious Tourism**: Champions accredited Department of Tourism (DOT) guides, community boat cooperatives, reef-safe sunscreen, and Leave No Trace (LNT) marine sanctuary preservation.

---

## ✨ Key Features

### 🗺️ Interactive Archipelago Map (`ExploreMapView.tsx`)
- **Dual-Engine Mapping Architecture**:
  - **Google Maps Platform (`@vis.gl/react-google-maps`)**: Full interactive map powered by Google Maps JavaScript API with vector basemaps, tilt, smooth zoom, and responsive gesture handling.
  - **Map Types**: Toggle between **Roadmap** (standard vector streets & topography), **Satellite / Hybrid** (high-resolution aerial imagery), and **Terrain** (elevation contours & mountain ranges).
  - **Illustrated Nautical Vector Map**: Hand-crafted vector sea lane map visualizing fast craft ferry routes (OceanJet, SuperCat), RORO sea lanes, inter-island flight paths, and prevailing monsoon wind systems (**Amihan** Northeast monsoon vs. **Habagat** Southwest monsoon).
- **24+ Advanced Interactive Markers**:
  - Regionally color-coded map pins: Emerald for Luzon, Azure for Visayas, Amber for Mindanao, and Teal for Palawan.
  - Live Philippine Peso (₱) daily budget badges pinned directly above each destination.
- **Rich Interactive InfoWindows**:
  - Click any marker to view high-resolution photography, destination taglines, regional badge, daily budget, and quick actions ("Plan Trip" or "Explore Details").
- **1-Click Regional Camera Controllers**:
  - Smoothly pan and zoom camera to **All Archipelago**, **Luzon**, **Visayas**, **Mindanao**, or **Palawan**.
- **Real-Time Island Search & Regional Filtering**:
  - Filter pins dynamically by search query or regional tabs with active destination counters.
- **Fullscreen Mode**: Expand the map to take over the entire viewport with an interactive collapsible route legend.

### 🤖 Byahedor AI Travel Concierge (`AiChatView.tsx`, `/api/chat`)
- **Real-time Server-Sent Events (SSE) streaming** with multi-turn conversational memory.
- **Time-Synchronized Dynamic Greeting**: Checks real-time client clock to deliver culturally respectful greetings in Tagalog, Bisaya, and English.
- **Multilingual Responsiveness**: Adapts dynamically to English, Tagalog, or Bisaya inquiries.
- **Multimodal File & Image Uploads**: Drag-and-drop or select images of landmarks, carinderia chalkboards, tickets, boarding passes, and receipts for instant AI analysis.
- **Speech-to-Text Voice Recognition**: Hands-free voice input supporting `en-PH`, `fil-PH`, and Bisaya with real-time acoustic waveform visualization.
- **Quick Action Chips & Utilities**: One-click prompt starters, text-to-speech voice narration, copy-to-clipboard, and message regeneration.

### 🧭 Intelligent Trip Planner (`TripPlannerView.tsx`, `/api/plan-trip`)
- **Custom multi-day itinerary generation** tailored by origin, destination, duration, group size, budget tier (Backpacker, Mid-range, Luxury), and travel style (Beach, Adventure, Culture, Foodie, Eco-tourism).
- **Itemized Budget Allocation**: Clear breakdown across Transportation, Accommodation, Food, Activities, and Emergency contingency in PHP (₱).
- **Interactive Day-by-Day Cards**: Organized by Morning, Afternoon, and Evening with duration badges, cost estimates, and packing notes.
- **Saved Trips Manager (`SavedTripsView.tsx`)**: Fresh slate with no unwanted pre-saved trips. Save custom itineraries to browser `localStorage`, with one-click styled PDF export, print, and deletion controls.

### 🍲 Local Eats & Regional Gastronomy Guide (`LocalEatsView.tsx`)
- Comprehensive directory of **23+ iconic Filipino dishes** across Luzon, Visayas, and Mindanao.
- Filter by category: Main Dish, Soup/Stew, Seafood, Breakfast, Street Food, and Dessert.
- Native dialect dish names, flavor profile tags (Sour/Tamarind, Rich/Peanut, Smokey, Sweet/Spicy), historic must-try food stalls/markets, and realistic price estimates in PHP.
- Culturally authentic, high-fidelity dish photography.

### 🏝️ Nationwide Destination Catalog (`DestinationExplorer.tsx`)
- **24+ handpicked Philippine destinations** with GPS coordinates, regional tagging (Luzon, Visayas, Mindanao, Palawan), and verified photography.
- Destinations include: Siargao, El Nido, Coron, Batanes, Boracay, Cebu, Bohol, Sagada, Siquijor, Vigan, Baguio, Camiguin, Bicol (Mayon), Tagaytay, Davao & Samal Island, Surigao del Sur (Hinatuan & Tinuy-an), Bukidnon, Iloilo & Guimaras, Dumaguete & Apo Island, Bacolod, La Union, Intramuros Manila, Caramoan, and more.
- Comprehensive modal views with best seasons to visit, airport access hubs, recommended duration, popular activities with PHP tariffs, and insider tips.

### 💰 Smart Budget Optimizer (`BudgetPlannerView.tsx`, `/api/budget-optimize`)
- Compare your planned budget against realistic local daily benchmarks.
- AI-generated money-saving swaps (e.g., joiner pumpboat tours vs. private charters, homestays vs. luxury beachfront resorts, local carinderias vs. tourist spots).
- Instant calculation of potential total savings in PHP.

### 🎒 Dynamic Travel Packing Checklist (`TravelChecklistView.tsx`, `/api/smart-checklist`)
- Automatically customized packing categories (Clothing & Layering, Beach & Island Gear, Health & Tropical Protection, Tech & Documents).
- Tailored to specific Philippine destinations, expected weather conditions, and selected outdoor activities.
- Interactive checkboxes with real-time percentage progress, filterable tabs (All, Packed, Unpacked, Essentials), and formatted PDF export.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/), [Vite 6](https://vitejs.dev/), [TypeScript 5.8](https://www.typescriptlang.org/) |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/), [Motion](https://motion.dev/) |
| **Interactive Maps** | [@vis.gl/react-google-maps](https://visgl.github.io/react-google-maps/), Google Maps JavaScript API (Advanced Markers, InfoWindows, Roadmap/Satellite/Terrain) |
| **PDF Generation** | [jsPDF](https://github.com/parallax/jsPDF), [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable) |
| **AI Integration** | [@google/genai](https://www.npmjs.com/package/@google/genai) SDK (`gemini-flash-lite-latest`, `gemini-2.5-flash`, `gemini-2.0-flash`) |
| **Backend & Server** | [Express 4](https://expressjs.com/) on Node.js, [tsx](https://github.com/privatenumber/tsx), [esbuild](https://esbuild.github.io/) |
| **Content & Effects** | [react-markdown](https://github.com/remarkjs/react-markdown), [remark-gfm](https://github.com/remarkjs/remark-gfm), [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) |
| **Data & Persistence** | Browser `localStorage` + optional Firebase Firestore & Auth |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or higher (v20+ recommended)
- **npm**: v9 or higher
- **Gemini API Key**: Obtain a key from [Google AI Studio](https://aistudio.google.com/)
- **Google Maps API Key (Optional)**: Obtain a key with Maps JavaScript API enabled from [Google Cloud Console](https://console.cloud.google.com/google/maps-apis) (demo fallback provided).

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd byahedor
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory (refer to `.env.example`):

```env
# Google Gemini API Key (Required for AI Concierge, Planner, Budget & Checklist)
GEMINI_API_KEY=your_gemini_api_key_here

# Google Maps Platform API Key (Optional client-side key for interactive maps)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Dev Server Port (defaults to 3000)
PORT=3000

# Base App URL (injected automatically in deployment)
APP_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be live at `http://localhost:3000`.

### 4. Build for Full-Stack Production (Node.js + Express)

```bash
npm run build
```

This compiles the Vite frontend into `dist/` and bundles `server.ts` into `dist/server.cjs`.

To run the production server:

```bash
npm start
```

---

## 🚀 Deploying to GitHub Pages (Static Hosting)

### Why did a blank white page happen on GitHub Pages?
1. **Asset Base Path**: By default, Vite outputs asset URLs starting with `/assets/...`. Because GitHub Pages serves repositories from a subpath (e.g., `https://<username>.github.io/<repo-name>/`), the browser requested `https://<username>.github.io/assets/...` instead of `https://<username>.github.io/<repo-name>/assets/...`, returning 404 and failing to load JavaScript and CSS.
   - **Fix**: `vite.config.ts` is now configured with `base: './'` so all script and stylesheet references are relative.
2. **Jekyll Processing**: GitHub Pages runs Jekyll by default which ignores folders starting with special characters.
   - **Fix**: A `public/.nojekyll` file has been added to tell GitHub Pages to bypass Jekyll.
3. **SPA 404 Routing**: A `public/404.html` redirect page ensures direct links and page refreshes work properly on GitHub Pages.
4. **Backend `/api/*` on Static Hosts**: GitHub Pages does not run Node.js/Express. Byahedor includes built-in offline smart planners and fallbacks for itinerary planning, packing lists, and budget optimization when the backend is offline.
5. **Runtime ErrorBoundary**: An interactive `ErrorBoundary` component wraps the app to catch any unexpected client errors with a friendly recovery screen instead of a blank page.

### Method A: Automated GitHub Actions Deployment (Recommended)
An automated workflow is already configured at `.github/workflows/deploy.yml`:
1. Push your code to your GitHub repository on `main` or `master`.
2. In your GitHub repository:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, choose **GitHub Actions**.
3. Push any commit or click **Run workflow** under the **Actions** tab. Your site will automatically build and publish to `https://<username>.github.io/<repo-name>/`.

### Method B: Manual Deployment via `gh-pages`
```bash
# 1. Build the static site
npm run build:pages

# 2. Deploy dist/ to the gh-pages branch
npx gh-pages -d dist
```

---

## 📂 Project Structure

```
├── src/
│   ├── components/
│   │   ├── AiChatView.tsx          # AI Concierge with SSE streaming, voice input, image upload & time-synchronized greetings
│   │   ├── ExploreMapView.tsx      # Dual-engine archipelago map (Google Maps Platform + Vector Sea Lanes)
│   │   ├── TripPlannerView.tsx     # Multi-day itinerary builder with budget allocation & day cards
│   │   ├── SavedTripsView.tsx      # Saved itineraries manager (localStorage, print, export, delete)
│   │   ├── LocalEatsView.tsx       # Regional gastronomy directory with 23+ authentic dishes
│   │   ├── DestinationExplorer.tsx # 24+ Philippine destinations catalog with rich modal views
│   │   ├── BudgetPlannerView.tsx   # Budget benchmarking & AI money-saving swaps in PHP (₱)
│   │   ├── TravelChecklistView.tsx # Dynamic packing checklist with category filters & progress bar
│   │   ├── HomeDashboard.tsx       # Welcome dashboard with stats, quick actions & featured spots
│   │   ├── SettingsView.tsx        # Preferences, language/dialect settings & currency display
│   │   ├── AuthModal.tsx           # Authentication modal (Firebase / Local profile)
│   │   ├── LoginScreen.tsx         # User login screen & guest profile handler
│   │   ├── ByahedorLogo.tsx        # Branded vector SVG logo component
│   │   ├── LoadingScreen.tsx       # Tropical animated loader
│   │   ├── Sidebar.tsx             # Desktop navigation sidebar
│   │   └── MobileNav.tsx           # Mobile bottom navigation bar
│   ├── data/
│   │   ├── destinations.ts         # Curated Philippine destinations, coordinates, photos & tariffs
│   │   └── localEats.ts            # Regional culinary specialties, flavor profiles & heritage stalls
│   ├── firebase/
│   │   └── config.ts               # Firebase Firestore & Auth integration
│   ├── types.ts                    # TypeScript interfaces for trips, destinations, food & chat
│   ├── App.tsx                     # Main layout, view routing & global state
│   ├── main.tsx                    # React DOM entry point
│   └── index.css                   # Global styling and Tailwind CSS v4 directives
├── server.ts                       # Express backend proxy with Gemini AI & fallback endpoints
├── vite.config.ts                  # Vite build configuration with Tailwind CSS v4 plugin
├── package.json                    # Project dependencies and npm scripts
├── tsconfig.json                   # TypeScript compiler configuration
├── metadata.json                   # AI Studio app capabilities and permissions
└── .env.example                    # Environment variable template
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check returning service status, app name, and version |
| `GET` | `/api/destinations` | Returns curated list of 24+ Philippine destinations with coordinates and pricing |
| `POST` | `/api/chat` | AI concierge chat (supports SSE streaming with `Accept: text/event-stream` or standard JSON) |
| `POST` | `/api/plan-trip` | Generates a structured multi-day itinerary with categorized budget allocation |
| `POST` | `/api/budget-optimize` | Returns money-saving alternatives and total estimated savings in PHP |
| `POST` | `/api/smart-checklist` | Generates customized packing checklist categories tailored to destination and activities |

---

## 🛡️ Responsible Ecotourism & Travel Guidelines

Byahedor actively promotes sustainable tourism and **Leave No Trace (LNT)** principles:
- **Marine Sanctuary Protection**: Recommending mineral-based, reef-safe sunscreens (oxybenzone-free) to protect fragile coral reefs in Palawan, Apo Island, and Bohol.
- **Municipal Conservation Fees**: Promoting full compliance with local Environmental User Fees (EUF), port terminal fees, and protected area permits that fund municipal conservation.
- **Local Economy Support**: Prioritizing accredited DOT tour guides, registered tricycle and habal-habal associations, local homestays, and community-run boat cooperatives.
- **Cash & Connectivity Advisory**: Reminding travelers to carry physical Philippine Peso (PHP) cash when island-hopping, as rural island ATMs and card terminals are frequently offline.

---

## 🗺️ Google Maps Platform Notice

The interactive archipelago map uses Google Maps Platform APIs via `@vis.gl/react-google-maps`.
- **APIs Used**: Maps JavaScript API, AdvancedMarkerElement, and InfoWindow.
- For custom production deployments, configure your own restricted API key via `VITE_GOOGLE_MAPS_API_KEY` with the Maps JavaScript API enabled in Google Cloud Console.

---

## 📄 License

This project is licensed under the MIT License.
