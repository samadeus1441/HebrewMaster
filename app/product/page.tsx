'use client';

import Link from 'next/link';
import { BookOpen, Brain, Ear, Languages, MessageSquare, Music, Pen, Search, Sparkles, Video, Zap } from 'lucide-react';

const featureSections = [
  {
    id: 'curriculum',
    badge: 'Structured Curriculum',
    title: 'A real learning path — not just a pile of tools',
    description: 'Each language has a guided journey from Aleph-Bet through fluent reading. Lessons unlock progressively, building on what you actually know.',
    features: [
      {
        icon: Video,
        name: 'Video Lessons',
        desc: 'Short explainers on grammar, pronunciation, and cultural context — recorded by a native Jerusalemite, not a textbook.',
      },
      {
        icon: Zap,
        name: 'Interactive Activities',
        desc: 'Vocabulary and grammar drills that incorporate reading, listening, typing, and speaking. Not just multiple choice.',
      },
      {
        icon: BookOpen,
        name: 'Lesson Guides',
        desc: 'Downloadable PDFs for every lesson — a built-in textbook you can print, annotate, and review offline.',
      },
    ],
    screenshotAlt: 'Screenshot of the lesson curriculum interface',
    screenshotPlaceholder: '🎓 LESSON CURRICULUM SCREENSHOT',
    direction: 'ltr',
  },
  {
    id: 'practice',
    badge: 'Practice, Practice, Practice',
    title: 'Drill what you actually struggle with',
    description: 'Not generic exercises — drills built from YOUR lessons, YOUR mistakes, YOUR vocabulary gaps.',
    features: [
      {
        icon: Brain,
        name: 'Graded Reader',
        desc: 'Reading texts matched to your level. Words color-coded by how well you know them — green, yellow, red. Click any word for instant dictionary.',
      },
      {
        icon: Pen,
        name: 'Binyanim & Conjugation Drills',
        desc: 'The 7 Hebrew verb patterns that every platform ignores. Practice paradigms in context — not rote chart memorization.',
      },
      {
        icon: Sparkles,
        name: 'Automated SRS Review',
        desc: 'Every day, the system generates personalized review using spaced repetition. Prioritizes newer material and words you struggle with.',
      },
    ],
    screenshotAlt: 'Screenshot of the practice drill interface',
    screenshotPlaceholder: '📝 PRACTICE DRILLS SCREENSHOT',
    direction: 'rtl',
  },
  {
    id: 'flashcards',
    badge: 'Super-Powered Flashcards',
    title: 'Cards from your actual lessons — not a generic deck',
    description: 'When you finish a tutoring session, the platform automatically generates flashcards from what was covered. Your review drills exactly what you learned.',
    features: [
      {
        icon: Sparkles,
        name: 'Lesson-Generated Decks',
        desc: 'AI extracts vocabulary, phrases, and grammar points from your actual tutoring transcripts and creates targeted flashcards.',
      },
      {
        icon: BookOpen,
        name: 'Curriculum Decks',
        desc: 'Pre-built decks aligned with each lesson stage. Organized by topic, frequency, and root families.',
      },
      {
        icon: Search,
        name: 'Custom Decks',
        desc: 'Build decks from scratch — add words from reading, from conversation, from anywhere. Search our full dictionary.',
      },
    ],
    screenshotAlt: 'Screenshot of the flashcard system',
    screenshotPlaceholder: '🃏 FLASHCARD SYSTEM SCREENSHOT',
    direction: 'ltr',
  },
  {
    id: 'reading',
    badge: 'Interactive Reading',
    title: 'The Nikud Toggle — solve the #1 Hebrew pain point',
    description: 'Hebrew learners all hit the same wall: transitioning from voweled to unvoweled text. Our Nikud Toggle lets you fade the training wheels gradually.',
    features: [
      {
        icon: BookOpen,
        name: 'Nikud Toggle Reader',
        desc: 'Read any text with full vowels, partial vowels, or no vowels. Adjust in real-time as you build confidence.',
      },
      {
        icon: Search,
        name: 'Built-in Dictionary',
        desc: 'Click any word for instant parsing — root, binyan, morphology, translation, and audio pronunciation.',
      },
      {
        icon: Languages,
        name: 'Color-Coded Vocabulary',
        desc: "Words you're learning are yellow. Unknown words are red. See your progress on every page.",
      },
    ],
    screenshotAlt: 'Screenshot of the Nikud Toggle reader',
    screenshotPlaceholder: '📖 NIKUD TOGGLE SCREENSHOT',
    direction: 'rtl',
  },
  {
    id: 'roots',
    badge: 'Root Explorer',
    title: 'See the family tree inside every Hebrew word',
    description: 'Hebrew and Yiddish are built on root systems. Understanding one root unlocks dozens of related words. No other platform visualizes this.',
    features: [
      {
        icon: Search,
        name: 'Shoresh Family Trees',
        desc: 'Enter any root and see every word built from it — nouns, verbs, adjectives — with meanings, examples, and audio.',
      },
      {
        icon: Brain,
        name: 'Root-Based Clustering',
        desc: 'Learn ס-פ-ר (s-f-r) once and unlock: sefer (book), sofer (scribe), sifriya (library), lesaper (to tell), mispar (number).',
      },
      {
        icon: Sparkles,
        name: 'Cross-Language Roots',
        desc: 'See how the same root appears in Modern Hebrew, Biblical Hebrew, Aramaic, and Yiddish. One root, four languages.',
      },
    ],
    screenshotAlt: 'Screenshot of the Root Explorer',
    screenshotPlaceholder: '🌳 ROOT EXPLORER SCREENSHOT',
    direction: 'ltr',
  },
  {
    id: 'conversation',
    badge: 'Real Conversation',
    title: 'Practice talking — not just translating',
    description: 'Role-play real scenarios in your target language. Ordering food in Jerusalem, calling your Israeli cousins, reading from the Siddur with the congregation.',
    features: [
      {
        icon: MessageSquare,
        name: 'Conversation Scenarios',
        desc: 'Practice dialogues built from real situations — the shuk, the airport, Shabbat dinner, a doctor\'s visit, a parent-teacher conference.',
      },
      {
        icon: Ear,
        name: 'Listening Comprehension',
        desc: 'Audio clips at adjustable speed. Hear native pronunciation with speed control — 0.5x to 1.5x without pitch distortion.',
      },
      {
        icon: Music,
        name: 'Dialect-Specific Audio',
        desc: 'Choose Ashkenazi, Sephardic, or Modern Israeli pronunciation. For Yiddish: Lithuanian, Polish, or Hasidic dialects.',
      },
    ],
    screenshotAlt: 'Screenshot of the conversation practice',
    screenshotPlaceholder: '💬 CONVERSATION PRACTICE SCREENSHOT',
    direction: 'rtl',
  },
];

