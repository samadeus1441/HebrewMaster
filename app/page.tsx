import AlephBetGrid from '@/components/AlephBetGrid'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Navigation - מרווח נשימה מאוזן */}
      <nav className="container mx-auto px-6 py-8 flex justify-between items-center flex-none">
        <div className="text-2xl font-black text-indigo-600 tracking-tighter">HEBREW MASTER</div>
        <div className="flex gap-4">
          <Link href="/login" className="px-5 py-2 text-slate-600 font-bold hover:text-indigo-600 transition-colors">
            Login
          </Link>
          <Link href="/dashboard" className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all">
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero Section - מרווחים מאוזנים (py-12 במקום py-8) */}
      <section className="container mx-auto px-4 py-12 text-center flex-none">
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
          <span dir="ltr">Master Hebrew Logic,</span>
          <br />
          <span dir="ltr" className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Not Just Words
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Experience evidence-based learning with the Free Spaced Repetition System. 
          Build fluency through morphology, not memorization.
        </p>
        
        <Link 
          href="/dashboard"
          className="inline-block px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-semibold rounded-2xl shadow-xl hover:scale-105 transition-transform"
        >
          Start Learning
        </Link>
      </section>

      {/* Aleph-Bet Module - מרווח עליון עדין כדי שלא יידבק לכפתור */}
      <section className="container mx-auto px-4 py-10 flex-1">
        <div className="max-w-6xl mx-auto bg-white/60 backdrop-blur-md rounded-[2.5rem] p-10 shadow-xl border border-white/20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
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