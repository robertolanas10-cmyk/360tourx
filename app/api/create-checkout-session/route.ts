import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

const PRICE_MAP: Record<string, number> = {
  '100m2': 29000,
  '200m2': 39000,
  '300m2': 49000,
  'web_addon': 1999,
}

const SERVICE_NAMES: Record<string, string> = {
  '100m2': 'Tour Virtual hasta 100m²',
  '200m2': 'Tour Virtual hasta 200m²',
  '300m2': 'Tour Virtual hasta 300m²',
}

// Stripe no permite cobrar menos de 0,50 € en euros.
const STRIPE_MIN_AMOUNT = 50

type Descuento = { type: 'percent' | 'fixed'; value: number }

// Lee los códigos de descuento de la variable de entorno CODIGOS_DESCUENTO.
// Formato: "CODIGO=valor" separados por comas. Si el valor termina en "%" es un
// descuento porcentual; si no, es el precio final fijo en euros.
//   Ej: "PRUEBA360=0.50,LANZAMIENTO=15%"
function getDescuento(codigo: string): Descuento | null {
  const raw = process.env.CODIGOS_DESCUENTO
  if (!raw || !codigo) return null
  const objetivo = codigo.trim().toUpperCase()
  for (const entrada of raw.split(',')) {
    const [c, v] = entrada.split('=').map((s) => (s || '').trim())
    if (!c || !v || c.toUpperCase() !== objetivo) continue
    if (v.endsWith('%')) {
      const pct = parseFloat(v.slice(0, -1).replace(',', '.'))
      return isNaN(pct) ? null : { type: 'percent', value: pct }
    }
    const eur = parseFloat(v.replace(',', '.'))
    return isNaN(eur) ? null : { type: 'fixed', value: eur }
  }
  return null
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      serviceId,
      withAddon,
      customerEmail,
      customerName,
      bookingDate,
      bookingTime,
      address,
      discountCode,
    } = body

    const serviceAmount = PRICE_MAP[serviceId]
    if (!serviceAmount) {
      return NextResponse.json({ error: 'Invalid service ID' }, { status: 400 })
    }

    const addonAmount = withAddon ? PRICE_MAP['web_addon'] : 0
    const totalAmount = serviceAmount + addonAmount

    // Aplicar código de descuento (validado en el servidor, antes de crear la reserva)
    let finalAmount = totalAmount
    let notaDescuento: string | null = null
    let codigoAplicado: string | null = null
    const codigo = (discountCode || '').trim()
    if (codigo) {
      const desc = getDescuento(codigo)
      if (!desc) {
        return NextResponse.json({ error: 'codigo_invalido' }, { status: 400 })
      }
      finalAmount =
        desc.type === 'percent'
          ? Math.round(totalAmount * (1 - desc.value / 100))
          : Math.round(desc.value * 100)
      if (finalAmount < STRIPE_MIN_AMOUNT) finalAmount = STRIPE_MIN_AMOUNT
      codigoAplicado = codigo.toUpperCase()
      notaDescuento = `Código "${codigoAplicado}" aplicado: ${(finalAmount / 100)
        .toFixed(2)
        .replace('.', ',')}€ (precio original ${(totalAmount / 100)
        .toFixed(2)
        .replace('.', ',')}€)`
    }

    const finalEuros = finalAmount / 100

    // Guardar reserva en base de datos (pendiente de pago)
    const reserva = await prisma.reserva.create({
      data: {
        nombre: customerName,
        email: customerEmail,
        direccion: address,
        servicio: serviceId,
        servicioNombre: SERVICE_NAMES[serviceId] || serviceId,
        conHostingWeb: withAddon || false,
        precio: finalEuros,
        fechaVisita: bookingDate ? new Date(bookingDate) : null,
        horaVisita: bookingTime || null,
        estadoPago: 'pendiente',
        metodoPago: 'stripe',
        notas: notaDescuento,
      },
    })

    // Crear o buscar cliente en Stripe (solo si hay clave configurada)
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_live_...') {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    let customer: Stripe.Customer
    const existingCustomers = await stripe.customers.list({ email: customerEmail, limit: 1 })

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0]
    } else {
      customer = await stripe.customers.create({
        email: customerEmail,
        name: customerName,
        metadata: { bookingDate, bookingTime, address },
      })
    }

    // Crear PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: 'eur',
      customer: customer.id,
      receipt_email: customerEmail,
      automatic_payment_methods: { enabled: true },
      metadata: {
        reservaId: reserva.id.toString(),
        serviceId,
        withAddon: withAddon ? 'true' : 'false',
        bookingDate,
        bookingTime,
        address,
        customerName,
        customerEmail,
        ...(codigoAplicado ? { codigoDescuento: codigoAplicado } : {}),
      },
      description: `360TourX - ${SERVICE_NAMES[serviceId]}${withAddon ? ' + Web Hosting' : ''} | ${bookingDate} ${bookingTime}`,
    })

    // Actualizar reserva con el ID de Stripe
    await prisma.reserva.update({
      where: { id: reserva.id },
      data: { stripeId: paymentIntent.id },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: finalAmount,
      reservaId: reserva.id,
    })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: 'Error creating payment intent' }, { status: 500 })
  }
}
