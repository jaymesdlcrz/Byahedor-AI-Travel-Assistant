# 🌴 Byahedor - AI Travel Companion & Trip Assistant

**Byahedor** (meaning *traveler* or *commuter* in Filipino) is an intelligent, culturally nuanced travel concierge and trip planning platform built specifically for exploring the Philippine archipelago. Powered by Google Gemini AI, Byahedor helps wanderers discover hidden gem destinations, create realistic day-by-day itineraries, optimize budgets in Philippine Pesos (PHP ₱), pack smart, and navigate local transit (jeepneys, tricycles, habal-habal, fast crafts, and bangkas).

---

## 📖 Description

Across the **7,641 islands of the Philippines**, travel is an exhilarating, multi-layered journey—yet navigating inter-island flights, pumpboat sea crossings, RORO ferry schedules, localized jeepney routes, and diverse regional dialects can be daunting for international travelers and local adventurers (*barkadas*, solo backpackers, and families) alike.

Traditional travel platforms often rely on generic Western assumptions, standardized mass transit, and foreign currency averages, resulting in impractical itineraries or inaccurate expense projections. **Byahedor bridges this gap** by serving as an authentic, culturally rooted, and comprehensive AI travel companion:

- **True Tri-Regional Archipelago Coverage**: Curated journeys, realistic transit routes, and verified high-resolution photography spanning **Luzon**, **Visayas**, and **Mindanao**—from the windswept cliffs of Batanes and cobblestone ramparts of Intramuros, to the gentle sea turtles of Apo Island, the sugarlandia heritage of Bacolod, the pine highlands of Bukidnon, and the mystical cobalt depths of the Hinatuan Enchanted River.
- **Regional Culinary Heritage (Local Eats)**: An authentic gastronomic directory featuring 23 regional specialties—including Iloilo La Paz Batchoy, Bacolod Beef Shank Cansi, Davao Sinuglaw, Maguindanao Pastil, Tausug Tiula Itum, Zamboanga Curacha in Alavar Sauce, Batangas Special Lomi, and Pampanga Tocino—complete with flavor profiles, average price ranges, and historic must-visit eateries.
- **Culturally Rooted Intelligence**: Speaks fluent English, Tagalog/Filipino, and Bisaya, understanding regional nuances, island idioms, and foundational Filipino values (*Bayanihan*, *Pakikisama*, and *Pasalubong*).
- **Multimodal Visual AI**: Travelers can upload photos of local carinderia chalkboards, boarding passes, ferry e-tickets, or mystery island landmarks for immediate contextual identification and itinerary integration.
- **Hands-Free Voice Commuting**: Integrated Speech-to-Text with multi-dialect support (English `en-PH`, Filipino `fil-PH`, and Bisaya) designed for real-time questions while riding a tricycle, habal-habal, or waiting at an island port.
- **Realistic Philippine Transit & Cost Modeling**: Accurately factors in pumpboat low/high tides, municipal eco-tourism fees, terminal fees, and habal-habal tariffs, ensuring schedules remain feasible and budgets in Philippine Pesos (PHP ₱) stay on track.
- **Eco-Conscious Tourism**: Champions accredited DOT tour guides, community boat cooperatives, and Leave No Trace (LNT) marine sanctuary preservation.

---

## ✨ Key Features

- **🤖 AI Travel Concierge (`/api/chat`)**:
  - Real-time Server-Sent Events (SSE) streaming with multi-turn conversational memory.
  - **📎 Multimodal File & Image Uploads**: Upload landmark photos for instant identification, carinderia menus for dialect translation, flight/ferry e-tickets for itinerary scheduling, and expense receipts. Drag-and-drop or file picker with live thumbnail previews.
  - **🎙️ Speech-to-Text Voice Recognition**: Hands-free voice input with live acoustic transcription supporting English (`en-PH`), Filipino (`fil-PH`), and Bisaya with real-time waveform indicator.
  - Multi-dialect fluency: seamlessly converses in **English**, **Filipino / Tagalog** ("*Tara, byahe tayo!*"), and **Bisaya** ("*Maayong adlaw!*").
  - Practical local advice: pumpboat schedules, environmental fees, cash/ATM cautions, and street-food recommendations.
  - Quick action chips, speech synthesis (listen to advice), copy-to-clipboard, and regenerate options.

- **🗺️ Intelligent Trip Planner (`/api/plan-trip`)**:
  - Custom multi-day itinerary generation based on destination, origin, group size, budget, and travel style (Beach, Adventure, Culture, Foodie, Eco-tourism).
  - Categorized budget breakdown across Transportation, Accommodation, Food, Activities, and Emergency funds.
  - Interactive day-by-day schedule with estimated durations and PHP costs per activity.
  - One-click saving to local storage and celebratory confetti feedback.

- **🍲 Local Eats & Regional Gastronomy Crawl**:
  - Comprehensive guide to 23 iconic Filipino dishes across Luzon, Visayas, and Mindanao.
  - Filter by category: Main Dish, Soup/Stew, Seafood, Breakfast, Dessert, and Street Food.
  - Native dialect dish names, flavor profile tags, historic must-try food stalls/markets, and realistic price estimates in PHP.
  - High-fidelity, culturally authentic food photography.

