# CLAUDE.md — 360TourX

Guía para Claude Code al trabajar en este repositorio. Léela antes de tocar código.

## Qué es

Sitio web de **360TourX**, empresa de **tours virtuales 360°** en Madrid (inmuebles, hoteles,
restaurantes, negocios). Migrado de Wix a Next.js. Incluye web pública, sistema de reservas con
pago, formularios de contacto por email y un **panel de administración** interno.

Todo el producto es en **español** (textos, rutas, nombres de modelos de BD). Mantén ese idioma.
Contacto real del negocio: `hola@360tourx.com` · `+34 644 85 73 26` · Madrid, España.

## Stack

- **Next.js 14.2.5** (App Router) + **TypeScript** (strict)
- **Tailwind CSS** (tema oscuro, marca violeta)
- **Prisma** ORM sobre **MySQL**
- **Stripe** (tarjeta / Apple Pay / Google Pay) + **PayPal** (aún placeholder)
- **Nodemailer** (SMTP) para emails de contacto
- `lucide-react` (iconos), `framer-motion`, `react-hook-form`

## Entorno de trabajo (importante)

- El equipo del usuario es **Windows 11 + PowerShell**. Usa sintaxis de PowerShell por defecto.
- El usuario **no usa git directamente**, usa dos `.bat` en la raíz:
  - `subir-cambios.bat` → `git add . && git commit -m "Actualizacion <fecha>" && git push origin main`
  - `bajar-cambios.bat` → `git pull origin main`
  - Por eso los mensajes de commit del historial son "Actualizacion <fecha hora>".
- Rama principal: `main`. Remoto en GitHub.

## Comandos

```bash
npm run dev      # desarrollo → http://localhost:3000
npm run build    # prisma generate && next build
npm run start    # servir build de producción
npm run lint     # eslint (next lint)
npx prisma migrate dev    # aplicar/crear migraciones (necesita DATABASE_URL)
npx prisma studio         # explorar la BD
```

No hay framework de tests configurado.

## Arquitectura

```
app/
  layout.tsx            # RootLayout + metadata SEO (es_ES). Envuelve todo en <SiteShell>
  page.tsx             # Home
  reserva/             # Flujo de reserva (ver abajo)
    BookingClient.tsx  #   wizard de 3 pasos (client component)
    CheckoutForm.tsx   #   formulario de pago con Stripe Elements
    confirmacion/      #   página post-pago
  landing/             # Landing STANDALONE (sin Navbar/Footer, ver SiteShell)
  precios/ proyectos/ inmobiliarias/ como-funcionamos/
  que-es-un-tour-virtual/ privacidad/ terminos/ reembolso/   # páginas de contenido
  admin/               # Panel interno: dashboard, /admin/reservas, /admin/contactos
  api/
    create-checkout-session/route.ts  # crea Reserva + Stripe PaymentIntent
    contact/route.ts                  # guarda Contacto + envía emails (SMTP)
    admin/reservas/  admin/contactos/ # GET listado + [id] para editar/borrar
components/
  SiteShell.tsx        # decide si mostrar Navbar/Footer (según ruta)
  Navbar.tsx  Footer.tsx  ContactForm.tsx
lib/prisma.ts          # singleton de PrismaClient (evita múltiples conexiones en dev)
prisma/schema.prisma   # modelos Reserva y Contacto (MySQL)
public/                # logo.png, logo.svg, imágenes
```

- Alias de imports: **`@/*` → raíz del proyecto** (ej. `@/lib/prisma`, `@/components/Navbar`).
- `SiteShell` oculta Navbar/Footer en rutas de `STANDALONE_ROUTES` (actualmente `/landing`).

## Convenciones de estilo (usar SIEMPRE)

