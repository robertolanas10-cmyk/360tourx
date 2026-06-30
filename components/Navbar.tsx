'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/reserva', label: 'Reserva tu tour' },
  { href: '/que-es-un-tour-virtual', label: 'Conoce más' },
  { href: '/proyectos', label: 'Proyectos' },
  { href: '/como-funcionamos', label: 'Funcionamiento' },
  { href: '/precios', label: 'Planes y Precios' },
  { href: '/inmobiliarias', label: 'Inmobiliarias' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0f]/95 backdrop-blur-md border-b border-[#1e1e2e] shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="360TourX" className="w-9 h-9" />
            <span className="font-bold text-white text-lg tracking-tight">
              360Tour<span className="text-violet-400">X</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.slice(0, 6).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  pathname === link.href
                    ? 'text-violet-400 bg-violet-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/inmobiliarias"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                pathname === '/inmobiliarias'
                  ? 'text-violet-400 bg-violet-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Inmobiliarias
            </Link>
            <Link href="/reserva" className="btn-primary text-sm py-2">
              Reservar ahora
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="lg:hidden border-t border-[#1e1e2e] bg-[#0a0a0f]/98 backdrop-blur-md">
            <div className="px-2 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-violet-400 bg-violet-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-[#1e1e2e] mt-2">
                <a
                  href="tel:+34644857326"
                  className="flex items-center gap-2 px-4 py-3 text-sm text-slate-400 hover:text-violet-400 transition-colors"
                >
                  <Phone size={16} />
                  +34 644 85 73 26
                </a>
                <Link href="/reserva" className="btn-primary w-full mt-2 text-sm">
                  Reservar ahora
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
