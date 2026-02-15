'use client';

import Link from 'next/link';
import { Star, Quote, ChevronRight } from 'lucide-react';

const testimonials = [
  // Modern Hebrew
  {
    name: 'Nikolay',
    location: 'Russia',
    language: 'Modern Hebrew',
    story: "I came to Jack thinking I was a complete beginner. He figured out in the first session that I already knew more Hebrew than I thought — 15 years of hearing it from my Israeli wife had actually stuck. He just had to unlock it. The platform flashcards from our actual conversations drill exactly the words I use with my family. Three months in and my wife says I finally sound like a real person, not a textbook.",
    tags: ['Family Connection', 'Modern Hebrew'],
  },
  {
    name: 'Ana F.',
    location: 'France',
    story: "Super patient when I mess up pronunciation. The platform remembers exactly where I struggled in lessons and drills me on those specific words. I used Duolingo Hebrew for a year and couldn't hold a conversation. After two months here I ordered food in Hebrew on a trip to Tel Aviv and the waiter didn't switch to English.",
    language: 'Modern Hebrew',
    tags: ['From Duolingo', 'Travel', 'Modern Hebrew'],
  },
  {
    name: 'Patrice',
    location: 'France',
    story: "I needed conversational Hebrew for my business trips to Israel. The conversation scenarios in the platform are exactly what I face in meetings. Jack created custom scenarios based on my actual work situations — negotiating terms, scheduling follow-ups, small talk over coffee. My Israeli partners now joke that I sound like I grew up in Raanana.",
    language: 'Modern Hebrew',
    tags: ['Business', 'Conversation', 'Modern Hebrew'],
  },
  // Biblical Hebrew
  {
    name: 'Jean-Noël',
    location: 'France',
    story: "I've been going to synagogue for 20 years and following along in the Siddur without really understanding what I was saying. The bridge from my prayer book Hebrew to actual comprehension was exactly what I needed. The Nikud Toggle is genius — it let me gradually wean off the vowels until I could read the Torah portion without training wheels. Last Shabbat I read from the Torah and understood every word. My rabbi noticed.",
    language: 'Biblical Hebrew',
    tags: ['Synagogue', 'Prayer', 'Biblical Hebrew'],
  },
  {
    name: 'David M.',
    location: 'United States',
    story: "Seminary student here. I'd done two semesters of Biblical Hebrew in a classroom and could barely parse a verse. The Root Explorer changed everything — once I saw how one root generates 15 different words, the whole language clicked. I can now prep a sermon in Hebrew in the time it used to take me to look up three words.",
    language: 'Biblical Hebrew',
    tags: ['Seminary', 'Torah Study', 'Biblical Hebrew'],
  },
  // Yiddish
  {
    name: 'Rachel K.',
    location: 'United States',
    story: "My grandmother spoke Yiddish but my parents didn't pass it on. I tried every resource I could find — the Duolingo course was a mess of mixed dialects, and the only other options were academic textbooks from the 1970s. Jack is literally one of three Yiddish tutors on the entire internet. He knows the difference between Lithuanian, Polish, and Hasidic Yiddish and teaches them properly. I can now read my grandmother's letters. I cried the first time I understood a full paragraph.",
    language: 'Yiddish',
    tags: ['Heritage', 'Family', 'Yiddish'],
  },
  // Platform-specific
  {
    name: 'Sarah L.',
    location: 'Canada',
    story: "The lesson-to-flashcard pipeline is what sold me. After every session with Jack, the platform automatically creates cards from exactly what we covered. No more forgetting everything by Thursday. My retention went from maybe 30% to closer to 80% once I started doing the daily reviews. It's like having a personal assistant that was listening in on my lesson.",
    language: 'Modern Hebrew',
    tags: ['Platform', 'Flashcards', 'Retention'],
  },
  {
    name: 'Thomas B.',
    location: 'Germany',
    story: "As a theologian studying Biblical Hebrew and Aramaic, I needed a platform that treated these languages seriously — not as a game. The conjugation drills with all 7 binyanim patterns, the Root Explorer showing cross-language connections, and the ability to read actual Biblical texts with a built-in dictionary — this is what seminary should have been. The fact that one person built this from Jerusalem is remarkable.",
    language: 'Aramaic',
    tags: ['Academic', 'Aramaic', 'Biblical Hebrew'],
  },
];

const languages = ['All', 'Modern Hebrew', 'Biblical Hebrew', 'Yiddish', 'Aramaic'];

export default function TestimonialsPage() {
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
            <Link href="/testimonials" className="text-[#001B4D] font-semibold">Students</Link>
            <Link href="/login" className="text-[#001B4D] font-semibold hover:underline">Log In</Link>
            <Link href="/signup" className="px-5 py-2.5 bg-[#001B4D] text-white text-sm font-semibold hover:bg-[#002b7a] transition shadow-lg">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-serif text-[#001B4D] mb-4">Student Stories</h1>
        <p className="text-lg text-[#4a4a4a] max-w-2xl mx-auto">
          Real students. Real progress. From complete beginners to people 
          who can now read Torah, speak with family, and understand their heritage.
        </p>
      </section>

      {/* Highlight Quote */}
      <section className="pb-12 px-6">
        <div className="max-w-3xl mx-auto bg-[#001B4D] text-white p-10 text-center relative">
          <Quote className="w-8 h-8 text-[#CFBA8C] mx-auto mb-4" />
          <p className="text-xl md:text-2xl font-serif leading-relaxed mb-6 italic">
            I learned more in 3 months here than in a year of Duolingo and two semesters in a classroom.
          </p>
          <p className="text-[#CFBA8C] font-semibold">David M. — Seminary Student, USA</p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white border border-[#e5e2db] p-7 flex flex-col">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className="w-4 h-4 fill-[#9BAB16] text-[#9BAB16]" />
                  ))}
                </div>
                {/* Story */}
                <p className="text-sm text-[#4a4a4a] leading-relaxed flex-1 mb-6">
                  "{t.story}"
                </p>
                {/* Meta */}
                <div className="flex items-end justify-between border-t border-[#f0ede6] pt-4">
                  <div>
                    <p className="font-bold text-[#001B4D]">{t.name}</p>
                    <p className="text-sm text-[#6b7280]">{t.location}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    {t.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 bg-[#001B4D]/5 text-[#001B4D]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add yours */}
      <section className="py-16 bg-[#F5F0E8]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif text-[#001B4D] mb-4">Add your story</h2>
          <p className="text-[#4a4a4a] mb-8">
            Using The Jerusalem Bridge? We'd love to hear how it's going. 
            Share your experience and help others find their way to these languages.
          </p>
          <a
            href="mailto:samadeus@gmail.com?subject=My Jerusalem Bridge Story"
            className="inline-block px-8 py-4 border-2 border-[#001B4D] text-[#001B4D] font-bold hover:bg-[#001B4D]/5 transition"
          >
            Share Your Story
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-[#001B4D] mb-4">
            Ready to start your story?
          </h2>
          <p className="text-lg text-[#4a4a4a] mb-8">
            10-day free trial. Every feature unlocked. No credit card.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-10 py-4 bg-[#001B4D] text-white font-bold text-lg hover:bg-[#002b7a] transition shadow-2xl">
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
