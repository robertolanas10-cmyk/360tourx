import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Reembolso',
  description: 'Política de reembolso y cancelación de 360TourX.',
}

export default function ReembolsoPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Política de Reembolso</h1>
        <p className="text-slate-400 mb-12 text-sm">Última actualización: 2026</p>

        <div className="prose prose-invert max-w-none space-y-8 text-slate-300 leading-relaxed">

          <p>
            En 360TourX queremos que estés completamente satisfecho con tu tour virtual. Esta política
            describe las condiciones bajo las cuales puedes solicitar un reembolso, de acuerdo con el
            Real Decreto Legislativo 1/2007, de 16 de noviembre, por el que se aprueba el texto refundido
            de la Ley General para la Defensa de los Consumidores y Usuarios.
          </p>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Derecho de desistimiento</h2>
            <p>
              Tienes derecho a desistir del contrato en un plazo de 14 días naturales desde la fecha
              de contratación, sin necesidad de justificación, siempre que el servicio no haya comenzado
              a prestarse.
            </p>
            <p className="mt-3">
              <strong className="text-white">Excepción importante:</strong> Si has solicitado expresamente
              que el servicio comience antes de que expire el plazo de desistimiento, y el tour ya ha sido
              realizado o está en proceso de producción, pierdes el derecho de desistimiento una vez que
              el servicio haya sido completamente ejecutado.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Cancelaciones y reembolsos</h2>
            <p>Las siguientes condiciones aplican según el estado de tu pedido:</p>
            <div className="mt-4 space-y-4">
              <div className="card p-5 border border-green-500/20 bg-green-500/5">
                <p className="font-semibold text-green-400 mb-1">Antes de la visita</p>
                <p className="text-sm text-slate-400">
                  Reembolso completo si cancelas con al menos 24 horas de antelación respecto a la
                  fecha programada para la visita fotográfica.
                </p>
              </div>
              <div className="card p-5 border border-yellow-500/20 bg-yellow-500/5">
                <p className="font-semibold text-yellow-400 mb-1">Cancelación con menos de 24 horas</p>
                <p className="text-sm text-slate-400">
                  Se aplicará una penalización del 50% del importe total. El 50% restante será reembolsado.
                </p>
              </div>
              <div className="card p-5 border border-red-500/20 bg-red-500/5">
                <p className="font-semibold text-red-400 mb-1">Después de la visita / Tour completado</p>
                <p className="text-sm text-slate-400">
                  No se realizan reembolsos una vez que el tour ha sido fotografiado y/o entregado,
                  salvo defecto probado imputable a 360TourX.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Incidencias y garantía de calidad</h2>
            <p>
              Si el tour entregado presenta defectos técnicos o no cumple con los estándares acordados,
              tienes un plazo de 7 días desde la entrega para notificárnoslo. En ese caso, nos
              comprometemos a corregir el problema sin coste adicional o, si no es posible resolverlo,
              a ofrecer un reembolso total.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Cómo solicitar un reembolso</h2>
            <p>Para iniciar una solicitud de reembolso o cancelación:</p>
            <ol className="list-decimal list-inside space-y-2 mt-3 text-slate-400">
              <li>
                Escríbenos a{' '}
                <a href="mailto:hola@360tourx.com" className="text-violet-400 hover:text-violet-300">
                  hola@360tourx.com
                </a>{' '}
                indicando tu nombre, número de pedido y motivo de la cancelación.
              </li>
              <li>
                También puedes llamarnos al{' '}
                <a href="tel:+34644857326" className="text-violet-400 hover:text-violet-300">
                  +34 644 85 73 26
                </a>
                .
              </li>
              <li>
                Una vez recibida tu solicitud, la procesaremos en un plazo máximo de 10 días hábiles.
              </li>
              <li>
                El reembolso se realizará a través del mismo método de pago utilizado en la compra
                (Stripe o PayPal).
              </li>
            </ol>
          </section>

          <section className="border-t border-slate-700 pt-8">
            <p>
              <strong className="text-white">Contacto para reembolsos:</strong>{' '}
              <a href="mailto:hola@360tourx.com" className="text-violet-400 hover:text-violet-300">
                hola@360tourx.com
              </a>
            </p>
            <p className="mt-2">
              <strong className="text-white">Jurisdicción:</strong> España — Juzgados y Tribunales de Madrid.
              Normativa aplicable: Real Decreto Legislativo 1/2007 y legislación española vigente.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
