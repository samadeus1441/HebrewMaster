import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const TRANSLITERATION_MAP: Record<string, string> = {
  'בַּיִת': 'bayit',
  'לָבָן': 'lavan',
  'יָרֹק': 'yarok',
  'בַּת': 'bat',
  'צָהֹב': 'tsahov',
  'סבבה': 'sababa',
  'לָלֶכֶת': 'laleket',
  'שָׁחֹר': 'shachor',
  'חָתוּל': 'chatul',
  'אוֹכֶל': 'ochel',
  'לֶחֶם': 'lechem',
  'סַבָּא': 'saba',
  'לַיְלָה טוֹב': 'layla tov',
  'לְדַבֵּר': 'ledaber',
  'בֵּן': 'ben',
  'יָרֵחַ': 'yareach',
  'קָפֶה': 'kafe',
  'אָדֹם': 'adom'
};

async function getAITransliteration(word: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a Hebrew linguistics expert. Transliterate the given Hebrew word into modern Israeli phonetic English. Use 'ch' for Chet/Khaf, 'v' for Vet, etc. Provide ONLY the transliterated word in lowercase, no punctuation."
        },
        { role: "user", content: word }
      ],
      temperature: 0,
    });
    return response.choices[0].message.content?.trim().toLowerCase() || "";
  } catch (error) {
    console.error("AI Transliteration failed:", error);
    return "";
  }
}

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { data: words, error } = await supabase
      .from('srs_cards')
      .select('id, front')
      .is('transliteration', null); // מעדכן רק מילים שחסר להן תעתיק

    if (error) throw error;
    if (!words?.length) return NextResponse.json({ message: 'No new words to update' });

    let updatedCount = 0;

    for (const word of words) {
      if (!word.front) continue;

      // 1. נסיון מהמפה הידנית
      let finalTrans = TRANSLITERATION_MAP[word.front];

      // 2. גיבוי AI אם המילה לא במפה
      if (!finalTrans) {
        finalTrans = await getAITransliteration(word.front);
      }

      if (finalTrans) {
        const { error: updateError } = await supabase
          .from('srs_cards')
          .update({ transliteration: finalTrans })
          .eq('id', word.id);

        if (!updateError) updatedCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      updated: updatedCount,
      message: `Successfully processed ${updatedCount} words.` 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}