import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description: 'Términos y condiciones de uso de los servicios de 360TourX.',
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Términos y Condiciones</h1>
        <p className="text-slate-400 mb-12 text-sm">Última actualización: 2026</p>

        <div className="prose prose-invert max-w-none space-y-8 text-slate-300 leading-relaxed">

          <p>
            Bienvenido/a a 360TourX, una compañía dedicada a la organización y venta de tours virtuales.
            Al acceder a nuestro sitio web o contratar nuestros servicios, acepta estos Términos y Condiciones
            que regulan el uso de nuestra plataforma y las relaciones comerciales con nuestros clientes.
          </p>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Uso del servicio</h2>
            <p>
              Este sitio web y todos sus contenidos (textos, imágenes, vídeos, logotipos y material promocional)
              son propiedad de 360TourX.
            </p>
            <p className="mt-3">
              Nuestros tours se ofrecen exclusivamente para uso personal y no pueden revenderse ni reproducirse
              sin autorización.
            </p>
            <p className="mt-3">
              El cliente es responsable de proporcionar información veraz al momento de reservar y cumplir
              las normas establecidas para cada tour.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Propiedad intelectual y contenido</h2>
            <p>
              Todo el contenido relacionado con nuestros tours y materiales digitales está protegido por
              derechos de autor y otras leyes de propiedad intelectual. Está prohibido grabar, distribuir,
              copiar o utilizar cualquier material de nuestros tours sin autorización previa por escrito.
            </p>
            <p className="mt-3">
              El usuario reconoce que 360TourX conserva todos los derechos sobre el contenido visual,
              audiovisual y textual de los tours ofrecidos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Responsabilidad y modificaciones</h2>
            <p>
              360TourX no se hace responsable de pérdidas o daños derivados del uso del sitio web o de los
              servicios, excepto en los casos exigidos por la ley.
            </p>
            <p className="mt-3">
              Nos reservamos el derecho de actualizar, modificar o suspender temporalmente nuestros servicios,
              contenidos o estos Términos sin previo aviso. El uso continuado del sitio implica la aceptación
              de dichas modificaciones.
            </p>
          </section>

          <section className="border-t border-slate-700 pt-8">
            <p>
              <strong className="text-white">Contacto:</strong>{' '}
              <a href="mailto:hola@360tourx.com" className="text-violet-400 hover:text-violet-300">
                hola@360tourx.com
              </a>
            </p>
            <p className="mt-2">
              <strong className="text-white">Jurisdicción:</strong> España — Juzgados y Tribunales de Madrid.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
