// app/aramaic/page.tsx
'use client';

import Link from 'next/link';
import { BookOpen, Brain, ChevronRight, Globe, MessageSquare, Search, Star, Zap, BookMarked, Scroll, GraduationCap } from 'lucide-react';

const config = {
  language: 'Aramaic',
  languageHe: 'אֲרָמִית',
  slug: 'aramaic',
  emoji: '🏛️',
  heroTitle: 'Read the Talmud without an English crutch.',
  heroSub: "Half the Talmud is Aramaic. The Zohar is Aramaic. The Kaddish is Aramaic. The Targum is Aramaic. If you're serious about Jewish texts, you need this language.",
  audiences: [
    {
      icon: '📚',
      title: 'Talmud students & Daf Yomi learners',
      desc: "You're doing Daf Yomi or studying Gemara. You follow the English translation but you want to read the original Aramaic — to understand the arguments, the wordplay, the precision of the Amoraim.",
    },
    {
      icon: '✨',
      title: 'Kabbalists & Zohar readers',
      desc: "The Zohar is written in a unique dialect of Aramaic. You've read translations but the mystical language has layers that don't survive translation. You want to access the original.",
    },
    {
      icon: '🎓',
      title: 'Academic scholars',
      desc: "You're in a graduate program that requires Aramaic — Semitics, Ancient Near East, Bible studies, Rabbinics. You need systematic grammar and reading ability, not just glossed texts.",
    },
    {
      icon: '📖',
      title: 'From Biblical Hebrew to Aramaic',
      desc: "You already know Biblical Hebrew well. Aramaic is the next logical step — same alphabet, overlapping roots, parallel grammar. You're 60% of the way there already.",
    },
  ],
  painPoints: [
    "You study Talmud daily but you're reading Artscroll, not Aramaic — you feel the distance from the original",
    "There are almost no online resources for learning Aramaic systematically — it's either academic monographs or nothing",
    "You know Hebrew but Aramaic verbs look different enough to be confusing — similar but not the same",
    "Finding an Aramaic tutor is essentially impossible — there may be fewer than 5 in the world who teach it online",
  ],
  curriculum: [
    {
      stage: 'Stage 1',
      title: 'Aramaic Foundations (via Hebrew)',
      desc: 'The alphabet is identical. 40% of vocabulary overlaps with Hebrew. We build on what you know — showing Aramaic as Hebrew\'s sibling, not a foreign language.',
      weeks: '1-4',
    },
    {
      stage: 'Stage 2',
      title: 'Aramaic Verb System & Core Vocabulary',
      desc: 'Pe\'al, Pa\'el, Af\'el — the Aramaic verb patterns mirror Hebrew\'s binyanim. Learn the 200 most common Talmudic Aramaic words.',
      weeks: '5-10',
    },
    {
      stage: 'Stage 3',
      title: 'Reading Talmudic Aramaic',
      desc: 'Parse and read actual Talmudic sugiyot. Understand the flow of argumentation: question, answer, proof, refutation.',
      weeks: '11-20',
    },
    {
      stage: 'Stage 4',
      title: 'Zohar & Literary Aramaic',
      desc: 'The Zohar\'s Aramaic is its own dialect. Targum Onkelos is another. Learn the differences and read each in its own voice.',
      weeks: '21-30',
    },
    {
      stage: 'Stage 5',
      title: 'Independent Reading',
      desc: 'Open any page of Talmud, any passage of Zohar, and read it without a translation. Engage with the original minds of the tradition.',
      weeks: '30+',
    },
  ],
  unique: [
    {
      icon: Search,
      title: 'Root Explorer — Cross-Language',
      desc: "See how one Semitic root appears in Hebrew AND Aramaic. כ-ת-ב in Hebrew becomes כ-ת-ב in Aramaic with different forms — we show both side by side.",
    },
    {
      icon: Brain,
      title: 'Aramaic Verb Patterns',
      desc: "Pe'al, Pa'el, Af'el, Itpe'el, Itpa'al, Ittaf'al — drill every pattern with real Talmudic examples. Know which pattern changes which meaning.",
    },
    {
      icon: BookMarked,
      title: 'Graded Talmud Reading',
      desc: "We grade Talmudic passages by difficulty — vocabulary density, syntactic complexity, subject matter. Start with narrative Aggadah, progress to complex Halakhic arguments.",
    },
    {
      icon: Globe,
      title: 'Hebrew Bridge',
      desc: "Your Biblical or Modern Hebrew IS your head start. We explicitly show every parallel: Hebrew שָׁלוֹם = Aramaic שְׁלָמָא, Hebrew דָּבָר = Aramaic מִלְּתָא. One root system, two languages.",
    },
    {
      icon: Scroll,
      title: 'Dialect Awareness',
      desc: "Babylonian Talmud Aramaic ≠ Jerusalem Talmud Aramaic ≠ Zohar Aramaic ≠ Targum Aramaic. We teach the differences so you're not confused by variant forms.",
    },
    {
      icon: GraduationCap,
      title: 'Extreme Scarcity = Quality',
      desc: "Try to find another Aramaic tutor online. There are maybe 3-5 in the world. We offer something almost nobody else can: systematic, accessible Aramaic instruction from Jerusalem.",
    },
  ],
  testimonial: {
    text: "I've been doing Daf Yomi for three years with ArtScroll. After two months of Aramaic study here, I started recognizing patterns in the Gemara without looking at the English. It's like a veil being lifted — the original text has a rhythm and precision the translation can never capture.",
    name: 'Thomas B.',
    location: 'New York',
  },
};

