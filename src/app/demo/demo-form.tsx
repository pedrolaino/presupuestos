'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Plus, Trash2, Download, ArrowRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface LineItem {
  tempId: string
  description: string
  quantity: string
  unit_price: string
}

function newLine(): LineItem {
  return { tempId: crypto.randomUUID(), description: '', quantity: '1', unit_price: '' }
}

function parseNum(val: string): number {
  const n = parseFloat(val.replace(',', '.'))
  return isNaN(n) || n < 0 ? 0 : n
}

function calcSubtotal(qty: string, price: string): number {
  return parseNum(qty) * parseNum(price)
}

export function DemoForm() {
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [items, setItems] = useState<LineItem[]>([newLine()])
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed' | ''>('')
  const [discountValue, setDiscountValue] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [downloaded, setDownloaded] = useState(false)

  const subtotal = items.reduce((sum, i) => sum + calcSubtotal(i.quantity, i.unit_price), 0)

  const discountAmount = (() => {
    if (!discountType || !discountValue) return 0
    const val = parseNum(discountValue)
    if (discountType === 'percentage') return Math.min(subtotal * (val / 100), subtotal)
    return Math.min(val, subtotal)
  })()

  const total = subtotal - discountAmount

  const addItem = useCallback(() => setItems((prev) => [...prev, newLine()]), [])
  const removeItem = useCallback((id: string) => setItems((prev) => prev.filter((i) => i.tempId !== id)), [])
  const updateItem = useCallback(
    (id: string, field: keyof Omit<LineItem, 'tempId'>, value: string) =>
      setItems((prev) => prev.map((i) => (i.tempId === id ? { ...i, [field]: value } : i))),
    []
  )

  async function handleGenerate() {
    setError('')

    if (!clientName.trim()) { setError('El nombre del cliente es obligatorio.'); return }
    if (items.some((i) => !i.description.trim())) { setError('Todos los ítems deben tener una descripción.'); return }
    if (items.length === 0) { setError('Agregá al menos un ítem.'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/demo/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim() || null,
          clientPhone: clientPhone.trim() || null,
          items: items.map((item, idx) => ({
            description: item.description.trim(),
            quantity: parseNum(item.quantity),
            unit_price: parseNum(item.unit_price),
            subtotal: calcSubtotal(item.quantity, item.unit_price),
            sort_order: idx,
          })),
          discountType: discountType || null,
          discountValue: discountType && discountValue ? parseNum(discountValue) : null,
          discountAmount,
          subtotal,
          total,
          notes: notes.trim() || null,
        }),
      })

      if (!res.ok) throw new Error()

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'presupuesto-demo.pdf'
      a.click()
      URL.revokeObjectURL(url)
      setDownloaded(true)
    } catch {
      setError('No se pudo generar el PDF. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Cliente */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-slate-800">Datos del cliente</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Nombre del cliente o empresa *"
            placeholder="Juan García / Empresa S.A."
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="cliente@email.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />
            <Input
              label="Teléfono"
              type="tel"
              placeholder="+54 11 1234-5678"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Ítems */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-slate-800">Ítems</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="hidden sm:grid grid-cols-[1fr_80px_120px_100px_36px] gap-3 px-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Descripción</span>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Cant.</span>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Precio unit.</span>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide text-right">Subtotal</span>
            <span />
          </div>

          {items.map((item, idx) => (
            <div key={item.tempId} className="bg-slate-50 sm:bg-transparent rounded-xl sm:rounded-none p-3 sm:p-0">
              <p className="sm:hidden text-xs text-slate-400 font-medium mb-2">Ítem {idx + 1}</p>
              <div className="grid grid-cols-[1fr_36px] sm:grid-cols-[1fr_80px_120px_100px_36px] gap-2 sm:gap-3 items-start">
                <input
                  type="text"
                  placeholder="Descripción del servicio o producto"
                  value={item.description}
                  onChange={(e) => updateItem(item.tempId, 'description', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                />
                <div className="sm:hidden flex items-start justify-end">
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(item.tempId)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="col-span-2 sm:col-span-1 sm:col-start-2 grid grid-cols-2 sm:contents gap-2 sm:gap-3">
                  <input
                    type="number" placeholder="1" min="0" step="0.01"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.tempId, 'quantity', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                  />
                  <input
                    type="number" placeholder="0.00" min="0" step="0.01"
                    value={item.unit_price}
                    onChange={(e) => updateItem(item.tempId, 'unit_price', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                  />
                </div>
                <div className="hidden sm:flex items-center justify-end h-[38px]">
                  <span className="text-sm font-medium text-slate-700">{formatCurrency(calcSubtotal(item.quantity, item.unit_price))}</span>
                </div>
                <div className="hidden sm:flex items-center justify-center h-[38px]">
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(item.tempId)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button type="button" onClick={addItem} className="flex items-center gap-2 text-sm text-[#1e3a5f] hover:text-[#162d4a] font-medium mt-2">
            <Plus className="w-4 h-4" />
            Agregar ítem
          </button>

          {/* Totales */}
          <div className="border-t border-slate-200 pt-4 mt-2 space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <Select
                label="Descuento"
                value={discountType}
                onChange={(e) => { setDiscountType(e.target.value as 'percentage' | 'fixed' | ''); setDiscountValue('') }}
                className="w-36"
              >
                <option value="">Sin descuento</option>
                <option value="percentage">Porcentaje (%)</option>
                <option value="fixed">Monto fijo ($)</option>
              </Select>
              {discountType && (
                <div className="w-32">
                  <Input
                    label={discountType === 'percentage' ? 'Porcentaje' : 'Monto'}
                    type="number" min="0"
                    max={discountType === 'percentage' ? '100' : undefined}
                    step="0.01"
                    placeholder={discountType === 'percentage' ? '10' : '500'}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                  />
                </div>
              )}
              {discountAmount > 0 && (
                <span className="text-sm text-green-700 font-medium pb-2">− {formatCurrency(discountAmount)}</span>
              )}
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="font-semibold text-slate-900">Total</span>
              <span className="text-xl font-bold text-[#1e3a5f]">{formatCurrency(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notas */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-slate-800">Notas</h2>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Condiciones de pago, validez del presupuesto, aclaraciones..."
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* CTA post-descarga */}
      {downloaded && (
        <div className="bg-[#1e3a5f] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold">¿Te gustó el resultado?</p>
            <p className="text-white/70 text-sm mt-0.5">
              Creá tu cuenta gratis para guardar clientes, historial y usar tu propio logo.
            </p>
          </div>
          <Link
            href="/register"
            className="shrink-0 flex items-center gap-2 bg-white text-[#1e3a5f] font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Crear cuenta gratis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleGenerate} loading={loading} size="lg">
          <Download className="w-4 h-4" />
          Generar PDF demo
        </Button>
      </div>
    </div>
  )
}
