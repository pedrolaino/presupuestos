import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  FileText, Zap, Users, Download, ArrowRight,
  CheckCircle, Clock, Shield,
} from 'lucide-react'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-white">
      {/* ── Nav ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#1e3a5f] rounded-lg p-1.5">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[#1e3a5f] text-lg">Presu</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/demo"
              className="text-sm font-medium text-slate-600 hover:text-[#1e3a5f] transition-colors hidden sm:block"
            >
              Probar demo
            </Link>
            {user ? (
              <Link
                href="/dashboard"
                className="bg-[#1e3a5f] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#162d4a] transition-colors"
              >
                Ir al panel
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-600 hover:text-[#1e3a5f] transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="bg-[#1e3a5f] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#162d4a] transition-colors"
                >
                  Crear cuenta
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="pt-32 pb-24 px-4 sm:px-6 bg-gradient-to-b from-[#0f2340] via-[#1e3a5f] to-[#1e3a5f]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full mb-8 border border-white/10">
            <Zap className="w-3 h-3" />
            Gratis. Sin tarjeta de crédito. Sin complicaciones.
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
            Presupuestos profesionales{' '}
            <span className="text-blue-300">en minutos</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Creá, descargá y enviá presupuestos en PDF con un diseño limpio y
            profesional. Ideal para freelancers y pequeños negocios que quieren
            causar una buena impresión.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
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
          </div>
        </div>

        {/* PDF mockup */}
        <div className="max-w-2xl mx-auto mt-20">
          <div className="bg-white rounded-2xl shadow-2xl shadow-black/30 overflow-hidden border border-white/10">
            {/* PDF header mock */}
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
            {/* PDF body mock */}
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
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      <section className="py-24 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Tres pasos. Eso es todo.
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Sin curvas de aprendizaje. Sin configuraciones eternas. En minutos tenés tu primer presupuesto listo.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
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
            ].map((step) => (
              <div key={step.num} className="relative">
                <div className="bg-white rounded-2xl p-8 border border-slate-200 h-full">
                  <div className="text-5xl font-bold text-slate-100 mb-4 leading-none">{step.num}</div>
                  <div className="bg-[#1e3a5f]/10 text-[#1e3a5f] w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Todo lo que necesitás, nada de lo que no.
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Diseñado para freelancers y pequeños negocios que quieren una herramienta simple y efectiva.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: FileText,
                title: 'PDFs con diseño profesional',
                desc: 'Cada presupuesto se genera con tipografía Inter, logo de tu negocio, desglose de ítems y totales. Limpio, moderno y listo para enviar.',
              },
              {
                icon: Users,
                title: 'Clientes guardados',
                desc: 'Guardá la información de tus clientes habituales y seleccionálos con un click al crear un nuevo presupuesto. Sin reescribir nada.',
              },
              {
                icon: Clock,
                title: 'Historial completo',
                desc: 'Todos tus presupuestos quedan guardados con estado (borrador, enviado, aprobado). Podés re-descargar cualquier PDF cuando quieras.',
              },
              {
                icon: Shield,
                title: 'Gratis, sin límites ocultos',
                desc: 'No hay planes de pago, no hay límite de presupuestos, no hay funciones bloqueadas. Creá todo lo que necesitás sin pagar nada.',
              },
            ].map((f) => (
              <div key={f.title} className="flex gap-5 p-6 rounded-2xl border border-slate-200 hover:border-[#1e3a5f]/30 hover:shadow-sm transition-all">
                <div className="shrink-0 bg-[#1e3a5f]/8 text-[#1e3a5f] w-11 h-11 rounded-xl flex items-center justify-center">
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1.5">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Checklist social proof ── */}
      <section className="py-16 px-4 sm:px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'PDF con tu logo y datos de tu negocio',
              'Clientes guardados para reutilizar',
              'Descuento por porcentaje o monto fijo',
              'Estado del presupuesto (borrador, enviado, aprobado)',
              'Historial de todos tus presupuestos',
              'Funciona desde el celular',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-[#1e3a5f] shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-24 px-4 sm:px-6 bg-[#1e3a5f]">
        <div className="max-w-3xl mx-auto text-center">
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
