import Link from 'next/link'
import { CheckCircle, Home, Phone } from 'lucide-react'

export default function ConfirmacionPage() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-16 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-8">
          <CheckCircle size={40} className="text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">¡Reserva confirmada!</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Tu pago ha sido procesado correctamente. Recibirás un email de confirmación con todos los
          detalles de tu tour virtual. Nos pondremos en contacto contigo para confirmar los detalles
          de la visita.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/" className="btn-primary">
            <Home size={16} />
            Volver al inicio
          </Link>
          <a href="tel:+34644857326" className="btn-outline">
            <Phone size={16} />
            Llámanos si tienes dudas
          </a>
        </div>
      </div>
    </section>
  )
}
