import { createClient } from '@/lib/supabase/server'
import { QuoteForm } from '@/components/quote-form'
import type { Client, Profile } from '@/types'

export default async function NuevoPresupuestoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: clients }, { data: profile }] = await Promise.all([
    supabase
      .from('clients')
      .select('*')
      .eq('user_id', user!.id)
      .order('name', { ascending: true }),
    supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user!.id)
      .single(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Nuevo presupuesto</h1>
        <p className="text-slate-500 text-sm mt-1">
          Completá los datos y descargá el PDF al finalizar.
        </p>
      </div>
      <QuoteForm
        clients={(clients as Client[]) ?? []}
        profile={profile as Profile | null}
        userId={user!.id}
      />
    </div>
  )
}
