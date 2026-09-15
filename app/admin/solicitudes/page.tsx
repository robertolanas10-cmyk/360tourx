'use client'

import { useEffect, useState } from 'react'
import { Mail, Phone, Trash2 } from 'lucide-react'
import { ESTADOS_SOLICITUD } from '@/lib/solicitud-estados'
import { FRANJAS, formatoEuros, getTramo } from '@/lib/tarifas-agencia'

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
  importeEstimado: string | null
  estado: string
  inmuebles: Inmueble[]
}

const FILTROS = [
  { key: 'activas', label: 'Por atender', incluye: ['nueva', 'presupuestada', 'agendada'] },
  { key: 'nueva', label: 'Nuevas', incluye: ['nueva'] },
  { key: 'completada', label: 'Completadas', incluye: ['completada'] },
  { key: 'todas', label: 'Todas', incluye: null },
] as const

// disponibleDesde se guarda como fecha sin hora: se lee en UTC para no correr un día.
const fechaCorta = (iso: string) => iso.slice(0, 10).split('-').reverse().join('/')

function EstadoBadge({ estado }: { estado: string }) {
  const e = ESTADOS_SOLICITUD.find((x) => x.id === estado)
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${e?.estilo ?? 'bg-slate-700 text-slate-400'}`}>
      {e?.nombre ?? estado}
    </span>
  )
}

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]['key']>('activas')

  useEffect(() => {
    fetch('/api/admin/solicitudes')
      .then((r) => r.json())
      .then((data) => {
        setSolicitudes(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [])

  const incluye = FILTROS.find((f) => f.key === filtro)?.incluye
  const filtradas = solicitudes.filter((s) => !incluye || (incluye as readonly string[]).includes(s.estado))
  const nuevas = solicitudes.filter((s) => s.estado === 'nueva').length

  async function cambiarEstado(id: number, estado: string) {
    const res = await fetch(`/api/admin/solicitudes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    })
    if (res.ok) {
      const actualizada = await res.json()
      setSolicitudes((prev) => prev.map((s) => (s.id === id ? actualizada : s)))
    }
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
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-white font-semibold text-lg">{s.agencia}</h2>
                      <EstadoBadge estado={s.estado} />
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
                        {s.importeEstimado === null ? 'A medida' : `${formatoEuros(Number(s.importeEstimado))} + IVA`}
                      </div>
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
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
