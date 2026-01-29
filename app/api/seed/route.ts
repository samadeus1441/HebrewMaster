import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- THE REAL DATA FROM YOUR FILE ---

const ROOTS = [
  { id: 'ktv', letters: 'כ-ת-ב', root: 'כתב', meaning_en: 'writing', meaning_fr: 'écriture' },
  { id: 'lmd', letters: 'ל-מ-ד', root: 'למד', meaning_en: 'learning', meaning_fr: 'apprentissage' },
  { id: 'dbr', letters: 'ד-ב-ר', root: 'דבר', meaning_en: 'speaking', meaning_fr: 'parole' },
  { id: 'hlk', letters: 'ה-ל-כ', root: 'הלכ', meaning_en: 'walking', meaning_fr: 'marcher' },
  { id: 'shm', letters: 'ש-מ-ע', root: 'שמע', meaning_en: 'hearing', meaning_fr: 'entendre' },
  { id: 'rah', letters: 'ר-א-ה', root: 'ראה', meaning_en: 'seeing', meaning_fr: 'voir' },
  { id: 'ahv', letters: 'א-ה-ב', root: 'אהב', meaning_en: 'loving', meaning_fr: 'aimer' },
  { id: 'ydh', letters: 'י-ד-ע', root: 'ידע', meaning_en: 'knowing', meaning_fr: 'savoir' },
  { id: 'bra', letters: 'ב-ר-א', root: 'ברא', meaning_en: 'creating', meaning_fr: 'créer' },
  { id: 'qds', letters: 'ק-ד-ש', root: 'קדש', meaning_en: 'holiness', meaning_fr: 'sainteté' }
];

