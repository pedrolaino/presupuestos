'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import {
  Plus, Search, Pencil, Trash2, Users,
  Mail, Phone, FileText, ChevronRight,
} from 'lucide-react'
import type { Client } from '@/types'

const emptyForm = { name: '', email: '', phone: '', notes: '' }

interface ClientsViewProps {
  initialClients: Client[]
}

export function ClientsView({ initialClients }: ClientsViewProps) {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [error, setError] = useState('')

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  )

  function openCreate() {
    setEditingClient(null)
    setForm(emptyForm)
    setError('')
    setModalOpen(true)
  }

  function openEdit(client: Client) {
    setEditingClient(client)
    setForm({
      name: client.name,
      email: client.email ?? '',
      phone: client.phone ?? '',
      notes: client.notes ?? '',
    })
    setError('')
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingClient(null)
    setError('')
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setError('El nombre es obligatorio.')
      return
    }
    setLoading(true)
    setError('')
    const supabase = createClient()

    if (editingClient) {
      const { data, error: dbError } = await supabase
        .from('clients')
        .update({
          name: form.name.trim(),
          email: form.email.trim() || null,
          phone: form.phone.trim() || null,
          notes: form.notes.trim() || null,
        })
        .eq('id', editingClient.id)
        .select()
        .single()

      if (dbError) { setError('Error al guardar.'); setLoading(false); return }
      setClients((prev) => prev.map((c) => (c.id === editingClient.id ? (data as Client) : c)))
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error: dbError } = await supabase
        .from('clients')
        .insert({
          user_id: user!.id,
          name: form.name.trim(),
          email: form.email.trim() || null,
          phone: form.phone.trim() || null,
          notes: form.notes.trim() || null,
        })
        .select()
        .single()

      if (dbError) { setError('Error al guardar.'); setLoading(false); return }
      setClients((prev) => [...prev, data as Client].sort((a, b) => a.name.localeCompare(b.name)))
    }

    setLoading(false)
    closeModal()
  }

  async function handleDelete(id: string) {
    setDeleteLoading(true)
    const supabase = createClient()
    const { error: dbError } = await supabase.from('clients').delete().eq('id', id)

    if (dbError) {
      setError('No se pudo eliminar el cliente. Intentá de nuevo.')
      setDeleteLoading(false)
      return
    }

    setClients((prev) => prev.filter((c) => c.id !== id))
    setDeleteId(null)
    setDeleteLoading(false)
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
          />
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nuevo cliente</span>
          <span className="sm:hidden">Nuevo</span>
        </Button>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            {search ? (
              <p className="text-slate-500 text-sm">No se encontraron clientes con ese criterio.</p>
            ) : (
              <>
                <p className="text-slate-500 text-sm">Todavía no tenés clientes guardados.</p>
                <Button onClick={openCreate} variant="secondary" size="sm" className="mt-4">
                  <Plus className="w-4 h-4" />
                  Agregar el primero
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="divide-y divide-slate-100">
            {filtered.map((client) => (
              <div
                key={client.id}
                className="flex items-center gap-4 px-4 sm:px-6 py-4 group"
              >
                {/* Avatar inicial */}
                <div className="shrink-0 w-9 h-9 rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f] flex items-center justify-center font-semibold text-sm">
                  {client.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{client.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {client.email && (
                      <span className="flex items-center gap-1 text-xs text-slate-500 truncate">
                        <Mail className="w-3 h-3 shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </span>
                    )}
                    {client.phone && (
                      <span className="flex items-center gap-1 text-xs text-slate-500 shrink-0">
                        <Phone className="w-3 h-3" />
                        {client.phone}
                      </span>
                    )}
                  </div>
                  {client.notes && (
                    <p className="text-xs text-slate-400 mt-0.5 truncate">
                      <FileText className="w-3 h-3 inline mr-1" />
                      {client.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(client)}
                    className="p-2 rounded-lg text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-100 transition-colors"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(client.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-300 ml-1 hidden sm:block" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Conteo */}
      {clients.length > 0 && (
        <p className="text-xs text-slate-400 text-right">
          {filtered.length} de {clients.length} cliente{clients.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Modal crear/editar */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingClient ? 'Editar cliente' : 'Nuevo cliente'}
      >
        <div className="space-y-4">
          <Input
            label="Nombre *"
            placeholder="Juan García"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            autoFocus
          />
          <Input
            label="Email"
            type="email"
            placeholder="juan@email.com"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />
          <Input
            label="Teléfono"
            type="tel"
            placeholder="+54 11 1234-5678"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          />
          <Textarea
            label="Notas"
            placeholder="Información adicional..."
            rows={3}
            value={form.notes}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-md">
              {error}
            </p>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={closeModal} disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleSave} loading={loading}>
              {editingClient ? 'Guardar cambios' : 'Crear cliente'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal confirmar eliminación */}
      <Modal
        open={!!deleteId}
        onClose={() => { setDeleteId(null); setError('') }}
        title="Eliminar cliente"
      >
        <p className="text-sm text-slate-600 mb-4">
          ¿Estás seguro que querés eliminar este cliente? Esta acción no se puede deshacer.
        </p>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-md mb-4">
            {error}
          </p>
        )}
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteId(null)} disabled={deleteLoading}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            loading={deleteLoading}
            onClick={() => deleteId && handleDelete(deleteId)}
          >
            Eliminar
          </Button>
        </div>
      </Modal>
    </>
  )
}
