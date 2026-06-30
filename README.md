# 360TourX — Sitio Web en Next.js 14

Sitio web completo para 360TourX, migrado de Wix a Next.js 14 con sistema de reservas y pagos integrado.

## Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Estilos**: Tailwind CSS
- **Pagos**: Stripe (tarjeta, Apple Pay, Google Pay) + PayPal
- **Email**: Nodemailer (SMTP)
- **Deploy**: Vercel (recomendado) o VPS con Nginx

---

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# → Edita .env.local con tus credenciales reales

# Servidor de desarrollo
npm run dev
```

Abre http://localhost:3000

---

## Variables de entorno (.env.local)

```
# Stripe — obtén las claves en dashboard.stripe.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# PayPal — obtén el Client ID en developer.paypal.com
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...

# Email SMTP para formularios de contacto
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=hola@360tourx.com
EMAIL_PASS=tu_contraseña_de_aplicacion

# URL del sitio
NEXT_PUBLIC_SITE_URL=https://www.360tourx.com
```

---

## Configuración de Stripe

1. Crea cuenta en https://dashboard.stripe.com
2. Activa los métodos de pago: **Tarjetas, Apple Pay, Google Pay**
3. Copia las claves (pk_live_... y sk_live_...) a `.env.local`
4. Para Apple Pay, necesitas verificar el dominio en Stripe Dashboard → Settings → Payment Methods → Apple Pay
5. Los precios en `app/api/create-checkout-session/route.ts` ya están configurados:
   - 100m²: 290€
   - 200m²: 390€
   - 300m²: 490€
   - Web addon: 19,99€/año

---

## Páginas del sitio

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio — Hero, servicios, about, CTA |
| `/reserva` | Sistema de reserva con pago integrado |
| `/que-es-un-tour-virtual` | Página informativa |
| `/como-funcionamos` | Proceso paso a paso |
| `/proyectos` | Portfolio de tours |
| `/precios` | Planes y precios |
| `/inmobiliarias` | Página para agencias |

---

## Deploy en Vercel (recomendado)

```bash
npm install -g vercel
vercel --prod
```

O conecta tu repositorio GitHub en vercel.com para deploy automático.

### Apuntar dominio de GoDaddy a Vercel

1. En Vercel Dashboard → tu proyecto → Settings → Domains → Add `360tourx.com` y `www.360tourx.com`
2. En GoDaddy → DNS Manager:
   - Registro A: `@` → IP que te da Vercel
   - Registro CNAME: `www` → `cname.vercel-dns.com`
3. Vercel gestiona el SSL de forma automática para el dominio raíz y www.

---

## SSL Namecheap Wildcard para subdominios

Tu certificado SSL wildcard de Namecheap cubre `*.360tourx.com`. Esto es ideal para alojar
los tours de clientes como subdominios, por ejemplo: `tour-cliente.360tourx.com`.

**Para el sitio principal (www.360tourx.com):**
- Si usas Vercel, el SSL lo gestiona Vercel automáticamente.
- Si prefieres usar el wildcard de Namecheap para todo, despliega en un VPS (ver abajo).

**Para los tours en subdominios:**
- Configura en Namecheap: registro CNAME `*` → tu servidor donde alojas los tours.
- El wildcard SSL cubre automáticamente cualquier `*.360tourx.com`.

---

## Deploy en VPS con Nginx + SSL Namecheap (para control total)

Si quieres usar el wildcard SSL de Namecheap para todo, incluyendo `www.360tourx.com`:

### 1. Preparar el servidor (Ubuntu 22.04)

```bash
# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 para mantener la app corriendo
npm install -g pm2

# Clonar y construir el proyecto
git clone tu-repo /var/www/360tourx
cd /var/www/360tourx
npm install
npm run build

# Iniciar con PM2
pm2 start npm --name "360tourx" -- start
pm2 startup
pm2 save
```

### 2. Configurar Nginx

```nginx
# /etc/nginx/sites-available/360tourx
server {
    listen 443 ssl http2;
    server_name 360tourx.com www.360tourx.com;

    # Certificado wildcard de Namecheap
    ssl_certificate /etc/ssl/360tourx/bundle.crt;       # chain file de Namecheap
    ssl_certificate_key /etc/ssl/360tourx/private.key;  # tu clave privada

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name 360tourx.com www.360tourx.com;
    return 301 https://www.360tourx.com$request_uri;
}
```

```bash
sudo ln -s /etc/nginx/sites-available/360tourx /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Instalar certificado Namecheap

1. En Namecheap, descarga el certificado (obtendrás un .zip con archivos .crt y .ca-bundle)
2. Crea el bundle: `cat tu_dominio.crt tu_dominio.ca-bundle > bundle.crt`
3. Copia `bundle.crt` y `private.key` a `/etc/ssl/360tourx/`

---

## Personalización pendiente

- [ ] Reemplazar proyectos de ejemplo en `/proyectos` con tus tours reales
- [ ] Añadir capturas de pantalla de tours reales
- [ ] Actualizar enlaces de redes sociales en Footer.tsx (Instagram, Facebook, TikTok)
- [ ] Configurar Stripe webhook para recibir eventos de pago (Dashboard → Webhooks)
- [ ] Añadir página legal: `/privacidad`, `/terminos`, `/reembolso`
- [ ] Integrar PayPal completamente con @paypal/react-paypal-js (BookingClient.tsx)
- [ ] Añadir Google Analytics / Meta Pixel si lo necesitas

---

## Soporte

Cualquier duda técnica: roberto@tuempresa.com
