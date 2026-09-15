// Estados de una solicitud de agencia, en el orden en que avanza. Los usan la API y el panel admin.
export const ESTADOS_SOLICITUD = [
  { id: 'nueva', nombre: 'Nueva', estilo: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
  { id: 'presupuestada', nombre: 'Presupuestada', estilo: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  { id: 'agendada', nombre: 'Agendada', estilo: 'bg-violet-500/15 text-violet-400 border-violet-500/30' },
  { id: 'completada', nombre: 'Completada', estilo: 'bg-green-500/15 text-green-400 border-green-500/30' },
  { id: 'descartada', nombre: 'Descartada', estilo: 'bg-slate-700/50 text-slate-400 border-slate-600' },
] as const

export function esEstadoSolicitud(valor: unknown): boolean {
  return ESTADOS_SOLICITUD.some((e) => e.id === valor)
}
