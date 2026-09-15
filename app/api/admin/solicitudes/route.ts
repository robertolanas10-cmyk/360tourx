import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Siempre leer datos frescos de la BD (no cachear en build)
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const solicitudes = await prisma.solicitudAgencia.findMany({
      orderBy: { createdAt: 'desc' },
      include: { inmuebles: { orderBy: { id: 'asc' } } },
    })
    return NextResponse.json(solicitudes)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error fetching solicitudes' }, { status: 500 })
  }
}
