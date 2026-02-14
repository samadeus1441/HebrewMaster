'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Check, ChevronRight, Shield, Zap, Crown, Star, MessageCircle } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Flashcards',
    nameHe: 'כרטיסיות',
    price: 0,
    period: 'forever',
    description: 'Build your vocabulary with spaced repetition — no credit card, no limits.',
    icon: '🃏',
    color: '#6b7280',
    features: [
      'Spaced repetition flashcards (FSRS algorithm)',
      'Basic vocabulary from all 4 languages',
      'Daily review reminders',
      'Streak tracking & XP levels',
      'Alphabet & Nikud reference guides',
    ],
    cta: 'Start Free',
    ctaStyle: 'outline' as const,
    badge: null,
  },
  {
    id: 'learner',
    name: 'Learner',
    nameHe: 'לומד',
    price: 9,
    priceAnnual: 7,
    period: '/month',
    description: 'Everything you need to develop real fluency — one language, full toolkit.',
    icon: '📚',
    color: '#001B4D',
    features: [
      'Everything in Flashcards, plus:',
      'One language of your choice',
      'Full lesson history & transcript search',
      'AI-generated flashcards from YOUR lessons',
      'Interactive Nikud Toggle reader',
      'Conjugation & Binyanim drills',
      'Root Explorer (Shoresh family trees)',
      'Graded reading with color-coded vocabulary',
      'Practice conversations & scenarios',
      'Homework assignments from your tutor',
      'Built-in dictionary with morphology',
    ],
    cta: 'Start 10-Day Free Trial',
    ctaStyle: 'primary' as const,
    badge: 'Most Popular',
  },
  {
    id: 'accelerator',
    name: 'Accelerator',
    nameHe: 'מאיץ',
    price: 30,
    priceAnnual: 24,
    period: '/month',
    description: 'All languages, premium tools, and a community of serious learners.',
    icon: '🚀',
    color: '#9BAB16',
    features: [
      'Everything in Learner, plus:',
      'ALL 4 languages included',
      'Unvocalized text tools for advanced reading',
      'Dialect-specific pronunciation (Ashkenazi, Sephardic, YIVO, Hasidic)',
      'Advanced error pattern analysis',
      'Weekly live group sessions',
      'Private learner community access',
      'Priority tutor scheduling',
      'Talmud & Zohar reading modules',
    ],
    cta: 'Start 10-Day Free Trial',
    ctaStyle: 'accent' as const,
    badge: 'Best Value',
  },
  {
    id: 'lifetime',
    name: 'Legacy',
    nameHe: 'מורשת',
    price: 750,
    period: 'one-time',
    description: 'Everything, forever. All current and future languages. No more payments.',
    icon: '👑',
    color: '#CFBA8C',
    features: [
      'Everything in Accelerator, forever',
      'All future languages (Ladino, Judeo-Arabic)',
      'Founding member status',
      'Direct line to the founder',
      'Early access to new features',
      'Name on the "Legacy Wall" of supporters',
    ],
    cta: 'Claim Lifetime Access',
    ctaStyle: 'gold' as const,
    badge: 'Limited',
  },
];

const faqs = [
  {
    q: 'Can I really try it free with no credit card?',
    a: 'Yes. Sign up, pick your language, and get 10 full days with every feature unlocked. No credit card, no commitment. If you love it, subscribe. If not, your Flashcards access stays free forever.',
  },
  {
    q: 'What if I want to switch languages later?',
    a: 'Learner plan subscribers can switch their single language anytime. Accelerator and Legacy members get all 4 languages automatically.',
  },
  {
    q: "I'm already a tutoring student — do I get a discount?",
    a: 'Current students who book sessions directly through Hebrew Master receive a complimentary Learner subscription as part of their lesson package. Ask your tutor for details.',
  },
  {
    q: "What's the refund policy?",
    a: "If you're not satisfied with your learning progress during any billing period, contact us for a full refund. No questions asked, no hoops to jump through. We're that confident.",
  },
  {
    q: 'How is this different from Duolingo or other apps?',
    a: "Duolingo doesn't teach binyanim, doesn't handle nikud transition, has no Yiddish dialect awareness, and can't personalize content to YOUR actual lessons with a real tutor. We were built specifically for the gaps they'll never fill.",
  },
  {
    q: 'Do I need a tutor to use this?',
    a: 'Not at all. The platform works perfectly as a standalone learning tool. But if you also study with a tutor (on Preply, italki, or direct), your lesson content automatically feeds into your practice — making both the tutoring and the platform dramatically more effective.',
  },
];

