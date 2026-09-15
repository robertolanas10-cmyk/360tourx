import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { enviarEmail, escaparHtml } from '@/lib/email'
import {
  FRANJAS,
  HOSTING_AGENCIA_ANUAL,
  MAX_INMUEBLES,
  formatoEuros,
  formatoEurosCentimos,
  getTramo,
  precioInmueble,
} from '@/lib/tarifas-agencia'

interface InmuebleEntrada {
  direccion?: unknown
  metros?: unknown
  disponibleDesde?: unknown
  franja?: unknown
}

const texto = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const fechaEs = (d: Date) => d.toISOString().slice(0, 10).split('-').reverse().join('/')
const nombreFranja = (id: string) => FRANJAS.find((f) => f.id === id)?.nombre ?? id

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Datos no válidos' }, { status: 400 })
  }

  // Campo trampa invisible: solo lo rellenan los bots. Se responde bien pero no se guarda nada.
  if (texto(body.web, 200)) return NextResponse.json({ ok: true })

  const agencia = texto(body.agencia, 120)
  const contacto = texto(body.contacto, 120)
  const email = texto(body.email, 200)
  const telefono = texto(body.telefono, 40)
  const notas = texto(body.notas, 2000)
  const tramo = getTramo(texto(body.tramo, 20))
  const conHosting = body.conHosting === true

  if (!agencia || !contacto || !email || !telefono) {
    return NextResponse.json({ error: 'Faltan los datos de la agencia' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'El email no es válido' }, { status: 400 })
  }
  if (telefono.replace(/\D/g, '').length < 9) {
    return NextResponse.json({ error: 'El teléfono no es válido' }, { status: 400 })
  }
  if (!tramo) {
    return NextResponse.json({ error: 'Elige un volumen mensual' }, { status: 400 })
  }
  if (body.aceptaTerminos !== true) {
    return NextResponse.json({ error: 'Hay que aceptar la política de privacidad' }, { status: 400 })
  }

  const entrada = Array.isArray(body.inmuebles) ? (body.inmuebles as InmuebleEntrada[]) : []
  if (entrada.length < 1 || entrada.length > MAX_INMUEBLES) {
    return NextResponse.json(
      { error: `Añade entre 1 y ${MAX_INMUEBLES} inmuebles` },
      { status: 400 }
    )
  }

  // Margen de un día para no rechazar "hoy" por diferencias de zona horaria.
  const ayer = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const inmuebles = []
  for (let i = 0; i < entrada.length; i++) {
    const inm = entrada[i]
    const direccion = texto(inm.direccion, 300)
    const metros = Number(inm.metros)
    const disponibleDesde = texto(inm.disponibleDesde, 10)
    const franja = texto(inm.franja, 20)
    const fila = `Inmueble ${i + 1}`

    if (!direccion) return NextResponse.json({ error: `${fila}: falta la dirección` }, { status: 400 })
    if (!Number.isInteger(metros) || metros < 10 || metros > 100000) {
      return NextResponse.json({ error: `${fila}: los m² no son válidos` }, { status: 400 })
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(disponibleDesde) || isNaN(Date.parse(disponibleDesde)) || disponibleDesde < ayer) {
      return NextResponse.json({ error: `${fila}: la fecha no es válida` }, { status: 400 })
    }
    if (!FRANJAS.some((f) => f.id === franja)) {
      return NextResponse.json({ error: `${fila}: elige una franja horaria` }, { status: 400 })
    }

    inmuebles.push({
      direccion,
      metros,
      disponibleDesde: new Date(`${disponibleDesde}T00:00:00Z`),
      franja,
      precioEstimado: precioInmueble(tramo, metros),
    })
  }

  const importeEstimado =
    tramo.precio === null ? null : inmuebles.reduce((suma, inm) => suma + (inm.precioEstimado ?? 0), 0)

  const solicitud = await prisma.solicitudAgencia.create({
    data: {
      agencia,
      contacto,
      email,
      telefono,
      tramo: tramo.id,
      notas: notas || null,
      conHosting,
      importeEstimado,
      inmuebles: { create: inmuebles },
    },
  })

  // Emails: si fallan, la solicitud ya está guardada y se ve en /admin/solicitudes.
  let emailEnviado = false
  try {
    const sitio = process.env.NEXT_PUBLIC_SITE_URL || 'https://360tourx.com'
    const estimado =
      importeEstimado === null ? 'A medida (presupuesto aparte)' : `${formatoEuros(importeEstimado)} + IVA`
    const filas = inmuebles
      .map(
        (inm, i) => `<tr>
          <td style="padding:6px 10px;border-bottom:1px solid #eee">${i + 1}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #eee">${escaparHtml(inm.direccion)}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #eee">${inm.metros} m²</td>
          <td style="padding:6px 10px;border-bottom:1px solid #eee">${fechaEs(inm.disponibleDesde)} · ${nombreFranja(inm.franja)}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #eee">${inm.precioEstimado === null ? '—' : formatoEuros(inm.precioEstimado)}</td>
        </tr>`
      )
      .join('')
    const hosting = conHosting
      ? `Sí: ${formatoEurosCentimos(HOSTING_AGENCIA_ANUAL)} al año por todos los tours`
      : 'No'
    const tabla = `<table style="border-collapse:collapse;font-size:14px">
      <tr style="text-align:left;background:#f5f3f8">
        <th style="padding:6px 10px">#</th><th style="padding:6px 10px">Dirección</th>
        <th style="padding:6px 10px">Tamaño</th><th style="padding:6px 10px">Disponible desde</th>
        <th style="padding:6px 10px">Estimado</th>
      </tr>${filas}</table>`

    emailEnviado = await enviarEmail({
      para: process.env.EMAIL_TO || 'hola@360tourx.com',
      responderA: email,
      asunto: `Solicitud de agencia #${solicitud.id}: ${agencia} · ${inmuebles.length} inmueble${inmuebles.length === 1 ? '' : 's'}`,
      html: `<h2>Nueva solicitud de ${escaparHtml(agencia)}</h2>
        <p><strong>Contacto:</strong> ${escaparHtml(contacto)} · ${escaparHtml(telefono)} · ${escaparHtml(email)}<br>
        <strong>Tramo declarado:</strong> ${tramo.nombre} (${tramo.rango})<br>
        <strong>Importe estimado:</strong> ${estimado}<br>
        <strong>Alojamiento de los tours:</strong> ${hosting}</p>
        ${tabla}
        ${notas ? `<p><strong>Notas:</strong><br>${escaparHtml(notas).replace(/\n/g, '<br>')}</p>` : ''}
        <p><a href="${sitio}/admin/solicitudes">Ver en el panel</a></p>`,
    })

    await enviarEmail({
      para: email,
      asunto: 'Hemos recibido tu solicitud · 360TourX',
      html: `<p>Hola ${escaparHtml(contacto)},</p>
        <p>Hemos recibido la solicitud de <strong>${escaparHtml(agencia)}</strong> para
        ${inmuebles.length} inmueble${inmuebles.length === 1 ? '' : 's'}. Te contactamos en menos de 24 horas
        para confirmar el presupuesto y proponerte las visitas.</p>
        ${tabla}
        <p><strong>Importe estimado:</strong> ${estimado}. Es una estimación según tu tramo y los m²
        indicados; te confirmamos el presupuesto definitivo.</p>
        ${conHosting ? `<p><strong>Alojamiento:</strong> has pedido alojar todos tus tours en nuestro servidor por ${formatoEurosCentimos(HOSTING_AGENCIA_ANUAL)} al año, una sola cuota por todos, no por cada tour.</p>` : ''}
        <p>Un saludo,<br>El equipo de 360TourX · +34 644 85 73 26</p>`,
    })
  } catch (err) {
    console.error(`Solicitud #${solicitud.id} guardada, pero falló el envío de email:`, err)
  }

  return NextResponse.json({ ok: true, id: solicitud.id, emailEnviado })
}