const VOCAB_LIST = [
  // GREETINGS
  { id: 'shalom', hebrew: 'שָׁלוֹם', hebrewUnpointed: 'שלום', translit: 'shalom', meaning_en: 'hello/peace', meaning_fr: 'bonjour/paix', level: 'a1', root_id: 'shm' },
  { id: 'boker_tov', hebrew: 'בֹּקֶר טוֹב', hebrewUnpointed: 'בוקר טוב', translit: 'boker tov', meaning_en: 'good morning', meaning_fr: 'bonjour', level: 'a1' },
  { id: 'toda', hebrew: 'תּוֹדָה', hebrewUnpointed: 'תודה', translit: 'toda', meaning_en: 'thank you', meaning_fr: 'merci', level: 'a1' },
  { id: 'ken', hebrew: 'כֵּן', hebrewUnpointed: 'כן', translit: 'ken', meaning_en: 'yes', meaning_fr: 'oui', level: 'a1' },
  { id: 'lo', hebrew: 'לֹא', hebrewUnpointed: 'לא', translit: 'lo', meaning_en: 'no', meaning_fr: 'non', level: 'a1' },
  { id: 'slicha', hebrew: 'סְלִיחָה', hebrewUnpointed: 'סליחה', translit: 'slicha', meaning_en: 'sorry/excuse me', meaning_fr: 'pardon', level: 'a1' },
  { id: 'lehitraot', hebrew: 'לְהִתְרָאוֹת', hebrewUnpointed: 'להתראות', translit: 'lehitraot', meaning_en: 'goodbye', meaning_fr: 'au revoir', level: 'a1', root_id: 'rah' },
  { id: 'naim_meod', hebrew: 'נָעִים מְאֹד', hebrewUnpointed: 'נעים מאוד', translit: 'naim meod', meaning_en: 'nice to meet you', meaning_fr: 'enchanté', level: 'a1' },

  // PRONOUNS
  { id: 'ani', hebrew: 'אֲנִי', hebrewUnpointed: 'אני', translit: 'ani', meaning_en: 'I', meaning_fr: 'je', level: 'a1' },
  { id: 'ata', hebrew: 'אַתָּה', hebrewUnpointed: 'אתה', translit: 'ata', meaning_en: 'you (m)', meaning_fr: 'tu (m)', level: 'a1' },
  { id: 'at', hebrew: 'אַתְּ', hebrewUnpointed: 'את', translit: 'at', meaning_en: 'you (f)', meaning_fr: 'tu (f)', level: 'a1' },
  { id: 'hu', hebrew: 'הוּא', hebrewUnpointed: 'הוא', translit: 'hu', meaning_en: 'he', meaning_fr: 'il', level: 'a1' },
  { id: 'hi', hebrew: 'הִיא', hebrewUnpointed: 'היא', translit: 'hi', meaning_en: 'she', meaning_fr: 'elle', level: 'a1' },
  { id: 'anachnu', hebrew: 'אֲנַחְנוּ', hebrewUnpointed: 'אנחנו', translit: 'anachnu', meaning_en: 'we', meaning_fr: 'nous', level: 'a1' },
  
  // NUMBERS 1-10
  { id: 'echad', hebrew: 'אֶחָד', hebrewUnpointed: 'אחד', translit: 'echad', meaning_en: 'one', meaning_fr: 'un', level: 'a1' },
  { id: 'shtayim', hebrew: 'שְׁתַּיִם', hebrewUnpointed: 'שתיים', translit: 'shtayim', meaning_en: 'two', meaning_fr: 'deux', level: 'a1' },
  { id: 'shalosh', hebrew: 'שָׁלוֹשׁ', hebrewUnpointed: 'שלוש', translit: 'shalosh', meaning_en: 'three', meaning_fr: 'trois', level: 'a1' },
  { id: 'arba', hebrew: 'אַרְבַּע', hebrewUnpointed: 'ארבע', translit: 'arba', meaning_en: 'four', meaning_fr: 'quatre', level: 'a1' },
  { id: 'chamesh', hebrew: 'חָמֵשׁ', hebrewUnpointed: 'חמש', translit: 'chamesh', meaning_en: 'five', meaning_fr: 'cinq', level: 'a1' },

  // BIBLICAL & CORE
  { id: 'elohim', hebrew: 'אֱלֹהִים', hebrewUnpointed: 'אלהים', translit: 'Elohim', meaning_en: 'God', meaning_fr: 'Dieu', level: 'a1' },
  { id: 'torah', hebrew: 'תּוֹרָה', hebrewUnpointed: 'תורה', translit: 'Torah', meaning_en: 'Torah/Instruction', meaning_fr: 'Torah', level: 'a1', root_id: 'lmd' },
  { id: 'ahava', hebrew: 'אַהֲבָה', hebrewUnpointed: 'אהבה', translit: 'ahava', meaning_en: 'love', meaning_fr: 'amour', level: 'a1', root_id: 'ahv' },
  { id: 'ruach', hebrew: 'רוּחַ', hebrewUnpointed: 'רוח', translit: 'ruach', meaning_en: 'spirit/wind', meaning_fr: 'esprit', level: 'a2' },
  { id: 'nefesh', hebrew: 'נֶפֶשׁ', hebrewUnpointed: 'נפש', translit: 'nefesh', meaning_en: 'soul/life', meaning_fr: 'âme', level: 'a2' },
  
  // FAMILY
  { id: 'aba', hebrew: 'אַבָּא', hebrewUnpointed: 'אבא', translit: 'aba', meaning_en: 'dad', meaning_fr: 'papa', level: 'a1', root_id: 'av' },
  { id: 'ima', hebrew: 'אִמָּא', hebrewUnpointed: 'אמא', translit: 'ima', meaning_en: 'mom', meaning_fr: 'maman', level: 'a1', root_id: 'em' },
  { id: 'bayit', hebrew: 'בַּיִת', hebrewUnpointed: 'בית', translit: 'bayit', meaning_en: 'house/home', meaning_fr: 'maison', level: 'a1' }
];

export async function GET() {
  try {
    // 1. Clear old data (Optional: remove this if you want to keep adding)
    // await supabase.from('vocabulary').delete().neq('id', '0');

    // 2. Insert Roots
    const { error: rootError } = await supabase.from('roots').upsert(
      ROOTS.map(r => ({
        id: r.id, // Explicit ID
        letters: r.letters,
        root_word: r.root,
        meaning_en: r.meaning_en,
        meaning_fr: r.meaning_fr
      }))
    );
    if (rootError) console.error("Root Error:", rootError);

    // 3. Insert Vocabulary
    const { error: vocabError } = await supabase.from('vocabulary').upsert(
      VOCAB_LIST.map(v => ({
        id: v.id,
        hebrew: v.hebrew,
        hebrew_unpointed: v.hebrewUnpointed,
        transliteration: v.translit,
        meaning_en: v.meaning_en,
        meaning_fr: v.meaning_fr,
        difficulty_level: v.level,
        root_id: v.root_id || null
      }))
    );

    if (vocabError) throw vocabError;

    return NextResponse.json({ 
      success: true, 
      message: `Database refreshed! Inserted ${VOCAB_LIST.length} words.` 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}