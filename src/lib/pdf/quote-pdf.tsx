import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import path from 'path'
import fs from 'fs'
import type { Quote, QuoteItem, Profile } from '@/types'

// ─── Register Inter ───────────────────────────────────────────────────────────
// Leemos los TTF con fs y los pasamos como data: URLs.
// Node.js fetch soporta data: de forma nativa, evitando el problema con file://.

function fontDataUrl(filename: string): string {
  const filePath = path.join(process.cwd(), 'public', 'fonts', filename)
  const buffer = fs.readFileSync(filePath)
  return `data:font/truetype;base64,${buffer.toString('base64')}`
}

Font.register({
  family: 'Inter',
  fonts: [
    { src: fontDataUrl('Inter-Regular.ttf'),  fontWeight: 400 },
    { src: fontDataUrl('Inter-Medium.ttf'),   fontWeight: 500 },
    { src: fontDataUrl('Inter-SemiBold.ttf'), fontWeight: 600 },
    { src: fontDataUrl('Inter-Bold.ttf'),     fontWeight: 700 },
  ],
})

Font.registerHyphenationCallback((word) => [word])

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(n)
}

function fmtDate(d: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(d))
}

function pad(n: number) {
  return String(n).padStart(4, '0')
}


// ─── Tokens ───────────────────────────────────────────────────────────────────

