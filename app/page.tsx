import Link from 'next/link';
import { BookOpen, Globe, Brain, Users, Sparkles, ChevronRight, Star, Shield } from 'lucide-react';

const languages = [
  {
    name: 'Modern Hebrew',
    nameHe: 'עברית מודרנית',
    description: 'Speak, read, and think in the language of Israel — from street conversations to business fluency.',
    icon: '🇮🇱',
    color: 'from-blue-600 to-blue-800',
    features: ['Conversational fluency', 'Nikud-to-unvocalized transition', 'Business & tech Hebrew'],
  },
  {
    name: 'Biblical Hebrew',
    nameHe: 'עברית מקראית',
    description: 'Read Torah, Prophets, and Psalms in the original — with root-based morphology that unlocks thousands of years of wisdom.',
    icon: '📜',
    color: 'from-amber-700 to-amber-900',
    features: ['Torah reading fluency', 'Binyanim verb patterns', 'Prayer book (Siddur) mastery'],
  },
  {
    name: 'Yiddish',
    nameHe: 'ייִדיש',
    description: 'The language of your grandparents — from heritage recovery to literary fluency across all major dialects.',
    icon: '🕎',
    color: 'from-purple-700 to-purple-900',
    features: ['Heritage speaker activation', 'Dialect-aware learning', 'Literature & culture'],
  },
  {
    name: 'Aramaic',
    nameHe: 'ארמית',
    description: 'Unlock the Talmud, Zohar, and ancient Near Eastern texts — the lingua franca of 3,000 years.',
    icon: '🏛️',
    color: 'from-emerald-700 to-emerald-900',
    features: ['Talmudic Aramaic', 'Zohar & Kabbalistic texts', 'Targum reading'],
  },
];

const testimonials = [
  { name: 'Ana F.', location: 'France', text: "He explains things in a way that actually makes sense instead of just throwing grammar rules at you. Super patient when I mess up pronunciation.", rating: 5 },
  { name: 'Nikolay', location: 'Russia', text: "Finally someone who understands that I already know Hebrew passively — Yaacov helped me activate what was locked inside.", rating: 5 },
  { name: 'Jean-Noël', location: 'France', text: "The bridge from my Siddur Hebrew to actually understanding what I'm reading was exactly what I needed. Brilliant teacher.", rating: 5 },
];

