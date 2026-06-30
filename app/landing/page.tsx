'use client'

import { useState } from 'react'
import './landing.css'

export default function LandingPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormStatus('loading')

    const form = e.currentTarget
    const nombre = (form.querySelector('#nombre') as HTMLInputElement).value
    const empresa = (form.querySelector('#empresa') as HTMLInputElement).value
    const email = (form.querySelector('#email') as HTMLInputElement).value
    const telefono = (form.querySelector('#telefono') as HTMLInputElement).value
    const sector = (form.querySelector('#sector') as HTMLSelectElement).value
    const mensaje = (form.querySelector('#mensaje') as HTMLTextAreaElement).value

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          empresa,
          email,
          telefono,
          mensaje: `Sector: ${sector}\n\n${mensaje}`,
          aceptaTerminos: true,
          tipo: 'landing',
        }),
      })
      if (res.ok) {
        setFormStatus('success')
      } else {
        setFormStatus('error')
      }
    } catch {
      setFormStatus('error')
    }
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

      <div style={{ fontFamily: "'Inter', sans-serif", background: 'var(--black)', color: 'var(--white)', minHeight: '100vh' }}>

        {/* NAV */}
        <nav className="lp-nav">
          <a href="#" className="lp-nav-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="360TourX" width={40} height={40} />
            <span className="lp-nav-logo-text">360Tour<span>X</span></span>
          </a>
          <a href="#contacto" className="lp-nav-cta">Agendar Reunión Virtual →</a>
        </nav>

        {/* HERO */}
        <section className="lp-hero">
          <div className="lp-hero-bg" />
          <div className="lp-hero-grid" />
          <div className="lp-hero-content">
            <div className="lp-badge">Tours Virtuales 360° · Madrid, España</div>
            <h1 className="lp-h1">
              Haz que tus clientes<br />
              <span className="lp-gradient-text">vivan tu espacio</span><br />
              antes de visitarlo
            </h1>
            <p className="lp-hero-p">
              Recorridos virtuales interactivos e inmersivos que multiplican el interés,
              reducen visitas innecesarias y cierran más ventas.
            </p>
            <div className="lp-actions">
              <a href="#contacto" className="lp-btn-primary">Quiero mi Tour Virtual →</a>
              <a href="https://www.360tourx.com/projects-7" target="_blank" rel="noopener noreferrer" className="lp-btn-secondary">Ver Proyectos ▶</a>
            </div>
            <div className="lp-stats">
              <div style={{ textAlign: 'center' }}>
                <div className="lp-stat-num">+300%</div>
                <div className="lp-stat-label">Más interacción online</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="lp-stat-num">48h</div>
                <div className="lp-stat-label">Entrega en 48 horas</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="lp-stat-num">100%</div>
                <div className="lp-stat-label">Compatible con Google Maps</div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST */}
        <div className="lp-trust">
          <div className="lp-trust-inner">
            <p className="lp-trust-label">Sectores que confían en nosotros</p>
            <div className="lp-trust-sectors">
              {['🏠 Inmobiliarias','🏨 Hoteles','🍽️ Restaurantes','🏋️ Gimnasios','🏪 Comercios','🏫 Colegios','🏥 Clínicas','🏗️ Obra nueva'].map(s => (
                <div key={s} className="lp-chip">{s}</div>
              ))}
            </div>
          </div>
        </div>

        {/* BENEFITS */}
        <section className="lp-section lp-benefits">
          <div className="lp-container">
            <div className="lp-benefits-header">
              <div className="lp-section-label">¿Por qué 360TourX?</div>
              <h2 className="lp-section-title">Todo lo que tu negocio necesita<br />para destacar online</h2>
              <p className="lp-section-sub">Un tour virtual no es un lujo, es la herramienta de ventas más efectiva del mercado digital actual.</p>
            </div>
            <div className="lp-benefits-grid">
              {[
                { icon: '🔍', title: 'Más visibilidad en Google', desc: 'Tu negocio aparece en Google Maps con un tour 360° interactivo. Los clientes exploran tu espacio directamente desde los resultados de búsqueda.' },
                { icon: '⏱️', title: 'Ahorra tiempo y visitas', desc: 'Filtra a los clientes realmente interesados. Solo visitan en persona quienes ya han recorrido virtualmente el espacio y están convencidos.' },
                { icon: '📱', title: 'Disponible 24/7', desc: 'Tu espacio está abierto para los clientes a cualquier hora, desde cualquier dispositivo: móvil, tablet u ordenador.' },
                { icon: '🎯', title: 'Mayor conversión', desc: 'Los tours virtuales aumentan el tiempo que los usuarios pasan en tu ficha de Google y generan más contactos que las fotos estáticas.' },
                { icon: '🗺️', title: 'Integración con Google Maps', desc: 'El tour queda integrado directamente en tu ficha de Google Business, visible para miles de personas que buscan negocios como el tuyo.' },
                { icon: '🚀', title: 'Entrega exprés', desc: 'Tu tour virtual listo en 48 horas desde la sesión fotográfica. Calidad profesional sin tiempos de espera interminables.' },
              ].map(b => (
                <div key={b.title} className="lp-benefit-card">
                  <div className="lp-benefit-icon">{b.icon}</div>
                  <h3>{b.title}</h3>
                  <p>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="lp-section lp-how">
          <div className="lp-container">
            <div className="lp-how-inner">
              <div>
                <div className="lp-section-label">Proceso</div>
                <h2 className="lp-section-title">Tan fácil como<br />1, 2, 3</h2>
                <p className="lp-section-sub" style={{ marginBottom: 48 }}>Nos encargamos de todo. Tú solo tienes que abrir la puerta.</p>
                <div className="lp-how-steps">
                  {[
                    { n: '1', title: 'Contacta y reserva', desc: 'Rellena el formulario o llámanos. Te damos una cita en el horario que mejor te convenga.' },
                    { n: '2', title: 'Sesión fotográfica 360°', desc: 'Nuestro equipo va a tu espacio con cámaras profesionales y captura cada rincón en alta resolución.' },
                    { n: '3', title: 'Publicación en 48h', desc: 'Procesamos el tour y lo publicamos en Google Maps y te entregamos el enlace para compartir donde quieras.' },
                  ].map(s => (
                    <div key={s.n} className="lp-how-step">
                      <div className="lp-step-num">{s.n}</div>
                      <div className="lp-step-content"><h3>{s.title}</h3><p>{s.desc}</p></div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', height: 460, position: 'relative' }}>
                <iframe
                  src="https://copatlifemadrid.360tourx.com"
                  title="Tour Virtual 360° — Copatlife Madrid"
                  style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                  allowFullScreen
                  allow="fullscreen; gyroscope; accelerometer"
                />
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="lp-section lp-pricing">
          <div className="lp-container">
            <div className="lp-pricing-header">
              <div className="lp-section-label">Tarifas claras</div>
              <h2 className="lp-section-title">Sin letra pequeña.<br />Sin sorpresas.</h2>
              <p className="lp-section-sub">Elige el plan que se adapta al tamaño de tu espacio. Precio único, sin cuotas mensuales.</p>
            </div>
            <div className="lp-pricing-grid">
              <div className="lp-price-card">
                <h3>Hasta 100 m²</h3>
                <div className="lp-price-amount">290<span>€</span></div>
                <p className="lp-price-desc">Perfecto para locales pequeños, apartamentos y pisos</p>
                <ul className="lp-price-features">
                  <li>Tour virtual 360° interactivo</li><li>Publicación en Google Maps</li><li>Enlace para compartir</li><li>Entrega en 48h</li>
                </ul>
              </div>
              <div className="lp-price-card featured">
                <div className="lp-price-badge">MÁS POPULAR</div>
                <h3>Hasta 200 m²</h3>
                <div className="lp-price-amount">390<span>€</span></div>
                <p className="lp-price-desc">Ideal para restaurantes, tiendas y viviendas medianas</p>
                <ul className="lp-price-features">
                  <li>Tour virtual 360° interactivo</li><li>Publicación en Google Maps</li><li>Enlace para compartir</li><li>Entrega en 72h</li><li>Más puntos de captura</li>
                </ul>
              </div>
              <div className="lp-price-card">
                <h3>Hasta 300 m²</h3>
                <div className="lp-price-amount">490<span>€</span></div>
                <p className="lp-price-desc">Hoteles, gimnasios, clínicas y grandes inmuebles</p>
                <ul className="lp-price-features">
                  <li>Tour virtual 360° interactivo</li><li>Publicación en Google Maps</li><li>Enlace para compartir</li><li>Entrega en 72h</li><li>Cobertura completa</li>
                </ul>
              </div>
              <div className="lp-price-card">
                <h3>Más de 300 m²</h3>
                <div className="lp-price-amount" style={{ fontSize: 26, lineHeight: 1.4 }}>Tarifa<br />personalizada</div>
                <p className="lp-price-desc">Proyectos especiales: naves, resorts, campus, edificios</p>
                <ul className="lp-price-features">
                  <li>Presupuesto a medida</li><li>Gestión de proyecto dedicada</li><li>Múltiples sesiones si necesario</li><li>SLA prioritario</li>
                </ul>
              </div>
            </div>
            <p className="lp-pricing-note">¿Necesitas también página web? <a href="#contacto">Consulta nuestros planes combinados →</a></p>
          </div>
        </section>

        {/* SECTORS */}
        <section className="lp-section lp-sectors">
          <div className="lp-container">
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div className="lp-section-label">Sectores</div>
              <h2 className="lp-section-title" style={{ textAlign: 'center' }}>Para cualquier tipo de negocio</h2>
            </div>
            <div className="lp-sectors-grid">
              {[
                { icon: '🏠', title: 'Inmobiliarias', desc: 'Vende y alquila más rápido con visitas virtuales' },
                { icon: '🏨', title: 'Hoteles', desc: 'Muestra tus habitaciones y zonas comunes' },
                { icon: '🍽️', title: 'Restaurantes', desc: 'Enamora a tus clientes antes de reservar' },
                { icon: '🏋️', title: 'Gimnasios', desc: 'Muestra tus instalaciones y convierte más socios' },
                { icon: '🏥', title: 'Clínicas', desc: 'Transmite confianza y profesionalidad' },
                { icon: '🏪', title: 'Comercios', desc: 'Lleva el escaparate a todo el mundo' },
              ].map(s => (
                <div key={s.title} className="lp-sector-card">
                  <div className="lp-sector-icon">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="lp-section lp-testimonials">
          <div className="lp-container">
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div className="lp-section-label">Testimonios</div>
              <h2 className="lp-section-title" style={{ textAlign: 'center' }}>Lo que dicen nuestros clientes</h2>
            </div>
            <div className="lp-testimonials-grid">
              {[
                { initial: 'M', name: 'María González', role: 'Directora, Inmobiliaria Premium Madrid', text: '"Desde que publicamos el tour virtual en Google Maps, hemos triplicado las consultas de pisos. Los clientes llegan mucho más preparados y el proceso de venta es mucho más rápido."' },
                { initial: 'C', name: 'Carlos Martín', role: 'Propietario, Restaurante El Rincón', text: '"Nuestro restaurante apareció en las búsquedas de Google con el tour y notamos un aumento claro en las reservas. La calidad del trabajo es impresionante y el precio muy razonable."' },
                { initial: 'L', name: 'Laura Sánchez', role: 'Gerente, Clínica Estética Lumina', text: '"El proceso fue muy sencillo. Vinieron a las 10 de la mañana y dos días después ya teníamos el tour publicado. Profesionales, rápidos y el resultado es espectacular."' },
              ].map(t => (
                <div key={t.name} className="lp-testimonial-card">
                  <div className="lp-stars">★★★★★</div>
                  <p className="lp-testimonial-text">{t.text}</p>
                  <div className="lp-testimonial-author">
                    <div className="lp-avatar">{t.initial}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray)' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LEAD FORM */}
        <section className="lp-form-section" id="contacto">
          <div className="lp-form-wrapper">
            {formStatus === 'success' ? (
              <div className="lp-success">
                <div className="lp-success-icon">🎉</div>
                <h3>¡Solicitud enviada!</h3>
                <p>Hemos recibido tu mensaje. Te contactaremos en menos de 24 horas para agendar tu reunión virtual.</p>
              </div>
            ) : (
              <>
                <div className="lp-form-header">
                  <div className="lp-section-label" style={{ display: 'block', textAlign: 'center' }}>100% sin compromiso</div>
                  <h2>Agenda una reunión virtual<br />y te lo explicamos todo</h2>
                  <p>Cuéntanos tu proyecto y nos ponemos en contacto para agendar una videollamada gratuita contigo.</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="lp-form-row">
                    <div className="lp-form-group">
                      <label htmlFor="nombre">Nombre *</label>
                      <input type="text" id="nombre" name="nombre" placeholder="Tu nombre" required />
                    </div>
                    <div className="lp-form-group">
                      <label htmlFor="empresa">Empresa / Negocio</label>
                      <input type="text" id="empresa" name="empresa" placeholder="Nombre de tu negocio" />
                    </div>
                  </div>
                  <div className="lp-form-row">
                    <div className="lp-form-group">
                      <label htmlFor="email">Email *</label>
                      <input type="email" id="email" name="email" placeholder="tu@email.com" required />
                    </div>
                    <div className="lp-form-group">
                      <label htmlFor="telefono">Teléfono</label>
                      <input type="tel" id="telefono" name="telefono" placeholder="+34 6XX XXX XXX" />
                    </div>
                  </div>
                  <div className="lp-form-group">
                    <label htmlFor="sector">Sector *</label>
                    <select id="sector" name="sector" required defaultValue="">
                      <option value="" disabled>Selecciona tu sector</option>
                      <option value="inmobiliaria">Inmobiliaria / Agencia</option>
                      <option value="hotel">Hotel / Alojamiento</option>
                      <option value="restaurante">Restaurante / Bar / Cafetería</option>
                      <option value="gimnasio">Gimnasio / Centro deportivo</option>
                      <option value="clinica">Clínica / Centro de salud</option>
                      <option value="comercio">Comercio / Tienda</option>
                      <option value="educacion">Colegio / Academia</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div className="lp-form-group">
                    <label htmlFor="mensaje">¿Qué necesitas? (opcional)</label>
                    <textarea id="mensaje" name="mensaje" placeholder="Cuéntanos sobre tu espacio, tamaño aproximado, cualquier pregunta..." />
                  </div>
                  {formStatus === 'error' && (
                    <p style={{ color: '#f87171', fontSize: 14, marginBottom: 12 }}>
                      Error al enviar. Inténtalo de nuevo o llámanos al +34 644 85 73 26.
                    </p>
                  )}
                  <button
                    type="submit"
                    className="lp-btn-primary lp-form-submit"
                    disabled={formStatus === 'loading'}
                    style={{ opacity: formStatus === 'loading' ? 0.7 : 1 }}
                  >
                    {formStatus === 'loading' ? 'Enviando...' : 'Agendar reunión virtual gratis →'}
                  </button>
                  <p className="lp-form-privacy">
                    Al enviar aceptas nuestra <a href="/privacidad">Política de Privacidad</a>. No spam, solo te contactaremos para responder tu consulta.
                  </p>
                </form>
              </>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="lp-footer">
          <div className="lp-footer-inner">
            <div className="lp-footer-brand">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="360TourX" width={36} height={36} />
                <span className="lp-nav-logo-text">360Tour<span>X</span></span>
              </div>
              <p>Expertos en recorridos virtuales 360° interactivos para negocios de todos los sectores. Madrid, España.</p>
              <div className="lp-footer-contact">
                <a href="tel:+34644857326">📞 +34 644 85 73 26</a>
                <a href="mailto:hola@360tourx.com">✉️ hola@360tourx.com</a>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--gray)' }}>📍 Madrid, España</span>
              </div>
            </div>
            <div className="lp-footer-col">
              <h4>Servicios</h4>
              <ul>
                <li><a href="/reserva?servicio=100m2">Tour hasta 100 m²</a></li>
                <li><a href="/reserva?servicio=200m2">Tour hasta 200 m²</a></li>
                <li><a href="/reserva?servicio=300m2">Tour hasta 300 m²</a></li>
                <li><a href="/precios">Planes y precios</a></li>
                <li><a href="/inmobiliarias">Para inmobiliarias</a></li>
              </ul>
            </div>
            <div className="lp-footer-col">
              <h4>Empresa</h4>
              <ul>
                <li><a href="/que-es-un-tour-virtual">¿Qué es un tour virtual?</a></li>
                <li><a href="/proyectos">Proyectos</a></li>
                <li><a href="/como-funcionamos">Cómo funcionamos</a></li>
                <li><a href="#contacto">Contacto</a></li>
                <li><a href="/privacidad">Privacidad</a></li>
              </ul>
            </div>
          </div>
          <div className="lp-footer-bottom">
            <p>© 2026 360TourX · Todos los derechos reservados</p>
            <p>
              <a href="/terminos">Términos</a> ·{' '}
              <a href="/privacidad">Privacidad</a> ·{' '}
              <a href="/reembolso">Reembolsos</a>
            </p>
          </div>
        </footer>

        {/* FLOATING WHATSAPP */}
        <div className="lp-float-cta">
          <a href="https://wa.me/34644857326?text=Hola,%20me%20interesa%20un%20tour%20virtual%20para%20mi%20negocio" target="_blank" rel="noopener noreferrer" className="lp-float-btn whatsapp">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
        </div>

      </div>
    </>
  )
}
