'use client'

import { useEffect, useState } from 'react'
import { Check, Copy, Link2, Mail, MessageCircle, Pencil, Phone, Trash2 } from 'lucide-react'
import { HostingBadge } from '../badges'
import { ESTADOS_SOLICITUD } from '@/lib/solicitud-estados'
import { FRANJAS, HOSTING_AGENCIA_ANUAL, formatoEuros, formatoEurosCentimos, getTramo } from '@/lib/tarifas-agencia'

interface Inmueble {
  id: number
  direccion: string
  metros: number
  disponibleDesde: string
  franja: string
  precioEstimado: string | null
}

interface Solicitud {
  id: number
  createdAt: string
  agencia: string
  contacto: string
  email: string
  telefono: string
  tramo: string
  notas: string | null
  conHosting: boolean
  importeEstimado: string | null
  estado: string
  importeTours: string | null
  tokenPago: string | null
  estadoPago: string
  pagadaEl: string | null
  stripeSubscriptionId: string | null
  hostingEstado: string | null
  hostingVenceEl: string | null
  inmuebles: Inmueble[]
}

const aRetirar = (s: Solicitud) => s.hostingEstado === 'cancelado' || s.hostingEstado === 'impago'

const FILTROS: { key: string; label: string; incluye: (s: Solicitud) => boolean }[] = [
  { key: 'activas', label: 'Por atender', incluye: (s) => ['nueva', 'presupuestada', 'agendada'].includes(s.estado) },
  { key: 'pendientes', label: 'Pago pendiente', incluye: (s) => s.estadoPago === 'pendiente' },
  { key: 'pagadas', label: 'Pagadas', incluye: (s) => s.estadoPago === 'pagada' },
  { key: 'retirar', label: 'Hosting a retirar', incluye: aRetirar },
  { key: 'todas', label: 'Todas', incluye: () => true },
]

// Fechas guardadas sin hora (o en UTC): se cortan en texto para no correr un día.
const fechaCorta = (iso: string) => iso.slice(0, 10).split('-').reverse().join('/')

