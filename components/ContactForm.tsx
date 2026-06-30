'use client'

import { useState } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'

interface ContactFormProps {
  showCompanyFields?: boolean
}

export default function ContactForm({ showCompanyFields = false }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    empresa: '',
    posicion: '',
    mensaje: '',
    aceptaTerminos: false,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.aceptaTerminos) {
      alert('Por favor acepta los términos y condiciones')
      return
    }
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="card p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={28} className="text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">¡Mensaje enviado!</h3>
        <p className="text-slate-400">
          Te contactaremos en menos de 24 horas en el email proporcionado.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-slate-400 mb-1.5 block">Nombre *</label>
          <input
            type="text"
            name="nombre"
            required
            value={formData.nombre}
            onChange={handleChange}
            className="input-field"
            placeholder="Juan"
          />
        </div>
        <div>
          <label className="text-sm text-slate-400 mb-1.5 block">Apellido</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            className="input-field"
            placeholder="García"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-slate-400 mb-1.5 block">Email *</label>
        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="input-field"
          placeholder="juan@empresa.com"
        />
      </div>

      <div>
        <label className="text-sm text-slate-400 mb-1.5 block">Teléfono</label>
        <input
          type="tel"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          className="input-field"
          placeholder="+34 600 000 000"
        />
      </div>

      {showCompanyFields && (
        <>
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">Empresa</label>
            <input
              type="text"
              name="empresa"
              value={formData.empresa}
              onChange={handleChange}
              className="input-field"
              placeholder="Inmobiliaria Ejemplo S.L."
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">Posición</label>
            <input
              type="text"
              name="posicion"
              value={formData.posicion}
              onChange={handleChange}
              className="input-field"
              placeholder="Director comercial"
            />
          </div>
        </>
      )}

      <div>
        <label className="text-sm text-slate-400 mb-1.5 block">Mensaje</label>
        <textarea
          name="mensaje"
          rows={4}
          value={formData.mensaje}
          onChange={handleChange}
          className="input-field resize-none"
          placeholder="Cuéntanos sobre tu espacio y qué necesitas..."
        />
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="aceptaTerminos"
          checked={formData.aceptaTerminos}
          onChange={handleChange}
          className="mt-0.5 accent-violet-500"
        />
        <span className="text-sm text-slate-400">
          Acepto los{' '}
          <a href="/terminos" className="text-violet-400 hover:underline">
            términos y condiciones
          </a>{' '}
          y la{' '}
          <a href="/privacidad" className="text-violet-400 hover:underline">
            política de privacidad
          </a>
        </span>
      </label>

      {status === 'error' && (
        <p className="text-red-400 text-sm">
          Hubo un error al enviar el mensaje. Inténtalo de nuevo o contáctanos por teléfono.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Enviando...
          </>
        ) : (
          'Enviar mensaje'
        )}
      </button>
    </form>
  )
}
