"use client"
import { useState } from 'react'

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
      
      // 1. העלה ישירות ל-Storage
      const uploadRes = await fetch(
        `https://zetczjqsavwzprrwyrpl.supabase.co/storage/v1/object/lessons/${fileName}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': file.type
          },
          body: file
        }
      )

      if (!uploadRes.ok) throw new Error('Upload failed')

      setMessage('📤 מתחיל תמלול...')

      // 2. קרא ל-Function ישירות עם fetch
      const functionRes = await fetch(
        'https://zetczjqsavwzprrwyrpl.supabase.co/functions/v1/transcribe-lesson',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            record: {
              name: fileName,
              bucket_id: 'lessons'
            }
          })
        }
      )

      if (!functionRes.ok) {
        const error = await functionRes.text()
        throw new Error(error)
      }

      const result = await functionRes.json()
      setMessage(`✅ התמליל התחיל! Job ID: ${result.job_id}`)
      
      setTimeout(() => {
        alert('בדוק את Table Editor - lessons')
      }, 2000)

    } catch (error: any) {
      setMessage(`❌ ${error.message}`)
      console.error('Full error:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      direction: 'rtl',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <h1 style={{ fontSize: '32px', marginBottom: '30px', textAlign: 'center' }}>
          העלאת שיעור
        </h1>
        
        <label style={{
          display: 'block',
          border: '2px dashed #ccc',
          borderRadius: '10px',
          padding: '40px',
          cursor: uploading ? 'not-allowed' : 'pointer',
          textAlign: 'center',
          backgroundColor: uploading ? '#f9f9f9' : 'white'
        }}>
          <input
            type="file"
            accept="audio/*,video/*"
            onChange={handleUpload}
            disabled={uploading}
            style={{ display: 'none' }}
          />
          <div style={{ fontSize: '60px' }}>📤</div>
          <div style={{ fontSize: '20px', marginTop: '10px', fontWeight: '500' }}>
            {uploading ? '⏳ מעלה...' : 'לחץ לבחירת קובץ'}
          </div>
          <div style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
            MP3, M4A, WAV, MP4
          </div>
        </label>

        {message && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            borderRadius: '8px',
            backgroundColor: message.includes('✅') ? '#d4edda' : 
                           message.includes('❌') ? '#f8d7da' : '#cce5ff',
            color: message.includes('✅') ? '#155724' : 
                   message.includes('❌') ? '#721c24' : '#004085',
            fontSize: '14px'
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
