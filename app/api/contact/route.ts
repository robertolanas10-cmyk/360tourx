import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nombre, apellido, email, telefono, empresa, posicion, mensaje, aceptaTerminos, tipo } = body

    if (!nombre || !email || !aceptaTerminos) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Guardar en base de datos
    await prisma.contacto.create({
      data: {
        nombre,
        apellido: apellido || null,
        email,
        telefono: telefono || null,
        empresa: empresa || null,
        posicion: posicion || null,
        mensaje: mensaje || '',
        tipo: tipo || 'contacto',
      },
    })

    // Enviar email (solo si hay credenciales SMTP configuradas)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })

      const mailContent = `
Nuevo mensaje de contacto de 360TourX.com

Nombre: ${nombre} ${apellido || ''}
Email: ${email}
Teléfono: ${telefono || 'No proporcionado'}
${empresa ? `Empresa: ${empresa}` : ''}
${posicion ? `Posición: ${posicion}` : ''}

Mensaje:
${mensaje || 'Sin mensaje'}

---
Enviado desde el formulario de contacto de 360tourx.com
      `.trim()

      await transporter.sendMail({
        from: `"360TourX Web" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO || 'hola@360tourx.com',
        replyTo: email,
        subject: `[360TourX] Nuevo contacto de ${nombre}${empresa ? ` (${empresa})` : ''}`,
        text: mailContent,
      })

      await transporter.sendMail({
        from: `"360TourX" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Hemos recibido tu mensaje — 360TourX',
        text: `
Hola ${nombre},

Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos en menos de 24 horas.

Si necesitas ayuda urgente, puedes llamarnos al +34 644 85 73 26.

Un saludo,
El equipo de 360TourX
Madrid, España
        `.trim(),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact error:', error)
    return NextResponse.json({ error: 'Error processing contact' }, { status: 500 })
  }
}
