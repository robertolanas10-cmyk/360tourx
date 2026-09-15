import type { Metadata } from 'next'
import { Suspense } from 'react'
import SolicitudClient from './SolicitudClient'

export const metadata: Metadata = {
  title: 'Solicitud para agencias',
  description:
    'Pide los tours virtuales 360° de tus inmuebles en una sola solicitud. Indica dirección, metros y disponibilidad de cada piso y te confirmamos presupuesto y visitas en menos de 24 horas.',
}

export default function SolicitudAgenciaPage() {
  return (
    <>
      <section className="relative pt-28 pb-8 grid-overlay">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-3">
            Agencias inmobiliarias
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Pide los tours de <span className="gradient-text">tus inmuebles</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Añade todos los pisos de una vez. Te confirmamos el presupuesto y te proponemos las visitas en
            menos de 24 horas.
          </p>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="max-w-5xl mx-auto px-4 pb-24 flex items-center justify-center h-64">
            <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          </div>
        }
      >
        <SolicitudClient />
      </Suspense>
    </>
  )
}
