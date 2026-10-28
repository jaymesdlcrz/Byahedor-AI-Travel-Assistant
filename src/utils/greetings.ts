/**
 * Time-synchronized Philippine multilingual utility.
 * Synchronizes greetings with the current time of day across
 * English, Filipino (Tagalog), and Bisaya (Cebuano), with auto-detection.
 */

export type TimeOfDay = 'morning' | 'noon' | 'afternoon' | 'evening';
export type SupportedLanguage = 'Auto' | 'English' | 'Filipino' | 'Bisaya';

export function getTimeOfDay(date: Date = new Date()): TimeOfDay {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'morning';      // 5:00 AM - 11:59 AM
  if (hour >= 12 && hour < 13) return 'noon';        // 12:00 PM - 12:59 PM (udto / tanghali)
  if (hour >= 13 && hour < 18) return 'afternoon';   // 1:00 PM - 5:59 PM
  return 'evening';                                  // 6:00 PM - 4:59 AM
}

/**
 * Detects whether input text is primarily Bisaya, Filipino/Tagalog, or English.
 */
export function detectLanguageFromText(text: string): 'Bisaya' | 'Filipino' | 'English' {
  if (!text || !text.trim()) return 'English';
  const lower = text.toLowerCase();
  
  // Bisaya vocabulary indicators
  const bisayaKeywords = [
    'maayong', 'adlaw', 'buntag', 'udto', 'hapon', 'gabii',
    'unsa', 'unsay', 'asa', 'ngano', 'kinsa', 'kanus-a', 'pila', 
    'kaon', 'mokaon', 'nindot', 'karon', 'laag', 'suroy', 'kan-anan', 
    'lami', 'palihug', 'balay', 'barko', 'sakay', 'plete', 'habal', 
    'tibuok', 'anhi', 'didto', 'diri', 'kahibalo', 'kamo', 'nimo', 
    'nako', 'nato', 'namo', 'dili', 'kaayo', 'gani', 'pod', 'sab', 
    'gyud', 'jud', 'unta', 'baya', 'suway', 'lingaw'
  ];
  
  // Filipino / Tagalog vocabulary indicators
  const filipinoKeywords = [
    'magandang', 'araw', 'umaga', 'tanghali', 'gabi',
    'ano', 'anong', 'saan', 'bakit', 'sino', 'kailan', 'magkano', 
    'kumain', 'masarap', 'ngayon', 'byahe', 'gala', 'pasyal', 'kainan', 
    'paki', 'bahay', 'bapor', 'pamasahe', 'buong', 'pumunta', 'dito', 
    'doon', 'alam', 'kayo', 'tayo', 'namin', 'hindi', 'maayos', 
    'sobra', 'nga', 'din', 'rin', 'talaga', 'sana', 'kumusta', 'kamusta', 'sulit'
  ];

  let bisayaScore = 0;
  for (const word of bisayaKeywords) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lower.match(regex);
    if (matches) bisayaScore += matches.length;
  }

  let filipinoScore = 0;
  for (const word of filipinoKeywords) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lower.match(regex);
    if (matches) filipinoScore += matches.length;
  }

  if (bisayaScore > 0 && bisayaScore >= filipinoScore) {
    return 'Bisaya';
  }
  if (filipinoScore > 0 && filipinoScore > bisayaScore) {
    return 'Filipino';
  }
  return 'English';
}

export function getTimeGreeting(
  language: SupportedLanguage = 'Auto',
  date: Date = new Date()
): string {
  const time = getTimeOfDay(date);
  const effectiveLang = language === 'Auto' ? 'English' : language;

  switch (effectiveLang) {
    case 'Bisaya': {
      if (time === 'morning') return 'Maayong buntag';
      if (time === 'noon') return 'Maayong udto';
      if (time === 'afternoon') return 'Maayong hapon';
      return 'Maayong gabii';
    }
    case 'Filipino': {
      if (time === 'morning') return 'Magandang umaga';
      if (time === 'noon') return 'Magandang tanghali';
      if (time === 'afternoon') return 'Magandang hapon';
      return 'Magandang gabi';
    }
    case 'English':
    default: {
      if (time === 'morning') return 'Good morning';
      if (time === 'noon' || time === 'afternoon') return 'Good afternoon';
      return 'Good evening';
    }
  }
}

/**
 * Returns a general or specific daytime greeting for Bisaya, e.g. "Maayong adlaw" or "Maayong buntag/hapon"
 */
export function getBisayaGreeting(time: TimeOfDay): string {
  switch (time) {
    case 'morning':
      return 'Maayong buntag ug maayong adlaw';
    case 'noon':
      return 'Maayong udto ug maayong adlaw';
    case 'afternoon':
      return 'Maayong hapon ug maayong adlaw';
    case 'evening':
      return 'Maayong gabii';
  }
}

