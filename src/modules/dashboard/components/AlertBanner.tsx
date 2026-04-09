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
    <div className="rounded-2xl px-5 py-3.5 flex items-center gap-3.5"
      style={{
        background: 'rgba(255,59,48,0.06)',
        border: '1px solid rgba(255,59,48,0.15)',
      }}>
      {/* Icon */}
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{ background: 'rgba(255,59,48,0.1)' }}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
            stroke="#FF3B30" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="12" y1="9" x2="12" y2="13" stroke="#FF3B30" strokeWidth="1.6" strokeLinecap="round"/>
          <line x1="12" y1="17" x2="12.01" y2="17" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[#1D1D1F]">
          {flaggedOrders.length} order cần được xử lý
        </p>
        <p className="text-[12px] text-[#6E6E73] mt-0.5 truncate">
          {shown.map((name, i) => (
            <span key={i}>{name}{i < shown.length - 1 ? ', ' : ''}</span>
          ))}
          {extra > 0 && <span> và {extra} order khác</span>}
        </p>
      </div>

      <button onClick={() => setDismissed(true)}
        className="w-6 h-6 rounded-full flex items-center justify-center text-[#AEAEB2] hover:text-[#6E6E73] shrink-0 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
          <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  )
}
