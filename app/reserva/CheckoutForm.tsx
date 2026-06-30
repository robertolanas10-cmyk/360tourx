'use client'

import { useState } from 'react'
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Lock, Loader2, CheckCircle } from 'lucide-react'

interface CheckoutFormProps {
  amount: number
  onBack: () => void
  bookingDetails: {
    service: string
    date: string
    time: string
    address: string
    customerName: string
    customerEmail: string
  }
}

export default function CheckoutForm({ amount, onBack, bookingDetails }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [succeeded, setSucceeded] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsLoading(true)
    setErrorMessage(null)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/reserva/confirmacion`,
        receipt_email: bookingDetails.customerEmail,
      },
      redirect: 'if_required',
    })

    if (error) {
      setErrorMessage(
        error.message || 'Hubo un error al procesar el pago. Por favor inténtalo de nuevo.'
      )
      setIsLoading(false)
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setSucceeded(true)
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }

  if (succeeded) {
    return (
      <div className="card p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={30} className="text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">¡Reserva confirmada!</h2>
        <p className="text-slate-400 mb-2">
          Hemos recibido tu pago de <strong className="text-white">{amount.toFixed(2).replace('.', ',')}€</strong>
        </p>
        <p className="text-slate-400 mb-6">
          Recibirás una confirmación en <strong className="text-white">{bookingDetails.customerEmail}</strong> con todos
          los detalles de tu reserva.
        </p>
        <div className="card p-4 text-left text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Servicio</span>
            <span className="text-slate-300">{bookingDetails.service}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Fecha de visita</span>
            <span className="text-slate-300">
              {new Date(bookingDetails.date + 'T00:00:00').toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}{' '}
              a las {bookingDetails.time}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Dirección</span>
            <span className="text-slate-300">{bookingDetails.address}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="card p-4 mb-2 text-sm text-slate-400 flex items-start gap-3">
        <Lock size={14} className="text-green-400 shrink-0 mt-0.5" />
        <span>
          Pago seguro encriptado con SSL. Tus datos de tarjeta están protegidos por Stripe y nunca
          son almacenados en nuestros servidores.
        </span>
      </div>

      {/* Stripe Payment Element (handles cards, Apple Pay, Google Pay automatically) */}
      <PaymentElement
        options={{
          layout: 'tabs',
          wallets: {
            applePay: 'auto',
            googlePay: 'auto',
          },
        }}
      />

      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
          {errorMessage}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="btn-ghost border border-[#1e1e2e]"
          disabled={isLoading}
        >
          Atrás
        </button>
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className="btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <Lock size={16} />
              Pagar {amount.toFixed(2).replace('.', ',')}€
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-slate-600 text-center">
        Al confirmar el pago aceptas nuestros{' '}
        <a href="/terminos" className="text-violet-500/70 hover:text-violet-400">
          términos y condiciones
        </a>
      </p>
    </form>
  )
}
