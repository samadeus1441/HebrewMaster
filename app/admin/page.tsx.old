"use client"
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function UploadLesson() {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setMessage('⏳ מעלה...')

    try {
      const fileName = `${Date.now()}-${file.name}`
      
      const { error } = await supabase.storage
        .from('lessons')
        .upload(fileName, file)

      if (error) throw error

      setMessage('✅ הקובץ הועלה!')
      setTimeout(() => alert('בדוק ב-Table Editor'), 2000)

    } catch (error: any) {
      setMessage(`❌ ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', direction: 'rtl', backgroundColor: '#f5f5f5' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxWidth: '500px', width: '100%' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '30px', textAlign: 'center' }}>העלאת שיעור</h1>
        
        <label style={{ display: 'block', border: '2px dashed #ccc', borderRadius: '10px', padding: '40px', cursor: uploading ? 'not-allowed' : 'pointer', textAlign: 'center' }}>
          <input type="file" accept="audio/*,video/*" onChange={handleUpload} disabled={uploading} style={{ display: 'none' }} />
          <div style={{ fontSize: '60px' }}>📤</div>
          <div style={{ fontSize: '20px', marginTop: '10px' }}>{uploading ? '⏳ מעלה...' : 'לחץ לבחירת קובץ'}</div>
        </label>

        {message && <div style={{ marginTop: '20px', padding: '15px', borderRadius: '8px', backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da', color: message.includes('✅') ? '#155724' : '#721c24' }}>{message}</div>}
      </div>
    </div>
  )
}
