import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Proyectos',
  description:
    'Casos de éxito de 360TourX — tours virtuales 360° para restaurantes, hoteles, showrooms y negocios en Madrid.',
}

const projects = [
  {
    id: 1,
    title: 'A Locos',
    subtitle: 'Bar & Restaurante',
    location: 'Madrid',
    category: 'Hostelería',
    description:
      'Tour virtual completo del restaurante A Locos, mostrando su ambiente, decoración y espacios de forma inmersiva para captar clientes antes de su visita.',
    tourUrl: 'https://alocos.360tourx.com',
    thumbnail: 'https://alocos.360tourx.com/socialThumbnail.jpg',
  },
  {
    id: 2,
    title: 'Delphina Madrid',
    subtitle: 'Hotel & Alojamiento',
    location: 'Madrid',
    category: 'Hostelería',
    description:
      'Recorrido virtual por las instalaciones de Delphina Madrid, permitiendo a futuros huéspedes explorar habitaciones, zonas comunes y servicios antes de reservar.',
    tourUrl: 'https://delphinamadrid.360tourx.com',
    thumbnail: '/delphina.png',
  },
  {
    id: 3,
    title: 'Copatlife Madrid',
    subtitle: 'Exposición de Cocinas · Diego de León',
    location: 'Madrid, Diego de León',
    category: 'Showroom',
    description:
      'Tour virtual del showroom de cocinas Copatlife en Diego de León, donde los clientes pueden explorar cada ambiente y modelo expuesto desde casa.',
    tourUrl: 'https://copatlifemadrid.360tourx.com',
    thumbnail: 'https://copatlifemadrid.360tourx.com/socialThumbnail.jpg',
  },
]

const categoryColors: Record<string, string> = {
  Hostelería: 'bg-violet-500/20 text-violet-400',
  Showroom: 'bg-purple-500/20 text-purple-400',
  Residencial: 'bg-blue-500/20 text-blue-400',
  Comercial: 'bg-amber-500/20 text-amber-400',
}

export default function ProyectosPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 grid-overlay">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/5 blur-3xl rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-4">
            Casos de éxito
          </p>
          <h1 className="section-title mb-6">
            Negocios que ya confían en{' '}
            <span className="gradient-text">360TourX</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            Restaurantes, hoteles y showrooms de Madrid que han transformado su visibilidad online
            con un tour virtual 360°.
          </p>
        </div>
      </section>

      {/* Projects */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="card overflow-hidden group hover:-translate-y-2 transition-all duration-300 hover:glow flex flex-col"
              >
                {/* Thumbnail / preview */}
                <div className="aspect-video relative overflow-hidden bg-[#0a0a0f]">
                  {project.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full grid-overlay flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl font-black text-slate-800 mb-2">360°</div>
                        <div className="text-slate-600 text-sm">{project.title}</div>
                      </div>
                    </div>
                  )}
                  {/* Badge 360° */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/10">
                    360°
                  </div>
                  {/* Hover overlay */}
                  <a
                    href={project.tourUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-violet-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <span className="bg-violet-600 text-white font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <ExternalLink size={16} />
                      Ver tour virtual
                    </span>
                  </a>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-bold text-white text-xl">{project.title}</h3>
                      <p className="text-violet-400 text-sm font-medium">{project.subtitle}</p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${categoryColors[project.category]}`}
                    >
                      {project.category}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-5 flex-1">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-xs flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {project.location}
                    </span>
                    <a
                      href={project.tourUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
                    >
                      Explorar tour
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Embedded tour preview — Copatlife (has thumbnail) */}
          <div className="mt-16 card p-6 md:p-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-1">
                  Tour destacado
                </p>
                <h2 className="text-2xl font-bold text-white">Copatlife Madrid — Expo Cocinas</h2>
                <p className="text-slate-400 text-sm mt-1">Diego de León, Madrid</p>
              </div>
              <a
                href="https://copatlifemadrid.360tourx.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline shrink-0"
              >
                <ExternalLink size={15} />
                Abrir en pantalla completa
              </a>
            </div>
            <div className="rounded-xl overflow-hidden border border-[#1e1e2e] aspect-video">
              <iframe
                src="https://copatlifemadrid.360tourx.com"
                className="w-full h-full"
                allow="fullscreen; vr; xr-spatial-tracking"
                title="Tour Virtual Copatlife Madrid"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#111118] border-t border-[#1e1e2e]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            ¿Quieres tu negocio aquí?
          </h2>
          <p className="text-slate-400 mb-8">
            Únete a los negocios de Madrid que ya muestran sus espacios al mundo con un tour virtual 360°.
          </p>
          <Link href="/reserva" className="btn-primary text-base px-8">
            Reservar mi tour
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}
