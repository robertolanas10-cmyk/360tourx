'use client'

import { useEffect, useState } from 'react'
import {
  FolderOpen,
  Building2,
  User,
  Briefcase,
  UtensilsCrossed,
  HelpCircle,
  Clock,
  Plus,
  ExternalLink,
  X,
} from 'lucide-react'
import { CategoriaBadge, TourBadge } from '../badges'

interface Reserva {
  id: number
  createdAt: string
  nombre: string
  email: string
  telefono: string | null
  direccion: string
  servicioNombre: string
  precio: number | null
  estadoPago: string
  estadoTour: string
  categoria: string | null
  empresa: string | null
  enlaceTour: string | null
  notas: string | null
  creadaManual: boolean
}

const ESTADOS_TOUR = ['pendiente', 'en_proceso', 'completado', 'entregado']

const CATEGORIAS = [
  { key: 'inmobiliaria', label: 'Inmobiliarias', icon: Building2 },
  { key: 'particular', label: 'Particulares', icon: User },
  { key: 'empresa', label: 'Empresas', icon: Briefcase },
  { key: 'hosteleria', label: 'Hostelería', icon: UtensilsCrossed },
]

type FolderKey = 'en_proceso' | 'sin_categoria' | 'inmobiliaria' | 'particular' | 'empresa' | 'hosteleria'

