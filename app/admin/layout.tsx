'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, CalendarCheck, Users, LogOut } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/reservas', label: 'Reservas', icon: CalendarCheck },
  { href: '/admin/contactos', label: 'Contactos', icon: Users },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#07070f] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#0a0a14] border-r border-[#1e1e2e] flex flex-col fixed h-full z-10">
        <div className="p-5 border-b border-[#1e1e2e]">
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="360TourX" className="w-7 h-7" />
            <span className="font-bold text-white text-sm tracking-tight">
              360Tour<span className="text-violet-400">X</span>
              <span className="text-slate-500 font-normal ml-1">Admin</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  active
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-[#1e1e2e]">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut size={16} />
            Volver a la web
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-56 p-8 min-h-screen">
        {children}
      </main>
    </div>
  )
}
