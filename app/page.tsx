import Link from 'next/link';
import { BookOpen, Globe, Brain, Users, Sparkles, ChevronRight, Star, Shield, Zap, Heart, Clock, ArrowRight } from 'lucide-react';

const languages = [
  {
    name: 'Modern Hebrew',
    nameHe: '\u05E2\u05D1\u05E8\u05D9\u05EA \u05DE\u05D5\u05D3\u05E8\u05E0\u05D9\u05EA',
    description: 'Speak, read, and think in the language of Israel — from street conversations to business fluency.',
    icon: '\uD83C\uDDEE\uD83C\uDDF1',
    color: 'from-blue-600 to-blue-800',
    features: ['Conversational fluency', 'Nikud-to-unvocalized transition', 'Business & tech Hebrew'],
  },
  {
    name: 'Biblical Hebrew',
    nameHe: '\u05E2\u05D1\u05E8\u05D9\u05EA \u05DE\u05E7\u05E8\u05D0\u05D9\u05EA',
    description: 'Read Torah, Prophets, and Psalms in the original — with root-based morphology that unlocks thousands of years of wisdom.',
    icon: '\uD83D\uDCDC',
    color: 'from-amber-700 to-amber-900',
    features: ['Torah reading fluency', 'Binyanim verb patterns', 'Prayer book (Siddur) mastery'],
  },
  {
    name: 'Yiddish',
    nameHe: '\u05D9\u05D9\u05B4\u05D3\u05D9\u05E9',
    description: 'The language of your grandparents — from heritage recovery to literary fluency across all major dialects.',
    icon: '\uD83D\uDD4E',
    color: 'from-purple-700 to-purple-900',
    features: ['Heritage speaker activation', 'Dialect-aware learning', 'Literature & culture'],
  },
  {
    name: 'Aramaic',
    nameHe: '\u05D0\u05E8\u05DE\u05D9\u05EA',
    description: 'Unlock the Talmud, Zohar, and ancient Near Eastern texts — the lingua franca of 3,000 years.',
    icon: '\uD83C\uDFDB\uFE0F',
    color: 'from-emerald-700 to-emerald-900',
    features: ['Talmudic Aramaic', 'Zohar & Kabbalistic texts', 'Targum reading'],
  },
];

// Biblingo-style: lead with TRANSFORMATION testimonials, not just praise
const testimonials = [
  {
    name: 'Nikolay',
    location: 'Russia',
    text: "I thought I'd need to learn Hebrew from scratch. Yaacov showed me in 10 minutes that I already knew more than I realized — he just helped me activate it. Now I can actually talk to my wife's family in Israel.",
    highlight: 'Heritage activation',
    rating: 5,
  },
  {
    name: 'Jean-No\u00EBl',
    location: 'France',
    text: "After 15 years of reading transliterated prayers, I can finally follow the Hebrew text in shul. The nikud toggle took me from fully voweled text to reading without in 3 months. My rabbi couldn't believe it.",
    highlight: 'Prayer fluency in 3 months',
    rating: 5,
  },
  {
    name: 'Ana F.',
    location: 'France',
    text: "I tried Duolingo Hebrew for a year and could barely order coffee. Three months with this platform and I'm reading news articles. The flashcards from my actual lessons make all the difference.",
    highlight: 'Reading news in 3 months',
    rating: 5,
  },
  {
    name: 'Patrice',
    location: 'France',
    text: "I needed Hebrew for my trip to Israel. Not tourist Hebrew — real conversations. The conversation scenarios prepared me so well that Israelis kept asking if I grew up there.",
    highlight: 'Mistaken for native',
    rating: 5,
  },
];

const features = [
  { icon: Brain, title: 'Flashcards From YOUR Lessons', desc: 'Not generic word lists. Your SRS cards are auto-generated from your actual tutoring sessions — every word you struggled with becomes a drill.', tag: 'Only here' },
  { icon: BookOpen, title: 'The Nikud Toggle', desc: "The #1 struggle for Hebrew learners: moving from voweled textbook Hebrew to real-world text. Our interactive toggle takes you there step by step.", tag: 'Unique' },
  { icon: Sparkles, title: 'Root Explorer', desc: 'Master one 3-letter root and unlock dozens of related words across Hebrew, Aramaic, and even Arabic. This is how native speakers actually think.', tag: 'Unique' },
  { icon: Globe, title: 'Every Dialect', desc: "Ashkenazi, Sephardi, Mizrachi, YIVO Yiddish, Hasidic Yiddish — learn YOUR tradition, not a one-size-fits-all standardization.", tag: 'Only here' },
  { icon: Users, title: 'Tutor + Platform', desc: "Live sessions with a real teacher, plus a practice platform that knows exactly what you covered. They feed each other. No other app can do this.", tag: 'Only here' },
  { icon: Shield, title: 'Jerusalem Authentic', desc: 'Built by a native Jerusalemite from the Schlesinger rabbinical lineage. Not silicon valley engineers guessing at Hebrew pedagogy.', tag: null },
];

