import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getLevelFromXP, getNextLevel, shouldContinueStreak, practicedToday } from '@/lib/xp-system';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { xpAmount } = await request.json();

    if (!xpAmount || xpAmount <= 0) {
      return NextResponse.json({ error: 'Invalid XP amount' }, { status: 400 });
    }

    // Get or create user profile
    let { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      // Create new profile
      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          xp: 0,
          level: 1,
          streak: 0,
          last_practice_date: null,
          total_reviews: 0,
        })
        .select()
        .single();

      if (createError) throw createError;
      profile = newProfile;
    }

    // Calculate new XP and level
    const newXP = profile.xp + xpAmount;
    const currentLevel = getLevelFromXP(profile.xp);
    const newLevel = getLevelFromXP(newXP);
    const leveledUp = newLevel.level > currentLevel.level;

    // Update streak
    let newStreak = profile.streak;
    const today = new Date().toISOString().split('T')[0];
    
    if (!practicedToday(profile.last_practice_date)) {
      if (shouldContinueStreak(profile.last_practice_date)) {
        newStreak += 1;
      } else {
        newStreak = 1; // Reset streak
      }
    }

    // Update profile
    const { data: updatedProfile, error: updateError } = await supabase
      .from('user_profiles')
      .update({
        xp: newXP,
        level: newLevel.level,
        streak: newStreak,
        last_practice_date: today,
        total_reviews: profile.total_reviews + 1,
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      leveledUp,
      newLevel: newLevel.name,
      xpGained: xpAmount,
    });

  } catch (error) {
    console.error('Award XP error:', error);
    return NextResponse.json({ error: 'Failed to award XP' }, { status: 500 });
  }
}
