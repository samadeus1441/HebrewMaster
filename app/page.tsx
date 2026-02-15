'use client';

import Link from 'next/link';
import { BookOpen, Brain, ChevronRight, Globe, Languages, MessageSquare, Music, Search, Shield, Star, Users, Zap } from 'lucide-react';

const painPoints = [
  {
    emoji: '📱',
    text: "You did 200 days on Duolingo and still can't conjugate a verb",
  },
  {
    emoji: '😶',
    text: "Your family speaks Hebrew at dinner and you just smile and nod",
  },
  {
    emoji: '📖',
    text: "You follow the Siddur every week but don't understand what you're saying",
  },
  {
    emoji: '💌',
    text: "Your grandmother's Yiddish letters sit in a drawer because you can't read them",
  },
];

const transformations = [
  {
    name: 'Nikolay',
    before: "Could understand his Israeli wife but couldn't respond",
    after: "His wife says he finally sounds like a real person, not a textbook",
    weeks: '12 weeks',
    language: 'Modern Hebrew',
  },
  {
    name: 'Jean-Noël',
    before: "Read from the Torah phonetically for 20 years without comprehension",
    after: "Read last Shabbat's Torah portion and understood every word",
    weeks: '16 weeks',
    language: 'Biblical Hebrew',
  },
  {
    name: 'Rachel K.',
    before: "Grandmother's Yiddish letters sitting unread in a drawer",
    after: "Cried the first time she understood a full paragraph",
    weeks: '10 weeks',
    language: 'Yiddish',
  },
];

const languages = [
  {
    name: 'Modern Hebrew',
    nameHe: 'עברית',
    desc: 'Speak with family, navigate Israel, read the news.',
    href: '/hebrew',
    emoji: '🗣️',
    learners: 'Largest demand',
  },
  {
    name: 'Biblical Hebrew',
    nameHe: 'עברית מקראית',
    desc: 'Read Torah, Prophets, and Writings in the original.',
    href: '/biblical-hebrew',
    emoji: '📜',
    learners: 'Seminary & synagogue',
  },
  {
    name: 'Yiddish',
    nameHe: 'ייִדיש',
    desc: 'Reconnect with heritage. Dialect-aware instruction.',
    href: '/yiddish',
    emoji: '🕎',
    learners: 'Only 3 tutors worldwide',
  },
  {
    name: 'Aramaic',
    nameHe: 'ארמית',
    desc: 'Unlock Talmud, Zohar, and the language Jesus spoke.',
    href: '/aramaic',
    emoji: '🏛️',
    learners: 'Scholars & seekers',
  },
];

const features = [
  {
    icon: Zap,
    name: 'Nikud Toggle',
    desc: 'Fade vowels gradually as you build reading confidence.',
    only: true,
  },
  {
    icon: Search,
    name: 'Root Explorer',
    desc: 'See the family tree inside every Hebrew word.',
    only: true,
  },
  {
    icon: Brain,
    name: 'Binyanim Drills',
    desc: 'All 7 verb patterns. The thing Duolingo ignores.',
    only: true,
  },
  {
    icon: MessageSquare,
    name: 'Lesson-Fed Flashcards',
    desc: 'SRS cards generated from your actual tutoring sessions.',
    only: true,
  },
  {
    icon: Music,
    name: 'Dialect-Specific Audio',
    desc: 'Choose your pronunciation tradition. Stay consistent.',
    only: false,
  },
  {
    icon: BookOpen,
    name: 'Color-Coded Reading',
    desc: 'Words colored by how well you know them.',
    only: false,
  },
];

