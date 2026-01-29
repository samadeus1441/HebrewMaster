import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type Flashcard = {
  id: string;
  word_he: string;      // הוספנו את זה
  translit: string;     // הוספנו את זה
  meaning_en: string;
  difficulty: number;
  content_id: string;   // כדי לקשר למילה המקורית
};

export function useStudySession() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalWords: 0, mastered: 0, streak: 0 });

  useEffect(() => {
    fetchSessionData();
  }, []);

  async function fetchSessionData() {
    try {
      // 1. קודם כל נביא נתונים כלליים לדשבורד
      const { count } = await supabase.from('vocabulary').select('*', { count: 'exact', head: true });
      setStats(prev => ({ ...prev, totalWords: count || 0, streak: 1 }));

      // 2. עכשיו נביא מילים לתרגול
      // אנחנו מושכים מילים מטבלת vocabulary
      const { data: vocabData } = await supabase
        .from('vocabulary')
        .select('*')
        .limit(10); // לוקחים 10 מילים לתרגול

      if (vocabData) {
        // המרת המילים לפורמט של כרטיסיות
        const formattedCards = vocabData.map(word => ({
          id: word.id, // משתמשים ב-ID של המילה
          content_id: word.id,
          word_he: word.word_he,    // הנה העברית!
          translit: word.translit,  // הנה ההגייה!
          meaning_en: word.meaning_en,
          difficulty: 0.3
        }));
        
        setCards(formattedCards);
      }
      
    } catch (e) {
      console.error("Error fetching study session:", e);
    } finally {
      setLoading(false);
    }
  }

  return { cards, stats, loading };
}