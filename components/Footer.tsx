import Link from 'next/link'
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react'

const footerLinks = {
  servicios: [
    { href: '/reserva', label: 'Tour Virtual hasta 100m²' },
    { href: '/reserva', label: 'Tour Virtual hasta 200m²' },
    { href: '/reserva', label: 'Tour Virtual hasta 300m²' },
    { href: '/reserva', label: 'Tour Virtual +300m²' },
  ],
  empresa: [
    { href: '/que-es-un-tour-virtual', label: 'Qué es un Tour Virtual' },
    { href: '/como-funcionamos', label: 'Cómo Funcionamos' },
    { href: '/proyectos', label: 'Proyectos' },
    { href: '/inmobiliarias', label: 'Para Inmobiliarias' },
    { href: '/precios', label: 'Planes y Precios' },
  ],
  legal: [
    { href: '/privacidad', label: 'Política de Privacidad' },
    { href: '/terminos', label: 'Términos y Condiciones' },
    { href: '/reembolso', label: 'Política de Reembolso' },
    { href: '/accesibilidad', label: 'Accesibilidad' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0f] border-t border-[#1e1e2e] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="360TourX" className="w-9 h-9" />
              <span className="font-bold text-white text-lg tracking-tight">
                360Tour<span className="text-violet-400">X</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Expertos en tours virtuales 360° para inmuebles y negocios. Transformamos tu espacio en
              una experiencia inmersiva que vende.
            </p>
            <div className="space-y-3">
              <a
                href="tel:+34644857326"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-violet-400 transition-colors"
              >
                <Phone size={15} className="text-violet-500 shrink-0" />
                +34 644 85 73 26
              </a>
              <a
                href="mailto:hola@360tourx.com"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-violet-400 transition-colors"
              >
                <Mail size={15} className="text-violet-500 shrink-0" />
                hola@360tourx.com
              </a>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin size={15} className="text-violet-500 shrink-0" />
                Madrid, España
              </div>
            </div>
            {/* Social */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-[#1e1e2e] flex items-center justify-center text-slate-400 hover:text-violet-400 hover:border-violet-500/50 transition-all"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-[#1e1e2e] flex items-center justify-center text-slate-400 hover:text-violet-400 hover:border-violet-500/50 transition-all"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              {/* TikTok */}
              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-[#1e1e2e] flex items-center justify-center text-slate-400 hover:text-violet-400 hover:border-violet-500/50 transition-all"
                aria-label="TikTok"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Servicios
            </h3>
            <ul className="space-y-3">
              {footerLinks.servicios.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-violet-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Empresa
            </h3>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-violet-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + CTA */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3 mb-8">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-violet-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="card p-5 glow">
              <p className="text-sm text-slate-300 mb-3 font-medium">
                ¿Listo para el siguiente nivel?
              </p>
              <Link href="/reserva" className="btn-primary w-full text-sm py-2.5">
                Reservar tour
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-[#1e1e2e] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© 2026 360TourX. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <span>Pagos seguros con</span>
            <span className="text-violet-400 font-semibold">Stripe</span>
            <span>&</span>
            <span className="text-blue-400 font-semibold">PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
