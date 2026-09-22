import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, RotateCcw, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ChatMessage from "@/components/ChatMessage";

export default function AIChat() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Initial welcome message
  const getInitialMessages = () => [
    {
      id: "initial-welcome",
      role: "assistant",
      content: user
        ? `Hello ${user.name ? user.name.split(" ")[0] : ""}! I am your Luméa personal shopping assistant. How can I help curate your wardrobe or space today?`
        : "Welcome to Luméa. I am your personal shopping assistant. Ask me anything, explore by budget, or find matching items from our collection.",
      suggestedQueries: [
        "Casual black shirt under ₹2000",
        "Running shoes under ₹3000",
        "Show top-rated minimalist pieces",
        user ? "Recommend based on my past orders" : "Best lifestyle gifts under ₹1500"
      ],
      timestamp: "Now"
    }
  ];

  const [messages, setMessages] = useState(getInitialMessages);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend || !textToSend.trim() || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const guestId = localStorage.getItem("lumea_guest_id") || "guest_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("lumea_guest_id", guestId);

      const res = await api.post("/ai/chat", {
        message: textToSend.trim(),
        guest_id: guestId
      });

      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: res.data.reply,
        products: res.data.products || [],
        suggestedQueries: res.data.suggestedQueries || [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg = {
        id: `assistant-err-${Date.now()}`,
        role: "assistant",
        content: "I ran into a temporary connection issue. Please try again in a moment, or browse our latest drops directly in the Shop.",
        suggestedQueries: ["Show running shoes under ₹3000", "Top rated pieces"],
        timestamp: "Now"
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages(getInitialMessages());
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Button */}
      <motion.button
        data-testid="ai-chat-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2.5 bg-black px-4 py-3 text-sm font-500 text-white shadow-xl transition-colors hover:bg-neutral-900"
        aria-label="Open Luméa AI Assistant"
      >
        <div className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </div>
        <Sparkles size={16} className="text-white" />
        <span className="hidden tracking-wide sm:inline">Ask Luméa AI</span>
      </motion.button>

      {/* Chat Window Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            data-testid="ai-chat-modal"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 flex h-[620px] max-h-[82vh] w-[calc(100vw-32px)] max-w-[440px] flex-col border border-border bg-background shadow-2xl sm:right-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-black px-4 py-3.5 text-white">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center bg-white text-black">
                  <Sparkles size={14} />
                </div>
                <div>
                  <h3 className="font-display text-sm font-600 tracking-tight">LUMÉA AI</h3>
                  <p className="text-[10px] text-white/60">Curated Shopping Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-1.5 text-white/60 transition-colors hover:text-white"
                  title="Reset conversation"
                  aria-label="Reset conversation"
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  type="button"
                  data-testid="ai-chat-close"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-white/60 transition-colors hover:text-white"
                  aria-label="Close Assistant"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Conversation Stream */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onSelectPrompt={(prompt) => handleSend(prompt)}
                />
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex h-6 w-6 items-center justify-center bg-black text-white">
                    <Loader2 size={12} className="animate-spin" />
                  </div>
                  <span className="italic">Luméa is searching catalog...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="border-t border-border bg-card p-3"
            >
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. Black shirt under ₹2000..."
                  data-testid="ai-chat-input"
                  className="w-full border border-border bg-background py-2.5 pl-3.5 pr-10 text-xs focus:border-black focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  data-testid="ai-chat-submit"
                  className="absolute right-1.5 flex h-7 w-7 items-center justify-center bg-black text-white transition-opacity hover:opacity-85 disabled:opacity-30"
                  aria-label="Send query"
                >
                  <Send size={13} />
                </button>
              </div>
              <p className="mt-1.5 text-center text-[10px] text-muted-foreground/70">
                Verified against live Luméa inventory · Zero hallucinations
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
