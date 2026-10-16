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
  HelpCircle
} from 'lucide-react';
import { ChatMessage } from '../types';

interface AiChatViewProps {
  initialPrompt?: string;
  onStartPlanning: (destinationName?: string) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'ai',
    text: `Mabuhay! 🌴 I'm **Byahedor**, your friendly AI Philippine travel companion!

Whether you're looking for secret beaches in **Palawan**, planning a surfing trip to **Siargao**, budgeting for **Cebu canyoneering**, or craving authentic **Bacolod chicken inasal**, I'm here to guide you every step of the way!

How can I help you plan your next *byahe* today? (You can chat with me in English, Tagalog, or Bisaya!)`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
];

const KNOWN_DESTINATIONS = [
  'Siargao', 'El Nido', 'Coron', 'Palawan', 'Cebu', 'Batanes', 
  'Bohol', 'Boracay', 'Baguio', 'Sagada', 'Vigan', 'Camiguin', 
  'Davao', 'Iloilo', 'Bacolod', 'Siquijor', 'Bicol', 'Puerto Princesa',
  'La Union', 'Zambales', 'Dumaguete', 'Panglao'
];

type PromptCategory = 'all' | 'islands' | 'budget' | 'transit' | 'food';

interface PromptItem {
  category: PromptCategory;
  text: string;
}

const CATEGORIZED_PROMPTS: PromptItem[] = [
  { category: 'islands', text: 'Top 3 hidden beaches and tidal lagoons in Siargao?' },
  { category: 'transit', text: 'How do I travel from El Nido to Coron safely by ferry?' },
  { category: 'budget', text: 'What is the budget breakdown for 4 days in Boracay for 2 people?' },
  { category: 'food', text: 'Ano ang pinakamasarap na kainan sa Vigan at magkano ang budget?' },
  { category: 'islands', text: 'Recommend top 3 secret waterfalls in Cebu with canyoneering tips' },
  { category: 'transit', text: 'Best way to travel between Cebu and Bohol via OceanJet fast craft?' },
  { category: 'budget', text: 'Paano mag-travel sa Batanes nang hindi masyadong mahal?' },
  { category: 'food', text: 'Unsay lami kan-on sa Bacolod ug Iloilo para sa first-timer?' },
  { category: 'islands', text: 'Tell me about the enchanted balete tree and waterfalls in Siquijor' },
];

