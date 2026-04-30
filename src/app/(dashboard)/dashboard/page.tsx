import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, Users, Plus, TrendingUp, AlertCircle } from 'lucide-react'
import { formatCurrency, padQuoteNumber, formatDate } from '@/lib/utils'
import type { Quote } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: quotes }, { count: clientCount }, { data: profile }] = await Promise.all([
    supabase
      .from('quotes')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user!.id),
    supabase
      .from('profiles')
      .select('business_name, first_name')
      .eq('user_id', user!.id)
      .single(),
  ])

  const profileIncomplete = !profile?.business_name || !profile?.first_name
  const totalAmount = (quotes as Quote[] | null)?.reduce((sum, q) => sum + q.total, 0) ?? 0

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* Incomplete profile banner */}
      {profileIncomplete && (
        <div className="bg-warning-bg border border-warning/20 rounded-xl px-4 py-3.5 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-warning">Completá tu perfil</p>
            <p className="text-xs text-warning/80 mt-0.5">
              Agregá los datos de tu negocio para que aparezcan en tus presupuestos.
            </p>
          </div>
          <Link href="/perfil" className="shrink-0">
            <Button variant="ghost" size="sm" className="text-warning hover:bg-warning/10 hover:text-warning border border-warning/20">
              Completar
            </Button>
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink">Panel principal</h1>
          <p className="text-ink-2 text-sm mt-0.5">
            {profile?.first_name ? `Hola, ${profile.first_name}.` : 'Bienvenido a Presu.'}
          </p>
        </div>
        <Link href="/presupuestos/nuevo" className="shrink-0">
          <Button size="sm" className="sm:hidden">
            <Plus className="w-4 h-4" />
            Nuevo
          </Button>
          <Button className="hidden sm:inline-flex">
            <Plus className="w-4 h-4" />
            Nuevo presupuesto
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { icon: FileText, value: quotes?.length ?? 0, label: 'Recientes' },
          { icon: Users, value: clientCount ?? 0, label: 'Clientes' },
          { icon: TrendingUp, value: formatCurrency(totalAmount), label: 'Últimos 5' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="py-4 sm:py-5 px-4 sm:px-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                <div className="bg-rust-light text-rust rounded-lg p-2 sm:p-2.5">
                  <stat.icon className="w-4 h-4 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold text-ink truncate"
                    style={{ fontFamily: i === 2 ? 'var(--loaded-dm-mono, monospace)' : undefined }}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-ink-2 leading-tight">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent quotes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-ink">Últimos presupuestos</h2>
          <Link
            href="/presupuestos"
            className="text-sm text-rust hover:text-rust-dark transition-colors font-medium"
          >
            Ver todos →
          </Link>
        </div>

        {!quotes || quotes.length === 0 ? (
          <Card>
            <CardContent className="py-14 text-center">
              <div className="w-12 h-12 rounded-xl bg-rust-light flex items-center justify-center mx-auto mb-4">
                <FileText className="w-5 h-5 text-rust" />
              </div>
              <p className="text-ink font-medium mb-1">Aún no hay presupuestos</p>
              <p className="text-ink-2 text-sm mb-6">Creá tu primer presupuesto en menos de 3 minutos.</p>
              <Link href="/presupuestos/nuevo">
                <Button variant="secondary" size="sm">
                  <Plus className="w-4 h-4" />
                  Crear el primero
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="divide-y divide-border">
              {(quotes as Quote[]).map((quote) => (
                <Link
                  key={quote.id}
                  href={`/presupuestos/${quote.id}`}
                  className="flex items-center justify-between px-4 sm:px-6 py-3.5 hover:bg-cream transition-colors gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="text-xs text-ink-3 shrink-0 tabular-nums"
                      style={{ fontFamily: 'var(--loaded-dm-mono, monospace)' }}
                    >
                      {padQuoteNumber(quote.quote_number)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink truncate group-hover:text-rust transition-colors">
                        {quote.client_name}
                      </p>
                      <p className="text-xs text-ink-3">{formatDate(quote.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:gap-4 shrink-0">
                    <StatusBadge status={quote.status} />
                    <span
                      className="text-sm font-semibold text-ink tabular-nums"
                      style={{ fontFamily: 'var(--loaded-dm-mono, monospace)' }}
                    >
                      {formatCurrency(quote.total)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    borrador: 'bg-cream text-ink-2 border-border',
    enviado: 'bg-info-bg text-info border-info/20',
    aprobado: 'bg-success-bg text-success border-success/20',
    rechazado: 'bg-danger-bg text-danger border-danger/20',
  }
  const labels: Record<string, string> = {
    borrador: 'Borrador',
    enviado: 'Enviado',
    aprobado: 'Aprobado',
    rechazado: 'Rechazado',
  }
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${styles[status] ?? styles.borrador}`}>
      {labels[status] ?? status}
    </span>
  )
}
