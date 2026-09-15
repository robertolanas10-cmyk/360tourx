import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { IMPORTE_MINIMO, nuevoTokenPago, urlPago } from '@/lib/cobro-agencia'

// Fija el importe final acordado y genera (o actualiza) el enlace de pago de la solicitud.
// Si ya había enlace, se mantiene el mismo: la agencia paga siempre lo último que se guarde aquí.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10)
    const body = await req.json().catch(() => ({}))
    const conHosting = body.conHosting === true
    const importe = body.importeTours === null || body.importeTours === '' ? null : Number(body.importeTours)

    if (importe !== null && (!Number.isFinite(importe) || importe < 0 || importe > 1_000_000)) {
      return NextResponse.json({ error: 'El importe de los tours no es válido' }, { status: 400 })
    }
    const importeTours = importe === null || importe === 0 ? null : Math.round(importe * 100) / 100
    if (importeTours !== null && importeTours < IMPORTE_MINIMO) {
      return NextResponse.json({ error: `El importe mínimo es ${IMPORTE_MINIMO} €` }, { status: 400 })
    }
    if (importeTours === null && !conHosting) {
      return NextResponse.json({ error: 'Indica el importe de los tours o marca el alojamiento' }, { status: 400 })
    }

    const actual = await prisma.solicitudAgencia.findUnique({ where: { id } })
    if (!actual) return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
    if (actual.estadoPago === 'pagada') {
      return NextResponse.json({ error: 'Esta solicitud ya está pagada' }, { status: 409 })
    }

    const solicitud = await prisma.solicitudAgencia.update({
      where: { id },
      data: {
        importeTours,
        conHosting,
        tokenPago: actual.tokenPago ?? nuevoTokenPago(),
        estadoPago: 'pendiente',
        ...(actual.estado === 'nueva' ? { estado: 'presupuestada' } : {}),
      },
      include: { inmuebles: { orderBy: { id: 'asc' } } },
    })
    return NextResponse.json({ ...solicitud, urlPago: urlPago(solicitud.tokenPago!) })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'No se pudo generar el enlace' }, { status: 500 })
  }
}
