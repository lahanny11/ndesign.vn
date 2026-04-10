import type { OrderCard as OrderCardType } from '../types/dashboard.types'

// Apple-style status — text only, no dots
const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending:     { label: 'Chờ nhận',    color: '#64748B',  bg: '#F8FAFC' },
  assigned:    { label: 'Đã nhận',     color: '#2563EB',  bg: '#EFF6FF' },
  in_progress: { label: 'Đang làm',    color: '#2563EB',  bg: '#EFF6FF' },
  delivered:   { label: 'Đã giao',     color: '#EA580C',  bg: '#FFF7ED' },
  feedback:    { label: 'Feedback',    color: '#7C3AED',  bg: '#F5F3FF' },
  done:        { label: 'Hoàn thành',  color: '#16A34A',  bg: '#F0FDF4' },
}

// Clean color blocks — no gradients, no patterns
const CARD_COLORS: string[] = [
  '#E8E4F3', '#E4EAF3', '#F3E4E4', '#F3F0E4',
  '#E4F3EC', '#F3E8E4', '#E4EEF3',
]

const PROGRESS_STEPS = ['Gửi', 'Nhận', 'Làm', 'Giao', 'FB', 'Sửa', 'Done']

// Abbreviated product type label
function getTypeLabel(typeName: string): string {
  const map: Record<string, string> = {
    'Social Media': 'Social',
    'LinkedIn': 'LI',
    'YouTube': 'YT',
    'Print': 'Print',
    'Email': 'Email',
    'Mailing List': 'Mail',
    'Custom': 'Custom',
  }
  return map[typeName] ?? typeName.slice(0, 6)
}

// Simple hash → color for avatar
function nameToColor(name: string): string {
  const COLORS = ['#2563EB', '#16A34A', '#EA580C', '#E11D48', '#7C3AED', '#00838F', '#E07B39']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffffff
  return COLORS[Math.abs(hash) % COLORS.length]
}

interface Props {
  order: OrderCardType
  onTrack: (id: string) => void
  index: number
}

