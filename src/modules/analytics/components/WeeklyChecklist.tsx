import { useState, useEffect } from 'react'

const WEEKLY_ITEMS = [
  {
    id: 1,
    label: 'Tổng hợp Dashboard tuần',
    hint: 'Tổng order mới · Done · SLA rate · Revise TB',
  },
  {
    id: 2,
    label: 'Phân tích Revise theo Team YC',
    hint: 'Team nào cao nhất tuần này?',
  },
  {
    id: 3,
    label: 'Phân tích Revise theo Designer',
    hint: 'Designer nào cao? Pattern gì?',
  },
  {
    id: 4,
    label: 'Kiểm tra Brief quality',
    hint: 'Task nào bị trả lại vì brief thiếu?',
  },
  {
    id: 5,
    label: 'Copy task Done vào Lịch sử',
    hint: 'Paste Values Only',
  },
  {
    id: 6,
    label: 'Chạy AI phân tích',
    hint: 'Dùng Prompt Phân tích Production Tuần',
  },
  {
    id: 7,
    label: 'Viết Weekly Report',
    hint: 'Gửi Leader/Operation trước 17h thứ Sáu',
  },
]

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

function weekKey() {
  const d = new Date()
  const wn = getWeekNumber(d)
  return `ndesign_weekly_checklist_${d.getFullYear()}_W${wn}`
}

function getWeekRange() {
  const today = new Date()
  const day = today.getDay() || 7
  const monday = new Date(today)
  monday.setDate(today.getDate() - day + 1)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const fmt = (d: Date) => d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
  const wn = getWeekNumber(today)
  const monthNum = today.getMonth() + 1
  return `Tuần ${wn} — T${monthNum} · ${fmt(monday)} – ${fmt(sunday)}/${sunday.getFullYear()}`
}

export default function WeeklyChecklist() {
  const key = weekKey()
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
      // ignore
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

  const doneCount = WEEKLY_ITEMS.filter(i => checked[i.id]).length
  const progressPct = Math.round((doneCount / WEEKLY_ITEMS.length) * 100)

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
            Checklist hàng tuần
          </div>
          <div style={{ fontSize: 11, color: '#AEAEB2', marginTop: 2 }}>
            {getWeekRange()}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#2563EB' }}>
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
        {WEEKLY_ITEMS.map((item) => {
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
                background: isChecked ? 'rgba(94,92,230,0.05)' : 'transparent',
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
                background: isChecked ? '#2563EB' : 'transparent',
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
