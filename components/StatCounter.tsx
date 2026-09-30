'use client'

import { useEffect, useRef, useState } from 'react'

function formatValue(current: number, decimals: number) {
  if (decimals > 0) return current.toFixed(decimals)
  return Math.round(current)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

type StatCounterProps = {
  target: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
}

export default function StatCounter({
  target,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1500,
}: StatCounterProps) {
  const [display, setDisplay] = useState(() => formatValue(0, decimals))
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animated.current) return
        animated.current = true
        observer.disconnect()

        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setDisplay(formatValue(target * eased, decimals))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, decimals, duration])

  return (
    <div ref={ref} className="text-3xl font-bold text-white tabular-nums">
      {prefix}
      {display}
      {suffix}
    </div>
  )
}
