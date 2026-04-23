import { renderToBuffer } from '@react-pdf/renderer'
import { createClient } from '@/lib/supabase/server'
import { QuotePDF } from '@/lib/pdf/quote-pdf'
import type { Profile, Quote, QuoteItem } from '@/types'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const [{ data: quote }, { data: items }, { data: profile }] = await Promise.all([
    supabase
      .from('quotes')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('quote_items')
      .select('*')
      .eq('quote_id', id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single(),
  ])

  if (!quote) {
    return new Response('Not found', { status: 404 })
  }

  const buffer = await renderToBuffer(
    <QuotePDF
      quote={quote as Quote}
      items={(items as QuoteItem[]) ?? []}
      profile={profile as Profile | null}
    />
  )

  const filename = `presupuesto-${String(quote.quote_number).padStart(4, '0')}.pdf`

  return new Response(buffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
