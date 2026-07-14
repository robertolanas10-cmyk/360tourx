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
