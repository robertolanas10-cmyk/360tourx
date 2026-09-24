import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await req.json()
    const {
      nombre, email, telefono, direccion, servicioNombre, precio,
      estadoPago, estadoTour, notas, categoria, empresa, enlaceTour,
    } = body

    const reserva = await prisma.reserva.update({
      where: { id },
      data: {
        ...(nombre !== undefined && { nombre }),
        ...(email !== undefined && { email }),
        ...(telefono !== undefined && { telefono }),
        ...(direccion !== undefined && { direccion }),
        ...(servicioNombre !== undefined && { servicioNombre }),
        ...(precio !== undefined && { precio: precio === '' || precio === null ? null : Number(precio) }),
        ...(estadoPago !== undefined && { estadoPago }),
        ...(estadoTour !== undefined && { estadoTour }),
        ...(notas !== undefined && { notas }),
        ...(categoria !== undefined && { categoria }),
        ...(empresa !== undefined && { empresa }),
        ...(enlaceTour !== undefined && { enlaceTour }),
      },
    })

    if (reserva.empresa && reserva.categoria) {
      await prisma.clienteEmpresa.upsert({
        where: { nombre_categoria: { nombre: reserva.empresa, categoria: reserva.categoria } },
        update: {},
        create: { nombre: reserva.empresa, categoria: reserva.categoria },
      })
    }

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
