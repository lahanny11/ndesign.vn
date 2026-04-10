import type { TaskTypeMetric } from '../types/analytics.types'

interface DonutChartProps {
  items: TaskTypeMetric[]
}

const COLORS = ['#2563EB', '#007AFF', '#34C759', '#FF9F0A', '#FF3B30']

const CX = 60
const CY = 60
const R = 44
const INNER_R = 28
const CIRCUMFERENCE = 2 * Math.PI * R

export default function DonutChart({ items }: DonutChartProps) {
  const total = items.reduce((s, i) => s + i.count, 0)

  // Build segments
  let offset = -CIRCUMFERENCE / 4  // start at top (12 o'clock)
  const segments = items.map((item, i) => {
    const pct = total > 0 ? item.count / total : 0
    const dash = pct * CIRCUMFERENCE
    const gap = CIRCUMFERENCE - dash
    const startOffset = offset
    offset += dash
    return { item, color: COLORS[i % COLORS.length], dash, gap, offset: startOffset }
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <svg viewBox="0 0 120 120" style={{ width: 120, height: 120, display: 'block', flexShrink: 0 }}>
        {/* Background ring */}
        <circle
          cx={CX} cy={CY} r={R}
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth={R - INNER_R}
        />

        {/* Segments */}
        {segments.map((seg, i) => (
          <circle
            key={i}
            cx={CX} cy={CY} r={R}
            fill="none"
            stroke={seg.color}
            strokeWidth={R - INNER_R}
            strokeDasharray={`${seg.dash} ${seg.gap}`}
            strokeDashoffset={-seg.offset}
            strokeLinecap="butt"
          />
        ))}

        {/* Center total */}
        <text x={CX} y={CY - 5} textAnchor="middle" fontSize="18" fontWeight="700" fill="#1D1D1F">
          {total}
        </text>
        <text x={CX} y={CY + 10} textAnchor="middle" fontSize="8" fill="#6E6E73">
          tasks
        </text>
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, width: '100%' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: COLORS[i % COLORS.length], flexShrink: 0,
            }} />
            <span style={{ fontSize: 11, color: '#3A3A3C', flex: 1, lineHeight: 1.3 }}>{item.type}</span>
            <span style={{ fontSize: 11, color: '#6E6E73', fontWeight: 600 }}>{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
