import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FileText, Plus } from 'lucide-react'
import { formatCurrency, padQuoteNumber, formatDate } from '@/lib/utils'
import type { Quote } from '@/types'

const statusLabel: Record<string, string> = {
  borrador: 'Borrador', enviado: 'Enviado', aprobado: 'Aprobado', rechazado: 'Rechazado',
}
const statusStyle: Record<string, string> = {
  borrador: 'bg-slate-100 text-slate-600',
  enviado: 'bg-blue-50 text-blue-700',
  aprobado: 'bg-green-50 text-green-700',
  rechazado: 'bg-red-50 text-red-700',
}

export default async function PresupuestosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: quotes } = await supabase
    .from('quotes')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Presupuestos</h1>
          <p className="text-slate-500 text-sm mt-1">Historial de todos tus presupuestos.</p>
        </div>
        <Link href="/presupuestos/nuevo" className="shrink-0">
          <Button size="sm" className="sm:hidden"><Plus className="w-4 h-4" />Nuevo</Button>
          <Button className="hidden sm:inline-flex"><Plus className="w-4 h-4" />Nuevo presupuesto</Button>
        </Link>
      </div>

      {!quotes || quotes.length === 0 ? (
        <Card>
          <div className="py-16 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Todavía no generaste ningún presupuesto.</p>
            <Link href="/presupuestos/nuevo" className="mt-4 inline-block">
              <Button variant="secondary" size="sm"><Plus className="w-4 h-4" />Crear el primero</Button>
            </Link>
          </div>
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
                  <span className="text-xs font-mono text-slate-400 shrink-0 w-14">
                    {padQuoteNumber(quote.quote_number)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{quote.client_name}</p>
                    <p className="text-xs text-slate-500">{formatDate(quote.created_at)}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-4 shrink-0">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyle[quote.status] ?? statusStyle.borrador}`}>
                    {statusLabel[quote.status] ?? quote.status}
                  </span>
                  <span className="text-sm font-semibold text-slate-900 tabular-nums">
                    {formatCurrency(quote.total)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {quotes && quotes.length > 0 && (
        <p className="text-xs text-slate-400 text-right">{quotes.length} presupuesto{quotes.length !== 1 ? 's' : ''}</p>
      )}
    </div>
  )
}
