/**
 * Hebrew Vocabulary Seeding Script
 * 
 * This script inserts Hebrew vocabulary words from a JSON object
 * into the Supabase vocabulary table, handling duplicates gracefully.
 * 
 * Usage:
 * 1. Import your vocabulary JSON into the VOCAB_DATA constant below
 * 2. Run: npx tsx lib/seed-vocab.ts
 * 
 * Prerequisites:
 * - Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment variables
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// ============================================================================
// VOCABULARY DATA
// Paste your JSON array of Hebrew words here
// Expected format: Array of { hebrew, hebrew_unpointed, transliteration, ... }
// ============================================================================
const VOCAB_DATA: Array<{
  hebrew: string
  hebrew_unpointed: string
  transliteration?: string
  meaning_en: string
  meaning_fr?: string
  part_of_speech?: string
  gender?: string
  root_letters?: string
  audio_url?: string
  difficulty_level?: number
}> = [
  // Example entry (replace with your actual data):
  // {
  //   hebrew: 'כָּתַב',
  //   hebrew_unpointed: 'כתב',
  //   transliteration: 'katav',
  //   meaning_en: 'to write',
  //   meaning_fr: 'écrire',
  //   part_of_speech: 'verb',
  //   root_letters: 'כתב'
  // }
]

// ============================================================================
// CONFIGURATION
// ============================================================================
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Missing environment variables. Please set:\n' +
    '- SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL\n' +
    '- SUPABASE_SERVICE_ROLE_KEY'
  )
}

// Create Supabase admin client (bypasses RLS)
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// ============================================================================
// SEEDING FUNCTIONS
// ============================================================================

/**
 * Ensures a root exists in the database, returns its ID
 */
async function ensureRoot(rootLetters: string | undefined): Promise<string | null> {
  if (!rootLetters || rootLetters.trim() === '') {
    return null
  }

  const trimmedRoot = rootLetters.trim()

  // Check if root exists
  const { data: existingRoot, error: fetchError } = await supabase
    .from('roots')
    .select('id')
    .eq('root_letters', trimmedRoot)
    .single()

  if (existingRoot) {
    return existingRoot.id
  }

  // Create new root if it doesn't exist
  const { data: newRoot, error: insertError } = await supabase
    .from('roots')
    .insert({
      root_letters: trimmedRoot,
      core_meaning_en: null,
      core_meaning_fr: null
    })
    .select('id')
    .single()

  if (insertError) {
    console.error(`Failed to create root "${trimmedRoot}":`, insertError.message)
    return null
  }

  return newRoot.id
}

/**
 * Inserts vocabulary word, checking for duplicates
 */
async function insertVocabularyWord(word: typeof VOCAB_DATA[0]): Promise<boolean> {
  try {
    // Resolve root_id if root_letters is provided
    let rootId: string | null = null
    if (word.root_letters) {
      rootId = await ensureRoot(word.root_letters)
    }

    // Check for duplicate (using unique index: hebrew_unpointed + meaning_en + part_of_speech)
    const { data: existing } = await supabase
      .from('vocabulary')
      .select('id, hebrew')
      .eq('hebrew_unpointed', word.hebrew_unpointed)
      .eq('meaning_en', word.meaning_en)
      .eq('part_of_speech', word.part_of_speech || null)
      .maybeSingle()

    if (existing) {
      console.log(`⚠️  Skipping duplicate: ${word.hebrew} (${word.meaning_en})`)
      return false
    }

    // Insert new vocabulary word
    const { data, error } = await supabase
      .from('vocabulary')
      .insert({
        hebrew: word.hebrew,
        hebrew_unpointed: word.hebrew_unpointed,
        transliteration: word.transliteration || null,
        meaning_en: word.meaning_en,
        meaning_fr: word.meaning_fr || null,
        part_of_speech: word.part_of_speech || null,
        gender: word.gender || null,
        root_id: rootId,
        audio_url: word.audio_url || null,
        difficulty_level: word.difficulty_level || 1
      })
      .select('id')
      .single()

    if (error) {
      console.error(`❌ Failed to insert "${word.hebrew}":`, error.message)
      return false
    }

    console.log(`✅ Inserted: ${word.hebrew} (${word.meaning_en})`)
    return true

  } catch (error) {
    console.error(`❌ Error processing "${word.hebrew}":`, error)
    return false
  }
}

/**
 * Main seeding function
 */
async function seedVocabulary() {
  if (VOCAB_DATA.length === 0) {
    console.warn('⚠️  VOCAB_DATA is empty. Please add vocabulary data to the JSON array.')
    return
  }

  console.log(`\n🌱 Starting vocabulary seeding...`)
  console.log(`📊 Total words to process: ${VOCAB_DATA.length}\n`)

  let successCount = 0
  let skipCount = 0
  let errorCount = 0

  // Process words in batches to avoid overwhelming the database
  const BATCH_SIZE = 50
  for (let i = 0; i < VOCAB_DATA.length; i += BATCH_SIZE) {
    const batch = VOCAB_DATA.slice(i, i + BATCH_SIZE)
    const batchPromises = batch.map(word => insertVocabularyWord(word))

    const results = await Promise.all(batchPromises)

    results.forEach(result => {
      if (result === true) {
        successCount++
      } else {
        // Could be duplicate (skip) or error
        skipCount++
      }
    })

    console.log(`📦 Processed batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(VOCAB_DATA.length / BATCH_SIZE)}\n`)
  }

  // Final summary
  console.log('\n' + '='.repeat(50))
  console.log('📈 Seeding Summary:')
  console.log(`✅ Successfully inserted: ${successCount}`)
  console.log(`⚠️  Skipped (duplicates): ${skipCount - errorCount}`)
  console.log(`❌ Errors: ${errorCount}`)
  console.log(`📊 Total processed: ${VOCAB_DATA.length}`)
  console.log('='.repeat(50) + '\n')
}

// ============================================================================
// EXECUTION
// ============================================================================
if (require.main === module) {
  seedVocabulary()
    .then(() => {
      console.log('✨ Seeding complete!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error)
      process.exit(1)
    })
}

export { seedVocabulary, insertVocabularyWord, ensureRoot }
