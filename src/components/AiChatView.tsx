import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Trash2, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Compass, 
  ArrowRight, 
  RefreshCw,
  Square,
  X,
  Palmtree,
  Coins,
  Ship,
  UtensilsCrossed,
  Lightbulb,
  ChevronDown,
  Paperclip,
  FileText,
  Mic,
  MicOff,
  UploadCloud,
  AlertCircle
} from 'lucide-react';
import { ChatMessage, ChatAttachment } from '../types';
import { useAuth } from '../firebase/context';
import { 
  getTimeGreeting, 
  formatPersonalizedGreeting, 
  getTimeOfDay, 
  SupportedLanguage, 
  detectLanguageFromText 
} from '../utils/greetings';

interface AiChatViewProps {
  initialPrompt?: string;
  onStartPlanning: (destinationName?: string) => void;
}

interface LocalAttachedFile {
  name: string;
  type: string;
  size: number;
  base64: string;
  previewUrl?: string;
}

const getInitialMessages = (
  user?: { displayName?: string | null; email?: string | null } | null,
  language: SupportedLanguage = 'Auto'
): ChatMessage[] => {
  const greetingHeader = formatPersonalizedGreeting(language, user?.displayName);
  
  let welcomeBody = '';
  if (language === 'Bisaya') {
    welcomeBody = `${greetingHeader} Ako si **Byahedor**, imong Bisaya AI travel guide ug companion sa tibuok Pilipinas!

Gikan sa mga tinagong white-sand beaches sa **Palawan**, surfing sa Cloud 9 sa **Siargao**, canyoneering sa **Kawasan Cebu**, hangtod sa lami nga **Bacolod chicken inasal**, andam ko mogiya nimo matag adlaw!

✨ **Mga Bag-ong Feature:**
- 📎 **Upload og Travel Files:** I-upload ang picture sa mga isla o carinderia aron mahibaloan, o boarding pass ug ferry tickets aron masusi ang skedyul ug presyo.
- 🎙️ **Voice Speech-to-Text:** Pindota ang mikropono para makig-istorya nako pinaagi sa tingog sa Bisaya, Tagalog, o English!

Asa man imong sunod nga laag o byahe karon? Maayong adlaw kanimo!`;
  } else if (language === 'Filipino') {
    welcomeBody = `${greetingHeader} Ako si **Byahedor**, ang iyong personal AI Philippine travel concierge!

Naghahanap ka ba ng secret beaches sa **Palawan**, surfing trip sa **Siargao**, canyoneering adventure sa **Cebu**, o authentic food trip sa **Bacolod at Iloilo**? Nandito ako para alalayan ka sa bawat hakbang ng byahe!

✨ **Mga Bagong Feature:**
- 📎 **Mag-upload ng Travel Files:** Mag-share ng litrato ng tourist spots para ma-identify, litrato ng menu para ma-translate, o e-tickets para ma-check ang oras at pamasahe.
- 🎙️ **Voice Speech-to-Text:** I-tap ang microphone icon para magsalita nang natural sa Tagalog, Bisaya, o English!

Saan mo gustong mag-byahe ngayon? Tara, kwentuhan tayo!`;
  } else if (language === 'Auto') {
    welcomeBody = `${greetingHeader}

I'm **Byahedor**, your multilingual AI Philippine travel concierge! 🌴

Makipag-usap o magtanong sa **English**, **Tagalog / Filipino**, o **Bisaya** — kusa akong sasagot at mag-aadjust sa salitang gamit mo!

✨ **Multilingual Travel Concierge (EN • FIL • BIS):**
- 🏝️ **Bisaya:** *Maayong adlaw!* Pangutana bahin sa mga tinagong isla, pletehan sa barko ug habal-habal, o lami nga kan-anan sa Cebu, Bohol, Siargao, ug Davao.
- 🏖️ **Filipino / Tagalog:** *Magandang araw!* Alamin ang DIY itineraries, estimated budget sa bawat sakay, at pagkain sa Luzon, Visayas, at Mindanao.
- ✈️ **English:** Detailed day-by-day itineraries, packing guides, and flight/ferry logistics in ₱ PHP.

- 📎 **Upload Travel Files:** Share photos of landmarks to identify, carinderia menus to translate, or flight & ferry e-tickets.
- 🎙️ **Voice Speech-to-Text:** Tap the mic to ask travel questions naturally in English, Filipino, or Bisaya!

Asa man imong sunod nga byahe? Saan ang susunod mong gala? Where would you like to travel next?`;
  } else {
    welcomeBody = `${greetingHeader} I'm **Byahedor**, your friendly AI Philippine travel companion!

Whether you're looking for secret beaches in **Palawan**, planning a surfing trip to **Siargao**, budgeting for **Cebu canyoneering**, or craving authentic **Bacolod chicken inasal**, I'm here to guide you every step of the way!

✨ **New features available:**
- 📎 **Upload Travel Files:** Share photos of landmarks to identify them, carinderia menus to translate, or flight/ferry e-tickets and itineraries to analyze.
- 🎙️ **Voice Speech-to-Text:** Tap the microphone icon to speak your travel questions naturally in English, Filipino, or Bisaya!

How can I help you plan your next *byahe* today? (You can chat with me in English, Tagalog, or Bisaya!)`;
  }

  return [
    {
      id: `msg-welcome-${Date.now()}`,
      sender: 'ai',
      text: welcomeBody,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ];
};

const KNOWN_DESTINATIONS = [
  'Siargao', 'El Nido', 'Coron', 'Palawan', 'Cebu', 'Batanes', 
  'Bohol', 'Boracay', 'Baguio', 'Sagada', 'Vigan', 'Camiguin', 
  'Davao', 'Iloilo', 'Bacolod', 'Siquijor', 'Bicol', 'Mayon', 'Tagaytay', 'Puerto Princesa',
  'La Union', 'Zambales', 'Dumaguete', 'Panglao'
];

type PromptCategory = 'all' | 'islands' | 'budget' | 'transit' | 'food';

interface PromptItem {
  category: PromptCategory;
  text: string;
}

const CATEGORIZED_PROMPTS: PromptItem[] = [
  { category: 'islands', text: 'Top 3 hidden beaches in Siargao?' },
  { category: 'transit', text: 'How to travel El Nido to Coron safely?' },
  { category: 'budget', text: '4-day Boracay budget for 2 people in PHP?' },
  { category: 'food', text: 'Pinakamasarap na kainan sa Vigan at budget?' },
  { category: 'islands', text: 'Top waterfalls in Cebu with canyoneering tips' },
  { category: 'transit', text: 'Cebu to Bohol OceanJet ferry schedule & fares' },
  { category: 'budget', text: 'Paano mag-travel sa Batanes nang tipid?' },
  { category: 'food', text: 'Unsay lami kan-on sa Bacolod ug Iloilo?' },
  { category: 'islands', text: 'Enchanted balete tree and waterfalls in Siquijor' },
];

export const AiChatView: React.FC<AiChatViewProps> = ({
  initialPrompt,
  onStartPlanning
}) => {
  const { currentUser } = useAuth();
  const userKey = currentUser ? currentUser.uid : 'guest';
  const chatStorageKey = `byahedor_chat_history_${userKey}`;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(chatStorageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // ignore
      }
    }
    // Backward-compatible fallback for guest: check legacy 'byahedor_chat_history'
    if (!currentUser) {
      const legacy = localStorage.getItem('byahedor_chat_history');
      if (legacy) {
        try {
          const parsed = JSON.parse(legacy);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {}
      }
    }
    return getInitialMessages(currentUser, 'Auto');
  });

  const [inputPrompt, setInputPrompt] = useState(initialPrompt || '');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('Auto');
  const [activePromptCategory, setActivePromptCategory] = useState<PromptCategory>('all');
  const [showPrompts, setShowPrompts] = useState(false);
  const [userHasScrolledUp, setUserHasScrolledUp] = useState(false);

  // File upload state
  const [attachedFile, setAttachedFile] = useState<LocalAttachedFile | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Speech to text state
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Save history to local storage under user-scoped key
  useEffect(() => {
    localStorage.setItem(chatStorageKey, JSON.stringify(messages));
    if (!currentUser) {
      localStorage.setItem('byahedor_chat_history', JSON.stringify(messages));
    }
  }, [messages, chatStorageKey, currentUser]);

  // Continuous Auto-scroll that moves with the stream
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    if (!userHasScrolledUp || isTyping) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping, userHasScrolledUp]);

  // Track if user scrolled away from bottom to prevent unwanted jumping
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 60;
    if (isAtBottom && userHasScrolledUp) {
      setUserHasScrolledUp(false);
    } else if (!isAtBottom && !userHasScrolledUp && !isTyping) {
      setUserHasScrolledUp(true);
    }
  };

  const jumpToBottom = () => {
    setUserHasScrolledUp(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  // Adjust textarea height dynamically when typing (1-3 lines max)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 96);
      textareaRef.current.style.height = `${Math.max(newHeight, 38)}px`;
    }
  }, [inputPrompt]);

  // Clean up SpeechRecognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  // Process file upload
  const processSelectedFile = (file: File) => {
    if (!file) return;

    // Check size limit: 20MB
    if (file.size > 20 * 1024 * 1024) {
      setFileError('File size exceeds 20MB limit. Please upload a smaller travel photo or document.');
      setTimeout(() => setFileError(null), 4000);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const commaIdx = result.indexOf(',');
      const base64Data = commaIdx !== -1 ? result.substring(commaIdx + 1) : result;
      const previewUrl = file.type.startsWith('image/') ? result : undefined;

      setAttachedFile({
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        base64: base64Data,
        previewUrl
      });
      setFileError(null);
    };
    reader.onerror = () => {
      setFileError('Failed to read file. Please try again.');
      setTimeout(() => setFileError(null), 4000);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDraggingOver) setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  // Speech to Text Toggle
  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError('Voice dictation is supported in Chrome, Edge, and Safari browsers.');
      setTimeout(() => setSpeechError(null), 4000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;

      // Select speech acoustic model based on chosen dialect
      if (selectedLanguage === 'Filipino') {
        recognition.lang = 'fil-PH';
      } else if (selectedLanguage === 'Bisaya') {
        recognition.lang = 'fil-PH';
      } else {
        recognition.lang = 'en-PH';
      }

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInputPrompt(transcript);
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 96)}px`;
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission was denied. Please allow microphone access in your browser.');
        } else if (event.error !== 'no-speech') {
          setSpeechError(`Voice input error: ${event.error}`);
        }
        setIsListening(false);
        setTimeout(() => setSpeechError(null), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setSpeechError('Could not start microphone voice recognition.');
      setIsListening(false);
      setTimeout(() => setSpeechError(null), 4000);
    }
  };

  // Helper to detect mentioned Philippine destinations
  const detectMentionedDestination = (text: string): string | null => {
    for (const dest of KNOWN_DESTINATIONS) {
      if (new RegExp(`\\b${dest}\\b`, 'i').test(text)) {
        return dest;
      }
    }
    return null;
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsTyping(false);
    setMessages(prev => prev.map(m => m.isStreaming ? { ...m, isStreaming: false } : m));
  };

  const handleSendMessage = async (customText?: string) => {
    const rawText = (customText || inputPrompt).trim();
    if ((!rawText && !attachedFile) || isTyping) return;

    const fileToUpload = attachedFile;
    const finalPrompt = rawText || (fileToUpload?.type.startsWith('image/')
      ? 'Please identify and analyze this travel photo, tell me where it is in the Philippines, and provide recommendations.'
      : 'Please review this uploaded travel document, extract key itinerary/booking details, flight/ferry numbers, costs in PHP, and advise me.');

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
    setUserHasScrolledUp(false);
    setAttachedFile(null); // Clear active attachment pill once sent

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: finalPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: fileToUpload ? {
        name: fileToUpload.name,
        type: fileToUpload.type,
        size: fileToUpload.size,
        previewUrl: fileToUpload.previewUrl
      } : undefined
    };

    const aiMsgId = `ai-${Date.now()}`;
    const initialAiMsg: ChatMessage = {
      id: aiMsgId,
      sender: 'ai',
      text: '',
      isStreaming: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages([...newHistory, initialAiMsg]);
    setInputPrompt('');
    setShowPrompts(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = '38px';
    }
    setIsTyping(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const conversationHistory = newHistory.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
        content: m.text
      }));

      const now = new Date();
      const currentHour = now.getHours();
      const timeOfDay = getTimeOfDay(now);
      const detectedPromptLang = selectedLanguage === 'Auto' ? detectLanguageFromText(finalPrompt) : selectedLanguage;
      const timeGreeting = getTimeGreeting(detectedPromptLang, now);
      const clientTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify({
          message: finalPrompt,
          messages: conversationHistory,
          history: conversationHistory.slice(-8),
          language: selectedLanguage,
          detectedLanguage: detectedPromptLang,
          clientTime: clientTimeStr,
          clientHour: currentHour,
          timeOfDay: timeOfDay,
          timeGreeting: timeGreeting,
          stream: true,
          file: fileToUpload ? {
            name: fileToUpload.name,
            mimeType: fileToUpload.type,
            data: fileToUpload.base64,
            size: fileToUpload.size
          } : undefined
        }),
        signal: controller.signal
      });

      if (!res.ok) {
        throw new Error('Chat API call failed');
      }

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('text/event-stream') && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let accumulatedText = '';
        let streamBuffer = '';

        let streamCompleted = false;
        while (!streamCompleted) {
          const { done, value } = await reader.read();
          if (done) break;

          streamBuffer += decoder.decode(value, { stream: true });
          const events = streamBuffer.split('\n\n');
          streamBuffer = events.pop() || '';

          for (const event of events) {
            const lines = event.split('\n');
            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith('data:')) {
                try {
                  const jsonStr = trimmed.slice(5).trim();
                  if (!jsonStr) continue;
                  const parsed = JSON.parse(jsonStr);

                  if (parsed.text) {
                    accumulatedText += parsed.text;
                  }

                  if (parsed.done) {
                    streamCompleted = true;
                  }

                  setMessages(prev =>
                    prev.map(m =>
                      m.id === aiMsgId
                        ? { ...m, text: accumulatedText, isStreaming: !streamCompleted }
                        : m
                    )
                  );

                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
                  }

                  if (streamCompleted) break;
                } catch {
                  // Wait for complete chunk
                }
              }
            }
            if (streamCompleted) break;
          }
        }

        setMessages(prev =>
          prev.map(m =>
            m.id === aiMsgId
              ? { 
                  ...m, 
                  text: accumulatedText || 'Mabuhay! I am ready to guide your Philippine adventure. Where would you like to travel next?',
                  isStreaming: false 
                }
              : m
          )
        );
      } else {
        const data = await res.json();
        const replyText = data.reply || data.text || data.response || 'Mabuhay! I am ready to guide your Philippine adventure.';

        setMessages(prev =>
          prev.map(m =>
            m.id === aiMsgId
              ? { ...m, text: replyText, isStreaming: false }
              : m
          )
        );
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setMessages(prev =>
          prev.map(m =>
            m.id === aiMsgId
              ? { ...m, isStreaming: false }
              : m
          )
        );
      } else {
        console.error('Chat error:', err);
        const fallbackText = `### 🌴 Byahedor Travel Advice\n\nFor smooth journeys across the Philippine archipelago:\n1. **Carry Cash (₱ PHP):** Island ATMs often run dry on long weekends. Keep cash for tricycle fares and port environmental fees.\n2. **Book Sea Ferries in Advance:** Reserve OceanJet or Montenegro fast crafts 2–3 days early during dry season.\n3. **Eco-Sanctuaries:** Bring reef-safe sunscreen and a 20L waterproof dry bag for bangka transfers.\n\nTell me which destination you would like to plan, and I'll generate a personalized day-by-day itinerary!`;

        setMessages(prev =>
          prev.map(m =>
            m.id === aiMsgId
              ? { ...m, text: fallbackText, isStreaming: false }
              : m
          )
        );
      }
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
    }
  };

  const handleClearHistory = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
    const fresh = getInitialMessages(currentUser, selectedLanguage);
    setMessages(fresh);
    localStorage.removeItem(chatStorageKey);
    if (!currentUser) {
      localStorage.removeItem('byahedor_chat_history');
    }
  };

  const handleLanguageSelect = (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
    // If conversation only contains the welcome message, dynamically refresh it in the selected language with current time greeting
    if (messages.length === 1 && messages[0].sender === 'ai' && messages[0].id.startsWith('msg-welcome')) {
      const refreshedWelcome = getInitialMessages(currentUser, lang);
      setMessages(refreshedWelcome);
    }
  };

  const handleRegenerate = (index: number) => {
    const userMsg = messages[index - 1];
    if (userMsg && userMsg.sender === 'user') {
      handleSendMessage(userMsg.text);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleSpeech = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`~[\]]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    if (selectedLanguage === 'Filipino') {
      utterance.lang = 'fil-PH';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const filteredPrompts = CATEGORIZED_PROMPTS.filter(p => 
    activePromptCategory === 'all' || p.category === activePromptCategory
  );

  return (
    <div 
      id="byahedor-ai-chat-view" 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="flex-1 min-h-0 flex flex-col w-full h-full bg-white dark:bg-[#0f233a] rounded-none sm:rounded-2xl lg:rounded-3xl border-0 sm:border border-[#E4E9F0] dark:border-slate-800 shadow-none sm:shadow-sm overflow-hidden relative"
    >
      {/* Drag & Drop Visual Overlay */}
      {isDraggingOver && (
        <div className="absolute inset-0 z-50 bg-[#087EA4]/20 backdrop-blur-xs border-2 border-dashed border-[#087EA4] flex flex-col items-center justify-center text-[#087EA4] dark:text-white p-6 space-y-2 pointer-events-none animate-fadeIn">
          <UploadCloud className="w-12 h-12 animate-bounce" />
          <p className="font-bold text-sm">Drop travel photos, tickets, or itineraries here</p>
          <p className="text-xs text-slate-500 dark:text-slate-300">Byahedor AI will analyze the details for your trip</p>
        </div>
      )}

      {/* 1. Cohesive Header Bar */}
      <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 border-b border-[#E4E9F0] dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#071728]/60 backdrop-blur-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-[#087EA4] to-[#39A96B] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Bot className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-xs sm:text-sm font-bold text-[#102A43] dark:text-white font-heading truncate">
                Byahedor AI Concierge
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" title="Live" />
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#087EA4]/10 dark:bg-[#087EA4]/25 text-[#087EA4] dark:text-[#4DB8E8] text-[9px] font-semibold">
                <User className="w-2.5 h-2.5 shrink-0" />
                <span className="max-w-[75px] sm:max-w-[120px] truncate">
                  {currentUser ? (currentUser.displayName || currentUser.email || 'Member') : 'Guest'}
                </span>
              </span>
            </div>
            <p className="text-[10px] text-[#627D98] dark:text-slate-400 truncate">
              Island guide, vision & voice concierge
            </p>
          </div>
        </div>

        {/* Dialect Toggle & Clear Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center bg-slate-200/70 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-bold">
            {(['Auto', 'English', 'Filipino', 'Bisaya'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => handleLanguageSelect(lang)}
                className={`px-1.5 sm:px-2 py-0.5 rounded-md transition-all ${
                  selectedLanguage === lang
                    ? 'bg-white dark:bg-[#0f233a] text-[#087EA4] dark:text-[#4DB8E8] shadow-2xs font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={
                  lang === 'Auto'
                    ? 'Multilingual auto-detect: replies in English, Tagalog, or Bisaya based on your message'
                    : `Chat in ${lang} (${getTimeGreeting(lang)})`
                }
              >
                {lang === 'Auto' ? 'Auto' : lang === 'English' ? 'EN' : lang === 'Filipino' ? 'FIL' : 'BIS'}
              </button>
            ))}
          </div>

          <button
            onClick={handleClearHistory}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors shrink-0"
            title="Clear Chat History"
            aria-label="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Scrollable Messages Body */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-5 py-3 sm:py-4 space-y-3 sm:space-y-3.5 no-scrollbar overscroll-contain"
      >
        {messages.map((msg, index) => {
          const isAI = msg.sender === 'ai';
          const detectedDest = isAI ? detectMentionedDestination(msg.text) : null;
          const isStreamingMsg = isAI && msg.isStreaming;

          return (
            <div
              key={msg.id || index}
              className={`flex items-start gap-2 sm:gap-2.5 ${isAI ? 'justify-start' : 'justify-end'}`}
            >
              {isAI && (
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-tr from-[#087EA4] to-[#39A96B] text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              {/* Natural Content Width */}
              <div
                className={`rounded-2xl transition-all ${
                  isAI
                    ? 'p-3 sm:p-3.5 max-w-[92%] sm:max-w-[85%] bg-slate-50 dark:bg-slate-800/70 text-[#102A43] dark:text-slate-100 border border-slate-200/70 dark:border-slate-700/60 shadow-2xs'
                    : 'p-2.5 sm:p-3 max-w-[85%] sm:max-w-[75%] bg-[#087EA4] text-white rounded-tr-xs shadow-2xs inline-block'
                }`}
              >
                {/* Header Line */}
                <div className="flex items-center justify-between gap-3 mb-1 text-[9px] text-slate-400">
                  <span className={`font-bold ${isAI ? 'text-[#087EA4] dark:text-[#4DB8E8]' : 'text-white/80'}`}>
                    {isAI ? 'Byahedor AI' : 'You'}
                  </span>
                  <span className={isAI ? 'text-slate-400' : 'text-white/70'}>{msg.timestamp}</span>
                </div>

                {/* Message Body */}
                <div className="text-xs sm:text-[13px] leading-relaxed min-w-0">
                  {isAI ? (
                    <div className="space-y-1.5 [&_strong]:font-bold [&_strong]:text-[#102A43] dark:[&_strong]:text-white">
                      <Markdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          table: ({ children }) => (
                            <div className="w-full my-2 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xs no-scrollbar touch-pan-x">
                              <table className="w-full text-left text-xs min-w-[240px] sm:min-w-[380px] divide-y divide-slate-200 dark:divide-slate-700 border-collapse">
                                {children}
                              </table>
                            </div>
                          ),
                          thead: ({ children }) => (
                            <thead className="bg-slate-100 dark:bg-slate-800 text-[10px] font-bold uppercase">{children}</thead>
                          ),
                          th: ({ children }) => (
                            <th className="px-2 py-1 border-b border-slate-200 dark:border-slate-700">{children}</th>
                          ),
                          td: ({ children }) => (
                            <td className="px-2 py-1 text-xs border-b border-slate-100 dark:border-slate-800">{children}</td>
                          ),
                          code: ({ className, children }) => {
                            const isBlock = String(children).includes('\n') || className?.includes('language-');
                            if (isBlock) {
                              return (
                                <pre className="overflow-x-auto p-2 rounded-lg bg-slate-900 text-slate-100 font-mono text-[11px] my-1.5 no-scrollbar">
                                  <code>{children}</code>
                                </pre>
                              );
                            }
                            return (
                              <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-[11px] font-semibold text-[#087EA4] dark:text-[#4DB8E8]">
                                {children}
                              </code>
                            );
                          },
                          h1: ({ children }) => (
                            <h1 className="text-sm font-bold text-[#102A43] dark:text-white mt-2 mb-0.5 font-heading">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-xs sm:text-sm font-bold text-[#102A43] dark:text-white mt-1.5 mb-0.5 font-heading">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-xs font-bold text-[#087EA4] dark:text-[#4DB8E8] mt-1 mb-0.5">
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="leading-relaxed mb-1 last:mb-0 break-words">{children}</p>
                          ),
                          ul: ({ children }) => (
                            <ul className="my-1 space-y-0.5 pl-3 list-disc marker:text-[#087EA4] dark:marker:text-[#4DB8E8]">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="my-1 space-y-0.5 pl-3 list-decimal marker:text-[#087EA4] dark:marker:text-[#4DB8E8]">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="leading-relaxed">{children}</li>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-2 border-[#087EA4] bg-[#087EA4]/5 dark:bg-[#087EA4]/10 rounded-r px-2 py-1 my-1 italic text-xs">
                              {children}
                            </blockquote>
                          )
                        }}
                      >
                        {msg.text}
                      </Markdown>

                      {isStreamingMsg && !msg.text && (
                        <div className="flex items-center gap-1.5 py-1 text-slate-500 dark:text-slate-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#087EA4] animate-bounce" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4DB8E8] animate-bounce [animation-delay:150ms]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#39A96B] animate-bounce [animation-delay:300ms]" />
                          <span className="text-[11px] font-medium ml-1">Byahedor is thinking...</span>
                        </div>
                      )}

                      {isStreamingMsg && msg.text && (
                        <span className="inline-block w-1.5 h-3.5 bg-[#087EA4] dark:bg-[#4DB8E8] animate-pulse ml-0.5 align-middle rounded-xs" />
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Attached File Preview inside User Bubble */}
                      {msg.attachment && (
                        <div className="rounded-xl overflow-hidden bg-black/20 p-1.5 border border-white/20 max-w-xs">
                          {msg.attachment.type.startsWith('image/') && msg.attachment.previewUrl ? (
                            <img
                              src={msg.attachment.previewUrl}
                              alt={msg.attachment.name}
                              className="rounded-lg max-h-48 object-cover w-full shadow-xs"
                            />
                          ) : (
                            <div className="flex items-center gap-2 p-1.5 text-white text-xs">
                              <FileText className="w-4 h-4 shrink-0 text-white/80" />
                              <div className="min-w-0">
                                <span className="truncate font-semibold block leading-tight">{msg.attachment.name}</span>
                                <span className="text-[10px] text-white/70">({Math.round(msg.attachment.size / 1024)} KB)</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  )}
                </div>

                {/* Detected Destination Action */}
                {isAI && detectedDest && !isStreamingMsg && (
                  <div className="mt-2 pt-1.5 border-t border-slate-200 dark:border-slate-700/60 flex items-center">
                    <button
                      onClick={() => onStartPlanning(detectedDest)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#087EA4]/10 hover:bg-[#087EA4]/20 text-[#087EA4] dark:text-[#4DB8E8] text-[10px] font-semibold transition-colors active:scale-95"
                    >
                      <Compass className="w-3 h-3" />
                      <span>Plan {detectedDest} Itinerary</span>
                      <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
                    </button>
                  </div>
                )}

                {/* Toolbar: Copy, Speech, Retry */}
                {isAI && !isStreamingMsg && msg.text && (
                  <div className="mt-1.5 pt-1 border-t border-slate-200/50 dark:border-slate-700/40 flex items-center gap-2.5">
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      className="text-[9px] text-slate-400 hover:text-[#087EA4] dark:hover:text-[#4DB8E8] flex items-center gap-0.5 transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-2.5 h-2.5 text-emerald-500" />
                          <span className="text-emerald-600 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-2.5 h-2.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {'speechSynthesis' in window && (
                      <button
                        onClick={() => handleToggleSpeech(msg.id, msg.text)}
                        className={`text-[9px] flex items-center gap-0.5 transition-colors ${
                          speakingId === msg.id
                            ? 'text-emerald-600 dark:text-emerald-400 font-bold animate-pulse'
                            : 'text-slate-400 hover:text-[#087EA4] dark:hover:text-[#4DB8E8]'
                        }`}
                      >
                        {speakingId === msg.id ? (
                          <>
                            <VolumeX className="w-2.5 h-2.5" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-2.5 h-2.5" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => handleRegenerate(index)}
                      className="text-[9px] text-slate-400 hover:text-[#087EA4] dark:hover:text-[#4DB8E8] flex items-center gap-0.5 transition-colors"
                      title="Retry"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Retry</span>
                    </button>
                  </div>
                )}
              </div>

              {!isAI && (
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#087EA4]/20 text-[#087EA4] dark:bg-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Jump to Latest Button if User Scrolled Up */}
      {userHasScrolledUp && (
        <button
          onClick={jumpToBottom}
          className="absolute bottom-18 right-4 z-30 px-2.5 py-1 rounded-full bg-[#087EA4] hover:bg-[#076c8c] text-white text-[11px] font-bold shadow-md flex items-center gap-1 active:scale-95 transition-all"
        >
          <ChevronDown className="w-3.5 h-3.5" />
          <span>New messages</span>
        </button>
      )}

      {/* 3. Integrated Bottom Dock: Stationary Locked Typing Bar */}
      <div className="px-2.5 py-2 sm:px-4 sm:py-2.5 bg-white/95 dark:bg-[#0b1c2e]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 shrink-0 space-y-1.5 z-30">
        {/* Error notification banner for speech or file upload */}
        {(speechError || fileError) && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-medium animate-fadeIn">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{speechError || fileError}</span>
          </div>
        )}

        {/* Attached File Preview Card */}
        {attachedFile && (
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-2xs animate-fadeIn">
            {attachedFile.previewUrl ? (
              <img
                src={attachedFile.previewUrl}
                alt={attachedFile.name}
                className="w-10 h-10 object-cover rounded-lg border border-slate-300 dark:border-slate-600 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-[#087EA4]/10 dark:bg-[#087EA4]/20 text-[#087EA4] dark:text-[#4DB8E8] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
            )}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#102A43] dark:text-white truncate">
                  {attachedFile.name}
                </span>
                <span className="text-[10px] text-slate-400 shrink-0">
                  ({Math.round(attachedFile.size / 1024)} KB)
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {attachedFile.type.startsWith('image/')
                  ? 'Travel photo ready — Byahedor will identify landmark/food/beach'
                  : 'Document ready — Byahedor will extract itinerary & booking details'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAttachedFile(null)}
              className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors shrink-0"
              title="Remove file"
              aria-label="Remove attached file"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Toggleable Quick Inspiration Chips */}
        {showPrompts && (
          <div className="space-y-1 pb-1 animate-fadeIn">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'All', icon: Sparkles },
                { id: 'islands', label: 'Islands', icon: Palmtree },
                { id: 'budget', label: 'Budgets', icon: Coins },
                { id: 'transit', label: 'Ferries', icon: Ship },
                { id: 'food', label: 'Food', icon: UtensilsCrossed },
              ].map(cat => {
                const Icon = cat.icon;
                const isActive = activePromptCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActivePromptCategory(cat.id as PromptCategory)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap transition-all shadow-2xs shrink-0 ${
                      isActive
                        ? 'bg-[#087EA4] text-white'
                        : 'bg-white dark:bg-[#0f233a] border border-[#E4E9F0] dark:border-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-2.5 h-2.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 shrink-0 no-scrollbar touch-pan-x">
              {filteredPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q.text)}
                  disabled={isTyping}
                  className="px-2 py-0.5 rounded-lg bg-white dark:bg-[#0f233a] border border-[#E4E9F0] dark:border-slate-800 hover:border-[#087EA4] text-[10px] font-medium text-slate-600 dark:text-slate-300 transition-all whitespace-nowrap shadow-2xs shrink-0 active:scale-95 disabled:opacity-50"
                >
                  {q.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Cohesive Stationary Typing Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="bg-slate-50 dark:bg-slate-800/90 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl border border-slate-300/80 dark:border-slate-700 focus-within:border-[#087EA4] dark:focus-within:border-[#4DB8E8] focus-within:bg-white dark:focus-within:bg-[#0f233a] shadow-2xs transition-all flex items-center gap-1.5 sm:gap-2 relative z-20"
        >
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf,text/plain,text/csv,.md,.json"
            onChange={handleFileChange}
            className="hidden"
            id="chat-file-upload-input"
          />

          {/* Paperclip File Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all shrink-0 ${
              attachedFile
                ? 'bg-[#087EA4] text-white shadow-2xs'
                : 'text-slate-400 hover:text-[#087EA4] hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Upload travel photo, ticket, or itinerary document"
            aria-label="Upload file"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Quick Suggestions Toggle Icon */}
          <button
            type="button"
            onClick={() => setShowPrompts(!showPrompts)}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all shrink-0 ${
              showPrompts
                ? 'bg-[#087EA4] text-white'
                : 'text-slate-400 hover:text-[#087EA4] hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Toggle prompt ideas"
            aria-label="Toggle prompt ideas"
          >
            <Lightbulb className="w-4 h-4" />
          </button>

          {/* Text Input Area */}
          <textarea
            ref={textareaRef}
            id="ai-chat-input-box"
            rows={1}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              isListening
                ? 'Listening... speak your travel question now'
                : attachedFile
                ? 'Add notes for this file, or press send to analyze...'
                : `Ask Byahedor in ${selectedLanguage}...`
            }
            className={`flex-1 bg-transparent py-1 px-1 text-[16px] sm:text-sm font-medium outline-none resize-none min-h-[38px] max-h-24 leading-snug min-w-0 transition-colors ${
              isListening
                ? 'text-rose-600 dark:text-rose-400 placeholder-rose-400 dark:placeholder-rose-500'
                : 'text-[#102A43] dark:text-white placeholder-[#9FB3C8]'
            }`}
          />

          {/* Clear text button */}
          {inputPrompt.trim() && !isTyping && (
            <button
              type="button"
              onClick={() => {
                setInputPrompt('');
                if (textareaRef.current) textareaRef.current.style.height = '38px';
              }}
              className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors shrink-0"
              title="Clear input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Speech-to-Text Microphone Button */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`w-8 h-8 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all shrink-0 ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-500/25 shadow-sm'
                : 'text-slate-400 hover:text-[#087EA4] dark:hover:text-[#4DB8E8] hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isListening ? 'Listening... click to stop' : `Voice speech-to-text in ${selectedLanguage}`}
            aria-label={isListening ? 'Stop voice recognition' : 'Start voice recognition'}
          >
            {isListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>

          {/* Send / Stop Generation Button */}
          {isTyping ? (
            <button
              type="button"
              onClick={handleStopGeneration}
              className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-xs flex items-center justify-center shrink-0 active:scale-95"
              title="Stop generating"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
            </button>
          ) : (
            <button
              type="submit"
              id="ai-chat-send-btn"
              disabled={!inputPrompt.trim() && !attachedFile}
              className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl bg-gradient-to-r from-[#087EA4] to-[#39A96B] hover:brightness-110 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs flex items-center justify-center shrink-0 active:scale-95"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
