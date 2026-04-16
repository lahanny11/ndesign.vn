import type { OrderDetail, TimelineStep } from '../types/tracking.types'
import OrderChat from './OrderChat'
import DeliverySection from './DeliverySection'

interface Props {
  order: OrderDetail | null
  open: boolean
  onClose: () => void
}

function CheckIcon({ ok }: { ok: boolean | null }) {
  if (ok === true) return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
      <polyline points="20 6 9 17 4 12" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
  if (ok === false) return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
      <line x1="18" y1="6" x2="6" y2="18" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="6" y1="6" x2="18" y2="18" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
      <circle cx="12" cy="12" r="9" stroke="#D1D5DB" strokeWidth="2"/>
    </svg>
  )
}

const DOT_STYLES: Record<string, React.CSSProperties> = {
  done:    { background: '#16A34A', border: '2px solid #16A34A' },
  active:  { background: '#2563EB', border: '2px solid #2563EB' },
  flagged: { background: '#E11D48', border: '2px solid #E11D48' },
  pending: { background: '#F3F4F6', border: '2px solid #E5E7EB' },
}

const LINE_BG: Record<string, string> = {
  done:    '#D1FAE5',
  active:  'linear-gradient(to bottom, #BFDBFE, #E5E7EB)',
  flagged: '#FECACA',
  pending: '#F3F4F6',
}

