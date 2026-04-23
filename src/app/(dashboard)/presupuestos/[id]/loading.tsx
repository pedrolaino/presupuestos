export default function PresupuestoDetailLoading() {
  return (
    <div className="space-y-6 pb-10 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-slate-200 rounded-lg" />
          <div className="space-y-2">
            <div className="h-7 w-48 bg-slate-200 rounded" />
            <div className="h-4 w-28 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-20 bg-slate-200 rounded-lg" />
          <div className="h-9 w-32 bg-slate-200 rounded-lg" />
        </div>
      </div>

      {/* Status pills */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-7 w-20 bg-slate-100 rounded-full" />
          ))}
        </div>
      </div>

      {/* Business + Client cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 space-y-2">
            <div className="h-3.5 w-20 bg-slate-100 rounded" />
            <div className="h-4 w-36 bg-slate-200 rounded" />
            <div className="h-3.5 w-28 bg-slate-100 rounded" />
            <div className="h-3.5 w-32 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      {/* Items table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="h-4 w-12 bg-slate-200 rounded" />
        </div>
        <div className="divide-y divide-slate-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between px-6 py-3 gap-4">
              <div className="h-3.5 flex-1 bg-slate-100 rounded" />
              <div className="h-3.5 w-8 bg-slate-100 rounded" />
              <div className="h-3.5 w-20 bg-slate-100 rounded" />
              <div className="h-3.5 w-20 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-slate-200 space-y-2">
          <div className="flex justify-between">
            <div className="h-3.5 w-16 bg-slate-100 rounded" />
            <div className="h-3.5 w-20 bg-slate-100 rounded" />
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-200">
            <div className="h-5 w-12 bg-slate-200 rounded" />
            <div className="h-6 w-28 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
