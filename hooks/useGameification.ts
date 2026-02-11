export const HEBREW_LEVELS = [
  { level: 1, name: 'אלף', xpRequired: 0 },
  { level: 2, name: 'בית', xpRequired: 30 },
  { level: 3, name: 'גימל', xpRequired: 70 },
  { level: 4, name: 'דלת', xpRequired: 130 },
  { level: 5, name: 'הא', xpRequired: 200 },
  { level: 6, name: 'וו', xpRequired: 280 },
  { level: 7, name: 'זין', xpRequired: 380 },
  { level: 8, name: 'חית', xpRequired: 500 },
  { level: 9, name: 'טית', xpRequired: 650 },
  { level: 10, name: 'יוד', xpRequired: 800 },
  { level: 11, name: 'כף', xpRequired: 1000 },
  { level: 12, name: 'למד', xpRequired: 1200 },
  { level: 13, name: 'מם', xpRequired: 1400 },
  { level: 14, name: 'נון', xpRequired: 1600 },
  { level: 15, name: 'סמך', xpRequired: 1900 },
  { level: 16, name: 'עין', xpRequired: 2200 },
  { level: 17, name: 'פא', xpRequired: 2600 },
  { level: 18, name: 'צדי', xpRequired: 3000 },
  { level: 19, name: 'קוף', xpRequired: 3500 },
  { level: 20, name: 'ריש', xpRequired: 4000 },
  { level: 21, name: 'שין', xpRequired: 4500 },
  { level: 22, name: 'תו', xpRequired: 5000 },
];

export function getLevelFromXP(xp: number) {
  let currentLevel = HEBREW_LEVELS[0];
  let nextLevel = HEBREW_LEVELS[1];
  
  for (let i = 0; i < HEBREW_LEVELS.length; i++) {
    if (xp >= HEBREW_LEVELS[i].xpRequired) {
      currentLevel = HEBREW_LEVELS[i];
      nextLevel = HEBREW_LEVELS[i + 1] || currentLevel;
    } else {
      break;
    }
  }
  
  const xpInLevel = xp - currentLevel.xpRequired;
  const xpNeeded = nextLevel.xpRequired;
  const xpForNextLevel = xpNeeded - currentLevel.xpRequired;
  const progress = xpForNextLevel > 0 ? xpInLevel / xpForNextLevel : 1;
  
  return {
    level: currentLevel.level,
    name: currentLevel.name,
    xpRequired: currentLevel.xpRequired,
    nextLevel: nextLevel.level !== currentLevel.level ? nextLevel.name : null,
    xpNeeded: nextLevel.xpRequired,
    xpInLevel,
    progress,
  };
}
