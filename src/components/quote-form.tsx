'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Plus, Trash2, UserPlus, Search, X, Check } from 'lucide-react'
import { formatCurrency, cn } from '@/lib/utils'
import type { Client, Profile, Quote, QuoteItem, QuoteStatus } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface LineItem {
  tempId: string
  description: string
  quantity: string
  unit_price: string
}

interface QuoteFormProps {
  clients: Client[]
  profile: Profile | null
  userId: string
  existingQuote?: Quote
  existingItems?: QuoteItem[]
}

type ClientMode = 'existing' | 'new'

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

export function QuoteForm({ clients, profile, userId, existingQuote, existingItems }: QuoteFormProps) {
  const router = useRouter()
  const isEditing = !!existingQuote

  // Client
  const [clientMode, setClientMode] = useState<ClientMode>(
    existingQuote?.client_id ? 'existing' : 'new'
  )
  const [selectedClientId, setSelectedClientId] = useState(existingQuote?.client_id ?? '')
  const [manualClient, setManualClient] = useState({
    name: existingQuote?.client_name ?? '',
    email: existingQuote?.client_email ?? '',
    phone: existingQuote?.client_phone ?? '',
  })

  // Items
  const [items, setItems] = useState<LineItem[]>(
    existingItems && existingItems.length > 0
      ? existingItems.map((i) => ({
          tempId: i.id,
          description: i.description,
          quantity: String(i.quantity),
          unit_price: String(i.unit_price),
        }))
      : [newLine()]
  )

  // Discount
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed' | ''>(
    existingQuote?.discount_type ?? ''
  )
  const [discountValue, setDiscountValue] = useState(
    existingQuote?.discount_value ? String(existingQuote.discount_value) : ''
  )

  // Notes & status
  const [notes, setNotes] = useState(existingQuote?.notes ?? '')
  const [status, setStatus] = useState<QuoteStatus>(existingQuote?.status ?? 'borrador')

  // UI
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // ─── Derived totals ───────────────────────────────────────────────────────

  const subtotal = items.reduce((sum, i) => sum + calcSubtotal(i.quantity, i.unit_price), 0)

  const discountAmount = (() => {
    if (!discountType || !discountValue) return 0
    const val = parseNum(discountValue)
    if (discountType === 'percentage') return Math.min(subtotal * (val / 100), subtotal)
    return Math.min(val, subtotal)
  })()

  const total = subtotal - discountAmount

  // ─── Client selection ─────────────────────────────────────────────────────

  function handleSelectClient(id: string) {
    setSelectedClientId(id)
    const client = clients.find((c) => c.id === id)
    if (client) {
      setManualClient({
        name: client.name,
        email: client.email ?? '',
        phone: client.phone ?? '',
      })
    }
  }

  // ─── Items ────────────────────────────────────────────────────────────────

  const addItem = useCallback(() => setItems((prev) => [...prev, newLine()]), [])

  const removeItem = useCallback(
    (tempId: string) => setItems((prev) => prev.filter((i) => i.tempId !== tempId)),
    []
  )

  const updateItem = useCallback(
    (tempId: string, field: keyof Omit<LineItem, 'tempId'>, value: string) =>
      setItems((prev) =>
        prev.map((i) => (i.tempId === tempId ? { ...i, [field]: value } : i))
      ),
    []
  )

  // ─── Submit ───────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const clientName =
      clientMode === 'existing'
        ? clients.find((c) => c.id === selectedClientId)?.name ?? ''
        : manualClient.name.trim()

    if (!clientName) {
      setError('Seleccioná o ingresá un cliente.')
      return
    }
    if (clientMode === 'existing' && !selectedClientId) {
      setError('Seleccioná un cliente de la lista.')
      return
    }
    if (items.some((i) => !i.description.trim())) {
      setError('Todos los ítems deben tener una descripción.')
      return
    }
    if (items.length === 0) {
      setError('Agregá al menos un ítem al presupuesto.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const clientPayload = {
      client_id: clientMode === 'existing' ? selectedClientId : null,
      client_name: clientName,
      client_email:
        clientMode === 'existing'
          ? clients.find((c) => c.id === selectedClientId)?.email ?? null
          : manualClient.email || null,
      client_phone:
        clientMode === 'existing'
          ? clients.find((c) => c.id === selectedClientId)?.phone ?? null
          : manualClient.phone || null,
    }

    const quotePayload = {
      ...clientPayload,
      status,
      notes: notes.trim() || null,
      discount_type: discountType || null,
      discount_value: discountType && discountValue ? parseNum(discountValue) : null,
      subtotal,
      discount_amount: discountAmount,
      total,
      updated_at: new Date().toISOString(),
    }

    let quoteId: string

    if (isEditing) {
      const { error: dbError } = await supabase
        .from('quotes')
        .update(quotePayload)
        .eq('id', existingQuote.id)

      if (dbError) { setError('Error al guardar el presupuesto.'); setLoading(false); return }
      quoteId = existingQuote.id

      // Guardamos los IDs de los ítems viejos antes de insertar los nuevos
      const { data: oldItems } = await supabase
        .from('quote_items')
        .select('id')
        .eq('quote_id', quoteId)

      // Insertamos los nuevos ítems primero
      const itemsPayload = items.map((item, idx) => ({
        quote_id: quoteId,
        description: item.description.trim(),
        quantity: parseNum(item.quantity),
        unit_price: parseNum(item.unit_price),
        subtotal: calcSubtotal(item.quantity, item.unit_price),
        sort_order: idx,
      }))

      const { error: itemsError } = await supabase.from('quote_items').insert(itemsPayload)
      if (itemsError) { setError('Error al guardar los ítems.'); setLoading(false); return }

      // Solo borramos los viejos después de que el insert fue exitoso
      if (oldItems && oldItems.length > 0) {
        await supabase.from('quote_items').delete().in('id', oldItems.map((i) => i.id))
      }
    } else {
      // Get next quote number
      const { data: nextNumData } = await supabase.rpc('get_next_quote_number')

      const { data: newQuote, error: dbError } = await supabase
        .from('quotes')
        .insert({ ...quotePayload, user_id: userId, quote_number: nextNumData ?? 1 })
        .select('id')
        .single()

      if (dbError || !newQuote) { setError('Error al crear el presupuesto.'); setLoading(false); return }
      quoteId = newQuote.id

      // Insert items
      const itemsPayload = items.map((item, idx) => ({
        quote_id: quoteId,
        description: item.description.trim(),
        quantity: parseNum(item.quantity),
        unit_price: parseNum(item.unit_price),
        subtotal: calcSubtotal(item.quantity, item.unit_price),
        sort_order: idx,
      }))

      const { error: itemsError } = await supabase.from('quote_items').insert(itemsPayload)
      if (itemsError) { setError('Error al guardar los ítems.'); setLoading(false); return }
    }

    router.push(`/presupuestos/${quoteId}`)
    router.refresh()
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-10">

      {/* ── Estado ── */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-slate-800">Estado</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(['borrador', 'enviado', 'aprobado', 'rechazado'] as QuoteStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  status === s
                    ? statusActive[s]
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {statusLabel[s]}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Cliente ── */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-slate-800">Cliente</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Toggle existing / new */}
          <div className="flex rounded-lg border border-slate-200 p-1 w-fit gap-1">
            <button
              type="button"
              onClick={() => setClientMode('existing')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                clientMode === 'existing'
                  ? 'bg-[#1e3a5f] text-white'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Cliente guardado
            </button>
            <button
              type="button"
              onClick={() => setClientMode('new')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                clientMode === 'new'
                  ? 'bg-[#1e3a5f] text-white'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Nuevo
            </button>
          </div>

          {clientMode === 'existing' ? (
            clients.length === 0 ? (
              <p className="text-sm text-slate-500">
                No tenés clientes guardados.{' '}
                <a href="/clientes" className="text-[#1e3a5f] underline">Agregar uno</a> o usá la opción &ldquo;Nuevo&rdquo;.
              </p>
            ) : (
              <ClientSearchCombobox
                clients={clients}
                selectedId={selectedClientId}
                onSelect={handleSelectClient}
                onClear={() => { setSelectedClientId(''); setManualClient({ name: '', email: '', phone: '' }) }}
              />
            )
          ) : (
            <div className="space-y-3">
              <Input
                label="Nombre *"
                placeholder="Nombre del cliente o empresa"
                value={manualClient.name}
                onChange={(e) => setManualClient((p) => ({ ...p, name: e.target.value }))}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Email"
                  type="email"
                  placeholder="cliente@email.com"
                  value={manualClient.email}
                  onChange={(e) => setManualClient((p) => ({ ...p, email: e.target.value }))}
                />
                <Input
                  label="Teléfono"
                  type="tel"
                  placeholder="+54 11 1234-5678"
                  value={manualClient.phone}
                  onChange={(e) => setManualClient((p) => ({ ...p, phone: e.target.value }))}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Ítems ── */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-slate-800">Ítems</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Header (desktop) */}
          <div className="hidden sm:grid grid-cols-[1fr_80px_120px_100px_36px] gap-3 px-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Descripción</span>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Cant.</span>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Precio unit.</span>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide text-right">Subtotal</span>
            <span />
          </div>

          {items.map((item, idx) => (
            <ItemRow
              key={item.tempId}
              item={item}
              index={idx}
              onUpdate={updateItem}
              onRemove={removeItem}
              canRemove={items.length > 1}
            />
          ))}

          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 text-sm text-[#1e3a5f] hover:text-[#162d4a] font-medium mt-2"
          >
            <Plus className="w-4 h-4" />
            Agregar ítem
          </button>

          {/* Totals */}
          <div className="border-t border-slate-200 pt-4 mt-2 space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>

            {/* Discount */}
            <div className="flex flex-wrap items-end gap-3">
              <Select
                label="Descuento"
                value={discountType}
                onChange={(e) => {
                  setDiscountType(e.target.value as 'percentage' | 'fixed' | '')
                  setDiscountValue('')
                }}
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
                    type="number"
                    min="0"
                    max={discountType === 'percentage' ? '100' : undefined}
                    step="0.01"
                    placeholder={discountType === 'percentage' ? '10' : '500'}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                  />
                </div>
              )}
              {discountAmount > 0 && (
                <span className="text-sm text-green-700 font-medium pb-2">
                  − {formatCurrency(discountAmount)}
                </span>
              )}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="font-semibold text-slate-900">Total</span>
              <span className="text-xl font-bold text-[#1e3a5f]">{formatCurrency(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Notas ── */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-slate-800">Notas</h2>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Condiciones de pago, validez del presupuesto, aclaraciones..."
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* ── Error + Submit ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" loading={loading} size="lg">
          {isEditing ? 'Guardar cambios' : 'Crear presupuesto'}
        </Button>
      </div>
    </form>
  )
}

// ─── Item Row ──────────────────────────────────────────────────────────────────

interface ItemRowProps {
  item: LineItem
  index: number
  onUpdate: (id: string, field: keyof Omit<LineItem, 'tempId'>, value: string) => void
  onRemove: (id: string) => void
  canRemove: boolean
}

function ItemRow({ item, index, onUpdate, onRemove, canRemove }: ItemRowProps) {
  const subtotal = calcSubtotal(item.quantity, item.unit_price)

  return (
    <div className="bg-slate-50 sm:bg-transparent rounded-xl sm:rounded-none p-3 sm:p-0">
      {/* Mobile label */}
      <p className="sm:hidden text-xs text-slate-400 font-medium mb-2">Ítem {index + 1}</p>

      <div className="grid grid-cols-[1fr_36px] sm:grid-cols-[1fr_80px_120px_100px_36px] gap-2 sm:gap-3 items-start">
        {/* Description */}
        <div className="col-span-1">
          <input
            type="text"
            placeholder="Descripción del servicio o producto"
            value={item.description}
            onChange={(e) => onUpdate(item.tempId, 'description', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
          />
        </div>

        {/* Remove (mobile — only on first row) */}
        <div className="sm:hidden flex items-start justify-end">
          {canRemove && (
            <button
              type="button"
              onClick={() => onRemove(item.tempId)}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Qty + Price (mobile: side by side below description) */}
        <div className="col-span-2 sm:col-span-1 sm:col-start-2 grid grid-cols-2 sm:contents gap-2 sm:gap-3">
          <input
            type="number"
            placeholder="1"
            min="0"
            step="0.01"
            value={item.quantity}
            onChange={(e) => onUpdate(item.tempId, 'quantity', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
          />
          <input
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={item.unit_price}
            onChange={(e) => onUpdate(item.tempId, 'unit_price', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
          />
        </div>

        {/* Subtotal */}
        <div className="hidden sm:flex items-center justify-end h-[38px]">
          <span className="text-sm font-medium text-slate-700">{formatCurrency(subtotal)}</span>
        </div>

        {/* Remove (desktop) */}
        <div className="hidden sm:flex items-center justify-center h-[38px]">
          {canRemove && (
            <button
              type="button"
              onClick={() => onRemove(item.tempId)}
              className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Subtotal (mobile) */}
      {subtotal > 0 && (
        <p className="sm:hidden text-xs text-slate-500 text-right mt-2">
          Subtotal: <span className="font-semibold text-slate-700">{formatCurrency(subtotal)}</span>
        </p>
      )}
    </div>
  )
}

// ─── Client Search Combobox ───────────────────────────────────────────────────

interface ClientSearchComboboxProps {
  clients: Client[]
  selectedId: string
  onSelect: (id: string) => void
  onClear: () => void
}

function ClientSearchCombobox({ clients, selectedId, onSelect, onClear }: ClientSearchComboboxProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selected = clients.find((c) => c.id === selectedId)

  const filtered = query.trim()
    ? clients.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.email?.toLowerCase().includes(query.toLowerCase()) ||
          c.phone?.includes(query)
      )
    : clients

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleSelect(id: string) {
    onSelect(id)
    setQuery('')
    setOpen(false)
  }

  function handleClear() {
    onClear()
    setQuery('')
    setOpen(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="text-sm font-medium text-slate-700 mb-1 block">
        Seleccionar cliente
      </label>

      {/* Selected chip */}
      {selected && !open ? (
        <div className="flex items-center gap-3 w-full px-3 py-2.5 border border-slate-300 rounded-md bg-white">
          <div className="w-7 h-7 rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f] flex items-center justify-center font-semibold text-xs shrink-0">
            {selected.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{selected.name}</p>
            {(selected.email || selected.phone) && (
              <p className="text-xs text-slate-500 truncate">
                {selected.email ?? selected.phone}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-slate-400 hover:text-slate-600 shrink-0"
            title="Cambiar cliente"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Search input */
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
            autoComplete="off"
          />
        </div>
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-400">No se encontraron clientes.</p>
          ) : (
            filtered.map((client) => (
              <button
                key={client.id}
                type="button"
                onClick={() => handleSelect(client.id)}
                className={cn(
                  'flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-slate-50 transition-colors',
                  client.id === selectedId && 'bg-blue-50'
                )}
              >
                <div className="w-7 h-7 rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f] flex items-center justify-center font-semibold text-xs shrink-0">
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{client.name}</p>
                  {(client.email || client.phone) && (
                    <p className="text-xs text-slate-500 truncate">
                      {client.email ?? client.phone}
                    </p>
                  )}
                </div>
                {client.id === selectedId && (
                  <Check className="w-4 h-4 text-[#1e3a5f] shrink-0" />
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ─── Status helpers ────────────────────────────────────────────────────────────

const statusLabel: Record<QuoteStatus, string> = {
  borrador: 'Borrador',
  enviado: 'Enviado',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
}

const statusActive: Record<QuoteStatus, string> = {
  borrador: 'border-slate-400 bg-slate-100 text-slate-700',
  enviado: 'border-blue-400 bg-blue-50 text-blue-700',
  aprobado: 'border-green-400 bg-green-50 text-green-700',
  rechazado: 'border-red-400 bg-red-50 text-red-700',
}
