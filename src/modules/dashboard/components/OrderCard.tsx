import type { OrderCard as OrderCardType } from '../types/dashboard.types'

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending:     { label: 'Chờ nhận',   color: '#64748B', bg: 'rgba(100,116,139,0.09)' },
  assigned:    { label: 'Đã nhận',    color: '#2563EB', bg: 'rgba(37,99,235,0.09)'   },
  in_progress: { label: 'Đang làm',   color: '#2563EB', bg: 'rgba(37,99,235,0.09)'   },
  delivered:   { label: 'Đã giao',    color: '#EA580C', bg: 'rgba(234,88,12,0.09)'   },
  feedback:    { label: 'Feedback',   color: '#7C3AED', bg: 'rgba(124,58,237,0.09)'  },
  done:        { label: 'Hoàn thành', color: '#16A34A', bg: 'rgba(22,163,74,0.09)'   },
}

const CARD_COLORS: string[] = [
  '#EDE9F5', '#E4EAF5', '#F5E4E4', '#F5F1E4',
  '#E4F5ED', '#F5EAE4', '#E4EEF5',
]

const PROGRESS_STEPS = ['Gửi', 'Nhận', 'Làm', 'Giao', 'FB', 'Sửa', 'Done']

function getTypeLabel(typeName: string): string {
  const map: Record<string, string> = {
    'Ảnh Quote / Hình vuông': 'Quote',
    'Banner / Cover': 'Banner',
    'Poster / Dọc': 'Poster',
    'Thumbnail': 'Thumb',
    'Custom / Tuỳ chỉnh': 'Custom',
    'Mailing List': 'Mail',
    'Social Media': 'Social',
    'LinkedIn': 'LI',
    'YouTube': 'YT',
    'Print': 'Print',
    'Email': 'Email',
  }
  return map[typeName] ?? typeName.slice(0, 6)
}

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

  const slaColor = isOverdue || diffHours < 24 ? '#E11D48' : diffDays <= 2 ? '#FF9F0A' : '#16A34A'

  let deadlineLabel = ''
  let deadlineLabelColor = '#6E6E73'
  if (isOverdue) {
    const absDays = Math.abs(diffDays)
    deadlineLabel = absDays >= 1 ? `Trễ ${absDays}N` : `Trễ ${Math.abs(diffHours)}h`
    deadlineLabelColor = '#E11D48'
  } else if (diffHours < 24) {
    deadlineLabel = `Còn ${diffHours}h`
    deadlineLabelColor = '#FF9F0A'
  } else if (diffDays <= 3) {
    deadlineLabel = `Còn ${diffDays}N`
    deadlineLabelColor = '#FF9F0A'
  }

  const borderStyle = order.has_red_flag
    ? '1.5px solid rgba(225,29,72,0.35)'
    : order.has_warn_flag
      ? '1.5px solid rgba(255,159,10,0.35)'
      : '1px solid rgba(0,0,0,0.05)'

  const cardShadow = order.has_red_flag
    ? '0 1px 2px rgba(225,29,72,0.08), 0 0 0 1.5px rgba(225,29,72,0.2)'
    : '0 1px 2px rgba(0,0,0,0.06)'

  return (
    <div
      onClick={() => onTrack(order.id)}
      style={{
        background: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: cardShadow,
        border: borderStyle,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.18s, box-shadow 0.18s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(-2px)'
        el.style.boxShadow = order.has_red_flag
          ? '0 6px 20px rgba(225,29,72,0.12), 0 0 0 1.5px rgba(225,29,72,0.25)'
          : '0 6px 20px rgba(0,0,0,0.10)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = cardShadow
      }}
    >
      {/* Thumbnail */}
      <div style={{
        height: 76,
        background: bgColor,
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '8px 10px',
        flexShrink: 0,
      }}>
        {/* Type label top-left */}
        <span style={{
          position: 'absolute', top: 8, left: 10,
          fontSize: 9, fontWeight: 700,
          padding: '2px 6px', borderRadius: 4,
          background: 'rgba(0,0,0,0.22)', color: '#fff',
          letterSpacing: '0.04em',
        }}>
          {getTypeLabel(order.product_type_name)}
        </span>

        {/* Status pill bottom-left */}
        <span style={{
          fontSize: 10, fontWeight: 600,
          padding: '3px 8px', borderRadius: 6,
          color: st.color, background: st.bg,
        }}>
          {st.label}
        </span>

        {/* Badges top-right */}
        <div style={{
          position: 'absolute', top: 8, right: 8,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {order.revision_rounds > 0 && (
            <span style={{
              fontSize: 9, fontWeight: 700,
              padding: '2px 5px', borderRadius: 4,
              background: order.revision_rounds >= 3
                ? 'rgba(225,29,72,0.15)' : 'rgba(255,159,10,0.15)',
              color: order.revision_rounds >= 3 ? '#E11D48' : '#FF9F0A',
            }}>
              {order.revision_rounds >= 3 ? '3+' : order.revision_rounds} revise
            </span>
          )}
          {order.is_urgent && (
            <span style={{
              fontSize: 9, fontWeight: 700,
              padding: '2px 5px', borderRadius: 4,
              background: 'rgba(255,159,10,0.15)', color: '#FF9F0A',
            }}>
              Gấp
            </span>
          )}
          {order.has_red_flag && (
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              background: '#E11D48',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="9" height="9" fill="none" viewBox="0 0 24 24">
                <line x1="12" y1="8" x2="12" y2="13" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                <circle cx="12" cy="17" r="1.2" fill="white"/>
              </svg>
            </div>
          )}
          {!order.has_red_flag && order.has_warn_flag && (
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              background: '#FF9F0A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="9" height="9" fill="none" viewBox="0 0 24 24">
                <line x1="12" y1="8" x2="12" y2="14" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
        {/* Team + size */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: '#AEAEB2', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {order.team_name}
          </span>
          <span style={{ fontSize: 10, color: '#AEAEB2' }}>{order.product_size_name}</span>
        </div>

        {/* Task name */}
        <p style={{
          fontSize: 13, fontWeight: 600, color: '#1D1D1F', lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', minHeight: 37, margin: 0,
        }}>
          {order.task_name}
        </p>

        {/* Designer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 18, height: 18, borderRadius: '50%',
            background: order.designer_name ? nameToColor(order.designer_name) : '#E5E7EB',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
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

        {/* Progress */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 10, color: '#AEAEB2' }}>{PROGRESS_STEPS[progress - 1]}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#6E6E73', fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
          </div>
          <div style={{ height: 3, borderRadius: 99, background: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99, width: `${pct}%`,
              background: pct === 100 ? '#16A34A' : '#2563EB',
              transition: 'width 0.5s',
            }}/>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 9, borderTop: '1px solid rgba(0,0,0,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: slaColor, flexShrink: 0 }}/>
            <div>
              <p style={{ fontSize: 11, color: '#AEAEB2', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
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
            onClick={e => { e.stopPropagation(); onTrack(order.id) }}
            style={{
              fontSize: 11, fontWeight: 600, padding: '6px 11px',
              borderRadius: 8, border: 'none', cursor: 'pointer',
              color: '#1D1D1F', background: 'rgba(0,0,0,0.06)',
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
