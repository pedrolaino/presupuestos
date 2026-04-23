import { createClient } from '@/lib/supabase/server'
import { ClientsView } from './clients-view'
import type { Client } from '@/types'

export default async function ClientesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user!.id)
    .order('name', { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Clientes</h1>
        <p className="text-slate-500 text-sm mt-1">
          Guardá tus clientes para completar presupuestos más rápido.
        </p>
      </div>
      <ClientsView initialClients={(clients as Client[]) ?? []} />
    </div>
  )
}
