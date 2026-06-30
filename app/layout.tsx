import type { Metadata } from 'next'
import './globals.css'
import SiteShell from '@/components/SiteShell'

export const metadata: Metadata = {
  title: {
    default: '360TourX | Tours Virtuales 360° en Madrid',
    template: '%s | 360TourX',
  },
  description:
    'Expertos en tours virtuales 360° para inmuebles, hoteles, restaurantes y negocios en Madrid. Fotografía profesional y mapeo 3D. Reserva tu tour desde 290€.',
  keywords: [
    'tour virtual',
    'tour virtual 360',
    'recorrido virtual',
    'fotografía 360',
    'tour virtual Madrid',
    'tour virtual inmobiliaria',
    'virtual tour Spain',
  ],
  authors: [{ name: '360TourX' }],
  creator: '360TourX',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://www.360tourx.com',
    siteName: '360TourX',
    title: '360TourX | Tours Virtuales 360° en Madrid',
    description:
      'Expertos en tours virtuales 360° para inmuebles, hoteles, restaurantes y negocios en Madrid.',
    images: [
      {
        url: 'https://static.wixstatic.com/media/9f78d7_6e35d731153b415da07dc8d0f96e10f7~mv2.jpeg',
        width: 1200,
        height: 630,
        alt: '360TourX Tours Virtuales',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '360TourX | Tours Virtuales 360° en Madrid',
    description: 'Expertos en tours virtuales 360° para inmuebles y negocios en Madrid.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}
