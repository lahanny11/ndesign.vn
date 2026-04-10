import { useEffect, useRef, useState } from 'react'

interface BarItem {
  label: string
  value: number
  color?: string
}

interface BarChartProps {
  items: BarItem[]
  max?: number
  unit?: string
  threshold?: number
}

export default function BarChart({ items, max, unit, threshold }: BarChartProps) {
  const [mounted, setMounted] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => setMounted(true), 50)
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current)
    }
  }, [])

  const computedMax = max ?? Math.max(...items.map(i => i.value), 1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, idx) => {
        const pct = Math.min((item.value / computedMax) * 100, 100)
        const isOverThreshold = threshold !== undefined && item.value > threshold
        const barColor = isOverThreshold ? '#FF3B30' : (item.color ?? '#2563EB')

        return (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Label */}
            <span style={{
              minWidth: 120,
              fontSize: 12,
              color: '#3A3A3C',
              fontWeight: 500,
              textAlign: 'right',
              flexShrink: 0,
              lineHeight: 1.3,
            }}>
              {item.label}
            </span>

            {/* Bar track */}
            <div style={{
              flex: 1,
              height: 8,
              borderRadius: 4,
              background: 'rgba(0,0,0,0.06)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: mounted ? `${pct}%` : '0%',
                borderRadius: 4,
                background: barColor,
                transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
              }} />
            </div>

            {/* Value */}
            <span style={{
              minWidth: 40,
              fontSize: 12,
              color: isOverThreshold ? '#FF3B30' : '#3A3A3C',
              fontWeight: isOverThreshold ? 700 : 500,
              flexShrink: 0,
            }}>
              {item.value}{unit ?? ''}
            </span>
          </div>
        )
      })}
    </div>
  )
}