- **🏝️ Nationwide Destination Explorer**:
  - 23 handpicked Philippine destinations with GPS coordinates, regional tagging (Luzon, Visayas, Mindanao), and verified photography.
  - Covers iconic and off-the-beaten-path destinations: Palawan (El Nido & Coron), Siargao, Batanes, Boracay, Cebu, Bohol, Sagada, Siquijor, Vigan, Baguio, Camiguin, Bicol, Tagaytay, Davao & Samal Island, Surigao del Sur (Hinatuan & Tinuy-an), Bukidnon, Iloilo & Guimaras, Dumaguete & Apo Island, Bacolod, La Union, Intramuros Manila, and Caramoan.
  - Highlights best seasons to visit, daily budget benchmarks, airport access points, and insider local tips.

- **💰 Smart Budget Optimizer (`/api/budget-optimize`)**:
  - Compare your planned budget against realistic local daily benchmarks.
  - AI-generated money-saving swaps (e.g., joiner tours vs. private charters, homestays vs. luxury resorts, local carinderias vs. tourist spots).
  - Instant calculation of potential total savings in PHP.

- **🎒 Smart Packing Checklist (`/api/smart-checklist`)**:
  - Automatically customized packing categories (Clothing & Layering, Beach & Island Gear, Health & Tropical Protection, Tech & Documents).
  - Tailored to specific Philippine destinations, expected weather conditions, and selected outdoor activities.
  - Interactive checkboxes with real-time percentage progress, filterable tabs (All, Packed, Unpacked, Essentials), and plain-text export.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons & Animation**: [Lucide React](https://lucide.dev/), [Motion](https://motion.dev/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Content Rendering**: [react-markdown](https://github.com/remarkjs/react-markdown) with [remark-gfm](https://github.com/remarkjs/remark-gfm)
- **Backend**: [Express](https://expressjs.com/) on Node.js / [tsx](https://github.com/privatenumber/tsx)
- **AI Integration**: [@google/genai](https://www.npmjs.com/package/@google/genai) SDK with multi-model fallback (`gemini-flash-lite-latest`, `gemini-3-flash-preview`, `gemini-3.8-flash`, `gemini-3.1-flash-lite`)
- **Database / Auth**: Firebase Firestore & Firebase Auth ready

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or higher (v20+ recommended)
- **npm**: v9 or higher
- **Gemini API Key**: Obtain a key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd byahedor
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Dev Server Port (optional, defaults to 3000)
PORT=3000
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be live at `http://localhost:3000`.

### 4. Build for Production

```bash
npm run build
```

This compiles the Vite frontend into `dist/` and bundles `server.ts` into `dist/server.cjs`.

To run the production server:

```bash
npm start
```

---

## 📂 Project Structure

```
├── src/
│   ├── components/
│   │   ├── AiChatView.tsx          # Real-time AI chat with SSE streaming & dialect toggle
│   │   ├── TripPlannerView.tsx     # Itinerary builder with budget breakdown & day cards
│   │   ├── BudgetPlannerView.tsx   # Budget benchmarking & AI money-saving swaps
│   │   ├── TravelChecklistView.tsx # Dynamic packing checklist with category filters
│   │   └── DestinationModal.tsx    # Destination guide detail modal
│   ├── data/
│   │   └── destinations.ts         # Curated Philippine destinations and travel data
│   ├── firebase/
│   │   └── config.ts               # Optional Firebase Firestore integration
│   ├── types.ts                    # TypeScript definitions for trips, checklists, chat
│   ├── App.tsx                     # Main navigation and view router
│   ├── main.tsx                    # React DOM entry point
│   └── index.css                   # Global styles and Tailwind CSS v4 import
├── server.ts                       # Express backend proxy with Gemini AI & fallback engines
├── vite.config.ts                  # Vite build configuration
├── package.json                    # Project dependencies and npm scripts
├── tsconfig.json                   # TypeScript configuration
└── metadata.json                   # App capabilities and permissions
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Healthcheck returning service status |
| `GET` | `/api/destinations` | Curated list of Philippine destinations |
| `POST` | `/api/chat` | AI concierge chat (supports SSE streaming with `Accept: text/event-stream` or standard JSON) |
| `POST` | `/api/plan-trip` | Generates a structured multi-day itinerary with budget allocation |
| `POST` | `/api/budget-optimize` | Returns money-saving alternatives and total estimated savings in PHP |
| `POST` | `/api/smart-checklist` | Generates customized packing checklist categories tailored to trip details |

---

## 🛡️ Responsible Ecotourism

Byahedor actively promotes **Leave No Trace (LNT)** principles:
- Recommending reef-safe sunscreens to protect coral reefs in Palawan and Bohol.
- Emphasizing compliance with municipal eco-tourism fees and guidelines.
- Encouraging support for local homestays, community boatmen cooperatives, and accredited DOT tour guides.

---

## 📄 License

This project is licensed under the MIT License.
