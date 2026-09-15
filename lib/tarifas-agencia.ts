// Tarifas por volumen para agencias inmobiliarias (precio por vivienda, + IVA).
// Las usan la página /inmobiliarias, el formulario de solicitud y la API que lo guarda.

export type TramoId = 'start' | 'pro' | 'business' | 'a_medida'

export interface Tramo {
  id: TramoId
  nombre: string
  rango: string
  // null en "A medida": se presupuesta aparte.
  precio: number | null
  popular: boolean
}

export const TRAMOS: Tramo[] = [
  { id: 'start', nombre: 'Start', rango: '1–4 viviendas/mes', precio: 210, popular: false },
  { id: 'pro', nombre: 'Pro', rango: '5–19 viviendas/mes', precio: 165, popular: true },
  { id: 'business', nombre: 'Business', rango: '20–49 viviendas/mes', precio: 135, popular: false },
  { id: 'a_medida', nombre: 'A medida', rango: '50 o más viviendas/mes', precio: null, popular: false },
]

// Los precios cubren hasta este tamaño; por encima se suma SUPLEMENTO_EUROS por cada
// SUPLEMENTO_CADA_M2 adicionales o fracción.
export const METROS_INCLUIDOS = 120
export const SUPLEMENTO_EUROS = 100
export const SUPLEMENTO_CADA_M2 = 100

export const MAX_INMUEBLES = 20

export const FRANJAS = [
  { id: 'manana', nombre: 'Mañana' },
  { id: 'tarde', nombre: 'Tarde' },
  { id: 'indiferente', nombre: 'Indiferente' },
] as const

export type FranjaId = (typeof FRANJAS)[number]['id']

export function getTramo(id: string | null | undefined): Tramo | undefined {
  return TRAMOS.find((t) => t.id === id)
}

// Precio estimado de un inmueble según el tramo y sus m². null si el tramo se presupuesta aparte.
export function precioInmueble(tramo: Tramo, metros: number): number | null {
  if (tramo.precio === null) return null
  const exceso = Math.max(0, metros - METROS_INCLUIDOS)
  return tramo.precio + Math.ceil(exceso / SUPLEMENTO_CADA_M2) * SUPLEMENTO_EUROS
}

// Formato manual (1.250 €) en vez de toLocaleString: el servidor y el navegador pueden
// formatear distinto y React se quejaría al hidratar.
export function formatoEuros(importe: number): string {
  return `${String(Math.round(importe)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} €`
}
