import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await req.json()
    const { estadoPago, estadoTour, notas } = body

    const reserva = await prisma.reserva.update({
      where: { id },
      data: {
        ...(estadoPago !== undefined && { estadoPago }),
        ...(estadoTour !== undefined && { estadoTour }),
        ...(notas !== undefined && { notas }),
      },
    })

    return NextResponse.json(reserva)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error updating reserva' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    await prisma.reserva.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error deleting reserva' }, { status: 500 })
  }
}
