import Link from "next/link";
import PricingSection from "@/components/pricing-section";

/* ═══════════════════════════════════════════════════════
   PageDrop — Premium Landing Page
   Design: Full dark theme — Linear / Raycast / Vercel inspired
   Smooth cohesive dark palette, no jarring transitions
   ═══════════════════════════════════════════════════════ */

const features = [
  {
    title: "Link sharing",
    desc: "Beautiful, customizable link-in-bio pages with 8+ premium themes. Drag-and-drop to reorder.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    title: "Appointment booking",
    desc: "Built-in scheduling — clients pick a date, choose a time, and book. Zero back-and-forth.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    gradient: "from-violet-500 to-purple-600",
  },
  {
    title: "Direct payments",
    desc: "Accept payments via Stripe Connect. Money goes straight to your bank — we never touch it.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
    gradient: "from-fuchsia-500 to-pink-600",
  },
  {
    title: "Analytics dashboard",
    desc: "Track page views, link clicks, and booking trends. Know what's working in real time.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    gradient: "from-amber-500 to-orange-600",
  },
];

const testimonials = [
  {
    quote: "I replaced Linktree, Calendly, AND a Stripe checkout page with PageDrop. My clients book and pay in one click now. Setup took 5 minutes.",
    name: "Maria K.",
    role: "Freelance Designer",
    initials: "MK",
    gradient: "from-indigo-400 to-violet-500",
  },
  {
    quote: "The analytics alone are worth it. I can see exactly which links my audience clicks and which booking slots convert best. Game changer for my coaching business.",
    name: "James T.",
    role: "Business Coach",
    initials: "JT",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    quote: "I was paying $15/mo for Linktree Pro and $12/mo for Calendly. PageDrop Pro at $12 does both AND I keep 100% of my revenue. No-brainer switch.",
    name: "Sarah R.",
    role: "Content Creator, 24K followers",
    initials: "SR",
    gradient: "from-amber-400 to-orange-500",
  },
];