const languages = [
  {
    name: 'Modern Hebrew',
    nameHe: 'עברית',
    desc: 'Speak with family, navigate Israel, read the news.',
    href: '/hebrew',
    emoji: '🗣️',
  },
  {
    name: 'Biblical Hebrew',
    nameHe: 'עברית מקראית',
    desc: 'Read Torah, Prophets, and Writings in the original.',
    href: '/biblical-hebrew',
    emoji: '📜',
  },
  {
    name: 'Yiddish',
    nameHe: 'ייִדיש',
    desc: 'Connect with heritage. Only 3 tutors worldwide — we are one of them.',
    href: '/yiddish',
    emoji: '🕎',
  },
  {
    name: 'Aramaic',
    nameHe: 'ארמית',
    desc: 'Unlock Talmud, Zohar, and the language Jesus spoke.',
    href: '/aramaic',
    emoji: '🏛️',
  },
];

const stats = [
  { num: '4', label: 'Languages under one roof' },
  { num: '7', label: 'Binyanim — verb patterns no one else teaches' },
  { num: '3', label: 'Yiddish tutors worldwide (we\'re one)' },
  { num: '24/7', label: 'Your platform never sleeps' },
];

export default function ProductPage() {
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
            <Link href="/product" className="text-[#001B4D] font-semibold">Product</Link>
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
      <section className="pt-32 pb-20 text-center px-6">
        <h1 className="text-4xl md:text-6xl font-serif text-[#001B4D] mb-6 max-w-4xl mx-auto leading-tight">
          Everything you need<br />all in one place
        </h1>
        <p className="text-lg text-[#4a4a4a] max-w-2xl mx-auto mb-10">
          A structured curriculum, personalized practice, interactive reading tools, 
          and flashcards generated from your actual lessons — for Modern Hebrew, Biblical Hebrew, Yiddish, and Aramaic.
        </p>
        <Link href="/signup" className="inline-flex items-center gap-2 px-10 py-4 bg-[#001B4D] text-white font-bold hover:bg-[#002b7a] transition shadow-2xl text-lg">
          Start My 10-Day Free Trial
        </Link>
        <p className="text-sm text-[#6b7280] mt-3">No credit card required.</p>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#001B4D] py-8">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-serif text-[#CFBA8C] font-bold">{s.num}</div>
              <div className="text-xs md:text-sm text-white/60 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Sections (alternating layout like Biblingo /overview) */}
      {featureSections.map((section, idx) => (
        <section
          key={section.id}
          id={section.id}
          className={`py-20 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFAF8]'}`}
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className={`grid md:grid-cols-2 gap-12 items-center ${section.direction === 'rtl' ? 'md:flex-row-reverse' : ''}`}>
              {/* Text Column */}
              <div className={section.direction === 'rtl' ? 'md:order-2' : ''}>
                <span className="text-xs font-bold uppercase tracking-widest text-[#9BAB16] mb-3 block">{section.badge}</span>
                <h2 className="text-3xl md:text-4xl font-serif text-[#001B4D] mb-4 leading-tight">{section.title}</h2>
                <p className="text-[#4a4a4a] leading-relaxed mb-8">{section.description}</p>
                <div className="space-y-6">
                  {section.features.map(f => (
                    <div key={f.name} className="flex gap-4">
                      <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-[#001B4D]/5 rounded">
                        <f.icon className="w-5 h-5 text-[#001B4D]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#001B4D] mb-1">{f.name}</h3>
                        <p className="text-sm text-[#4a4a4a] leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Screenshot Column */}
              <div className={section.direction === 'rtl' ? 'md:order-1' : ''}>
                <div className="bg-gradient-to-br from-[#001B4D]/5 to-[#CFBA8C]/10 border-2 border-dashed border-[#e5e2db] aspect-[4/3] flex items-center justify-center text-center p-8">
                  <div>
                    <div className="text-4xl mb-3">{section.screenshotPlaceholder.split(' ')[0]}</div>
                    <p className="text-sm text-[#6b7280] font-semibold">
                      {section.screenshotPlaceholder.replace(/^[^\s]+\s/, '')}
                    </p>
                    <p className="text-xs text-[#9BAB16] mt-2">
                      Replace with actual screenshot from your dashboard
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Languages Section */}
      <section className="py-20 bg-[#001B4D]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif text-white text-center mb-4">Four languages. One platform.</h2>
          <p className="text-center text-white/60 mb-12 max-w-2xl mx-auto">
            No other platform bridges all four. They're interconnected — learning one deepens your understanding of the others.
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
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#CFBA8C] transition">
                      {lang.name}
                    </h3>
                    <p className="text-lg text-[#CFBA8C] font-hebrew" dir="rtl">{lang.nameHe}</p>
                    <p className="text-sm text-white/60 mt-2">{lang.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Only Here */}
      <section className="py-20 bg-[#F5F0E8]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-[#001B4D] mb-4">Things you'll only find here</h2>
          <p className="text-[#4a4a4a] mb-12 max-w-2xl mx-auto">
            Not marketing copy — actual features that don't exist anywhere else.
          </p>
          <div className="grid md:grid-cols-2 gap-5 text-left">
            {[
              {
                emoji: '🔤',
                title: 'Nikud Toggle',
                desc: 'Gradually remove vowels from any text as you build reading confidence. The #1 Hebrew learning pain point, solved.',
              },
              {
                emoji: '🌳',
                title: 'Root Explorer',
                desc: 'Visual family trees showing how one Shoresh generates dozens of words across four languages.',
              },
              {
                emoji: '🎙️',
                title: 'Lesson-Fed Flashcards',
                desc: 'Your tutoring session → automatic transcript analysis → personalized flashcards. No other platform does this.',
              },
              {
                emoji: '🗣️',
                title: 'Dialect-Specific',
                desc: 'Ashkenazi, Sephardic, Modern Israeli for Hebrew. Lithuanian, Polish, Hasidic for Yiddish. You choose.',
              },
              {
                emoji: '🏛️',
                title: '4 Languages, 1 System',
                desc: 'Modern Hebrew, Biblical Hebrew, Yiddish, Aramaic — all sharing root systems and cultural connections.',
              },
              {
                emoji: '🇮🇱',
                title: 'Native Jerusalemite',
                desc: 'Built by someone who grew up at the intersection of all four languages — not by a Silicon Valley team with a dictionary.',
              },
            ].map(f => (
              <div key={f.title} className="bg-white border border-[#e5e2db] p-6">
                <span className="text-2xl">{f.emoji}</span>
                <h3 className="font-bold text-[#001B4D] mt-3 mb-2">{f.title}</h3>
                <p className="text-sm text-[#4a4a4a] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-serif text-[#001B4D] text-center mb-12">Common Questions</h2>
          {[
            {
              q: 'Do I need a tutor to use this?',
              a: "No — the platform works as a standalone learning tool. But if you also study with a tutor, your lesson content automatically feeds into your practice, making both dramatically more effective.",
            },
            {
              q: 'How long until I can read without vowels?',
              a: "With the Nikud Toggle, most students start reading partially unvoweled text within 4-6 weeks of consistent practice. The toggle lets you control exactly how much support you need at each stage.",
            },
            {
              q: "I tried Duolingo's Hebrew — how is this different?",
              a: "Duolingo doesn't teach binyanim (the 7 verb patterns that make Hebrew actually make sense), has no nikud toggle, no root explorer, and no way to personalize to your level. We also teach Biblical Hebrew, Yiddish, and Aramaic — which Duolingo doesn't offer.",
            },
            {
              q: 'Can I use this on my phone?',
              a: "The web platform works fully on mobile browsers. A native app is on our roadmap.",
            },
          ].map((faq, i) => (
            <details key={i} className="group border-b border-[#e5e2db] py-5">
              <summary className="cursor-pointer font-semibold text-[#001B4D] text-sm list-none flex justify-between items-center">
                {faq.q}
                <span className="text-[#CFBA8C] group-open:rotate-45 transition-transform text-xl">+</span>
              </summary>
              <p className="text-sm text-[#4a4a4a] leading-relaxed mt-3">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#F5F0E8]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-serif text-[#001B4D] mb-4">Ready to start?</h2>
          <p className="text-lg text-[#4a4a4a] mb-8">10-day free trial. Every feature. No credit card.</p>
          <Link href="/signup" className="inline-block px-12 py-5 bg-[#001B4D] text-white font-bold text-lg hover:bg-[#002b7a] transition shadow-2xl">
            Begin Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer (same as pricing) */}
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