// Pain points section — Biblingo-style
const painPoints = [
  {
    pain: "You've been 'learning Hebrew' for years but still can't read a menu in Tel Aviv.",
    solution: 'Our conversation-first method gets you speaking from day one — not conjugating in silence.',
  },
  {
    pain: "Duolingo taught you to say 'the cat is big' but not how to actually talk to your Israeli family.",
    solution: 'Content personalized to YOUR goals — family communication, prayer, Torah, or business.',
  },
  {
    pain: "You can read Hebrew with vowels but freeze when you see a real newspaper or WhatsApp message.",
    solution: 'The Nikud Toggle bridges this gap systematically. You choose when to remove the training wheels.',
  },
  {
    pain: "You want to learn Yiddish but every resource either doesn't exist or mixes up the dialects.",
    solution: "The only platform built with dialect-awareness from the ground up. Learn YOUR family's Yiddish.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a] selection:bg-[#CFBA8C]/40 selection:text-[#001B4D]" dir="ltr">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#e5e2db]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">{'\uD83C\uDDEE\uD83C\uDDF1'}</span>
            <span className="font-serif text-xl font-bold text-[#001B4D]">The Jerusalem Bridge</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#languages" className="text-[#4a4a4a] hover:text-[#001B4D] transition">Languages</a>
            <a href="#method" className="text-[#4a4a4a] hover:text-[#001B4D] transition">Method</a>
            <a href="#testimonials" className="text-[#4a4a4a] hover:text-[#001B4D] transition">Students</a>
            <Link href="/pricing" className="text-[#4a4a4a] hover:text-[#001B4D] transition">Pricing</Link>
            <Link href="/login" className="text-[#001B4D] font-semibold hover:underline">Log In</Link>
            <Link href="/signup" className="px-5 py-2.5 bg-[#001B4D] text-white text-sm font-semibold hover:bg-[#002b7a] transition shadow-lg">
              Start Free
            </Link>
          </div>
          <Link href="/login" className="md:hidden px-4 py-2 bg-[#001B4D] text-white text-sm font-semibold">
            Start
          </Link>
        </div>
      </nav>

      {/* ═══ HERO — Emotional hook FIRST, features LATER ═══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
             style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png")` }} />
        
        <div className="absolute top-20 left-10 text-[20rem] font-serif text-[#CFBA8C]/[0.06] select-none leading-none pointer-events-none" aria-hidden="true">{'\u05D0'}</div>
        <div className="absolute bottom-10 right-10 text-[16rem] font-serif text-[#001B4D]/[0.04] select-none leading-none pointer-events-none" aria-hidden="true">{'\u05E9'}</div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-20">
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#001B4D]/15 bg-white/60 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase text-[#001B4D]">Now accepting students &middot; Free to start</span>
          </div>
          
          {/* Biblingo-style: Lead with the DREAM, not the product */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-8 text-[#001B4D] leading-[1.1] text-center">
            Read the texts<br />
            <span className="italic text-[#CFBA8C]">your grandparents read.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-[#4a4a4a] leading-relaxed mb-12 text-center">
            Hebrew. Yiddish. Aramaic. Biblical Hebrew.<br className="hidden sm:block" />
            Not another language game. A bridge to the culture, prayers, and conversations that define who you are.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link href="/signup" className="px-10 py-5 bg-[#001B4D] text-white font-bold text-lg hover:bg-[#002b7a] transition-all transform hover:-translate-y-0.5 shadow-2xl inline-flex items-center justify-center gap-2">
              Start Learning Free <ChevronRight className="w-5 h-5" />
            </Link>
            <Link href="/pricing" className="px-10 py-5 border-2 border-[#001B4D] text-[#001B4D] font-bold text-lg hover:bg-[#001B4D]/5 transition-all inline-flex items-center justify-center">
              See Pricing
            </Link>
          </div>
          <p className="text-sm text-[#6b7280]">Free to start · No credit card · 10-day full access trial</p>
        </div>
      </section>

      {/* ═══ SECTION 1: ADDRESS PAIN POINTS (Biblingo-style) ═══ */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-[#001B4D] mb-4">Sound familiar?</h2>
            <p className="text-lg text-[#4a4a4a]">These are the problems no major app was built to solve.</p>
          </div>
          
          <div className="space-y-6">
            {painPoints.map((pp, i) => (
              <div key={i} className="bg-[#FAFAF8] border border-[#e5e2db] p-8">
                <p className="text-lg text-[#001B4D] font-serif italic mb-4">"{pp.pain}"</p>
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-[#9BAB16] shrink-0 mt-0.5" strokeWidth={2.5} />
                  <p className="text-[#4a4a4a]">{pp.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2: SOCIAL PROOF — Biblingo-style transformation stories ═══ */}
      <section id="testimonials" className="py-24 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-4">
            <h2 className="text-4xl md:text-5xl font-serif text-[#001B4D] mb-4">Real students, real results</h2>
            <p className="text-lg text-[#4a4a4a] max-w-2xl mx-auto">
              Not engagement metrics. Not streaks. Actual language breakthroughs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white border border-[#e5e2db] p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#9BAB16] text-[#9BAB16]" />
                    ))}
                  </div>
                  {t.highlight && (
                    <span className="text-xs font-bold text-[#9BAB16] bg-[#9BAB16]/10 px-3 py-1">
                      {t.highlight}
                    </span>
                  )}
                </div>
                <p className="text-[#4a4a4a] text-sm leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="text-sm">
                  <p className="font-semibold text-[#001B4D]">{t.name}</p>
                  <p className="text-[#6b7280]">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3: LANGUAGES GRID ═══ */}
      <section id="languages" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-[#001B4D] mb-4">Four Languages, One Home</h2>
            <p className="text-lg text-[#4a4a4a] max-w-2xl mx-auto">
              The only platform that bridges Modern Hebrew, Biblical Hebrew, Yiddish, and Aramaic — with shared roots connecting them all.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {languages.map((lang) => (
              <div key={lang.name} className="group relative bg-[#FAFAF8] border border-[#e5e2db] p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start gap-4 mb-6">
                  <span className="text-4xl">{lang.icon}</span>
                  <div>
                    <h3 className="text-2xl font-serif text-[#001B4D] mb-1">{lang.name}</h3>
                    <p className="text-xl font-hebrew text-[#CFBA8C]"><bdi>{lang.nameHe}</bdi></p>
                  </div>
                </div>
                <p className="text-[#4a4a4a] mb-6 leading-relaxed">{lang.description}</p>
                <ul className="space-y-2">
                  {lang.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-[#001B4D]">
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="shrink-0"><circle cx="4" cy="4" r="3" fill="#9BAB16"/></svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 4: METHOD / FEATURES (with "Only here" tags) ═══ */}
      <section id="method" className="py-24 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-[#001B4D] mb-4">What makes this different</h2>
            <p className="text-lg text-[#4a4a4a] max-w-2xl mx-auto">
              Features that major platforms structurally cannot replicate.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="bg-white border border-[#e5e2db] p-8 relative">
                {f.tag && (
                  <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider text-[#9BAB16] bg-[#9BAB16]/10 px-2 py-0.5">
                    {f.tag}
                  </span>
                )}
                <f.icon className="w-8 h-8 text-[#001B4D] mb-4" strokeWidth={1.5} />
                <h3 className="text-lg font-bold text-[#001B4D] mb-2">{f.title}</h3>
                <p className="text-[#4a4a4a] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5: NIKUD DEMO ═══ */}
      <section className="py-24 bg-[#001B4D] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">The Vowel Bridge</h2>
          <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto">
            The #1 struggle for Hebrew learners: transitioning from voweled textbook Hebrew to real-world unvocalized text. 
            Our interactive Nikud Toggle takes you there step by step.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 md:p-12 rounded-lg">
            <div className="text-4xl md:text-5xl font-hebrew leading-loose mb-8 flex items-center justify-center gap-4 flex-wrap">
              <bdi className="text-[#CFBA8C]">{'\u05D1\u05B0\u05BC\u05E8\u05B5\u05D0\u05E9\u05C1\u05B4\u05D9\u05EA'}</bdi>
              <span className="text-white/30">{'\u2192'}</span>
              <bdi className="text-white">{'\u05D1\u05E8\u05D0\u05E9\u05D9\u05EA'}</bdi>
            </div>
            <p className="text-white/60 text-sm text-center">
              From fully voweled → scaffolded → independent reading. At your own pace.
            </p>
          </div>

          <Link href="/signup" className="mt-12 inline-flex items-center gap-2 px-8 py-4 bg-[#CFBA8C] text-[#001B4D] font-bold text-lg hover:bg-[#d4c599] transition">
            Try It Free <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ═══ SECTION 6: TIME OBJECTION (Biblingo-style) ═══ */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Clock className="w-10 h-10 text-[#CFBA8C] mb-4" strokeWidth={1.5} />
              <h2 className="text-3xl md:text-4xl font-serif text-[#001B4D] mb-4">
                Learn despite your busy life
              </h2>
              <p className="text-[#4a4a4a] leading-relaxed mb-6">
                You don't need to quit your job or move to Israel. Our bite-sized daily reviews take 15-20 minutes. 
                The platform adapts to YOUR schedule, not the other way around.
              </p>
              <p className="text-[#4a4a4a] leading-relaxed">
                And because your flashcards come from actual lessons, those 15 minutes are surgically targeted at exactly what you need — 
                no wasted time on words you already know.
              </p>
            </div>
            <div className="bg-[#FAFAF8] border border-[#e5e2db] p-8">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-[#9BAB16] text-[#9BAB16]" />)}
              </div>
              <p className="text-[#4a4a4a] italic text-sm leading-relaxed mb-4">
                "I have 3 kids and work full time. I do my reviews on the bus to work — 15 minutes each way. 
                After 4 months I can read Hebrew text messages from my mother-in-law without Google Translate. 
                She cried when I replied in Hebrew for the first time."
              </p>
              <p className="font-semibold text-[#001B4D] text-sm">Student testimonial</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 7: GUARANTEE (Biblingo "dating app" approach) ═══ */}
      <section className="py-20 bg-[#FAFAF8]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Heart className="w-10 h-10 text-[#CFBA8C] mx-auto mb-4" strokeWidth={1.5} />
          <h2 className="text-3xl md:text-4xl font-serif text-[#001B4D] mb-4">
            We want you to delete us.
          </h2>
          <p className="text-lg text-[#4a4a4a] leading-relaxed mb-6">
            Most apps are designed to keep you addicted forever. We're designed to get you fluent and send you on your way. 
            When you can read Torah in the original, or order falafel in Hebrew, or understand your grandmother's Yiddish recipes — 
            our job is done.
          </p>
          <p className="text-[#001B4D] font-semibold">
            Not satisfied with your progress? Full refund. No questions. That's the guarantee.
          </p>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-24 bg-[#F5F0E8]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-[#001B4D] mb-6">
            Ready to cross the bridge?
          </h2>
          <p className="text-lg text-[#4a4a4a] mb-8">
            Join learners from 15+ countries who chose depth over games.<br />
            Start learning in 5 minutes. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="px-12 py-5 bg-[#001B4D] text-white font-bold text-lg hover:bg-[#002b7a] transition-all transform hover:-translate-y-0.5 shadow-2xl inline-flex items-center gap-2">
              Start Learning Free <ChevronRight className="w-5 h-5" />
            </Link>
            <Link href="/pricing" className="px-12 py-5 border-2 border-[#001B4D] text-[#001B4D] font-bold text-lg hover:bg-[#001B4D]/5 transition-all inline-flex items-center justify-center">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#001B4D] text-white/60">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">{'\uD83C\uDDEE\uD83C\uDDF1'}</span>
              <span className="font-serif text-lg text-white">The Jerusalem Bridge</span>
            </div>
            <div className="flex gap-8 text-sm">
              <Link href="/login" className="hover:text-white transition">Log In</Link>
              <Link href="/signup" className="hover:text-white transition">Sign Up</Link>
              <Link href="/pricing" className="hover:text-white transition">Pricing</Link>
              <a href="mailto:samadeus@gmail.com" className="hover:text-white transition">Contact</a>
            </div>
            <p className="text-xs">Built with love from Jerusalem</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
