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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-[17px] font-semibold text-[#1D1D1F] tracking-tight">Danh sách order</h2>
          <p className="text-[12px] text-[#AEAEB2] mt-0.5">{total} order</p>
        </div>

        {/* Tab pills — Apple Segmented Control style */}
        <div className="flex items-center gap-1 p-1 rounded-[10px]"
          style={{ background: 'rgba(0,0,0,0.06)' }}>
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => onChange(tab.key)}
              className={`relative px-3.5 py-1.5 rounded-[8px] text-[12px] font-medium transition-all duration-150
                ${active === tab.key
                  ? 'text-[#1D1D1F] shadow-sm'
                  : tab.danger
                    ? 'text-[#FF3B30] hover:text-[#FF3B30]/80'
                    : 'text-[#6E6E73] hover:text-[#3A3A3C]'
                }`}
              style={active === tab.key ? { background: '#fff' } : {}}>
              {tab.label}
              {tab.key === 'flag' && flagCount > 0 && (
                <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full
                  ${active === 'flag' ? 'bg-[#FF3B30]/10 text-[#FF3B30]' : 'bg-[#FF3B30]/10 text-[#FF3B30]'}`}>
                  {flagCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
