import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad y protección de datos de 360TourX.',
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Política de Privacidad</h1>
        <p className="text-slate-400 mb-12 text-sm">Última actualización: 2026</p>

        <div className="prose prose-invert max-w-none space-y-8 text-slate-300 leading-relaxed">

          <p>
            En 360TourX, nos tomamos muy en serio la privacidad de nuestros clientes y usuarios. Esta
            Política de Privacidad describe cómo recopilamos, usamos y protegemos la información personal
            que obtenemos a través de nuestro sitio web y servicios.
          </p>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Información que recopilamos</h2>
            <p>
              Recopilamos información que nos proporcionas directamente cuando reservas un tour, te
              registras o te pones en contacto con nosotros. Esto puede incluir:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-3 text-slate-400">
              <li>Nombre y apellidos</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono (opcional)</li>
              <li>Dirección del inmueble a fotografiar</li>
              <li>Información de pago (procesada de forma segura por Stripe o PayPal; nunca almacenamos datos de tarjeta)</li>
            </ul>
            <p className="mt-3">
              También recopilamos automáticamente cierta información técnica cuando visitas nuestra web,
              como tu dirección IP, tipo de navegador y páginas visitadas, con fines estadísticos y de
              seguridad.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Cómo usamos tu información</h2>
            <p>Utilizamos los datos recopilados para:</p>
            <ul className="list-disc list-inside space-y-1 mt-3 text-slate-400">
              <li>Gestionar y completar tus reservas de tours virtuales</li>
              <li>Enviarte confirmaciones, facturas y actualizaciones sobre tu pedido</li>
              <li>Atender consultas y solicitudes de soporte</li>
              <li>Mejorar nuestro sitio web y servicios</li>
              <li>Cumplir con obligaciones legales y fiscales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Cómo protegemos tus datos</h2>
            <p>
              Adoptamos medidas técnicas y organizativas apropiadas para proteger tu información personal
              frente a accesos no autorizados, pérdida o divulgación. Los pagos son procesados exclusivamente
              por pasarelas certificadas (Stripe y PayPal) que cumplen con el estándar PCI DSS.
            </p>
            <p className="mt-3">
              No vendemos, alquilamos ni cedemos tus datos personales a terceros, salvo que sea estrictamente
              necesario para la prestación del servicio (por ejemplo, empresas de envío de correo electrónico
              o plataformas de pago) o cuando lo exija la ley.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Tus derechos</h2>
            <p>
              De acuerdo con el Reglamento General de Protección de Datos (RGPD) y la normativa española
              aplicable, tienes derecho a:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-3 text-slate-400">
              <li>Acceder a tus datos personales</li>
              <li>Rectificar datos inexactos o incompletos</li>
              <li>Solicitar la eliminación de tus datos</li>
              <li>Oponerte al tratamiento de tus datos con fines de marketing</li>
              <li>Solicitar la portabilidad de tus datos</li>
            </ul>
            <p className="mt-3">
              Para ejercer cualquiera de estos derechos, escríbenos a{' '}
              <a href="mailto:hola@360tourx.com" className="text-violet-400 hover:text-violet-300">
                hola@360tourx.com
              </a>
              .
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
