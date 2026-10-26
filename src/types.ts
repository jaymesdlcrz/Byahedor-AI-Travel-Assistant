export type NavView = 
  | 'home'
  | 'planner'
  | 'destinations'
  | 'explore'
  | 'budget'
  | 'food'
  | 'checklist'
  | 'chat'
  | 'saved'
  | 'settings';

export interface Destination {
  id: string;
  name: string;
  location: string;
  region: 'Luzon' | 'Visayas' | 'Mindanao' | 'International';
  tagline: string;
  description: string;
  heroImage: string;
  galleryImages: string[];
  estimatedDailyBudgetPHP: number;
  bestTimeToVisit: string;
  idealDurationDays: number;
  tags: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  popularActivities: {
    title: string;
    description: string;
    costPHP: number;
    duration: string;
  }[];
  localSpecialties: string[];
  travelTips: string[];
  rating: number;
  reviewCount: number;
}

export interface ActivityItem {
  time: string;
  activity: string;
  location: string;
  duration: string;
  estimatedCostPHP: number;
  icon?: string;
  notes?: string;
}

export interface DayPlan {
  dayNumber: number;
  theme: string;
  activities: ActivityItem[];
}

export interface BudgetBreakdown {
  transportation: number;
  accommodation: number;
  food: number;
  activities: number;
  emergency: number;
}

export interface TripPlan {
  id: string;
  title: string;
  destination: string;
  origin?: string;
  departureDate?: string;
  days: number;
  travelers: number;
  totalBudget: number;
  budgetBreakdown: BudgetBreakdown;
  overview: string;
  daysPlan: DayPlan[];
  localTips: string[];
  rawText?: string;
  savedAt?: string;
  coverImage?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  category: string;
  isChecked: boolean;
  isEssential: boolean;
}

export interface ChecklistCategory {
  name: string;
  items: ChecklistItem[];
}

export interface LocalDish {
  id: string;
  name: string;
  nativeName?: string;
  region: string;
  image: string;
  category: 'Main Dish' | 'Soup/Stew' | 'Seafood' | 'Dessert' | 'Street Food' | 'Breakfast';
  description: string;
  flavorProfile: string[];
  mustTrySpot: string;
  averagePricePHP: string;
  dietaryNotes?: string;
}

export interface ChatAttachment {
  name: string;
  type: string;
  size: number;
  previewUrl?: string;
  base64?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
  tripData?: TripPlan;
  quickReplies?: string[];
  attachment?: ChatAttachment;
}

export interface UserPreferences {
  preferredLanguage: 'English' | 'Filipino' | 'Bisaya' | 'Taglish';
  defaultOriginAirport: string;
  currency: 'PHP' | 'USD' | 'EUR' | 'JPY';
  travelPace?: 'relaxed' | 'balanced' | 'fast-paced';
  themeMode?: 'light' | 'dark' | 'system';
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified?: boolean;
  isAnonymous?: boolean;
  providerId?: string;
}
