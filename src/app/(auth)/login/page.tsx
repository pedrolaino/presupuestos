'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileText } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError('Email o contraseña incorrectos.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Marca */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#1e3a5f] text-white rounded-xl p-3 mb-3">
            <FileText className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">Presu</h1>
          <p className="text-slate-500 text-sm mt-1">Tu herramienta de presupuestos</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Iniciar sesión</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
              Ingresar
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            ¿No tenés cuenta?{' '}
            <Link href="/register" className="text-[#1e3a5f] font-medium hover:underline">
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