const faqs = [
  { q: "How is this different from Linktree?", a: "Linktree is a link list. PageDrop is a link list + booking system + payment processor in one. You replace 3 tools with one and keep more of your revenue." },
  { q: "Do I need a Stripe account?", a: "Only if you want to accept payments. Booking and link sharing work without Stripe. When you're ready, connecting Stripe takes about 2 minutes." },
  { q: "What happens to my money?", a: "Payments go directly to your Stripe account via Stripe Connect. PageDrop never holds your money. On the free plan there's a 3% platform fee; on Pro it's 0%." },
  { q: "Can I use my own domain?", a: "Yes! Pro and Business plans support custom domains. You can use yourname.com instead of pagedrop.link/yourname." },
  { q: "What if I want to cancel?", a: "Cancel anytime with one click. No contracts, no cancellation fees. Your page stays live on the free plan." },
  { q: "Is there a free trial for Pro?", a: "The free plan is fully functional — it's not a trial. When you're ready for unlimited links, custom domains, and 0% fees, upgrade to Pro for $12/mo." },
];

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#08080c] text-white overflow-hidden">

      {/* ═══ Ambient background orbs (persist across whole page) ═══ */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-indigo-600/[0.07] blur-[150px] animate-pulse-glow" />
        <div className="absolute top-[30%] right-[5%] w-[500px] h-[500px] rounded-full bg-violet-600/[0.05] blur-[130px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-[10%] left-[30%] w-[700px] h-[400px] rounded-full bg-fuchsia-600/[0.04] blur-[150px]" />
      </div>

      {/* ═══ Content layer ═══ */}
      <div className="relative z-10">

        {/* ── Nav ─────────────────────────────────────── */}
        <nav className="relative z-20 border-b border-white/[0.04]" aria-label="Main navigation">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight">PageDrop</span>
            </Link>

            <div className="hidden sm:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</a>
              <a href="#faq" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</a>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-2">
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] px-4 py-2 rounded-lg transition-all"
              >
                Get started
              </Link>
            </div>
          </div>

          {/* Mobile nav */}
          <div className="sm:hidden flex items-center justify-center gap-6 pb-3">
            <a href="#features" className="text-xs text-gray-500 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-xs text-gray-500 hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="text-xs text-gray-500 hover:text-white transition-colors">FAQ</a>
          </div>
        </nav>

        <a href="#features" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-gray-900 focus:px-4 focus:py-2 focus:rounded-lg">
          Skip to content
        </a>

        {/* ── Hero ────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 pt-20 sm:pt-32 pb-24 sm:pb-36 text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] text-xs text-gray-400 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            Now with custom backgrounds &amp; 8 themes
          </div>

          <h1 className="animate-fade-up delay-100 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]">
            <span className="text-white">The link-in-bio that</span>
            <br />
            <span className="text-gradient">books clients &amp; gets you paid</span>
          </h1>

          <p className="animate-fade-up delay-200 mt-6 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The best <strong className="text-gray-300">Linktree alternative</strong> with built-in booking and payments.
            Share links, schedule appointments, and accept payments — all from one beautiful page.
          </p>

          <div className="animate-fade-up delay-300 mt-10 max-w-md mx-auto">
            <form action="/signup" method="GET" className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
              <label htmlFor="hero-email" className="sr-only">Email address</label>
              <input
                id="hero-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none min-w-0"
              />
              <button
                type="submit"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all whitespace-nowrap"
              >
                Get started free
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </form>
            <p className="mt-4 text-xs text-gray-600">
              No credit card required &middot; Set up in under 2 minutes
            </p>
          </div>

          {/* Phone mockup */}
          <div className="animate-fade-up delay-500 mt-20 relative max-w-xs mx-auto" aria-hidden="true" role="presentation">
            <div className="relative mx-auto w-[280px] rounded-[2.5rem] border-[3px] border-white/[0.08] bg-gradient-to-b from-[#111118] to-[#0c0c12] p-3 shadow-2xl shadow-black/60 animate-float">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#08080c] rounded-b-2xl" />
              <div className="rounded-[2rem] overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-purple-50">
                <div className="pt-10 pb-6 px-5 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-400/30">S</div>
                  <p className="mt-3 text-sm font-bold text-gray-900">Sarah Chen</p>
                  <p className="text-[11px] text-gray-500">Designer &amp; Creator</p>
                </div>
                <div className="px-4 pb-3 space-y-2">
                  {["Portfolio", "Book a Call", "YouTube", "Newsletter"].map((label, i) => (
                    <div key={label} className="w-full py-2.5 rounded-xl text-center text-xs font-medium border" style={{ background: i === 1 ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "white", color: i === 1 ? "white" : "#374151", borderColor: i === 1 ? "transparent" : "#e5e7eb" }}>
                      {label}{i === 1 && <span className="ml-1 text-[10px] opacity-80">— Free</span>}
                    </div>
                  ))}
                </div>
                <div className="mx-4 mb-4 p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div><p className="text-[11px] font-semibold text-gray-900">Strategy Session</p><p className="text-[10px] text-gray-400">60 min</p></div>
                    <span className="text-[11px] font-bold text-indigo-600">$50</span>
                  </div>
                </div>
                <div className="pb-4 text-center"><span className="text-[9px] text-gray-300">Powered by PageDrop</span></div>
              </div>
            </div>
            <div className="absolute -left-8 top-20 glass rounded-xl px-3 py-2 text-left animate-float" style={{ animationDelay: "1s" }}>
              <p className="text-[10px] text-gray-500">Page views</p>
              <p className="text-sm font-bold text-white">2,847</p>
              <p className="text-[9px] text-emerald-400">+23% this week</p>
            </div>
            <div className="absolute -right-6 top-48 glass rounded-xl px-3 py-2 text-left animate-float" style={{ animationDelay: "2.5s" }}>
              <p className="text-[10px] text-gray-500">Revenue</p>
              <p className="text-sm font-bold text-white">$1,240</p>
              <p className="text-[9px] text-emerald-400">12 bookings</p>
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="divider-glow max-w-4xl mx-auto" aria-hidden="true" />

        {/* ── Stats Bar ──────────────────────────────────── */}
        <section className="py-16 text-center">
          <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8">
            {[
              { value: "2 min", label: "Average setup time" },
              { value: "$0", label: "To get started" },
              { value: "0%", label: "Platform fee on Pro" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="divider-glow max-w-4xl mx-auto" aria-hidden="true" />

        {/* ── Features ───────────────────────────────────── */}
        <section id="features" className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-indigo-400 tracking-wide uppercase mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Everything you need.<br />Nothing you don&apos;t.
            </h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto">
              Replace your Linktree, Calendly, and Stripe setup with a single link-in-bio tool that does it all.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`group relative rounded-2xl bg-white/[0.02] border border-white/[0.06] p-8 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 ${
                  i === 0 ? "sm:row-span-2" : ""
                }`}
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${f.gradient} text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                {i === 0 && (
                  <div className="mt-8 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="space-y-2">
                      {["Portfolio", "Twitter / X", "YouTube", "Newsletter"].map((t, j) => (
                        <div key={t} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.03]">
                          <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center">
                            <svg className="w-3 h-3 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium text-gray-300 flex-1">{t}</span>
                          <span className="text-[10px] text-gray-600">{(j + 1) * 127} clicks</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── How it works ──────────────────────────────── */}
        <section className="relative py-24">
          <div className="absolute inset-0 bg-white/[0.01]" aria-hidden="true" />
          <div className="relative max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-indigo-400 tracking-wide uppercase mb-3">How it works</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Live in 3 steps</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Sign up", desc: "Create your free account in seconds. No credit card needed." },
                { step: "02", title: "Customize", desc: "Add your links, set your availability, connect Stripe for payments." },
                { step: "03", title: "Share", desc: "Drop your link in your bio. Start getting clicks, bookings, and paid." },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-indigo-500/20 bg-indigo-500/[0.08] text-indigo-400 font-bold text-sm mb-4">
                    {s.step}
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="divider-glow max-w-4xl mx-auto" aria-hidden="true" />

        {/* ── Testimonials ──────────────────────────────── */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-indigo-400 tracking-wide uppercase mb-3">What creators say</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Loved by creators who get things done
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {testimonials.map((t) => (
                <div key={t.name} className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 hover:border-white/[0.1] transition-colors">
                  <div className="flex items-center gap-1 mb-4" aria-label="5 out of 5 stars">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-xs font-bold`}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
              >
                Join them — create your page free
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Pricing ─────────────────────────────────── */}
        <PricingSection />

        {/* ── Divider ── */}
        <div className="divider-glow max-w-4xl mx-auto" aria-hidden="true" />

        {/* ── FAQ ─────────────────────────────────────── */}
        <section id="faq" className="max-w-3xl mx-auto px-6 py-24">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-indigo-400 tracking-wide uppercase mb-3">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Common questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] transition-colors">
                <summary className="flex items-center justify-between p-5 cursor-pointer text-sm font-semibold text-gray-200 hover:text-white transition-colors">
                  {faq.q}
                  <svg className="w-5 h-5 text-gray-600 transition-transform group-open:rotate-180 flex-shrink-0 ml-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* ── Final CTA ──────────────────────────────── */}
        <section className="mx-6 mb-24">
          <div className="relative max-w-5xl mx-auto rounded-3xl border border-white/[0.06] bg-gradient-to-b from-indigo-500/[0.06] to-transparent px-8 py-16 sm:py-20 text-center overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Ready to drop your link?</h2>
              <p className="mt-4 text-gray-500 max-w-md mx-auto">
                Join creators who&apos;ve replaced 3 tools with one. Set up your page in under 2 minutes.
              </p>
              <div className="mt-8">
                <Link
                  href="/signup"
                  className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
                >
                  Get started — it&apos;s free
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ FOOTER ══════════════════════════ */}
        <footer className="border-t border-white/[0.04]">
          <div className="max-w-6xl mx-auto px-6 pt-16 pb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="col-span-2">
                <Link href="/" className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-lg font-bold tracking-tight">PageDrop</span>
                </Link>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                  The all-in-one link-in-bio platform with booking and payments for creators, freelancers, and small businesses.
                </p>
                <div className="flex items-center gap-3 mt-5">
                  {[
                    { label: "Twitter", d: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" },
                    { label: "GitHub", d: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" },
                  ].map(({ label, d }) => (
                    <a key={label} href="#" aria-label={label} className="w-9 h-9 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center transition-colors">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d={d} /></svg>
                    </a>
                  ))}
                </div>
              </div>
              {Object.entries(footerLinks).map(([title, links]) => (
                <div key={title}>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">{title}</h4>
                  <ul className="space-y-2.5">
                    {links.map((link) => (
                      <li key={link.label}>
                        <a href={link.href} className="text-sm text-gray-500 hover:text-white transition-colors">{link.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-12 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} PageDrop. All rights reserved.</p>
              <p className="text-xs text-gray-600">
                Built with{" "}
                <svg className="w-3 h-3 text-red-400/60 inline-block" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                {" "}using Next.js, Tailwind CSS &amp; Stripe
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
