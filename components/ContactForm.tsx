"use client";

import { useState } from "react";

const CONTACT_TOPICS = [
  { value: "feedback", label: "Feedback", icon: "💬" },
  { value: "data", label: "Data Correction", icon: "📊" },
  { value: "feature", label: "Feature Request", icon: "✨" },
  { value: "bug", label: "Bug Report", icon: "🐛" },
  { value: "other", label: "Other", icon: "📧" },
];

export default function ContactForm() {
  const [topic, setTopic] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
      <h2 className="sr-only">Contact Form</h2>
      {submitted ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/15 text-4xl">
            ✓
          </div>
          <h2 className="mt-6 font-sans text-2xl font-black tracking-wide text-white">
            Message Sent
          </h2>
          <p className="mt-3 max-w-sm text-base text-white/40">
            Thanks for reaching out. We&apos;ll get back to you as soon as
            we can.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setTopic("");
              setName("");
              setEmail("");
              setMessage("");
            }}
            className="mt-8 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition-all hover:brightness-110 active:scale-[0.97]"
          >
            Send Another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Topic Selector */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-white/60">
              Topic
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {CONTACT_TOPICS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTopic(t.value)}
                  className={`rounded-xl border px-3 py-3 text-center text-sm transition ${
                    topic === t.value
                      ? "border-violet-500/25 bg-violet-500/10 text-violet-400"
                      : "border-white/[0.06] bg-white/[0.02] text-white/50 hover:border-white/[0.1] hover:text-white/70"
                  }`}
                >
                  <span className="block text-lg">{t.icon}</span>
                  <span className="mt-1 block text-xs">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="contact-name" className="text-sm font-bold text-white/60">
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-base text-white placeholder:text-white/25 outline-none transition focus:border-violet-500/40"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="contact-email" className="text-sm font-bold text-white/60">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-base text-white placeholder:text-white/25 outline-none transition focus:border-violet-500/40"
              required
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label htmlFor="contact-message" className="text-sm font-bold text-white/60">
              Message
            </label>
            <textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What's on your mind?"
              rows={5}
              className="w-full resize-none rounded-2xl border-4 border-sky-100 bg-white px-4 py-4 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:brightness-110 active:scale-[0.97]"
          >
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}
