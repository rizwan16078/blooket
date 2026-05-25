"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function linkify(text: string) {
  // Convert markdown links [text](url) to clickable HTML
  let html = text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-violet-400 underline hover:text-violet-300">$1</a>'
  );
  // Convert bare URLs to clickable links (if not already inside a markdown link)
  html = html.replace(
    /(?<!["(])https?:\/\/[^\s<>)\]]+/g,
    (url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-violet-400 underline hover:text-violet-300">${url}</a>`
  );
  // Convert **bold** to <strong>
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // Convert *italic* to <em>
  html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");
  return html;
}

const GREETING: Message = {
  role: "assistant",
  content:
    "Hey there! 👋 I'm **Blooky**, your Blooket helper bot! I know every pack, blook, and drop rate. Ask me anything — like which pack to open, how to grind tokens fast, or what the rarest blook is!",
};

const SUGGESTIONS = [
  "Best pack for Chroma?",
  "How to get 500 tokens fast?",
  "What is the rarest blook?",
  "Is Mega Bot worth it?",
  "How to get Rainbow Panda?",
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (messages.length > 0) scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      // Show greeting on first open
      if (messages.length === 0) {
        setMessages([GREETING]);
      }
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    // Basic validation — reject very short input
    if (text.length < 2) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Hmm, could you say that again? I need at least a couple of characters! 😅" },
      ]);
      return;
    }

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m !== GREETING)
        .map((m) => ({
          role: m.role === "user" ? "user" : "model",
          content: m.content,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();
      if (data.error) {
        // Handle rate limit specifically
        const isRateLimit = data.error.includes("quota") || data.error.includes("rate");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: isRateLimit
              ? "I'm getting a lot of questions right now! 😅 Try again in a minute — I'll be here!"
              : `Oops! ${data.error}`,
          },
        ]);
      } else {
        // Cap response length for UI
        const reply = data.reply.length > 500
          ? data.reply.slice(0, 497) + "..."
          : data.reply;
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong 😔 Check your internet and try again!" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSuggestionClick(q: string) {
    setInput(q);
    inputRef.current?.focus();
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg shadow-violet-600/30 transition-transform hover:scale-110 active:scale-95"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {/* Pulse dot when closed and no conversation yet */}
        {!open && messages.length <= 1 && (
          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-3 z-50 flex h-[460px] w-[calc(100vw-24px)] max-w-[360px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0f1629] shadow-2xl shadow-violet-600/10">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-white/10 bg-violet-600/10 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white">Blooky</p>
              <p className="text-[10px] text-white/40">Your Blooket helper — ask me anything!</p>
            </div>
            <Sparkles className="h-4 w-4 text-violet-400/50" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {/* Show suggestions when only greeting exists */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 pb-1">
                {SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSuggestionClick(q)}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[11px] text-white/50 transition hover:border-violet-400/30 hover:bg-violet-600/10 hover:text-white/80"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600/20 text-violet-400">
                    <Bot className="h-3 w-3" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-violet-600 text-white"
                      : "bg-white/[0.05] text-white/80"
                  }`}
                >
                  {msg.role === "user" ? (
                    msg.content
                  ) : (
                    <span
                      dangerouslySetInnerHTML={{ __html: linkify(msg.content) }}
                    />
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/50">
                    <User className="h-3 w-3" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600/20 text-violet-400">
                  <Bot className="h-3 w-3" />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl bg-white/[0.05] px-3 py-2">
                  <Loader2 className="h-3 w-3 animate-spin text-violet-400" />
                  <span className="text-[11px] text-white/40">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-white/10 bg-white/[0.02] px-3 py-2"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Blooket..."
              className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-violet-400/40"
              disabled={loading}
              maxLength={300}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white transition hover:bg-violet-500 disabled:opacity-30"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
