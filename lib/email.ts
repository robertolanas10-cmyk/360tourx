import nodemailer from 'nodemailer'

// Envío de emails por SMTP. Si faltan credenciales no envía nada y devuelve false,
// igual que /api/contact: la web sigue funcionando y el dato queda guardado en la BD.
export function emailConfigurado(): boolean {
  return Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS)
}

export async function enviarEmail(opciones: {
  para: string
  asunto: string
  html: string
  responderA?: string
}): Promise<boolean> {
  if (!emailConfigurado()) return false

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.office365.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: false, // STARTTLS en el puerto 587
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  })

  await transporter.sendMail({
    from: `"360TourX" <${process.env.EMAIL_USER}>`,
    to: opciones.para,
    subject: opciones.asunto,
    html: opciones.html,
    ...(opciones.responderA ? { replyTo: opciones.responderA } : {}),
  })
  return true
}

// Escapa texto escrito por el usuario antes de meterlo en el HTML de un email.
export function escaparHtml(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
