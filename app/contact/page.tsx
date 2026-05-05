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
    <main className="relative overflow-hidden bg-gradient-to-b from-sky-400 to-sky-500">
      <section className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.22),transparent_46%),radial-gradient(circle_at_20%_30%,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_80%_15%,rgba(139,92,246,0.18),transparent_34%)]" />

        <div className="max-w-3xl space-y-5">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-white drop-shadow-sm">
            Get in touch
          </div>
          <h1 className="font-sans text-5xl font-black tracking-wide text-white drop-shadow-md sm:text-6xl">
            Found a Bug? Have a Suggestion?
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-white/90">
            Whether it&apos;s a data correction, feature idea, or just feedback —
            we want to hear it.
          </p>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_0.8fr]">
          {/* Form */}
          <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
            {submitted ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/15 text-4xl">
                  ✓
                </div>
                <h2 className="mt-6 font-sans text-2xl font-black tracking-wide text-slate-900">
                  Message Sent
                </h2>
                <p className="mt-3 max-w-sm text-base text-slate-500">
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
                  className="mt-8 rounded-xl bg-blue-500 px-6 py-3 text-sm font-black text-white shadow-[0_4px_0_0_rgba(29,78,216,1)] transition-all hover:bg-blue-600 active:translate-y-1 active:shadow-none"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Topic Selector */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700">
                    Topic
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {CONTACT_TOPICS.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setTopic(t.value)}
                        className={`rounded-2xl border px-3 py-3 text-center text-sm transition ${
                          topic === t.value
                            ? "border-sky-300 bg-sky-100 text-sky-700"
                            : "border-sky-100 bg-white text-slate-500 hover:border-sky-200 hover:text-slate-700"
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
                  <label htmlFor="contact-name" className="text-sm font-bold text-slate-700">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-2xl border-4 border-sky-100 bg-white px-4 py-4 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-300"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-sm font-bold text-slate-700">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border-4 border-sky-100 bg-white px-4 py-4 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-300"
                    required
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="contact-message" className="text-sm font-bold text-slate-700">
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
                  className="w-full rounded-xl bg-green-500 px-6 py-4 text-base font-black text-white shadow-[0_4px_0_0_rgba(21,128,61,1)] transition-all hover:bg-green-600 active:translate-y-1 active:shadow-none"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Info Cards */}
          <div className="space-y-4">
            <div className="rounded-[1.6rem] border-4 border-sky-200/50 bg-white p-6 shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-black text-slate-900">
                Data Corrections
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                Found a drop rate that doesn&apos;t match your testing? Let us
                know with the pack name, rarity, and your observed data. We take
                every correction seriously.
              </p>
            </div>

            <div className="rounded-[1.6rem] border-4 border-sky-200/50 bg-white p-6 shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-black text-slate-900">
                Feature Requests
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                Want a specific pack added? Need a new metric? We prioritize
                features based on community demand.
              </p>
            </div>

            <div className="rounded-[1.6rem] border-4 border-sky-200/50 bg-white p-6 shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-black text-slate-900">
                Response Time
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-500">
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
