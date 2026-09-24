import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const clientes = await prisma.clienteEmpresa.findMany({
      orderBy: { nombre: 'asc' },
    })
    return NextResponse.json(clientes)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error fetching clientes' }, { status: 500 })
  }
}

// Crea (o reactiva) un cliente/empresa vacío, sin ningún tour todavía.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nombre, categoria } = body

    if (!nombre || !categoria) {
      return NextResponse.json({ error: 'Faltan datos obligatorios (nombre y categoría)' }, { status: 400 })
    }

    const cliente = await prisma.clienteEmpresa.upsert({
      where: { nombre_categoria: { nombre, categoria } },
      update: {},
      create: { nombre, categoria },
    })

    return NextResponse.json(cliente)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error creando el cliente' }, { status: 500 })
  }
}