const testimonials = [
  {
    name: 'Nikolay',
    location: 'Russia',
    text: "He figured out in the first session that I already knew more Hebrew than I thought — then showed me how to unlock it. The flashcards from our actual conversations are exactly what I need.",
    plan: 'Learner',
  },
  {
    name: 'Jean-Noël',
    location: 'France',
    text: "The bridge from my Siddur Hebrew to understanding what I'm reading was exactly what I needed. The nikud toggle is genius — I went from fully voweled to reading without in 3 months.",
    plan: 'Accelerator',
  },
  {
    name: 'Ana F.',
    location: 'France',
    text: "Super patient when I mess up pronunciation. The practice platform remembers exactly where I struggled in lessons and drills me on those specific words. Nothing else does this.",
    plan: 'Learner',
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
            <Link href="/#languages" className="text-[#4a4a4a] hover:text-[#001B4D] transition">Languages</Link>
            <Link href="/#method" className="text-[#4a4a4a] hover:text-[#001B4D] transition">Method</Link>
            <Link href="/pricing" className="text-[#001B4D] font-semibold">Pricing</Link>
            <Link href="/login" className="text-[#001B4D] font-semibold hover:underline">Log In</Link>
            <Link href="/signup" className="px-5 py-2.5 bg-[#001B4D] text-white text-sm font-semibold hover:bg-[#002b7a] transition shadow-lg">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 text-center px-6">
        <h1 className="text-4xl md:text-6xl font-serif text-[#001B4D] mb-4">
          Invest in your roots.
        </h1>
        <p className="text-lg text-[#4a4a4a] max-w-2xl mx-auto mb-8">
          Start free. Upgrade when you're ready. Cancel anytime.<br />
          <strong className="text-[#001B4D]">Not satisfied? Full refund, no questions asked.</strong>
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center gap-4 bg-white border border-[#e5e2db] p-1.5 mb-12">
          <button
            onClick={() => setAnnual(false)}
            className={`px-5 py-2.5 text-sm font-semibold transition ${
              !annual ? 'bg-[#001B4D] text-white' : 'text-[#6b7280] hover:text-[#001B4D]'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-5 py-2.5 text-sm font-semibold transition relative ${
              annual ? 'bg-[#001B4D] text-white' : 'text-[#6b7280] hover:text-[#001B4D]'
            }`}
          >
            Annual
            <span className="absolute -top-3 -right-3 bg-[#9BAB16] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              -20%
            </span>
          </button>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan) => {
            const displayPrice = plan.priceAnnual && annual ? plan.priceAnnual : plan.price;
            const isPopular = plan.badge === 'Most Popular';
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white border-2 p-7 flex flex-col transition-all hover:-translate-y-1 hover:shadow-xl ${
                  isPopular ? 'border-[#001B4D] shadow-lg' : 'border-[#e5e2db]'
                }`}
              >
                {plan.badge && (
                  <div
                    className={`absolute -top-3 left-6 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white ${
                      plan.badge === 'Most Popular' ? 'bg-[#001B4D]' :
                      plan.badge === 'Best Value' ? 'bg-[#9BAB16]' :
                      'bg-[#CFBA8C] text-[#001B4D]'
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}

                <div className="mb-4">
                  <span className="text-3xl">{plan.icon}</span>
                </div>

                <h3 className="text-xl font-serif font-bold text-[#001B4D] mb-0.5">{plan.name}</h3>
                <p className="text-lg font-hebrew text-[#CFBA8C] mb-3" dir="rtl">{plan.nameHe}</p>

                <div className="mb-4">
                  {plan.price === 0 ? (
                    <div className="text-3xl font-serif font-bold text-[#001B4D]">Free</div>
                  ) : plan.period === 'one-time' ? (
                    <div>
                      <span className="text-4xl font-serif font-bold text-[#001B4D]">${plan.price}</span>
                      <span className="text-sm text-[#6b7280] ml-1">one-time</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-4xl font-serif font-bold text-[#001B4D]">${displayPrice}</span>
                      <span className="text-sm text-[#6b7280] ml-1">/month</span>
                      {annual && plan.priceAnnual && (
                        <div className="text-xs text-[#9BAB16] font-semibold mt-1">
                          ${plan.priceAnnual * 12}/year (save ${(plan.price - plan.priceAnnual) * 12})
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <p className="text-sm text-[#4a4a4a] leading-relaxed mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      {i === 0 && plan.id !== 'free' ? (
                        <span className="text-[#4a4a4a] font-semibold">{f}</span>
                      ) : (
                        <>
                          <Check className="w-4 h-4 text-[#9BAB16] shrink-0 mt-0.5" strokeWidth={3} />
                          <span className="text-[#4a4a4a]">{f}</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className={`block text-center py-3.5 px-6 font-bold text-sm transition-all ${
                    plan.ctaStyle === 'primary'
                      ? 'bg-[#001B4D] text-white hover:bg-[#002b7a] shadow-lg'
                      : plan.ctaStyle === 'accent'
                      ? 'bg-[#9BAB16] text-white hover:bg-[#8a9c14] shadow-lg'
                      : plan.ctaStyle === 'gold'
                      ? 'bg-gradient-to-r from-[#CFBA8C] to-[#b8a378] text-[#001B4D] hover:from-[#d4c599] hover:to-[#c0ac82] shadow-lg'
                      : 'border-2 border-[#001B4D] text-[#001B4D] hover:bg-[#001B4D]/5'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-[#6b7280] mt-8">
          All paid plans include a 10-day free trial. No credit card required to start.
        </p>
      </section>

      {/* Guarantee */}
      <section className="py-20 bg-[#001B4D] text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Shield className="w-12 h-12 mx-auto mb-6 text-[#CFBA8C]" strokeWidth={1.5} />
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Your Success, Not Our Addiction</h2>
          <p className="text-lg text-white/70 leading-relaxed mb-6">
            We're not trying to hook you into endless scrolling. We want you to actually learn Hebrew, read your grandmother's letters, follow Torah in the original, or hold a conversation with your Israeli family.
          </p>
          <p className="text-lg text-white/70 leading-relaxed mb-8">
            If we haven't helped you get closer to that goal, you shouldn't pay. 
            <strong className="text-[#CFBA8C]"> Full refund, any time, no questions asked.</strong>
          </p>
          <p className="text-sm text-white/40 italic">
            "We're the dating app of language learning — our goal is for you to delete us once you've found fluency."
          </p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif text-[#001B4D] text-center mb-12">
            Don't take our word for it
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-[#FAFAF8] border border-[#e5e2db] p-7">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-4 h-4 fill-[#9BAB16] text-[#9BAB16]" />
                  ))}
                </div>
                <p className="text-[#4a4a4a] text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <p className="font-semibold text-[#001B4D]">{t.name}</p>
                    <p className="text-[#6b7280]">{t.location}</p>
                  </div>
                  <span className="text-xs font-semibold text-[#9BAB16] bg-[#9BAB16]/10 px-2 py-1">
                    {t.plan}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compare to competitors */}
      <section className="py-20 bg-[#FAFAF8]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif text-[#001B4D] text-center mb-4">
            Why not just use Duolingo?
          </h2>
          <p className="text-center text-[#6b7280] mb-12 max-w-2xl mx-auto">
            Mass-market apps weren't built for serious Hebrew or Yiddish learners. Here's what we do differently.
          </p>
          
          <div className="bg-white border border-[#e5e2db] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e5e2db]">
                  <th className="text-left p-4 text-[#6b7280] font-semibold">Feature</th>
                  <th className="p-4 text-center text-[#6b7280] font-semibold">Duolingo</th>
                  <th className="p-4 text-center text-[#6b7280] font-semibold">Biblingo</th>
                  <th className="p-4 text-center bg-[#001B4D]/5 text-[#001B4D] font-bold">Hebrew Master</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Binyanim verb system', '❌', '✅', '✅'],
                  ['Nikud → unvocalized transition', '❌', '❌', '✅'],
                  ['Yiddish (dialect-aware)', '⚠️ Hybrid', '❌', '✅'],
                  ['Modern Hebrew', '✅', '❌', '✅'],
                  ['Biblical Hebrew', '❌', '✅', '✅'],
                  ['Aramaic', '❌', '❌', '✅'],
                  ['Flashcards from YOUR lessons', '❌', '❌', '✅'],
                  ['Live tutor integration', '❌', '❌', '✅'],
                  ['Root-based morphology', '❌', '❌', '✅'],
                  ['Pronunciation error tracking', '❌', '❌', '✅'],
                  ['Heritage speaker pathways', '❌', '❌', '✅'],
                  ['Color-coded graded reading', '❌', '✅', '✅'],
                  ['Community & group sessions', '❌', '✅', '✅'],
                ].map(([feature, duo, bib, us], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-[#FAFAF8]' : ''}>
                    <td className="p-4 text-[#001B4D] font-medium">{feature}</td>
                    <td className="p-4 text-center">{duo}</td>
                    <td className="p-4 text-center">{bib}</td>
                    <td className="p-4 text-center bg-[#001B4D]/5 font-semibold">{us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif text-[#001B4D] text-center mb-12">
            Common Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-[#e5e2db] bg-[#FAFAF8]">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-5 flex items-center justify-between"
                >
                  <span className="font-semibold text-[#001B4D] text-sm pr-4">{faq.q}</span>
                  <span className={`text-[#CFBA8C] transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-[#4a4a4a] leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-[#F5F0E8]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-serif text-[#001B4D] mb-4">
            Start learning in 5 minutes.
          </h2>
          <p className="text-lg text-[#4a4a4a] mb-8">
            No credit card. No commitment. Just your language and 5 minutes.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-12 py-5 bg-[#001B4D] text-white font-bold text-lg hover:bg-[#002b7a] transition-all transform hover:-translate-y-0.5 shadow-2xl">
            Begin Your Free Trial <ChevronRight className="w-5 h-5" />
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
