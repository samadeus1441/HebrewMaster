'use client';

import Link from 'next/link';
import { BookOpen, ChevronRight, Globe, Heart, MessageSquare, Music, Search, Star, Users, Zap } from 'lucide-react';

const config = {
  language: 'Yiddish',
  languageHe: 'ייִדיש',
  slug: 'yiddish',
  emoji: '🕎',
  heroTitle: "Read your grandmother's letters.",
  heroSub: "There are exactly 3 Yiddish tutors across all major online platforms. We are one of them. And we're the only one who teaches dialect-aware Yiddish with real cultural context from Jerusalem.",
  audiences: [
    {
      icon: '💌',
      title: 'Heritage speakers & reconnectors',
      desc: "Your grandparents spoke it. Your parents understood it but didn't pass it on. You hear echoes of it at family gatherings. You want it back — not as a museum piece, but as a living language.",
    },
    {
      icon: '📚',
      title: 'Academic & literary Yiddish',
      desc: "You want to read Sholem Aleichem in the original. Or I.B. Singer. Or the vast Yiddish press archives. Or the Hasidic literature that's still being published today.",
    },
    {
      icon: '🏘️',
      title: 'Hasidic community engagement',
      desc: "You work with, live near, or are part of a Hasidic community. You need practical Yiddish — not YIVO standardized, but the real spoken language of Williamsburg, Bnei Brak, or Mea Shearim.",
    },
    {
      icon: '🎓',
      title: 'Researchers & genealogists',
      desc: "You're tracing family history through Yiddish documents, letters, and records. You need reading proficiency and the ability to recognize handwriting conventions.",
    },
  ],
  painPoints: [
    "Duolingo's Yiddish course confused Lithuanian and Hasidic dialects so badly that native speakers couldn't recognize it",
    "The only textbooks available are from the 1970s and teach a standardized Yiddish nobody actually speaks",
    "You found 3 tutors online — and 2 of them only teach reading, not speaking",
    "Every resource assumes you either want academic YIVO or Hasidic conversational — never both",
  ],
  curriculum: [
    {
      stage: 'Stage 1',
      title: 'The Alef-Beys & Sound System',
      desc: "Master the Yiddish alphabet (different from Hebrew!), vowel system, and choose your dialect track: Lithuanian, Polish, or Hasidic.",
      weeks: '1-3',
    },
    {
      stage: 'Stage 2',
      title: 'First 400 Words & Basic Grammar',
      desc: "Core vocabulary, Germanic grammar foundations, basic conversation. Where Yiddish diverges from German.",
      weeks: '4-8',
    },
    {
      stage: 'Stage 3',
      title: 'Hebrew-Aramaic Component',
      desc: "The loshn-koydesh layer: Hebrew and Aramaic words that make Yiddish unique. How to read them, pronounce them, and use them.",
      weeks: '9-14',
    },
    {
      stage: 'Stage 4',
      title: 'Reading Fluency & Literature',
      desc: "Read real texts: newspapers, short stories, letters. Navigate between dialects. Understand the Yiddish literary tradition.",
      weeks: '15-24',
    },
    {
      stage: 'Stage 5',
      title: 'Advanced Conversation & Culture',
      desc: "Idiomatic Yiddish, humor, proverbs, cultural context. Be able to speak with native speakers in any community.",
      weeks: '24+',
    },
  ],
  unique: [
    {
      icon: Music,
      title: 'Dialect-Aware',
      desc: "Lithuanian (Litvish), Polish (Galitzianer), or Hasidic? We teach each dialect properly — not a confused hybrid like every other resource.",
    },
    {
      icon: Search,
      title: 'Root Explorer: Hebrew-Aramaic Layer',
      desc: "Yiddish contains hundreds of Hebrew and Aramaic words. Our Root Explorer shows these connections, so your Hebrew learning reinforces your Yiddish (and vice versa).",
    },
    {
      icon: BookOpen,
      title: 'Real Texts, Not Textbook Dialogues',
      desc: "Read actual Yiddish literature, letters, newspapers, and modern Hasidic publications — not invented classroom conversations.",
    },
    {
      icon: MessageSquare,
      title: 'Living Language Focus',
      desc: "Yiddish is spoken daily by 500,000+ Hasidic Jews worldwide. We teach it as a living language, not a dead one.",
    },
    {
      icon: Globe,
      title: 'Cross-Language Bridge',
      desc: "Your Yiddish vocabulary is 15-20% Hebrew-Aramaic words. Learning Yiddish unlocks parts of Hebrew and Aramaic — and vice versa.",
    },
    {
      icon: Heart,
      title: 'Extreme Scarcity = Extreme Quality',
      desc: "With only 3 tutors worldwide on major platforms, we can provide something nobody else can: genuine, dialect-aware Yiddish instruction from someone who lives in a Yiddish-speaking environment in Jerusalem.",
    },
  ],
  testimonial: {
    text: "My grandmother spoke Yiddish but my parents didn't pass it on. I tried every resource I could find. Jack is literally one of three Yiddish tutors on the entire internet. I can now read my grandmother's letters. I cried the first time I understood a full paragraph.",
    name: 'Rachel K.',
    location: 'United States',
  },
};

