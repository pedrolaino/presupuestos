export default function PerfilLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-7 w-32 bg-slate-200 rounded" />
        <div className="h-4 w-56 bg-slate-100 rounded" />
      </div>

      {/* Logo card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div className="h-4 w-28 bg-slate-200 rounded" />
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-xl bg-slate-100 shrink-0" />
          <div className="space-y-2">
            <div className="h-8 w-28 bg-slate-200 rounded-lg" />
            <div className="h-3 w-36 bg-slate-100 rounded" />
          </div>
        </div>
      </div>

      {/* Datos del negocio card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div className="h-4 w-36 bg-slate-200 rounded" />
        <div className="h-10 w-full bg-slate-100 rounded-md" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-slate-100 rounded-md" />
          <div className="h-10 bg-slate-100 rounded-md" />
        </div>
        <div className="h-10 w-full bg-slate-100 rounded-md" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-slate-100 rounded-md" />
          <div className="h-10 bg-slate-100 rounded-md" />
        </div>
        <div className="h-10 w-full bg-slate-100 rounded-md" />
      </div>

      {/* Button */}
      <div className="flex justify-end">
        <div className="h-11 w-36 bg-slate-200 rounded-lg" />
      </div>
    </div>
  )
}
