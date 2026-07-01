import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
