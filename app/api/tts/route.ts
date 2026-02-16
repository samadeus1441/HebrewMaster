// app/api/tts/route.ts
// ═══════════════════════════════════════════════════════════
// TTS PROXY — Google Translate TTS (fallback for Web Speech API)
// Primary TTS is now in the browser via Web Speech API
// This route is only called as a fallback
// ═══════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, lang = 'he' } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    // Limit text length for TTS
    const trimmed = text.slice(0, 200);

    // Map language codes
    const ttsLang = lang === 'yi' ? 'he' : lang === 'ar' ? 'he' : 'he';

    // Google Translate TTS endpoint
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${ttsLang}&client=tw-ob&q=${encodeURIComponent(trimmed)}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://translate.google.com/',
      }
    });
    
    if (!response.ok) {
      // If Google blocks us, return a helpful error
      return NextResponse.json(
        { error: "Google TTS unavailable. Use browser speech synthesis instead." }, 
        { status: 503 }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=86400', // Cache for 24h
      },
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
