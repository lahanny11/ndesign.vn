import type { OrderDetail, TimelineStep } from '../types/tracking.types'
import OrderChat from './OrderChat'

interface Props {
  order: OrderDetail | null
  open: boolean
  onClose: () => void
}

function CheckIcon({ ok }: { ok: boolean | null }) {
  if (ok === true) return (
    <svg className="w-3.5 h-3.5 stroke-[#16A34A] fill-none stroke-[2.5] shrink-0 mt-px" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
  if (ok === false) return (
    <svg className="w-3.5 h-3.5 stroke-[#E11D48] fill-none stroke-[2.5] shrink-0 mt-px" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
  return (
    <svg className="w-3.5 h-3.5 stroke-[#D1D5DB] fill-none stroke-2 shrink-0 mt-px" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9"/>
    </svg>
  )
}

function Step({ step, isLast }: { step: TimelineStep; isLast: boolean }) {
  const dotCls = {
    done:    'bg-[#16A34A] border-[#16A34A]',
    active:  'bg-[#2563EB] border-[#2563EB]',
    flagged: 'bg-[#E11D48] border-[#E11D48]',
    pending: 'bg-[#F3F4F6] border-[#E5E7EB]',
  }[step.state]

  const lineCls = {
    done:    'bg-[#16A34A]',
    active:  'bg-gradient-to-b from-[#2563EB] to-[#E5E7EB]',
    flagged: 'bg-[#E11D48]',
    pending: 'bg-[#E5E7EB]',
  }[step.state]

  const nameCls = step.state === 'pending' ? 'text-[#9CA3AF] font-medium' : 'text-[#1D1D1F] font-bold'

  const timeCls = step.timeClass === 'late'
    ? 'text-[#E11D48] font-bold'
    : step.timeClass === 'early'
      ? 'text-[#16A34A] font-bold'
      : 'text-[#9CA3AF]'

  return (
    <div className="flex gap-3 relative">
      {/* Vertical line */}
      {!isLast && (
        <div className={`absolute left-[13px] top-[26px] bottom-[-6px] w-px z-0 ${lineCls}`}/>
      )}

      {/* Dot */}
      <div className="shrink-0 w-[27px] flex justify-center pt-px z-10">
        <div className={`w-[27px] h-[27px] rounded-full flex items-center justify-center border-2 ${dotCls}`}>
          {step.state === 'done' && (
            <svg className="w-3 h-3 stroke-white fill-none stroke-[2.5]" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          )}
          {step.state === 'active' && (
            <svg className="w-3 h-3 stroke-white fill-none stroke-[2.5]" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          )}
          {step.state === 'flagged' && (
            <svg className="w-3 h-3 stroke-white fill-none stroke-[2.5]" viewBox="0 0 24 24"><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          )}
          {step.state === 'pending' && (
            <svg className="w-3 h-3 stroke-[#A89EC0] fill-none stroke-2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/></svg>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-[18px]">
        <div className="flex items-center justify-between mb-0.5 gap-1.5">
          <span className={`text-[12px] ${nameCls}`}>{step.name}</span>
          {step.time && <span className={`text-[10px] shrink-0 ${timeCls}`}>{step.time}</span>}
        </div>

        {step.desc && (
          <p className="text-[11px] text-[#6B7280] leading-relaxed mb-1.5">{step.desc}</p>
        )}

        {step.checks.length > 0 && (
          <div className="flex flex-col gap-1 mb-2">
            {step.checks.map((c, i) => (
              <div key={i} className={`flex items-start gap-1.5 text-[10px] leading-snug ${c.ok === false ? 'text-[#E11D48]' : 'text-[#6B7280]'}`}>
                <CheckIcon ok={c.ok}/>
                <span>{c.text}</span>
              </div>
            ))}
          </div>
        )}

        {step.actions && step.actions.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mt-1">
            {step.actions.map((action, i) => (
              <button
                key={i}
                className={`px-2.5 py-1 rounded-[7px] border-[1.5px] text-[10px] font-semibold transition-all
                  ${action.includes('🚨') || action.includes('Báo')
                    ? 'border-[#E11D48] text-[#E11D48] hover:bg-[#FFF1F2]'
                    : i === 0
                      ? 'bg-[#2563EB] text-white border-[#2563EB] hover:opacity-90'
                      : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#2563EB] hover:text-[#2563EB]'
                  }`}
              >
                {action}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function TrackingPanel({ order, open, onClose }: Props) {
  if (!order) return null

  const isLate = order.metrics.ontime.includes('Trễ') || order.metrics.ontime.includes('QUÁ')
  const isEarly = order.metrics.ontime.includes('Sớm')
  const metricDeadlineBg = isLate
    ? 'bg-[#FFF1F2] border-[#FECACA]'
    : isEarly
      ? 'bg-[#F0FDF4] border-[#BBF7D0]'
      : 'bg-[#F5F5F7] border-[#F3F4F6]'

  const metricDeadlineVal = isLate
    ? 'text-[#E11D48]'
    : isEarly
      ? 'text-[#16A34A]'
      : 'text-[#1D1D1F]'

  const roundsBg = order.metrics.rounds > 2
    ? 'bg-[#FFF1F2] border-[#FECACA]'
    : 'bg-[#F5F5F7] border-[#F3F4F6]'
  const roundsVal = order.metrics.rounds > 2 ? 'text-[#E11D48]' : 'text-[#1D1D1F]'

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 z-50 transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[480px] bg-white border-l border-[#E5E7EB] flex flex-col
          shadow-[-8px_0_40px_rgba(0,0,0,0.12)] z-[51] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-start gap-2.5 px-[18px] py-4 border-b border-[#E5E7EB] shrink-0">
          <div className="flex-1">
            <h3 className="text-[13px] font-bold text-[#1D1D1F] leading-snug mb-0.5">{order.title}</h3>
            <p className="text-[11px] text-[#9CA3AF]">
              {order.type} · {order.team} · Designer: {order.designer ?? 'Chưa assign'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#1D1D1F] transition-all shrink-0"
          >
            <svg className="w-3 h-3 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Scroll area */}
        <div className="flex-1 overflow-y-auto px-[18px] py-4 scrollbar-thin scrollbar-thumb-[#E5E7EB]">

          {/* Flag alerts */}
          {order.flag === 'red' && order.redFlags && (
            <div className="bg-[#FFF1F2] border border-[#FECACA] rounded-[10px] p-3 mb-3.5 flex items-start gap-2 text-[11px] text-[#E11D48] leading-relaxed">
              <svg className="w-3.5 h-3.5 stroke-current fill-none stroke-2 shrink-0 mt-0.5" viewBox="0 0 24 24">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <div>
                <b className="block mb-1">Cờ đỏ — Cần can thiệp ngay</b>
                <ul className="list-disc pl-3 flex flex-col gap-0.5">
                  {order.redFlags.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            </div>
          )}

          {order.flag === 'warn' && order.redFlags && (
            <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-[10px] p-3 mb-3.5 flex items-start gap-2 text-[11px] text-[#EA580C] leading-relaxed">
              <svg className="w-3.5 h-3.5 stroke-current fill-none stroke-2 shrink-0 mt-0.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <div>
                <b className="block mb-1">Cảnh báo</b>
                <ul className="list-disc pl-3 flex flex-col gap-0.5">
                  {order.redFlags.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            </div>
          )}

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className={`rounded-[9px] p-2.5 border text-center ${roundsBg}`}>
              <div className={`text-[17px] font-bold tracking-tight leading-none ${roundsVal}`}>{order.metrics.rounds}</div>
              <div className="text-[9px] text-[#9CA3AF] mt-0.5 font-semibold uppercase tracking-wide">Revision</div>
            </div>
            <div className={`rounded-[9px] p-2.5 border text-center ${metricDeadlineBg}`}>
              <div className={`text-[11px] font-bold leading-tight ${metricDeadlineVal}`}>{order.metrics.ontime}</div>
              <div className="text-[9px] text-[#9CA3AF] mt-0.5 font-semibold uppercase tracking-wide">Deadline</div>
            </div>
            <div className="rounded-[9px] p-2.5 border border-[#F3F4F6] bg-[#F5F5F7] text-center">
              <div className="text-[17px] font-bold tracking-tight leading-none text-[#1D1D1F]">{order.metrics.comms}</div>
              <div className="text-[9px] text-[#9CA3AF] mt-0.5 font-semibold uppercase tracking-wide">Comms</div>
            </div>
          </div>

          {/* Timeline label */}
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF] mb-2.5">
            Timeline
            <div className="flex-1 h-px bg-[#F3F4F6]"/>
          </div>

          {/* Timeline */}
          <div className="flex flex-col">
            {order.steps.map((step, i) => (
              <Step key={step.id} step={step} isLast={i === order.steps.length - 1} />
            ))}
          </div>

          {/* Divider */}
          <div className="my-4" style={{ height: 1, background: 'rgba(0,0,0,0.08)' }}/>

          {/* Chat */}
          <OrderChat orderId={order.id} />
        </div>
      </div>
    </>
  )
}