export default function OrderCard({ order, onTrack, index }: Props) {
  const st = STATUS_MAP[order.status] ?? STATUS_MAP.pending
  const progress = order.progress ?? 1
  const pct = Math.round((progress / 7) * 100)
  const bgColor = CARD_COLORS[index % CARD_COLORS.length]

  const deadline = new Date(order.deadline)
  const now = new Date()
  const diffMs = deadline.getTime() - now.getTime()
  const diffHours = Math.round(diffMs / (1000 * 60 * 60))
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  const isOverdue = order.is_overdue || diffDays < 0

  // SLA risk: green >2d, orange 1-2d, red <1d or overdue
  const slaColor = isOverdue || diffHours < 24
    ? '#FF3B30'
    : diffDays <= 2
      ? '#FF9F0A'
      : '#34C759'

  // Deadline label
  let deadlineLabel = ''
  let deadlineLabelColor = '#6E6E73'
  if (isOverdue) {
    const absDays = Math.abs(diffDays)
    const absHours = Math.abs(diffHours)
    deadlineLabel = absDays >= 1 ? `Trễ ${absDays} ngày` : `Trễ ${absHours}h`
    deadlineLabelColor = '#FF3B30'
  } else if (diffHours < 24) {
    deadlineLabel = `Còn ${diffHours}h`
    deadlineLabelColor = '#FF9F0A'
  } else if (diffDays <= 3) {
    deadlineLabel = `Còn ${diffDays} ngày`
    deadlineLabelColor = '#FF9F0A'
  }

  // Revision badge
  let revBadge: { label: string; bg: string; color: string } | null = null
  if (order.revision_rounds === 1) {
    revBadge = { label: '1 revise', bg: 'rgba(110,110,115,0.15)', color: '#6E6E73' }
  } else if (order.revision_rounds === 2) {
    revBadge = { label: '2 revise', bg: 'rgba(255,159,10,0.18)', color: '#FF9F0A' }
  } else if (order.revision_rounds >= 3) {
    revBadge = { label: `${order.revision_rounds}+ revise`, bg: 'rgba(255,59,48,0.15)', color: '#FF3B30' }
  }

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 14,
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: order.has_red_flag
          ? '0 0 0 1.5px rgba(255,59,48,0.4), 0 4px 16px rgba(255,59,48,0.08)'
          : order.has_warn_flag
            ? '0 0 0 1.5px rgba(255,159,10,0.4), 0 1px 4px rgba(0,0,0,0.08)'
            : '0 1px 3px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
        if (!order.has_red_flag && !order.has_warn_flag) {
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'
        }
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
        if (!order.has_red_flag && !order.has_warn_flag) {
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)'
        }
      }}
      onClick={() => onTrack(order.id)}
    >
      {/* Color block thumbnail */}
      <div style={{
        height: 80, background: bgColor, position: 'relative',
        flexShrink: 0, display: 'flex', alignItems: 'flex-end', padding: '10px 12px',
      }}>
        {/* Product type badge — top left */}
        <span style={{
          position: 'absolute', top: 8, left: 8,
          fontSize: 9, fontWeight: 700,
          background: 'rgba(0,0,0,0.28)', color: 'white',
          padding: '2px 6px', borderRadius: 4,
        }}>
          {getTypeLabel(order.product_type_name)}
        </span>

        {/* Status badge — bottom left */}
        <span style={{
          fontSize: 10, fontWeight: 600, padding: '3px 8px',
          borderRadius: 6, color: st.color, background: st.bg,
        }}>
          {st.label}
        </span>

        {/* Top right badges */}
        <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
          {/* Revision badge */}
          {revBadge && (
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
              background: revBadge.bg, color: revBadge.color,
            }}>
              {revBadge.label}
            </span>
          )}
          {/* Urgent badge */}
          {order.is_urgent && (
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
              background: 'rgba(255,159,10,0.18)', color: '#FF9F0A',
            }}>
              Urgent
            </span>
          )}
          {/* Flag icons */}
          {order.has_red_flag && (
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              background: 'rgba(255,59,48,0.9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg style={{ width: 10, height: 10 }} fill="none" viewBox="0 0 24 24">
                <line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="17" x2="12.01" y2="17" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
          )}
          {!order.has_red_flag && order.has_warn_flag && (
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              background: 'rgba(255,159,10,0.9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg style={{ width: 10, height: 10 }} fill="none" viewBox="0 0 24 24">
                <line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: '#AEAEB2', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {order.team_name}
          </span>
          <span style={{ fontSize: 10, color: '#AEAEB2' }}>{order.product_size_name}</span>
        </div>

        {/* Task name */}
        <p style={{
          fontSize: 13, fontWeight: 600, color: '#1D1D1F', lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', minHeight: 36, margin: 0,
        }}>
          {order.task_name}
        </p>

        {/* Designer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 18, height: 18, borderRadius: '50%',
            background: order.designer_name ? nameToColor(order.designer_name) : '#AEAEB2',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ color: 'white', fontSize: 9, fontWeight: 700 }}>
              {order.designer_name ? order.designer_name[0] : '?'}
            </span>
          </div>
          {order.designer_name
            ? <span style={{ fontSize: 11, color: '#6E6E73' }}>{order.designer_name}</span>
            : <span style={{ fontSize: 11, color: '#AEAEB2', fontStyle: 'italic' }}>Chưa assign</span>
          }
        </div>

        {/* Progress bar */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: '#AEAEB2' }}>{PROGRESS_STEPS[progress - 1]}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#6E6E73' }}>{pct}%</span>
          </div>
          <div style={{ height: 3, borderRadius: 99, background: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              width: `${pct}%`,
              background: pct === 100 ? '#16A34A' : '#2563EB',
              transition: 'width 0.5s',
            }}/>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 8, borderTop: '1px solid rgba(0,0,0,0.06)',
        }}>
          {/* Deadline with SLA dot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            {/* SLA indicator dot */}
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: slaColor, flexShrink: 0 }}/>
            <div>
              <p style={{ fontSize: 11, color: '#AEAEB2', margin: 0 }}>
                {deadline.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
              </p>
              {deadlineLabel && (
                <p style={{ fontSize: 10, fontWeight: 600, color: deadlineLabelColor, margin: 0 }}>
                  {deadlineLabel}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onTrack(order.id) }}
            style={{
              fontSize: 11, fontWeight: 600, padding: '6px 12px',
              borderRadius: 8, border: 'none', cursor: 'pointer',
              color: '#000', background: 'rgba(0,0,0,0.06)',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.10)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.06)')}
          >
            Chi tiết
          </button>
        </div>
      </div>
    </div>
  )
}
