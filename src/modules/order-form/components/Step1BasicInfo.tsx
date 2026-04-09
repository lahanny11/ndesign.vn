import { useState } from 'react'
import type { OrderFormStep1 } from '../types/order-form.types'

interface Team { id: string; name: string; slug: string; group?: string }
interface Orderer { id: string; display_name: string; team_id: string; team_name: string; role: string }

interface Props {
  data: OrderFormStep1
  onChange: (data: Partial<OrderFormStep1>) => void
  teams: Team[]
  orderers: Orderer[]
}

// ─── Design tokens — dùng nhất quán toàn bộ step ─────────────────────────────
const T = {
  labelSize:   '13px',
  labelWeight: 600,
  labelColor:  '#1D1D1F',
  hintSize:    '12px',
  hintColor:   '#6E6E73',
  inputH:      '44px',
  inputFont:   '14px',
  inputRadius: '10px',
  inputPad:    '0 14px',
  gap:         '20px',
}

const inputBase: React.CSSProperties = {
  width: '100%',
  height: T.inputH,
  background: 'rgba(0,0,0,0.04)',
  border: '1.5px solid transparent',
  borderRadius: T.inputRadius,
  padding: T.inputPad,
  fontSize: T.inputFont,
  color: '#1D1D1F',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'all 0.15s ease',
  appearance: 'none' as const,
  boxSizing: 'border-box' as const,
}
const inputFocus: React.CSSProperties = {
  background: '#fff',
  border: '1.5px solid rgba(94,92,230,0.5)',
  boxShadow: '0 0 0 3px rgba(94,92,230,0.1)',
}
const inputDone: React.CSSProperties = {
  background: 'rgba(52,199,89,0.04)',
  border: '1.5px solid rgba(52,199,89,0.3)',
}

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <div style={{ marginBottom: '8px' }}>
      <span style={{ fontSize: T.labelSize, fontWeight: T.labelWeight, color: T.labelColor }}>
        {text}
      </span>
      {required && <span style={{ color: '#FF3B30', marginLeft: '3px', fontSize: T.labelSize }}>*</span>}
    </div>
  )
}

export default function Step1BasicInfo({ data, onChange, teams, orderers }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [focused, setFocused] = useState<string | null>(null)

  const grouped = teams.reduce<Record<string, Team[]>>((acc, t) => {
    const g = t.group ?? 'Khác'
    if (!acc[g]) acc[g] = []
    acc[g].push(t)
    return acc
  }, {})

  const handleSelectOrderer = (userId: string) => {
    const found = orderers.find(o => o.id === userId)
    if (found) onChange({ orderer_name: found.display_name, team_id: found.team_id })
    else onChange({ orderer_name: '', team_id: '' })
  }

  const s = (field: string, hasValue: boolean): React.CSSProperties => ({
    ...inputBase,
    ...(focused === field ? inputFocus : hasValue ? inputDone : {}),
  })

  const selectedOrderer = orderers.find(o => o.display_name === data.orderer_name)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: T.gap }}>

      {/* Row 1: Người gửi + Team */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

        {/* Người gửi */}
        <div>
          <Label text="Người gửi" required />
          <div style={{ position: 'relative' }}>
            <select
              value={selectedOrderer?.id ?? ''}
              onChange={e => handleSelectOrderer(e.target.value)}
              onFocus={() => setFocused('orderer')}
              onBlur={() => setFocused(null)}
              style={{ ...s('orderer', !!data.orderer_name), paddingRight: '36px', cursor: 'pointer' }}
            >
              <option value="">Chọn người gửi...</option>
              {orderers.map(o => (
                <option key={o.id} value={o.id}>{o.display_name}</option>
              ))}
            </select>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke={data.orderer_name ? '#34C759' : '#AEAEB2'} strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
          {selectedOrderer && (
            <p style={{ fontSize: T.hintSize, color: T.hintColor, marginTop: '5px' }}>
              {selectedOrderer.team_name}
            </p>
          )}
        </div>

        {/* Team */}
        <div>
          <Label text="Team" required />
          <div style={{ position: 'relative' }}>
            <select
              value={data.team_id}
              onChange={e => onChange({ team_id: e.target.value })}
              onFocus={() => setFocused('team')}
              onBlur={() => setFocused(null)}
              style={{ ...s('team', !!data.team_id), paddingRight: '36px', cursor: 'pointer' }}
            >
              <option value="">Chọn team...</option>
              {Object.entries(grouped).map(([group, groupTeams]) => (
                <optgroup key={group} label={group}>
                  {groupTeams.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke={data.team_id ? '#34C759' : '#AEAEB2'} strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Tên dự án */}
      <div>
        <Label text="Tên dự án" required />
        <input
          type="text"
          value={data.task_name}
          onChange={e => onChange({ task_name: e.target.value })}
          onFocus={() => setFocused('task')}
          onBlur={() => setFocused(null)}
          placeholder="VD: Banner Tết 2026 — fanpage Admin"
          maxLength={200}
          style={s('task', data.task_name.length >= 3)}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
          {data.task_name.length > 0 && data.task_name.length < 3
            ? <span style={{ fontSize: T.hintSize, color: '#FF3B30' }}>Tối thiểu 3 ký tự</span>
            : <span />
          }
          <span style={{ fontSize: T.hintSize, color: '#AEAEB2' }}>{data.task_name.length}/200</span>
        </div>
      </div>

      {/* Deadline */}
      <div>
        <Label text="Deadline" required />
        <input
          type="date"
          value={data.deadline}
          min={today}
          onChange={e => onChange({ deadline: e.target.value })}
          onFocus={() => setFocused('deadline')}
          onBlur={() => setFocused(null)}
          style={s('deadline', !!data.deadline)}
        />
        {data.deadline && (
          <p style={{ fontSize: T.hintSize, color: '#34C759', marginTop: '5px' }}>
            Design team sẽ hoàn thành trước ngày này
          </p>
        )}
      </div>

      {/* Urgent toggle */}
      <button
        type="button"
        onClick={() => onChange({ is_urgent: !data.is_urgent })}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderRadius: '12px', padding: '16px 18px', width: '100%',
          textAlign: 'left', cursor: 'pointer',
          background: data.is_urgent ? 'rgba(255,159,10,0.06)' : 'rgba(0,0,0,0.03)',
          border: `1.5px solid ${data.is_urgent ? 'rgba(255,159,10,0.3)' : 'rgba(0,0,0,0.07)'}`,
          transition: 'all 0.15s ease',
        }}
      >
        <div>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#1D1D1F', margin: 0 }}>Yêu cầu gấp</p>
          <p style={{ fontSize: '13px', color: '#6E6E73', margin: '4px 0 0' }}>
            {data.is_urgent ? 'Designer sẽ ưu tiên nhận task này trước' : 'Bật nếu cần hoàn thành sớm hơn thông thường'}
          </p>
        </div>
        <div style={{
          position: 'relative', width: '48px', height: '28px',
          borderRadius: '14px', flexShrink: 0, marginLeft: '16px',
          background: data.is_urgent ? '#FF9F0A' : 'rgba(0,0,0,0.15)',
          transition: 'background 0.2s ease',
        }}>
          <div style={{
            position: 'absolute', width: '24px', height: '24px',
            background: '#fff', borderRadius: '12px', top: '2px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            transform: data.is_urgent ? 'translateX(22px)' : 'translateX(2px)',
            transition: 'transform 0.2s ease',
          }} />
        </div>
      </button>

    </div>
  )
}
