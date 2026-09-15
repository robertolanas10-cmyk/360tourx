// Tarifas por volumen para agencias inmobiliarias (precio por vivienda, IVA incluido).
// Las usan la página /inmobiliarias, el formulario de solicitud y la API que lo guarda.

export type TramoId = 'start' | 'pro' | 'business' | 'a_medida'

export interface Tramo {
  id: TramoId
  nombre: string
  rango: string
  // null en "A medida": se presupuesta aparte.
  precio: number | null
  // Máximo de inmuebles que se pueden pedir con este plan; null = tope general MAX_INMUEBLES.
  maxInmuebles: number | null
  popular: boolean
}

export const TRAMOS: Tramo[] = [
  { id: 'start', nombre: 'Start', rango: '1–4 viviendas/mes', precio: 210, maxInmuebles: 4, popular: false },
  { id: 'pro', nombre: 'Pro', rango: '5–19 viviendas/mes', precio: 165, maxInmuebles: 19, popular: true },
  { id: 'business', nombre: 'Business', rango: '20–49 viviendas/mes', precio: 135, maxInmuebles: 49, popular: false },
  { id: 'a_medida', nombre: 'A medida', rango: '50 o más viviendas/mes', precio: null, maxInmuebles: null, popular: false },
]

// Los precios cubren hasta este tamaño; por encima se suma SUPLEMENTO_EUROS por cada
// SUPLEMENTO_CADA_M2 adicionales o fracción.
export const METROS_INCLUIDOS = 120
export const SUPLEMENTO_EUROS = 100
export const SUPLEMENTO_CADA_M2 = 100

// Tope de seguridad por solicitud para "A medida" (los demás planes tienen su propio máximo).
export const MAX_INMUEBLES = 100

export function maxInmueblesDe(tramo: Tramo): number {
  return tramo.maxInmuebles ?? MAX_INMUEBLES
}

// Hosting para agencias: una única cuota anual por todos los tours de la agencia (no por cada uno),
// desde el primer día. De momento no se cobra online: se acuerda en el presupuesto.
export const HOSTING_AGENCIA_ANUAL = 32.99

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

// Con céntimos (32,99 €), para importes que no son enteros.
export function formatoEurosCentimos(importe: number): string {
  return `${importe.toFixed(2).replace('.', ',')} €`
}

// Formato manual (1.250 €) en vez de toLocaleString: el servidor y el navegador pueden
// formatear distinto y React se quejaría al hidratar.
export function formatoEuros(importe: number): string {
  return `${String(Math.round(importe)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} €`
}
