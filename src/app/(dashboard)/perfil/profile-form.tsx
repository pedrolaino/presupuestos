'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Upload, Trash2, CheckCircle2, Building2 } from 'lucide-react'
import type { Profile } from '@/types'

interface ProfileFormProps {
  profile: Profile | null
  userId: string
}

export function ProfileForm({ profile, userId }: ProfileFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    business_name: profile?.business_name ?? '',
    first_name: profile?.first_name ?? '',
    last_name: profile?.last_name ?? '',
    email: profile?.email ?? '',
    phone: profile?.phone ?? '',
    address: profile?.address ?? '',
    cuit: profile?.cuit ?? '',
  })

  const [logoUrl, setLogoUrl] = useState<string | null>(profile?.logo_url ?? null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(profile?.logo_url ?? null)

  const [loading, setLoading] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setSuccess(false)
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('El archivo debe ser una imagen (JPG, PNG, etc.)')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('El logo no puede superar los 2 MB.')
      return
    }

    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
    setError('')
  }

  function handleRemoveLogo() {
    setLogoFile(null)
    setLogoPreview(null)
    setLogoUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function uploadLogo(): Promise<string | null> {
    if (!logoFile) return logoUrl

    setUploadingLogo(true)
    const supabase = createClient()
    const ext = logoFile.name.split('.').pop()
    const path = `${userId}/logo.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(path, logoFile, { upsert: true })

    if (uploadError) {
      setError('Error al subir el logo. Intentá de nuevo.')
      setUploadingLogo(false)
      return null
    }

    const { data } = supabase.storage.from('logos').getPublicUrl(path)
    setUploadingLogo(false)
    return `${data.publicUrl}?t=${Date.now()}`
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!form.business_name.trim()) {
      setError('El nombre del negocio es obligatorio.')
      return
    }
    if (!form.first_name.trim() || !form.last_name.trim()) {
      setError('El nombre y apellido son obligatorios.')
      return
    }
    if (!form.email.trim()) {
      setError('El email es obligatorio.')
      return
    }

    setLoading(true)

    const finalLogoUrl = logoPreview === null ? null : await uploadLogo()
    if (uploadingLogo) return

    const supabase = createClient()
    const { error: dbError } = await supabase
      .from('profiles')
      .update({
        ...form,
        logo_url: finalLogoUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    if (dbError) {
      setError('Error al guardar los datos. Intentá de nuevo.')
      setLoading(false)
      return
    }

    setLogoUrl(finalLogoUrl)
    setLogoFile(null)
    setSuccess(true)
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Logo */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-slate-800">Logo del negocio</h2>
          <p className="text-sm text-slate-500">Se mostrará en el encabezado de tus presupuestos. Máx. 2 MB.</p>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          {/* Preview */}
          <div className="shrink-0 w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
            {logoPreview ? (
              <Image
                src={logoPreview}
                alt="Logo"
                width={80}
                height={80}
                className="object-contain w-full h-full"
                unoptimized
              />
            ) : (
              <Building2 className="w-8 h-8 text-slate-300" />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4" />
              {logoPreview ? 'Cambiar logo' : 'Subir logo'}
            </Button>
            {logoPreview && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveLogo}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Quitar logo
              </Button>
            )}
            {logoFile && (
              <p className="text-xs text-slate-500 truncate max-w-[180px]">{logoFile.name}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Datos del negocio */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-slate-800">Datos del negocio</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Nombre del negocio *"
            name="business_name"
            placeholder="Ej: Estudio Gómez & Asociados"
            value={form.business_name}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nombre *"
              name="first_name"
              placeholder="Juan"
              value={form.first_name}
              onChange={handleChange}
              required
            />
            <Input
              label="Apellido *"
              name="last_name"
              placeholder="García"
              value={form.last_name}
              onChange={handleChange}
              required
            />
          </div>
          <Input
            label="Email de contacto *"
            name="email"
            type="email"
            placeholder="contacto@minegocio.com"
            value={form.email}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Teléfono"
              name="phone"
              type="tel"
              placeholder="+54 11 1234-5678"
              value={form.phone}
              onChange={handleChange}
            />
            <Input
              label="CUIT"
              name="cuit"
              placeholder="20-12345678-9"
              value={form.cuit}
              onChange={handleChange}
            />
          </div>
          <Input
            label="Dirección"
            name="address"
            placeholder="Av. Corrientes 1234, CABA"
            value={form.address}
            onChange={handleChange}
          />
        </CardContent>
      </Card>

      {/* Feedback + submit */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Perfil guardado correctamente.
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" loading={loading || uploadingLogo} size="lg">
          Guardar cambios
        </Button>
      </div>
    </form>
  )
}