/**
 * Returns a fully formatted, warm welcome greeting synchronized with current local time.
 */
export function formatPersonalizedGreeting(
  language: SupportedLanguage,
  userName?: string | null,
  date: Date = new Date()
): string {
  const time = getTimeOfDay(date);
  const name = userName ? userName.trim().split(' ')[0] : '';
  const nameBold = name ? `, **${name}**` : '';

  if (language === 'Bisaya') {
    const timeGreeting = getBisayaGreeting(time);
    return `${timeGreeting}${nameBold}! 🌴`;
  }

  if (language === 'Filipino') {
    const timeGreeting = getTimeGreeting('Filipino', date);
    return `${timeGreeting}${nameBold}! Mabuhay! 🌴`;
  }

  if (language === 'Auto') {
    const timeGreetingEn = getTimeGreeting('English', date);
    const timeGreetingBis = getTimeGreeting('Bisaya', date);
    const timeGreetingFil = getTimeGreeting('Filipino', date);
    // Multilingual welcoming greeting synchronized with time of day
    return `Mabuhay & ${timeGreetingEn.toLowerCase()}${nameBold}! 🌴 (${timeGreetingBis} • ${timeGreetingFil})`;
  }

  const timeGreeting = getTimeGreeting('English', date);
  return `Mabuhay & ${timeGreeting.toLowerCase()}${nameBold}! 🌴`;
}

/**
 * Returns a time-synchronized subtitle description for the Byahedor AI Concierge.
 * Dynamically reflects the current time of day across Bisaya, Filipino, and English.
 */
export function getConciergeHeaderDescription(
  language: SupportedLanguage = 'Auto',
  date: Date = new Date()
): string {
  const time = getTimeOfDay(date);

  switch (language) {
    case 'Bisaya': {
      if (time === 'morning') {
        return '☀️ Maayong buntag ug maayong adlaw • Island guide & voice concierge';
      }
      if (time === 'noon') {
        return '☀️ Maayong udto ug maayong adlaw • Island guide & voice concierge';
      }
      if (time === 'afternoon') {
        return '🌴 Maayong hapon ug maayong adlaw • Island guide & voice concierge';
      }
      return '🌙 Maayong gabii • Island guide, vision & voice concierge';
    }
    case 'Filipino': {
      if (time === 'morning') {
        return '☀️ Magandang umaga • Island guide, vision & voice concierge';
      }
      if (time === 'noon') {
        return '☀️ Magandang tanghali • Island guide, vision & voice concierge';
      }
      if (time === 'afternoon') {
        return '🌴 Magandang hapon • Island guide, vision & voice concierge';
      }
      return '🌙 Magandang gabi • Island guide, vision & voice concierge';
    }
    case 'English': {
      if (time === 'morning') {
        return '☀️ Good morning • Island guide, vision & voice concierge';
      }
      if (time === 'noon' || time === 'afternoon') {
        return '🌴 Good afternoon • Island guide, vision & voice concierge';
      }
      return '🌙 Good evening • Island guide, vision & voice concierge';
    }
    case 'Auto':
    default: {
      if (time === 'morning') {
        return '☀️ Maayong buntag • Magandang umaga • Good morning concierge';
      }
      if (time === 'noon') {
        return '☀️ Maayong udto • Magandang tanghali • Good day concierge';
      }
      if (time === 'afternoon') {
        return '🌴 Maayong adlaw • Magandang hapon • Good afternoon concierge';
      }
      return '🌙 Maayong gabii • Magandang gabi • Good evening concierge';
    }
  }
}

/**
 * Multi-lingual time badge for dashboard headers
 */
export function getDashboardTimeBanner(date: Date = new Date()): {
  tagalog: string;
  bisaya: string;
  english: string;
  icon: string;
} {
  const time = getTimeOfDay(date);
  switch (time) {
    case 'morning':
      return {
        tagalog: 'Magandang Umaga',
        bisaya: 'Maayong Buntag',
        english: 'Good Morning',
        icon: '☀️'
      };
    case 'noon':
      return {
        tagalog: 'Magandang Tanghali',
        bisaya: 'Maayong Udto • Maayong Adlaw',
        english: 'Good Day',
        icon: '☀️'
      };
    case 'afternoon':
      return {
        tagalog: 'Magandang Hapon',
        bisaya: 'Maayong Hapon • Maayong Adlaw',
        english: 'Good Afternoon',
        icon: '🌴'
      };
    case 'evening':
      return {
        tagalog: 'Magandang Gabi',
        bisaya: 'Maayong Gabii',
        english: 'Good Evening',
        icon: '🌙'
      };
  }
}
