
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, ChevronDown } from 'lucide-react';
import { getSupportResponse } from '../services/geminiService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface SupportWidgetProps {
  onEscalate: (message: string) => void;
  currentContext: string;
}

export const SupportWidget: React.FC<SupportWidgetProps> = ({ onEscalate, currentContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "Hi! I'm your AI Assistant. Ask me about creating invoices, using the estimator, or Pro features. Have a feature request? Just tell me!",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Call AI Service with currentContext
    const response = await getSupportResponse(userMsg.text, currentContext);
    
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: response.answer,
      sender: 'ai',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);

    if (response.escalate) {
      // Send to internal state (optional)
      onEscalate(userMsg.text);
      
      // Send via Email (Robust Solution)
      setTimeout(() => {
        const subject = encodeURIComponent("App Feature Request / Bug Report");
        const body = encodeURIComponent(`I have a request/feedback about SmartQuote:\n\n${userMsg.text}`);
        window.open(`mailto:support@smartquote.app?subject=${subject}&body=${body}`);
      }, 1500);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans no-print">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-slide-up max-h-[500px]">
          {/* Header */}
          <div className="bg-brand-800 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-1.5 rounded-lg">
                <Bot size={20} className="text-gold-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm">SmartQuote Assistant</h4>
                <p className="text-[10px] text-brand-200">AI-Powered • 24/7 Support</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-brand-200 hover:text-white">
              <ChevronDown size={20} />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 h-80" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-brand-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-slate-400 border border-slate-200 rounded-2xl rounded-tl-none p-3 shadow-sm flex gap-1 items-center text-xs">
                    <Loader2 size={12} className="animate-spin" /> AI is typing...
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a question..."
              className="flex-1 bg-slate-50 border-slate-200 rounded-xl text-sm px-3 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
            <button 
              type="submit" 
              disabled={!inputText.trim() || isTyping}
              className="p-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center relative group ${isOpen ? 'bg-slate-200 text-slate-600 rotate-90' : 'bg-gradient-to-r from-brand-600 to-brand-800 text-white hover:scale-110'}`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <span className="absolute right-full mr-3 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Need Help?
          </span>
        )}
      </button>
    </div>
  );
};
