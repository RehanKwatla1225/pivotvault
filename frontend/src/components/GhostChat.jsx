import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ghost, X, Send, Terminal, MessageSquare, Loader2 } from 'lucide-react';
import api from '../lib/api';
import clsx from 'clsx';

const GhostChat = ({ startupSlug, startupName }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([
    { role: 'founder', content: `Hello. I am the founder of ${startupName}. Ask me anything about our journey and why we ultimately failed. I have nothing to hide now.` }
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/ai/ghost-chat', {
        slug: startupSlug,
        message: input,
        history: messages.slice(-5) // Keep context manageable
      });

      setMessages(prev => [...prev, { role: 'founder', content: response.data.content }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'founder', content: "The connection to the afterlife is weak. I can't answer that right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-accent rounded-full flex items-center justify-center shadow-2xl z-50 border-4 border-bg group"
      >
        <Ghost className="w-8 h-8 text-white group-hover:animate-pulse" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red rounded-full animate-ping" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-28 right-8 w-96 h-[500px] glass-card flex flex-col z-50 shadow-2xl overflow-hidden border-accent/30"
          >
            {/* Header */}
            <div className="p-4 bg-accent/10 border-b border-accent/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red animate-pulse" />
                <div className="text-xs font-data font-bold text-accent uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="w-3 h-3" />
                  Ghost of {startupName}
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-[13px] scrollbar-thin scrollbar-thumb-accent/20"
            >
              {messages.map((msg, i) => (
                <div key={i} className={clsx(
                  "flex flex-col",
                  msg.role === 'user' ? "items-end" : "items-start"
                )}>
                  <div className={clsx(
                    "max-w-[85%] p-3 rounded-xl leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-accent/20 text-text-primary rounded-br-none border border-accent/30" 
                      : "bg-surface-2 text-accent rounded-bl-none border border-border"
                  )}>
                    {msg.content}
                  </div>
                  <div className="text-[9px] uppercase font-bold text-text-muted mt-1 px-1">
                    {msg.role === 'user' ? 'YOU' : 'FOUNDER'}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-accent text-[10px] animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  COMMUNICATING WITH THE VOID...
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-surface/50 border-t border-border flex gap-2">
              <input 
                type="text"
                placeholder="Type a question..."
                className="flex-1 bg-surface-2 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent font-mono"
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button 
                type="submit"
                disabled={loading}
                className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-white disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GhostChat;
