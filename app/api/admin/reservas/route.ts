import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Siempre leer datos frescos de la BD (no cachear en build)
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const reservas = await prisma.reserva.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(reservas)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error fetching reservas' }, { status: 500 })
  }
}

// Crea una entrada de tour a mano desde /admin/tours, para tours que no pasaron
// por el flujo de reserva online (p. ej. hechos antes de tener la web, o pactados aparte).
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nombre, email, telefono, direccion, servicioNombre, precio, categoria, empresa, enlaceTour, notas } = body

    if (!nombre || !categoria) {
      return NextResponse.json({ error: 'Faltan datos obligatorios (nombre y categoría)' }, { status: 400 })
    }

    const reserva = await prisma.reserva.create({
      data: {
        nombre,
        email: email || '',
        telefono: telefono || null,
        direccion: direccion || '',
        servicio: 'manual',
        servicioNombre: servicioNombre || 'Tour añadido manualmente',
        precio: precio ? Number(precio) : null,
        estadoPago: 'completado',
        estadoTour: 'entregado',
        categoria,
        empresa: empresa || null,
        enlaceTour: enlaceTour || null,
        notas: notas || null,
        creadaManual: true,
      },
    })

    if (empresa) {
      await prisma.clienteEmpresa.upsert({
        where: { nombre_categoria: { nombre: empresa, categoria } },
        update: {},
        create: { nombre: empresa, categoria },
      })
    }

    return NextResponse.json(reserva)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error creando el tour' }, { status: 500 })
  }
}
