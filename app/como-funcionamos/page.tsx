import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Phone, Calendar, Camera, Cpu, Send, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cómo Funcionamos',
  description:
    'Descubre el proceso de 360TourX: desde la reserva hasta la entrega de tu tour virtual en menos de 24 horas.',
}

const steps = [
  {
    icon: Phone,
    number: '01',
    title: 'Contacta o reserva online',
    description:
      'Selecciona el servicio que mejor se adapta al tamaño de tu espacio y realiza tu reserva directamente en nuestra web. También puedes llamarnos o escribirnos para una tarifa personalizada.',
    details: ['Reserva online 24/7', 'Pago seguro con Stripe o PayPal', 'Confirmación inmediata'],
  },
  {
    icon: Calendar,
    number: '02',
    title: 'Acordamos la visita',
    description:
      'Nos ponemos en contacto contigo para confirmar la fecha y hora de la visita que mejor se adapte a tu agenda. Somos flexibles y podemos adaptarnos a tus horarios.',
    details: ['Disponibilidad de lunes a sábado', 'Confirmación por email y SMS', 'Recordatorio el día anterior'],
  },
  {
    icon: Camera,
    number: '03',
    title: 'Realizamos el tour',
    description:
      'Nuestro equipo profesional se desplaza a tu espacio con el equipo de fotografía 360° de última generación. El proceso dura entre 1 y 3 horas dependiendo del tamaño del espacio.',
    details: ['Equipo fotográfico profesional', 'Sin interrupciones para tu negocio', 'Fotografía en múltiples puntos'],
  },
  {
    icon: Cpu,
    number: '04',
    title: 'Procesamos y ensamblamos',
    description:
      'Procesamos todas las imágenes panorámicas con software especializado de mapeo 3D, añadimos etiquetas informativas y ensamblamos el tour completo con navegación fluida.',
    details: ['Procesado en alta resolución', 'Etiquetas personalizadas', 'Control de calidad riguroso'],
  },
  {
    icon: Send,
    number: '05',
    title: 'Entregamos en 48-72h',
    description:
      'Recibes el enlace de tu tour virtual completo en 48h (hasta 100m²) o 72h (hasta 300m²) en tu correo electrónico, listo para compartir con clientes, publicar en tu web o subir a Google Maps.',
    details: ['Enlace único compartible', 'Código de embed para tu web', 'Publicación en Google Maps'],
  },
]

const faqs = [
  {
    q: '¿Cuánto tiempo dura la sesión fotográfica?',
    a: 'Entre 1 y 3 horas dependiendo del tamaño del espacio. Para un piso de 100m² suele ser aproximadamente 1 hora.',
  },
  {
    q: '¿Necesito preparar el espacio antes de la visita?',
    a: 'Recomendamos que el espacio esté ordenado y con buena iluminación. Si es posible, abrir persianas y encender luces para obtener mejores resultados.',
  },
  {
    q: '¿El tour funciona en móviles?',
    a: 'Sí, completamente. Compatible con iOS y Android, así como tablets y ordenadores de escritorio. También compatible con gafas de realidad virtual.',
  },
  {
    q: '¿Puedo actualizar el tour después?',
    a: 'Sí, ofrecemos sesiones de actualización con descuento para clientes existentes que quieran refrescar su tour.',
  },
  {
    q: '¿Dónde realizáis el servicio?',
    a: 'Operamos principalmente en Madrid y alrededores. Para otras ciudades, consúltanos — podemos desplazarnos con gastos de viaje adicionales.',
  },
]

export default function ComoFuncionamosPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 grid-overlay">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/5 blur-3xl rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-4">
            El proceso
          </p>
          <h1 className="section-title mb-6">
            De la reserva al tour en{' '}
            <span className="gradient-text">menos de 24 horas</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            Un proceso simple, profesional y sin complicaciones. Te acompañamos en cada paso.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step.number} className="card p-8 flex flex-col sm:flex-row gap-6">
                <div className="flex items-start gap-5 sm:gap-6">
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center">
                      <step.icon size={24} className="text-violet-400" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-violet-600 text-black text-xs font-black flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-slate-600 text-xs font-mono mb-1">{step.number}</div>
                    <h3 className="font-bold text-white text-xl mb-3">{step.title}</h3>
                    <p className="text-slate-400 leading-relaxed mb-5">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-2 text-sm text-slate-300">
                          <CheckCircle size={14} className="text-violet-500 shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-[#111118] border-y border-[#1e1e2e]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="card p-6">
                <h3 className="font-semibold text-white mb-3">{faq.q}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Listo para empezar?</h2>
          <p className="text-slate-400 mb-8">
            Reserva tu tour virtual ahora mismo y recibe tu enlace en menos de 24 horas.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/reserva" className="btn-primary text-base px-8">
              Reservar ahora
              <ArrowRight size={18} />
            </Link>
            <a href="tel:+34644857326" className="btn-outline text-base px-8">
              <Phone size={16} />
              +34 644 85 73 26
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
