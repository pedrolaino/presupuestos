import { Sidebar, MobileHeader } from '@/components/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile header + drawer */}
      <MobileHeader />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Spacer for mobile top bar */}
        <div className="h-14 lg:hidden" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
