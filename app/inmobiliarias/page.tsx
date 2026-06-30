import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Building2, CheckCircle, Clock, Shield, Star, Zap, Phone } from 'lucide-react'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Para Inmobiliarias',
  description:
    'Oferta especial para agencias inmobiliarias. Tours virtuales 360° a precios reducidos con entrega prioritaria y soporte dedicado. Madrid y alrededores.',
}

const advantages = [
  {
    icon: Zap,
    title: 'Entrega prioritaria',
    description: 'Tus tours se procesan con prioridad. Resultado en menos de 24 horas, siempre.',
  },
  {
    icon: Star,
    title: 'Precios exclusivos',
    description: 'Tarifas especiales por volumen para agencias con múltiples propiedades mensuales.',
  },
  {
    icon: Shield,
    title: 'Calidad premium',
    description: 'Profesionalismo y diseño impecables que generan confianza inmediata en tus clientes.',
  },
  {
    icon: Clock,
    title: 'Disponibilidad',
    description: 'Nos adaptamos a tus horarios y los de tus propietarios. Lunes a sábado.',
  },
  {
    icon: Building2,
    title: 'Gestión múltiple',
    description: 'Gestión centralizada de todos tus tours virtuales con panel de acceso dedicado.',
  },
  {
    icon: CheckCircle,
    title: 'Pago seguro',
    description: 'Portal de pagos encriptado. Acepta tarjeta, Apple Pay, Google Pay y PayPal.',
  },
]

export default function InmobiliariasPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 grid-overlay">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-violet-600/10 border border-violet-500/20 rounded-full px-4 py-2 mb-6">
                <Building2 size={14} className="text-violet-400" />
                <span className="text-violet-400 text-sm font-medium">Oferta para agencias</span>
              </div>
              <h1 className="section-title mb-6">
                Mejora drásticamente tu visibilidad con un{' '}
                <span className="gradient-text">Tour Virtual</span>
              </h1>
              <p className="text-xl text-slate-400 leading-relaxed mb-8">
                En 360TourX elevamos la experiencia de cualquier espacio al siguiente nivel, ofreciendo
                una visibilidad realista y certera de todo tipo de inmuebles. Entrega en 48-72 horas garantizada.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/reserva" className="btn-primary text-base px-8">
                  Reservar tour
                  <ArrowRight size={18} />
                </Link>
                <a href="#contacto" className="btn-outline text-base px-8">
                  Solicitar tarifa
                </a>
              </div>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Enfoque', value: 'Visibilidad real de cada inmueble' },
                { label: 'Entrega', value: 'Tour listo en 48-72h' },
                { label: 'Seguridad', value: 'Confianza inmediata con tus clientes' },
                { label: 'Precios', value: 'Mejor precio del mercado' },
                { label: 'Profesionalidad', value: 'Estándares de calidad premium' },
                { label: 'Pagos', value: 'Portal de pagos encriptado' },
              ].map((item) => (
                <div key={item.label} className="card p-5">
                  <div className="text-xs text-violet-400 font-semibold uppercase tracking-wider mb-2">
                    {item.label}
                  </div>
                  <div className="text-sm text-slate-300 leading-snug">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-20 bg-[#111118] border-y border-[#1e1e2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-4">Por qué elegirnos como agencia</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Trabajamos con inmobiliarias de toda España. Conocemos tus necesidades y nos adaptamos
              a tu ritmo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((adv) => (
              <div key={adv.title} className="group">
                <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-5 group-hover:bg-violet-600/20 transition-colors">
                  <adv.icon size={22} className="text-violet-400" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{adv.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{adv.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section id="contacto" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                ¿Te gusta lo que ves?
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Contáctanos para conocer nuestra oferta especial para agencias inmobiliarias. Te
                responderemos en menos de 24 horas.
              </p>
              <div className="space-y-4">
                <a
                  href="tel:+34644857326"
                  className="flex items-center gap-3 text-slate-300 hover:text-violet-400 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-violet-600/10 flex items-center justify-center">
                    <Phone size={18} className="text-violet-400" />
                  </div>
                  +34 644 85 73 26
                </a>
                <a
                  href="mailto:hola@360tourx.com"
                  className="flex items-center gap-3 text-slate-300 hover:text-violet-400 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-violet-600/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  hola@360tourx.com
                </a>
              </div>
            </div>
            <ContactForm showCompanyFields />
          </div>
        </div>
      </section>
    </>
  )
}
