import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Globe,
  Shield,
  Star,
  Camera,
  Cpu,
  MapPin,
  Phone,
  Mail,
  Building2,
} from 'lucide-react'

const services = [
  {
    title: 'Tour Virtual hasta 100m²',
    price: '290',
    currency: '€',
    description: 'Perfecto para estudios, pisos pequeños, locales y oficinas compactas.',
    features: ['Tour 360° interactivo', 'Tour Google Maps', 'Entrega en 48h', 'Enlace compartible'],
    href: '/reserva?servicio=100m2',
    popular: false,
  },
  {
    title: 'Tour Virtual hasta 200m²',
    price: '390',
    currency: '€',
    description: 'Ideal para pisos amplios, locales comerciales y espacios de trabajo.',
    features: [
      'Tour 360° interactivo',
      'Tour Google Maps',
      'Entrega en 72h',
      'Enlace compartible',
      'Plano de planta',
    ],
    href: '/reserva?servicio=200m2',
    popular: true,
  },
  {
    title: 'Tour Virtual hasta 300m²',
    price: '490',
    currency: '€',
    description: 'Para viviendas de lujo, hoteles boutique y grandes establecimientos.',
    features: [
      'Tour 360° interactivo',
      'Tour Google Maps',
      'Entrega en 72h',
      'Enlace compartible',
      'Plano de planta',
      'Etiquetas informativas',
    ],
    href: '/reserva?servicio=300m2',
    popular: false,
  },
  {
    title: 'Tour Virtual +300m²',
    price: 'Personalizado',
    currency: '',
    description: 'Para grandes superficies, hoteles, centros comerciales y complejos.',
    features: [
      'Tour 360° premium',
      'Tour Google Maps',
      'Visita previa incluida',
      'Enlace compartible',
      'Plano de planta',
      'Etiquetas informativas',
      'Soporte prioritario',
    ],
    href: '/reserva?servicio=300m2plus',
    popular: false,
  },
]

const stats = [
  { value: '+200', label: 'Tours realizados' },
  { value: '48h', label: 'Tiempo de entrega' },
  { value: '4.9★', label: 'Valoración media' },
  { value: '100%', label: 'Satisfacción garantizada' },
]

