import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get('authorization')

  if (authHeader?.startsWith('Basic ')) {
    const decoded = atob(authHeader.split(' ')[1])
    const [user, password] = decoded.split(':')

    if (
      user === process.env.ADMIN_USER &&
      password === process.env.ADMIN_PASSWORD &&
      process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.next()
    }
  }

  return new NextResponse('Autenticación requerida', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Panel de administración 360TourX"' },
  })
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
