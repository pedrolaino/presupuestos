import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ProgressBar } from '@/components/progress-bar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="es">
      <body className={inter.className}>
        <ProgressBar />
        {children}
      </body>
    </html>
  )
}
