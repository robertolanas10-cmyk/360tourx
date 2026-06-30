import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Planes y Precios',
  description:
    'Precios transparentes para tours virtuales 360° en Madrid. Desde 290€ con entrega en 48h. Opción de hosting del tour en tu web por 19,99€/año.',
}

const mainPlans = [
  {
    title: 'Tour Virtual 100m²',
    price: '290',
    features: [
      'Tour 360° interactivo',
      'Tour Google Maps',
      'Entrega en 48h',
      'Enlace compartible',
      'Soporte por email',
    ],
    href: '/reserva?servicio=100m2',
    popular: false,
  },
  {
    title: 'Tour Virtual 200m²',
    price: '390',
    features: [
      'Tour 360° interactivo',
      'Tour Google Maps',
      'Entrega en 72h',
      'Enlace compartible',
      'Plano de planta',
      'Soporte prioritario',
    ],
    href: '/reserva?servicio=200m2',
    popular: true,
  },
  {
    title: 'Tour Virtual 300m²',
    price: '490',
    features: [
      'Tour 360° interactivo',
      'Tour Google Maps',
      'Entrega en 72h',
      'Enlace compartible',
      'Plano de planta',
      'Etiquetas informativas',
      'Soporte prioritario',
    ],
    href: '/reserva?servicio=300m2',
    popular: false,
  },
]

const addOns = [
  {
    title: 'Tour Virtual 100m² + Membresía Web',
    tourPrice: '290',
    membershipPrice: '19,99',
    period: 'año',
    description:
      'Sube tu tour virtual a tu página web de forma totalmente segura con el link que te adjuntaremos en tu correo.',
    features: ['Hosting del tour para web', 'Certificado SSL wildcard', 'Enlace seguro HTTPS'],
    href: '/reserva?servicio=100m2&addon=web',
  },
  {
    title: 'Tour Virtual 200m² + Membresía Web',
    tourPrice: '390',
    membershipPrice: '19,99',
    period: 'año',
    description:
      'Sube tu tour virtual a tu página web de forma totalmente segura con el link que te adjuntaremos en tu correo.',
    features: ['Hosting del tour para web', 'Certificado SSL wildcard', 'Enlace seguro HTTPS'],
    href: '/reserva?servicio=200m2&addon=web',
  },
  {
    title: 'Tour Virtual 300m² + Membresía Web',
    tourPrice: '490',
    membershipPrice: '19,99',
    period: 'año',
    description:
      'Sube tu tour virtual a tu página web de forma totalmente segura con el link que te adjuntaremos en tu correo.',
    features: ['Hosting del tour para web', 'Certificado SSL wildcard', 'Enlace seguro HTTPS'],
    href: '/reserva?servicio=300m2&addon=web',
  },
]

export default function PreciosPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 grid-overlay">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/5 blur-3xl rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-4">
            Planes y precios
          </p>
          <h1 className="section-title mb-6">
            Precios <span className="gradient-text">transparentes</span>,<br />
            calidad garantizada
          </h1>
          <p className="text-xl text-slate-400">
            Sin costes ocultos. Sin sorpresas. Elige el plan que mejor se adapte a tu espacio.
          </p>
        </div>
      </section>

      {/* Main plans */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mainPlans.map((plan) => (
              <div
                key={plan.title}
                className={`card p-7 flex flex-col relative hover:-translate-y-1 transition-all ${
                  plan.popular ? 'border-violet-500/50 glow' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-violet-600 text-black text-xs font-bold px-3 py-1 rounded-full">
                      MÁS POPULAR
                    </span>
                  </div>
                )}
                <h3 className="font-bold text-white text-xl mb-4">{plan.title}</h3>
                <div className="mb-6">
                  <span className="text-slate-400 text-lg">€</span>
                  <span className="text-5xl font-black text-white">{plan.price}</span>
                  <span className="text-slate-500 text-sm ml-2">+ IVA · pago único</span>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <CheckCircle size={15} className="text-violet-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={plan.popular ? 'btn-primary' : 'btn-outline'}>
                  Reservar ahora
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>

          {/* Custom plan */}
          <div className="mt-6 card p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="font-bold text-white text-xl mb-2">Tour Virtual +300m²</h3>
              <p className="text-slate-400 text-sm">
                Para grandes superficies, hoteles, centros comerciales y complejos. Presupuesto
                personalizado según tus necesidades.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div>
                <div className="text-2xl font-bold text-white">Personalizado</div>
                <div className="text-slate-500 text-xs">Contáctanos para cotizar</div>
              </div>
              <Link href="/reserva?servicio=300m2plus" className="btn-primary">
                Solicitar
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Add-on section */}
      <section className="py-20 bg-[#111118] border-y border-[#1e1e2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-4">
              <Globe size={14} className="text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">Complemento opcional</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Lleva tu tour a tu página web
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Añade nuestra membresía anual y sube tu tour virtual a tu página web de forma segura.
              Hosting incluido con certificado SSL wildcard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {addOns.map((addon) => (
              <div key={addon.title} className="card p-6 flex flex-col hover:-translate-y-1 transition-all">
                <h3 className="font-semibold text-white mb-4 text-sm">{addon.title}</h3>
                <div className="mb-4">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-2xl font-black text-white">€{addon.tourPrice}</span>
                    <span className="text-slate-500 text-sm">tour</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-violet-400">+€{addon.membershipPrice}</span>
                    <span className="text-slate-500 text-xs">/{addon.period} hosting</span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">{addon.description}</p>
                <ul className="space-y-2 flex-1 mb-6">
                  {addon.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle size={13} className="text-violet-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={addon.href} className="btn-outline text-sm">
                  Contratar
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ pricing */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">¿Tienes dudas sobre los precios?</h2>
          <p className="text-slate-400 mb-8">
            Todos los precios son + IVA. Si tienes un espacio con características especiales o
            necesitas múltiples tours, contáctanos para una tarifa personalizada.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/reserva" className="btn-primary">
              Reservar ahora
              <ArrowRight size={16} />
            </Link>
            <a href="mailto:hola@360tourx.com" className="btn-outline">
              Pedir presupuesto
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
