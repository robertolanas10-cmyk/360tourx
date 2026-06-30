import type { Metadata } from 'next'
import { Suspense } from 'react'
import BookingClient from './BookingClient'
import { Lock, CreditCard } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Reserva tu Tour Virtual',
  description:
    'Reserva tu tour virtual 360° online. Elige tu servicio, fecha y paga de forma segura con tarjeta, Apple Pay, Google Pay o PayPal.',
}

export default function ReservaPage() {
  return (
    <>
      <section className="relative pt-28 pb-8 grid-overlay">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-3">
              Reserva online
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Reserva tu <span className="gradient-text">tour virtual</span>
            </h1>
            <p className="text-slate-400 text-lg">
              Proceso simple en 3 pasos. Pago seguro y confirmación inmediata.
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-10 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Lock size={14} className="text-green-400" />
              Pago 100% seguro (SSL)
            </div>
            <div className="flex items-center gap-2">
              <CreditCard size={14} className="text-violet-400" />
              Tarjeta · Apple Pay · Google Pay · PayPal
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 14l-4-4 1.414-1.414L11 13.172l6.586-6.586L19 8l-8 8z" />
              </svg>
              Confirmación instantánea
            </div>
          </div>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="max-w-5xl mx-auto px-4 pb-24 flex items-center justify-center h-64">
            <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          </div>
        }
      >
        <BookingClient />
      </Suspense>
    </>
  )
}