Hay clases utilitarias propias en [app/globals.css](app/globals.css#L42). **Reutilízalas** en vez de
repetir cadenas largas de Tailwind:

`btn-primary` · `btn-outline` · `btn-ghost` · `card` · `input-field` · `glow` ·
`gradient-text` · `section-title` · `section-subtitle` · `grid-overlay`

- Paleta de marca (en [tailwind.config.ts](tailwind.config.ts)): `brand` = violeta `#7C3AED`.
  En la práctica el código usa mucho `violet-600 / violet-400`. Fondo oscuro base `#0a0a0f`,
  tarjetas `#111118`, bordes `#1e1e2e`.
- Fuente: **Inter**. Tema oscuro en todo el sitio.

## Modelo de datos (Prisma / MySQL)

- **`Reserva`** (`reservas`): datos del cliente + servicio + visita + pago + estado del tour.
  - `servicio`: `'100m2' | '200m2' | '300m2' | '300m2plus'`
  - `estadoPago`: `'pendiente' | 'completado' | 'fallido'`
  - `estadoTour`: `'pendiente' | 'en_proceso' | 'completado' | 'entregado'`
- **`Contacto`** (`contactos`): formularios. `tipo`: `'contacto' | 'presupuesto_plus300' | 'inmobiliaria'`

## Precios (mantener sincronizados en 2 sitios)

| Servicio | Precio |
|---|---|
| Tour hasta 100m² | 290 € |
| Tour hasta 200m² | 390 € |
| Tour hasta 300m² | 490 € |
| Tour +300m² | Presupuesto personalizado (no se paga online) |
| Add-on hosting web | 19,99 €/año |

⚠️ Los precios están **duplicados**: en `services` de
[app/reserva/BookingClient.tsx](app/reserva/BookingClient.tsx#L12) (euros) y en `PRICE_MAP` de
[app/api/create-checkout-session/route.ts](app/api/create-checkout-session/route.ts#L9) (céntimos).
Si cambias uno, cambia el otro. Moneda: **EUR**, precios mostrados "+ IVA".

## Flujo de reserva/pago

1. `BookingClient` (3 pasos: servicio+fecha → datos → pago).
2. Al pagar llama a `POST /api/create-checkout-session`, que **crea la `Reserva` con
   `estadoPago: 'pendiente'`** y un Stripe PaymentIntent, devolviendo `clientSecret`.
3. `CheckoutForm` confirma el pago con Stripe Elements.
4. El caso **+300m²** no paga: envía una solicitud de reunión vía `POST /api/contact`.

## Gotchas / estado real del proyecto

- **⚠️ No hay webhook de Stripe.** Nada marca la reserva como `completado`; el `estadoPago` se
  queda en `pendiente` para siempre. Si trabajas en pagos, probablemente haya que crear
  `app/api/stripe-webhook/route.ts` y actualizar la `Reserva` por `metadata.reservaId`.
- **⚠️ El panel `/admin` no tiene autenticación** (ni las rutas `/api/admin/*`). Cualquiera puede
  entrar. No hay `middleware.ts`. Añadir protección antes de exponer en producción.
- **PayPal es un placeholder**: abre una URL legacy de PayPal en otra pestaña y no registra el pago.
  Falta integrarlo de verdad con `@paypal/react-paypal-js` (ya está instalado).
- Emails y Stripe se **degradan silenciosamente** si faltan credenciales (comprueban `env` antes
  de actuar), así que en local sin claves no fallan pero tampoco envían/cobran.

## Variables de entorno

- `DATABASE_URL` va en **`.env`** (MySQL).
- El resto va en **`.env.local`**: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`,
  (`STRIPE_WEBHOOK_SECRET` cuando exista el webhook), `NEXT_PUBLIC_PAYPAL_CLIENT_ID`,
  `EMAIL_HOST/PORT/USER/PASS/TO`, `NEXT_PUBLIC_SITE_URL`.
- Plantilla en [.env.local.example](.env.local.example). **Nunca** commitear `.env*` ni `*.pem`
  (ya están en `.gitignore`).

## Deploy

- Recomendado **Vercel** (SSL automático). Dominio `www.360tourx.com` (GoDaddy → Vercel).
- Alternativa VPS Ubuntu + Nginx + PM2 con SSL wildcard de Namecheap (`*.360tourx.com`, pensado
  para alojar tours de clientes en subdominios). Detalles completos en [README.md](README.md).

## Tareas pendientes conocidas

Ver [PENDIENTE.md](PENDIENTE.md). Resumen: activar Stripe con claves reales + webhook, formulario
de reunión +300m², integrar PayPal de verdad, configurar SMTP, y proteger el panel admin.
