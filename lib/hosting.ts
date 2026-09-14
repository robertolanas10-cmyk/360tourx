import Stripe from 'stripe'

// Precio anual del hosting del tour, en céntimos (32,99 €).
// Se muestra en BookingClient, /precios, la home, /inmobiliarias y /terminos: si cambia, cámbialo allí también.
export const HOSTING_ANUAL_CENTIMOS = 3299

// La lookup_key lleva el importe: si el precio cambia, se crea un Price nuevo en Stripe
// y las suscripciones ya existentes siguen renovándose con el suyo.
const HOSTING_LOOKUP_KEY = `hosting_tour_anual_${HOSTING_ANUAL_CENTIMOS}`

// Devuelve el Price recurrente anual del hosting, creándolo en Stripe la primera vez.
export async function getHostingPriceId(stripe: Stripe): Promise<string> {
  const existentes = await stripe.prices.list({
    lookup_keys: [HOSTING_LOOKUP_KEY],
    active: true,
    limit: 1,
  })
  if (existentes.data[0]) return existentes.data[0].id

  const price = await stripe.prices.create({
    currency: 'eur',
    unit_amount: HOSTING_ANUAL_CENTIMOS,
    recurring: { interval: 'year' },
    lookup_key: HOSTING_LOOKUP_KEY,
    product_data: { name: 'Hosting del tour virtual (anual)' },
  })
  return price.id
}

// Traduce el estado de la suscripción de Stripe al estado de hosting que se ve en el panel.
export function estadoHosting(sub: Stripe.Subscription): string {
  if (sub.status === 'canceled' || sub.status === 'incomplete_expired') return 'cancelado'
  if (sub.status === 'past_due' || sub.status === 'unpaid') return 'impago'
  if (sub.cancel_at_period_end) return 'cancela_al_vencer'
  return 'activo'
}

// Crea la suscripción anual del hosting tras pagar la reserva. El primer año ya va incluido en
// ese pago, así que la suscripción arranca con el ciclo anclado al aniversario del pago y sin
// prorrateo: no cobra nada ahora y renueva sola cada año con la tarjeta de la reserva.
export async function crearSuscripcionHosting(
  stripe: Stripe,
  pi: Stripe.PaymentIntent,
  reservaId: number
): Promise<Stripe.Subscription | null> {
  const customerId = typeof pi.customer === 'string' ? pi.customer : pi.customer?.id
  const paymentMethodId =
    typeof pi.payment_method === 'string' ? pi.payment_method : pi.payment_method?.id
  if (!customerId || !paymentMethodId) {
    console.error(`Hosting: el pago ${pi.id} no tiene cliente o método de pago guardado`)
    return null
  }

  // Si ya existe (p. ej. se creó pero falló al guardarla en la BD), se reutiliza en vez de duplicarla.
  const previas = await stripe.subscriptions.list({ customer: customerId, status: 'all', limit: 100 })
  const previa = previas.data.find((s) => s.metadata?.paymentIntentId === pi.id)
  if (previa) return previa

  // Stripe no admite un ancla posterior a "un año desde que se crea la suscripción", así que se
  // parte de la fecha del pago (anterior a la creación) y se resta una hora de margen. Al salir del
  // PaymentIntent, un reintento del webhook repite exactamente los mismos parámetros.
  const aniversario = new Date(pi.created * 1000)
  aniversario.setUTCFullYear(aniversario.getUTCFullYear() + 1)
  const ancla = Math.floor(aniversario.getTime() / 1000) - 60 * 60
  const priceId = await getHostingPriceId(stripe)

  return stripe.subscriptions.create(
    {
      customer: customerId,
      items: [{ price: priceId }],
      default_payment_method: paymentMethodId,
      billing_cycle_anchor: ancla,
      proration_behavior: 'none',
      description: `Hosting del tour virtual · Reserva #${reservaId}`,
      metadata: { reservaId: String(reservaId), paymentIntentId: pi.id },
    },
    // La clave incluye los parámetros: un reintento idéntico no duplica, y si el código cambia entre
    // reintentos no queda bloqueada por la clave del intento anterior.
    { idempotencyKey: `hosting-${pi.id}-${priceId}-${ancla}` }
  )
}
