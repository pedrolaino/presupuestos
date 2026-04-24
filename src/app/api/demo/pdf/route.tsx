import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { QuotePDF } from '@/lib/pdf/quote-pdf'
import type { Quote, QuoteItem, Profile } from '@/types'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { clientName, clientEmail, clientPhone, items, discountType, discountValue, discountAmount, subtotal, total, notes } = body

    const demoProfile: Profile = {
      id: 'demo',
      user_id: 'demo',
      business_name: 'Tu negocio',
      first_name: 'Tu',
      last_name: 'Nombre',
      email: 'contacto@tunegocio.com',
      phone: '+54 11 0000-0000',
      address: 'Tu dirección, Ciudad',
      cuit: '00-00000000-0',
      logo_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const demoQuote: Quote = {
      id: 'demo',
      user_id: 'demo',
      quote_number: 1,
      client_id: null,
      client_name: clientName || 'Cliente de prueba',
      client_email: clientEmail || null,
      client_phone: clientPhone || null,
      status: 'borrador',
      notes: notes || null,
      discount_type: discountType || null,
      discount_value: discountValue || null,
      subtotal: subtotal || 0,
      discount_amount: discountAmount || 0,
      total: total || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const demoItems: QuoteItem[] = (items || []).map((item: { description: string; quantity: number; unit_price: number; subtotal: number }, idx: number) => ({
      id: `demo-${idx}`,
      quote_id: 'demo',
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.subtotal,
      sort_order: idx,
    }))

    const buffer = await renderToBuffer(
      <QuotePDF quote={demoQuote} items={demoItems} profile={demoProfile} />
    )

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="presupuesto-demo.pdf"',
      },
    })
  } catch (err) {
    console.error('Error generando PDF demo:', err)
    return NextResponse.json({ error: 'No se pudo generar el PDF demo.' }, { status: 500 })
  }
}