const NAVY   = '#1e3a5f'
const GRAY1  = '#374151'
const GRAY2  = '#6b7280'
const GRAY3  = '#9ca3af'
const GRAY4  = '#f3f4f6'
const BORDER = '#e5e7eb'
const WHITE  = '#ffffff'
const GREEN  = '#15803d'

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: 9,
    color: GRAY1,
    backgroundColor: WHITE,
    paddingBottom: 64,
  },
  // Contenedor del body que ocupa todo el espacio disponible
  bodyWrapper: {
    flex: 1,
    paddingHorizontal: 48,
    paddingTop: 28,
    flexDirection: 'column',
  },
  // Empuja el bloque de totales hacia abajo
  spacer: {
    flexGrow: 1,
  },
  // Bloque inferior: notas + totales, siempre al fondo
  bottomBlock: {
    marginTop: 16,
  },

  // ── Top header ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 48,
    paddingHorizontal: 48,
    marginBottom: 28,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    flex: 1,
  },
  logo: {
    width: 56,
    height: 56,
    objectFit: 'contain',
    borderRadius: 4,
  },
  logoFallback: {
    width: 56,
    height: 56,
    borderRadius: 4,
    backgroundColor: GRAY4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoFallbackText: {
    fontWeight: 700,
    fontSize: 22,
    color: NAVY,
  },
  businessName: {
    fontWeight: 700,
    fontSize: 14,
    color: NAVY,
    marginBottom: 3,
  },
  businessLine: {
    fontSize: 8.5,
    color: GRAY2,
    marginBottom: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  docTitle: {
    fontSize: 8,
    fontWeight: 600,
    color: GRAY3,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  docNumber: {
    fontWeight: 700,
    fontSize: 26,
    color: NAVY,
    letterSpacing: -0.5,
  },
  docDate: {
    fontSize: 8.5,
    color: GRAY2,
    marginTop: 5,
  },

  // ── Divider ─────────────────────────────────────────────────────────────────
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    marginBottom: 24,
    marginHorizontal: 48,
  },
  dividerThick: {
    borderBottomWidth: 2,
    borderBottomColor: NAVY,
    marginBottom: 0,
    marginHorizontal: 48,
  },

  // ── Client info ─────────────────────────────────────────────────────────────
  clientSection: {
    marginBottom: 28,
  },
  clientLabel: {
    fontSize: 7.5,
    fontWeight: 600,
    color: GRAY3,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  clientName: {
    fontWeight: 600,
    fontSize: 11,
    color: GRAY1,
    marginBottom: 3,
  },
  clientLine: {
    fontSize: 8.5,
    color: GRAY2,
    marginBottom: 2,
  },

  // ── Table ───────────────────────────────────────────────────────────────────
  tableHead: {
    flexDirection: 'row',
    backgroundColor: GRAY4,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 1,
  },
  th: {
    fontSize: 7.5,
    fontWeight: 600,
    color: GRAY2,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  td: {
    fontSize: 9,
    color: GRAY1,
  },
  tdMuted: {
    fontSize: 9,
    color: GRAY2,
  },
  tdStrong: {
    fontSize: 9,
    fontWeight: 600,
    color: GRAY1,
  },

  cDesc:  { flex: 1 },
  cQty:   { width: 38, textAlign: 'right' },
  cPrice: { width: 84, textAlign: 'right' },
  cSub:   { width: 90, textAlign: 'right' },

  // ── Totals ──────────────────────────────────────────────────────────────────
  totalsOuter: {
    alignItems: 'flex-end',
    marginTop: 12,
  },
  totalsBox: {
    width: 230,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalsLabel: {
    fontSize: 9,
    color: GRAY2,
  },
  totalsValue: {
    fontSize: 9,
    fontWeight: 500,
    color: GRAY1,
  },
  discountValue: {
    fontSize: 9,
    fontWeight: 600,
    color: GREEN,
  },
  totalsDivider: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
    marginVertical: 6,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: NAVY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: 700,
    color: NAVY,
  },

  // ── Notes ───────────────────────────────────────────────────────────────────
  notesSection: {
    marginTop: 28,
  },
  notesLabel: {
    fontSize: 7.5,
    fontWeight: 600,
    color: GRAY3,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  notesText: {
    fontSize: 9,
    color: GRAY2,
    lineHeight: 1.7,
  },

  // ── Footer ──────────────────────────────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  footerLeft: {
    fontSize: 8,
    color: GRAY3,
  },
  footerRight: {
    fontSize: 8,
    color: GRAY3,
  },
})

// ─── PDF Component ────────────────────────────────────────────────────────────

interface QuotePDFProps {
  quote: Quote
  items: QuoteItem[]
  profile: Profile | null
}

export function QuotePDF({ quote, items, profile }: QuotePDFProps) {
  const bizName = profile?.business_name || 'Mi negocio'
  const footerContact = [profile?.email, profile?.phone].filter(Boolean).join('   ·   ')

  return (
    <Document
      title={`Presupuesto #${pad(quote.quote_number)} — ${quote.client_name}`}
      author={bizName}
    >
      <Page size="A4" style={s.page}>

        {/* ── Header ── */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            {profile?.logo_url ? (
              <Image src={profile.logo_url} style={s.logo} />
            ) : (
              <View style={s.logoFallback}>
                <Text style={s.logoFallbackText}>{bizName.charAt(0).toUpperCase()}</Text>
              </View>
            )}
            <View>
              <Text style={s.businessName}>{bizName}</Text>
              {profile?.first_name ? (
                <Text style={s.businessLine}>{profile.first_name} {profile.last_name}</Text>
              ) : null}
              {profile?.email ? (
                <Text style={s.businessLine}>{profile.email}</Text>
              ) : null}
              {profile?.phone ? (
                <Text style={s.businessLine}>{profile.phone}</Text>
              ) : null}
              {profile?.cuit ? (
                <Text style={s.businessLine}>CUIT {profile.cuit}</Text>
              ) : null}
              {profile?.address ? (
                <Text style={s.businessLine}>{profile.address}</Text>
              ) : null}
            </View>
          </View>

          <View style={s.headerRight}>
            <Text style={s.docTitle}>Presupuesto</Text>
            <Text style={s.docNumber}>#{pad(quote.quote_number)}</Text>
            <Text style={s.docDate}>{fmtDate(quote.created_at)}</Text>
          </View>
        </View>

        <View style={s.dividerThick} />

        {/* ── Body: flex column, totals siempre al fondo ── */}
        <View style={s.bodyWrapper}>

          {/* ── Client ── */}
          <View style={s.clientSection}>
            <Text style={s.clientLabel}>Para</Text>
            <Text style={s.clientName}>{quote.client_name}</Text>
            {quote.client_email ? (
              <Text style={s.clientLine}>{quote.client_email}</Text>
            ) : null}
            {quote.client_phone ? (
              <Text style={s.clientLine}>{quote.client_phone}</Text>
            ) : null}
          </View>

          {/* ── Table ── */}
          <View>
            <View style={s.tableHead}>
              <Text style={[s.th, s.cDesc]}>Descripción</Text>
              <Text style={[s.th, s.cQty]}>Cant.</Text>
              <Text style={[s.th, s.cPrice]}>Precio unit.</Text>
              <Text style={[s.th, s.cSub]}>Subtotal</Text>
            </View>

            {items.map((item) => (
              <View key={item.id} style={s.tableRow} wrap={false}>
                <Text style={[s.td, s.cDesc]}>{item.description}</Text>
                <Text style={[s.tdMuted, s.cQty]}>
                  {Number(item.quantity) % 1 === 0
                    ? Math.floor(Number(item.quantity))
                    : item.quantity}
                </Text>
                <Text style={[s.tdMuted, s.cPrice]}>{fmt(item.unit_price)}</Text>
                <Text style={[s.tdStrong, s.cSub]}>{fmt(item.subtotal)}</Text>
              </View>
            ))}
          </View>

          {/* Spacer: empuja el bloque de abajo al fondo de la página */}
          <View style={s.spacer} />

          {/* ── Bottom block: notas + totales ── */}
          <View style={s.bottomBlock}>

            {/* Notas encima del total */}
            {quote.notes ? (
              <View style={s.notesSection}>
                <Text style={s.notesLabel}>Notas</Text>
                <Text style={s.notesText}>{quote.notes}</Text>
              </View>
            ) : null}

            {/* Totales */}
            <View style={s.totalsOuter}>
              <View style={s.totalsBox}>
                <View style={s.totalsRow}>
                  <Text style={s.totalsLabel}>Subtotal</Text>
                  <Text style={s.totalsValue}>{fmt(quote.subtotal)}</Text>
                </View>

                {quote.discount_amount > 0 ? (
                  <View style={s.totalsRow}>
                    <Text style={s.totalsLabel}>
                      {`Descuento${quote.discount_type === 'percentage'
                        ? ` (${quote.discount_value}%)`
                        : ' (fijo)'}`}
                    </Text>
                    <Text style={s.discountValue}>{`- ${fmt(quote.discount_amount)}`}</Text>
                  </View>
                ) : null}

                <View style={s.totalsDivider} />

                <View style={s.totalRow}>
                  <Text style={s.totalLabel}>Total</Text>
                  <Text style={s.totalValue}>{fmt(quote.total)}</Text>
                </View>
              </View>
            </View>

          </View>
        </View>

        {/* ── Footer ── */}
        <View style={s.footer} fixed>
          <Text style={s.footerLeft}>{footerContact}</Text>
          <Text
            style={s.footerRight}
            render={({ pageNumber, totalPages }) =>
              totalPages > 1 ? `Pág. ${pageNumber} / ${totalPages}` : ''
            }
          />
        </View>

      </Page>
    </Document>
  )
}
