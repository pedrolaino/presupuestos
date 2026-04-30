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

// ─── Font loader ──────────────────────────────────────────────────────────────

function fontDataUrl(filename: string): string {
  const filePath = path.join(process.cwd(), 'public', 'fonts', filename)
  try {
    const buffer = fs.readFileSync(filePath)
    return `data:font/truetype;base64,${buffer.toString('base64')}`
  } catch {
    throw new Error(
      `No se pudo cargar la fuente "${filename}". ` +
      `Verificá que el archivo existe en public/fonts/. Ruta buscada: ${filePath}`
    )
  }
}

Font.register({
  family: 'DMSans',
  fonts: [
    { src: fontDataUrl('DMSans-Regular.ttf'), fontWeight: 400 },
    { src: fontDataUrl('DMSans-Medium.ttf'),  fontWeight: 500 },
    { src: fontDataUrl('DMSans-Bold.ttf'),    fontWeight: 700 },
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
  return `#${String(n).padStart(4, '0')}`
}

// ─── Design tokens ────────────────────────────────────────────────────────────
//  "Taller" palette — matches the web UI

const INK      = '#1A1510'   // deep warm charcoal
const INK2     = '#6E5E4A'   // warm brown secondary
const INK3     = '#A8957F'   // warm tan tertiary
const RUST     = '#C14B1A'   // terracotta accent
const RUST_LT  = '#F9EDE6'   // light terracotta bg
const BORDER   = '#E0D5C5'   // warm beige border
const TABLE_BG = '#EDE6D8'   // warm cream for table header
const WHITE    = '#FFFFFF'
const SUCCESS  = '#2D5A3D'   // muted green for discount

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: {
    fontFamily: 'DMSans',
    fontWeight: 400,
    fontSize: 9,
    color: INK,
    backgroundColor: WHITE,
    paddingBottom: 64,
  },
  bodyWrapper: {
    flex: 1,
    paddingHorizontal: 48,
    paddingTop: 24,
    flexDirection: 'column',
  },
  spacer: {
    flexGrow: 1,
  },
  bottomBlock: {
    marginTop: 16,
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 44,
    paddingHorizontal: 48,
    marginBottom: 0,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    flex: 1,
  },
  logo: {
    width: 52,
    height: 52,
    objectFit: 'contain',
    borderRadius: 6,
  },
  logoFallback: {
    width: 52,
    height: 52,
    borderRadius: 6,
    backgroundColor: RUST_LT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
  },
  logoFallbackText: {
    fontWeight: 700,
    fontSize: 22,
    color: RUST,
  },
  businessName: {
    fontWeight: 700,
    fontSize: 13,
    color: INK,
    marginBottom: 4,
  },
  businessLine: {
    fontSize: 8.5,
    color: INK2,
    marginBottom: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  docLabel: {
    fontSize: 7.5,
    fontWeight: 500,
    color: INK3,
    textTransform: 'uppercase',
    letterSpacing: 1.8,
    marginBottom: 6,
  },
  docNumber: {
    fontWeight: 700,
    fontSize: 28,
    color: RUST,
    letterSpacing: -0.5,
  },
  docDate: {
    fontSize: 8.5,
    color: INK3,
    marginTop: 6,
  },

  // ── Divider ─────────────────────────────────────────────────────────────────
  dividerThin: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    marginBottom: 24,
    marginHorizontal: 48,
  },
  dividerAccent: {
    borderBottomWidth: 2,
    borderBottomColor: RUST,
    marginBottom: 0,
    marginTop: 20,
    marginHorizontal: 48,
  },

  // ── Client section ──────────────────────────────────────────────────────────
  clientSection: {
    marginBottom: 28,
    marginTop: 4,
  },
  clientBlock: {
    backgroundColor: TABLE_BG,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  clientLabel: {
    fontSize: 7,
    fontWeight: 700,
    color: INK3,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: 5,
  },
  clientName: {
    fontWeight: 700,
    fontSize: 11,
    color: INK,
    marginBottom: 3,
  },
  clientLine: {
    fontSize: 8.5,
    color: INK2,
    marginBottom: 2,
  },

  // ── Table ───────────────────────────────────────────────────────────────────
  tableHead: {
    flexDirection: 'row',
    backgroundColor: INK,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 1,
  },
  th: {
    fontSize: 7,
    fontWeight: 700,
    color: WHITE,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  tableRowAlt: {
    backgroundColor: '#FDFAF4',
  },
  td: {
    fontSize: 9,
    color: INK,
  },
  tdMuted: {
    fontSize: 9,
    color: INK2,
  },
  tdStrong: {
    fontSize: 9,
    fontWeight: 700,
    color: INK,
  },

  cDesc:  { flex: 1 },
  cQty:   { width: 38, textAlign: 'right' },
  cPrice: { width: 84, textAlign: 'right' },
  cSub:   { width: 90, textAlign: 'right' },

  // ── Totals ──────────────────────────────────────────────────────────────────
  totalsOuter: {
    alignItems: 'flex-end',
    marginTop: 14,
  },
  totalsBox: {
    width: 240,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalsLabel: {
    fontSize: 9,
    color: INK2,
  },
  totalsValue: {
    fontSize: 9,
    fontWeight: 500,
    color: INK,
  },
  discountValue: {
    fontSize: 9,
    fontWeight: 700,
    color: SUCCESS,
  },
  totalsDivider: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
    marginVertical: 6,
  },
  totalRowWrapper: {
    backgroundColor: RUST_LT,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
  },
  totalLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: RUST,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 700,
    color: RUST,
  },

  // ── Notes ───────────────────────────────────────────────────────────────────
  notesSection: {
    marginTop: 24,
  },
  notesLabel: {
    fontSize: 7,
    fontWeight: 700,
    color: INK3,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  notesText: {
    fontSize: 9,
    color: INK2,
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
    fontSize: 7.5,
    color: INK3,
  },
  footerRight: {
    fontSize: 7.5,
    color: INK3,
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
      title={`Presupuesto ${pad(quote.quote_number)} — ${quote.client_name}`}
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
            <Text style={s.docLabel}>Presupuesto</Text>
            <Text style={s.docNumber}>{pad(quote.quote_number)}</Text>
            <Text style={s.docDate}>{fmtDate(quote.created_at)}</Text>
          </View>
        </View>

        {/* Terracotta accent line */}
        <View style={s.dividerAccent} />

        {/* ── Body ── */}
        <View style={s.bodyWrapper}>

          {/* ── Client block ── */}
          <View style={s.clientSection}>
            <Text style={s.clientLabel}>Para</Text>
            <View style={s.clientBlock}>
              <Text style={s.clientName}>{quote.client_name}</Text>
              {quote.client_email ? (
                <Text style={s.clientLine}>{quote.client_email}</Text>
              ) : null}
              {quote.client_phone ? (
                <Text style={s.clientLine}>{quote.client_phone}</Text>
              ) : null}
            </View>
          </View>

          {/* ── Table ── */}
          <View>
            <View style={s.tableHead}>
              <Text style={[s.th, s.cDesc]}>Descripción</Text>
              <Text style={[s.th, s.cQty]}>Cant.</Text>
              <Text style={[s.th, s.cPrice]}>Precio unit.</Text>
              <Text style={[s.th, s.cSub]}>Subtotal</Text>
            </View>

            {items.map((item, idx) => (
              <View
                key={item.id}
                style={[s.tableRow, idx % 2 === 1 ? s.tableRowAlt : {}]}
                wrap={false}
              >
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

          {/* Spacer */}
          <View style={s.spacer} />

          {/* ── Bottom: notas + totales ── */}
          <View style={s.bottomBlock}>

            {quote.notes ? (
              <View style={s.notesSection}>
                <Text style={s.notesLabel}>Notas</Text>
                <Text style={s.notesText}>{quote.notes}</Text>
              </View>
            ) : null}

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

                <View style={s.totalRowWrapper}>
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
