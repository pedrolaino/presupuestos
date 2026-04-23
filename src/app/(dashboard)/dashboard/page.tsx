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
      {/* Banner perfil incompleto */}
      {profileIncomplete && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-amber-800">Completá tu perfil</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Agregá los datos de tu negocio para que aparezcan en tus presupuestos.
            </p>
          </div>
          <Link href="/perfil" className="shrink-0">
            <Button variant="secondary" size="sm" className="border-amber-300 text-amber-800 hover:bg-amber-100">
              Completar
            </Button>
          </Link>
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Panel principal</h1>
          <p className="text-slate-500 text-sm mt-1">Bienvenido a PresupuestoPro</p>
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
        <Card>
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 py-4 sm:py-5 px-4 sm:px-6">
            <div className="bg-blue-50 text-[#1e3a5f] rounded-lg p-2 sm:p-2.5">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-slate-900">{quotes?.length ?? 0}</p>
              <p className="text-xs sm:text-sm text-slate-500 leading-tight">Presupuestos recientes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 py-4 sm:py-5 px-4 sm:px-6">
            <div className="bg-blue-50 text-[#1e3a5f] rounded-lg p-2 sm:p-2.5">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-slate-900">{clientCount ?? 0}</p>
              <p className="text-xs sm:text-sm text-slate-500 leading-tight">Clientes guardados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 py-4 sm:py-5 px-4 sm:px-6">
            <div className="bg-blue-50 text-[#1e3a5f] rounded-lg p-2 sm:p-2.5">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 truncate">{formatCurrency(totalAmount)}</p>
              <p className="text-xs sm:text-sm text-slate-500 leading-tight">Monto últimos 5</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent quotes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900">Últimos presupuestos</h2>
          <Link href="/presupuestos" className="text-sm text-[#1e3a5f] hover:underline">
            Ver todos
          </Link>
        </div>

        {!quotes || quotes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Todavía no generaste ningún presupuesto.</p>
              <Link href="/presupuestos/nuevo" className="mt-4 inline-block">
                <Button variant="secondary" size="sm">
                  <Plus className="w-4 h-4" />
                  Crear el primero
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="divide-y divide-slate-100">
              {(quotes as Quote[]).map((quote) => (
                <Link
                  key={quote.id}
                  href={`/presupuestos/${quote.id}`}
                  className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono text-slate-400 shrink-0">
                      {padQuoteNumber(quote.quote_number)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{quote.client_name}</p>
                      <p className="text-xs text-slate-500">{formatDate(quote.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-4 shrink-0">
                    <StatusBadge status={quote.status} />
                    <span className="text-sm font-semibold text-slate-900">
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
    borrador: 'bg-slate-100 text-slate-600',
    enviado: 'bg-blue-50 text-blue-700',
    aprobado: 'bg-green-50 text-green-700',
    rechazado: 'bg-red-50 text-red-700',
  }
  const labels: Record<string, string> = {
    borrador: 'Borrador',
    enviado: 'Enviado',
    aprobado: 'Aprobado',
    rechazado: 'Rechazado',
  }
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${styles[status] ?? styles.borrador}`}>
      {labels[status] ?? status}
    </span>
  )
}
