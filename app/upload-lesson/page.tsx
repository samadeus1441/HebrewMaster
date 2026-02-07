"use client"
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function UploadLesson() {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClientComponentClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setMessage('⏳ מעלה...')

    try {
      const fileName = `${Date.now()}-${file.name}`
      
      // 1. העלה ל-Storage
      const { error: uploadError } = await supabase.storage
        .from('lessons')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      setMessage('📤 מתחיל תמלול...')

      // 2. קרא ל-Function
      const { error: fnError } = await supabase.functions.invoke('transcribe-lesson', {
        body: {
          record: {
            name: fileName,
            bucket_id: 'lessons'
          }
        }
      })

      if (fnError) throw fnError

      setMessage('✅ התמליל התחיל!')
      setTimeout(() => alert('הקובץ עובד! בדוק ב-Table Editor'), 2000)

    } catch (error: any) {
      setMessage(`❌ ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center', direction: 'rtl' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '30px' }}>העלאת שיעור</h1>
      
      <label style={{
        display: 'block',
        border: '2px dashed #ccc',
        borderRadius: '10px',
        padding: '40px',
        cursor: 'pointer'
      }}>
        <input
          type="file"
          accept="audio/*,video/*"
          onChange={handleUpload}
          disabled={uploading}
          style={{ display: 'none' }}
        />
        <div style={{ fontSize: '60px' }}>📤</div>
        <div style={{ fontSize: '20px', marginTop: '10px' }}>
          {uploading ? '⏳ מעלה...' : 'לחץ לבחירת קובץ'}
        </div>
      </label>

      {message && (
        <div style={{
          marginTop: '20px',
          padding: '20px',
          borderRadius: '8px',
          backgroundColor: message.includes('✅') ? '#d4edda' : message.includes('❌') ? '#f8d7da' : '#cce5ff',
          color: message.includes('✅') ? '#155724' : message.includes('❌') ? '#721c24' : '#004085'
        }}>
          {message}
        </div>
      )}
    </div>
  )
}
