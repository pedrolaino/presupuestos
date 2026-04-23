import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { QuoteDetail } from './quote-detail'
import type { Profile, Quote, QuoteItem } from '@/types'

export default async function PresupuestoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: quote }, { data: items }, { data: profile }] = await Promise.all([
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
      .from('profiles')
      .select('*')
      .eq('user_id', user!.id)
      .single(),
  ])

  if (!quote) notFound()

  return (
    <QuoteDetail
      quote={quote as Quote}
      items={(items as QuoteItem[]) ?? []}
      profile={profile as Profile | null}
    />
  )
}
