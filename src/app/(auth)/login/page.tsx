'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight } from 'lucide-react'

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
    <div className="min-h-screen bg-cream flex">
      {/* Left panel: decorative */}
      <div className="hidden lg:flex lg:w-[45%] bg-ink flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-rust/20 flex items-center justify-center">
            <span
              className="text-rust font-bold text-base"
              style={{ fontFamily: 'var(--loaded-playfair, Georgia, serif)' }}
            >
              P
            </span>
          </div>
          <span
            className="font-semibold text-surface text-lg"
            style={{ fontFamily: 'var(--loaded-playfair, Georgia, serif)' }}
          >
            Presu
          </span>
        </Link>

        <div>
          <p
            className="text-4xl font-bold text-surface leading-tight mb-4"
            style={{ fontFamily: 'var(--loaded-playfair, Georgia, serif)' }}
          >
            "El mejor momento para
            <br />
            <span className="text-rust italic">verse profesional</span>
            <br />
            es ahora."
          </p>
          <p className="text-surface/40 text-sm">
            Presupuestos que hablan bien de vos.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Gratis', value: '100%' },
            { label: 'PDFs', value: '∞' },
            { label: 'Clientes', value: '∞' },
          ].map((s) => (
            <div key={s.label} className="bg-sidebar-surface rounded-xl p-4 border border-sidebar-border">
              <div
                className="text-2xl font-bold text-rust mb-0.5"
                style={{ fontFamily: 'var(--loaded-playfair, Georgia, serif)' }}
              >
                {s.value}
              </div>
              <div className="text-surface/40 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel: form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-lg bg-rust/15 flex items-center justify-center">
            <span
              className="text-rust font-bold text-base"
              style={{ fontFamily: 'var(--loaded-playfair, Georgia, serif)' }}
            >
              P
            </span>
          </div>
          <span
            className="font-semibold text-ink text-lg"
            style={{ fontFamily: 'var(--loaded-playfair, Georgia, serif)' }}
          >
            Presu
          </span>
        </Link>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-ink mb-1.5">Bienvenido de vuelta</h1>
            <p className="text-ink-2 text-sm">Ingresá para ver tus presupuestos.</p>
          </div>

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
              <div className="bg-danger-bg border border-danger/20 text-danger text-sm px-4 py-2.5 rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" loading={loading} className="mt-1 w-full gap-2">
              Ingresar
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-ink-2 mt-7">
            ¿No tenés cuenta?{' '}
            <Link href="/register" className="text-rust font-medium hover:text-rust-dark transition-colors underline underline-offset-2">
              Registrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
