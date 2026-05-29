import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Phone, Mail, Star, Heart, Check, Trash2 } from 'lucide-react';
import { Property } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  time: string;
}

interface ContactAgentDrawerProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

const PRESETS = [
  'Is the price negotiable?',
  'Can we schedule an early morning visit on Sunday?',
  'What are the society maintenance and stamp duty costs?',
  'Are there any duplex options available in this tower?',
];

const AGENT_REPLIES = [
  "Namaste! Thanks for reaching out. Yes, minor negotiations are possible for serious buyers who can complete the registration process within 30 days.",
  "Hello! Standard society charges are ₹12,500/month. Stamp duty in Maharashtra is currently 5%, plus ₹30,000 registration fees.",
  "Sure, Sunday morning at 10:00 AM works perfectly! I will arrange the keys and register your entry pass with society reception.",
  "Absolute luxury! There is one exclusive penthouse unit with views of the sea still available. Let's arrange a call to discuss.",
];

export default function ContactAgentDrawer({ property, isOpen, onClose }: ContactAgentDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: `Hello! I'm ${property.agent.name}, your premium partner for ${property.title}. How can I assist you with this property today?`,
      time: '15:17'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset conversation when property changes
    setMessages([
      {
        id: 'welcome',
        sender: 'agent',
        text: `Hello! I'm ${property.agent.name}, your premium partner for "${property.title}". How can I assist you today?`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
      }
    ]);
  }, [property]);

  useEffect(() => {
    // Scroll to bottom on updates
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      time: timeStr
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Trigger simulated agent reply after 1s
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Select appropriate preset answer, or choose random
      let replyText = "That's a great question. Let me check the registry details and I will get back to you immediately over call.";
      if (textToSend.toLowerCase().includes('negotiable')) {
        replyText = AGENT_REPLIES[0];
      } else if (textToSend.toLowerCase().includes('maintenance') || textToSend.toLowerCase().includes('stamp') || textToSend.toLowerCase().includes('duty')) {
        replyText = AGENT_REPLIES[1];
      } else if (textToSend.toLowerCase().includes('sunday') || textToSend.toLowerCase().includes('morning') || textToSend.toLowerCase().includes('visit')) {
        replyText = AGENT_REPLIES[2];
      } else if (textToSend.toLowerCase().includes('duplex') || textToSend.toLowerCase().includes('penthouse')) {
        replyText = AGENT_REPLIES[3];
      }

      const agentMsg: Message = {
        id: Math.random().toString(),
        sender: 'agent',
        text: replyText,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
      };
      setMessages(prev => [...prev, agentMsg]);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-100"
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-brand-beige">
              <div className="flex items-center gap-3">
                <img
                  src={property.agent.avatar}
                  alt={property.agent.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <h4 className="font-display font-semibold text-brand-charcoal text-base">{property.agent.name}</h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active Advisor • ⭐ {property.agent.rating} Rating
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-500 hover:bg-gray-100 transition-colors shadow-xs"
              >
                <X size={16} />
              </button>
            </div>

            {/* Property Quick View Banner */}
            <div className="p-3 bg-stone-50 border-b border-gray-100 flex items-center gap-3">
              <img
                src={property.imageUrl}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-12 h-10 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-semibold text-brand-charcoal truncate">{property.title}</h5>
                <p className="text-[11px] text-gray-400 truncate">{property.address}, {property.city}</p>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fafafa]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3.5 shadow-xs text-sm ${
                      msg.sender === 'user'
                        ? 'bg-brand-charcoal text-white rounded-tr-none'
                        : 'bg-white text-brand-charcoal rounded-tl-none border border-gray-100'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                    <span
                      className={`block text-[10px] mt-1 text-right ${
                        msg.sender === 'user' ? 'text-gray-300' : 'text-gray-400'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-3 shadow-xs max-w-[80%]">
                    <div className="flex gap-1.5 items-center py-1.5 px-1.5">
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Presets and Controls */}
            <div className="p-4 border-t border-gray-100 bg-white space-y-4">
              <div className="space-y-1.5">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Suggested questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(preset)}
                      className="text-xs bg-brand-gray-light hover:bg-brand-cream/40 text-brand-charcoal text-left px-3 py-1.5 rounded-full transition-all border border-transparent hover:border-brand-cream active:scale-95 text-ellipsis overflow-hidden whitespace-nowrap max-w-full"
                    >
                      💡 {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Form */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
                  placeholder={`Write as Anurag...`}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-hidden focus:border-brand-charcoal focus:ring-1 focus:ring-brand-charcoal transition-all"
                />
                <button
                  type="button"
                  onClick={() => handleSend(inputValue)}
                  className="bg-brand-charcoal text-white hover:bg-neutral-800 p-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center shadow-md active:scale-95"
                >
                  <Send size={16} />
                </button>
              </div>

              {/* Phone & Email Quick Access Buttons */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                <a
                  href={`tel:${property.agent.phone}`}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors font-medium border border-emerald-200"
                >
                  <Phone size={12} /> Call Advisor
                </a>
                <a
                  href={`mailto:${property.agent.email}`}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors font-medium border border-blue-200"
                >
                  <Mail size={12} /> Email Advisor
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
