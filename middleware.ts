import { NextRequest, NextResponse } from 'next/server'

// Protege el panel de administración y sus rutas de API con autenticación básica.
// Las credenciales se configuran en variables de entorno:
//   ADMIN_USER      (opcional, por defecto "admin")
//   ADMIN_PASSWORD  (obligatoria — sin ella el panel queda cerrado)
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}

const REALM = '360TourX Admin'

export function middleware(req: NextRequest) {
  const expectedUser = process.env.ADMIN_USER || 'admin'
  const expectedPass = process.env.ADMIN_PASSWORD

  // Si no hay contraseña configurada, cerramos por seguridad (mejor cerrado que abierto).
  if (!expectedPass) {
    return new NextResponse(
      'Panel de administración no configurado. Falta la variable ADMIN_PASSWORD.',
      { status: 503 }
    )
  }

  const header = req.headers.get('authorization')
  if (header?.startsWith('Basic ')) {
    try {
      const decoded = atob(header.slice(6))
      const sep = decoded.indexOf(':')
      const user = decoded.slice(0, sep)
      const pass = decoded.slice(sep + 1)
      if (user === expectedUser && pass === expectedPass) {
        return NextResponse.next()
      }
    } catch {
      // credencial mal formada → cae al 401 de abajo
    }
  }

  return new NextResponse('Autenticación requerida.', {
    status: 401,
    headers: { 'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"` },
  })
}
