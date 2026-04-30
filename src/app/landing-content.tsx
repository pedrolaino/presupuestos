'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, FileText, Users, Download, Clock, Shield, Zap } from 'lucide-react'

/* ─── Animation helpers ─── */
const ease = [0.22, 1, 0.36, 1] as const

function FadeUp({
  children,
  className,
  delay = 0,
  once = true,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  once?: boolean
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: 0.6, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

function StaggerWrap({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
    >
      {children}
    </motion.div>
  )
}

function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
      }}
    >
      {children}
    </motion.div>
  )
}

/* ─── Nav ─── */
function Nav({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-cream/80 backdrop-blur-md"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rust/15 flex items-center justify-center">
            <span
              className="text-rust font-bold text-base"
              style={{ fontFamily: 'var(--loaded-playfair, Georgia, serif)' }}
            >
              P
            </span>
          </div>
          <span
            className="font-semibold text-ink text-lg"
            style={{ fontFamily: 'var(--loaded-playfair, Georgia, serif)' }}
          >
            Presu
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/demo"
            className="hidden sm:block text-sm font-medium text-ink-2 hover:text-ink transition-colors"
          >
            Probar demo
          </Link>
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 bg-rust text-surface text-sm font-medium px-4 py-2 rounded-lg hover:bg-rust-dark transition-colors shadow-sm"
            >
              Ir al panel
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-ink-2 hover:text-ink transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 bg-rust text-surface text-sm font-medium px-4 py-2 rounded-lg hover:bg-rust-dark transition-colors shadow-sm"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  )
}

/* ─── Hero ─── */
function Hero({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="relative pt-36 pb-24 px-5 sm:px-8 overflow-hidden">
      {/* Background texture elements */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 60% at 50% -10%, rgba(193,75,26,0.08) 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute top-20 right-0 w-72 h-72 rounded-full pointer-events-none"
        aria-hidden
        style={{
          background: 'radial-gradient(circle, rgba(193,75,26,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_auto] gap-16 items-center">
          {/* Left: Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="inline-flex items-center gap-2 bg-rust-light border border-rust-muted text-rust text-xs font-medium px-3 py-1.5 rounded-full mb-8"
            >
              <Zap className="w-3 h-3" />
              Gratis · Sin tarjeta · Sin límites
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-ink leading-[1.08] tracking-tight mb-6"
              style={{ fontFamily: 'var(--loaded-playfair, Georgia, serif)' }}
            >
              Presupuestos
              <br />
              <span className="text-rust italic">que impresionan.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.15, ease }}
              className="text-lg text-ink-2 max-w-xl leading-relaxed mb-10"
            >
              Creá, descargá y enviá presupuestos en PDF con un diseño impecable.
              Para freelancers y pequeños negocios que quieren verse profesionales.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link
                href="/demo"
                className="group flex items-center justify-center gap-2 bg-rust text-surface font-semibold px-6 py-3.5 rounded-xl hover:bg-rust-dark transition-all shadow-md shadow-rust/25 hover:shadow-lg hover:shadow-rust/30 hover:-translate-y-0.5"
              >
                <FileText className="w-4 h-4" />
                Crear presupuesto de prueba
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 bg-surface text-ink border border-border font-medium px-6 py-3.5 rounded-xl hover:bg-cream hover:border-ink-3 transition-all"
              >
                Crear cuenta gratis
                <ArrowRight className="w-4 h-4 text-ink-3" />
              </Link>
            </motion.div>
          </div>

          {/* Right: PDF mockup card */}
          <motion.div
            initial={{ opacity: 0, x: 32, rotate: 2 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease }}
            className="hidden lg:block w-80 shrink-0"
          >
            <div className="bg-surface rounded-2xl border border-border shadow-2xl shadow-ink/10 overflow-hidden">
              {/* Doc header */}
              <div className="bg-ink px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rust/30 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-rust-light" />
                  </div>
                  <div>
                    <div className="h-2.5 w-20 bg-surface/30 rounded mb-1.5" />
                    <div className="h-2 w-14 bg-surface/15 rounded" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-surface/40 text-xs mb-1">Presupuesto</div>
                  <div
                    className="text-surface font-bold text-xl"
                    style={{ fontFamily: 'var(--loaded-dm-mono, monospace)' }}
                  >
                    #0042
                  </div>
                </div>
              </div>

              {/* Doc body */}
              <div className="px-6 py-5 space-y-4 bg-surface">
                <div className="grid grid-cols-2 gap-4">
                  {[0, 1].map((i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="h-1.5 w-12 bg-border rounded" />
                      <div className="h-2.5 w-24 bg-ink-4/50 rounded" />
                      <div className="h-1.5 w-16 bg-border rounded" />
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4">
                  {/* Table header */}
                  <div className="grid grid-cols-[1fr_48px_72px_72px] gap-2 mb-3">
                    {['Descripción', 'Cant.', 'Precio', 'Total'].map((h) => (
                      <div key={h} className="h-1.5 bg-ink-4/30 rounded" />
                    ))}
                  </div>

                  {[0.75, 0.45, 0.9].map((w, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[1fr_48px_72px_72px] gap-2 py-2 border-t border-border-light"
                    >
                      <div className="h-2 bg-ink-4/20 rounded" style={{ width: `${w * 100}%` }} />
                      <div className="h-2 bg-ink-4/20 rounded" />
                      <div className="h-2 bg-ink-4/20 rounded" />
                      <div className="h-2 bg-rust/20 rounded" />
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t border-border pt-3 flex justify-end">
                  <div className="text-right space-y-1">
                    <div className="h-1.5 w-16 bg-ink-4/20 rounded ml-auto" />
                    <div className="h-3.5 w-24 bg-rust/25 rounded ml-auto" />
                  </div>
                </div>

                {/* Status pill */}
                <div className="flex justify-between items-center pt-1">
                  <div className="flex gap-1.5">
                    <div className="h-2 w-8 bg-ink-4/20 rounded" />
                    <div className="h-2 w-12 bg-ink-4/20 rounded" />
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/20">
                    Aprobado
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ─── Steps ─── */
function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Completá los datos',
      desc: 'Cargá los datos de tu negocio y de tu cliente una sola vez. Presu los recuerda para la próxima.',
      icon: Users,
    },
    {
      num: '02',
      title: 'Agregá los ítems',
      desc: 'Listá los servicios o productos con precio y cantidad. El total se calcula solo.',
      icon: FileText,
    },
    {
      num: '03',
      title: 'Descargá el PDF',
      desc: 'Generá un PDF con diseño limpio y profesional. Listo para enviar por email o WhatsApp.',
      icon: Download,
    },
  ]

  return (
    <section className="py-24 px-5 sm:px-8 bg-ink">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-surface/10" />
            <span className="text-surface/40 text-xs font-medium uppercase tracking-widest">Cómo funciona</span>
            <div className="h-px flex-1 bg-surface/10" />
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold text-surface text-center leading-tight"
            style={{ fontFamily: 'var(--loaded-playfair, Georgia, serif)' }}
          >
            Tres pasos.
            <span className="text-rust italic"> Eso es todo.</span>
          </h2>
          <p className="text-surface/50 text-lg text-center mt-4 max-w-lg mx-auto">
            Sin curvas de aprendizaje. En minutos tenés tu primer presupuesto listo.
          </p>
        </FadeUp>

        <StaggerWrap className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((step) => (
            <StaggerItem key={step.num}>
              <div className="group relative bg-sidebar-surface rounded-2xl p-8 border border-sidebar-border hover:border-rust/30 transition-all duration-300 hover:-translate-y-1 h-full">
                <div
                  className="text-6xl font-bold text-surface/5 leading-none mb-5 select-none"
                  style={{ fontFamily: 'var(--loaded-playfair, Georgia, serif)' }}
                >
                  {step.num}
                </div>
                <div className="w-10 h-10 rounded-xl bg-rust/15 text-rust flex items-center justify-center mb-4 group-hover:bg-rust/25 transition-colors">
                  <step.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-surface mb-2">{step.title}</h3>
                <p className="text-surface/45 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerWrap>
      </div>
    </section>
  )
}

/* ─── Features ─── */
function Features() {
  const features = [
    {
      icon: FileText,
      title: 'PDFs con diseño profesional',
      desc: 'Cada presupuesto tiene tu logo, datos de contacto, desglose de ítems y totales. Limpio, moderno y listo para enviar.',
    },
    {
      icon: Users,
      title: 'Clientes guardados',
      desc: 'Guardá la información de tus clientes habituales y seleccionálos con un click. Sin reescribir nada.',
    },
    {
      icon: Clock,
      title: 'Historial completo',
      desc: 'Todos tus presupuestos quedan guardados con estado. Podés re-descargar cualquier PDF cuando quieras.',
    },
    {
      icon: Shield,
      title: 'Gratis, sin límites ocultos',
      desc: 'No hay planes de pago, no hay límite de presupuestos, no hay funciones bloqueadas.',
    },
  ]

  return (
    <section className="py-24 px-5 sm:px-8 bg-cream">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-ink-3 text-xs font-medium uppercase tracking-widest">Por qué Presu</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold text-ink text-center leading-tight"
            style={{ fontFamily: 'var(--loaded-playfair, Georgia, serif)' }}
          >
            Todo lo que necesitás.
            <br />
            <span className="text-ink-3 italic">Nada de lo que no.</span>
          </h2>
        </FadeUp>

        <StaggerWrap className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <div className="flex gap-5 p-7 rounded-2xl border border-border bg-surface hover:border-rust/25 hover:shadow-md hover:shadow-rust/5 transition-all duration-300 h-full group">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-rust-light text-rust flex items-center justify-center group-hover:bg-rust-muted transition-colors">
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink mb-1.5">{f.title}</h3>
                  <p className="text-ink-2 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerWrap>
      </div>
    </section>
  )
}

/* ─── Stats ─── */
function Stats() {
  const stats = [
    { value: '100%', label: 'Gratis para siempre' },
    { value: 'PDF', label: 'Descarga instantánea' },
    { value: '∞', label: 'Presupuestos ilimitados' },
  ]

  return (
    <section className="py-16 px-5 sm:px-8 border-y border-border bg-surface">
      <div className="max-w-3xl mx-auto">
        <StaggerWrap className="grid grid-cols-3 gap-6 sm:gap-16 text-center">
          {stats.map((s) => (
            <StaggerItem key={s.label}>
              <div
                className="text-4xl sm:text-5xl font-bold text-rust mb-2"
                style={{ fontFamily: 'var(--loaded-playfair, Georgia, serif)' }}
              >
                {s.value}
              </div>
              <div className="text-xs sm:text-sm text-ink-2 leading-tight">{s.label}</div>
            </StaggerItem>
          ))}
        </StaggerWrap>
      </div>
    </section>
  )
}

/* ─── CTA final ─── */
function FinalCTA({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="py-28 px-5 sm:px-8 bg-cream relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(ellipse 60% 80% at 50% 100%, rgba(193,75,26,0.07) 0%, transparent 70%)`,
        }}
      />

      <div className="max-w-2xl mx-auto text-center relative">
        <FadeUp>
          <p className="text-rust text-sm font-medium uppercase tracking-widest mb-4">Empezá hoy</p>
          <h2
            className="text-4xl sm:text-5xl font-bold text-ink mb-5 leading-tight"
            style={{ fontFamily: 'var(--loaded-playfair, Georgia, serif)' }}
          >
            Tu próximo presupuesto,
            <br />
            <span className="italic text-rust">en minutos.</span>
          </h2>
          <p className="text-ink-2 text-lg mb-10 max-w-md mx-auto">
            Creá tu cuenta en segundos y generá tu primer presupuesto profesional antes de que termine el día.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/demo"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-surface text-ink border border-border font-medium px-6 py-3.5 rounded-xl hover:bg-cream hover:border-ink-3 transition-all"
            >
              <FileText className="w-4 h-4 text-ink-3" />
              Probar sin registrarse
            </Link>
            {!isLoggedIn && (
              <Link
                href="/register"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-rust text-surface font-semibold px-6 py-3.5 rounded-xl hover:bg-rust-dark transition-all shadow-lg shadow-rust/25 hover:shadow-xl hover:shadow-rust/30 hover:-translate-y-0.5"
              >
                Crear cuenta gratis
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="py-8 px-5 sm:px-8 bg-ink border-t border-sidebar-border">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-rust/20 flex items-center justify-center">
            <span
              className="text-rust font-bold text-xs"
              style={{ fontFamily: 'var(--loaded-playfair, Georgia, serif)' }}
            >
              P
            </span>
          </div>
          <span
            className="font-semibold text-surface/70 text-sm"
            style={{ fontFamily: 'var(--loaded-playfair, Georgia, serif)' }}
          >
            Presu
          </span>
        </div>
        <p className="text-surface/30 text-sm">
          Presupuestos profesionales para freelancers y pequeños negocios.
        </p>
      </div>
    </footer>
  )
}

/* ─── Main export ─── */
interface Props {
  isLoggedIn: boolean
}

export function LandingContent({ isLoggedIn }: Props) {
  return (
    <div className="min-h-screen bg-cream">
      <Nav isLoggedIn={isLoggedIn} />
      <Hero isLoggedIn={isLoggedIn} />
      <HowItWorks />
      <Features />
      <Stats />
      <FinalCTA isLoggedIn={isLoggedIn} />
      <Footer />
    </div>
  )
}
