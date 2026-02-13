import Link from 'next/link';
import { Shield, BookOpen, Mic2, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDF5E6] text-[#1a1a1a] selection:bg-[#CFBA8C] selection:text-[#001B4D]">
      {/* Hero Section: The Bridge */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden border-b border-[#CFBA8C]/30">
        {/* Subtle Background Texture */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png")` }}></div>
        
        {/* The Aura Animation (Uses the CSS from globals.css) */}
        <div className="hm-aura absolute inset-0 pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="mb-8 inline-block">
            <span className="px-4 py-1.5 rounded-full border border-[#001B4D]/20 text-[#001B4D] text-xs font-bold tracking-widest uppercase bg-white/50 backdrop-blur-sm">
              The Jerusalem Bridge
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-serif mb-8 text-[#001B4D] leading-tight">
            עברית היא לא שפה,<br />
            <span className="italic text-[#CFBA8C]">היא זהות.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-[#4a4a4a] leading-relaxed mb-12 font-light">
            אנחנו לא מלמדים אותך לדקלם מילים. אנחנו מפרקים את הפחד ומפעילים בתוכך את העברית דרך שושלת של סמכות, דיוק ורוח.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" 
              className="px-10 py-5 bg-[#001B4D] text-white rounded-none font-bold text-lg hover:bg-[#002b7a] transition-all transform hover:-translate-y-1 shadow-2xl">
              להתחלת המסע
            </Link>
            <button className="px-10 py-5 border border-[#001B4D] text-[#001B4D] rounded-none font-bold text-lg hover:bg-white/50 transition-all">
              הסיפור שלנו
            </button>
          </div>
        </div>
      </section>

      {/* The Authority: Schlesinger Lineage */}
      <section className="py-32 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-[4/5] bg-[#f4f1ea] border border-[#CFBA8C]/40 p-12 flex flex-col justify-end relative overflow-hidden">
                <span className="absolute top-[-20px] right-[-20px] text-[20rem] font-serif text-[#CFBA8C]/10 select-none">א</span>
                <div className="relative z-10">
                  <h3 className="text-3xl font-serif text-[#001B4D] mb-4">ספרא דדיינא</h3>
                  <p className="text-[#4a4a4a] italic leading-relaxed">
                    "סמכות היא לא משהו שרוכשים בקורס, היא משהו שעובר מדור לדור. כשאנחנו מדברים על דיוק בשפה, אנחנו מדברים על שושלת שהתחילה בבתי הדין של ירושלים."
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-4xl font-serif text-[#001B4D] mb-8 leading-snug">
                נצר לרב עקיבא יוסף שלזינגר: <br />
                <span className="text-[#CFBA8C]">דיוק ששורשיו עמוקים.</span>
              </h2>
              <p className="text-lg text-[#4a4a4a] leading-relaxed mb-8">
                בניגוד לאפליקציות שנבנו על ידי אלגוריתמים, "הגשר הירושלמי" נבנה על תשתית של סמכות היסטורית. השפה שאנחנו מלמדים היא העברית החיה – זו שמגשרת בין כתבי הקודש לרחוב הישראלי המודרני.
              </p>
              <div className="space-y-6">
                {[
                  { icon: Shield, title: "סמכות ריבונית", desc: "למידה מנציג של מסורת לשונית ירושלמית." },
                  { icon: Mic2, title: "הפעלה (Activation)", desc: "אנחנו מפרקים את ה'ביצועיזם' ומתמקדים בדיבור חופשי." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-12 h-12 flex-shrink-0 bg-[#001B4D]/5 flex items-center justify-center rounded-full">
                      <item.icon className="w-6 h-6 text-[#001B4D]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#001B4D]">{item.title}</h4>
                      <p className="text-[#666]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Philosophy: Unlearning */}
      <section className="py-24 bg-[#001B4D] text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif mb-16 text-[#CFBA8C]">השיטה: Unlearning</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "שבירת הפחד", desc: "משחררים את הצורך בפרפקציוניזם שמחניק את הדיבור." },
              { step: "02", title: "הקשבה אקטיבית", desc: "צלילה לתוך ה-Soundscape הירושלמי לריכוז מקסימלי." },
              { step: "03", title: "בעלות על השפה", desc: "הופכים את העברית לחלק בלתי נפרד מהזהות שלך." }
            ].map((s, i) => (
              <div key={i} className="p-8 border border-white/10 bg-white/5 backdrop-blur-sm">
                <span className="text-xs font-mono text-[#CFBA8C] block mb-4 tracking-widest">{s.step}</span>
                <h4 className="text-xl font-bold mb-4">{s.title}</h4>
                <p className="text-white/70 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#FDF5E6] border-t border-[#CFBA8C]/30 text-center">
        <p className="text-[#001B4D]/60 text-sm font-light uppercase tracking-widest">
          &copy; 2026 The Jerusalem Bridge | Schlesinger Heritage
        </p>
      </footer>
    </div>
  );
}