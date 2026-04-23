export type Profile = {
  id: string
  user_id: string
  business_name: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  address: string | null
  cuit: string | null
  logo_url: string | null
  created_at: string
  updated_at: string
}

export type Client = {
  id: string
  user_id: string
  name: string
  email: string | null
  phone: string | null
  notes: string | null
  created_at: string
}

export type QuoteStatus = 'borrador' | 'enviado' | 'aprobado' | 'rechazado'

export type QuoteItem = {
  id: string
  quote_id: string
  description: string
  quantity: number
  unit_price: number
  subtotal: number
  sort_order: number
}

export type Quote = {
  id: string
  user_id: string
  quote_number: number
  client_id: string | null
  client_name: string
  client_email: string | null
  client_phone: string | null
  status: QuoteStatus
  notes: string | null
  discount_type: 'percentage' | 'fixed' | null
  discount_value: number | null
  subtotal: number
  discount_amount: number
  total: number
  created_at: string
  updated_at: string
  items?: QuoteItem[]
}

export type NewQuoteItem = Omit<QuoteItem, 'id' | 'quote_id'>

export type NewQuote = {
  client_id?: string | null
  client_name: string
  client_email?: string | null
  client_phone?: string | null
  status: QuoteStatus
  notes?: string | null
  discount_type?: 'percentage' | 'fixed' | null
  discount_value?: number | null
  items: Omit<NewQuoteItem, 'subtotal'>[]
}
