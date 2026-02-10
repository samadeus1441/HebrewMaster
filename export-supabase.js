const SUPABASE_URL = 'https://zetczjqsavwzprrwyrpl.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpldGN6anFzYXZ3enBycnd5cnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1ODg1ODAsImV4cCI6MjA4NDE2NDU4MH0.Y9vBmsfDq2274GvVtW7PRB3hH48UCx0uyTeGwtt6qnA'

// First, list all tables
async function listTables() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  })
  const text = await response.text()
  console.log('Available endpoints:', text)
}

listTables()
