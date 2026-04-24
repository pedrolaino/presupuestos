import Link from 'next/link'
import { DemoForm } from './demo-form'
import { FileText, ArrowLeft } from 'lucide-react'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="bg-[#1e3a5f] rounded-lg p-1">
                <FileText className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-[#1e3a5f]">Presu</span>
            </div>
            <span className="text-slate-300">·</span>
            <span className="text-sm text-slate-500">Presupuesto de prueba</span>
          </div>
          <Link
            href="/register"
            className="text-sm font-medium bg-[#1e3a5f] text-white px-4 py-1.5 rounded-lg hover:bg-[#162d4a] transition-colors"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </header>

      {/* Banner */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 text-center">
          <p className="text-sm text-blue-700">
            Modo demo — el presupuesto se genera con datos genéricos de negocio y{' '}
            <strong>no se guarda</strong>.{' '}
            <Link href="/register" className="underline font-semibold hover:text-blue-900">
              Creá tu cuenta gratis
            </Link>{' '}
            para guardar todo.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Nuevo presupuesto (demo)</h1>
          <p className="text-slate-500 text-sm mt-1">
            Completá los datos y descargá el PDF. Así de simple.
          </p>
        </div>
        <DemoForm />
      </div>
    </div>
  )
}
