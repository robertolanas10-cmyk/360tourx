import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { emailConfigurado, enviarEmail, escaparHtml } from '@/lib/email'
import { urlPago } from '@/lib/cobro-agencia'
import { HOSTING_AGENCIA_ANUAL, formatoEurosCentimos } from '@/lib/tarifas-agencia'

// Envía por email a la agencia el enlace de pago de su solicitud.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10)
    const s = await prisma.solicitudAgencia.findUnique({ where: { id } })
    if (!s || !s.tokenPago || s.estadoPago !== 'pendiente') {
      return NextResponse.json({ error: 'La solicitud no tiene un enlace de pago pendiente' }, { status: 400 })
    }
    if (!emailConfigurado()) {
      return NextResponse.json({ error: 'El envío de emails no está configurado. Copia el enlace o usa WhatsApp.' }, { status: 503 })
    }

    const importe = s.importeTours === null ? null : formatoEurosCentimos(Number(s.importeTours))
    await enviarEmail({
      para: s.email,
      asunto: `Tu presupuesto de 360TourX · Solicitud #${s.id}`,
      html: `<p>Hola ${escaparHtml(s.contacto)},</p>
        <p>Te enviamos el presupuesto de <strong>${escaparHtml(s.agencia)}</strong>:</p>
        <ul>
          ${importe ? `<li>Tours virtuales 360°: <strong>${importe}</strong> (IVA incluido)</li>` : ''}
          ${s.conHosting ? `<li>Alojamiento de todos tus tours: <strong>${formatoEurosCentimos(HOSTING_AGENCIA_ANUAL)} al año</strong> (IVA incluido), se renueva automáticamente cada año</li>` : ''}
        </ul>
        <p><a href="${urlPago(s.tokenPago)}" style="display:inline-block;background:#7c3aed;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600">Ver presupuesto y pagar</a></p>
        <p>El pago es seguro con Stripe. Si tienes cualquier duda, responde a este email o llámanos al +34 644 85 73 26.</p>
        <p>Un saludo,<br>El equipo de 360TourX</p>`,
    })
    return NextResponse.json({ enviado: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'No se pudo enviar el email' }, { status: 500 })
  }
}
