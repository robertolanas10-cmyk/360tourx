import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

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
