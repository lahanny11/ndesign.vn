import { useState } from 'react'

interface Props {
  flaggedOrders: string[]
}

export default function AlertBanner({ flaggedOrders }: Props) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed || flaggedOrders.length === 0) return null

  const shown = flaggedOrders.slice(0, 2)
  const extra = flaggedOrders.length - 2

  return (
    <div style={{
      background: 'rgba(225,29,72,0.05)',
      border: '1px solid rgba(225,29,72,0.14)',
      borderRadius: 12,
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    }}>
      {/* Icon */}
      <div style={{
        width: 30, height: 30, borderRadius: '50%',
        background: 'rgba(225,29,72,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            stroke="#E11D48" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="12" y1="9" x2="12" y2="13" stroke="#E11D48" strokeWidth="1.6" strokeLinecap="round"/>
          <line x1="12" y1="17" x2="12.01" y2="17" stroke="#E11D48" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F', margin: 0, lineHeight: 1.3 }}>
          {flaggedOrders.length} order cần được xử lý
        </p>
        <p style={{ fontSize: 12, color: '#6E6E73', margin: '3px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {shown.join(', ')}{extra > 0 ? ` và ${extra} order khác` : ''}
        </p>
      </div>

      <button
        onClick={() => setDismissed(true)}
        style={{
          width: 24, height: 24, borderRadius: '50%',
          border: 'none', background: 'transparent', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#AEAEB2', flexShrink: 0, transition: 'color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#6E6E73')}
        onMouseLeave={e => (e.currentTarget.style.color = '#AEAEB2')}
      >
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
          <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  )
}
