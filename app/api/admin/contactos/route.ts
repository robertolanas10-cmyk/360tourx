import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const contactos = await prisma.contacto.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(contactos)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error fetching contactos' }, { status: 500 })
  }
}