export default function AramaicPage() {
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
            <Link href="/testimonials" className="text-[#4a4a4a] hover:text-[#001B4D] transition">Students</Link>
            <Link href="/login" className="text-[#001B4D] font-semibold hover:underline">Log In</Link>
            <Link href="/signup" className="px-5 py-2.5 bg-[#001B4D] text-white text-sm font-semibold hover:bg-[#002b7a] transition shadow-lg">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Scarcity banner */}
      <div className="fixed top-16 w-full z-40 bg-[#001B4D] text-white text-center py-2 text-sm">
        <span className="text-[#CFBA8C] font-bold">First-mover:</span> There are almost no systematic Aramaic courses online. This may be the only one.
      </div>

      {/* Hero */}
      <section className="pt-40 pb-20 px-6">
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
            Start Learning {c.language} <ChevronRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-[#6b7280] mt-3">10-day free trial. No credit card.</p>
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
          <div className="text-center mt-10">
            <p className="text-lg font-serif text-[#001B4D]">
              We built this platform because nobody else has.
            </p>
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
            Built on your Hebrew foundation. Aramaic isn't foreign — it's Hebrew's closest sibling.
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
          <h2 className="text-2xl font-serif text-[#001B4D] text-center mb-10">Tools built for {c.language}</h2>
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
            &quot;{c.testimonial.text}&quot;
          </p>
          <p className="text-[#CFBA8C] font-semibold">{c.testimonial.name} — {c.testimonial.location}</p>
        </div>
      </section>

      {/* Cross-sell */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-serif text-[#001B4D] mb-4">One root, many branches</h2>
          <p className="text-[#4a4a4a] mb-8">
            Aramaic and Hebrew share the same Semitic root system.
            The stronger your Hebrew, the faster your Aramaic — and vice versa.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/hebrew" className="px-5 py-2.5 border border-[#e5e2db] hover:border-[#001B4D] text-sm font-semibold text-[#001B4D] transition">
              Modern Hebrew →
            </Link>
            <Link href="/biblical-hebrew" className="px-5 py-2.5 border border-[#e5e2db] hover:border-[#001B4D] text-sm font-semibold text-[#001B4D] transition">
              Biblical Hebrew →
            </Link>
            <Link href="/yiddish" className="px-5 py-2.5 border border-[#e5e2db] hover:border-[#001B4D] text-sm font-semibold text-[#001B4D] transition">
              Yiddish →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#F5F0E8]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-serif text-[#001B4D] mb-4">
            Read the Talmud in its original language.
          </h2>
          <p className="text-lg text-[#4a4a4a] mb-8">Free trial. Full access. No credit card.</p>
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
                <Link href="/login" className="hover:text-white transition">Student Login</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-xs text-center">
            © {new Date().getFullYear()} The Jerusalem Bridge · lashon.online · Built with ❤️ from Jerusalem
          </div>
        </div>
      </footer>
    </div>
  );
}
