import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { esEstadoSolicitud } from '@/lib/solicitud-estados'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const { estado } = await req.json()
    if (!esEstadoSolicitud(estado)) {
      return NextResponse.json({ error: 'Estado no válido' }, { status: 400 })
    }
    const solicitud = await prisma.solicitudAgencia.update({
      where: { id },
      data: { estado },
      include: { inmuebles: { orderBy: { id: 'asc' } } },
    })
    return NextResponse.json(solicitud)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error updating solicitud' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    // Los inmuebles se borran en cascada.
    await prisma.solicitudAgencia.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error deleting solicitud' }, { status: 500 })
  }
}
