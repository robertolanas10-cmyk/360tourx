'use client'

import { useEffect, useState } from 'react'

interface Contacto {
  id: number
  createdAt: string
  nombre: string
  apellido: string | null
  email: string
  telefono: string | null
  empresa: string | null
  posicion: string | null
  mensaje: string
  tipo: string
}

export default function ContactosPage() {
  const [contactos, setContactos] = useState<Contacto[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Contacto | null>(null)
  const [filtro, setFiltro] = useState('todos')

  useEffect(() => {
    fetch('/api/admin/contactos')
      .then((r) => r.json())
      .then((data) => {
        setContactos(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [])

  const filtrados = contactos.filter((c) => {
    if (filtro === 'todos') return true
    return c.tipo === filtro
  })

  async function deleteContacto(id: number) {
    if (!confirm('¿Eliminar este contacto?')) return
    await fetch(`/api/admin/contactos/${id}`, { method: 'DELETE' })
    setContactos((prev) => prev.filter((c) => c.id !== id))
    setSelected(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const tipos = ['todos', ...Array.from(new Set(contactos.map((c) => c.tipo)))]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Contactos</h1>
        <p className="text-slate-400 text-sm mt-1">{contactos.length} mensajes recibidos</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tipos.map((t) => (
          <button
            key={t}
            onClick={() => setFiltro(t)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all capitalize ${
              filtro === t
                ? 'bg-violet-600 text-white'
                : 'bg-[#0a0a14] border border-[#1e1e2e] text-slate-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Tabla */}
        <div className="flex-1 bg-[#0a0a14] border border-[#1e1e2e] rounded-xl overflow-hidden">
          {filtrados.length === 0 ? (
            <p className="text-slate-500 text-sm p-6">No hay contactos.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e1e2e]">
                  <th className="text-left text-slate-500 font-medium px-4 py-3">Nombre</th>
                  <th className="text-left text-slate-500 font-medium px-4 py-3">Email</th>
                  <th className="text-left text-slate-500 font-medium px-4 py-3">Empresa</th>
                  <th className="text-left text-slate-500 font-medium px-4 py-3">Tipo</th>
                  <th className="text-left text-slate-500 font-medium px-4 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className={`border-b border-[#1e1e2e] last:border-0 cursor-pointer transition-colors ${
                      selected?.id === c.id ? 'bg-violet-600/10' : 'hover:bg-white/2'
                    }`}
                  >
                    <td className="px-4 py-3 text-white">{c.nombre} {c.apellido || ''}</td>
                    <td className="px-4 py-3 text-slate-300">{c.email}</td>
                    <td className="px-4 py-3 text-slate-400">{c.empresa || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{c.tipo}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {new Date(c.createdAt).toLocaleDateString('es-ES')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Panel de detalle */}
        {selected && (
          <div className="w-72 bg-[#0a0a14] border border-[#1e1e2e] rounded-xl p-5 shrink-0 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Contacto #{selected.id}</h3>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white text-lg leading-none">×</button>
            </div>

            <div className="space-y-2 text-sm">
              <div><span className="text-slate-500">Nombre:</span> <span className="text-white">{selected.nombre} {selected.apellido || ''}</span></div>
              <div>
                <span className="text-slate-500">Email:</span>{' '}
                <a href={`mailto:${selected.email}`} className="text-violet-400 hover:text-violet-300">{selected.email}</a>
              </div>
              {selected.telefono && (
                <div>
                  <span className="text-slate-500">Tel:</span>{' '}
                  <a href={`tel:${selected.telefono}`} className="text-slate-300 hover:text-white">{selected.telefono}</a>
                </div>
              )}
              {selected.empresa && <div><span className="text-slate-500">Empresa:</span> <span className="text-slate-300">{selected.empresa}</span></div>}
              {selected.posicion && <div><span className="text-slate-500">Posición:</span> <span className="text-slate-300">{selected.posicion}</span></div>}
              <div><span className="text-slate-500">Tipo:</span> <span className="text-slate-300">{selected.tipo}</span></div>
              <div><span className="text-slate-500">Fecha:</span> <span className="text-slate-300">{new Date(selected.createdAt).toLocaleString('es-ES')}</span></div>
            </div>

            {selected.mensaje && (
              <div>
                <p className="text-xs text-slate-500 mb-1.5">Mensaje</p>
                <div className="bg-[#111120] border border-[#1e1e2e] rounded-lg p-3 text-sm text-slate-300 leading-relaxed">
                  {selected.mensaje}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <a
                href={`mailto:${selected.email}`}
                className="flex-1 text-center text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-lg py-2 transition-colors"
              >
                Responder
              </a>
              <button
                onClick={() => deleteContacto(selected.id)}
                className="px-3 text-sm text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors"
              >
                Borrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