const whyUs = [
  {
    icon: Clock,
    title: 'Entrega en 48-72h',
    description:
      'Tour virtual completamente ensamblado en 48h para espacios hasta 100m² y 72h para los demás.',
  },
  {
    icon: Globe,
    title: 'Alcance global',
    description:
      'Tus clientes potenciales pueden visitar tu espacio desde cualquier lugar del mundo.',
  },
  {
    icon: Shield,
    title: 'Pagos seguros',
    description: 'Transacciones encriptadas con Stripe. Aceptamos tarjeta, Apple Pay y Google Pay.',
  },
  {
    icon: Star,
    title: 'Calidad premium',
    description:
      'Equipo profesional especializado en fotografía 360° y técnicas avanzadas de mapeo 3D.',
  },
  {
    icon: Camera,
    title: 'Fotografía 4K',
    description: 'Imágenes panorámicas de alta resolución que muestran cada detalle de tu espacio.',
  },
  {
    icon: Cpu,
    title: 'Tecnología 3D',
    description:
      'Mapeo tridimensional avanzado para una experiencia inmersiva y completamente realista.',
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden grid-overlay">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-violet-600/5 blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-violet-600/10 border border-violet-500/20 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-violet-400 text-sm font-medium">Tours virtuales desde 290€</span>
            </div>

            <h1 className="section-title mb-6 text-5xl md:text-7xl leading-tight">
              Expertos en{' '}
              <span className="gradient-text">espacios virtuales</span>
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
              Transformamos tu inmueble o negocio en una experiencia 360° inmersiva que tus clientes
              pueden visitar desde cualquier lugar. Entrega en 48-72 horas.
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <Link href="/reserva" className="btn-primary text-base px-8 py-4">
                Reserva tu tour
                <ArrowRight size={18} />
              </Link>
              <Link href="/proyectos" className="btn-outline text-base px-8 py-4">
                Ver proyectos
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600">
          <span className="text-xs">Scroll</span>
          <div className="w-0.5 h-8 bg-gradient-to-b from-slate-600 to-transparent" />
        </div>
      </section>

      {/* Ticker / marquee */}
      <div className="border-y border-[#1e1e2e] py-4 overflow-hidden bg-[#111118]">
        <div className="ticker-wrapper">
          <div className="ticker-content text-slate-500 text-sm font-medium">
            {[
              'TOURS VIRTUALES 360°',
              'FOTOGRAFÍA PROFESIONAL',
              'MAPEO 3D',
              'ENTREGA EN 24H',
              'INMOBILIARIAS',
              'HOTELES',
              'RESTAURANTES',
              'LOCALES COMERCIALES',
              'TOURS VIRTUALES 360°',
              'FOTOGRAFÍA PROFESIONAL',
              'MAPEO 3D',
              'ENTREGA EN 24H',
              'INMOBILIARIAS',
              'HOTELES',
              'RESTAURANTES',
              'LOCALES COMERCIALES',
            ]
              .map((t, i) => (
                <span key={i} className="mx-8">
                  <span className="text-violet-500">✦</span> {t}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <section id="servicios" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-3">
              Servicios
            </p>
            <h2 className="section-title">Elige tu tour virtual</h2>
            <p className="section-subtitle mx-auto text-center">
              Precios transparentes, calidad premium. Sin sorpresas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className={`card p-6 flex flex-col relative transition-all duration-300 hover:-translate-y-1 hover:glow ${
                  service.popular ? 'border-violet-500/50 glow' : ''
                }`}
              >
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-violet-600 text-black text-xs font-bold px-3 py-1 rounded-full">
                      MÁS POPULAR
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-bold text-white text-lg mb-2">{service.title}</h3>
                  <p className="text-slate-400 text-sm">{service.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    {service.currency && (
                      <span className="text-slate-400 text-xl">{service.currency}</span>
                    )}
                    <span className="text-4xl font-black text-white">{service.price}</span>
                  </div>
                  <span className="text-slate-500 text-xs mt-1 block">precio único + IVA</span>
                </div>

                <ul className="space-y-2.5 flex-1 mb-8">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <CheckCircle size={15} className="text-violet-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={service.href}
                  className={service.popular ? 'btn-primary' : 'btn-outline'}
                >
                  {service.price === 'Personalizado' ? 'Solicitar presupuesto' : 'Reservar ahora'}
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>

          {/* Web hosting add-on */}
          <div className="mt-10 card p-6 border-dashed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Globe size={16} className="text-violet-400" />
                <span className="text-white font-semibold">Añade hosting para tu web</span>
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-medium">
                  ADD-ON
                </span>
              </div>
              <p className="text-slate-400 text-sm">
                Sube tu tour virtual a tu página web con hosting seguro y certificado SSL wildcard
                incluido.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <span className="text-2xl font-bold text-white">19,99€</span>
                <span className="text-slate-500 text-sm block">/ año</span>
              </div>
              <Link href="/precios" className="btn-outline text-sm">
                Ver planes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-24 bg-[#111118] border-y border-[#1e1e2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-3">
              Por qué elegirnos
            </p>
            <h2 className="section-title">La diferencia 360TourX</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyUs.map((item) => (
              <div key={item.title} className="group">
                <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-5 group-hover:bg-violet-600/20 transition-colors">
                  <item.icon size={22} className="text-violet-400" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-3">
                Acerca de nosotros
              </p>
              <h2 className="section-title mb-6">
                Nuestra misión
              </h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                360TourX ofrece la posibilidad única de experimentar recorridos virtuales inmersivos
                para propiedades comerciales y residenciales. Con un enfoque en la claridad visual y
                la interactividad, nuestros tours permiten a los propietarios mostrar sus espacios de
                manera impactante.
              </p>
              <p className="text-slate-400 leading-relaxed mb-8">
                Nuestro equipo altamente capacitado se dedica a capturar la esencia de cada propiedad
                a través de fotografías profesionales y técnicas avanzadas de mapeo 3D, brindando una
                experiencia virtual envolvente y convincente.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/que-es-un-tour-virtual" className="btn-primary">
                  Conoce más
                  <ArrowRight size={16} />
                </Link>
                <Link href="/como-funcionamos" className="btn-ghost">
                  Cómo funcionamos
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="card p-6 space-y-3">
                <Camera size={28} className="text-violet-400" />
                <h4 className="font-bold text-white">Fotografía 360°</h4>
                <p className="text-slate-400 text-sm">Imágenes panorámicas de alta resolución para cada rincón.</p>
              </div>
              <div className="card p-6 space-y-3 mt-8">
                <Cpu size={28} className="text-violet-400" />
                <h4 className="font-bold text-white">Mapeo 3D</h4>
                <p className="text-slate-400 text-sm">Tecnología avanzada para modelos tridimensionales precisos.</p>
              </div>
              <div className="card p-6 space-y-3">
                <Globe size={28} className="text-violet-400" />
                <h4 className="font-bold text-white">Distribución web</h4>
                <p className="text-slate-400 text-sm">Tu tour disponible en Google Maps y tu propia web.</p>
              </div>
              <div className="card p-6 space-y-3 mt-8">
                <Clock size={28} className="text-violet-400" />
                <h4 className="font-bold text-white">Entrega rápida</h4>
                <p className="text-slate-400 text-sm">Tour completo en tu bandeja en menos de 24 horas.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Casos de éxito */}
      <section className="py-24 bg-[#111118] border-y border-[#1e1e2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-3">
              Casos de éxito
            </p>
            <h2 className="section-title">Negocios que confían en nosotros</h2>
            <p className="section-subtitle mx-auto text-center">
              Restaurantes, hoteles y showrooms de Madrid que ya muestran sus espacios al mundo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                name: 'A Locos',
                type: 'Bar & Restaurante',
                url: 'https://alocos.360tourx.com',
                tag: 'Hostelería',
                thumbnail: 'https://alocos.360tourx.com/socialThumbnail.jpg',
              },
              {
                name: 'Delphina Madrid',
                type: 'Hotel & Alojamiento',
                url: 'https://delphinamadrid.360tourx.com',
                tag: 'Hotel',
                thumbnail: 'https://delphinamadrid.360tourx.com/socialThumbnail.jpg',
              },
              {
                name: 'Copatlife Madrid',
                type: 'Showroom · Expo Cocinas',
                url: 'https://copatlifemadrid.360tourx.com',
                tag: 'Showroom',
                thumbnail: 'https://copatlifemadrid.360tourx.com/socialThumbnail.jpg',
              },
            ].map((c) => (
              <a
                key={c.name}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card group overflow-hidden hover:-translate-y-1 transition-all hover:glow hover:border-violet-500/30"
              >
                <div className="aspect-video bg-[#0a0a0f] relative overflow-hidden">
                  {c.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.thumbnail} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full grid-overlay flex items-center justify-center">
                      <span className="text-5xl font-black text-slate-800">360°</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-violet-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-semibold bg-violet-600 px-4 py-2 rounded-lg flex items-center gap-1.5">
                      Ver tour
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-white">{c.name}</div>
                      <div className="text-violet-400 text-sm">{c.type}</div>
                    </div>
                    <span className="text-xs bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2.5 py-1 rounded-full">
                      {c.tag}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center">
            <Link href="/proyectos" className="btn-outline">
              Ver todos los proyectos
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Real estate CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card glow p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-purple-700/5" />
            <div className="relative">
              <Building2 size={40} className="text-violet-400 mx-auto mb-5" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                ¿Eres inmobiliaria?
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto mb-8 text-lg">
                Tenemos una oferta especial para agencias inmobiliarias. Tours virtuales a precios
                reducidos con entregas prioritarias y soporte dedicado.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/inmobiliarias" className="btn-primary text-base px-8">
                  Ver oferta especial
                  <ArrowRight size={18} />
                </Link>
                <a href="tel:+34644857326" className="btn-outline text-base px-8">
                  <Phone size={16} />
                  Llamar ahora
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact quick */}
      <section className="py-16 bg-[#111118] border-t border-[#1e1e2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="tel:+34644857326"
              className="card p-6 flex items-center gap-4 hover:border-violet-500/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-600/10 flex items-center justify-center group-hover:bg-violet-600/20 transition-colors">
                <Phone size={20} className="text-violet-400" />
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-0.5">Llámanos</p>
                <p className="text-white font-semibold">+34 644 85 73 26</p>
              </div>
            </a>
            <a
              href="mailto:hola@360tourx.com"
              className="card p-6 flex items-center gap-4 hover:border-violet-500/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-600/10 flex items-center justify-center group-hover:bg-violet-600/20 transition-colors">
                <Mail size={20} className="text-violet-400" />
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-0.5">Email</p>
                <p className="text-white font-semibold">hola@360tourx.com</p>
              </div>
            </a>
            <div className="card p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-600/10 flex items-center justify-center">
                <MapPin size={20} className="text-violet-400" />
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-0.5">Ubicación</p>
                <p className="text-white font-semibold">Madrid, España</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
