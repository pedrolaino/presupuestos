export default function DashboardLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pulse">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
            <div className="h-7 w-10 bg-slate-200 rounded mb-2" />
            <div className="h-3.5 w-24 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-40 bg-slate-200 rounded" />
          <div className="h-4 w-52 bg-slate-100 rounded" />
        </div>
        <div className="h-9 w-32 bg-slate-200 rounded-lg" />
      </div>

      {/* Recent quotes */}
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between px-4 sm:px-6 py-4 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-3.5 w-12 bg-slate-200 rounded shrink-0" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-32 bg-slate-200 rounded" />
                <div className="h-3 w-20 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="h-5 w-16 bg-slate-100 rounded-full" />
              <div className="h-4 w-20 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