function Step({ step, isLast }: { step: TimelineStep; isLast: boolean }) {
  const dotStyle = DOT_STYLES[step.state] ?? DOT_STYLES.pending
  const nameColor = step.state === 'pending' ? '#9CA3AF' : '#1D1D1F'
  const nameWeight = step.state === 'pending' ? 500 : 600

  const timeColor = step.timeClass === 'late'
    ? '#E11D48' : step.timeClass === 'early'
      ? '#16A34A' : '#9CA3AF'
  const timeWeight = step.timeClass === 'late' || step.timeClass === 'early' ? 600 : 400

  return (
    <div style={{ display: 'flex', gap: 12, position: 'relative' }}>
      {/* Vertical line */}
      {!isLast && (
        <div style={{
          position: 'absolute',
          left: 13, top: 28, bottom: -6,
          width: 1, zIndex: 0,
          background: LINE_BG[step.state] ?? LINE_BG.pending,
        }}/>
      )}

      {/* Dot */}
      <div style={{ flexShrink: 0, width: 27, display: 'flex', justifyContent: 'center', paddingTop: 1, zIndex: 1 }}>
        <div style={{
          width: 27, height: 27, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          ...dotStyle,
        }}>
          {step.state === 'done' && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {step.state === 'active' && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {step.state === 'flagged' && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
              <line x1="12" y1="17" x2="12.01" y2="17" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          )}
          {step.state === 'pending' && (
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="4" stroke="#C7C7CC" strokeWidth="2"/>
            </svg>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, paddingBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2, gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: nameWeight, color: nameColor, letterSpacing: '-0.01em' }}>
            {step.name}
          </span>
          {step.time && (
            <span style={{ fontSize: 10, color: timeColor, fontWeight: timeWeight, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
              {step.time}
            </span>
          )}
        </div>

        {step.desc && (
          <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.5, margin: '0 0 8px' }}>{step.desc}</p>
        )}

        {step.checks.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
            {step.checks.map((c, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 6,
                fontSize: 10, lineHeight: 1.4,
                color: c.ok === false ? '#E11D48' : '#6B7280',
              }}>
                <CheckIcon ok={c.ok}/>
                <span>{c.text}</span>
              </div>
            ))}
          </div>
        )}

        {step.actions && step.actions.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
            {step.actions.map((action, i) => {
              const isDanger = action.includes('Báo') || action.includes('🚨')
              const isPrimary = i === 0 && !isDanger
              return (
                <button
                  key={i}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 600,
                    border: isDanger
                      ? '1.5px solid rgba(225,29,72,0.3)'
                      : isPrimary
                        ? 'none'
                        : '1.5px solid rgba(0,0,0,0.12)',
                    background: isPrimary ? '#1D1D1F' : 'transparent',
                    color: isDanger ? '#E11D48' : isPrimary ? '#fff' : '#6E6E73',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    letterSpacing: '-0.01em',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget
                    if (isDanger) el.style.background = 'rgba(225,29,72,0.05)'
                    else if (!isPrimary) el.style.background = 'rgba(0,0,0,0.04)'
                    else el.style.opacity = '0.8'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget
                    el.style.background = isPrimary ? '#1D1D1F' : 'transparent'
                    el.style.opacity = '1'
                  }}
                >
                  {action}
                </button>
              )
            })}
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
  const deadlineBg = isLate ? 'rgba(225,29,72,0.06)' : isEarly ? 'rgba(22,163,74,0.06)' : 'rgba(0,0,0,0.03)'
  const deadlineBorder = isLate ? 'rgba(225,29,72,0.18)' : isEarly ? 'rgba(22,163,74,0.18)' : 'rgba(0,0,0,0.07)'
  const deadlineVal = isLate ? '#E11D48' : isEarly ? '#16A34A' : '#1D1D1F'

  const reviseAlert = order.metrics.rounds > 2
  const reviseBg = reviseAlert ? 'rgba(225,29,72,0.06)' : 'rgba(0,0,0,0.03)'
  const reviseBorder = reviseAlert ? 'rgba(225,29,72,0.18)' : 'rgba(0,0,0,0.07)'
  const reviseVal = reviseAlert ? '#E11D48' : '#1D1D1F'

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.22)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          zIndex: 50,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Panel */}
      <div className="tracking-panel" style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 480,
        background: '#fff',
        borderLeft: '1px solid rgba(0,0,0,0.07)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-12px 0 48px rgba(0,0,0,0.12)',
        zIndex: 51,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>

        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontSize: 14, fontWeight: 600, color: '#1D1D1F',
              margin: 0, lineHeight: 1.3, letterSpacing: '-0.02em',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {order.title}
            </h3>
            <p style={{ fontSize: 11, color: '#AEAEB2', margin: '4px 0 0' }}>
              {order.type}
              <span style={{ margin: '0 5px', color: '#D1D5DB' }}>·</span>
              {order.team}
              <span style={{ margin: '0 5px', color: '#D1D5DB' }}>·</span>
              {order.designer
                ? <span style={{ color: '#6E6E73' }}>{order.designer}</span>
                : <span style={{ color: '#AEAEB2', fontStyle: 'italic' }}>Chưa assign</span>
              }
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: '50%',
              border: '1px solid rgba(0,0,0,0.08)',
              background: 'rgba(0,0,0,0.03)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0, color: '#AEAEB2',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(0,0,0,0.07)'
              e.currentTarget.style.color = '#1D1D1F'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(0,0,0,0.03)'
              e.currentTarget.style.color = '#AEAEB2'
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>

          {/* Flag alerts */}
          {order.flag === 'red' && order.redFlags && (
            <div style={{
              background: 'rgba(225,29,72,0.05)',
              border: '1px solid rgba(225,29,72,0.16)',
              borderRadius: 12,
              padding: '12px 14px',
              marginBottom: 14,
              display: 'flex', alignItems: 'flex-start', gap: 10,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'rgba(225,29,72,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#E11D48" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="9" x2="12" y2="13" stroke="#E11D48" strokeWidth="1.8" strokeLinecap="round"/>
                  <line x1="12" y1="17" x2="12.01" y2="17" stroke="#E11D48" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#E11D48', margin: '0 0 4px' }}>Cờ đỏ — Cần can thiệp ngay</p>
                <ul style={{ margin: 0, padding: '0 0 0 14px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {order.redFlags.map((f, i) => (
                    <li key={i} style={{ fontSize: 11, color: '#6E6E73', lineHeight: 1.4 }}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {order.flag === 'warn' && order.redFlags && (
            <div style={{
              background: 'rgba(255,159,10,0.05)',
              border: '1px solid rgba(255,159,10,0.2)',
              borderRadius: 12,
              padding: '12px 14px',
              marginBottom: 14,
              display: 'flex', alignItems: 'flex-start', gap: 10,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'rgba(255,159,10,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#FF9F0A" strokeWidth="1.8"/>
                  <line x1="12" y1="8" x2="12" y2="12" stroke="#FF9F0A" strokeWidth="1.8" strokeLinecap="round"/>
                  <line x1="12" y1="16" x2="12.01" y2="16" stroke="#FF9F0A" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#FF9F0A', margin: '0 0 4px' }}>Cảnh báo</p>
                <ul style={{ margin: 0, padding: '0 0 0 14px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {order.redFlags.map((f, i) => (
                    <li key={i} style={{ fontSize: 11, color: '#6E6E73', lineHeight: 1.4 }}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Metrics — 3 col grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
            {/* Revision */}
            <div style={{
              padding: '12px 10px', borderRadius: 12, textAlign: 'center',
              background: reviseBg, border: `1px solid ${reviseBorder}`,
            }}>
              <div style={{
                fontSize: 22, fontWeight: 700, color: reviseVal, lineHeight: 1,
                letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums',
              }}>
                {order.metrics.rounds}
              </div>
              <div style={{
                fontSize: 9, fontWeight: 600, color: '#AEAEB2', marginTop: 4,
                textTransform: 'uppercase', letterSpacing: '0.07em',
              }}>
                Revision
              </div>
            </div>

            {/* Deadline */}
            <div style={{
              padding: '12px 10px', borderRadius: 12, textAlign: 'center',
              background: deadlineBg, border: `1px solid ${deadlineBorder}`,
            }}>
              <div style={{
                fontSize: 13, fontWeight: 700, color: deadlineVal, lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}>
                {order.metrics.ontime}
              </div>
              <div style={{
                fontSize: 9, fontWeight: 600, color: '#AEAEB2', marginTop: 4,
                textTransform: 'uppercase', letterSpacing: '0.07em',
              }}>
                Deadline
              </div>
            </div>

            {/* Comms */}
            <div style={{
              padding: '12px 10px', borderRadius: 12, textAlign: 'center',
              background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.07)',
            }}>
              <div style={{
                fontSize: 22, fontWeight: 700, color: '#1D1D1F', lineHeight: 1,
                letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums',
              }}>
                {order.metrics.comms}
              </div>
              <div style={{
                fontSize: 9, fontWeight: 600, color: '#AEAEB2', marginTop: 4,
                textTransform: 'uppercase', letterSpacing: '0.07em',
              }}>
                Comms
              </div>
            </div>
          </div>

          {/* Timeline label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{
              fontSize: 10, fontWeight: 600, color: '#AEAEB2',
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              Timeline
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.07)' }}/>
          </div>

          {/* Timeline steps */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {order.steps.map((step, i) => (
              <Step key={step.id} step={step} isLast={i === order.steps.length - 1} />
            ))}
          </div>

          {/* Delivery section */}
          <DeliverySection orderId={order.id} orderStatus={order.status} />

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(0,0,0,0.07)', margin: '16px 0' }}/>

          {/* Chat */}
          <OrderChat orderId={order.id} />
        </div>
      </div>
    </>
  )
}
