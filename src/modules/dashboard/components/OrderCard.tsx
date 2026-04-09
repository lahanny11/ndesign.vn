import type { OrderCard as OrderCardType } from '../types/dashboard.types'

// Apple-style status — text only, no dots
const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending:     { label: 'Chờ nhận',    color: '#6E6E73',  bg: 'rgba(0,0,0,0.06)' },
  assigned:    { label: 'Đã nhận',     color: '#5E5CE6',  bg: 'rgba(94,92,230,0.1)' },
  in_progress: { label: 'Đang làm',    color: '#5E5CE6',  bg: 'rgba(94,92,230,0.1)' },
  delivered:   { label: 'Đã giao',     color: '#FF9F0A',  bg: 'rgba(255,159,10,0.1)' },
  feedback:    { label: 'Feedback',    color: '#AF52DE',  bg: 'rgba(175,82,222,0.1)' },
  done:        { label: 'Hoàn thành',  color: '#34C759',  bg: 'rgba(52,199,89,0.1)' },
}

// Clean color blocks — no gradients, no patterns
const CARD_COLORS: string[] = [
  '#E8E4F3', '#E4EAF3', '#F3E4E4', '#F3F0E4',
  '#E4F3EC', '#F3E8E4', '#E4EEF3',
]

const PROGRESS_STEPS = ['Gửi', 'Nhận', 'Làm', 'Giao', 'FB', 'Sửa', 'Done']

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
  const diffDays = Math.round((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  const isOverdue = order.is_overdue || diffDays < 0
  const isSoon = !isOverdue && diffDays <= 3

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden cursor-pointer flex flex-col
        transition-all duration-200 hover:-translate-y-1"
      style={{
        boxShadow: order.has_red_flag
          ? '0 0 0 1.5px rgba(255,59,48,0.4), 0 4px 16px rgba(255,59,48,0.08)'
          : '0 1px 4px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
      }}
      onClick={() => onTrack(order.id)}
    >
      {/* Color block thumbnail — clean, no pattern */}
      <div className="h-[80px] relative flex-shrink-0 flex items-end p-3"
        style={{ background: bgColor }}>
        {/* Status badge */}
        <span className="text-[10px] font-semibold px-2 py-1 rounded-[6px]"
          style={{ color: st.color, background: st.bg }}>
          {st.label}
        </span>

        {/* Badges top right */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
          {order.is_urgent && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md text-[#FF9F0A]"
              style={{ background: 'rgba(255,159,10,0.12)' }}>
              Urgent
            </span>
          )}
          {order.has_red_flag && (
            <div className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,59,48,0.9)' }}>
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24">
                <line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="17" x2="12.01" y2="17" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
          )}
          {!order.has_red_flag && order.has_warn_flag && (
            <div className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,159,10,0.9)' }}>
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24">
                <line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-3.5 py-3 flex flex-col flex-1 gap-2.5">
        {/* Meta */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: '#AEAEB2', letterSpacing: '0.06em' }}>
            {order.team_name}
          </span>
          <span className="text-[10px] text-[#AEAEB2]">{order.product_size_name}</span>
        </div>

        {/* Task name */}
        <p className="text-[13px] font-semibold text-[#1D1D1F] leading-snug"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: 36,
          }}>
          {order.task_name}
        </p>

        {/* Designer */}
        {order.designer_name && (
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold shrink-0"
              style={{ background: '#5E5CE6' }}>
              {order.designer_name[0]}
            </div>
            <span className="text-[11px] text-[#6E6E73]">{order.designer_name}</span>
          </div>
        )}

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-[#AEAEB2]">{PROGRESS_STEPS[progress - 1]}</span>
            <span className="text-[10px] font-semibold text-[#6E6E73]">{pct}%</span>
          </div>
          <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: pct === 100 ? '#34C759' : '#5E5CE6',
              }}/>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2"
          style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <div>
            <p className="text-[11px] text-[#AEAEB2]">
              {deadline.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
            </p>
            {isOverdue && (
              <p className="text-[10px] font-semibold" style={{ color: '#FF3B30' }}>
                Trễ {Math.abs(diffDays)} ngày
              </p>
            )}
            {isSoon && !isOverdue && (
              <p className="text-[10px] font-semibold" style={{ color: '#FF9F0A' }}>
                Còn {diffDays} ngày
              </p>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onTrack(order.id) }}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-[8px] transition-all active:scale-95"
            style={{
              color: '#5E5CE6',
              background: 'rgba(94,92,230,0.08)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(94,92,230,0.14)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(94,92,230,0.08)')}
          >
            Chi tiết
          </button>
        </div>
      </div>
    </div>
  )
}
