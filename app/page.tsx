import AlephBetGrid from '@/components/AlephBetGrid'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center flex-none">
        <div className="text-2xl font-black text-indigo-600 tracking-tighter">HEBREW MASTER</div>
        <div className="flex gap-4">
          <Link href="/login" className="px-5 py-2 text-slate-600 font-bold hover:text-indigo-600 transition-colors">
            Log In
          </Link>
          <Link href="/login" className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center flex-none">
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
          <span dir="ltr">Master Hebrew Logic,</span>
          <br />
          <span dir="ltr" className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Not Just Words
          </span>
        </h1>
        
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Experience evidence-based learning with the Free Spaced Repetition System. 
          Build fluency through morphology, not memorization.
        </p>
        
        <Link 
          href="/login" // שיניתי שיוביל להרשמה/כניסה
          className="inline-block px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-semibold rounded-2xl shadow-xl hover:scale-105 transition-transform"
        >
          Start Learning Now
        </Link>
      </section>

      {/* Aleph-Bet Module */}
      <section className="container mx-auto px-4 py-10 flex-1">
        <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
            Explore the Aleph-Bet
          </h2>
          <div className="flex justify-center">
            <AlephBetGrid />
          </div>
        </div>
      </section>
      
      <div className="h-12 flex-none"></div>
    </main>
  )
}