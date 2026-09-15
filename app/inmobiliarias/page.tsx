import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Building2, CheckCircle, Clock, Shield, Star, Zap, Phone } from 'lucide-react'
import ContactForm from '@/components/ContactForm'
import { TRAMOS } from '@/lib/tarifas-agencia'

export const metadata: Metadata = {
  title: 'Para Inmobiliarias',
  description:
    'Oferta especial para agencias inmobiliarias. Tours virtuales 360° a precios reducidos con entrega prioritaria y soporte dedicado. Madrid y alrededores.',
}

const advantages = [
  {
    icon: Zap,
    title: 'Entrega prioritaria',
    description: 'Tus tours se procesan con prioridad. Resultado en menos de 72 horas, siempre.',
  },
  {
    icon: Star,
    title: 'Precios exclusivos',
    description: 'Tarifas por volumen desde 135 € por vivienda, calculadas con tu actividad real.',
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
    title: 'Todos tus pisos de una vez',
    description: 'Nos pides varios inmuebles en una sola solicitud y te organizamos las visitas.',
  },
  {
    icon: CheckCircle,
    title: 'Pago seguro',
    description: 'Portal de pagos encriptado. Acepta tarjeta, Apple Pay y Google Pay.',
  },
]

// Tarifas por volumen para agencias (precio por vivienda, + IVA). Salen de lib/tarifas-agencia.ts,
// que también usan el formulario de solicitud y su API. "A medida" tiene su propia tarjeta.
const tiers = TRAMOS.filter((t) => t.precio !== null).map((t) => ({
  id: t.id,
  name: t.nombre,
  range: t.rango,
  price: String(t.precio),
  popular: t.popular,
}))

const tierFeatures = [
  'Tour virtual 360° profesional',
  'Entrega en menos de 72 h desde la visita',
  'Alojamiento incluido hasta 6 meses',
]

const rules = [
  {
    title: 'Tu tramo sale de tu actividad real',
    description:
      'La tarifa de cada mes se calcula con las viviendas que hicimos contigo el mes anterior. El primer mes aplicamos el tramo del volumen que nos indiques.',
  },
  {
    title: 'Inmuebles de hasta 120 m²',
    description:
      'Los precios son para viviendas de hasta 120 m². Por encima, se suman 100 € por cada 100 m² adicionales o fracción.',
  },
  {
    title: 'Entrega en menos de 72 h desde la visita',
    description:
      'El plazo cuenta desde el día en que fotografiamos el inmueble. Las visitas se agendan de lunes a sábado según disponibilidad.',
  },
  {
    title: 'Alojamiento mientras el inmueble esté publicado',
    description:
      'El tour queda alojado sin coste mientras la vivienda esté anunciada, hasta 6 meses. Si quieres mantenerlo más tiempo, son 32,99 € al año por tour.',
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
                una visibilidad realista y certera de todo tipo de inmuebles. Entrega en menos de 72 horas garantizada.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#contacto" className="btn-primary text-base px-8">
                  Agenda una llamada gratuita
                  <ArrowRight size={18} />
                </a>
                <a href="#tarifas" className="btn-outline text-base px-8">
                  Ver tarifas
                </a>
              </div>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Enfoque', value: 'Visibilidad real de cada inmueble' },
                { label: 'Entrega', value: 'Tour listo en menos de 72h' },
                { label: 'Seguridad', value: 'Confianza inmediata con tus clientes' },
                { label: 'Precios', value: 'Desde 135 € por vivienda' },
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

      {/* Tarifas por volumen */}
      <section id="tarifas" className="py-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Tarifas para <span className="gradient-text">agencias</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Cuantas más viviendas nos confíes, menos pagas por cada una. Precio por vivienda, + IVA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`card p-7 flex flex-col relative hover:-translate-y-1 transition-all ${
                  tier.popular ? 'border-violet-500/50 glow' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-violet-600 text-black text-xs font-bold px-3 py-1 rounded-full">
                      MÁS ELEGIDO
                    </span>
                  </div>
                )}
                <h3 className="font-bold text-white text-xl mb-1">{tier.name}</h3>
                <p className="text-slate-400 text-sm mb-5">{tier.range}</p>
                <div className="mb-6">
                  <span className="text-5xl font-black text-white">{tier.price}</span>
                  <span className="text-slate-400 text-lg ml-1">€</span>
                  <span className="text-slate-500 text-sm block mt-1">por vivienda + IVA</span>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {tierFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <CheckCircle size={15} className="text-violet-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/inmobiliarias/solicitud?tramo=${tier.id}`}
                  className={tier.popular ? 'btn-primary' : 'btn-outline'}
                >
                  Empezar con {tier.name}
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}

            {/* A medida */}
            <div className="card p-7 flex flex-col border-dashed">
              <h3 className="font-bold text-white text-xl mb-1">A medida</h3>
              <p className="text-slate-400 text-sm mb-5">50 o más viviendas/mes</p>
              <div className="mb-6">
                <span className="text-3xl font-black text-white">Consultar</span>
                <span className="text-slate-500 text-sm block mt-1">tarifa y agenda dedicadas</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-8">
                Para redes de oficinas y agencias con mucho volumen. Organizamos contigo un calendario
                de visitas para cumplir los plazos.
              </p>
              <Link href="/inmobiliarias/solicitud?tramo=a_medida" className="btn-outline">
                Hablemos
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Reglas */}
          <div className="mt-12 card p-8">
            <h3 className="font-bold text-white text-xl mb-6">Cómo funcionan las tarifas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              {rules.map((rule) => (
                <div key={rule.title} className="flex gap-3">
                  <CheckCircle size={18} className="text-violet-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">{rule.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{rule.description}</p>
                  </div>
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
                Cuéntanos cuántas viviendas movéis al mes y te confirmamos tu tramo. Te responderemos
                en menos de 24 horas.
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
