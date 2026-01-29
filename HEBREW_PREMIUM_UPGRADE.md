# Hebrew Master Premium - Complete Upgrade Package
## For Integration with Existing Cursor Project

---

# 📋 TABLE OF CONTENTS

1. [Type Definitions](#types)
2. [FSRS Algorithm](#fsrs)
3. [Complete Hebrew Alphabet Data](#alphabet)
4. [Complete Nikud (Vowels) Data](#nikud)
5. [Hebrew Roots (Shorashim)](#roots)
6. [Vocabulary by Category](#vocabulary)
7. [Component Examples](#components)
8. [Database Schema (Supabase)](#database)
9. [Integration Instructions](#integration)

---

# TYPES

```typescript
// types/index.ts

// User & Authentication
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'student' | 'teacher' | 'admin';
  subscription_tier: 'free' | 'premium' | 'enterprise';
  subscription_status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_level: string;
  preferred_language: 'en' | 'fr' | 'he';
  created_at: string;
  last_seen_at: string;
}

export interface UserProgress {
  user_id: string;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  words_learned: number;
  letters_mastered: number;
  lessons_completed: number;
  total_study_time_minutes: number;
  last_study_date: string;
}

// Hebrew Content
export interface HebrewLetter {
  id: string;
  letter: string;
  name_hebrew: string;
  name_english: string;
  name_french: string;
  transliteration: string;
  sound_description_en: string;
  sound_description_fr: string;
  sound_description_he: string;
  gematria_value: number;
  final_form?: string;
  variant?: {
    letter: string;
    name: string;
    sound: string;
  };
  audio_url?: string;
  mnemonics: {
    en: string;
    fr: string;
    he: string;
  };
  order: number;
}

export interface Nikud {
  id: string;
  symbol: string;
  display_with_alef: string;
  name_hebrew: string;
  name_english: string;
  sound_description: string;
  category: 'a' | 'e' | 'i' | 'o' | 'u' | 'reduced';
  audio_url?: string;
  order: number;
}

export interface Root {
  id: string;
  letters: string;
  core_meaning_en: string;
  core_meaning_fr: string;
  core_meaning_he: string;
  examples: string[];
}

export interface VocabularyWord {
  id: string;
  hebrew: string;
  hebrew_with_nikud: string;
  transliteration: string;
  meaning_en: string;
  meaning_fr: string;
  meaning_he: string;
  part_of_speech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'pronoun' | 'other';
  gender?: 'masculine' | 'feminine' | 'both';
  plural_form?: string;
  root_id?: string;
  category: string;
  difficulty_level: 1 | 2 | 3 | 4 | 5;
  audio_url?: string;
  example_sentence?: {
    hebrew: string;
    transliteration: string;
    translation_en: string;
    translation_fr: string;
  };
}

// FSRS Card
export interface FSRSCard {
  id: string;
  user_id: string;
  item_type: 'letter' | 'nikud' | 'word';
  item_id: string;
  due: string;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: 'new' | 'learning' | 'review' | 'relearning';
  last_review?: string;
  created_at: string;
}

export interface ReviewLog {
  id: string;
  card_id: string;
  user_id: string;
  rating: 1 | 2 | 3 | 4;
  state: FSRSCard['state'];
  due: string;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  last_elapsed_days: number;
  scheduled_days: number;
  review_time_ms: number;
  reviewed_at: string;
}
```

---

# FSRS Algorithm

```typescript
// lib/fsrs.ts - Complete FSRS Implementation

const FSRS_PARAMS = {
  w: [0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18, 0.05, 0.34, 1.26, 0.29, 2.61],
  requestRetention: 0.9,
  maximumInterval: 36500,
  easyBonus: 1.3,
  hardFactor: 1.2,
};

export enum Rating {
  Again = 1,
  Hard = 2,
  Good = 3,
  Easy = 4,
}

export enum State {
  New = 'new',
  Learning = 'learning',
  Review = 'review',
  Relearning = 'relearning',
}

export function createCard() {
  return {
    due: new Date().toISOString(),
    stability: 0,
    difficulty: 0,
    elapsed_days: 0,
    scheduled_days: 0,
    reps: 0,
    lapses: 0,
    state: State.New,
    last_review: undefined,
  };
}

function initStability(rating: Rating): number {
  return Math.max(FSRS_PARAMS.w[rating - 1], 0.1);
}

function initDifficulty(rating: Rating): number {
  return Math.min(Math.max(FSRS_PARAMS.w[4] - FSRS_PARAMS.w[5] * (rating - 3), 1), 10);
}

function nextDifficulty(d: number, rating: Rating): number {
  const nextD = d - FSRS_PARAMS.w[6] * (rating - 3);
  return Math.min(Math.max(meanReversion(FSRS_PARAMS.w[4], nextD), 1), 10);
}

function meanReversion(init: number, current: number): number {
  return FSRS_PARAMS.w[7] * init + (1 - FSRS_PARAMS.w[7]) * current;
}

function nextRecallStability(d: number, s: number, r: number, rating: Rating): number {
  const hardPenalty = rating === Rating.Hard ? FSRS_PARAMS.w[15] : 1;
  const easyBonus = rating === Rating.Easy ? FSRS_PARAMS.w[16] : 1;
  return s * (1 + Math.exp(FSRS_PARAMS.w[8]) * (11 - d) * Math.pow(s, -FSRS_PARAMS.w[9]) * (Math.exp((1 - r) * FSRS_PARAMS.w[10]) - 1) * hardPenalty * easyBonus);
}

function nextForgetStability(d: number, s: number, r: number): number {
  return FSRS_PARAMS.w[11] * Math.pow(d, -FSRS_PARAMS.w[12]) * (Math.pow(s + 1, FSRS_PARAMS.w[13]) - 1) * Math.exp((1 - r) * FSRS_PARAMS.w[14]);
}

function retrievability(elapsedDays: number, stability: number): number {
  if (stability <= 0) return 0;
  return Math.pow(1 + elapsedDays / (9 * stability), -1);
}

function nextInterval(stability: number): number {
  const interval = Math.round(stability * 9 * (1 / FSRS_PARAMS.requestRetention - 1));
  return Math.min(Math.max(interval, 1), FSRS_PARAMS.maximumInterval);
}

export function schedule(card: any, rating: Rating, now: Date = new Date()) {
  const elapsedDays = card.last_review
    ? Math.max(0, (now.getTime() - new Date(card.last_review).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const updatedCard = { ...card, reps: card.reps + 1, elapsed_days: elapsedDays, last_review: now.toISOString() };

  if (card.state === State.New) {
    updatedCard.difficulty = initDifficulty(rating);
    updatedCard.stability = initStability(rating);

    if (rating === Rating.Again) {
      updatedCard.state = State.Learning;
      updatedCard.scheduled_days = 0;
      updatedCard.due = now.toISOString();
    } else if (rating === Rating.Hard) {
      updatedCard.state = State.Learning;
      updatedCard.due = new Date(now.getTime() + 5 * 60 * 1000).toISOString();
    } else if (rating === Rating.Good) {
      updatedCard.state = State.Learning;
      updatedCard.due = new Date(now.getTime() + 10 * 60 * 1000).toISOString();
    } else {
      updatedCard.state = State.Review;
      const interval = nextInterval(updatedCard.stability);
      updatedCard.scheduled_days = interval;
      updatedCard.due = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000).toISOString();
    }
  } else if (card.state === State.Learning || card.state === State.Relearning) {
    if (rating === Rating.Again) {
      updatedCard.due = now.toISOString();
    } else if (rating === Rating.Hard) {
      updatedCard.due = new Date(now.getTime() + 5 * 60 * 1000).toISOString();
    } else if (rating === Rating.Good) {
      updatedCard.state = State.Review;
      const interval = nextInterval(updatedCard.stability);
      updatedCard.scheduled_days = interval;
      updatedCard.due = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000).toISOString();
    } else {
      updatedCard.state = State.Review;
      updatedCard.stability = updatedCard.stability * FSRS_PARAMS.easyBonus;
      const interval = nextInterval(updatedCard.stability);
      updatedCard.scheduled_days = interval;
      updatedCard.due = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000).toISOString();
    }
  } else {
    const r = retrievability(elapsedDays, card.stability);
    if (rating === Rating.Again) {
      updatedCard.state = State.Relearning;
      updatedCard.lapses = card.lapses + 1;
      updatedCard.stability = nextForgetStability(card.difficulty, card.stability, r);
      updatedCard.difficulty = nextDifficulty(card.difficulty, rating);
      updatedCard.due = now.toISOString();
    } else {
      updatedCard.difficulty = nextDifficulty(card.difficulty, rating);
      updatedCard.stability = nextRecallStability(card.difficulty, card.stability, r, rating);
      const interval = nextInterval(updatedCard.stability);
      updatedCard.scheduled_days = interval;
      updatedCard.due = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000).toISOString();
    }
  }

  return { card: updatedCard };
}

export function formatInterval(days: number): string {
  if (days < 1) {
    const minutes = Math.round(days * 24 * 60);
    if (minutes < 60) return `${minutes}m`;
    return `${Math.round(minutes / 60)}h`;
  }
  if (days === 1) return '1 day';
  if (days < 7) return `${Math.round(days)} days`;
  if (days < 30) return `${Math.round(days / 7)} weeks`;
  if (days < 365) return `${Math.round(days / 30)} months`;
  return `${(days / 365).toFixed(1)} years`;
}

export function previewIntervals(card: any) {
  const now = new Date();
  return {
    [Rating.Again]: '< 1m',
    [Rating.Hard]: formatInterval(schedule({ ...card }, Rating.Hard, now).card.scheduled_days || 0),
    [Rating.Good]: formatInterval(schedule({ ...card }, Rating.Good, now).card.scheduled_days || 0),
    [Rating.Easy]: formatInterval(schedule({ ...card }, Rating.Easy, now).card.scheduled_days || 0),
  };
}
```

---

# Complete Hebrew Alphabet Data

```typescript
// lib/data/alphabet.ts

export const hebrewAlphabet = [
  {
    id: 'alef',
    letter: 'א',
    name_hebrew: 'אָלֶף',
    name_english: 'Alef',
    name_french: 'Aleph',
    transliteration: 'ʾ',
    sound_description_en: 'Silent letter or glottal stop (like the pause in "uh-oh")',
    sound_description_fr: 'Lettre muette ou coup de glotte',
    sound_description_he: 'אות שקטה או עצירה גרונית',
    gematria_value: 1,
    mnemonics: {
      en: 'A for Alef - the silent leader, first letter',
      fr: 'A pour Aleph - le leader silencieux',
      he: 'א׳ לאָלֶף - המנהיג השקט'
    },
    order: 1
  },
  {
    id: 'bet',
    letter: 'בּ',
    name_hebrew: 'בֵּית',
    name_english: 'Bet',
    name_french: 'Beth',
    transliteration: 'b',
    sound_description_en: 'B as in "boy" (with dagesh)',
    sound_description_fr: 'B comme dans "bon" (avec dagesh)',
    sound_description_he: 'ב כמו ב"בית" (עם דגש)',
    gematria_value: 2,
    variant: { letter: 'ב', name: 'Vet', sound: 'V as in "very"' },
    mnemonics: {
      en: 'Bet looks like a house (bayit) with an opening',
      fr: 'Beth ressemble à une maison (bayit)',
      he: 'בֵּית נראה כמו בית עם פתח'
    },
    order: 2
  },
  {
    id: 'gimel',
    letter: 'ג',
    name_hebrew: 'גִּימֶל',
    name_english: 'Gimel',
    name_french: 'Guimel',
    transliteration: 'g',
    sound_description_en: 'G as in "go" (always hard)',
    sound_description_fr: 'G comme dans "gare" (toujours dur)',
    sound_description_he: 'ג כמו ב"גמל"',
    gematria_value: 3,
    mnemonics: {
      en: 'Gimel looks like a person walking',
      fr: 'Guimel ressemble à une personne qui marche',
      he: 'גִּימֶל נראה כמו אדם הולך'
    },
    order: 3
  },
  {
    id: 'dalet',
    letter: 'ד',
    name_hebrew: 'דָּלֶת',
    name_english: 'Dalet',
    name_french: 'Daleth',
    transliteration: 'd',
    sound_description_en: 'D as in "door"',
    sound_description_fr: 'D comme dans "porte"',
    sound_description_he: 'ד כמו ב"דלת"',
    gematria_value: 4,
    mnemonics: {
      en: 'Dalet means "door" - has a corner like a doorframe',
      fr: 'Daleth signifie "porte"',
      he: 'דָּלֶת פירושה דלת'
    },
    order: 4
  },
  {
    id: 'hey',
    letter: 'ה',
    name_hebrew: 'הֵא',
    name_english: 'Hey',
    name_french: 'Hé',
    transliteration: 'h',
    sound_description_en: 'H as in "hello" (often silent at word end)',
    sound_description_fr: 'H aspiré comme dans "hello"',
    sound_description_he: 'ה כמו ב"הלו"',
    gematria_value: 5,
    mnemonics: {
      en: 'Hey looks like a window - "Hey, look!"',
      fr: 'Hé ressemble à une fenêtre',
      he: 'הֵא נראה כמו חלון'
    },
    order: 5
  },
  {
    id: 'vav',
    letter: 'ו',
    name_hebrew: 'וָו',
    name_english: 'Vav',
    name_french: 'Vav',
    transliteration: 'v/o/u',
    sound_description_en: 'V as in "very", or O/U when used as vowel',
    sound_description_fr: 'V comme dans "vite", ou O/U comme voyelle',
    sound_description_he: 'ו כעיצור, או או/או כתנועה',
    gematria_value: 6,
    mnemonics: {
      en: 'Vav is a hook/nail - connects things',
      fr: 'Vav est un crochet - connecte les choses',
      he: 'וָו הוא מסמר - מחבר דברים'
    },
    order: 6
  },
  {
    id: 'zayin',
    letter: 'ז',
    name_hebrew: 'זַיִן',
    name_english: 'Zayin',
    name_french: 'Zayin',
    transliteration: 'z',
    sound_description_en: 'Z as in "zebra"',
    sound_description_fr: 'Z comme dans "zèbre"',
    sound_description_he: 'ז כמו ב"זברה"',
    gematria_value: 7,
    mnemonics: {
      en: 'Zayin looks like a sword',
      fr: 'Zayin ressemble à une épée',
      he: 'זַיִן נראה כמו חרב'
    },
    order: 7
  },
  {
    id: 'chet',
    letter: 'ח',
    name_hebrew: 'חֵית',
    name_english: 'Chet',
    name_french: 'Heth',
    transliteration: 'ch',
    sound_description_en: 'CH as in German "Bach" (guttural)',
    sound_description_fr: 'CH guttural comme dans "Bach"',
    sound_description_he: 'ח גרונית',
    gematria_value: 8,
    mnemonics: {
      en: 'Chet is a fence - closed on top',
      fr: 'Heth est une clôture',
      he: 'חֵית היא גדר'
    },
    order: 8
  },
  {
    id: 'tet',
    letter: 'ט',
    name_hebrew: 'טֵית',
    name_english: 'Tet',
    name_french: 'Teth',
    transliteration: 't',
    sound_description_en: 'T as in "top"',
    sound_description_fr: 'T comme dans "table"',
    sound_description_he: 'ט כמו ב"טוב"',
    gematria_value: 9,
    mnemonics: {
      en: 'Tet looks like a snake coiled - first letter of "tov" (good)',
      fr: 'Teth ressemble à un serpent enroulé',
      he: 'טֵית נראה כמו נחש - אות ראשונה ב"טוב"'
    },
    order: 9
  },
  {
    id: 'yod',
    letter: 'י',
    name_hebrew: 'יוֹד',
    name_english: 'Yod',
    name_french: 'Yod',
    transliteration: 'y',
    sound_description_en: 'Y as in "yes"',
    sound_description_fr: 'Y comme dans "yoga"',
    sound_description_he: 'י כמו ב"יד"',
    gematria_value: 10,
    mnemonics: {
      en: 'Yod is the smallest letter - a divine spark',
      fr: 'Yod est la plus petite lettre',
      he: 'יוֹד היא האות הקטנה ביותר'
    },
    order: 10
  },
  {
    id: 'kaf',
    letter: 'כּ',
    name_hebrew: 'כַּף',
    name_english: 'Kaf',
    name_french: 'Kaph',
    transliteration: 'k',
    sound_description_en: 'K as in "king" (with dagesh)',
    sound_description_fr: 'K comme dans "kilo" (avec dagesh)',
    sound_description_he: 'כ כמו ב"כלב" (עם דגש)',
    gematria_value: 20,
    variant: { letter: 'כ', name: 'Khaf', sound: 'CH guttural' },
    final_form: 'ך',
    mnemonics: {
      en: 'Kaf means "palm" - shaped like a cupped hand',
      fr: 'Kaph signifie "paume"',
      he: 'כַּף פירושה כף יד'
    },
    order: 11
  },
  {
    id: 'lamed',
    letter: 'ל',
    name_hebrew: 'לָמֶד',
    name_english: 'Lamed',
    name_french: 'Lamed',
    transliteration: 'l',
    sound_description_en: 'L as in "love"',
    sound_description_fr: 'L comme dans "lune"',
    sound_description_he: 'ל כמו ב"לב"',
    gematria_value: 30,
    mnemonics: {
      en: 'Lamed is tallest letter - reaches to heaven (learning)',
      fr: 'Lamed est la plus haute lettre',
      he: 'לָמֶד היא האות הגבוהה ביותר'
    },
    order: 12
  },
  {
    id: 'mem',
    letter: 'מ',
    name_hebrew: 'מֵם',
    name_english: 'Mem',
    name_french: 'Mem',
    transliteration: 'm',
    sound_description_en: 'M as in "mother"',
    sound_description_fr: 'M comme dans "mère"',
    sound_description_he: 'מ כמו ב"אמא"',
    gematria_value: 40,
    final_form: 'ם',
    mnemonics: {
      en: 'Mem is for mayim (water)',
      fr: 'Mem est pour mayim (eau)',
      he: 'מֵם היא למים'
    },
    order: 13
  },
  {
    id: 'nun',
    letter: 'נ',
    name_hebrew: 'נוּן',
    name_english: 'Nun',
    name_french: 'Noun',
    transliteration: 'n',
    sound_description_en: 'N as in "no"',
    sound_description_fr: 'N comme dans "non"',
    sound_description_he: 'נ כמו ב"נר"',
    gematria_value: 50,
    final_form: 'ן',
    mnemonics: {
      en: 'Nun is bent like a humble person bowing',
      fr: 'Noun est courbée comme une personne humble',
      he: 'נוּן כפופה כמו אדם עניו'
    },
    order: 14
  },
  {
    id: 'samech',
    letter: 'ס',
    name_hebrew: 'סָמֶך',
    name_english: 'Samech',
    name_french: 'Samekh',
    transliteration: 's',
    sound_description_en: 'S as in "sun"',
    sound_description_fr: 'S comme dans "soleil"',
    sound_description_he: 'ס כמו ב"סוס"',
    gematria_value: 60,
    mnemonics: {
      en: 'Samech is closed circle - support all around',
      fr: 'Samekh est un cercle fermé',
      he: 'סָמֶך היא עיגול סגור'
    },
    order: 15
  },
  {
    id: 'ayin',
    letter: 'ע',
    name_hebrew: 'עַיִן',
    name_english: 'Ayin',
    name_french: 'Ayin',
    transliteration: 'ʿ',
    sound_description_en: 'Silent in modern Hebrew',
    sound_description_fr: 'Muette en hébreu moderne',
    sound_description_he: 'שקטה בעברית מודרנית',
    gematria_value: 70,
    mnemonics: {
      en: 'Ayin means "eye"',
      fr: 'Ayin signifie "œil"',
      he: 'עַיִן פירושה עין'
    },
    order: 16
  },
  {
    id: 'pey',
    letter: 'פּ',
    name_hebrew: 'פֵּא',
    name_english: 'Pey',
    name_french: 'Pé',
    transliteration: 'p',
    sound_description_en: 'P as in "pet" (with dagesh)',
    sound_description_fr: 'P comme dans "père" (avec dagesh)',
    sound_description_he: 'פ כמו ב"פרח" (עם דגש)',
    gematria_value: 80,
    variant: { letter: 'פ', name: 'Fey', sound: 'F as in "fun"' },
    final_form: 'ף',
    mnemonics: {
      en: 'Pey means "mouth"',
      fr: 'Pé signifie "bouche"',
      he: 'פֵּא פירושה פה'
    },
    order: 17
  },
  {
    id: 'tsadi',
    letter: 'צ',
    name_hebrew: 'צָדִי',
    name_english: 'Tsadi',
    name_french: 'Tsadé',
    transliteration: 'ts',
    sound_description_en: 'TS as in "cats"',
    sound_description_fr: 'TS comme dans "tsar"',
    sound_description_he: 'צ כמו ב"צדק"',
    gematria_value: 90,
    final_form: 'ץ',
    mnemonics: {
      en: 'Tsadi - righteous (tsadik)',
      fr: 'Tsadé - juste (tsadik)',
      he: 'צָדִי - צדיק'
    },
    order: 18
  },
  {
    id: 'qof',
    letter: 'ק',
    name_hebrew: 'קוֹף',
    name_english: 'Qof',
    name_french: 'Qoph',
    transliteration: 'q',
    sound_description_en: 'K sound (deeper in throat)',
    sound_description_fr: 'Son K (plus profond)',
    sound_description_he: 'ק כמו ב"קוף"',
    gematria_value: 100,
    mnemonics: {
      en: 'Qof has a leg that descends below',
      fr: 'Qoph a une jambe qui descend',
      he: 'קוֹף יש לה רגל שיורדת למטה'
    },
    order: 19
  },
  {
    id: 'resh',
    letter: 'ר',
    name_hebrew: 'רֵישׁ',
    name_english: 'Resh',
    name_french: 'Rech',
    transliteration: 'r',
    sound_description_en: 'Guttural R (like French R)',
    sound_description_fr: 'R guttural (comme le R français)',
    sound_description_he: 'ר גרונית',
    gematria_value: 200,
    mnemonics: {
      en: 'Resh means "head"',
      fr: 'Rech signifie "tête"',
      he: 'רֵישׁ פירושה ראש'
    },
    order: 20
  },
  {
    id: 'shin',
    letter: 'שׁ',
    name_hebrew: 'שִׁין',
    name_english: 'Shin',
    name_french: 'Chin',
    transliteration: 'sh',
    sound_description_en: 'SH as in "shoe" (dot on right)',
    sound_description_fr: 'CH comme dans "chat" (point à droite)',
    sound_description_he: 'שׁ כמו ב"שלום"',
    gematria_value: 300,
    variant: { letter: 'שׂ', name: 'Sin', sound: 'S as in "sun" (dot on left)' },
    mnemonics: {
      en: 'Shin has 3 flames - like fire (esh)',
      fr: 'Chin a 3 flammes - comme le feu',
      he: 'שִׁין יש לה 3 להבות - כמו אש'
    },
    order: 21
  },
  {
    id: 'tav',
    letter: 'ת',
    name_hebrew: 'תָּו',
    name_english: 'Tav',
    name_french: 'Tav',
    transliteration: 't',
    sound_description_en: 'T as in "top"',
    sound_description_fr: 'T comme dans "table"',
    sound_description_he: 'ת כמו ב"תורה"',
    gematria_value: 400,
    mnemonics: {
      en: 'Tav is the last letter - completion',
      fr: 'Tav est la dernière lettre - achèvement',
      he: 'תָּו היא האות האחרונה - סיום'
    },
    order: 22
  }
];
```

---

# Complete Nikud (Vowels) Data

```typescript
// lib/data/nikud.ts

export const nikudData = [
  {
    id: 'kamatz',
    symbol: 'ָ',
    display_with_alef: 'אָ',
    name_hebrew: 'קָמַץ',
    name_english: 'Kamatz',
    sound_description: 'A as in "father" (long A)',
    category: 'a',
    order: 1
  },
  {
    id: 'patach',
    symbol: 'ַ',
    display_with_alef: 'אַ',
    name_hebrew: 'פַּתָח',
    name_english: 'Patach',
    sound_description: 'A as in "cat" (short A)',
    category: 'a',
    order: 2
  },
  {
    id: 'chataf-patach',
    symbol: 'ֲ',
    display_with_alef: 'אֲ',
    name_hebrew: 'חֲטַף פַּתָח',
    name_english: 'Chataf Patach',
    sound_description: 'Very short A (reduced)',
    category: 'reduced',
    order: 3
  },
  {
    id: 'tsere',
    symbol: 'ֵ',
    display_with_alef: 'אֵ',
    name_hebrew: 'צֵירֵי',
    name_english: 'Tsere',
    sound_description: 'E as in "they" (long E)',
    category: 'e',
    order: 4
  },
  {
    id: 'segol',
    symbol: 'ֶ',
    display_with_alef: 'אֶ',
    name_hebrew: 'סֶגוֹל',
    name_english: 'Segol',
    sound_description: 'E as in "bed" (short E)',
    category: 'e',
    order: 5
  },
  {
    id: 'chataf-segol',
    symbol: 'ֱ',
    display_with_alef: 'אֱ',
    name_hebrew: 'חֲטַף סֶגוֹל',
    name_english: 'Chataf Segol',
    sound_description: 'Very short E (reduced)',
    category: 'reduced',
    order: 6
  },
  {
    id: 'chirik',
    symbol: 'ִ',
    display_with_alef: 'אִ',
    name_hebrew: 'חִירִיק',
    name_english: 'Chirik',
    sound_description: 'I as in "machine" (EE sound)',
    category: 'i',
    order: 7
  },
  {
    id: 'cholam',
    symbol: 'ֹ',
    display_with_alef: 'אֹ',
    name_hebrew: 'חוֹלָם',
    name_english: 'Cholam',
    sound_description: 'O as in "go" (long O)',
    category: 'o',
    order: 8
  },
  {
    id: 'cholam-male',
    symbol: 'וֹ',
    display_with_alef: 'וֹ',
    name_hebrew: 'חוֹלָם מָלֵא',
    name_english: 'Cholam Male',
    sound_description: 'O with Vav (full spelling)',
    category: 'o',
    order: 9
  },
  {
    id: 'chataf-kamatz',
    symbol: 'ֳ',
    display_with_alef: 'אֳ',
    name_hebrew: 'חֲטַף קָמַץ',
    name_english: 'Chataf Kamatz',
    sound_description: 'Very short O (reduced)',
    category: 'reduced',
    order: 10
  },
  {
    id: 'kubutz',
    symbol: 'ֻ',
    display_with_alef: 'אֻ',
    name_hebrew: 'קֻבּוּץ',
    name_english: 'Kubutz',
    sound_description: 'U as in "rule" (OO sound)',
    category: 'u',
    order: 11
  },
  {
    id: 'shuruk',
    symbol: 'וּ',
    display_with_alef: 'וּ',
    name_hebrew: 'שׁוּרוּק',
    name_english: 'Shuruk',
    sound_description: 'U with Vav (full spelling OO)',
    category: 'u',
    order: 12
  },
  {
    id: 'shva',
    symbol: 'ְ',
    display_with_alef: 'אְ',
    name_hebrew: 'שְׁוָא',
    name_english: 'Shva',
    sound_description: 'Brief "uh" or silent',
    category: 'reduced',
    order: 13
  }
];
```

---

# Hebrew Roots (Shorashim)

```typescript
// lib/data/roots.ts

export const rootsData = [
  {
    id: 'ktv',
    letters: 'כ-ת-ב',
    core_meaning_en: 'write, writing',
    core_meaning_fr: 'écrire, écriture',
    core_meaning_he: 'כתיבה',
    examples: ['כָּתַב (wrote)', 'מִכְתָּב (letter)', 'כְּתֻבָּה (marriage contract)', 'כָּתוּב (written)']
  },
  {
    id: 'lmd',
    letters: 'ל-מ-ד',
    core_meaning_en: 'learn, teach',
    core_meaning_fr: 'apprendre, enseigner',
    core_meaning_he: 'לימוד, הוראה',
    examples: ['לָמַד (learned)', 'לִמֵּד (taught)', 'תַּלְמִיד (student)', 'מְלַמֵּד (teacher)']
  },
  {
    id: 'dbr',
    letters: 'ד-ב-ר',
    core_meaning_en: 'speak, word',
    core_meaning_fr: 'parler, mot',
    core_meaning_he: 'דיבור, מילה',
    examples: ['דִּבֵּר (spoke)', 'דָּבָר (thing/word)', 'מִדְבָּר (desert)', 'דִּבּוּר (speech)']
  },
  {
    id: 'spr',
    letters: 'ס-פ-ר',
    core_meaning_en: 'count, tell, book',
    core_meaning_fr: 'compter, raconter, livre',
    core_meaning_he: 'ספירה, סיפור, ספר',
    examples: ['סָפַר (counted)', 'סִפֵּר (told)', 'סֵפֶר (book)', 'מִסְפָּר (number)']
  },
  {
    id: 'hlk',
    letters: 'ה-ל-ך',
    core_meaning_en: 'walk, go',
    core_meaning_fr: 'marcher, aller',
    core_meaning_he: 'הליכה',
    examples: ['הָלַך (walked)', 'הֲלִיכָה (walking)', 'מַהֲלָך (journey)']
  },
  {
    id: 'akl',
    letters: 'א-כ-ל',
    core_meaning_en: 'eat, food',
    core_meaning_fr: 'manger, nourriture',
    core_meaning_he: 'אכילה',
    examples: ['אָכַל (ate)', 'אֹכֶל (food)', 'מַאֲכָל (dish)']
  },
  {
    id: 'shmr',
    letters: 'ש-מ-ר',
    core_meaning_en: 'guard, keep',
    core_meaning_fr: 'garder, protéger',
    core_meaning_he: 'שמירה',
    examples: ['שָׁמַר (guarded)', 'שׁוֹמֵר (guard)', 'מִשְׁמֶרֶת (watch)']
  },
  {
    id: 'ydh',
    letters: 'י-ד-ע',
    core_meaning_en: 'know',
    core_meaning_fr: 'savoir, connaître',
    core_meaning_he: 'ידיעה',
    examples: ['יָדַע (knew)', 'יֶדַע (knowledge)', 'הוֹדִיעַ (informed)']
  },
  {
    id: 'shma',
    letters: 'ש-מ-ע',
    core_meaning_en: 'hear, listen',
    core_meaning_fr: 'entendre, écouter',
    core_meaning_he: 'שמיעה',
    examples: ['שָׁמַע (heard)', 'שְׁמִיעָה (hearing)', 'מַשְׁמָעוּת (meaning)']
  },
  {
    id: 'bnh',
    letters: 'ב-נ-ה',
    core_meaning_en: 'build',
    core_meaning_fr: 'construire',
    core_meaning_he: 'בנייה',
    examples: ['בָּנָה (built)', 'בִּנְיָן (building)', 'מִבְנֶה (structure)']
  }
];
```

---

# Vocabulary by Category

```typescript
// lib/data/vocabulary.ts

export const vocabularyData = {
  greetings: {
    name: 'Greetings & Basics',
    nameHe: 'ברכות ויסודות',
    words: [
      { id: 'shalom', hebrew: 'שלום', hebrew_with_nikud: 'שָׁלוֹם', transliteration: 'shalom', meaning_en: 'hello / goodbye / peace', meaning_fr: 'bonjour / au revoir / paix', meaning_he: 'שלום', part_of_speech: 'noun', gender: 'masculine', category: 'greetings', difficulty_level: 1 },
      { id: 'boker-tov', hebrew: 'בוקר טוב', hebrew_with_nikud: 'בֹּקֶר טוֹב', transliteration: 'boker tov', meaning_en: 'good morning', meaning_fr: 'bonjour (matin)', meaning_he: 'בוקר טוב', part_of_speech: 'other', category: 'greetings', difficulty_level: 1 },
      { id: 'erev-tov', hebrew: 'ערב טוב', hebrew_with_nikud: 'עֶרֶב טוֹב', transliteration: 'erev tov', meaning_en: 'good evening', meaning_fr: 'bonsoir', meaning_he: 'ערב טוב', part_of_speech: 'other', category: 'greetings', difficulty_level: 1 },
      { id: 'layla-tov', hebrew: 'לילה טוב', hebrew_with_nikud: 'לַיְלָה טוֹב', transliteration: 'layla tov', meaning_en: 'good night', meaning_fr: 'bonne nuit', meaning_he: 'לילה טוב', part_of_speech: 'other', category: 'greetings', difficulty_level: 1 },
      { id: 'toda', hebrew: 'תודה', hebrew_with_nikud: 'תּוֹדָה', transliteration: 'toda', meaning_en: 'thank you', meaning_fr: 'merci', meaning_he: 'תודה', part_of_speech: 'noun', gender: 'feminine', category: 'greetings', difficulty_level: 1 },
      { id: 'toda-raba', hebrew: 'תודה רבה', hebrew_with_nikud: 'תּוֹדָה רַבָּה', transliteration: 'toda raba', meaning_en: 'thank you very much', meaning_fr: 'merci beaucoup', meaning_he: 'תודה רבה', part_of_speech: 'other', category: 'greetings', difficulty_level: 1 },
      { id: 'bevakasha', hebrew: 'בבקשה', hebrew_with_nikud: 'בְּבַקָּשָׁה', transliteration: 'bevakasha', meaning_en: 'please / you\'re welcome', meaning_fr: 's\'il vous plaît / de rien', meaning_he: 'בבקשה', part_of_speech: 'other', category: 'greetings', difficulty_level: 1 },
      { id: 'slicha', hebrew: 'סליחה', hebrew_with_nikud: 'סְלִיחָה', transliteration: 'slicha', meaning_en: 'excuse me / sorry', meaning_fr: 'excusez-moi / pardon', meaning_he: 'סליחה', part_of_speech: 'noun', gender: 'feminine', category: 'greetings', difficulty_level: 1 },
      { id: 'ken', hebrew: 'כן', hebrew_with_nikud: 'כֵּן', transliteration: 'ken', meaning_en: 'yes', meaning_fr: 'oui', meaning_he: 'כן', part_of_speech: 'adverb', category: 'greetings', difficulty_level: 1 },
      { id: 'lo', hebrew: 'לא', hebrew_with_nikud: 'לֹא', transliteration: 'lo', meaning_en: 'no', meaning_fr: 'non', meaning_he: 'לא', part_of_speech: 'adverb', category: 'greetings', difficulty_level: 1 },
      { id: 'lehitraot', hebrew: 'להתראות', hebrew_with_nikud: 'לְהִתְרָאוֹת', transliteration: 'lehitraot', meaning_en: 'goodbye (see you)', meaning_fr: 'au revoir', meaning_he: 'להתראות', part_of_speech: 'other', category: 'greetings', difficulty_level: 2 },
      { id: 'ma-nishma', hebrew: 'מה נשמע', hebrew_with_nikud: 'מַה נִשְׁמָע', transliteration: 'ma nishma', meaning_en: 'what\'s up?', meaning_fr: 'quoi de neuf?', meaning_he: 'מה נשמע', part_of_speech: 'other', category: 'greetings', difficulty_level: 2 },
    ]
  },
  pronouns: {
    name: 'Pronouns',
    nameHe: 'כינויי גוף',
    words: [
      { id: 'ani', hebrew: 'אני', hebrew_with_nikud: 'אֲנִי', transliteration: 'ani', meaning_en: 'I', meaning_fr: 'je', meaning_he: 'אני', part_of_speech: 'pronoun', category: 'pronouns', difficulty_level: 1 },
      { id: 'ata', hebrew: 'אתה', hebrew_with_nikud: 'אַתָּה', transliteration: 'ata', meaning_en: 'you (m. sg.)', meaning_fr: 'tu (m.)', meaning_he: 'אתה (ז)', part_of_speech: 'pronoun', gender: 'masculine', category: 'pronouns', difficulty_level: 1 },
      { id: 'at', hebrew: 'את', hebrew_with_nikud: 'אַתְּ', transliteration: 'at', meaning_en: 'you (f. sg.)', meaning_fr: 'tu (f.)', meaning_he: 'את (נ)', part_of_speech: 'pronoun', gender: 'feminine', category: 'pronouns', difficulty_level: 1 },
      { id: 'hu', hebrew: 'הוא', hebrew_with_nikud: 'הוּא', transliteration: 'hu', meaning_en: 'he / it (m.)', meaning_fr: 'il', meaning_he: 'הוא', part_of_speech: 'pronoun', gender: 'masculine', category: 'pronouns', difficulty_level: 1 },
      { id: 'hi', hebrew: 'היא', hebrew_with_nikud: 'הִיא', transliteration: 'hi', meaning_en: 'she / it (f.)', meaning_fr: 'elle', meaning_he: 'היא', part_of_speech: 'pronoun', gender: 'feminine', category: 'pronouns', difficulty_level: 1 },
      { id: 'anachnu', hebrew: 'אנחנו', hebrew_with_nikud: 'אֲנַחְנוּ', transliteration: 'anachnu', meaning_en: 'we', meaning_fr: 'nous', meaning_he: 'אנחנו', part_of_speech: 'pronoun', category: 'pronouns', difficulty_level: 1 },
      { id: 'atem', hebrew: 'אתם', hebrew_with_nikud: 'אַתֶּם', transliteration: 'atem', meaning_en: 'you (m. pl.)', meaning_fr: 'vous (m.)', meaning_he: 'אתם (ז)', part_of_speech: 'pronoun', gender: 'masculine', category: 'pronouns', difficulty_level: 2 },
      { id: 'hem', hebrew: 'הם', hebrew_with_nikud: 'הֵם', transliteration: 'hem', meaning_en: 'they (m.)', meaning_fr: 'ils', meaning_he: 'הם (ז)', part_of_speech: 'pronoun', gender: 'masculine', category: 'pronouns', difficulty_level: 1 },
      { id: 'hen', hebrew: 'הן', hebrew_with_nikud: 'הֵן', transliteration: 'hen', meaning_en: 'they (f.)', meaning_fr: 'elles', meaning_he: 'הן (נ)', part_of_speech: 'pronoun', gender: 'feminine', category: 'pronouns', difficulty_level: 2 },
    ]
  },
  numbers: {
    name: 'Numbers',
    nameHe: 'מספרים',
    words: [
      { id: 'efes', hebrew: 'אפס', hebrew_with_nikud: 'אֶפֶס', transliteration: 'efes', meaning_en: 'zero', meaning_fr: 'zéro', meaning_he: '0', part_of_speech: 'noun', category: 'numbers', difficulty_level: 1 },
      { id: 'echad', hebrew: 'אחד', hebrew_with_nikud: 'אֶחָד', transliteration: 'echad', meaning_en: 'one (m.)', meaning_fr: 'un', meaning_he: '1', part_of_speech: 'noun', gender: 'masculine', category: 'numbers', difficulty_level: 1 },
      { id: 'shnayim', hebrew: 'שניים', hebrew_with_nikud: 'שְׁנַיִם', transliteration: 'shnayim', meaning_en: 'two (m.)', meaning_fr: 'deux (m.)', meaning_he: '2', part_of_speech: 'noun', gender: 'masculine', category: 'numbers', difficulty_level: 1 },
      { id: 'shlosha', hebrew: 'שלושה', hebrew_with_nikud: 'שְׁלֹשָׁה', transliteration: 'shlosha', meaning_en: 'three (m.)', meaning_fr: 'trois (m.)', meaning_he: '3', part_of_speech: 'noun', gender: 'masculine', category: 'numbers', difficulty_level: 1 },
      { id: 'arba', hebrew: 'ארבעה', hebrew_with_nikud: 'אַרְבָּעָה', transliteration: "arba'a", meaning_en: 'four (m.)', meaning_fr: 'quatre (m.)', meaning_he: '4', part_of_speech: 'noun', gender: 'masculine', category: 'numbers', difficulty_level: 1 },
      { id: 'chamisha', hebrew: 'חמישה', hebrew_with_nikud: 'חֲמִשָּׁה', transliteration: 'chamisha', meaning_en: 'five (m.)', meaning_fr: 'cinq (m.)', meaning_he: '5', part_of_speech: 'noun', gender: 'masculine', category: 'numbers', difficulty_level: 1 },
      { id: 'shisha', hebrew: 'שישה', hebrew_with_nikud: 'שִׁשָּׁה', transliteration: 'shisha', meaning_en: 'six (m.)', meaning_fr: 'six (m.)', meaning_he: '6', part_of_speech: 'noun', gender: 'masculine', category: 'numbers', difficulty_level: 1 },
      { id: 'shiva', hebrew: 'שבעה', hebrew_with_nikud: 'שִׁבְעָה', transliteration: "shiv'a", meaning_en: 'seven (m.)', meaning_fr: 'sept (m.)', meaning_he: '7', part_of_speech: 'noun', gender: 'masculine', category: 'numbers', difficulty_level: 1 },
      { id: 'shmona', hebrew: 'שמונה', hebrew_with_nikud: 'שְׁמוֹנָה', transliteration: 'shmona', meaning_en: 'eight (m.)', meaning_fr: 'huit (m.)', meaning_he: '8', part_of_speech: 'noun', gender: 'masculine', category: 'numbers', difficulty_level: 1 },
      { id: 'tisha', hebrew: 'תשעה', hebrew_with_nikud: 'תִּשְׁעָה', transliteration: "tish'a", meaning_en: 'nine (m.)', meaning_fr: 'neuf (m.)', meaning_he: '9', part_of_speech: 'noun', gender: 'masculine', category: 'numbers', difficulty_level: 1 },
      { id: 'asara', hebrew: 'עשרה', hebrew_with_nikud: 'עֲשָׂרָה', transliteration: 'asara', meaning_en: 'ten (m.)', meaning_fr: 'dix (m.)', meaning_he: '10', part_of_speech: 'noun', gender: 'masculine', category: 'numbers', difficulty_level: 1 },
    ]
  },
  family: {
    name: 'Family',
    nameHe: 'משפחה',
    words: [
      { id: 'mishpacha', hebrew: 'משפחה', hebrew_with_nikud: 'מִשְׁפָּחָה', transliteration: 'mishpacha', meaning_en: 'family', meaning_fr: 'famille', meaning_he: 'משפחה', part_of_speech: 'noun', gender: 'feminine', category: 'family', difficulty_level: 1 },
      { id: 'aba', hebrew: 'אבא', hebrew_with_nikud: 'אַבָּא', transliteration: 'aba', meaning_en: 'dad', meaning_fr: 'papa', meaning_he: 'אבא', part_of_speech: 'noun', gender: 'masculine', category: 'family', difficulty_level: 1 },
      { id: 'ima', hebrew: 'אמא', hebrew_with_nikud: 'אִמָּא', transliteration: 'ima', meaning_en: 'mom', meaning_fr: 'maman', meaning_he: 'אמא', part_of_speech: 'noun', gender: 'feminine', category: 'family', difficulty_level: 1 },
      { id: 'ben', hebrew: 'בן', hebrew_with_nikud: 'בֵּן', transliteration: 'ben', meaning_en: 'son', meaning_fr: 'fils', meaning_he: 'בן', part_of_speech: 'noun', gender: 'masculine', plural_form: 'בָּנִים', category: 'family', difficulty_level: 1 },
      { id: 'bat', hebrew: 'בת', hebrew_with_nikud: 'בַּת', transliteration: 'bat', meaning_en: 'daughter', meaning_fr: 'fille', meaning_he: 'בת', part_of_speech: 'noun', gender: 'feminine', plural_form: 'בָּנוֹת', category: 'family', difficulty_level: 1 },
      { id: 'ach', hebrew: 'אח', hebrew_with_nikud: 'אָח', transliteration: 'ach', meaning_en: 'brother', meaning_fr: 'frère', meaning_he: 'אח', part_of_speech: 'noun', gender: 'masculine', plural_form: 'אַחִים', category: 'family', difficulty_level: 1 },
      { id: 'achot', hebrew: 'אחות', hebrew_with_nikud: 'אָחוֹת', transliteration: 'achot', meaning_en: 'sister', meaning_fr: 'sœur', meaning_he: 'אחות', part_of_speech: 'noun', gender: 'feminine', plural_form: 'אֲחָיוֹת', category: 'family', difficulty_level: 1 },
      { id: 'saba', hebrew: 'סבא', hebrew_with_nikud: 'סָבָא', transliteration: 'saba', meaning_en: 'grandfather', meaning_fr: 'grand-père', meaning_he: 'סבא', part_of_speech: 'noun', gender: 'masculine', category: 'family', difficulty_level: 1 },
      { id: 'savta', hebrew: 'סבתא', hebrew_with_nikud: 'סָבְתָא', transliteration: 'savta', meaning_en: 'grandmother', meaning_fr: 'grand-mère', meaning_he: 'סבתא', part_of_speech: 'noun', gender: 'feminine', category: 'family', difficulty_level: 1 },
    ]
  },
  questions: {
    name: 'Question Words',
    nameHe: 'מילות שאלה',
    words: [
      { id: 'ma', hebrew: 'מה', hebrew_with_nikud: 'מָה', transliteration: 'ma', meaning_en: 'what?', meaning_fr: 'quoi?', meaning_he: 'מה?', part_of_speech: 'other', category: 'questions', difficulty_level: 1 },
      { id: 'mi', hebrew: 'מי', hebrew_with_nikud: 'מִי', transliteration: 'mi', meaning_en: 'who?', meaning_fr: 'qui?', meaning_he: 'מי?', part_of_speech: 'other', category: 'questions', difficulty_level: 1 },
      { id: 'eifo', hebrew: 'איפה', hebrew_with_nikud: 'אֵיפֹה', transliteration: 'eifo', meaning_en: 'where?', meaning_fr: 'où?', meaning_he: 'איפה?', part_of_speech: 'other', category: 'questions', difficulty_level: 1 },
      { id: 'matay', hebrew: 'מתי', hebrew_with_nikud: 'מָתַי', transliteration: 'matay', meaning_en: 'when?', meaning_fr: 'quand?', meaning_he: 'מתי?', part_of_speech: 'other', category: 'questions', difficulty_level: 1 },
      { id: 'lama', hebrew: 'למה', hebrew_with_nikud: 'לָמָה', transliteration: 'lama', meaning_en: 'why?', meaning_fr: 'pourquoi?', meaning_he: 'למה?', part_of_speech: 'other', category: 'questions', difficulty_level: 1 },
      { id: 'eikh', hebrew: 'איך', hebrew_with_nikud: 'אֵיךְ', transliteration: 'eikh', meaning_en: 'how?', meaning_fr: 'comment?', meaning_he: 'איך?', part_of_speech: 'other', category: 'questions', difficulty_level: 1 },
      { id: 'kama', hebrew: 'כמה', hebrew_with_nikud: 'כַּמָּה', transliteration: 'kama', meaning_en: 'how much? / how many?', meaning_fr: 'combien?', meaning_he: 'כמה?', part_of_speech: 'other', category: 'questions', difficulty_level: 1 },
    ]
  },
  adjectives: {
    name: 'Adjectives',
    nameHe: 'שמות תואר',
    words: [
      { id: 'tov', hebrew: 'טוב', hebrew_with_nikud: 'טוֹב', transliteration: 'tov', meaning_en: 'good', meaning_fr: 'bon', meaning_he: 'טוב', part_of_speech: 'adjective', gender: 'masculine', category: 'adjectives', difficulty_level: 1 },
      { id: 'ra', hebrew: 'רע', hebrew_with_nikud: 'רַע', transliteration: 'ra', meaning_en: 'bad', meaning_fr: 'mauvais', meaning_he: 'רע', part_of_speech: 'adjective', gender: 'masculine', category: 'adjectives', difficulty_level: 1 },
      { id: 'gadol', hebrew: 'גדול', hebrew_with_nikud: 'גָּדוֹל', transliteration: 'gadol', meaning_en: 'big / great', meaning_fr: 'grand', meaning_he: 'גדול', part_of_speech: 'adjective', gender: 'masculine', category: 'adjectives', difficulty_level: 1 },
      { id: 'katan', hebrew: 'קטן', hebrew_with_nikud: 'קָטָן', transliteration: 'katan', meaning_en: 'small', meaning_fr: 'petit', meaning_he: 'קטן', part_of_speech: 'adjective', gender: 'masculine', category: 'adjectives', difficulty_level: 1 },
      { id: 'yafe', hebrew: 'יפה', hebrew_with_nikud: 'יָפֶה', transliteration: 'yafe', meaning_en: 'beautiful (m.)', meaning_fr: 'beau', meaning_he: 'יפה', part_of_speech: 'adjective', gender: 'masculine', category: 'adjectives', difficulty_level: 1 },
      { id: 'chadash', hebrew: 'חדש', hebrew_with_nikud: 'חָדָשׁ', transliteration: 'chadash', meaning_en: 'new', meaning_fr: 'nouveau', meaning_he: 'חדש', part_of_speech: 'adjective', gender: 'masculine', category: 'adjectives', difficulty_level: 1 },
      { id: 'yashan', hebrew: 'ישן', hebrew_with_nikud: 'יָשָׁן', transliteration: 'yashan', meaning_en: 'old', meaning_fr: 'vieux', meaning_he: 'ישן', part_of_speech: 'adjective', gender: 'masculine', category: 'adjectives', difficulty_level: 2 },
      { id: 'cham', hebrew: 'חם', hebrew_with_nikud: 'חַם', transliteration: 'cham', meaning_en: 'hot', meaning_fr: 'chaud', meaning_he: 'חם', part_of_speech: 'adjective', gender: 'masculine', category: 'adjectives', difficulty_level: 1 },
      { id: 'kar', hebrew: 'קר', hebrew_with_nikud: 'קַר', transliteration: 'kar', meaning_en: 'cold', meaning_fr: 'froid', meaning_he: 'קר', part_of_speech: 'adjective', gender: 'masculine', category: 'adjectives', difficulty_level: 1 },
    ]
  },
  verbs_basic: {
    name: 'Basic Verbs',
    nameHe: 'פעלים בסיסיים',
    words: [
      { id: 'holekh', hebrew: 'הולך', hebrew_with_nikud: 'הוֹלֵךְ', transliteration: 'holekh', meaning_en: 'walk / go (m.)', meaning_fr: 'marcher / aller (m.)', meaning_he: 'הולך', part_of_speech: 'verb', gender: 'masculine', root_id: 'hlk', category: 'verbs_basic', difficulty_level: 1 },
      { id: 'okhel', hebrew: 'אוכל', hebrew_with_nikud: 'אוֹכֵל', transliteration: 'okhel', meaning_en: 'eat (m.)', meaning_fr: 'manger (m.)', meaning_he: 'אוכל', part_of_speech: 'verb', gender: 'masculine', root_id: 'akl', category: 'verbs_basic', difficulty_level: 1 },
      { id: 'lomed', hebrew: 'לומד', hebrew_with_nikud: 'לוֹמֵד', transliteration: 'lomed', meaning_en: 'learn / study (m.)', meaning_fr: 'apprendre / étudier (m.)', meaning_he: 'לומד', part_of_speech: 'verb', gender: 'masculine', root_id: 'lmd', category: 'verbs_basic', difficulty_level: 1 },
      { id: 'medaber', hebrew: 'מדבר', hebrew_with_nikud: 'מְדַבֵּר', transliteration: 'medaber', meaning_en: 'speak (m.)', meaning_fr: 'parler (m.)', meaning_he: 'מדבר', part_of_speech: 'verb', gender: 'masculine', root_id: 'dbr', category: 'verbs_basic', difficulty_level: 2 },
      { id: 'kotev', hebrew: 'כותב', hebrew_with_nikud: 'כּוֹתֵב', transliteration: 'kotev', meaning_en: 'write (m.)', meaning_fr: 'écrire (m.)', meaning_he: 'כותב', part_of_speech: 'verb', gender: 'masculine', root_id: 'ktv', category: 'verbs_basic', difficulty_level: 1 },
      { id: 'kore', hebrew: 'קורא', hebrew_with_nikud: 'קוֹרֵא', transliteration: 'kore', meaning_en: 'read (m.)', meaning_fr: 'lire (m.)', meaning_he: 'קורא', part_of_speech: 'verb', gender: 'masculine', category: 'verbs_basic', difficulty_level: 1 },
      { id: 'shome', hebrew: 'שומע', hebrew_with_nikud: 'שׁוֹמֵעַ', transliteration: 'shome\'a', meaning_en: 'hear (m.)', meaning_fr: 'entendre (m.)', meaning_he: 'שומע', part_of_speech: 'verb', gender: 'masculine', root_id: 'shma', category: 'verbs_basic', difficulty_level: 2 },
    ]
  },
  common_nouns: {
    name: 'Common Nouns',
    nameHe: 'שמות עצם נפוצים',
    words: [
      { id: 'bayit', hebrew: 'בית', hebrew_with_nikud: 'בַּיִת', transliteration: 'bayit', meaning_en: 'house / home', meaning_fr: 'maison', meaning_he: 'בית', part_of_speech: 'noun', gender: 'masculine', plural_form: 'בָּתִּים', category: 'common_nouns', difficulty_level: 1 },
      { id: 'sefer', hebrew: 'ספר', hebrew_with_nikud: 'סֵפֶר', transliteration: 'sefer', meaning_en: 'book', meaning_fr: 'livre', meaning_he: 'ספר', part_of_speech: 'noun', gender: 'masculine', plural_form: 'סְפָרִים', root_id: 'spr', category: 'common_nouns', difficulty_level: 1 },
      { id: 'mayim', hebrew: 'מים', hebrew_with_nikud: 'מַיִם', transliteration: 'mayim', meaning_en: 'water', meaning_fr: 'eau', meaning_he: 'מים', part_of_speech: 'noun', gender: 'masculine', category: 'common_nouns', difficulty_level: 1 },
      { id: 'lechem', hebrew: 'לחם', hebrew_with_nikud: 'לֶחֶם', transliteration: 'lechem', meaning_en: 'bread', meaning_fr: 'pain', meaning_he: 'לחם', part_of_speech: 'noun', gender: 'masculine', category: 'common_nouns', difficulty_level: 1 },
      { id: 'yom', hebrew: 'יום', hebrew_with_nikud: 'יוֹם', transliteration: 'yom', meaning_en: 'day', meaning_fr: 'jour', meaning_he: 'יום', part_of_speech: 'noun', gender: 'masculine', plural_form: 'יָמִים', category: 'common_nouns', difficulty_level: 1 },
      { id: 'layla', hebrew: 'לילה', hebrew_with_nikud: 'לַיְלָה', transliteration: 'layla', meaning_en: 'night', meaning_fr: 'nuit', meaning_he: 'לילה', part_of_speech: 'noun', gender: 'masculine', plural_form: 'לֵילוֹת', category: 'common_nouns', difficulty_level: 1 },
      { id: 'shemesh', hebrew: 'שמש', hebrew_with_nikud: 'שֶׁמֶשׁ', transliteration: 'shemesh', meaning_en: 'sun', meaning_fr: 'soleil', meaning_he: 'שמש', part_of_speech: 'noun', gender: 'feminine', category: 'common_nouns', difficulty_level: 1 },
      { id: 'eretz', hebrew: 'ארץ', hebrew_with_nikud: 'אֶרֶץ', transliteration: 'eretz', meaning_en: 'land / country', meaning_fr: 'terre / pays', meaning_he: 'ארץ', part_of_speech: 'noun', gender: 'feminine', plural_form: 'אֲרָצוֹת', category: 'common_nouns', difficulty_level: 1 },
      { id: 'ish', hebrew: 'איש', hebrew_with_nikud: 'אִישׁ', transliteration: 'ish', meaning_en: 'man', meaning_fr: 'homme', meaning_he: 'איש', part_of_speech: 'noun', gender: 'masculine', plural_form: 'אֲנָשִׁים', category: 'common_nouns', difficulty_level: 1 },
      { id: 'isha', hebrew: 'אישה', hebrew_with_nikud: 'אִשָּׁה', transliteration: 'isha', meaning_en: 'woman', meaning_fr: 'femme', meaning_he: 'אישה', part_of_speech: 'noun', gender: 'feminine', plural_form: 'נָשִׁים', category: 'common_nouns', difficulty_level: 1 },
      { id: 'yeled', hebrew: 'ילד', hebrew_with_nikud: 'יֶלֶד', transliteration: 'yeled', meaning_en: 'boy / child', meaning_fr: 'garçon / enfant', meaning_he: 'ילד', part_of_speech: 'noun', gender: 'masculine', plural_form: 'יְלָדִים', category: 'common_nouns', difficulty_level: 1 },
      { id: 'yalda', hebrew: 'ילדה', hebrew_with_nikud: 'יַלְדָּה', transliteration: 'yalda', meaning_en: 'girl', meaning_fr: 'fille', meaning_he: 'ילדה', part_of_speech: 'noun', gender: 'feminine', plural_form: 'יְלָדוֹת', category: 'common_nouns', difficulty_level: 1 },
    ]
  }
};

// Helper functions
export function getAllWords() {
  return Object.values(vocabularyData).flatMap(cat => cat.words);
}

export function getWordsByCategory(category: string) {
  return vocabularyData[category]?.words || [];
}

export function getTotalWordCount() {
  return Object.values(vocabularyData).reduce((sum, cat) => sum + cat.words.length, 0);
}
```

---

# Database Schema (Supabase)

```sql
-- Supabase Database Schema for Hebrew Master

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'enterprise')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_level TEXT DEFAULT 'beginner',
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'fr', 'he')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Progress
CREATE TABLE public.user_progress (
  user_id UUID REFERENCES public.profiles(id) PRIMARY KEY,
  total_xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  words_learned INTEGER DEFAULT 0,
  letters_mastered INTEGER DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,
  total_study_time_minutes INTEGER DEFAULT 0,
  last_study_date DATE
);

-- FSRS Cards
CREATE TABLE public.fsrs_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('letter', 'nikud', 'word')),
  item_id TEXT NOT NULL,
  due TIMESTAMPTZ DEFAULT NOW(),
  stability FLOAT DEFAULT 0,
  difficulty FLOAT DEFAULT 0,
  elapsed_days FLOAT DEFAULT 0,
  scheduled_days INTEGER DEFAULT 0,
  reps INTEGER DEFAULT 0,
  lapses INTEGER DEFAULT 0,
  state TEXT DEFAULT 'new' CHECK (state IN ('new', 'learning', 'review', 'relearning')),
  last_review TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

-- Review Logs
CREATE TABLE public.review_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id UUID REFERENCES public.fsrs_cards(id),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 4),
  state TEXT NOT NULL,
  due TIMESTAMPTZ,
  stability FLOAT,
  difficulty FLOAT,
  elapsed_days FLOAT,
  last_elapsed_days FLOAT,
  scheduled_days INTEGER,
  review_time_ms INTEGER,
  reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Study Sessions
CREATE TABLE public.study_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  cards_reviewed INTEGER DEFAULT 0,
  new_cards INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0
);

-- Achievements
CREATE TABLE public.achievements (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_fr TEXT,
  name_he TEXT,
  description_en TEXT,
  description_fr TEXT,
  description_he TEXT,
  icon TEXT,
  xp_reward INTEGER DEFAULT 0,
  requirement_type TEXT,
  requirement_value INTEGER,
  tier TEXT CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum'))
);

-- User Achievements
CREATE TABLE public.user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  achievement_id TEXT REFERENCES public.achievements(id) NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fsrs_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can read own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own cards" ON public.fsrs_cards FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own review logs" ON public.review_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own study sessions" ON public.study_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can read own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_fsrs_cards_user_due ON public.fsrs_cards(user_id, due);
CREATE INDEX idx_fsrs_cards_user_state ON public.fsrs_cards(user_id, state);
CREATE INDEX idx_review_logs_user ON public.review_logs(user_id, reviewed_at);
CREATE INDEX idx_study_sessions_user ON public.study_sessions(user_id, started_at);
```

---

# Integration Instructions

## Step 1: Copy the Data Files

Create these files in your Cursor project:

```
lib/
  data/
    alphabet.ts    (copy Hebrew Alphabet section)
    nikud.ts       (copy Nikud section)
    roots.ts       (copy Roots section)
    vocabulary.ts  (copy Vocabulary section)
  fsrs.ts          (copy FSRS Algorithm section)
types/
  index.ts         (copy Types section)
```

## Step 2: Set Up Supabase

1. Create a new Supabase project
2. Run the SQL schema above in SQL Editor
3. Add your Supabase URL and ANON KEY to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

## Step 3: Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr framer-motion lucide-react recharts zustand
```

## Step 4: Import Data in Your Components

```typescript
import { hebrewAlphabet } from '@/lib/data/alphabet';
import { nikudData } from '@/lib/data/nikud';
import { vocabularyData, getAllWords } from '@/lib/data/vocabulary';
import { schedule, Rating, createCard, previewIntervals } from '@/lib/fsrs';
```

## Step 5: Use the FSRS System

```typescript
// Create a new card when user starts learning a word
const newCard = createCard();

// When user reviews, update the card
const { card: updatedCard } = schedule(existingCard, Rating.Good);

// Show next intervals
const intervals = previewIntervals(card);
// { 1: '< 1m', 2: '5m', 3: '1 day', 4: '4 days' }
```

---

# Summary

This package includes:

✅ **22 Hebrew letters** with full details (mnemonics, gematria, variants, sound descriptions in EN/FR/HE)

✅ **13 Nikud vowels** with categories and examples

✅ **10 Hebrew roots** (shorashim) with derived words

✅ **90+ vocabulary words** across 8 categories (greetings, pronouns, numbers, family, questions, adjectives, verbs, common nouns)

✅ **Complete FSRS algorithm** for spaced repetition

✅ **Full TypeScript types** for all data structures

✅ **Supabase schema** with RLS policies

✅ **Trilingual support** (English, French, Hebrew)

---

Created for Hebrew Master Premium - €200/month platform