export default function ToursPage() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const [folder, setFolder] = useState<FolderKey | null>(null)
  const [empresaSel, setEmpresaSel] = useState<string | null>(null)
  const [selected, setSelected] = useState<Reserva | null>(null)
  const [saving, setSaving] = useState(false)
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    fetch('/api/admin/reservas')
      .then((r) => r.json())
      .then((data) => {
        setReservas(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [])

  const pagadas = reservas.filter((r) => r.estadoPago === 'completado')
  const terminadas = pagadas.filter((r) => r.estadoTour === 'completado' || r.estadoTour === 'entregado')
  const enProceso = pagadas.filter((r) => r.estadoTour !== 'completado' && r.estadoTour !== 'entregado')
  const sinCategoria = terminadas.filter((r) => !r.categoria)

  const folders: { key: FolderKey; label: string; icon: typeof Clock; count: number; tint: string }[] = [
    { key: 'en_proceso', label: 'En proceso', icon: Clock, count: enProceso.length, tint: 'text-yellow-400' },
    ...CATEGORIAS.map((c) => ({
      key: c.key as FolderKey,
      label: c.label,
      icon: c.icon,
      count: terminadas.filter((r) => r.categoria === c.key).length,
      tint: 'text-violet-400',
    })),
    { key: 'sin_categoria', label: 'Sin categoría', icon: HelpCircle, count: sinCategoria.length, tint: 'text-slate-400' },
  ]

  const esCategoriaConEmpresas = !!folder && CATEGORIAS.some((c) => c.key === folder)

  // Tours de la categoría actual, agrupados por empresa/cliente (subcarpetas) + los que van sueltos
  const itemsCategoria = esCategoriaConEmpresas ? terminadas.filter((r) => r.categoria === folder) : []
  const empresasEnCategoria = Array.from(
    new Set(itemsCategoria.filter((r) => r.empresa).map((r) => r.empresa as string))
  ).sort()
  const sueltosEnCategoria = itemsCategoria.filter((r) => !r.empresa)

  const itemsEnCarpeta = (() => {
    if (folder === 'en_proceso') return enProceso
    if (folder === 'sin_categoria') return sinCategoria
    if (esCategoriaConEmpresas && empresaSel) return itemsCategoria.filter((r) => r.empresa === empresaSel)
    if (esCategoriaConEmpresas) return sueltosEnCategoria // vista de categoría: solo los sueltos, las agrupadas van en subcarpetas
    return terminadas.filter((r) => r.categoria === folder)
  })()

  // Todas las empresas ya guardadas (de cualquier categoría), para el selector "cliente ya existente"
  const todasLasEmpresas = Array.from(new Set(reservas.filter((r) => r.empresa).map((r) => r.empresa as string))).sort()

  async function updateReserva(id: number, data: Partial<Reserva>) {
    setSaving(true)
    const res = await fetch(`/api/admin/reservas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const updated = await res.json()
    setReservas((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)))
    if (selected?.id === id) setSelected((prev) => (prev ? { ...prev, ...updated } : null))
    setSaving(false)
  }

  function onCreated(nueva: Reserva) {
    setReservas((prev) => [nueva, ...prev])
    setShowAdd(false)
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderOpen size={22} className="text-violet-400" />
            Tours
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Archivo de tours pagados, organizado por tipo de cliente.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Añadir tour a mano
        </button>
      </div>

      {/* Vista de carpetas */}
      {!folder && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {folders.map((f) => (
            <button
              key={f.key}
              onClick={() => setFolder(f.key)}
              className="bg-[#0a0a14] border border-[#1e1e2e] rounded-xl p-5 text-left hover:border-violet-500/40 hover:-translate-y-0.5 transition-all"
            >
              <f.icon size={24} className={f.tint} />
              <div className="text-white font-semibold mt-3">{f.label}</div>
              <div className="text-slate-500 text-sm mt-0.5">{f.count} tour{f.count === 1 ? '' : 's'}</div>
            </button>
          ))}
        </div>
      )}

      {/* Vista dentro de una carpeta */}
      {folder && (
        <div>
          <button
            onClick={() => {
              if (empresaSel) {
                setEmpresaSel(null)
              } else {
                setFolder(null)
              }
              setSelected(null)
            }}
            className="text-sm text-slate-400 hover:text-white mb-4 flex items-center gap-1"
          >
            ← {empresaSel ? `Volver a ${folders.find((f) => f.key === folder)?.label}` : 'Volver a carpetas'}
          </button>

          {/* Subcarpetas por empresa/cliente, solo al entrar en una categoría (no dentro de una empresa concreta) */}
          {esCategoriaConEmpresas && !empresaSel && empresasEnCategoria.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {empresasEnCategoria.map((emp) => {
                const count = itemsCategoria.filter((r) => r.empresa === emp).length
                return (
                  <button
                    key={emp}
                    onClick={() => setEmpresaSel(emp)}
                    className="bg-[#0a0a14] border border-[#1e1e2e] rounded-xl p-4 text-left hover:border-violet-500/40 hover:-translate-y-0.5 transition-all"
                  >
                    <FolderOpen size={20} className="text-violet-400" />
                    <div className="text-white font-medium mt-2 text-sm">{emp}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{count} tour{count === 1 ? '' : 's'}</div>
                  </button>
                )
              })}
            </div>
          )}

          {esCategoriaConEmpresas && !empresaSel && itemsEnCarpeta.length > 0 && (
            <p className="text-slate-500 text-xs mb-3">Sueltos (sin empresa/cliente asignado):</p>
          )}

          {!(esCategoriaConEmpresas && !empresaSel && itemsEnCarpeta.length === 0 && empresasEnCategoria.length > 0) && (
          <div className="flex gap-6">
            <div className="flex-1 bg-[#0a0a14] border border-[#1e1e2e] rounded-xl overflow-hidden">
              {itemsEnCarpeta.length === 0 ? (
                <p className="text-slate-500 text-sm p-6">No hay tours aquí todavía.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#1e1e2e]">
                      <th className="text-left text-slate-500 font-medium px-4 py-3">Cliente</th>
                      <th className="text-left text-slate-500 font-medium px-4 py-3">Tour</th>
                      <th className="text-left text-slate-500 font-medium px-4 py-3">Estado</th>
                      <th className="text-left text-slate-500 font-medium px-4 py-3">Enlace</th>
                      <th className="text-left text-slate-500 font-medium px-4 py-3">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsEnCarpeta.map((r) => (
                      <tr
                        key={r.id}
                        onClick={() => setSelected(r)}
                        className={`border-b border-[#1e1e2e] last:border-0 cursor-pointer transition-colors ${
                          selected?.id === r.id ? 'bg-violet-600/10' : 'hover:bg-white/2'
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="text-white font-medium">{r.nombre}</div>
                          <div className="text-slate-500 text-xs">{r.direccion}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-300 text-xs">{r.servicioNombre}</td>
                        <td className="px-4 py-3"><TourBadge estado={r.estadoTour} /></td>
                        <td className="px-4 py-3">
                          {r.enlaceTour ? (
                            <a
                              href={r.enlaceTour}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-violet-400 hover:text-violet-300 inline-flex items-center gap-1"
                            >
                              Ver <ExternalLink size={12} />
                            </a>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs">
                          {new Date(r.createdAt).toLocaleDateString('es-ES')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Panel lateral de detalle */}
            {selected && (
              <div className="w-80 bg-[#0a0a14] border border-[#1e1e2e] rounded-xl p-5 shrink-0 space-y-5 h-fit">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">Tour #{selected.id}</h3>
                  <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white text-lg leading-none">×</button>
                </div>

                <div className="space-y-2 text-sm">
                  <div><span className="text-slate-500">Cliente:</span> <span className="text-white">{selected.nombre}</span></div>
                  {selected.email && <div><span className="text-slate-500">Email:</span> <span className="text-slate-300">{selected.email}</span></div>}
                  {selected.telefono && <div><span className="text-slate-500">Tel:</span> <span className="text-slate-300">{selected.telefono}</span></div>}
                  <div><span className="text-slate-500">Dirección:</span> <span className="text-slate-300">{selected.direccion || '—'}</span></div>
                  <div><span className="text-slate-500">Servicio:</span> <span className="text-slate-300">{selected.servicioNombre}</span></div>
                  {selected.precio && <div><span className="text-slate-500">Precio:</span> <span className="text-white font-semibold">{Number(selected.precio).toFixed(2)}€</span></div>}
                  <div className="flex items-center gap-2"><span className="text-slate-500">Categoría actual:</span> <CategoriaBadge categoria={selected.categoria} /></div>
                  {selected.creadaManual && <div className="text-xs text-slate-600">Añadido a mano desde el admin</div>}
                </div>

                <div>
                  <label className="text-xs text-slate-500 block mb-1.5">Categoría</label>
                  <select
                    value={selected.categoria || ''}
                    onChange={(e) => updateReserva(selected.id, { categoria: e.target.value || null })}
                    className="w-full bg-[#111120] border border-[#1e1e2e] text-white text-sm rounded-lg px-3 py-2"
                  >
                    <option value="">Sin categoría</option>
                    {CATEGORIAS.map((c) => (
                      <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-500 block mb-1.5">Empresa / cliente (para agrupar en subcarpeta)</label>
                  <input
                    type="text"
                    list="empresas-existentes"
                    defaultValue={selected.empresa || ''}
                    onBlur={(e) => updateReserva(selected.id, { empresa: e.target.value || null })}
                    placeholder="Ej. Inmobiliaria Alcobendas"
                    className="w-full bg-[#111120] border border-[#1e1e2e] text-white text-sm rounded-lg px-3 py-2 placeholder:text-slate-600"
                  />
                  <datalist id="empresas-existentes">
                    {todasLasEmpresas.map((emp) => <option key={emp} value={emp} />)}
                  </datalist>
                </div>

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

                <div>
                  <label className="text-xs text-slate-500 block mb-1.5">Enlace al tour</label>
                  <input
                    type="text"
                    defaultValue={selected.enlaceTour || ''}
                    onBlur={(e) => updateReserva(selected.id, { enlaceTour: e.target.value || null })}
                    placeholder="https://..."
                    className="w-full bg-[#111120] border border-[#1e1e2e] text-white text-sm rounded-lg px-3 py-2 placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-500 block mb-1.5">Notas internas</label>
                  <textarea
                    defaultValue={selected.notas || ''}
                    onBlur={(e) => updateReserva(selected.id, { notas: e.target.value })}
                    rows={3}
                    placeholder="Añade notas sobre este tour..."
                    className="w-full bg-[#111120] border border-[#1e1e2e] text-white text-sm rounded-lg px-3 py-2 resize-none placeholder:text-slate-600"
                  />
                </div>

                {saving && <p className="text-xs text-violet-400">Guardando...</p>}
              </div>
            )}
          </div>
          )}
        </div>
      )}

      {showAdd && <AddTourModal reservas={reservas} onClose={() => setShowAdd(false)} onCreated={onCreated} />}
    </div>
  )
}

function AddTourModal({
  reservas,
  onClose,
  onCreated,
}: {
  reservas: Reserva[]
  onClose: () => void
  onCreated: (r: Reserva) => void
}) {
  const [form, setForm] = useState({
    nombre: '',
    categoria: 'particular',
    direccion: '',
    servicioNombre: '',
    email: '',
    telefono: '',
    precio: '',
    enlaceTour: '',
    notas: '',
  })
  const [empresaModo, setEmpresaModo] = useState<'nueva' | 'existente'>('nueva')
  const [empresa, setEmpresa] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const empresasDeCategoria = Array.from(
    new Set(
      reservas
        .filter((r) => r.categoria === form.categoria && r.empresa)
        .map((r) => r.empresa as string)
    )
  ).sort()

  async function submit() {
    if (!form.nombre.trim()) {
      setError('El nombre del cliente es obligatorio.')
      return
    }
    setSaving(true)
    setError(null)
    const res = await fetch('/api/admin/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, empresa: empresa || null }),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) {
      setError(data.error || 'No se pudo crear el tour.')
      return
    }
    onCreated(data)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0a14] border border-[#1e1e2e] rounded-xl p-6 w-full max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-lg">Añadir tour a mano</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-500 block mb-1.5">Cliente *</label>
            <input
              value={form.nombre}
              onChange={(e) => set('nombre', e.target.value)}
              className="w-full bg-[#111120] border border-[#1e1e2e] text-white text-sm rounded-lg px-3 py-2"
              placeholder="Nombre del cliente o negocio"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 block mb-1.5">Categoría *</label>
            <select
              value={form.categoria}
              onChange={(e) => {
                set('categoria', e.target.value)
                setEmpresa('')
              }}
              className="w-full bg-[#111120] border border-[#1e1e2e] text-white text-sm rounded-lg px-3 py-2"
            >
              {CATEGORIAS.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-500 block mb-1.5">Empresa / cliente (opcional, para agrupar en subcarpeta)</label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => { setEmpresaModo('nueva'); setEmpresa('') }}
                className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${
                  empresaModo === 'nueva' ? 'bg-violet-600 border-violet-600 text-white' : 'border-[#1e1e2e] text-slate-400'
                }`}
              >
                Cliente nuevo
              </button>
              <button
                type="button"
                disabled={empresasDeCategoria.length === 0}
                onClick={() => { setEmpresaModo('existente'); setEmpresa(empresasDeCategoria[0] || '') }}
                className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  empresaModo === 'existente' ? 'bg-violet-600 border-violet-600 text-white' : 'border-[#1e1e2e] text-slate-400'
                }`}
              >
                Cliente ya existente
              </button>
            </div>
            {empresaModo === 'nueva' ? (
              <input
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                placeholder="Ej. Inmobiliaria Alcobendas (déjalo vacío si no aplica)"
                className="w-full bg-[#111120] border border-[#1e1e2e] text-white text-sm rounded-lg px-3 py-2 placeholder:text-slate-600"
              />
            ) : (
              <select
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                className="w-full bg-[#111120] border border-[#1e1e2e] text-white text-sm rounded-lg px-3 py-2"
              >
                {empresasDeCategoria.map((emp) => (
                  <option key={emp} value={emp}>{emp}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="text-xs text-slate-500 block mb-1.5">Dirección</label>
            <input
              value={form.direccion}
              onChange={(e) => set('direccion', e.target.value)}
              className="w-full bg-[#111120] border border-[#1e1e2e] text-white text-sm rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 block mb-1.5">Descripción del tour</label>
            <input
              value={form.servicioNombre}
              onChange={(e) => set('servicioNombre', e.target.value)}
              placeholder="Ej. Piso 90m² - Chamberí"
              className="w-full bg-[#111120] border border-[#1e1e2e] text-white text-sm rounded-lg px-3 py-2 placeholder:text-slate-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 block mb-1.5">Email</label>
              <input
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                className="w-full bg-[#111120] border border-[#1e1e2e] text-white text-sm rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1.5">Teléfono</label>
              <input
                value={form.telefono}
                onChange={(e) => set('telefono', e.target.value)}
                className="w-full bg-[#111120] border border-[#1e1e2e] text-white text-sm rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-500 block mb-1.5">Enlace al tour</label>
            <input
              value={form.enlaceTour}
              onChange={(e) => set('enlaceTour', e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#111120] border border-[#1e1e2e] text-white text-sm rounded-lg px-3 py-2 placeholder:text-slate-600"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 block mb-1.5">Notas</label>
            <textarea
              value={form.notas}
              onChange={(e) => set('notas', e.target.value)}
              rows={2}
              className="w-full bg-[#111120] border border-[#1e1e2e] text-white text-sm rounded-lg px-3 py-2 resize-none"
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 text-sm text-slate-400 border border-[#1e1e2e] rounded-lg py-2 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className="flex-1 text-sm text-white bg-violet-600 hover:bg-violet-500 rounded-lg py-2 transition-colors disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Añadir tour'}
          </button>
        </div>
      </div>
    </div>
  )
}
