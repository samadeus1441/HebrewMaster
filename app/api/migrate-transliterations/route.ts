import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { transliterate } from 'hebrew-transliteration';

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // You'll need this
  );

  try {
    // Get all words without transliteration
    const { data: words, error } = await supabase
      .from('srs_cards')
      .select('id, front')
      .is('transliteration', null);

    if (error) throw error;

    if (!words || words.length === 0) {
      return NextResponse.json({ message: 'No words to update' });
    }

    // Update each word with auto-generated transliteration
    const updates = words.map(word => ({
      id: word.id,
      transliteration: transliterate(word.front)
    }));

    const { error: updateError } = await supabase
      .from('srs_cards')
      .upsert(updates);

    if (updateError) throw updateError;

    return NextResponse.json({ 
      success: true, 
      updated: updates.length,
      message: `Successfully transliterated ${updates.length} words` 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
