'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function validate(): string | null {
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.'
    if (password !== confirmPassword) return 'Las contraseñas no coinciden.'
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        setError('Ya existe una cuenta con ese email.')
      } else {
        setError('Ocurrió un error al crear la cuenta. Intentá de nuevo.')
      }
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="bg-surface rounded-3xl border border-border shadow-lg shadow-ink/5 p-10">
            <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h2
              className="text-2xl font-bold text-ink mb-2"
              style={{ fontFamily: 'var(--loaded-playfair, Georgia, serif)' }}
            >
              ¡Cuenta creada!
            </h2>
            <p className="text-ink-2 text-sm mb-8 leading-relaxed">
              Te enviamos un email de confirmación a{' '}
              <strong className="text-ink">{email}</strong>.{' '}
              Revisá tu bandeja de entrada y hacé click en el enlace para activar tu cuenta.
            </p>
            <Link href="/login">
              <Button variant="secondary" className="w-full">
                Ir al inicio de sesión
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-ink flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2.5">
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
          <h2
            className="text-4xl font-bold text-surface leading-tight mb-4"
            style={{ fontFamily: 'var(--loaded-playfair, Georgia, serif)' }}
          >
            Tu negocio merece
            <br />
            <span className="text-rust italic">verse bien.</span>
          </h2>
          <ul className="space-y-3 mt-6">
            {[
              'Presupuestos en PDF en minutos',
              'Clientes guardados automáticamente',
              'Historial completo y descargable',
              'Gratis, sin límites, sin tarjeta',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-surface/60 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-rust shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-sidebar-surface rounded-xl p-5 border border-sidebar-border">
          <p className="text-surface/40 text-xs mb-1">Tiempo promedio para el primer PDF</p>
          <p
            className="text-3xl font-bold text-rust"
            style={{ fontFamily: 'var(--loaded-playfair, Georgia, serif)' }}
          >
            {"< 3 min"}
          </p>
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
            <h1 className="text-2xl font-bold text-ink mb-1.5">Crear cuenta gratis</h1>
            <p className="text-ink-2 text-sm">Sin tarjeta de crédito. Sin complicaciones.</p>
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
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <Input
              label="Confirmar contraseña"
              type="password"
              placeholder="Repetí tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            {error && (
              <div className="bg-danger-bg border border-danger/20 text-danger text-sm px-4 py-2.5 rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" loading={loading} className="mt-1 w-full gap-2">
              Crear cuenta
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-ink-2 mt-7">
            ¿Ya tenés cuenta?{' '}
            <Link href="/login" className="text-rust font-medium hover:text-rust-dark transition-colors underline underline-offset-2">
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
