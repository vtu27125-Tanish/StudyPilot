import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, BookOpen, Languages, Sparkles, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface Citation {
  id: number;
  source: string;
  location: string;
  text_snippet: string;
}

export default function Tutor() {
  const [query, setQuery] = useState('');
  const [chat, setChat] = useState<{role: string, text: string, citations?: Citation[]}[]>([]);
  const [loading, setLoading] = useState(false);
  const [hindiToggle, setHindiToggle] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat, loading]);

  const handleSend = async () => {
    if (!query.trim()) return;
    
    setChat(prev => [...prev, { role: 'user', text: query }]);
    setLoading(true);
    
    const finalQuery = hindiToggle ? `${query} (Please explain this in Hindi)` : query;
    setQuery('');
    
    try {
      const res = await axios.post('http://localhost:8000/chat', { query: finalQuery });
      setChat(prev => [...prev, { 
        role: 'tutor', 
        text: res.data.response,
        citations: res.data.citations 
      }]);
    } catch (err) {
      toast.error('Error connecting to the tutor engine.');
      setChat(prev => [...prev, { role: 'tutor', text: 'Error connecting to the tutor.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 h-full flex flex-col max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Bot className="text-blue-400" size={32} />
            Grounded Tutor
          </h2>
          <p className="text-slate-400 mt-1 text-sm">Every answer is cited directly from your course materials.</p>
        </div>
        <button 
          onClick={() => {
            setHindiToggle(!hindiToggle);
            toast(!hindiToggle ? 'Hindi Mode Enabled' : 'Hindi Mode Disabled', { icon: '🌐' });
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
            hindiToggle 
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.2)]' 
              : 'glass-panel text-slate-300 hover:text-white'
          }`}
        >
          <Languages size={18} />
          Hindi Mode: {hindiToggle ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="flex-1 glass-card rounded-3xl flex flex-col overflow-hidden shadow-2xl relative mb-4">
        <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar scroll-smooth">
          {chat.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-50">
              <Sparkles className="h-16 w-16 text-slate-500 mb-4 animate-pulse" />
              <p className="text-xl text-slate-400">Ask me anything about your course materials.</p>
            </div>
          )}
          <AnimatePresence initial={false}>
            {chat.map((msg, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                key={i} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl p-5 ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-sm shadow-[0_4px_20px_rgba(37,99,235,0.3)]' 
                    : 'bg-slate-800/80 border border-slate-700 text-slate-200 rounded-bl-sm'
                }`}>
                  <div className="flex items-center gap-2 mb-2 opacity-60">
                    {msg.role === 'user' ? <User size={14}/> : <Bot size={14}/>}
                    <span className="text-xs uppercase tracking-wider font-bold">{msg.role === 'user' ? 'You' : 'StudyPilot Tutor'}</span>
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-slate-700/50">
                      <p className="font-semibold text-xs mb-3 text-blue-400 flex items-center gap-2 uppercase tracking-widest"><BookOpen size={14}/> Sources</p>
                      <div className="space-y-2">
                        {msg.citations.map(c => (
                          <motion.div 
                            whileHover={{ scale: 1.02 }}
                            key={c.id} 
                            className="text-xs bg-slate-900/50 border border-slate-800 p-3 rounded-lg hover:border-blue-500/30 transition cursor-pointer"
                          >
                            <span className="text-blue-400 font-bold">[{c.id}] {c.source}</span> <span className="text-slate-500">({c.location})</span>
                            <p className="mt-1 text-slate-400 italic">"{c.text_snippet}"</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 rounded-bl-sm flex gap-2 items-center">
                <span className="animate-bounce h-2 w-2 bg-blue-400 rounded-full"></span>
                <span className="animate-bounce h-2 w-2 bg-blue-400 rounded-full" style={{animationDelay: '0.2s'}}></span>
                <span className="animate-bounce h-2 w-2 bg-blue-400 rounded-full" style={{animationDelay: '0.4s'}}></span>
              </div>
            </motion.div>
          )}
        </div>
        
        <div className="p-5 glass-panel border-t-0 flex gap-3 relative z-10 bg-slate-900/50 backdrop-blur-xl">
          <input 
            type="text" 
            className="flex-1 bg-slate-800/50 border border-slate-700 text-white rounded-xl px-5 py-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-500"
            placeholder="Type your question..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!query.trim()}
            className="bg-blue-600 p-4 rounded-xl text-white hover:bg-blue-500 transition-all flex items-center justify-center w-14 shadow-lg shadow-blue-900/20 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
