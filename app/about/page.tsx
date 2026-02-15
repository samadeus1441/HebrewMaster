'use client';

import Link from 'next/link';
import { BookOpen, Globe, Heart, MapPin, Star, Users } from 'lucide-react';

export default function AboutPage() {
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
            <Link href="/about" className="text-[#001B4D] font-semibold">About</Link>
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
      <section className="pt-32 pb-16 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-serif text-[#001B4D] mb-6">
          Built from Jerusalem.<br />For the world.
        </h1>
        <p className="text-lg text-[#4a4a4a] max-w-2xl mx-auto">
          The Jerusalem Bridge exists because the languages that shaped Jewish history, 
          faith, and identity deserve better than what the language-learning industry has given them.
        </p>
      </section>

      {/* Founder Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-10 items-start">
            {/* Photo placeholder */}
            <div className="md:col-span-2">
              <div className="bg-gradient-to-br from-[#001B4D]/5 to-[#CFBA8C]/20 border-2 border-dashed border-[#e5e2db] aspect-[3/4] flex items-center justify-center">
                <div className="text-center">
                  <span className="text-5xl">📸</span>
                  <p className="text-xs text-[#6b7280] mt-3 font-semibold">YOUR PHOTO HERE</p>
                  <p className="text-xs text-[#9BAB16] mt-1">Replace with a real photo</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="font-serif font-bold text-[#001B4D] text-lg">Jack</p>
                <p className="text-sm text-[#4a4a4a]">Founder & Teacher</p>
                <p className="text-sm text-[#6b7280] flex items-center justify-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> Jerusalem, Israel
                </p>
              </div>
            </div>

            {/* Story */}
            <div className="md:col-span-3 space-y-5 text-[#4a4a4a] leading-relaxed">
              <h2 className="text-2xl md:text-3xl font-serif text-[#001B4D]">The story</h2>
              
              <p>
                I grew up in the Old Yishuv — the pre-state Jewish community of Jerusalem. 
                My family, the Schlesingers, has been in Jerusalem for generations. I grew up 
                hearing Hebrew in every register: the formal Hebrew of Torah study, the street Hebrew 
                of Machane Yehuda, the liturgical Hebrew of Shabbat morning, and the Yiddish my 
                grandparents spoke when they didn't want the kids to understand.
              </p>
              
              <p>
                I started teaching Hebrew and Yiddish because I kept meeting people who wanted 
                desperately to connect — with family in Israel, with texts they'd been hearing 
                their whole lives, with a part of their identity they felt slipping away — and every 
                tool available to them was inadequate.
              </p>

              <p>
                Duolingo's Hebrew course doesn't teach binyanim — the seven verb patterns that make 
                the language actually make sense. Their Yiddish course confused dialects so badly that 
                native speakers couldn't recognize it. The apps that do exist treat Biblical Hebrew 
                and Modern Hebrew as completely separate languages when they're deeply interconnected. 
                And nobody — nobody — teaches Yiddish with dialect awareness.
              </p>

              <p>
                I built The Jerusalem Bridge because I live at the intersection of these languages. 
                Modern Hebrew is my daily life. Biblical Hebrew is my Torah study. Yiddish is my 
                family heritage. Aramaic is my Talmud learning. I'm not a tech company that hired 
                a Hebrew consultant — I'm the person who grew up speaking, reading, praying, and 
                arguing in these languages.
              </p>

              <p>
                Every feature on this platform comes from a real teaching moment. The Nikud Toggle 
                exists because I watched student after student freeze when vowels disappeared. 
                The Root Explorer exists because I saw how a single shoresh insight could unlock 
                a month's worth of vocabulary. The lesson-fed flashcards exist because I noticed 
                my students forgot what we covered together within 48 hours — unless they reviewed.
              </p>

              <p className="font-semibold text-[#001B4D]">
                This isn't a language app. It's a bridge — between you and the texts, 
                the people, and the places these languages connect you to.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-16 bg-[#FAFAF8]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-serif text-[#001B4D] text-center mb-10">Background</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Globe,
                title: 'Native Languages',
                items: ['Hebrew (native)', 'Yiddish (heritage)', 'French', 'English', 'German'],
              },
              {
                icon: BookOpen,
                title: 'Teaching Experience',
                items: ['Preply (top-rated tutor)', 'italki (verified)', 'Private students worldwide', 'Seminary & synagogue groups'],
              },
              {
                icon: MapPin,
                title: 'Jerusalem Heritage',
                items: ['Old Yishuv family (Schlesinger)', 'Born and raised in Jerusalem', 'Lives at the intersection of all 4 languages', 'Daily engagement with Biblical & Modern Hebrew'],
              },
            ].map(cred => (
              <div key={cred.title} className="bg-white border border-[#e5e2db] p-6">
                <cred.icon className="w-8 h-8 text-[#001B4D] mb-4" strokeWidth={1.5} />
                <h3 className="font-bold text-[#001B4D] mb-3">{cred.title}</h3>
                <ul className="space-y-2">
                  {cred.items.map(item => (
                    <li key={item} className="text-sm text-[#4a4a4a] flex items-start gap-2">
                      <span className="text-[#9BAB16] mt-1">·</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-[#001B4D] text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Heart className="w-10 h-10 mx-auto mb-6 text-[#CFBA8C]" strokeWidth={1.5} />
          <h2 className="text-3xl md:text-4xl font-serif mb-6">The mission</h2>
          <p className="text-lg text-white/70 leading-relaxed mb-6">
            To make Hebrew, Yiddish, and Aramaic learning as accessible and effective as 
            learning Spanish or French — while honoring the depth, culture, and sacredness 
            that make these languages unique.
          </p>
          <p className="text-lg text-white/70 leading-relaxed">
            Every person who wants to read their grandmother's letters, follow Torah 
            in the original, or say the Shema and understand every word — they deserve 
            tools as good as what the mainstream languages get. Better, even. Because 
            these languages carry something that no app can fully capture — but that the 
            right tools can help you get closer to.
          </p>
        </div>
      </section>

      {/* What makes us different */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-serif text-[#001B4D] text-center mb-10">Why here?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Real person, not a team of contractors',
                text: "I teach every lesson, record every audio, review every flashcard. Your tutor and your platform builder are the same person.",
              },
              {
                title: "Jerusalem isn't a brand — it's where I live",
                text: "I walk past the Old City walls every day. This isn't a theme — it's the actual cultural context your learning is rooted in.",
              },
              {
                title: '4 languages that most treat as 2 or 1',
                text: "Other platforms separate Biblical and Modern Hebrew. We show you the bridge between them — because there is one, and it makes you better at both.",
              },
              {
                title: 'Your lessons feed your practice',
                text: "No other platform generates personalized flashcards from your actual tutoring sessions. Your practice material is always exactly what you need.",
              },
            ].map(item => (
              <div key={item.title} className="flex gap-4">
                <Star className="w-5 h-5 text-[#CFBA8C] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-[#001B4D] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#4a4a4a] leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#F5F0E8]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-[#001B4D] mb-4">
            Join me.
          </h2>
          <p className="text-lg text-[#4a4a4a] mb-8">
            Start your free trial. See the product. Then decide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="px-10 py-4 bg-[#001B4D] text-white font-bold hover:bg-[#002b7a] transition shadow-xl">
              Start Free Trial
            </Link>
            <Link href="/product" className="px-10 py-4 border-2 border-[#001B4D] text-[#001B4D] font-bold hover:bg-[#001B4D]/5 transition">
              See the Product
            </Link>
          </div>
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
