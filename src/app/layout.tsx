import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, DM_Mono } from 'next/font/google'
import { ProgressBar } from '@/components/progress-bar'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--loaded-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--loaded-dm-sans',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--loaded-dm-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Presu — Presupuestos profesionales',
  description: 'Generá presupuestos profesionales en segundos. Gratis, sin complicaciones.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body style={{ fontFamily: 'var(--loaded-dm-sans, DM Sans, system-ui, sans-serif)' }}>
        <ProgressBar />
        {children}
      </body>
    </html>
  )
}
