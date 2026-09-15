'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, CheckCircle, Loader2, Plus, Trash2 } from 'lucide-react'
import {
  FRANJAS,
  MAX_INMUEBLES,
  METROS_INCLUIDOS,
  SUPLEMENTO_CADA_M2,
  SUPLEMENTO_EUROS,
  TRAMOS,
  type FranjaId,
  type TramoId,
  formatoEuros,
  getTramo,
  precioInmueble,
} from '@/lib/tarifas-agencia'

interface Inmueble {
  clave: number
  direccion: string
  metros: string
  disponibleDesde: string
  franja: FranjaId
}

const inmuebleVacio = (clave: number): Inmueble => ({
  clave,
  direccion: '',
  metros: '',
  disponibleDesde: '',
  franja: 'indiferente',
})

// Fecha local de hoy en formato YYYY-MM-DD (para el mínimo del selector de fecha).
function hoyLocal(): string {
  const d = new Date()
  const dos = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`
}

export default function SolicitudClient() {
  const searchParams = useSearchParams()
  const [tramoId, setTramoId] = useState<TramoId>(getTramo(searchParams.get('tramo'))?.id ?? 'start')
  const [agencia, setAgencia] = useState({ agencia: '', contacto: '', telefono: '', email: '' })
  // Clave estable por fila. El contador vive en el componente (no en el módulo) para que el servidor
  // y el navegador generen los mismos id en la primera pintada.
  const siguienteClave = useRef(1)
  const [inmuebles, setInmuebles] = useState<Inmueble[]>(() => [inmuebleVacio(0)])
  const [notas, setNotas] = useState('')
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [web, setWeb] = useState('') // campo trampa anti-spam
  const [hoy, setHoy] = useState('')
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'enviada'>('idle')
  const [error, setError] = useState<string | null>(null)

  // Se calcula en el navegador para no depender de la zona horaria del servidor.
  useEffect(() => setHoy(hoyLocal()), [])

  const tramo = getTramo(tramoId)!
  const precios = inmuebles.map((inm) => {
    const metros = parseInt(inm.metros, 10)
    return Number.isInteger(metros) && metros >= 10 ? precioInmueble(tramo, metros) : null
  })
  const total = precios.reduce<number>((suma, p) => suma + (p ?? 0), 0)
  const todosConPrecio = precios.every((p) => p !== null)

  function actualizarInmueble(clave: number, cambios: Partial<Inmueble>) {
    setInmuebles((prev) => prev.map((inm) => (inm.clave === clave ? { ...inm, ...cambios } : inm)))
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!aceptaTerminos) {
      setError('Para enviar la solicitud tienes que aceptar la política de privacidad.')
      return
    }
    setEstado('enviando')
    try {
      const res = await fetch('/api/solicitud-agencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...agencia,
          tramo: tramoId,
          notas,
          aceptaTerminos,
          web,
          inmuebles: inmuebles.map(({ direccion, metros, disponibleDesde, franja }) => ({
            direccion,
            metros: parseInt(metros, 10),
            disponibleDesde,
            franja,
          })),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'No se pudo enviar la solicitud. Inténtalo de nuevo o llámanos.')
        setEstado('idle')
        return
      }
      setEstado('enviada')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setError('No se pudo enviar la solicitud. Revisa tu conexión o llámanos al +34 644 85 73 26.')
      setEstado('idle')
    }
  }

  if (estado === 'enviada') {
    return (
      <div className="max-w-2xl mx-auto px-4 pb-24">
        <div className="card p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={28} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Solicitud enviada</h2>
          <p className="text-slate-400 leading-relaxed mb-2">
            Hemos recibido {inmuebles.length} inmueble{inmuebles.length === 1 ? '' : 's'} de{' '}
            <span className="text-white">{agencia.agencia}</span>.
          </p>
          <p className="text-slate-400 leading-relaxed mb-8">
            Te contactamos en menos de 24 horas para confirmar el presupuesto y proponerte las visitas.
          </p>
          <Link href="/inmobiliarias" className="btn-outline">
            Volver a la página de agencias
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={enviar} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      {/* Campo trampa: invisible para personas, los bots lo rellenan */}
      <input
        type="text"
        name="web"
        value={web}
        onChange={(e) => setWeb(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] w-px h-px opacity-0"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          {/* 1. Agencia */}
          <section className="card p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-6">1. Tu agencia</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { campo: 'agencia', etiqueta: 'Nombre de la agencia', tipo: 'text', ejemplo: 'Inmobiliaria Salamanca' },
                { campo: 'contacto', etiqueta: 'Persona de contacto', tipo: 'text', ejemplo: 'Laura Gómez' },
                { campo: 'telefono', etiqueta: 'Teléfono', tipo: 'tel', ejemplo: '+34 600 000 000' },
                { campo: 'email', etiqueta: 'Email', tipo: 'email', ejemplo: 'laura@inmobiliaria.com' },
              ].map(({ campo, etiqueta, tipo, ejemplo }) => (
                <div key={campo}>
                  <label htmlFor={campo} className="text-sm text-slate-400 mb-1.5 block">
                    {etiqueta} *
                  </label>
                  <input
                    id={campo}
                    type={tipo}
                    required
                    value={agencia[campo as keyof typeof agencia]}
                    onChange={(e) => setAgencia((prev) => ({ ...prev, [campo]: e.target.value }))}
                    className="input-field"
                    placeholder={ejemplo}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* 2. Volumen */}
          <section className="card p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-2">2. ¿Cuántas viviendas prevés al mes?</h2>
            <p className="text-slate-400 text-sm mb-6">
              El primer mes aplicamos este tramo. Después, se calcula con las viviendas que hayamos hecho contigo el
              mes anterior.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TRAMOS.map((t) => {
                const activo = t.id === tramoId
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTramoId(t.id)}
                    aria-pressed={activo}
                    className={`text-left rounded-xl border p-4 transition-all ${
                      activo
                        ? 'border-violet-500/60 bg-violet-600/10'
                        : 'border-[#1e1e2e] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-semibold text-white">{t.nombre}</span>
                      <span className={activo ? 'text-violet-400 font-bold' : 'text-slate-300 font-semibold'}>
                        {t.precio === null ? 'A medida' : `${t.precio} €`}
                      </span>
                    </div>
                    <div className="text-slate-500 text-sm mt-0.5">
                      {t.rango}
                      {t.precio !== null && ' · por vivienda + IVA'}
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          {/* 3. Inmuebles */}
          <section className="card p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-2">3. Inmuebles</h2>
            <p className="text-slate-400 text-sm mb-6">
              Uno por cada vivienda que quieras fotografiar. Te proponemos la cita según su disponibilidad.
            </p>

            <div className="space-y-4">
              {inmuebles.map((inm, i) => (
                <div key={inm.clave} className="rounded-xl border border-[#1e1e2e] bg-[#0a0a0f] p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white font-semibold text-sm">Inmueble {i + 1}</span>
                    <div className="flex items-center gap-4">
                      {precios[i] !== null && (
                        <span className="text-violet-400 text-sm font-semibold">{formatoEuros(precios[i]!)}</span>
                      )}
                      {inmuebles.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setInmuebles((prev) => prev.filter((x) => x.clave !== inm.clave))}
                          className="text-slate-500 hover:text-red-400 transition-colors"
                          aria-label={`Quitar inmueble ${i + 1}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                    <div className="sm:col-span-6">
                      <label htmlFor={`direccion-${inm.clave}`} className="text-sm text-slate-400 mb-1.5 block">
                        Dirección *
                      </label>
                      <input
                        id={`direccion-${inm.clave}`}
                        type="text"
                        required
                        value={inm.direccion}
                        onChange={(e) => actualizarInmueble(inm.clave, { direccion: e.target.value })}
                        className="input-field"
                        placeholder="Calle de Velázquez 25, 3º B, Madrid"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor={`metros-${inm.clave}`} className="text-sm text-slate-400 mb-1.5 block">
                        Superficie (m²) *
                      </label>
                      <input
                        id={`metros-${inm.clave}`}
                        type="number"
                        inputMode="numeric"
                        required
                        min={10}
                        step={1}
                        value={inm.metros}
                        onChange={(e) => actualizarInmueble(inm.clave, { metros: e.target.value })}
                        className="input-field"
                        placeholder="85"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor={`fecha-${inm.clave}`} className="text-sm text-slate-400 mb-1.5 block">
                        Disponible desde *
                      </label>
                      <input
                        id={`fecha-${inm.clave}`}
                        type="date"
                        required
                        min={hoy || undefined}
                        value={inm.disponibleDesde}
                        onChange={(e) => actualizarInmueble(inm.clave, { disponibleDesde: e.target.value })}
                        className="input-field [color-scheme:dark]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-sm text-slate-400 mb-1.5 block">Franja preferida</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {FRANJAS.map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => actualizarInmueble(inm.clave, { franja: f.id })}
                            aria-pressed={inm.franja === f.id}
                            className={`rounded-lg border px-1 py-3 text-xs font-medium transition-all ${
                              inm.franja === f.id
                                ? 'border-violet-500/60 bg-violet-600/10 text-violet-300'
                                : 'border-[#1e1e2e] text-slate-400 hover:text-white'
                            }`}
                          >
                            {f.nombre}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setInmuebles((prev) => [...prev, inmuebleVacio(siguienteClave.current++)])}
              disabled={inmuebles.length >= MAX_INMUEBLES}
              className="btn-ghost mt-4 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
              {inmuebles.length >= MAX_INMUEBLES ? `Máximo ${MAX_INMUEBLES} por solicitud` : 'Añadir otro inmueble'}
            </button>
          </section>

          {/* 4. Notas */}
          <section className="card p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-2">
              4. Notas <span className="text-slate-500 font-normal text-base">(opcional)</span>
            </h2>
            <p className="text-slate-400 text-sm mb-4">
              Llaves, contacto del propietario, zonas que no se deben fotografiar…
            </p>
            <textarea
              rows={4}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              maxLength={2000}
              className="input-field resize-none"
              placeholder="Las llaves están en nuestra oficina de Serrano."
            />
          </section>
        </div>

        {/* Resumen */}
        <aside className="card p-6 lg:sticky lg:top-24 space-y-5">
          <h2 className="font-bold text-white text-lg">Resumen</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Tramo</span>
              <span className="text-white font-medium">{tramo.nombre}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Inmuebles</span>
              <span className="text-white font-medium">{inmuebles.length}</span>
            </div>
          </div>

          <div className="border-t border-[#1e1e2e] pt-4">
            {tramo.precio === null ? (
              <p className="text-slate-300 text-sm leading-relaxed">
                Con más de 50 viviendas al mes te preparamos una tarifa y un calendario de visitas a medida.
              </p>
            ) : (
              <>
                <div className="flex justify-between items-baseline gap-4">
                  <span className="text-white font-semibold">Estimado</span>
                  <span className="text-violet-400 text-2xl font-bold">{formatoEuros(total)}</span>
                </div>
                <p className="text-slate-500 text-xs mt-1 text-right">+ IVA</p>
                {!todosConPrecio && (
                  <p className="text-slate-500 text-xs mt-3">Indica los m² de cada inmueble para completar el cálculo.</p>
                )}
              </>
            )}
          </div>

          <p className="text-slate-500 text-xs leading-relaxed">
            Precios para viviendas de hasta {METROS_INCLUIDOS} m². Por encima se suman {SUPLEMENTO_EUROS} € por cada{' '}
            {SUPLEMENTO_CADA_M2} m² adicionales o fracción. Es una estimación: te confirmamos el presupuesto antes de
            la visita y no pagas nada al enviar la solicitud.
          </p>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)}
              className="mt-0.5 accent-violet-500"
            />
            <span className="text-sm text-slate-400">
              Acepto los{' '}
              <a href="/terminos" className="text-violet-400 hover:underline">
                términos y condiciones
              </a>{' '}
              y la{' '}
              <a href="/privacidad" className="text-violet-400 hover:underline">
                política de privacidad
              </a>
            </span>
          </label>

          {error && (
            <p role="alert" className="text-red-400 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={estado === 'enviando'}
            className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {estado === 'enviando' ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Enviando…
              </>
            ) : (
              <>
                Enviar solicitud
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </aside>
      </div>
    </form>
  )
}
