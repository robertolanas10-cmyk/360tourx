import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { crearSuscripcionHosting, estadoHosting } from '@/lib/hosting'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

// El webhook necesita el body sin procesar para verificar la firma de Stripe.
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Webhook no configurado' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Firma de webhook inválida:', err)
    return NextResponse.json({ error: 'Firma inválida' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent
        const reservaId = pi.metadata?.reservaId
        if (reservaId) {
          // updateMany no lanza error si no encuentra la reserva (evita reintentos infinitos)
          await prisma.reserva.updateMany({
            where: { id: parseInt(reservaId, 10) },
            data: { estadoPago: 'completado', stripeId: pi.id, metodoPago: 'stripe' },
          })

          // Reserva con hosting: crear la suscripción que renueva cada año (una sola vez).
          if (pi.metadata?.withAddon === 'true') {
            const id = parseInt(reservaId, 10)
            const reserva = await prisma.reserva.findUnique({ where: { id } })
            if (reserva && !reserva.stripeSubscriptionId) {
              const sub = await crearSuscripcionHosting(stripe, pi, id)
              if (sub) {
                await prisma.reserva.update({
                  where: { id },
                  data: {
                    stripeSubscriptionId: sub.id,
                    hostingEstado: estadoHosting(sub),
                    hostingVenceEl: new Date(sub.current_period_end * 1000),
                  },
                })
              }
            }
          }
        }
        break
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent
        const reservaId = pi.metadata?.reservaId
        if (reservaId) {
          await prisma.reserva.updateMany({
            where: { id: parseInt(reservaId, 10) },
            data: { estadoPago: 'fallido' },
          })
        }
        break
      }
      // Renovaciones, impagos y cancelaciones del hosting anual.
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        // Se consulta la suscripción en vez de usar la del evento: la forma del evento depende de la
        // versión de API del endpoint (en las recientes current_period_end ya no está en la raíz) y
        // así se guarda siempre el estado más reciente aunque los eventos lleguen desordenados.
        const { id } = event.data.object as Stripe.Subscription
        const sub = await stripe.subscriptions.retrieve(id)
        await prisma.reserva.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: {
            hostingEstado: estadoHosting(sub),
            hostingVenceEl: new Date(sub.current_period_end * 1000),
          },
        })
        break
      }
      default:
        // Otros eventos no nos interesan de momento
        break
    }
  } catch (err) {
    console.error('Error procesando webhook:', err)
    return NextResponse.json({ error: 'Error procesando el evento' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
