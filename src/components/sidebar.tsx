'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import {
  FileText,
  Users,
  LayoutDashboard,
  UserCircle,
  LogOut,
  Plus,
  Menu,
  X,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { href: '/presupuestos', label: 'Presupuestos', icon: FileText },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/perfil', label: 'Mi perfil', icon: UserCircle },
]

function NavLinks({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      <div className="px-4 pt-5 pb-3">
        <Link
          href="/presupuestos/nuevo"
          onClick={onClose}
          className="flex items-center gap-2 w-full bg-rust text-surface rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-rust-dark transition-colors shadow-sm shadow-rust/30"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Nuevo presupuesto</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-0.5 sidebar-scroll overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-sidebar-hover text-surface border border-sidebar-border'
                  : 'text-sidebar-text hover:bg-sidebar-hover hover:text-surface/90'
              )}
            >
              <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-rust' : 'text-sidebar-text/60')} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-sidebar-text hover:bg-sidebar-hover hover:text-surface/90 transition-all duration-150"
        >
          <LogOut className="w-4 h-4 shrink-0 text-sidebar-text/60" />
          Cerrar sesión
        </button>
      </div>
    </>
  )
}

export function MobileHeader() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-rust/20 flex items-center justify-center">
            <span className="text-rust font-bold text-sm" style={{ fontFamily: 'var(--loaded-playfair, Georgia, serif)' }}>P</span>
          </div>
          <span className="text-surface font-semibold text-base tracking-tight" style={{ fontFamily: 'var(--loaded-playfair, Georgia, serif)' }}>Presu</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="text-sidebar-text hover:text-surface p-1 transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={cn(
          'lg:hidden fixed top-0 left-0 h-full w-72 z-50 bg-sidebar flex flex-col transition-transform duration-200 ease-out border-r border-sidebar-border',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="px-5 py-4 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-rust/20 flex items-center justify-center">
              <span className="text-rust font-bold text-sm" style={{ fontFamily: 'var(--loaded-playfair, Georgia, serif)' }}>P</span>
            </div>
            <span className="text-surface font-semibold text-base" style={{ fontFamily: 'var(--loaded-playfair, Georgia, serif)' }}>Presu</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-sidebar-text hover:text-surface transition-colors p-1"
            aria-label="Cerrar menú"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <NavLinks onClose={() => setOpen(false)} />
      </div>
    </>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-60 bg-sidebar flex-col h-full shrink-0 border-r border-sidebar-border">
      <div className="px-5 py-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rust/20 flex items-center justify-center">
            <span className="text-rust font-bold text-base" style={{ fontFamily: 'var(--loaded-playfair, Georgia, serif)' }}>P</span>
          </div>
          <div>
            <div className="text-surface font-semibold text-base leading-none" style={{ fontFamily: 'var(--loaded-playfair, Georgia, serif)' }}>Presu</div>
            <div className="text-sidebar-text/50 text-xs mt-0.5">presupuestos pro</div>
          </div>
        </div>
      </div>
      <NavLinks />
    </aside>
  )
}
