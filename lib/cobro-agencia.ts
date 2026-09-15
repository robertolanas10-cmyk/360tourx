import crypto from 'crypto'
import Stripe from 'stripe'
import { getPrecioAnualId } from '@/lib/hosting'
import { HOSTING_AGENCIA_ANUAL } from '@/lib/tarifas-agencia'

// Cobro de solicitudes de agencias. Los importes llevan el IVA incluido: se cobran tal cual.

export const HOSTING_AGENCIA_CENTIMOS = Math.round(HOSTING_AGENCIA_ANUAL * 100)

// Stripe no admite cobros de menos de 0,50 € en euros.
export const IMPORTE_MINIMO = 0.5

export function nuevoTokenPago(): string {
  return crypto.randomBytes(24).toString('base64url')
}

export function urlPago(token: string, origen?: string): string {
  const sitio = origen || process.env.NEXT_PUBLIC_SITE_URL || 'https://360tourx.com'
  return `${sitio}/pago/${token}`
}

interface DatosCobro {
  id: number
  agencia: string
  email: string
  tokenPago: string
  importeTours: number | null // euros, IVA incluido
  conHosting: boolean
  direcciones: string[]
}

// Crea la página de pago de Stripe. Con alojamiento es una suscripción: el primer cargo incluye los
// tours (pago único) y el primer año, y Stripe renueva solo el alojamiento cada año con la misma tarjeta.
// Sin alojamiento es un pago único.
export async function crearCheckoutAgencia(
  stripe: Stripe,
  datos: DatosCobro,
  origen: string
): Promise<Stripe.Checkout.Session> {
  const lineas: Stripe.Checkout.SessionCreateParams.LineItem[] = []

  if (datos.importeTours && datos.importeTours > 0) {
    const n = datos.direcciones.length
    lineas.push({
      quantity: 1,
      price_data: {
        currency: 'eur',
        unit_amount: Math.round(datos.importeTours * 100),
        product_data: {
          name: `Tours virtuales 360° · ${n} inmueble${n === 1 ? '' : 's'}`,
          description: datos.direcciones.join(' · ').slice(0, 500) || undefined,
        },
      },
    })
  }

  if (datos.conHosting) {
    lineas.push({
      quantity: 1,
      price: await getPrecioAnualId(stripe, {
        lookupKey: `hosting_agencia_anual_${HOSTING_AGENCIA_CENTIMOS}`,
        centimos: HOSTING_AGENCIA_CENTIMOS,
        nombre: 'Alojamiento de todos los tours de la agencia (anual)',
      }),
    })
  }

  if (lineas.length === 0) throw new Error('La solicitud no tiene nada que cobrar')

  const metadata = { solicitudId: String(datos.id) }
  const comunes: Stripe.Checkout.SessionCreateParams = {
    line_items: lineas,
    customer_email: datos.email,
    payment_method_types: ['card'],
    billing_address_collection: 'required',
    tax_id_collection: { enabled: true }, // para que la agencia pueda dejar su CIF
    locale: 'es',
    metadata,
    success_url: `${urlPago(datos.tokenPago, origen)}?estado=ok`,
    cancel_url: urlPago(datos.tokenPago, origen),
  }

  if (datos.conHosting) {
    return stripe.checkout.sessions.create({
      ...comunes,
      mode: 'subscription',
      subscription_data: {
        metadata,
        description: `Alojamiento de tours · ${datos.agencia} · Solicitud #${datos.id}`,
      },
    })
  }

  return stripe.checkout.sessions.create({
    ...comunes,
    mode: 'payment',
    customer_creation: 'always',
    payment_intent_data: {
      metadata,
      description: `Tours virtuales 360° · ${datos.agencia} · Solicitud #${datos.id}`,
    },
  })
}
