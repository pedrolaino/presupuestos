import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ProgressBar } from '@/components/progress-bar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PresupuestoPro',
  description: 'Generá presupuestos profesionales en segundos',
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
