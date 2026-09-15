import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { FRANJAS, HOSTING_AGENCIA_ANUAL, formatoEurosCentimos } from '@/lib/tarifas-agencia'
import BotonPagar from './BotonPagar'

// Página privada del enlace de pago de una agencia: siempre datos frescos y fuera de buscadores.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Tu presupuesto',
  robots: { index: false, follow: false },
}

const fechaCorta = (d: Date) => d.toISOString().slice(0, 10).split('-').reverse().join('/')

export default async function PagoAgenciaPage({
  params,
  searchParams,
}: {
  params: { token: string }
  searchParams: { estado?: string }
}) {
  const s = await prisma.solicitudAgencia.findUnique({
    where: { tokenPago: params.token },
    include: { inmuebles: { orderBy: { id: 'asc' } } },
  })
  if (!s || s.estadoPago === 'sin_enlace') notFound()

  // Stripe solo redirige con ?estado=ok cuando el pago se ha completado; el aviso del webhook
  // puede tardar unos segundos en marcarla como pagada.
  const pagada = s.estadoPago === 'pagada' || searchParams.estado === 'ok'
  const importeTours = s.importeTours === null ? 0 : Number(s.importeTours)
  const total = importeTours + (s.conHosting ? HOSTING_AGENCIA_ANUAL : 0)

  return (
    <section className="relative pt-28 pb-24 grid-overlay">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {pagada ? (
          <div className="card p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={28} className="text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Pago completado</h1>
            <p className="text-slate-400 leading-relaxed">
              Gracias, {s.contacto}. Hemos recibido el pago de <span className="text-white">{s.agencia}</span>. Stripe
              te enviará el recibo por email y nosotros te contactamos para cerrar las visitas.
            </p>
            {s.conHosting && (
              <p className="text-slate-500 text-sm mt-4">
                El alojamiento de tus tours se renovará automáticamente cada año por{' '}
                {formatoEurosCentimos(HOSTING_AGENCIA_ANUAL)}. Puedes cancelarlo cuando quieras escribiendo a
                hola@360tourx.com.
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-3">
                Presupuesto · Solicitud #{s.id}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{s.agencia}</h1>
              <p className="text-slate-400">Revisa el presupuesto y paga de forma segura con tarjeta.</p>
            </div>

            <div className="card p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="font-semibold text-white mb-3">
                  Inmuebles ({s.inmuebles.length})
                </h2>
                <ul className="space-y-2">
                  {s.inmuebles.map((inm) => (
                    <li key={inm.id} className="flex justify-between gap-4 text-sm border-b border-[#1e1e2e] pb-2 last:border-0">
                      <span className="text-slate-300">{inm.direccion}</span>
                      <span className="text-slate-500 shrink-0 text-right">
                        {inm.metros} m² · desde {fechaCorta(inm.disponibleDesde)}
                        {' · '}
                        {FRANJAS.find((f) => f.id === inm.franja)?.nombre ?? inm.franja}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-[#1e1e2e] pt-5 space-y-2 text-sm">
                {importeTours > 0 && (
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">Tours virtuales 360°</span>
                    <span className="text-white font-medium">{formatoEurosCentimos(importeTours)}</span>
                  </div>
                )}
                {s.conHosting && (
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">Alojamiento de todos tus tours (primer año)</span>
                    <span className="text-white font-medium">{formatoEurosCentimos(HOSTING_AGENCIA_ANUAL)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline gap-4 pt-3 border-t border-[#1e1e2e]">
                  <span className="text-white font-semibold">Total a pagar hoy</span>
                  <span className="text-violet-400 text-2xl font-bold">{formatoEurosCentimos(total)}</span>
                </div>
                <p className="text-slate-500 text-xs text-right">IVA incluido</p>
              </div>

              {s.conHosting && (
                <p className="text-slate-400 text-xs leading-relaxed bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-3">
                  El alojamiento se renueva automáticamente cada año por {formatoEurosCentimos(HOSTING_AGENCIA_ANUAL)} con
                  la misma tarjeta, a partir de la fecha de hoy. Puedes cancelarlo en cualquier momento antes de la
                  renovación escribiendo a hola@360tourx.com.
                </p>
              )}

              <BotonPagar token={params.token} texto={`Pagar ${formatoEurosCentimos(total)}`} />

              <p className="text-slate-500 text-xs text-center">
                Pago procesado por Stripe. Al pagar aceptas los{' '}
                <a href="/terminos" className="text-violet-400 hover:underline">
                  términos y condiciones
                </a>
                .
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