const features = [
  { icon: Brain, title: 'Root-Based Learning', desc: 'Master 3-letter roots and watch thousands of words unlock across all Semitic languages.' },
  { icon: BookOpen, title: 'Nikud Scaffold', desc: 'Transition from voweled to unvocalized text at your own pace with our interactive vowel toggle.' },
  { icon: Sparkles, title: 'AI-Powered Reviews', desc: 'Flashcards generated from YOUR actual lessons — not generic word lists.' },
  { icon: Users, title: 'Live + Async', desc: 'Personal tutoring sessions paired with a practice platform that works between lessons.' },
  { icon: Globe, title: 'Every Dialect', desc: 'Ashkenazi, Sephardi, Mizrachi, Lithuanian Yiddish, Hungarian Yiddish — learn YOUR tradition.' },
  { icon: Shield, title: 'Jerusalem Authentic', desc: 'Built by a native Jerusalemite from the Schlesinger rabbinical lineage. No generic content.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a] selection:bg-[#CFBA8C]/40 selection:text-[#001B4D]">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#e5e2db]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🇮🇱</span>
            <span className="font-serif text-xl font-bold text-[#001B4D]">The Jerusalem Bridge</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#languages" className="text-[#4a4a4a] hover:text-[#001B4D] transition">Languages</a>
            <a href="#method" className="text-[#4a4a4a] hover:text-[#001B4D] transition">Method</a>
            <a href="#testimonials" className="text-[#4a4a4a] hover:text-[#001B4D] transition">Students</a>
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

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
             style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png")` }} />
        
        {/* Decorative Hebrew letters */}
        <div className="absolute top-20 left-10 text-[20rem] font-serif text-[#CFBA8C]/[0.06] select-none leading-none pointer-events-none" dir="rtl">א</div>
        <div className="absolute bottom-10 right-10 text-[16rem] font-serif text-[#001B4D]/[0.04] select-none leading-none pointer-events-none" dir="rtl">ש</div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-20">
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#001B4D]/15 bg-white/60 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse-soft" />
            <span className="text-xs font-semibold tracking-wider uppercase text-[#001B4D]">4 Languages • 1 Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-8 text-[#001B4D] leading-[1.1]">
            The ancient languages,<br />
            <span className="italic text-[#CFBA8C]">alive again.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-[#4a4a4a] leading-relaxed mb-12">
            Hebrew. Yiddish. Aramaic. Biblical Hebrew.<br className="hidden sm:block" />
            One platform built by a native Jerusalemite for serious learners who want more than a game.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/signup" className="px-10 py-5 bg-[#001B4D] text-white font-bold text-lg hover:bg-[#002b7a] transition-all transform hover:-translate-y-0.5 shadow-2xl inline-flex items-center justify-center gap-2">
              Begin Your Journey <ChevronRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="px-10 py-5 border-2 border-[#001B4D] text-[#001B4D] font-bold text-lg hover:bg-[#001B4D]/5 transition-all inline-flex items-center justify-center">
              I Have an Account
            </Link>
          </div>
          <p className="text-sm text-[#6b7280]">Free to start. No credit card required.</p>
        </div>
      </section>

      {/* Languages Grid */}
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
                <div className="flex items-start gap-4 mb-6" dir="ltr">
                  <span className="text-4xl">{lang.icon}</span>
                  <div className="text-left">
                    <h3 className="text-2xl font-serif text-[#001B4D] mb-1">{lang.name}</h3>
                    <p className="text-xl font-hebrew text-[#CFBA8C]" dir="rtl">{lang.nameHe}</p>
                  </div>
                </div>
                <p className="text-[#4a4a4a] mb-6 leading-relaxed text-left">{lang.description}</p>
                <ul className="space-y-2" dir="ltr">
                  {lang.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#001B4D] text-left">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9BAB16] shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Method / Features */}
      <section id="method" className="py-24 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-[#001B4D] mb-4">How It Works</h2>
            <p className="text-lg text-[#4a4a4a] max-w-2xl mx-auto">
              Evidence-based methods that major platforms structurally cannot replicate.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="bg-white border border-[#e5e2db] p-8 text-left">
                <f.icon className="w-8 h-8 text-[#001B4D] mb-4" strokeWidth={1.5} />
                <h3 className="text-lg font-bold text-[#001B4D] mb-2">{f.title}</h3>
                <p className="text-[#4a4a4a] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Nikud Demo */}
      <section className="py-24 bg-[#001B4D] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">The Vowel Bridge</h2>
          <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto">
            The #1 struggle for Hebrew learners: transitioning from voweled textbook Hebrew to real-world unvocalized text. 
            Our interactive Nikud Toggle takes you there step by step.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 md:p-12 rounded-lg">
            <div className="text-4xl md:text-5xl font-hebrew leading-loose mb-8" dir="rtl">
              <span className="text-[#CFBA8C]">בְּרֵאשִׁית</span>
              <span className="mx-4 text-white/30" dir="ltr">→</span>
              <span className="text-white">בראשית</span>
            </div>
            <p className="text-white/60 text-sm">
              From fully voweled → scaffolded → independent reading. At your own pace.
            </p>
          </div>

          <Link href="/signup" className="mt-12 inline-flex items-center gap-2 px-8 py-4 bg-[#CFBA8C] text-[#001B4D] font-bold text-lg hover:bg-[#d4c599] transition">
            Try It Free <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-[#001B4D] mb-4">What Students Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-[#FAFAF8] border border-[#e5e2db] p-8 text-left">
                <div className="flex gap-1 mb-4 justify-start">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#9BAB16] text-[#9BAB16]" />
                  ))}
                </div>
                <p className="text-[#4a4a4a] text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="text-sm">
                  <p className="font-semibold text-[#001B4D]">{t.name}</p>
                  <p className="text-[#6b7280]">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#F5F0E8]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-[#001B4D] mb-6">
            Ready to cross the bridge?
          </h2>
          <p className="text-lg text-[#4a4a4a] mb-8">
            Join learners from 15+ countries who chose depth over games.
          </p>
          <Link href="/signup" className="px-12 py-5 bg-[#001B4D] text-white font-bold text-lg hover:bg-[#002b7a] transition-all transform hover:-translate-y-0.5 shadow-2xl inline-flex items-center gap-2">
            Start Learning Free <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#001B4D] text-white/60">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">🇮🇱</span>
              <span className="font-serif text-lg text-white">The Jerusalem Bridge</span>
            </div>
            <div className="flex gap-8 text-sm">
              <Link href="/login" className="hover:text-white transition">Log In</Link>
              <Link href="/signup" className="hover:text-white transition">Sign Up</Link>
              <a href="mailto:samadeus@gmail.com" className="hover:text-white transition">Contact</a>
            </div>
            <p className="text-xs">Built with love from Jerusalem</p>
          </div>
        </div>
      </footer>
    </div>
  );
}