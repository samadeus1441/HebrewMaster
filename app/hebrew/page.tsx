'use client';

import Link from 'next/link';
import { BookOpen, Brain, ChevronRight, Globe, MessageSquare, Music, Search, Star, Users, Zap } from 'lucide-react';

/* ────────────────────────────────────────────
   TEMPLATE: Duplicate this file for each language.
   Change the config object below for:
   - /biblical-hebrew/page.tsx
   - /yiddish/page.tsx
   - /aramaic/page.tsx
   ──────────────────────────────────────────── */

const config = {
  language: 'Modern Hebrew',
  languageHe: 'עברית',
  slug: 'hebrew',
  emoji: '🗣️',
  heroTitle: 'Speak Hebrew like you grew up on Rothschild Boulevard.',
  heroSub: "Whether you're reconnecting with family in Israel, preparing for aliyah, or just tired of being the tourist who points at the menu — this is where you start.",
  // Who it's for
  audiences: [
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Family reconnectors',
      desc: "Your partner's Israeli. Or your kids go to Hebrew school. Or you have cousins in Tel Aviv you can only talk to in broken English. You want to be part of the conversation, not outside it.",
    },
    {
      icon: '✈️',
      title: 'Aliyah planners & frequent visitors',
      desc: "You're going to Israel — maybe for good. Street Hebrew, bureaucracy Hebrew, 'arguing with the cell phone company' Hebrew. Real survival language.",
    },
    {
      icon: '📖',
      title: 'From prayer to conversation',
      desc: "You can follow the Siddur but you can't order lunch. You know the blessings but not the binyanim. You want the living language, not just the liturgical one.",
    },
    {
      icon: '🎓',
      title: 'Students tired of bad apps',
      desc: "You tried Duolingo. You got through 200 days of streaks and still can't conjugate a verb properly. You're ready for something that actually teaches the language.",
    },
  ],
  // Pain points
  painPoints: [
    "You've been 'learning Hebrew' for years but freeze when someone actually speaks to you",
    "Apps taught you words but not how Hebrew actually works — binyanim, roots, patterns",
    "You can read with vowels but panic when they disappear",
    "Everyone tells you 'just move to Israel' as if that's a learning strategy",
  ],
  // What you learn
  curriculum: [
    {
      stage: 'Stage 1',
      title: 'Aleph-Bet & Sound System',
      desc: 'Master the alphabet, vowel system, and basic pronunciation. Nikud Toggle from day one.',
      weeks: '1-3',
    },
    {
      stage: 'Stage 2',
      title: 'First 500 Words & Present Tense',
      desc: 'Survival vocabulary, Binyan Pa\'al present tense, basic conversation patterns.',
      weeks: '4-8',
    },
    {
      stage: 'Stage 3',
      title: 'Past & Future + Binyanim Introduction',
      desc: 'All tenses in Pa\'al, introduction to Pi\'el and Hif\'il. Root-based vocabulary expansion.',
      weeks: '9-16',
    },
    {
      stage: 'Stage 4',
      title: 'All 7 Binyanim + Intermediate Conversation',
      desc: 'Full verb system. Complex sentences. News, podcasts, and unvoweled text.',
      weeks: '17-30',
    },
    {
      stage: 'Stage 5',
      title: 'Fluency & Cultural Depth',
      desc: 'Slang, humor, register switching, literary Hebrew. Read Ha\'aretz, argue in Hebrew.',
      weeks: '30+',
    },
  ],
  // Unique selling points for this language
  unique: [
    {
      icon: Zap,
      title: 'Nikud Toggle',
      desc: "The #1 pain point in Hebrew learning: transitioning from voweled to unvoweled text. Our toggle lets you fade the training wheels at your own pace.",
    },
    {
      icon: Search,
      title: 'Root Explorer',
      desc: "Learn one root → unlock 15+ words. Hebrew's root system is its superpower, and we're the only platform that visualizes it.",
    },
    {
      icon: Brain,
      title: 'All 7 Binyanim',
      desc: "Duolingo doesn't teach them. Most apps ignore them. The 7 verb patterns ARE Hebrew. We drill every single one.",
    },
    {
      icon: MessageSquare,
      title: 'Real Conversation Scenarios',
      desc: "At the shuk, at the doctor, at the airport, arguing about politics at a Shabbat dinner. Not textbook dialogues — real Israeli situations.",
    },
    {
      icon: Music,
      title: 'Dialect Choice',
      desc: "Modern Israeli? Sephardic liturgical? Ashkenazi traditional? Choose your pronunciation track and stay consistent.",
    },
    {
      icon: Globe,
      title: 'Bridge to Biblical Hebrew',
      desc: "Same roots, same structure, different eras. Your Modern Hebrew unlocks Biblical reading — and vice versa. We show the connections.",
    },
  ],
  // Testimonial
  testimonial: {
    text: "I used Duolingo Hebrew for a year and couldn't hold a conversation. After two months here I ordered food in Hebrew on a trip to Tel Aviv and the waiter didn't switch to English.",
    name: 'Ana F.',
    location: 'France',
  },
};

export default function LanguagePage() {
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

      {/* Unique features for this language */}
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
            "{c.testimonial.text}"
          </p>
          <p className="text-[#CFBA8C] font-semibold">{c.testimonial.name} — {c.testimonial.location}</p>
        </div>
      </section>

      {/* Cross-sell other languages */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-serif text-[#001B4D] mb-4">One root, many branches</h2>
          <p className="text-[#4a4a4a] mb-8">
            Modern Hebrew shares roots with Biblical Hebrew and Aramaic. 
            Learning one deepens your understanding of the others.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/biblical-hebrew" className="px-5 py-2.5 border border-[#e5e2db] hover:border-[#001B4D] text-sm font-semibold text-[#001B4D] transition">
              Biblical Hebrew →
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
            Start learning {c.language} today.
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
