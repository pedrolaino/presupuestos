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
      <div className="px-3 pt-4 pb-2">
        <Link
          href="/presupuestos/nuevo"
          onClick={onClose}
          className="flex items-center gap-2 w-full bg-white text-[#1e3a5f] rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-blue-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo presupuesto
        </Link>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </>
  )
}

// Header mobile
export function MobileHeader() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#1e3a5f] flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="bg-white/10 rounded-lg p-1.5">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-base tracking-tight">PresupuestoPro</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="text-white/80 hover:text-white p-1"
          aria-label="Abrir menú"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'lg:hidden fixed top-0 left-0 h-full w-72 z-50 bg-[#1e3a5f] flex flex-col transition-transform duration-200',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white/10 rounded-lg p-1.5">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-base tracking-tight">PresupuestoPro</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-white/70 hover:text-white"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <NavLinks onClose={() => setOpen(false)} />
      </div>
    </>
  )
}

// Sidebar desktop
export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-60 bg-[#1e3a5f] flex-col h-full shrink-0">
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="bg-white/10 rounded-lg p-1.5">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-base tracking-tight">PresupuestoPro</span>
        </div>
      </div>
      <NavLinks />
    </aside>
  )
}
