'use client'

import { useEffect, useState } from 'react'
import { PagoBadge, TourBadge } from '../page'

interface Reserva {
  id: number
  createdAt: string
  nombre: string
  email: string
  telefono: string | null
  direccion: string
  servicioNombre: string
  conHostingWeb: boolean
  precio: number | null
  fechaVisita: string | null
  horaVisita: string | null
  estadoPago: string
  estadoTour: string
  metodoPago: string | null
  stripeId: string | null
  notas: string | null
}

const ESTADOS_PAGO = ['pendiente', 'completado', 'fallido']
const ESTADOS_TOUR = ['pendiente', 'en_proceso', 'completado', 'entregado']

export default function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Reserva | null>(null)
  const [saving, setSaving] = useState(false)
  const [filtro, setFiltro] = useState('todas')

  useEffect(() => {
    fetch('/api/admin/reservas')
      .then((r) => r.json())
      .then((data) => {
        setReservas(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [])

  const filtradas = reservas.filter((r) => {
    if (filtro === 'todas') return true
    if (filtro === 'pagadas') return r.estadoPago === 'completado'
    if (filtro === 'pendientes_pago') return r.estadoPago === 'pendiente'
    if (filtro === 'por_entregar') return r.estadoTour !== 'entregado' && r.estadoPago === 'completado'
    return true
  })

  async function updateReserva(id: number, data: Partial<Reserva>) {
    setSaving(true)
    const res = await fetch(`/api/admin/reservas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const updated = await res.json()
    setReservas((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)))
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, ...updated } : null)
    setSaving(false)
  }

  async function deleteReserva(id: number) {
    if (!confirm('¿Eliminar esta reserva?')) return
    await fetch(`/api/admin/reservas/${id}`, { method: 'DELETE' })
    setReservas((prev) => prev.filter((r) => r.id !== id))
    setSelected(null)
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
        <h1 className="text-2xl font-bold text-white">Reservas</h1>
        <p className="text-slate-400 text-sm mt-1">{reservas.length} reservas en total</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { key: 'todas', label: 'Todas' },
          { key: 'pagadas', label: 'Pagadas' },
          { key: 'pendientes_pago', label: 'Pago pendiente' },
          { key: 'por_entregar', label: 'Por entregar' },
        ].map((f) => (
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

      <div className="flex gap-6">
        {/* Tabla */}
        <div className="flex-1 bg-[#0a0a14] border border-[#1e1e2e] rounded-xl overflow-hidden">
          {filtradas.length === 0 ? (
            <p className="text-slate-500 text-sm p-6">No hay reservas.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e1e2e]">
                  <th className="text-left text-slate-500 font-medium px-4 py-3">#</th>
                  <th className="text-left text-slate-500 font-medium px-4 py-3">Cliente</th>
                  <th className="text-left text-slate-500 font-medium px-4 py-3">Servicio</th>
                  <th className="text-left text-slate-500 font-medium px-4 py-3">Precio</th>
                  <th className="text-left text-slate-500 font-medium px-4 py-3">Pago</th>
                  <th className="text-left text-slate-500 font-medium px-4 py-3">Tour</th>
                  <th className="text-left text-slate-500 font-medium px-4 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className={`border-b border-[#1e1e2e] last:border-0 cursor-pointer transition-colors ${
                      selected?.id === r.id ? 'bg-violet-600/10' : 'hover:bg-white/2'
                    }`}
                  >
                    <td className="px-4 py-3 text-slate-500">{r.id}</td>
                    <td className="px-4 py-3">
                      <div className="text-white font-medium">{r.nombre}</div>
                      <div className="text-slate-500 text-xs">{r.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-xs">{r.servicioNombre}</td>
                    <td className="px-4 py-3 text-slate-300">{r.precio ? `${Number(r.precio).toFixed(2)}€` : '—'}</td>
                    <td className="px-4 py-3"><PagoBadge estado={r.estadoPago} /></td>
                    <td className="px-4 py-3"><TourBadge estado={r.estadoTour} /></td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {r.fechaVisita ? new Date(r.fechaVisita).toLocaleDateString('es-ES') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Panel lateral de detalle */}
        {selected && (
          <div className="w-72 bg-[#0a0a14] border border-[#1e1e2e] rounded-xl p-5 shrink-0 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Reserva #{selected.id}</h3>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white text-lg leading-none">×</button>
            </div>

            <div className="space-y-2 text-sm">
              <div><span className="text-slate-500">Cliente:</span> <span className="text-white">{selected.nombre}</span></div>
              <div><span className="text-slate-500">Email:</span> <span className="text-slate-300">{selected.email}</span></div>
              {selected.telefono && <div><span className="text-slate-500">Tel:</span> <span className="text-slate-300">{selected.telefono}</span></div>}
              <div><span className="text-slate-500">Dirección:</span> <span className="text-slate-300">{selected.direccion}</span></div>
              <div><span className="text-slate-500">Servicio:</span> <span className="text-slate-300">{selected.servicioNombre}</span></div>
              {selected.conHostingWeb && <div className="text-violet-400 text-xs">+ Hosting web</div>}
              <div><span className="text-slate-500">Precio:</span> <span className="text-white font-semibold">{selected.precio ? `${Number(selected.precio).toFixed(2)}€` : '—'}</span></div>
              {selected.fechaVisita && (
                <div><span className="text-slate-500">Visita:</span> <span className="text-slate-300">{new Date(selected.fechaVisita).toLocaleDateString('es-ES')} {selected.horaVisita}</span></div>
              )}
              {selected.stripeId && <div className="text-xs text-slate-600 break-all">Stripe: {selected.stripeId}</div>}
            </div>

            {/* Estado pago */}
            <div>
              <label className="text-xs text-slate-500 block mb-1.5">Estado de pago</label>
              <select
                value={selected.estadoPago}
                onChange={(e) => updateReserva(selected.id, { estadoPago: e.target.value })}
                className="w-full bg-[#111120] border border-[#1e1e2e] text-white text-sm rounded-lg px-3 py-2"
              >
                {ESTADOS_PAGO.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>

            {/* Estado tour */}
            <div>
              <label className="text-xs text-slate-500 block mb-1.5">Estado del tour</label>
              <select
                value={selected.estadoTour}
                onChange={(e) => updateReserva(selected.id, { estadoTour: e.target.value })}
                className="w-full bg-[#111120] border border-[#1e1e2e] text-white text-sm rounded-lg px-3 py-2"
              >
                {ESTADOS_TOUR.map((e) => (
                  <option key={e} value={e}>{e.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            {/* Notas */}
            <div>
              <label className="text-xs text-slate-500 block mb-1.5">Notas internas</label>
              <textarea
                defaultValue={selected.notas || ''}
                onBlur={(e) => updateReserva(selected.id, { notas: e.target.value })}
                rows={3}
                placeholder="Añade notas sobre esta reserva..."
                className="w-full bg-[#111120] border border-[#1e1e2e] text-white text-sm rounded-lg px-3 py-2 resize-none placeholder:text-slate-600"
              />
            </div>

            {saving && <p className="text-xs text-violet-400">Guardando...</p>}

            <button
              onClick={() => deleteReserva(selected.id)}
              className="w-full text-sm text-red-400 border border-red-500/20 rounded-lg py-2 hover:bg-red-500/10 transition-colors"
            >
              Eliminar reserva
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
