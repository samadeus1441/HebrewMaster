import type { Metadata } from 'next'
import { Heebo, Frank_Ruhl_Libre } from 'next/font/google'
import './globals.css'

const heebo = Heebo({
  subsets: ['latin', 'hebrew'],
  variable: '--font-heebo',
  display: 'swap',
})

const frankRuhlLibre = Frank_Ruhl_Libre({
  subsets: ['latin', 'hebrew'],
  variable: '--font-frank-ruhl-libre',
  weight: ['400', '500', '700', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Hebrew Master - Premium LMS',
  description: 'High-fidelity Hebrew language learning platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${heebo.variable} ${frankRuhlLibre.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
