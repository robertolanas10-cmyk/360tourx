'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from './CheckoutForm'
import { CheckCircle, ArrowRight, Calendar, User, Package, Loader2, Phone, Video, MessageSquare } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const services = [
  {
    id: '100m2',
    title: 'Tour Virtual hasta 100m²',
    price: 290,
    priceId: 'price_100m2', // Replace with actual Stripe Price ID
    description: 'Estudios, pisos pequeños, locales y oficinas compactas.',
    features: ['Tour 360° interactivo', 'Tour Google Maps', 'Entrega en 48h'],
  },
  {
    id: '200m2',
    title: 'Tour Virtual hasta 200m²',
    price: 390,
    priceId: 'price_200m2',
    description: 'Pisos amplios, locales comerciales y espacios de trabajo.',
    features: ['Tour 360° interactivo', 'Tour Google Maps', 'Entrega en 72h', 'Plano de planta'],
    popular: true,
  },
  {
    id: '300m2',
    title: 'Tour Virtual hasta 300m²',
    price: 490,
    priceId: 'price_300m2',
    description: 'Viviendas de lujo, hoteles boutique y grandes establecimientos.',
    features: ['Tour 360° interactivo', 'Tour Google Maps', 'Entrega en 72h', 'Plano de planta', 'Etiquetas'],
  },
  {
    id: '300m2plus',
    title: 'Tour Virtual +300m²',
    price: null,
    priceId: null,
    description: 'Para grandes superficies. Contacta para presupuesto personalizado.',
    features: ['Tour 360° premium', 'Visita previa incluida', 'Soporte prioritario'],
  },
]

const webAddon = {
  id: 'web',
  title: 'Hosting del tour en tu web',
  price: 19.99,
  priceId: 'price_web_addon',
  description: 'Sube tu tour a tu web con SSL wildcard incluido. +19,99€/año',
}

const availableDates = () => {
  const dates: string[] = []
  const today = new Date()
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    // Skip Sundays (0)
    if (date.getDay() !== 0) {
      dates.push(date.toISOString().split('T')[0])
    }
  }
  return dates
}

const timeSlots = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00']

type Step = 1 | 2 | 3

