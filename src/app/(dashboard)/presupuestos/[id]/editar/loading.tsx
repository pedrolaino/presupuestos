export default function EditarPresupuestoLoading() {
  return (
    <div className="space-y-6 pb-10 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-7 w-56 bg-slate-200 rounded" />
        <div className="h-4 w-64 bg-slate-100 rounded" />
      </div>

      {/* Estado card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
        <div className="h-4 w-14 bg-slate-200 rounded" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-7 w-20 bg-slate-100 rounded-full" />
          ))}
        </div>
      </div>

      {/* Cliente card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div className="h-4 w-16 bg-slate-200 rounded" />
        <div className="h-9 w-48 bg-slate-100 rounded-lg" />
        <div className="h-10 w-full bg-slate-100 rounded-md" />
      </div>

      {/* Ítems card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
        <div className="h-4 w-12 bg-slate-200 rounded" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="grid grid-cols-[1fr_80px_120px_36px] gap-3">
            <div className="h-9 bg-slate-100 rounded-md" />
            <div className="h-9 bg-slate-100 rounded-md" />
            <div className="h-9 bg-slate-100 rounded-md" />
            <div className="h-9 w-9 bg-slate-100 rounded-md" />
          </div>
        ))}
        <div className="border-t border-slate-200 pt-4 space-y-2">
          <div className="flex justify-between">
            <div className="h-4 w-16 bg-slate-100 rounded" />
            <div className="h-4 w-24 bg-slate-200 rounded" />
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-200">
            <div className="h-5 w-12 bg-slate-200 rounded" />
            <div className="h-7 w-32 bg-slate-200 rounded" />
          </div>
        </div>
      </div>

      {/* Notas card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
        <div className="h-4 w-14 bg-slate-200 rounded" />
        <div className="h-24 w-full bg-slate-100 rounded-md" />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <div className="h-10 w-20 bg-slate-100 rounded-lg" />
        <div className="h-10 w-40 bg-slate-200 rounded-lg" />
      </div>
    </div>
  )
}
