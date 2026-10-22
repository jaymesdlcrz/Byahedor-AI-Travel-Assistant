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
  ChevronDown
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
  const [showPrompts, setShowPrompts] = useState(false);
  const [userHasScrolledUp, setUserHasScrolledUp] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Save history to local storage
  useEffect(() => {
    localStorage.setItem('byahedor_chat_history', JSON.stringify(messages));
  }, [messages]);

  // FIX: Continuous Auto-scroll that MOVES synchronously with the message body
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
    const textToSend = (customText || inputPrompt).trim();
    if (!textToSend || isTyping) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
    setUserHasScrolledUp(false);

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

  const handleRegenerate = (msgIndex: number) => {
    let targetUserPrompt = '';
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (messages[i].sender === 'user') {
        targetUserPrompt = messages[i].text;
        break;
      }
    }
    if (targetUserPrompt) {
      handleSendMessage(targetUserPrompt);
    }
  };

  const handleClearHistory = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
    setMessages(INITIAL_MESSAGES);
    localStorage.removeItem('byahedor_chat_history');
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
    const cleanText = text
      .replace(/[#*`_~>[\]()]/g, '')
      .replace(/\n+/g, ' ');

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
      className="flex-1 min-h-0 flex flex-col w-full h-full bg-white dark:bg-[#0f233a] rounded-none sm:rounded-2xl lg:rounded-3xl border-0 sm:border border-[#E4E9F0] dark:border-slate-800 shadow-none sm:shadow-sm overflow-hidden relative"
    >
      {/* 1. Cohesive Header Bar */}
      <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 border-b border-[#E4E9F0] dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#071728]/60 backdrop-blur-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-[#087EA4] to-[#39A96B] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Bot className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs sm:text-sm font-bold text-[#102A43] dark:text-white font-heading truncate">
                Byahedor AI Concierge
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" title="Live" />
            </div>
            <p className="text-[10px] text-[#627D98] dark:text-slate-400 truncate">
              Island guide & budget concierge
            </p>
          </div>
        </div>

        {/* Dialect Toggle & Clear Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center bg-slate-200/70 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-bold">
            {(['English', 'Filipino', 'Bisaya'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-1.5 sm:px-2 py-0.5 rounded-md transition-all ${
                  selectedLanguage === lang
                    ? 'bg-white dark:bg-[#0f233a] text-[#087EA4] dark:text-[#4DB8E8] shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={`Chat in ${lang}`}
              >
                {lang === 'English' ? 'EN' : lang === 'Filipino' ? 'FIL' : 'BIS'}
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

      {/* 2. Scrollable Messages Body - Continuous Real-Time Move */}
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

              {/* Natural Content Width - Eliminates awkward giant stretching */}
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
                    <p className="whitespace-pre-wrap">{msg.text}</p>
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

        {/* Cohesive Stationary Typing Bar ("makikita yung pinagtytypan mo") */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="bg-slate-50 dark:bg-slate-800/90 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl border border-slate-300/80 dark:border-slate-700 focus-within:border-[#087EA4] dark:focus-within:border-[#4DB8E8] focus-within:bg-white dark:focus-within:bg-[#0f233a] shadow-2xs transition-all flex items-center gap-1.5 sm:gap-2 relative z-20"
        >
          {/* Quick Suggestions Toggle Icon */}
          <button
            type="button"
            onClick={() => setShowPrompts(!showPrompts)}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all shrink-0 ${
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
            placeholder={`Ask Byahedor in ${selectedLanguage}...`}
            className="flex-1 bg-transparent py-1 px-1 text-[16px] sm:text-sm font-medium text-[#102A43] dark:text-white placeholder-[#9FB3C8] outline-none resize-none min-h-[38px] max-h-24 leading-snug min-w-0"
          />

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
              disabled={!inputPrompt.trim()}
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
