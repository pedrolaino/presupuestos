'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FileText, Zap, Users, Download, ArrowRight,
  CheckCircle, Clock, Shield,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

function InView({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeUp}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

function StaggerGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={stagger}
    >
      {children}
    </motion.div>
  )
}

function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

interface Props {
  isLoggedIn: boolean
}

export function LandingContent({ isLoggedIn }: Props) {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Nav ── */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#1e3a5f] rounded-lg p-1.5">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[#1e3a5f] text-lg">Presu</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/demo" className="text-sm font-medium text-slate-600 hover:text-[#1e3a5f] transition-colors hidden sm:block">
              Probar demo
            </Link>
            {isLoggedIn ? (
              <Link href="/dashboard" className="bg-[#1e3a5f] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#162d4a] transition-colors">
                Ir al panel
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-[#1e3a5f] transition-colors">
                  Iniciar sesión
                </Link>
                <Link href="/register" className="bg-[#1e3a5f] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#162d4a] transition-colors">
                  Crear cuenta
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* ── Hero ── */}
      <section className="pt-32 pb-24 px-4 sm:px-6 bg-gradient-to-b from-[#0f2340] via-[#1e3a5f] to-[#1e3a5f]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full mb-8 border border-white/10"
          >
            <Zap className="w-3 h-3" />
            Gratis. Sin tarjeta de crédito. Sin complicaciones.
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-6xl font-bold text-white leading-tight tracking-tight mb-6"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Presupuestos profesionales{' '}
            <span className="text-blue-300">en minutos</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Creá, descargá y enviá presupuestos en PDF con un diseño limpio y
            profesional. Ideal para freelancers y pequeños negocios que quieren
            causar una buena impresión.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/demo"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-[#1e3a5f] font-semibold px-6 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg shadow-black/10"
            >
              <FileText className="w-4 h-4" />
              Crear presupuesto de prueba
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 text-white font-medium px-6 py-3.5 rounded-xl hover:bg-white/20 transition-colors border border-white/20"
            >
              Crear cuenta gratis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* PDF mockup */}
        <motion.div
          className="max-w-2xl mx-auto mt-20"
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="bg-white rounded-2xl shadow-2xl shadow-black/30 overflow-hidden border border-white/10">
            <div className="bg-[#0f2340] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white/60" />
                </div>
                <div>
                  <div className="h-2.5 w-24 bg-white/40 rounded" />
                  <div className="h-2 w-16 bg-white/20 rounded mt-1.5" />
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/50 text-xs">Presupuesto</div>
                <div className="text-white font-bold text-lg">#0001</div>
              </div>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[0, 1].map(i => (
                  <div key={i} className="space-y-1.5">
                    <div className="h-2 w-16 bg-slate-200 rounded" />
                    <div className="h-2.5 w-28 bg-slate-300 rounded" />
                    <div className="h-2 w-20 bg-slate-200 rounded" />
                    <div className="h-2 w-24 bg-slate-200 rounded" />
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4">
                <div className="grid grid-cols-[1fr_60px_80px_80px] gap-2 mb-2">
                  {['Descripción', 'Cant.', 'Precio', 'Total'].map(h => (
                    <div key={h} className="h-2 bg-slate-200 rounded" />
                  ))}
                </div>
                {[0.7, 0.5, 0.85].map((w, i) => (
                  <div key={i} className="grid grid-cols-[1fr_60px_80px_80px] gap-2 py-1.5 border-t border-slate-50">
                    <div className="h-2 bg-slate-100 rounded" style={{ width: `${w * 100}%` }} />
                    <div className="h-2 bg-slate-100 rounded" />
                    <div className="h-2 bg-slate-100 rounded" />
                    <div className="h-2 bg-slate-200 rounded" />
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-end">
                <div className="text-right">
                  <div className="h-2 w-20 bg-slate-200 rounded ml-auto mb-1.5" />
                  <div className="h-4 w-28 bg-[#1e3a5f]/20 rounded ml-auto" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Cómo funciona ── */}
      <section className="py-24 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <InView className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Tres pasos. Eso es todo.
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Sin curvas de aprendizaje. Sin configuraciones eternas. En minutos tenés tu primer presupuesto listo.
            </p>
          </InView>
          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Completá los datos', desc: 'Cargá los datos de tu negocio y de tu cliente una sola vez. Presu los recuerda para la próxima.', icon: Users },
              { num: '02', title: 'Agregá los ítems', desc: 'Listá los servicios o productos con precio y cantidad. El total se calcula solo.', icon: FileText },
              { num: '03', title: 'Descargá el PDF', desc: 'Generá un PDF con diseño limpio y profesional. Listo para enviar por email o WhatsApp.', icon: Download },
            ].map((step) => (
              <StaggerItem key={step.num}>
                <div className="bg-white rounded-2xl p-8 border border-slate-200 h-full hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="text-5xl font-bold text-slate-100 mb-4 leading-none">{step.num}</div>
                  <div className="bg-[#1e3a5f]/10 text-[#1e3a5f] w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <InView className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Todo lo que necesitás, nada de lo que no.
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Diseñado para freelancers y pequeños negocios que quieren una herramienta simple y efectiva.
            </p>
          </InView>
          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: FileText, title: 'PDFs con diseño profesional', desc: 'Cada presupuesto se genera con tipografía Inter, logo de tu negocio, desglose de ítems y totales. Limpio, moderno y listo para enviar.' },
              { icon: Users, title: 'Clientes guardados', desc: 'Guardá la información de tus clientes habituales y seleccionálos con un click al crear un nuevo presupuesto. Sin reescribir nada.' },
              { icon: Clock, title: 'Historial completo', desc: 'Todos tus presupuestos quedan guardados con estado (borrador, enviado, aprobado). Podés re-descargar cualquier PDF cuando quieras.' },
              { icon: Shield, title: 'Gratis, sin límites ocultos', desc: 'No hay planes de pago, no hay límite de presupuestos, no hay funciones bloqueadas. Creá todo lo que necesitás sin pagar nada.' },
            ].map((f) => (
              <StaggerItem key={f.title}>
                <div className="flex gap-5 p-6 rounded-2xl border border-slate-200 hover:border-[#1e3a5f]/30 hover:shadow-md transition-all duration-300 h-full">
                  <div className="shrink-0 bg-[#1e3a5f]/8 text-[#1e3a5f] w-11 h-11 rounded-xl flex items-center justify-center">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1.5">{f.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ── Checklist ── */}
      <section className="py-16 px-4 sm:px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-3xl mx-auto">
          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
            {[
              'PDF con tu logo y datos de tu negocio',
              'Clientes guardados para reutilizar',
              'Descuento por porcentaje o monto fijo',
              'Estado del presupuesto en tiempo real',
              'Historial completo de presupuestos',
              'Funciona desde el celular',
            ].map((item) => (
              <StaggerItem key={item}>
                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-700 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-[#1e3a5f] shrink-0" />
                  <span>{item}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-24 px-4 sm:px-6 bg-[#1e3a5f]">
        <div className="max-w-3xl mx-auto text-center">
          <InView>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Empezá hoy. Es gratis.
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
              Creá tu cuenta en segundos y generá tu primer presupuesto profesional antes de que termine el día.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/demo"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 text-white font-medium px-6 py-3.5 rounded-xl hover:bg-white/20 transition-colors border border-white/20"
              >
                <FileText className="w-4 h-4" />
                Probar sin registrarse
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-[#1e3a5f] font-semibold px-6 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg shadow-black/10"
              >
                Crear cuenta gratis
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </InView>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-4 sm:px-6 bg-[#0f2340]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-white/40 text-sm">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="font-semibold text-white/60">Presu</span>
          </div>
          <p>Presupuestos profesionales para freelancers y pequeños negocios.</p>
        </div>
      </footer>
    </div>
  )
}