export default function BookingClient() {
  const searchParams = useSearchParams()
  const preselectedService = searchParams.get('servicio')
  const hasAddon = searchParams.get('addon') === 'web'

  const [step, setStep] = useState<Step>(1)
  const [selectedService, setSelectedService] = useState(
    services.find((s) => s.id === preselectedService) || services[0]
  )
  const [withWebAddon, setWithWebAddon] = useState(hasAddon)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe')
  const [meetingDescription, setMeetingDescription] = useState('')
  const [meetingType, setMeetingType] = useState<'video' | 'phone' | 'presencial'>('video')
  const [meetingSubmitted, setMeetingSubmitted] = useState(false)
  const [meetingSubmitting, setMeetingSubmitting] = useState(false)

  const totalPrice =
    selectedService.price !== null
      ? selectedService.price + (withWebAddon ? webAddon.price : 0)
      : null

  const isCustomQuote = selectedService.id === '300m2plus'

  const goToStep2 = () => {
    if (!selectedDate || !selectedTime) {
      alert('Por favor selecciona una fecha y hora para la visita.')
      return
    }
    setStep(2)
  }

  const goToStep3 = async () => {
    if (!contactInfo.name || !contactInfo.email || !contactInfo.address) {
      alert('Por favor rellena todos los campos obligatorios.')
      return
    }

    if (isCustomQuote) {
      setStep(3)
      return
    }

    // Create Stripe payment intent
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          withAddon: withWebAddon,
          amount: Math.round((totalPrice || 0) * 100), // cents
          customerEmail: contactInfo.email,
          customerName: contactInfo.name,
          bookingDate: selectedDate,
          bookingTime: selectedTime,
          address: contactInfo.address,
        }),
      })
      const data = await res.json()
      if (data.clientSecret) {
        setClientSecret(data.clientSecret)
        setStep(3)
      }
    } catch (err) {
      alert('Error al procesar. Inténtalo de nuevo o llámanos.')
    }
  }

  const submitMeetingRequest = async () => {
    setMeetingSubmitting(true)
    const meetingTypeLabel =
      meetingType === 'video'
        ? 'Videollamada (Google Meet / Zoom)'
        : meetingType === 'phone'
        ? 'Llamada telefónica'
        : 'Reunión presencial en Madrid'
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: contactInfo.name,
        email: contactInfo.email,
        telefono: contactInfo.phone,
        mensaje: `🏢 SOLICITUD TOUR VIRTUAL +300m²\n\n📅 Fecha preferida para la visita: ${selectedDate} a las ${selectedTime}\n📍 Dirección del espacio: ${contactInfo.address}\n\n📞 Tipo de reunión preferida: ${meetingTypeLabel}\n\n📝 Descripción del espacio:\n${meetingDescription || 'No especificada'}`,
        aceptaTerminos: true,
      }),
    })
    setMeetingSubmitting(false)
    setMeetingSubmitted(true)
  }

  const dates = availableDates()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      {/* Steps indicator */}
      <div className="flex items-center justify-center gap-3 mb-10">
        {[
          { n: 1, icon: Package, label: 'Servicio' },
          { n: 2, icon: User, label: 'Datos' },
          { n: 3, icon: CheckCircle, label: isCustomQuote ? 'Reunión' : 'Pago' },
        ].map(({ n, icon: Icon, label }) => (
          <div key={n} className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                step === n
                  ? 'bg-violet-600 text-black'
                  : step > n
                  ? 'bg-violet-600/20 text-violet-400'
                  : 'bg-[#111118] border border-[#1e1e2e] text-slate-500'
              }`}
            >
              <Icon size={14} />
              {label}
            </div>
            {n < 3 && <div className={`w-8 h-0.5 ${step > n ? 'bg-violet-600' : 'bg-[#1e1e2e]'}`} />}
          </div>
        ))}
      </div>

      {/* STEP 1: Service selection + Date */}
      {step === 1 && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-5">
              1. Selecciona tu servicio
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`card p-5 text-left transition-all relative ${
                    selectedService.id === service.id
                      ? 'border-violet-500/60 glow bg-violet-600/5'
                      : 'hover:border-slate-600'
                  }`}
                >
                  {service.popular && (
                    <span className="absolute -top-2 right-3 bg-violet-600 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                      POPULAR
                    </span>
                  )}
                  {selectedService.id === service.id && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle size={16} className="text-violet-400" />
                    </div>
                  )}
                  <div className="font-semibold text-white text-sm mb-2 pr-5">{service.title}</div>
                  <div className="mb-3">
                    {service.price !== null ? (
                      <span className="text-2xl font-black text-white">
                        {service.price}€
                      </span>
                    ) : (
                      <span className="text-lg font-bold text-violet-400">Personalizado</span>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs">{service.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Web addon */}
          {!isCustomQuote && (
            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                2. ¿Quieres hosting del tour en tu web?{' '}
                <span className="text-slate-500 font-normal text-base">(opcional)</span>
              </h2>
              <button
                onClick={() => setWithWebAddon(!withWebAddon)}
                className={`card p-5 text-left w-full sm:max-w-md transition-all ${
                  withWebAddon ? 'border-violet-500/60 bg-violet-600/5' : 'hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded border-2 mt-0.5 flex items-center justify-center transition-all ${
                      withWebAddon
                        ? 'bg-violet-600 border-violet-500'
                        : 'border-slate-600'
                    }`}
                  >
                    {withWebAddon && <CheckCircle size={12} className="text-black" />}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{webAddon.title}</div>
                    <div className="text-violet-400 font-bold">+{webAddon.price}€/año</div>
                    <div className="text-slate-500 text-xs mt-1">{webAddon.description}</div>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Date & time */}
          <div>
            <h2 className="text-xl font-bold text-white mb-5">
              {isCustomQuote ? '2.' : '3.'} Elige fecha y hora de la visita
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-slate-400 mb-3 block flex items-center gap-1.5">
                  <Calendar size={14} /> Fecha disponible
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1">
                  {dates.slice(0, 24).map((date) => {
                    const d = new Date(date + 'T00:00:00')
                    const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' })
                    const dayNum = d.getDate()
                    const month = d.toLocaleDateString('es-ES', { month: 'short' })
                    return (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`card py-2.5 text-center text-xs transition-all ${
                          selectedDate === date
                            ? 'border-violet-500 bg-violet-600/10 text-violet-400'
                            : 'hover:border-slate-600 text-slate-400'
                        }`}
                      >
                        <div className="capitalize font-medium">{dayName}</div>
                        <div className="font-bold text-base text-white">{dayNum}</div>
                        <div className="capitalize text-slate-500">{month}</div>
                      </button>
                    )
                  })}
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-3 block">Hora de la visita</label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`card py-3 text-sm font-medium transition-all ${
                        selectedTime === time
                          ? 'border-violet-500 bg-violet-600/10 text-violet-400'
                          : 'hover:border-slate-600 text-slate-400'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Summary + next */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 card p-5">
            <div>
              <div className="text-sm text-slate-400 mb-1">Resumen:</div>
              <div className="text-white font-semibold">{selectedService.title}</div>
              {withWebAddon && (
                <div className="text-slate-400 text-sm">+ Hosting web (19,99€/año)</div>
              )}
              {selectedDate && selectedTime && (
                <div className="text-slate-500 text-xs mt-1">
                  Visita: {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} a las {selectedTime}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              {totalPrice !== null && (
                <div className="text-right">
                  <div className="text-2xl font-black text-white">{totalPrice.toFixed(2).replace('.', ',')}€</div>
                  <div className="text-xs text-slate-500">+ IVA</div>
                </div>
              )}
              <button onClick={goToStep2} className="btn-primary whitespace-nowrap">
                Continuar
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Contact info */}
      {step === 2 && (
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">Tus datos de contacto</h2>
          <div className="space-y-4 mb-8">
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Nombre completo *</label>
              <input
                type="text"
                required
                value={contactInfo.name}
                onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                className="input-field"
                placeholder="Juan García"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Email *</label>
              <input
                type="email"
                required
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                className="input-field"
                placeholder="juan@ejemplo.com"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Teléfono</label>
              <input
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                className="input-field"
                placeholder="+34 600 000 000"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">
                Dirección del inmueble *
              </label>
              <input
                type="text"
                required
                value={contactInfo.address}
                onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                className="input-field"
                placeholder="Calle Ejemplo 123, Madrid"
              />
            </div>
          </div>

          {/* Booking summary */}
          <div className="card p-5 mb-6 space-y-3">
            <h3 className="font-semibold text-white text-sm">Resumen de reserva</h3>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">{selectedService.title}</span>
              <span className="text-white font-medium">{selectedService.price}€</span>
            </div>
            {withWebAddon && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Hosting web (anual)</span>
                <span className="text-white font-medium">{webAddon.price}€</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Fecha de visita</span>
              <span className="text-white font-medium">
                {selectedDate
                  ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                    })
                  : '-'}{' '}
                {selectedTime}
              </span>
            </div>
            {totalPrice && (
              <div className="border-t border-[#1e1e2e] pt-3 flex justify-between font-bold">
                <span className="text-white">Total (+ IVA)</span>
                <span className="text-violet-400 text-lg">{totalPrice.toFixed(2).replace('.', ',')}€</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="btn-ghost border border-[#1e1e2e]"
            >
              Atrás
            </button>
            <button onClick={goToStep3} className="btn-primary flex-1">
              {isCustomQuote ? 'Solicitar presupuesto' : 'Ir al pago'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Payment or Confirmation */}
      {step === 3 && (
        <div className="max-w-lg mx-auto">
          {isCustomQuote ? (
            meetingSubmitted ? (
              /* SUCCESS STATE */
              <div className="card p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={30} className="text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">¡Reunión solicitada!</h2>
                <p className="text-slate-400 mb-6">
                  Hemos recibido tu solicitud. Te contactaremos en menos de <strong className="text-white">24 horas</strong> para confirmar la reunión y preparar tu presupuesto personalizado.
                </p>
                <div className="card p-4 text-left text-sm space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Contacto</span>
                    <span className="text-slate-300">{contactInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email</span>
                    <span className="text-slate-300">{contactInfo.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tipo de reunión</span>
                    <span className="text-slate-300">
                      {meetingType === 'video' ? 'Videollamada' : meetingType === 'phone' ? 'Llamada' : 'Presencial'}
                    </span>
                  </div>
                </div>
                <a href="tel:+34644857326" className="btn-outline inline-flex items-center gap-2">
                  <Phone size={15} />
                  ¿Prefieres que te llamemos ahora?
                </a>
              </div>
            ) : (
              /* MEETING FORM */
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Solicitar presupuesto personalizado</h2>
                <p className="text-slate-400 text-sm mb-6">
                  Cuéntanos sobre tu espacio y elegimos el formato de reunión que mejor te venga.
                </p>

                {/* Summary card */}
                <div className="card p-4 mb-6 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Contacto</span>
                    <span className="text-slate-300">{contactInfo.name} · {contactInfo.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fecha visita</span>
                    <span className="text-slate-300">
                      {selectedDate
                        ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
                        : '-'}{' '}{selectedTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dirección</span>
                    <span className="text-slate-300">{contactInfo.address}</span>
                  </div>
                </div>

                {/* Meeting type */}
                <div className="mb-5">
                  <label className="text-sm text-slate-400 mb-3 block">¿Cómo prefieres hablar con nosotros?</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'video' as const, icon: Video, label: 'Videollamada', desc: 'Google Meet o Zoom' },
                      { id: 'phone' as const, icon: Phone, label: 'Llamada', desc: 'Te llamamos nosotros' },
                      { id: 'presencial' as const, icon: MessageSquare, label: 'Presencial', desc: 'En Madrid' },
                    ].map(({ id, icon: Icon, label, desc }) => (
                      <button
                        key={id}
                        onClick={() => setMeetingType(id)}
                        className={`card p-4 text-center transition-all ${
                          meetingType === id
                            ? 'border-violet-500 bg-violet-600/10'
                            : 'hover:border-slate-600'
                        }`}
                      >
                        <Icon size={20} className={`mx-auto mb-2 ${meetingType === id ? 'text-violet-400' : 'text-slate-500'}`} />
                        <div className={`font-medium text-sm ${meetingType === id ? 'text-white' : 'text-slate-300'}`}>{label}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className="text-sm text-slate-400 mb-1.5 block">
                    Descripción del espacio <span className="text-slate-600">(opcional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={meetingDescription}
                    onChange={(e) => setMeetingDescription(e.target.value)}
                    className="input-field resize-none"
                    placeholder="Ej: Hotel de 15 habitaciones, 800m², 3 plantas. Queremos tour completo de todas las zonas comunes..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="btn-ghost border border-[#1e1e2e]"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={submitMeetingRequest}
                    disabled={meetingSubmitting}
                    className="btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {meetingSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Calendar size={16} />
                        Solicitar reunión y presupuesto
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          ) : clientSecret ? (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Completa el pago</h2>

              {/* Payment method selector */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setPaymentMethod('stripe')}
                  className={`flex-1 card p-3 text-sm font-medium transition-all ${
                    paymentMethod === 'stripe'
                      ? 'border-violet-500 bg-violet-600/10 text-white'
                      : 'text-slate-400 hover:border-slate-600'
                  }`}
                >
                  Tarjeta / Apple Pay / Google Pay
                </button>
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`flex-1 card p-3 text-sm font-medium transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-blue-500 bg-blue-500/10 text-white'
                      : 'text-slate-400 hover:border-slate-600'
                  }`}
                >
                  PayPal
                </button>
              </div>

              {paymentMethod === 'stripe' && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'night',
                      variables: {
                        colorPrimary: '#06b6d4',
                        colorBackground: '#111118',
                        colorText: '#f1f5f9',
                        colorDanger: '#ef4444',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        spacingUnit: '4px',
                        borderRadius: '8px',
                      },
                    },
                  }}
                >
                  <CheckoutForm
                    amount={totalPrice!}
                    onBack={() => setStep(2)}
                    bookingDetails={{
                      service: selectedService.title,
                      date: selectedDate,
                      time: selectedTime,
                      address: contactInfo.address,
                      customerName: contactInfo.name,
                      customerEmail: contactInfo.email,
                    }}
                  />
                </Elements>
              )}

              {paymentMethod === 'paypal' && (
                <div className="card p-6">
                  <p className="text-slate-400 text-sm mb-4 text-center">
                    Serás redirigido a PayPal para completar el pago de forma segura.
                  </p>
                  <PayPalButton
                    amount={totalPrice!}
                    onBack={() => setStep(2)}
                    bookingDetails={{
                      service: selectedService.title,
                      customerEmail: contactInfo.email,
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// PayPal button component (lazy-loaded to avoid SSR issues)
function PayPalButton({
  amount,
  onBack,
  bookingDetails,
}: {
  amount: number
  onBack: () => void
  bookingDetails: { service: string; customerEmail: string }
}) {
  const [paid, setPaid] = useState(false)

  if (paid) {
    return (
      <div className="text-center py-4">
        <CheckCircle size={40} className="text-green-400 mx-auto mb-3" />
        <h3 className="text-white font-bold text-lg mb-2">¡Pago completado!</h3>
        <p className="text-slate-400 text-sm">
          Recibirás la confirmación en {bookingDetails.customerEmail}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <button
        className="w-full bg-[#0070ba] hover:bg-[#005a94] text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
        onClick={() => {
          // In production, use @paypal/react-paypal-js PayPalButtons component
          // This is a placeholder that shows the concept
          window.open(
            `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=hola@360tourx.com&amount=${amount}&item_name=${encodeURIComponent(bookingDetails.service)}&currency_code=EUR`,
            '_blank'
          )
        }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.384a.641.641 0 0 1 .633-.544h7.882c2.692 0 4.577.87 5.376 2.447.372.738.498 1.502.413 2.38-.025.26-.087.535-.162.812h.005c-.87 3.404-3.865 4.58-7.69 4.58H9.24a.641.641 0 0 0-.633.543l-1.14 6.785a.641.641 0 0 1-.39.45z" />
        </svg>
        Pagar {amount.toFixed(2)}€ con PayPal
      </button>
      <button onClick={onBack} className="btn-ghost w-full text-sm">
        Volver atrás
      </button>
      <p className="text-xs text-slate-600 text-center">
        Serás redirigido al sitio seguro de PayPal
      </p>
    </div>
  )
}