export default function HomePage() {
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

      {/* ═══════════ HERO ═══════════ */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[#9BAB16] mb-6">
            Modern Hebrew · Biblical Hebrew · Yiddish · Aramaic
          </p>
          <h1 className="text-4xl md:text-7xl font-serif text-[#001B4D] mb-6 leading-[1.1]">
            Read the texts your<br />grandparents read.
          </h1>
          <p className="text-xl text-[#4a4a4a] max-w-2xl mx-auto mb-10">
            The only platform that bridges four sacred languages — with tools built 
            by a native Jerusalemite, not a Silicon Valley team with a dictionary.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#001B4D] text-white font-bold text-lg hover:bg-[#002b7a] transition shadow-2xl">
              Start My Free Trial <ChevronRight className="w-5 h-5" />
            </Link>
            <Link href="/product" className="inline-flex items-center justify-center gap-2 px-10 py-5 border-2 border-[#001B4D] text-[#001B4D] font-bold text-lg hover:bg-[#001B4D]/5 transition">
              See How It Works
            </Link>
          </div>
          <p className="text-sm text-[#6b7280] mt-4">
            10-day free trial · No credit card · Every feature unlocked
          </p>
        </div>
      </section>

      {/* ═══════════ PAIN POINTS ═══════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-serif text-[#001B4D] text-center mb-10">
            Sound familiar?
          </h2>
          <div className="space-y-3">
            {painPoints.map((p, i) => (
              <div key={i} className="flex items-center gap-4 bg-[#FAFAF8] border border-[#e5e2db] p-5">
                <span className="text-2xl">{p.emoji}</span>
                <p className="text-[#4a4a4a]">{p.text}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-10 text-lg font-serif text-[#001B4D]">
            These are the problems we built this platform to solve.
          </p>
        </div>
      </section>

      {/* ═══════════ TRANSFORMATIONS (Social Proof) ═══════════ */}
      <section className="py-20 bg-[#FAFAF8]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-serif text-[#001B4D] text-center mb-4">
            Real students. Real results.
          </h2>
          <p className="text-center text-[#4a4a4a] mb-12">Not engagement metrics — actual life changes.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {transformations.map(t => (
              <div key={t.name} className="bg-white border border-[#e5e2db] p-7 flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9BAB16] mb-4">{t.language}</span>
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-3">
                    <span className="text-red-400 font-bold text-sm mt-0.5">Before:</span>
                    <p className="text-sm text-[#4a4a4a]">{t.before}</p>
                  </div>
                  <div className="flex items-start gap-2 mb-4">
                    <span className="text-[#9BAB16] font-bold text-sm mt-0.5">After:</span>
                    <p className="text-sm text-[#001B4D] font-semibold">{t.after}</p>
                  </div>
                </div>
                <div className="border-t border-[#f0ede6] pt-4 flex justify-between items-center">
                  <span className="font-bold text-[#001B4D]">{t.name}</span>
                  <span className="text-xs text-[#6b7280]">{t.weeks}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/testimonials" className="text-sm font-semibold text-[#001B4D] hover:underline">
              Read more student stories →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ LANGUAGES ═══════════ */}
      <section className="py-20 bg-[#001B4D]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif text-white text-center mb-4">
            Four languages. One platform.
          </h2>
          <p className="text-center text-white/60 mb-12 max-w-2xl mx-auto">
            They share roots, share history, share a script. No other platform bridges all four.
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            {languages.map(lang => (
              <Link
                key={lang.name}
                href={lang.href}
                className="group bg-white/5 border border-white/10 p-7 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{lang.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white group-hover:text-[#CFBA8C] transition">{lang.name}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9BAB16]">{lang.learners}</span>
                    </div>
                    <p className="text-lg text-[#CFBA8C] font-hebrew" dir="rtl">{lang.nameHe}</p>
                    <p className="text-sm text-white/60 mt-2">{lang.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-serif text-[#001B4D] text-center mb-4">Tools that actually work</h2>
          <p className="text-center text-[#4a4a4a] mb-12">Not just flashcards. A complete language learning system.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(f => (
              <div key={f.name} className="border border-[#e5e2db] p-6 bg-[#FAFAF8]">
                <div className="flex items-center justify-between mb-3">
                  <f.icon className="w-7 h-7 text-[#001B4D]" strokeWidth={1.5} />
                  {f.only && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#CFBA8C] bg-[#001B4D] px-2 py-0.5">Only here</span>
                  )}
                </div>
                <h3 className="font-bold text-[#001B4D] mb-2">{f.name}</h3>
                <p className="text-sm text-[#4a4a4a] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/product" className="inline-flex items-center gap-1 text-sm font-semibold text-[#001B4D] hover:underline">
              See all features <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ TIME OBJECTION ═══════════ */}
      <section className="py-16 bg-[#FAFAF8]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif text-[#001B4D] mb-6">
            "I don't have time."
          </h2>
          <p className="text-lg text-[#4a4a4a] leading-relaxed mb-6">
            15 minutes a day. That's all it takes. The platform breaks everything into 
            bite-sized sessions you can do on your commute, during lunch, or before bed.
          </p>
          <div className="grid grid-cols-3 gap-6 mt-10">
            <div className="text-center">
              <div className="text-3xl font-serif text-[#001B4D] font-bold">15</div>
              <div className="text-xs text-[#6b7280] mt-1">minutes per day</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-serif text-[#001B4D] font-bold">2-4</div>
              <div className="text-xs text-[#6b7280] mt-1">weeks to notice</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-serif text-[#001B4D] font-bold">80%</div>
              <div className="text-xs text-[#6b7280] mt-1">retention with SRS</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ GUARANTEE ═══════════ */}
      <section className="py-20 bg-[#001B4D] text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Shield className="w-12 h-12 mx-auto mb-6 text-[#CFBA8C]" strokeWidth={1.5} />
          <h2 className="text-3xl md:text-4xl font-serif mb-4">
            We want you to delete us.
          </h2>
          <p className="text-lg text-white/70 leading-relaxed mb-6">
            Think of us like a dating app — our goal isn't to keep you swiping forever. 
            Our goal is to get you fluent enough that you don't need us anymore.
          </p>
          <p className="text-lg text-white/70 leading-relaxed">
            If we haven't helped you get closer to that goal, you shouldn't pay.
            <strong className="text-[#CFBA8C]"> Full refund, any time, no questions asked.</strong>
          </p>
        </div>
      </section>

      {/* ═══════════ PRICING TEASER ═══════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif text-[#001B4D] mb-6">Simple, honest pricing</h2>
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="border border-[#e5e2db] p-5">
              <div className="text-2xl font-serif font-bold text-[#001B4D]">Free</div>
              <div className="text-sm text-[#6b7280] mt-1">Flashcards</div>
            </div>
            <div className="border-2 border-[#001B4D] p-5 bg-[#FAFAF8]">
              <div className="text-2xl font-serif font-bold text-[#001B4D]">$9<span className="text-sm font-normal">/mo</span></div>
              <div className="text-sm text-[#6b7280] mt-1">Full platform</div>
            </div>
            <div className="border border-[#e5e2db] p-5">
              <div className="text-2xl font-serif font-bold text-[#001B4D]">$30<span className="text-sm font-normal">/mo</span></div>
              <div className="text-sm text-[#6b7280] mt-1">All 4 languages</div>
            </div>
          </div>
          <Link href="/pricing" className="text-sm font-semibold text-[#001B4D] hover:underline">
            See full pricing & plans →
          </Link>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="py-24 bg-[#F5F0E8]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-6xl font-serif text-[#001B4D] mb-6 leading-tight">
            Your language is waiting.
          </h2>
          <p className="text-xl text-[#4a4a4a] mb-10">
            Start learning in 5 minutes. No credit card. No commitment.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-14 py-6 bg-[#001B4D] text-white font-bold text-xl hover:bg-[#002b7a] transition shadow-2xl">
            Begin Your Free Trial <ChevronRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="py-12 bg-[#001B4D] text-white/60">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🇮🇱</span>
                <span className="font-serif text-lg text-white">The Jerusalem Bridge</span>
              </div>
              <p className="text-xs leading-relaxed">
                The only platform bridging Modern Hebrew, Biblical Hebrew, Yiddish, and Aramaic — built by a native Jerusalemite.
              </p>
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
