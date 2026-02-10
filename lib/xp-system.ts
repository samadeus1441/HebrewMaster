// Hebrew alphabet levels (22 letters)
export const HEBREW_LEVELS = [
    { level: 1, name: 'אָלֶף', xpRequired: 0 },      // Alef
    { level: 2, name: 'בֵּית', xpRequired: 100 },    // Bet
    { level: 3, name: 'גִּימֶל', xpRequired: 250 },  // Gimel
    { level: 4, name: 'דָּלֶת', xpRequired: 500 },   // Dalet
    { level: 5, name: 'הֵא', xpRequired: 800 },      // He
    { level: 6, name: 'וָו', xpRequired: 1200 },     // Vav
    { level: 7, name: 'זַיִן', xpRequired: 1700 },   // Zayin
    { level: 8, name: 'חֵית', xpRequired: 2300 },    // Het
    { level: 9, name: 'טֵית', xpRequired: 3000 },    // Tet
    { level: 10, name: 'יוֹד', xpRequired: 3800 },   // Yod
    { level: 11, name: 'כַּף', xpRequired: 4700 },   // Kaf
    { level: 12, name: 'לָמֶד', xpRequired: 5700 },  // Lamed
    { level: 13, name: 'מֵם', xpRequired: 6800 },    // Mem
    { level: 14, name: 'נוּן', xpRequired: 8000 },   // Nun
    { level: 15, name: 'סָמֶךְ', xpRequired: 9300 }, // Samekh
    { level: 16, name: 'עַיִן', xpRequired: 10700 }, // Ayin
    { level: 17, name: 'פֵּא', xpRequired: 12200 },  // Pe
    { level: 18, name: 'צָדִי', xpRequired: 13800 }, // Tsadi
    { level: 19, name: 'קוֹף', xpRequired: 15500 },  // Qof
    { level: 20, name: 'רֵישׁ', xpRequired: 17300 }, // Resh
    { level: 21, name: 'שִׁין', xpRequired: 19200 }, // Shin
    { level: 22, name: 'תָּו', xpRequired: 21200 },  // Tav (Master!)
  ];
  
  // XP rewards for different actions
  export const XP_REWARDS = {
    FLASHCARD_AGAIN: 1,   // Failed
    FLASHCARD_HARD: 3,    // Hard
    FLASHCARD_GOOD: 5,    // Good
    FLASHCARD_EASY: 10,   // Easy
    QUIZ_CORRECT: 8,
    QUIZ_WRONG: 2,
    LESSON_COMPLETE: 50,
    DAILY_STREAK: 20,
  };
  
  // Get current level based on XP
  export function getLevelFromXP(xp: number) {
    let currentLevel = HEBREW_LEVELS[0];
    
    for (const level of HEBREW_LEVELS) {
      if (xp >= level.xpRequired) {
        currentLevel = level;
      } else {
        break;
      }
    }
    
    return currentLevel;
  }
  
  // Get next level info
  export function getNextLevel(currentLevel: number) {
    return HEBREW_LEVELS.find(l => l.level === currentLevel + 1) || HEBREW_LEVELS[HEBREW_LEVELS.length - 1];
  }
  
  // Calculate XP needed for next level
  export function getXPForNextLevel(xp: number, currentLevel: number) {
    const nextLevel = getNextLevel(currentLevel);
    return nextLevel.xpRequired - xp;
  }
  
  // Check if streak should continue
  export function shouldContinueStreak(lastPracticeDate: string | null): boolean {
    if (!lastPracticeDate) return false;
    
    const last = new Date(lastPracticeDate);
    const today = new Date();
    
    // Set both to midnight for accurate comparison
    last.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - last.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays === 1; // Practiced yesterday
  }
  
  // Check if already practiced today
  export function practicedToday(lastPracticeDate: string | null): boolean {
    if (!lastPracticeDate) return false;
    
    const last = new Date(lastPracticeDate);
    const today = new Date();
    
    return (
      last.getFullYear() === today.getFullYear() &&
      last.getMonth() === today.getMonth() &&
      last.getDate() === today.getDate()
    );
  }
  