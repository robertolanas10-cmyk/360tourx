import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { crearCheckoutAgencia } from '@/lib/cobro-agencia'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

// Crea una página de pago de Stripe nueva para el enlace de la agencia y devuelve su URL.
// Se crea al pulsar "Pagar" (no al generar el enlace) porque las de Stripe caducan en 24 h.
export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const s = await prisma.solicitudAgencia.findUnique({
      where: { tokenPago: params.token },
      include: { inmuebles: { orderBy: { id: 'asc' } } },
    })
    if (!s || s.estadoPago === 'sin_enlace') {
      return NextResponse.json({ error: 'Enlace no válido' }, { status: 404 })
    }
    if (s.estadoPago === 'pagada') {
      return NextResponse.json({ error: 'Esta solicitud ya está pagada' }, { status: 409 })
    }

    // Si quedó abierta una página de pago anterior, se cierra para que no se pueda pagar dos veces.
    if (s.stripeCheckoutId) {
      try {
        const anterior = await stripe.checkout.sessions.retrieve(s.stripeCheckoutId)
        if (anterior.status === 'open') await stripe.checkout.sessions.expire(anterior.id)
      } catch (err) {
        console.error(`No se pudo cerrar el pago anterior de la solicitud #${s.id}:`, err)
      }
    }

    const session = await crearCheckoutAgencia(
      stripe,
      {
        id: s.id,
        agencia: s.agencia,
        email: s.email,
        tokenPago: s.tokenPago!,
        importeTours: s.importeTours === null ? null : Number(s.importeTours),
        conHosting: s.conHosting,
        direcciones: s.inmuebles.map((i) => i.direccion),
      },
      req.nextUrl.origin
    )

    await prisma.solicitudAgencia.update({ where: { id: s.id }, data: { stripeCheckoutId: session.id } })
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creando el pago de la agencia:', error)
    return NextResponse.json({ error: 'No se pudo iniciar el pago. Inténtalo de nuevo en unos minutos.' }, { status: 500 })
  }
}
