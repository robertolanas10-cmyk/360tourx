import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle, TrendingUp, Globe, Clock, Users, BarChart3, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Qué es un Tour Virtual',
  description:
    'Descubre qué es un tour virtual 360°, cómo funciona y por qué es una herramienta clave para mostrar inmuebles y negocios de forma inmersiva.',
}

const benefits = [
  {
    icon: TrendingUp,
    title: 'Atrae más atención',
    description:
      'Los tours virtuales 360° capturan el interés con mayor eficacia, generando alto impacto y curiosidad inmediata.',
  },
  {
    icon: Globe,
    title: 'Alcance global',
    description:
      'Las barreras geográficas ya no son un obstáculo. Clientes potenciales desde cualquier lugar pueden recorrer tus espacios.',
  },
  {
    icon: Users,
    title: 'Genera confianza',
    description:
      'Los usuarios sienten mayor seguridad con negocios que muestran abiertamente sus espacios. Ver antes de visitar genera credibilidad inmediata.',
  },
  {
    icon: BarChart3,
    title: 'Más conversiones',
    description:
      'Mostrar el potencial del inmueble mediante tours virtuales aumenta considerablemente las probabilidades de cierre de ventas y reservas.',
  },
  {
    icon: Clock,
    title: 'Disponible 24/7',
    description:
      'Accesibles a cualquier hora del día, garantizando atención inmediata y alcance constante para el cliente potencial.',
  },
  {
    icon: Zap,
    title: 'Resultado inmediato',
    description:
      'Entrega en 48-72 horas. Tu tour virtual listo para compartir con clientes en menos de 3 días.',
  },
]

export default function QueEsUnTourVirtualPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 grid-overlay">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/5 blur-3xl rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-4">
            Conoce más
          </p>
          <h1 className="section-title mb-6">
            Tours Virtuales 360°:{' '}
            <span className="gradient-text">La revolución</span> de mostrar espacios
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            La tecnología avanza continuamente, y con ella surgen herramientas que permiten a las marcas
            y propietarios destacar frente a sus competidores.
          </p>
        </div>
      </section>

      {/* What is it */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                ¿Qué son exactamente los Tours Virtuales 360°?
              </h2>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Son experiencias digitales inmersivas que permiten al usuario visualizar un espacio
                  como si realmente estuviera allí, moviéndose libremente, explorando cada rincón
                  desde su computadora, teléfono inteligente o dispositivo de realidad virtual.
                </p>
                <p>
                  Esta herramienta permite a los usuarios girar, avanzar e interactuar con los
                  espacios con total libertad, otorgando una sensación realista, inmersiva y llamativa.
                </p>
                <p>
                  Mediante imágenes panorámicas con visión completa de 360 grados, videos interactivos
                  y la incorporación de etiquetas informativas y otros recursos multimedia, los tours
                  virtuales proporcionan experiencias enriquecidas con un valor considerablemente mayor
                  que las simples fotos o videos comunes.
                </p>
              </div>
            </div>
            <div className="card p-8 glow">
              <h3 className="font-bold text-white text-xl mb-6">Incluido en todos los tours</h3>
              <ul className="space-y-4">
                {[
                  'Fotografías panorámicas en alta resolución (4K)',
                  'Navegación interactiva por todos los espacios',
                  'Compatible con móvil, tablet y escritorio',
                  'Modo de realidad virtual (VR) disponible',
                  'Etiquetas informativas personalizables',
                  'Integración con Google Maps Street View',
                  'Enlace compartible y embebible en tu web',
                  'Entrega en 48-72 horas',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-300 text-sm">
                    <CheckCircle size={16} className="text-violet-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-[#111118] border-y border-[#1e1e2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">Beneficios para tu negocio</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Para grandes marcas, inmobiliarias, hoteles, restaurantes y propietarios de espacios
              físicos, los tours virtuales son una herramienta de marketing de alto impacto.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, i) => (
              <div key={benefit.title} className="card p-6 hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-5">
                  <benefit.icon size={22} className="text-violet-400" />
                </div>
                <h3 className="font-bold text-white text-lg mb-3">{benefit.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Innovation section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Innovación que impulsa resultados
          </h2>
          <div className="space-y-4 text-slate-300 leading-relaxed mb-10">
            <p>
              Los recorridos virtuales 360° ya no son una tecnología del futuro, sino una herramienta
              actual y accesible que aporta significativamente en las estrategias de marketing y
              comunicación de todo negocio o propietario interesado en crecer.
            </p>
            <p>
              Al adoptar los tours virtuales 360°, las marcas utilizan a su favor el poder visual y la
              interactividad, diferenciándose en un mercado altamente competitivo y entregando
              experiencias memorables que mejoran la percepción, interacción y fidelización del cliente.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/reserva" className="btn-primary text-base px-8">
              Reservar mi tour
              <ArrowRight size={18} />
            </Link>
            <Link href="/como-funcionamos" className="btn-outline text-base px-8">
              Ver cómo funciona
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
