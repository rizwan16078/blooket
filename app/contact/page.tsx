"use client";

import { useState } from "react";

const CONTACT_TOPICS = [
  { value: "feedback", label: "Feedback", icon: "💬" },
  { value: "data", label: "Data Correction", icon: "📊" },
  { value: "feature", label: "Feature Request", icon: "✨" },
  { value: "bug", label: "Bug Report", icon: "🐛" },
  { value: "other", label: "Other", icon: "📧" },
];

export default function ContactPage() {
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
    <main className="relative overflow-hidden">
      <section className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.12),transparent)]" />

        <div className="max-w-3xl space-y-5">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-violet-500/10 border border-violet-500/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-violet-400">
            Get in touch
          </div>
          <h1 className="font-sans text-5xl font-black tracking-wide text-white sm:text-6xl">
            Found a Bug? Have a Suggestion?
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-white/50">
            Reach out to the Blooket Calculator team for data corrections, feature requests, or general inquiries.
          </p>
          <div className="mt-6 flex flex-col space-y-4 text-base leading-8 text-white/40 max-w-3xl">
            <p>
              We take data accuracy seriously. If you have spotted a discrepancy in our drop rates, pack costs, or sell values compared to the live game, please let us know. Be sure to specify the exact pack or blook you are reporting.
            </p>
            <p>
              Our team typically reviews and verifies all corrections within 48 hours. For feature requests or mathematical questions about our binomial probability engine, please be as detailed as possible in your message so we can give you the best response.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_0.8fr]">
          {/* Form */}
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

          {/* Info Cards */}
          <div className="space-y-4">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-black text-white">
                Data Corrections
              </h3>
              <p className="mt-2 text-sm leading-7 text-white/40">
                Found a drop rate that doesn&apos;t match your testing? Let us
                know with the pack name, rarity, and your observed data. We take
                every correction seriously.
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-black text-white">
                Feature Requests
              </h3>
              <p className="mt-2 text-sm leading-7 text-white/40">
                Want a specific pack added? Need a new metric? We prioritize
                features based on community demand.
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-black text-white">
                Response Time
              </h3>
              <p className="mt-2 text-sm leading-7 text-white/40">
                We typically respond within 48 hours. Data corrections are
                prioritized and may ship in the same day.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
