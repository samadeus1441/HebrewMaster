// app/biblical-hebrew/page.tsx
'use client';

import Link from 'next/link';
import { BookOpen, Brain, ChevronRight, Globe, MessageSquare, Music, Search, Star, Users, Zap, BookMarked, Scroll } from 'lucide-react';

const config = {
  language: 'Biblical Hebrew',
  languageHe: 'עברית מקראית',
  slug: 'biblical-hebrew',
  emoji: '📜',
  heroTitle: 'Read the Torah in the language it was written.',
  heroSub: "Not through a translator's lens. Not filtered through Greek or Latin. Directly. Word by word. Root by root. The way it was meant to be read.",
  audiences: [
    {
      icon: '🕍',
      title: 'Synagogue & prayer connections',
      desc: "You follow along in the Siddur, you hear the Torah reading, but the meaning floats just out of reach. You want to understand what you're saying when you pray — not just pronounce it.",
    },
    {
      icon: '🎓',
      title: 'Seminary & Bible school students',
      desc: "You're in a program that requires Biblical Hebrew. Or you took two semesters and can barely parse a verse. The grammar tables aren't sticking. You need a different approach.",
    },
    {
      icon: '📖',
      title: 'Torah scholars & serious learners',
      desc: "You study Torah weekly — Daf Yomi, parsha, midrash. You rely on translations but you know something gets lost. You want to see what Rashi saw, not what the English says Rashi saw.",
    },
    {
      icon: '🌍',
      title: 'Christians reading the Old Testament',
      desc: "You love the Hebrew Bible. You've heard that translations miss nuances — and you want to experience the original text. The poetry of the Psalms, the narratives of Genesis, in the actual Hebrew.",
    },
  ],
  painPoints: [
    "You've memorized paradigm charts but can't identify a verb form in an actual verse",
    "Your textbook teaches grammar in isolation — disconnected from real Scripture reading",
    "You can't tell the difference between Qal, Pi'el, and Hif'il in context — the verb patterns blur together",
    "You studied vocabulary lists but don't understand how roots generate entire word families",
  ],
  curriculum: [
    {
      stage: 'Stage 1',
      title: 'Aleph-Bet & Vowel System',
      desc: 'Master the alphabet with full nikud, cantillation marks basics, and pronunciation of Biblical Hebrew (Ashkenazi or Sephardic track).',
      weeks: '1-3',
    },
    {
      stage: 'Stage 2',
      title: 'Core Vocabulary & Qal Binyan',
      desc: "The 300 most frequent Biblical Hebrew words cover 80% of the Torah. Master them alongside Qal perfect and imperfect conjugations.",
      weeks: '4-8',
    },
    {
      stage: 'Stage 3',
      title: 'Derived Binyanim & Syntax',
      desc: "Niphal, Pi'el, Hif'il, Hitpa'el, Pu'al, Hof'al. Biblical Hebrew syntax: waw-consecutive, construct chains, relative clauses.",
      weeks: '9-16',
    },
    {
      stage: 'Stage 4',
      title: 'Reading Full Passages',
      desc: 'Parse and read complete sections: Genesis narratives, Psalms, Prophetic literature. Graded by vocabulary difficulty.',
      weeks: '17-30',
    },
    {
      stage: 'Stage 5',
      title: 'Independent Reading & Commentary',
      desc: 'Read any Biblical text independently. Begin engaging with Rashi, Ibn Ezra, and classical commentators in the original.',
      weeks: '30+',
    },
  ],
  unique: [
    {
      icon: Search,
      title: 'Root Explorer',
      desc: "Enter any root and see every form in the Torah — nouns, verbs, adjectives. One root like כ-ת-ב unlocks כָּתַב, מִכְתָּב, כְּתוּבִים, and more. See the family tree.",
    },
    {
      icon: Brain,
      title: 'All 7 Binyanim — Biblical Forms',
      desc: "Biblical Hebrew's verb system IS the language. We drill every binyan with actual Torah examples, not made-up sentences. Each pattern changes meaning systematically.",
    },
    {
      icon: Zap,
      title: 'Nikud Toggle',
      desc: "Start with full vowels. Gradually remove them as you gain confidence. Biblical texts always had vowels — but eventually you want to read without training wheels.",
    },
    {
      icon: BookMarked,
      title: 'Graded Scripture Reading',
      desc: "We grade every chapter of the Hebrew Bible by how much vocabulary you already know. Start with the easiest passages, unlock harder ones as you grow.",
    },
    {
      icon: Globe,
      title: 'Bridge to Modern Hebrew',
      desc: "Same roots, evolved meanings. Your Biblical Hebrew isn't a dead language — it lives in every Israeli conversation. We show you the connections.",
    },
    {
      icon: Scroll,
      title: 'Gateway to Aramaic',
      desc: "The Talmud is 50% Aramaic, 50% Hebrew. Your Biblical Hebrew is the foundation for Aramaic study. We bridge you there when you're ready.",
    },
  ],
  testimonial: {
    text: "Seminary student here. I'd done two semesters of Biblical Hebrew in a classroom and could barely parse a verse. The Root Explorer changed everything — once I saw how one root generates 15 different words, the whole language clicked.",
    name: 'Jean-Noël',
    location: 'Montreal',
  },
};

export default function BiblicalHebrewPage() {
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
              We built this platform specifically to fix these problems.
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
            A structured curriculum — not just a pile of flashcards. Each stage builds on the last.
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
            Biblical Hebrew shares roots with Modern Hebrew and Aramaic.
            Learning one deepens your understanding of the others.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/hebrew" className="px-5 py-2.5 border border-[#e5e2db] hover:border-[#001B4D] text-sm font-semibold text-[#001B4D] transition">
              Modern Hebrew →
            </Link>
            <Link href="/yiddish" className="px-5 py-2.5 border border-[#e5e2db] hover:border-[#001B4D] text-sm font-semibold text-[#001B4D] transition">
              Yiddish →
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
            Start reading Torah in the original today.
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