function EstadoBadge({ estado }: { estado: string }) {
  const e = ESTADOS_SOLICITUD.find((x) => x.id === estado)
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${e?.estilo ?? 'bg-slate-700 text-slate-400'}`}>
      {e?.nombre ?? estado}
    </span>
  )
}

function PagoBadge({ estadoPago }: { estadoPago: string }) {
  if (estadoPago === 'pagada') {
    return <span className="text-xs px-2 py-0.5 rounded-full border bg-green-500/15 text-green-400 border-green-500/30">Pagada</span>
  }
  if (estadoPago === 'pendiente') {
    return <span className="text-xs px-2 py-0.5 rounded-full border bg-yellow-500/15 text-yellow-400 border-yellow-500/30">Pago pendiente</span>
  }
  return null
}

// Teléfono para wa.me: solo dígitos y, si es un número español de 9 cifras, con el prefijo 34.
function numeroWhatsApp(telefono: string): string {
  const digitos = telefono.replace(/\D/g, '')
  return digitos.length === 9 ? `34${digitos}` : digitos
}

// Bloque de cobro de una solicitud: fijar importe, generar el enlace y compartirlo, o ver lo pagado.
function Cobro({ s, onActualizar }: { s: Solicitud; onActualizar: (s: Solicitud) => void }) {
  const inicial = s.importeTours ?? s.importeEstimado
  const [importe, setImporte] = useState(inicial === null ? '' : String(Number(inicial)))
  const [hosting, setHosting] = useState(s.conHosting)
  const [editando, setEditando] = useState(s.estadoPago === 'sin_enlace')
  const [guardando, setGuardando] = useState(false)
  const [aviso, setAviso] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)
  const [copiado, setCopiado] = useState(false)

  const url = s.tokenPago ? `${window.location.origin}/pago/${s.tokenPago}` : ''
  const importeNum = importe.trim() === '' ? 0 : Number(importe.replace(',', '.'))
  const total = (Number.isFinite(importeNum) ? importeNum : 0) + (hosting ? HOSTING_AGENCIA_ANUAL : 0)

  async function generar() {
    setGuardando(true)
    setAviso(null)
    const res = await fetch(`/api/admin/solicitudes/${s.id}/enlace`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ importeTours: importe.trim() === '' ? null : importeNum, conHosting: hosting }),
    })
    const data = await res.json().catch(() => ({}))
    setGuardando(false)
    if (!res.ok) {
      setAviso({ tipo: 'error', texto: data.error || 'No se pudo generar el enlace' })
      return
    }
    onActualizar(data)
    setEditando(false)
    setAviso({ tipo: 'ok', texto: 'Enlace listo. Si ya lo habías enviado, sigue siendo el mismo.' })
  }

  async function copiar() {
    await navigator.clipboard.writeText(url)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  async function enviarEmail() {
    setAviso(null)
    const res = await fetch(`/api/admin/solicitudes/${s.id}/enviar`, { method: 'POST' })
    const data = await res.json().catch(() => ({}))
    setAviso(res.ok ? { tipo: 'ok', texto: `Enviado a ${s.email}` } : { tipo: 'error', texto: data.error || 'No se pudo enviar' })
  }

  const avisoJsx = aviso && (
    <p className={`text-xs mt-2 ${aviso.tipo === 'ok' ? 'text-green-400' : 'text-red-400'}`}>{aviso.texto}</p>
  )

  if (s.estadoPago === 'pagada') {
    const cobrado = (s.importeTours === null ? 0 : Number(s.importeTours)) + (s.stripeSubscriptionId ? HOSTING_AGENCIA_ANUAL : 0)
    return (
      <div className="mt-4 rounded-lg border border-green-500/20 bg-green-500/5 p-4 text-sm space-y-2">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-green-400 font-semibold">Pagada{s.pagadaEl ? ` el ${fechaCorta(s.pagadaEl)}` : ''}</span>
          <span className="text-slate-300">{formatoEurosCentimos(cobrado)} cobrados (IVA incluido)</span>
        </div>
        {s.stripeSubscriptionId && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <HostingBadge estado={s.hostingEstado} />
            {s.hostingVenceEl && (
              <span className="text-slate-400 text-xs">
                {s.hostingEstado === 'activo' ? 'Renueva el' : 'Pagado hasta el'} {fechaCorta(s.hostingVenceEl)}
              </span>
            )}
            {aRetirar(s) && <span className="text-red-400 text-xs font-medium">Sacar sus tours del wildcard</span>}
          </div>
        )}
      </div>
    )
  }

  if (editando) {
    return (
      <div className="mt-4 rounded-lg border border-[#1e1e2e] bg-[#111118] p-4">
        <div className="text-white text-sm font-semibold mb-3">Cobro</div>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor={`importe-${s.id}`} className="text-xs text-slate-400 block mb-1">
              Importe de los tours (IVA incluido)
            </label>
            <div className="flex items-center gap-1.5">
              <input
                id={`importe-${s.id}`}
                type="number"
                min={0}
                step="0.01"
                value={importe}
                onChange={(e) => setImporte(e.target.value)}
                className="w-32 bg-[#0a0a14] border border-[#1e1e2e] rounded-lg px-2 py-1.5 text-sm text-white"
                placeholder="0"
              />
              <span className="text-slate-400 text-sm">€</span>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer pb-1.5">
            <input type="checkbox" checked={hosting} onChange={(e) => setHosting(e.target.checked)} className="accent-violet-500" />
            Alojamiento de todos los tours · {formatoEurosCentimos(HOSTING_AGENCIA_ANUAL)}/año
          </label>
          <div className="text-sm pb-1.5">
            <span className="text-slate-400">Total a pagar hoy: </span>
            <span className="text-white font-semibold">{formatoEurosCentimos(total)}</span>
          </div>
          <div className="flex gap-2 ml-auto">
            {s.tokenPago && (
              <button onClick={() => setEditando(false)} className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white">
                Cancelar
              </button>
            )}
            <button
              onClick={generar}
              disabled={guardando}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-60"
            >
              <Link2 size={14} />
              {guardando ? 'Guardando…' : s.tokenPago ? 'Guardar importe' : 'Generar enlace de pago'}
            </button>
          </div>
        </div>
        {avisoJsx}
      </div>
    )
  }

  const mensajeWhatsApp = `Hola ${s.contacto}, aquí tienes el presupuesto de 360TourX para ${s.agencia}. Puedes revisarlo y pagarlo aquí: ${url}`
  return (
    <div className="mt-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <span className="text-yellow-400 text-sm font-semibold">Enlace pendiente de pago</span>
        <span className="text-slate-300 text-sm">
          {s.importeTours !== null && `Tours ${formatoEurosCentimos(Number(s.importeTours))}`}
          {s.importeTours !== null && s.conHosting && ' + '}
          {s.conHosting && `alojamiento ${formatoEurosCentimos(HOSTING_AGENCIA_ANUAL)}/año`}
        </span>
      </div>
      <input
        readOnly
        value={url}
        onFocus={(e) => e.target.select()}
        className="w-full bg-[#0a0a14] border border-[#1e1e2e] rounded-lg px-2 py-1.5 text-xs text-slate-300 mb-3"
        aria-label="Enlace de pago"
      />
      <div className="flex flex-wrap gap-2">
        <button onClick={copiar} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-[#1e1e2e] text-slate-300 hover:text-white">
          {copiado ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copiado ? 'Copiado' : 'Copiar enlace'}
        </button>
        <a
          href={`https://wa.me/${numeroWhatsApp(s.telefono)}?text=${encodeURIComponent(mensajeWhatsApp)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-[#1e1e2e] text-slate-300 hover:text-white"
        >
          <MessageCircle size={14} />
          WhatsApp
        </a>
        <button onClick={enviarEmail} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-[#1e1e2e] text-slate-300 hover:text-white">
          <Mail size={14} />
          Enviar por email
        </button>
        <button onClick={() => setEditando(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white">
          <Pencil size={14} />
          Cambiar importe
        </button>
      </div>
      {avisoJsx}
    </div>
  )
}

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('activas')

  useEffect(() => {
    fetch('/api/admin/solicitudes')
      .then((r) => r.json())
      .then((data) => {
        setSolicitudes(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [])

  const incluye = FILTROS.find((f) => f.key === filtro)?.incluye ?? (() => true)
  const filtradas = solicitudes.filter(incluye)
  const nuevas = solicitudes.filter((s) => s.estado === 'nueva').length

  function actualizar(actualizada: Solicitud) {
    setSolicitudes((prev) => prev.map((s) => (s.id === actualizada.id ? actualizada : s)))
  }

  async function cambiarEstado(id: number, estado: string) {
    const res = await fetch(`/api/admin/solicitudes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    })
    if (res.ok) actualizar(await res.json())
  }

  async function borrar(id: number) {
    if (!confirm('¿Eliminar esta solicitud y sus inmuebles?')) return
    await fetch(`/api/admin/solicitudes/${id}`, { method: 'DELETE' })
    setSolicitudes((prev) => prev.filter((s) => s.id !== id))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Solicitudes de agencias</h1>
        <p className="text-slate-400 text-sm mt-1">
          {solicitudes.length} en total · {nuevas} nueva{nuevas === 1 ? '' : 's'} sin atender
        </p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTROS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFiltro(f.key)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              filtro === f.key
                ? 'bg-violet-600 text-white'
                : 'bg-[#0a0a14] border border-[#1e1e2e] text-slate-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtradas.length === 0 ? (
        <div className="bg-[#0a0a14] border border-[#1e1e2e] rounded-xl p-10 text-center text-slate-500 text-sm">
          No hay solicitudes en este filtro.
        </div>
      ) : (
        <div className="space-y-4">
          {filtradas.map((s) => {
            const tramo = getTramo(s.tramo)
            return (
              <article key={s.id} className="bg-[#0a0a14] border border-[#1e1e2e] rounded-xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="text-white font-semibold text-lg mr-1">{s.agencia}</h2>
                      <EstadoBadge estado={s.estado} />
                      <PagoBadge estadoPago={s.estadoPago} />
                    </div>
                    <div className="text-slate-400 text-sm">
                      #{s.id} · {new Date(s.createdAt).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm">
                      <span className="text-slate-300">{s.contacto}</span>
                      <a href={`tel:${s.telefono}`} className="flex items-center gap-1.5 text-violet-400 hover:text-violet-300">
                        <Phone size={13} />
                        {s.telefono}
                      </a>
                      <a href={`mailto:${s.email}`} className="flex items-center gap-1.5 text-violet-400 hover:text-violet-300">
                        <Mail size={13} />
                        {s.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-slate-500 text-xs">{tramo ? `${tramo.nombre} · ${tramo.rango}` : s.tramo}</div>
                      <div className="text-white font-semibold">
                        {s.importeEstimado === null ? 'A medida' : `Estimado ${formatoEuros(Number(s.importeEstimado))} IVA incl.`}
                      </div>
                      {s.conHosting && (
                        <div className="text-violet-400 text-xs mt-0.5">
                          + Alojamiento de todos los tours: {formatoEurosCentimos(HOSTING_AGENCIA_ANUAL)}/año
                        </div>
                      )}
                    </div>
                    <select
                      value={s.estado}
                      onChange={(e) => cambiarEstado(s.id, e.target.value)}
                      className="bg-[#111118] border border-[#1e1e2e] rounded-lg px-2 py-1.5 text-sm text-slate-300"
                      aria-label={`Estado de la solicitud ${s.id}`}
                    >
                      {ESTADOS_SOLICITUD.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.nombre}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => borrar(s.id)}
                      className="text-slate-600 hover:text-red-400 transition-colors"
                      aria-label={`Eliminar solicitud ${s.id}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[520px]">
                    <thead>
                      <tr className="border-b border-[#1e1e2e]">
                        <th className="text-left text-slate-500 font-medium py-2 pr-4">Dirección</th>
                        <th className="text-left text-slate-500 font-medium py-2 pr-4">m²</th>
                        <th className="text-left text-slate-500 font-medium py-2 pr-4">Disponible desde</th>
                        <th className="text-right text-slate-500 font-medium py-2">Estimado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {s.inmuebles.map((inm) => (
                        <tr key={inm.id} className="border-b border-[#1e1e2e] last:border-0">
                          <td className="py-2 pr-4 text-slate-300">{inm.direccion}</td>
                          <td className="py-2 pr-4 text-slate-300">{inm.metros}</td>
                          <td className="py-2 pr-4 text-slate-300">
                            {fechaCorta(inm.disponibleDesde)} · {FRANJAS.find((f) => f.id === inm.franja)?.nombre ?? inm.franja}
                          </td>
                          <td className="py-2 text-right text-slate-300">
                            {inm.precioEstimado === null ? '—' : formatoEuros(Number(inm.precioEstimado))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {s.notas && (
                  <p className="mt-4 text-sm text-slate-400 bg-[#111118] border border-[#1e1e2e] rounded-lg p-3 whitespace-pre-line">
                    {s.notas}
                  </p>
                )}

                <Cobro key={`${s.id}-${s.estadoPago}-${s.tokenPago}`} s={s} onActualizar={actualizar} />
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
