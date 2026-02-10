export interface Achievement {
    id: string;
    name: string;
    nameHebrew: string;
    description: string;
    icon: string;
    requirement: number;
    type: 'xp' | 'streak' | 'lessons' | 'reviews' | 'level';
  }
  
  export const ACHIEVEMENTS: Achievement[] = [
    // XP Achievements
    { id: 'xp_100', name: 'First Steps', nameHebrew: 'צְעָדִים רִאשׁוֹנִים', description: 'Earn 100 XP', icon: '⭐', requirement: 100, type: 'xp' },
    { id: 'xp_500', name: 'Rising Star', nameHebrew: 'כּוֹכָב עוֹלֶה', description: 'Earn 500 XP', icon: '🌟', requirement: 500, type: 'xp' },
    { id: 'xp_1000', name: 'Dedicated Learner', nameHebrew: 'לוֹמֵד מָסוּר', description: 'Earn 1,000 XP', icon: '💫', requirement: 1000, type: 'xp' },
    { id: 'xp_5000', name: 'Hebrew Master', nameHebrew: 'רַב עִבְרִית', description: 'Earn 5,000 XP', icon: '🏆', requirement: 5000, type: 'xp' },
  
    // Streak Achievements
    { id: 'streak_3', name: 'On Fire', nameHebrew: 'בּוֹעֵר', description: '3 day streak', icon: '🔥', requirement: 3, type: 'streak' },
    { id: 'streak_7', name: 'Week Warrior', nameHebrew: 'לוֹחֵם שָׁבוּעַ', description: '7 day streak', icon: '💪', requirement: 7, type: 'streak' },
    { id: 'streak_30', name: 'Monthly Master', nameHebrew: 'אָדוֹן הַחֹדֶשׁ', description: '30 day streak', icon: '👑', requirement: 30, type: 'streak' },
    { id: 'streak_100', name: 'Unstoppable', nameHebrew: 'בִּלְתִּי נִעְצָר', description: '100 day streak', icon: '🚀', requirement: 100, type: 'streak' },
  
    // Lesson Achievements
    { id: 'lessons_1', name: 'First Lesson', nameHebrew: 'שִׁעוּר רִאשׁוֹן', description: 'Complete 1 lesson', icon: '📖', requirement: 1, type: 'lessons' },
    { id: 'lessons_5', name: 'Getting Started', nameHebrew: 'מַתְחִיל', description: 'Complete 5 lessons', icon: '📚', requirement: 5, type: 'lessons' },
    { id: 'lessons_10', name: 'Committed Student', nameHebrew: 'תַּלְמִיד מָסוּר', description: 'Complete 10 lessons', icon: '🎓', requirement: 10, type: 'lessons' },
    { id: 'lessons_50', name: 'Scholar', nameHebrew: 'חָכָם', description: 'Complete 50 lessons', icon: '🧠', requirement: 50, type: 'lessons' },
  
    // Review Achievements
    { id: 'reviews_50', name: 'Practice Makes Perfect', nameHebrew: 'תַּרְגִּיל עוֹשֶׂה שְׁלֵמוּת', description: '50 card reviews', icon: '🃏', requirement: 50, type: 'reviews' },
    { id: 'reviews_200', name: 'Memory Champion', nameHebrew: 'אַלּוּף זִכָּרוֹן', description: '200 card reviews', icon: '🧩', requirement: 200, type: 'reviews' },
    { id: 'reviews_500', name: 'Review Master', nameHebrew: 'רַב חֲזָרָה', description: '500 card reviews', icon: '💎', requirement: 500, type: 'reviews' },
  
    // Level Achievements
    { id: 'level_5', name: 'Rising Through Ranks', nameHebrew: 'עוֹלֶה בַּדַּרְגּוֹת', description: 'Reach Level 5', icon: '🎖️', requirement: 5, type: 'level' },
    { id: 'level_10', name: 'Halfway There', nameHebrew: 'בַּחֲצִי הַדֶּרֶךְ', description: 'Reach Level 10', icon: '🥈', requirement: 10, type: 'level' },
    { id: 'level_22', name: 'Ultimate Master', nameHebrew: 'רַב סוֹפִי', description: 'Reach Level 22 (תָּו)', icon: '👑', requirement: 22, type: 'level' },
  ];
  
  export function checkAchievements(stats: {
    xp: number;
    streak: number;
    lessonsCompleted: number;
    totalReviews: number;
    level: number;
  }): Achievement[] {
    return ACHIEVEMENTS.filter(achievement => {
      switch (achievement.type) {
        case 'xp':
          return stats.xp >= achievement.requirement;
        case 'streak':
          return stats.streak >= achievement.requirement;
        case 'lessons':
          return stats.lessonsCompleted >= achievement.requirement;
        case 'reviews':
          return stats.totalReviews >= achievement.requirement;
        case 'level':
          return stats.level >= achievement.requirement;
        default:
          return false;
      }
    });
  }
  