'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

// Rutas que NO usan el Navbar/Footer principal
// /admin tiene su propio menú lateral: la barra pública se le montaba encima.
const STANDALONE_ROUTES = ['/landing', '/admin']

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isStandalone = STANDALONE_ROUTES.some((r) => pathname.startsWith(r))

  if (isStandalone) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
