// Badges de estado compartidos por el dashboard y la página de reservas del admin.
// Se mantienen fuera de page.tsx porque Next.js no permite exports con nombre
// arbitrarios en un archivo de ruta (page.tsx solo admite el export default y
// algunos exports especiales).

export function PagoBadge({ estado }: { estado: string }) {
  const map: Record<string, string> = {
    completado: 'bg-green-500/15 text-green-400 border-green-500/30',
    pendiente: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    fallido: 'bg-red-500/15 text-red-400 border-red-500/30',
  }
  const label: Record<string, string> = {
    completado: 'Pagado',
    pendiente: 'Pendiente',
    fallido: 'Fallido',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${map[estado] || 'bg-slate-700 text-slate-400'}`}>
      {label[estado] || estado}
    </span>
  )
}

export function TourBadge({ estado }: { estado: string }) {
  const map: Record<string, string> = {
    pendiente: 'bg-slate-700/50 text-slate-400 border-slate-600',
    en_proceso: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    completado: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    entregado: 'bg-green-500/15 text-green-400 border-green-500/30',
  }
  const label: Record<string, string> = {
    pendiente: 'Pendiente',
    en_proceso: 'En proceso',
    completado: 'Completado',
    entregado: 'Entregado',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${map[estado] || 'bg-slate-700 text-slate-400'}`}>
      {label[estado] || estado}
    </span>
  )
}

export function CategoriaBadge({ categoria }: { categoria: string | null }) {
  if (!categoria) return <span className="text-xs px-2 py-0.5 rounded-full border bg-slate-700/50 text-slate-400 border-slate-600">Sin categoría</span>
  const map: Record<string, string> = {
    inmobiliaria: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    particular: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    empresa: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    hosteleria: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
  }
  const label: Record<string, string> = {
    inmobiliaria: 'Inmobiliaria',
    particular: 'Particular',
    empresa: 'Empresa',
    hosteleria: 'Hostelería',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${map[categoria] || 'bg-slate-700 text-slate-400'}`}>
      {label[categoria] || categoria}
    </span>
  )
}

export function HostingBadge({ estado }: { estado: string | null }) {
  if (!estado) return null
  const map: Record<string, string> = {
    activo: 'bg-green-500/15 text-green-400 border-green-500/30',
    cancela_al_vencer: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    impago: 'bg-red-500/15 text-red-400 border-red-500/30',
    cancelado: 'bg-slate-700/50 text-slate-400 border-slate-600',
  }
  const label: Record<string, string> = {
    activo: 'Hosting activo',
    cancela_al_vencer: 'Cancela al vencer',
    impago: 'Hosting impagado',
    cancelado: 'Hosting cancelado',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${map[estado] || 'bg-slate-700 text-slate-400'}`}>
      {label[estado] || estado}
    </span>
  )
}
