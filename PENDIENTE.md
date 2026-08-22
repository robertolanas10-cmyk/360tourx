# Pendiente — sesiones siguientes

## Objetivo: sitio terminado en 7 días

---

### 🔴 Prioritario

1. **Logotipar la web**
   - Guardar el logo PNG en `public/logo.png`
   - Actualizar Navbar y Footer para usar la imagen real en vez del placeholder de texto
   - Ajustar tamaño y proporción

2. ~~**Conectar pagos Stripe**~~ ✅ HECHO (probado en local con claves test + webhook)
   - Claves test en `.env.local`, pagos confirmados vía webhook (reserva → `completado`).
   - **Pendiente para producción:** poner claves `live`, crear el webhook en el Dashboard de
     Stripe apuntando a `https://www.360tourx.com/api/stripe-webhook` y meter su `whsec_` en el
     hosting. Opcional: activar Apple Pay / Google Pay y verificar dominio.

3. **Formulario de reunión para +300m²**
   - Al pulsar "Solicitar presupuesto" en el plan +300m², mostrar un formulario dedicado
   - Campos: nombre, email, teléfono, dirección del espacio, descripción, fecha preferida
   - Enviar email a hola@360tourx.com con los datos
   - Opción: integrar Calendly para agendar directamente

---

### 🟡 Secundario

4. **Completar integración PayPal**
   - Registrar app en https://developer.paypal.com
   - Copiar Client ID a `.env.local`
   - Reemplazar el botón placeholder por `<PayPalButtons>` real de @paypal/react-paypal-js

5. **Configurar email SMTP**
   - Configurar `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS` en `.env.local`
   - Probar formularios de contacto e inmobiliarias

6. **Páginas legales**
   - Crear `/privacidad`, `/terminos`, `/reembolso` con el contenido real

7. **Redes sociales**
   - Actualizar links de Instagram, Facebook y TikTok en el Footer con los perfiles reales

---

### ✅ Hecho
- Estructura completa Next.js 14
- Diseño con colores morados
- 7 páginas completas
- Sistema de reservas en 3 pasos
- Integración Stripe (falta activar con claves reales)
- 3 casos de éxito reales (A Locos, Delphina, Copatlife)
- Responsive mobile
