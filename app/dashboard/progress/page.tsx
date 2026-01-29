'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function ProgressPage() {
  const [items, setItems] = useState<any[]>([]);
  const userId = '00000000-0000-0000-0000-000000000000';

  useEffect(() => {
    async function getMemory() {
      const { data } = await supabase
        .from('srs_cards')
        .select('difficulty, due_date, vocabulary(word_he, meaning_en)')
        .eq('user_id', userId);
      if (data) setItems(data);
    }
    getMemory();
  }, []);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-black mb-6">Memory Status</h1>
      <div className="grid gap-4">
        {items.map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold" dir="rtl">{item.vocabulary.word_he}</p>
              <p className="text-slate-500">{item.vocabulary.meaning_en}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase text-slate-400">Difficulty Score</p>
              <p className={`text-xl font-black ${item.difficulty > 5 ? 'text-red-500' : 'text-green-500'}`}>
                {Math.round(item.difficulty * 10)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}