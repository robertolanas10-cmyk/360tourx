import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Accesibilidad',
  description: 'Compromiso de accesibilidad de 360TourX.',
}

export default function AccesibilidadPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Accesibilidad</h1>
        <p className="text-slate-400 mb-12 text-sm">Última actualización: 2026</p>

        <div className="prose prose-invert max-w-none space-y-8 text-slate-300 leading-relaxed">

          <p>
            En 360TourX queremos que nuestro sitio web y nuestros tours virtuales 360° sean accesibles
            para el mayor número de personas posible, con independencia de sus capacidades o del
            dispositivo que utilicen para navegar.
          </p>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Nuestro compromiso</h2>
            <p>
              Trabajamos de forma continua para mejorar la accesibilidad de nuestra web siguiendo, en
              la medida de lo posible, las Pautas de Accesibilidad para el Contenido Web (WCAG) del
              World Wide Web Consortium (W3C). Esto incluye cuidar el contraste de color, el orden de
              navegación, el uso de textos alternativos en imágenes y la compatibilidad con lectores de
              pantalla y navegación por teclado.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Tours virtuales</h2>
            <p>
              Nuestros tours 360° están pensados para poder recorrerse tanto con ratón y teclado como
              desde dispositivos táctiles, y son compatibles con los principales navegadores de
              escritorio y móvil.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Trabajo en curso</h2>
            <p>
              Somos conscientes de que puede haber partes del sitio que aún no cumplan todos los
              criterios de accesibilidad. Estamos revisando y mejorando la web de forma progresiva para
              corregir estas limitaciones.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. ¿Has encontrado un problema?</h2>
            <p>
              Si al navegar por nuestro sitio te encuentras con alguna barrera de accesibilidad o tienes
              alguna sugerencia para mejorarla, nos gustaría saberlo.
            </p>
          </section>

          <section className="border-t border-slate-700 pt-8">
            <p>
              <strong className="text-white">Contacto:</strong>{' '}
              <a href="mailto:hola@360tourx.com" className="text-violet-400 hover:text-violet-300">
                hola@360tourx.com
              </a>
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
