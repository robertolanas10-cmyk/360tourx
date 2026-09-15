'use client'

import { useState } from 'react'
import { Loader2, Lock } from 'lucide-react'

export default function BotonPagar({ token, texto }: { token: string; texto: string }) {
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function pagar() {
    setCargando(true)
    setError(null)
    try {
      const res = await fetch(`/api/pago-agencia/${token}`, { method: 'POST' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.url) {
        setError(data.error || 'No se pudo iniciar el pago. Inténtalo de nuevo.')
        setCargando(false)
        return
      }
      window.location.href = data.url
    } catch {
      setError('No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.')
      setCargando(false)
    }
  }

  return (
    <div className="space-y-3">
      <button onClick={pagar} disabled={cargando} className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed">
        {cargando ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Abriendo el pago seguro…
          </>
        ) : (
          <>
            <Lock size={16} />
            {texto}
          </>
        )}
      </button>
      {error && (
        <p role="alert" className="text-red-400 text-sm text-center">
          {error}
        </p>
      )}
    </div>
  )
}