export const AiChatView: React.FC<AiChatViewProps> = ({
  initialPrompt,
  onStartPlanning
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('byahedor_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        return INITIAL_MESSAGES;
      }
    }
    return INITIAL_MESSAGES;
  });

  const [inputPrompt, setInputPrompt] = useState(initialPrompt || '');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Filipino' | 'Bisaya'>('English');
  const [activePromptCategory, setActivePromptCategory] = useState<PromptCategory>('all');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Save history to local storage
  useEffect(() => {
    localStorage.setItem('byahedor_chat_history', JSON.stringify(messages));
  }, [messages]);

  // Smooth scroll to bottom when new messages arrive or when streaming updates
  useEffect(() => {
    if (scrollContainerRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = scrollContainerRef.current;
      // Only auto-scroll if user is already near bottom (prevent scroll-hijacking when reading past logs)
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 160;
      if (isNearBottom || isTyping) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages, isTyping]);

  // Handle initial prompt from props
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  // Stop speech when unmounting
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Adjust textarea height dynamically when typing
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputPrompt]);

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
    // Mark any streaming message as finished
    setMessages(prev => prev.map(m => m.isStreaming ? { ...m, isStreaming: false } : m));
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputPrompt).trim();
    if (!textToSend || isTyping) return;

    // Clean up any ongoing TTS speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
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

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify({
          message: textToSend,
          messages: conversationHistory,
          history: conversationHistory.slice(-8),
          language: selectedLanguage,
          stream: true
        }),
        signal: controller.signal
      });

      if (!res.ok) {
        throw new Error('Chat API call failed');
      }

      // Check if response is Server-Sent Events stream
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('text/event-stream') && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let accumulatedText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data:')) {
              try {
                const jsonStr = trimmed.slice(5).trim();
                if (!jsonStr) continue;
                const parsed = JSON.parse(jsonStr);

                if (parsed.text) {
                  accumulatedText += parsed.text;
                  setMessages(prev =>
                    prev.map(m =>
                      m.id === aiMsgId
                        ? { ...m, text: accumulatedText, isStreaming: !parsed.done }
                        : m
                    )
                  );
                }

                if (parsed.done) {
                  break;
                }
              } catch {
                // Ignore parse errors on partial chunks
              }
            }
          }
        }

        // Finalize message state
        setMessages(prev =>
          prev.map(m =>
            m.id === aiMsgId
              ? { 
                  ...m, 
                  text: accumulatedText || 'Mabuhay! I am here to guide your Philippine travel adventures. Let me know which island, budget, or route you would like to explore!',
                  isStreaming: false 
                }
              : m
          )
        );
      } else {
        // Fallback for standard non-streaming JSON response
        const data = await res.json();
        const replyText = data.reply || data.text || data.response || 'Mabuhay! I am here to guide your Philippine travel adventures. Let me know which island, budget, or route you would like to explore!';

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
        // User deliberately aborted generation; preserve partial text
        setMessages(prev =>
          prev.map(m =>
            m.id === aiMsgId
              ? { ...m, isStreaming: false }
              : m
          )
        );
      } else {
        console.error('Chat error:', err);
        const fallbackText = `### 🌴 Byahedor Travel Advice\n\nFor smooth journeys across the Philippine archipelago:\n1. **Carry Cash (₱ PHP):** Island ATMs frequently run dry on long weekends. Keep cash for tricycle fares and port environmental fees.\n2. **Book Sea Ferries in Advance:** Reserve OceanJet or Montenegro fast crafts 2–3 days early during dry season.\n3. **Eco-Sanctuaries:** Bring reef-safe sunscreen and a 20L waterproof dry bag for bangka transfers.\n\nTell me which destination you would like to plan, and I'll generate a personalized day-by-day itinerary!`;

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
    }
  };

  const handleRegenerate = (msgIndex: number) => {
    // Find preceding user message
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (messages[i].sender === 'user') {
        handleSendMessage(messages[i].text);
        break;
      }
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear your conversation with Byahedor?')) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setSpeakingId(null);
      setMessages(INITIAL_MESSAGES);
      localStorage.removeItem('byahedor_chat_history');
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
    // Clean text of markdown characters for natural speech synthesis
    const cleanText = text
      .replace(/[#*`_~[\]()|]/g, ' ')
      .replace(/\n+/g, '. ')
      .slice(0, 500);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
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
      className="space-y-2.5 max-w-4xl mx-auto h-[calc(100dvh-9.5rem)] sm:h-[calc(100dvh-8rem)] min-h-[440px] flex flex-col w-full px-1 sm:px-0"
    >
      {/* Responsive Chat Header */}
      <div className="bg-white dark:bg-[#0f233a] p-3 sm:p-4 rounded-2xl border border-[#E4E9F0] dark:border-slate-800 shadow-2xs flex items-center justify-between shrink-0 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#087EA4] to-[#39A96B] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs sm:text-sm font-bold text-[#102A43] dark:text-white font-heading truncate">
                Byahedor AI Concierge
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" title="AI Ready" />
              <span className="hidden md:inline-block text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded-md border border-emerald-200 dark:border-emerald-800">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#627D98] dark:text-slate-400 truncate">
              Real-time Philippine routes, ferry fares, itineraries & budgets
            </p>
          </div>
        </div>

        {/* Dialect Switcher & Clear Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Dialect Pill Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-bold">
            {(['English', 'Filipino', 'Bisaya'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-1.5 sm:px-2 py-0.5 rounded-md transition-all ${
                  selectedLanguage === lang
                    ? 'bg-white dark:bg-[#0f233a] text-[#087EA4] dark:text-[#4DB8E8] shadow-2xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title={`Chat in ${lang}`}
              >
                {lang === 'English' ? 'EN' : lang === 'Filipino' ? 'FIL' : 'BIS'}
              </button>
            ))}
          </div>

          <button
            onClick={handleClearHistory}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
            title="Clear Chat History"
            aria-label="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area - Highly responsive scroll container */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 min-h-0 bg-white dark:bg-[#0f233a] rounded-2xl border border-[#E4E9F0] dark:border-slate-800 p-3 sm:p-5 overflow-y-auto overflow-x-hidden space-y-4 shadow-inner no-scrollbar"
      >
        {messages.map((msg, index) => {
          const isAI = msg.sender === 'ai';
          const detectedDest = isAI ? detectMentionedDestination(msg.text) : null;
          const isStreamingMsg = isAI && msg.isStreaming;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2 sm:gap-2.5 ${isAI ? 'justify-start' : 'justify-end'} w-full`}
            >
              {isAI && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#087EA4] to-[#39A96B] text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              {/* Message Bubble - Wrapped with responsive overflow handling */}
              <div className={`max-w-[94%] sm:max-w-[85%] md:max-w-[80%] min-w-0 p-3.5 sm:p-4.5 shadow-2xs relative group break-words [overflow-wrap:anywhere] ${
                isAI
                  ? 'bg-slate-50 dark:bg-slate-800/80 rounded-2xl rounded-tl-xs border border-[#E4E9F0] dark:border-slate-700/60 text-[#334E68] dark:text-slate-200'
                  : 'bg-[#087EA4] rounded-2xl rounded-tr-xs text-white'
              }`}>
                {/* Message Header */}
                <div className="flex items-center justify-between gap-2 mb-1.5 text-[9px] opacity-70">
                  <span className="font-bold flex items-center gap-1">
                    {isAI ? 'Byahedor AI' : 'You'}
                    {isStreamingMsg && (
                      <span className="text-emerald-500 font-normal animate-pulse text-[8px]">
                        • streaming...
                      </span>
                    )}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Message Body with Responsive React-Markdown Renderers */}
                <div className="text-xs sm:text-sm leading-relaxed min-w-0">
                  {isAI ? (
                    <div className="space-y-2 [&_strong]:font-extrabold [&_strong]:text-[#102A43] dark:[&_strong]:text-white">
                      <Markdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          // Responsive Markdown Table wrapper
                          table: ({ children }) => (
                            <div className="w-full my-3 overflow-x-auto rounded-xl border border-slate-200/90 dark:border-slate-700/90 bg-white/80 dark:bg-slate-900/60 shadow-2xs no-scrollbar">
                              <table className="w-full text-left text-xs min-w-[280px] sm:min-w-[440px] divide-y divide-slate-200 dark:divide-slate-700 border-collapse">
                                {children}
                              </table>
                            </div>
                          ),
                          thead: ({ children }) => (
                            <thead className="bg-slate-100/90 dark:bg-slate-800/90">{children}</thead>
                          ),
                          th: ({ children }) => (
                            <th className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#102A43] dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                              {children}
                            </th>
                          ),
                          td: ({ children }) => (
                            <td className="px-3 py-2 text-xs text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800/60">
                              {children}
                            </td>
                          ),
                          // Responsive Code & Pre blocks
                          code: ({ className, children }) => {
                            const isBlock = String(children).includes('\n') || className?.includes('language-');
                            if (isBlock) {
                              return (
                                <pre className="overflow-x-auto p-3 rounded-xl bg-slate-900 dark:bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 my-2 no-scrollbar">
                                  <code>{children}</code>
                                </pre>
                              );
                            }
                            return (
                              <code className="px-1.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-700 font-mono text-[11px] font-semibold text-[#087EA4] dark:text-[#4DB8E8]">
                                {children}
                              </code>
                            );
                          },
                          // Headings
                          h1: ({ children }) => (
                            <h1 className="text-sm sm:text-base font-bold text-[#102A43] dark:text-white mt-3 mb-1.5 font-heading">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-xs sm:text-sm font-bold text-[#102A43] dark:text-white mt-2.5 mb-1 font-heading">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-xs sm:text-sm font-bold text-[#087EA4] dark:text-[#4DB8E8] mt-2 mb-1">
                              {children}
                            </h3>
                          ),
                          h4: ({ children }) => (
                            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-1.5 mb-0.5">
                              {children}
                            </h4>
                          ),
                          // Paragraphs & Lists
                          p: ({ children }) => (
                            <p className="leading-relaxed mb-2 last:mb-0 break-words">{children}</p>
                          ),
                          ul: ({ children }) => (
                            <ul className="my-2 space-y-1.5 pl-4 list-disc marker:text-[#087EA4] dark:marker:text-[#4DB8E8]">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="my-2 space-y-1.5 pl-4 list-decimal marker:text-[#087EA4] dark:marker:text-[#4DB8E8]">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="leading-relaxed">{children}</li>
                          ),
                          // Blockquotes
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-3 border-[#087EA4] bg-[#087EA4]/5 dark:bg-[#087EA4]/10 rounded-r-lg px-3 py-2 my-2 italic text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                              {children}
                            </blockquote>
                          ),
                          // Links
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#087EA4] dark:text-[#4DB8E8] underline font-medium hover:opacity-80 break-all"
                            >
                              {children}
                            </a>
                          )
                        }}
                      >
                        {msg.text || (isStreamingMsg ? ' ' : '...')}
                      </Markdown>

                      {/* Real-time Streaming Cursor */}
                      {isStreamingMsg && (
                        <span className="inline-block w-1.5 h-3.5 bg-[#087EA4] dark:bg-[#4DB8E8] animate-pulse ml-0.5 align-middle" />
                      )}
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>

                {/* Contextual Action Shortcut Pill if a Destination is detected */}
                {isAI && detectedDest && !isStreamingMsg && (
                  <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => onStartPlanning(detectedDest)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#087EA4]/10 hover:bg-[#087EA4]/20 text-[#087EA4] dark:text-[#4DB8E8] text-[11px] font-semibold transition-colors shadow-2xs active:scale-95"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Plan {detectedDest} Itinerary</span>
                      <ArrowRight className="w-3 h-3 ml-0.5" />
                    </button>
                  </div>
                )}

                {/* Accessible Toolbar: Copy, Speech, & Regenerate */}
                {isAI && !isStreamingMsg && msg.text && (
                  <div className="mt-2.5 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/40 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      className="text-[10px] text-slate-400 hover:text-[#087EA4] dark:hover:text-[#4DB8E8] flex items-center gap-1 transition-colors"
                      aria-label="Copy AI response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-600 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {'speechSynthesis' in window && (
                      <button
                        onClick={() => handleToggleSpeech(msg.id, msg.text)}
                        className={`text-[10px] flex items-center gap-1 transition-colors ${
                          speakingId === msg.id
                            ? 'text-emerald-600 dark:text-emerald-400 font-bold animate-pulse'
                            : 'text-slate-400 hover:text-[#087EA4] dark:hover:text-[#4DB8E8]'
                        }`}
                        aria-label="Listen to response"
                      >
                        {speakingId === msg.id ? (
                          <>
                            <VolumeX className="w-3 h-3" />
                            <span>Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => handleRegenerate(index)}
                      className="text-[10px] text-slate-400 hover:text-[#087EA4] dark:hover:text-[#4DB8E8] flex items-center gap-1 transition-colors"
                      title="Regenerate this response"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Retry</span>
                    </button>
                  </div>
                )}
              </div>

              {!isAI && (
                <div className="w-7 h-7 rounded-lg bg-[#087EA4]/20 text-[#087EA4] dark:bg-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading / Typing indicator (only shown if not already streaming) */}
        {isTyping && !messages.some(m => m.isStreaming && m.text.length > 0) && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#087EA4] to-[#39A96B] text-white flex items-center justify-center shadow-2xs">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-[#F0F7FA] dark:bg-slate-800 p-2.5 px-3 rounded-xl border border-[#E4E9F0] dark:border-slate-700 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#087EA4] animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#4DB8E8] animate-bounce delay-100" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#39A96B] animate-bounce delay-200" />
              <span className="text-[11px] text-[#627D98] font-medium ml-1">Byahedor is crafting your response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Categorized Quick Prompts Bar */}
      <div className="space-y-1.5 shrink-0">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
          {[
            { id: 'all', label: 'All Prompts', icon: Sparkles },
            { id: 'islands', label: 'Islands', icon: Palmtree },
            { id: 'budget', label: 'Budgets', icon: Coins },
            { id: 'transit', label: 'Ferries & Transit', icon: Ship },
            { id: 'food', label: 'Local Food', icon: UtensilsCrossed },
          ].map(cat => {
            const Icon = cat.icon;
            const isActive = activePromptCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActivePromptCategory(cat.id as PromptCategory)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-all shadow-2xs shrink-0 ${
                  isActive
                    ? 'bg-[#087EA4] text-white'
                    : 'bg-white dark:bg-[#0f233a] border border-[#E4E9F0] dark:border-slate-800 text-[#486581] dark:text-slate-300 hover:text-[#087EA4]'
                }`}
              >
                <Icon className="w-2.5 h-2.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Horizontal touch-friendly scroll prompt chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 shrink-0 no-scrollbar">
          {filteredPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q.text)}
              disabled={isTyping}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#0f233a] border border-[#E4E9F0] dark:border-slate-800 hover:border-[#087EA4] text-[10px] sm:text-[11px] font-medium text-[#486581] dark:text-slate-300 hover:text-[#087EA4] transition-all whitespace-nowrap shadow-2xs shrink-0 active:scale-95 disabled:opacity-50"
            >
              {q.text}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Multiline Composer with Stop button during streaming */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="bg-white dark:bg-[#0f233a] p-2 rounded-2xl border border-[#E4E9F0] dark:border-slate-800 shadow-2xs flex items-end gap-2 shrink-0"
      >
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
          placeholder={`Ask Byahedor about Philippine islands, routes, or budgets in ${selectedLanguage}...`}
          className="flex-1 bg-transparent px-2.5 py-1.5 text-xs sm:text-sm font-medium text-[#102A43] dark:text-white placeholder-[#9FB3C8] outline-none resize-none max-h-28 leading-snug min-w-0"
        />

        {inputPrompt.trim() && !isTyping && (
          <button
            type="button"
            onClick={() => setInputPrompt('')}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition-colors mb-1.5"
            title="Clear input"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {isTyping ? (
          <button
            type="button"
            onClick={handleStopGeneration}
            className="w-10 h-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-xs flex items-center justify-center shrink-0 active:scale-95"
            title="Stop generating"
            aria-label="Stop generating response"
          >
            <Square className="w-4 h-4 fill-white" />
          </button>
        ) : (
          <button
            type="submit"
            id="ai-chat-send-btn"
            disabled={!inputPrompt.trim()}
            className="w-10 h-10 rounded-xl bg-[#087EA4] hover:brightness-110 text-white disabled:opacity-40 transition-all shadow-xs flex items-center justify-center shrink-0 active:scale-95"
            aria-label="Send Message"
            title="Send Message (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </form>
    </div>
  );
};
