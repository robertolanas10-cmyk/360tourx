'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CalendarCheck, Users, EuroIcon, Clock } from 'lucide-react'
import { PagoBadge, TourBadge } from './badges'

interface Reserva {
  id: number
  createdAt: string
  nombre: string
  email: string
  servicioNombre: string
  precio: number | null
  estadoPago: string
  estadoTour: string
  fechaVisita: string | null
}

interface Contacto {
  id: number
  createdAt: string
  nombre: string
  email: string
  tipo: string
}

export default function AdminDashboard() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [contactos, setContactos] = useState<Contacto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/reservas').then((r) => r.json()),
      fetch('/api/admin/contactos').then((r) => r.json()),
    ]).then(([r, c]) => {
      setReservas(Array.isArray(r) ? r : [])
      setContactos(Array.isArray(c) ? c : [])
      setLoading(false)
    })
  }, [])

  const totalIngresos = reservas
    .filter((r) => r.estadoPago === 'completado')
    .reduce((sum, r) => sum + (Number(r.precio) || 0), 0)

  const pendientesPago = reservas.filter((r) => r.estadoPago === 'pendiente').length
  const toursPendientes = reservas.filter((r) => r.estadoTour === 'pendiente' && r.estadoPago === 'completado').length

  const stats = [
    { label: 'Total reservas', value: reservas.length, icon: CalendarCheck, color: 'text-violet-400' },
    { label: 'Ingresos cobrados', value: `${totalIngresos.toFixed(2)}€`, icon: EuroIcon, color: 'text-green-400' },
    { label: 'Pagos pendientes', value: pendientesPago, icon: Clock, color: 'text-yellow-400' },
    { label: 'Contactos recibidos', value: contactos.length, icon: Users, color: 'text-blue-400' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Resumen general de 360TourX</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#0a0a14] border border-[#1e1e2e] rounded-xl p-5">
            <stat.icon size={20} className={`${stat.color} mb-3`} />
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tours pendientes de hacer */}
      {toursPendientes > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-8 flex items-center gap-3">
          <Clock size={18} className="text-yellow-400 shrink-0" />
          <p className="text-yellow-300 text-sm">
            Tienes <strong>{toursPendientes}</strong> tour{toursPendientes > 1 ? 's' : ''} pagado{toursPendientes > 1 ? 's' : ''} pendiente{toursPendientes > 1 ? 's' : ''} de realizar.{' '}
            <Link href="/admin/reservas" className="underline">Ver reservas</Link>
          </p>
        </div>
      )}

      {/* Últimas reservas */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Últimas reservas</h2>
          <Link href="/admin/reservas" className="text-violet-400 text-sm hover:text-violet-300">
            Ver todas →
          </Link>
        </div>
        <div className="bg-[#0a0a14] border border-[#1e1e2e] rounded-xl overflow-hidden">
          {reservas.slice(0, 5).length === 0 ? (
            <p className="text-slate-500 text-sm p-6">No hay reservas aún.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e1e2e]">
                  <th className="text-left text-slate-500 font-medium px-5 py-3">Cliente</th>
                  <th className="text-left text-slate-500 font-medium px-5 py-3">Servicio</th>
                  <th className="text-left text-slate-500 font-medium px-5 py-3">Precio</th>
                  <th className="text-left text-slate-500 font-medium px-5 py-3">Pago</th>
                  <th className="text-left text-slate-500 font-medium px-5 py-3">Tour</th>
                </tr>
              </thead>
              <tbody>
                {reservas.slice(0, 5).map((r) => (
                  <tr key={r.id} className="border-b border-[#1e1e2e] last:border-0 hover:bg-white/2">
                    <td className="px-5 py-3">
                      <div className="text-white font-medium">{r.nombre}</div>
                      <div className="text-slate-500 text-xs">{r.email}</div>
                    </td>
                    <td className="px-5 py-3 text-slate-300">{r.servicioNombre}</td>
                    <td className="px-5 py-3 text-slate-300">{r.precio ? `${Number(r.precio).toFixed(2)}€` : '—'}</td>
                    <td className="px-5 py-3"><PagoBadge estado={r.estadoPago} /></td>
                    <td className="px-5 py-3"><TourBadge estado={r.estadoTour} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Últimos contactos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Últimos contactos</h2>
          <Link href="/admin/contactos" className="text-violet-400 text-sm hover:text-violet-300">
            Ver todos →
          </Link>
        </div>
        <div className="bg-[#0a0a14] border border-[#1e1e2e] rounded-xl overflow-hidden">
          {contactos.slice(0, 5).length === 0 ? (
            <p className="text-slate-500 text-sm p-6">No hay contactos aún.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e1e2e]">
                  <th className="text-left text-slate-500 font-medium px-5 py-3">Nombre</th>
                  <th className="text-left text-slate-500 font-medium px-5 py-3">Email</th>
                  <th className="text-left text-slate-500 font-medium px-5 py-3">Tipo</th>
                  <th className="text-left text-slate-500 font-medium px-5 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {contactos.slice(0, 5).map((c) => (
                  <tr key={c.id} className="border-b border-[#1e1e2e] last:border-0">
                    <td className="px-5 py-3 text-white">{c.nombre}</td>
                    <td className="px-5 py-3 text-slate-300">{c.email}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{c.tipo}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-xs">
                      {new Date(c.createdAt).toLocaleDateString('es-ES')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