export default function YiddishPage() {
  const c = config;
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a]" dir="ltr">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#e5e2db]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🇮🇱</span>
            <span className="font-serif text-xl font-bold text-[#001B4D]">The Jerusalem Bridge</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <Link href="/product" className="text-[#4a4a4a] hover:text-[#001B4D] transition">Product</Link>
            <Link href="/about" className="text-[#4a4a4a] hover:text-[#001B4D] transition">About</Link>
            <Link href="/pricing" className="text-[#4a4a4a] hover:text-[#001B4D] transition">Pricing</Link>
            <Link href="/testimonials" className="text-[#4a4a4a] hover:text-[#001B4D] transition">Students</Link>
            <Link href="/login" className="text-[#001B4D] font-semibold hover:underline">Log In</Link>
            <Link href="/signup" className="px-5 py-2.5 bg-[#001B4D] text-white text-sm font-semibold hover:bg-[#002b7a] transition shadow-lg">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-white border border-[#e5e2db] px-5 py-2 mb-8">
            <span className="text-2xl">{c.emoji}</span>
            <span className="font-bold text-[#001B4D]">{c.language}</span>
            <span className="text-xl font-hebrew text-[#CFBA8C]" dir="rtl">{c.languageHe}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-[#001B4D] mb-6 leading-tight">
            {c.heroTitle}
          </h1>
          <p className="text-lg text-[#4a4a4a] max-w-2xl mx-auto mb-10">
            {c.heroSub}
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-10 py-4 bg-[#001B4D] text-white font-bold hover:bg-[#002b7a] transition shadow-2xl text-lg">
            Start Learning Yiddish <ChevronRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-[#6b7280] mt-3">10-day free trial. No credit card.</p>
        </div>
      </section>

      {/* Scarcity banner */}
      <section className="bg-[#9BAB16] py-4">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-white font-bold">
            Only 3 Yiddish tutors across all major online platforms. We are one of them.
          </p>
        </div>
      </section>

      {/* Sound familiar? */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-serif text-[#001B4D] text-center mb-10">Sound familiar?</h2>
          <div className="space-y-4">
            {c.painPoints.map((pain, i) => (
              <div key={i} className="flex items-start gap-4 bg-[#FAFAF8] border border-[#e5e2db] p-5">
                <span className="text-xl mt-0.5">😤</span>
                <p className="text-[#4a4a4a]">{pain}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-16 bg-[#FAFAF8]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-serif text-[#001B4D] text-center mb-10">Who this is for</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {c.audiences.map(a => (
              <div key={a.title} className="bg-white border border-[#e5e2db] p-6">
                <span className="text-3xl">{a.icon}</span>
                <h3 className="font-bold text-[#001B4D] mt-3 mb-2">{a.title}</h3>
                <p className="text-sm text-[#4a4a4a] leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Roadmap */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-serif text-[#001B4D] text-center mb-4">Your learning path</h2>
          <p className="text-center text-[#4a4a4a] mb-10">
            Structured, dialect-aware, and culturally grounded.
          </p>
          <div className="space-y-0">
            {c.curriculum.map((stage, i) => (
              <div key={i} className="relative pl-10 pb-8 border-l-2 border-[#e5e2db] last:border-l-0 last:pb-0">
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[#001B4D] border-2 border-white" />
                <div className="bg-[#FAFAF8] border border-[#e5e2db] p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#9BAB16]">{stage.stage}</span>
                    <span className="text-xs text-[#6b7280]">Weeks {stage.weeks}</span>
                  </div>
                  <h3 className="font-bold text-[#001B4D] mb-1">{stage.title}</h3>
                  <p className="text-sm text-[#4a4a4a]">{stage.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unique features */}
      <section className="py-16 bg-[#FAFAF8]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-serif text-[#001B4D] text-center mb-10">Tools built for Yiddish</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {c.unique.map(u => (
              <div key={u.title} className="bg-white border border-[#e5e2db] p-6">
                <u.icon className="w-8 h-8 text-[#001B4D] mb-3" strokeWidth={1.5} />
                <h3 className="font-bold text-[#001B4D] mb-2">{u.title}</h3>
                <p className="text-sm text-[#4a4a4a] leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-[#001B4D] text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="flex gap-1 justify-center mb-6">
            {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-[#CFBA8C] text-[#CFBA8C]" />)}
          </div>
          <p className="text-xl font-serif leading-relaxed italic mb-6">
            "{c.testimonial.text}"
          </p>
          <p className="text-[#CFBA8C] font-semibold">{c.testimonial.name} — {c.testimonial.location}</p>
        </div>
      </section>

      {/* Cross-sell */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-serif text-[#001B4D] mb-4">Yiddish + Hebrew = deeper understanding</h2>
          <p className="text-[#4a4a4a] mb-8">
            15-20% of Yiddish vocabulary comes from Hebrew and Aramaic. Learning one reinforces the other.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/hebrew" className="px-5 py-2.5 border border-[#e5e2db] hover:border-[#001B4D] text-sm font-semibold text-[#001B4D] transition">
              Modern Hebrew →
            </Link>
            <Link href="/biblical-hebrew" className="px-5 py-2.5 border border-[#e5e2db] hover:border-[#001B4D] text-sm font-semibold text-[#001B4D] transition">
              Biblical Hebrew →
            </Link>
            <Link href="/aramaic" className="px-5 py-2.5 border border-[#e5e2db] hover:border-[#001B4D] text-sm font-semibold text-[#001B4D] transition">
              Aramaic →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#F5F0E8]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-serif text-[#001B4D] mb-4">
            Don't let the language die with your grandparents.
          </h2>
          <p className="text-lg text-[#4a4a4a] mb-8">Start your free trial. 10 days. Every feature.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-12 py-5 bg-[#001B4D] text-white font-bold text-lg hover:bg-[#002b7a] transition shadow-2xl">
            Begin Your Free Trial <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#001B4D] text-white/60">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🇮🇱</span>
                <span className="font-serif text-lg text-white">The Jerusalem Bridge</span>
              </div>
              <p className="text-xs leading-relaxed">The only platform bridging Modern Hebrew, Biblical Hebrew, Yiddish, and Aramaic — built by a native Jerusalemite.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Product</h4>
              <div className="flex flex-col gap-2 text-sm">
                <Link href="/product" className="hover:text-white transition">Features</Link>
                <Link href="/pricing" className="hover:text-white transition">Pricing</Link>
                <Link href="/testimonials" className="hover:text-white transition">Student Stories</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Languages</h4>
              <div className="flex flex-col gap-2 text-sm">
                <Link href="/hebrew" className="hover:text-white transition">Modern Hebrew</Link>
                <Link href="/biblical-hebrew" className="hover:text-white transition">Biblical Hebrew</Link>
                <Link href="/yiddish" className="hover:text-white transition">Yiddish</Link>
                <Link href="/aramaic" className="hover:text-white transition">Aramaic</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Company</h4>
              <div className="flex flex-col gap-2 text-sm">
                <Link href="/about" className="hover:text-white transition">About</Link>
                <Link href="/blog" className="hover:text-white transition">Blog</Link>
                <a href="mailto:samadeus@gmail.com" className="hover:text-white transition">Contact</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs">© 2026 The Jerusalem Bridge. Built with love from Jerusalem.</p>
            <div className="flex gap-6 text-sm">
              <Link href="/login" className="hover:text-white transition">Log In</Link>
              <Link href="/signup" className="hover:text-white transition">Sign Up</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
