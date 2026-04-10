import type { FilterTab } from '../types/dashboard.types'

interface Props {
  active: FilterTab
  onChange: (tab: FilterTab) => void
  total: number
  flagCount: number
}

const TABS: { key: FilterTab; label: string; danger?: boolean }[] = [
  { key: 'all',     label: 'Tất cả' },
  { key: 'pending', label: 'Chờ nhận' },
  { key: 'active',  label: 'Đang chạy' },
  { key: 'done',    label: 'Hoàn thành' },
  { key: 'flag',    label: 'Cần chú ý', danger: true },
]

export default function FilterTabs({ active, onChange, total, flagCount }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {/* Title + count */}
      <div>
        <h2 style={{
          fontSize: 17,
          fontWeight: 600,
          color: '#1D1D1F',
          margin: 0,
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        }}>
          Danh sách order
        </h2>
        <p style={{ fontSize: 12, color: '#AEAEB2', margin: '3px 0 0' }}>
          {total} order
        </p>
      </div>

      {/* Segmented control — Apple style */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: 3,
        background: 'rgba(0,0,0,0.06)',
        borderRadius: 10,
      }}>
        {TABS.map(tab => {
          const isActive = active === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              style={{
                padding: '6px 13px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: isActive ? 600 : 500,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s',
                background: isActive ? '#fff' : 'transparent',
                color: isActive
                  ? '#1D1D1F'
                  : tab.danger
                    ? '#E11D48'
                    : '#6E6E73',
                boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.10)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              {tab.label}
              {tab.key === 'flag' && flagCount > 0 && (
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '1px 5px',
                  borderRadius: 99,
                  background: isActive ? 'rgba(225,29,72,0.12)' : 'rgba(225,29,72,0.12)',
                  color: '#E11D48',
                  lineHeight: 1.4,
                }}>
                  {flagCount}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
