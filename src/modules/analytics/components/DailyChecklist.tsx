import { useState, useEffect } from 'react'

const DAILY_ITEMS = [
  {
    id: 1,
    label: 'Mở Dashboard',
    hint: 'Xem tổng order · Đang làm · Chờ QA · Đạt · Trễ SLA',
  },
  {
    id: 2,
    label: 'Check task "Sắp trễ" / "Trễ"',
    hint: 'Deadline còn mấy ngày?',
  },
  {
    id: 3,
    label: 'Check task "Chờ QA" tồn đọng',
    hint: 'Task nào Chờ QA > 1 ngày?',
  },
  {
    id: 4,
    label: 'Cập nhật Vòng Revise',
    hint: 'Sau mỗi lần QA feedback: +1',
  },
  {
    id: 5,
    label: 'Ghi Lý do Revise vào Ghi Chú',
    hint: 'Không để trống',
  },
  {
    id: 6,
    label: 'Update Ngày HT khi task Done',
    hint: 'Tracker tự tính SLA',
  },
  {
    id: 7,
    label: 'Check task HIGH Urgency',
    hint: 'Đang ở bước mấy?',
  },
]

function todayKey() {
  const d = new Date()
  return `ndesign_daily_checklist_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function formatToday() {
  return new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' })
}

export default function DailyChecklist() {
  const key = todayKey()
  const [checked, setChecked] = useState<Record<number, boolean>>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? (JSON.parse(stored) as Record<number, boolean>) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(checked))
    } catch {
      // ignore storage errors
    }
  }, [checked, key])

  function toggle(id: number) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function reset() {
    setChecked({})
    try {
      localStorage.removeItem(key)
    } catch {
      // ignore
    }
  }

  const doneCount = DAILY_ITEMS.filter(i => checked[i.id]).length
  const progressPct = Math.round((doneCount / DAILY_ITEMS.length) * 100)

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: 20,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1D1D1F' }}>
            Checklist hàng ngày
          </div>
          <div style={{ fontSize: 11, color: '#AEAEB2', marginTop: 2 }}>
            {formatToday()}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#34C759' }}>
            {doneCount}/7 hoàn thành
          </span>
          <button
            onClick={reset}
            style={{
              padding: '3px 10px',
              borderRadius: 7,
              border: '1px solid rgba(0,0,0,0.10)',
              background: 'transparent',
              fontSize: 11,
              color: '#6E6E73',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 5, borderRadius: 3, background: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${progressPct}%`,
          borderRadius: 3,
          background: progressPct === 100 ? '#34C759' : '#2563EB',
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {DAILY_ITEMS.map((item) => {
          const isChecked = !!checked[item.id]
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '9px 10px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                background: isChecked ? 'rgba(52,199,89,0.06)' : 'transparent',
                textAlign: 'left',
                transition: 'background 0.15s',
              }}
            >
              {/* Custom checkbox */}
              <div style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: isChecked ? 'none' : '2px solid rgba(0,0,0,0.18)',
                background: isChecked ? '#34C759' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 1,
                transition: 'all 0.2s',
              }}>
                {isChecked && (
                  <svg viewBox="0 0 10 8" width="10" height="8">
                    <polyline
                      points="1,4 4,7 9,1"
                      fill="none"
                      stroke="white"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: isChecked ? '#AEAEB2' : '#1D1D1F',
                  textDecoration: isChecked ? 'line-through' : 'none',
                  lineHeight: 1.4,
                }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 11, color: '#AEAEB2', marginTop: 1, lineHeight: 1.3 }}>
                  {item.hint}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
