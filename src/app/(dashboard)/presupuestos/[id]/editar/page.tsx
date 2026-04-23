import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { QuoteForm } from '@/components/quote-form'
import type { Client, Profile, Quote, QuoteItem } from '@/types'

export default async function EditarPresupuestoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: quote }, { data: items }, { data: clients }, { data: profile }] =
    await Promise.all([
      supabase
        .from('quotes')
        .select('*')
        .eq('id', id)
        .eq('user_id', user!.id)
        .single(),
      supabase
        .from('quote_items')
        .select('*')
        .eq('quote_id', id)
        .order('sort_order', { ascending: true }),
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

  if (!quote) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Editar presupuesto #{String(quote.quote_number).padStart(4, '0')}
        </h1>
        <p className="text-slate-500 text-sm mt-1">Modificá los datos y guardá los cambios.</p>
      </div>
      <QuoteForm
        clients={(clients as Client[]) ?? []}
        profile={profile as Profile | null}
        userId={user!.id}
        existingQuote={quote as Quote}
        existingItems={(items as QuoteItem[]) ?? []}
      />
    </div>
  )
}
