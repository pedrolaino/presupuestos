'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Pencil, Download, ArrowLeft, Check } from 'lucide-react'
import { formatCurrency, padQuoteNumber, formatDate, cn } from '@/lib/utils'
import type { Quote, QuoteItem, Profile, QuoteStatus } from '@/types'

const STATUSES: { value: QuoteStatus; label: string; style: string; active: string }[] = [
  { value: 'borrador',  label: 'Borrador',  style: 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50',   active: 'border-slate-400 bg-slate-100 text-slate-700' },
  { value: 'enviado',   label: 'Enviado',   style: 'border-slate-200 text-slate-500 hover:border-blue-200 hover:bg-blue-50',     active: 'border-blue-400 bg-blue-50 text-blue-700' },
  { value: 'aprobado',  label: 'Aprobado',  style: 'border-slate-200 text-slate-500 hover:border-green-200 hover:bg-green-50',   active: 'border-green-400 bg-green-50 text-green-700' },
  { value: 'rechazado', label: 'Rechazado', style: 'border-slate-200 text-slate-500 hover:border-red-200 hover:bg-red-50',       active: 'border-red-400 bg-red-50 text-red-700' },
]

interface QuoteDetailProps {
  quote: Quote
  items: QuoteItem[]
  profile: Profile | null
}

export function QuoteDetail({ quote, items, profile }: QuoteDetailProps) {
  const router = useRouter()
  const [status, setStatus] = useState<QuoteStatus>(quote.status)
  const [savingStatus, setSavingStatus] = useState(false)
  const [statusError, setStatusError] = useState('')
  const [downloading, setDownloading] = useState(false)

  async function handleStatusChange(newStatus: QuoteStatus) {
    if (newStatus === status) return
    setSavingStatus(true)
    setStatusError('')
    const supabase = createClient()
    const { error } = await supabase
      .from('quotes')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', quote.id)

    if (error) {
      setStatusError('No se pudo cambiar el estado. Intentá de nuevo.')
      setSavingStatus(false)
      return
    }

    setStatus(newStatus)
    setSavingStatus(false)
    router.refresh()
  }

  async function handleDownload() {
    setDownloading(true)
    try {
      const res = await fetch(`/api/presupuestos/${quote.id}/pdf`)
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `presupuesto-${String(quote.quote_number).padStart(4, '0')}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('No se pudo generar el PDF. Intentá de nuevo.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/presupuestos">
            <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Presupuesto {padQuoteNumber(quote.quote_number)}
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">{formatDate(quote.created_at)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/presupuestos/${quote.id}/editar`}>
            <Button variant="secondary" size="sm">
              <Pencil className="w-4 h-4" />
              <span className="hidden sm:inline">Editar</span>
            </Button>
          </Link>
          <Button size="sm" onClick={handleDownload} loading={downloading}>
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Descargar PDF</span>
          </Button>
        </div>
      </div>

      {/* ── Estado ── */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-slate-600 shrink-0">Estado:</span>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => handleStatusChange(s.value)}
                  disabled={savingStatus}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors disabled:opacity-60 disabled:cursor-not-allowed',
                    status === s.value ? s.active : s.style
                  )}
                >
                  {status === s.value && <Check className="w-3 h-3" />}
                  {s.label}
                </button>
              ))}
            </div>
            {savingStatus && (
              <span className="text-xs text-slate-400">Guardando...</span>
            )}
            {statusError && (
              <span className="text-xs text-red-500">{statusError}</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Datos negocio + cliente ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader><h2 className="text-sm font-semibold text-slate-700">Tu negocio</h2></CardHeader>
          <CardContent className="text-sm text-slate-600 space-y-1">
            <p className="font-semibold text-slate-900">{profile?.business_name || '—'}</p>
            {profile?.first_name && <p>{profile.first_name} {profile.last_name}</p>}
            {profile?.email && <p>{profile.email}</p>}
            {profile?.phone && <p>{profile.phone}</p>}
            {profile?.cuit && <p>CUIT: {profile.cuit}</p>}
            {profile?.address && <p>{profile.address}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><h2 className="text-sm font-semibold text-slate-700">Cliente</h2></CardHeader>
          <CardContent className="text-sm text-slate-600 space-y-1">
            <p className="font-semibold text-slate-900">{quote.client_name}</p>
            {quote.client_email && <p>{quote.client_email}</p>}
            {quote.client_phone && <p>{quote.client_phone}</p>}
          </CardContent>
        </Card>
      </div>

      {/* ── Ítems ── */}
      <Card>
        <CardHeader><h2 className="font-semibold text-slate-800">Ítems</h2></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Descripción</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Cant.</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Precio unit.</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-3 text-slate-900">{item.description}</td>
                    <td className="px-4 py-3 text-right text-slate-600 tabular-nums">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-slate-600 tabular-nums">{formatCurrency(item.unit_price)}</td>
                    <td className="px-6 py-3 text-right font-medium text-slate-900 tabular-nums">{formatCurrency(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 px-6 py-4 space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatCurrency(quote.subtotal)}</span>
            </div>
            {quote.discount_amount > 0 && (
              <div className="flex justify-between text-sm text-green-700">
                <span>Descuento {quote.discount_type === 'percentage' ? `(${quote.discount_value}%)` : '(monto fijo)'}</span>
                <span className="tabular-nums">− {formatCurrency(quote.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="font-semibold text-slate-900">Total</span>
              <span className="text-xl font-bold text-[#1e3a5f] tabular-nums">{formatCurrency(quote.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Notas ── */}
      {quote.notes && (
        <Card>
          <CardHeader><h2 className="font-semibold text-slate-800">Notas</h2></CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{quote.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
