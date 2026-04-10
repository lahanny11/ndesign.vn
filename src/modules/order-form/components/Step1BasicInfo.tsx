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

// ─── Design tokens — Apple HIG ───────────────────────────────────────────────
const T = {
  labelSize:   '11px',
  labelWeight: 600,
  labelColor:  '#6E6E73',
  hintSize:    '11px',
  hintColor:   '#AEAEB2',
  inputH:      '44px',
  inputFont:   '14px',
  inputRadius: '11px',
  inputPad:    '0 14px',
  gap:         '20px',
}

const inputBase: React.CSSProperties = {
  width: '100%',
  height: T.inputH,
  background: '#fff',
  border: '1px solid rgba(0,0,0,0.15)',
  borderRadius: T.inputRadius,
  padding: T.inputPad,
  fontSize: T.inputFont,
  color: '#1D1D1F',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'all 0.15s ease',
  appearance: 'none' as const,
  boxSizing: 'border-box' as const,
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
}
const inputFocus: React.CSSProperties = {
  background: '#fff',
  border: '1.5px solid #1D1D1F',
  boxShadow: '0 0 0 3px rgba(0,0,0,0.06)',
}
const inputDone: React.CSSProperties = {
  background: 'rgba(22,163,74,0.03)',
  border: '1.5px solid rgba(22,163,74,0.4)',
  boxShadow: '0 1px 2px rgba(22,163,74,0.06)',
}

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <div style={{ marginBottom: 7, display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{
        fontSize: T.labelSize, fontWeight: T.labelWeight, color: '#3A3A3C',
        textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>
        {text}
      </span>
      {required && (
        <span style={{
          width: 5, height: 5, borderRadius: '50%',
          background: '#E11D48', display: 'inline-block', flexShrink: 0,
        }}/>
      )}
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
          borderRadius: 12, padding: '14px 16px', width: '100%',
          textAlign: 'left', cursor: 'pointer',
          background: data.is_urgent ? 'rgba(255,159,10,0.05)' : 'rgba(0,0,0,0.03)',
          border: `1px solid ${data.is_urgent ? 'rgba(255,159,10,0.25)' : 'rgba(0,0,0,0.07)'}`,
          transition: 'all 0.15s ease',
        }}
      >
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F', margin: 0, letterSpacing: '-0.01em' }}>Yêu cầu gấp</p>
          <p style={{ fontSize: 11, color: '#6E6E73', margin: '3px 0 0', lineHeight: 1.4 }}>
            {data.is_urgent ? 'Designer sẽ ưu tiên nhận task này trước' : 'Bật nếu cần hoàn thành sớm hơn thông thường'}
          </p>
        </div>
        {/* iOS-style toggle */}
        <div style={{
          position: 'relative', width: 44, height: 26,
          borderRadius: 13, flexShrink: 0, marginLeft: 16,
          background: data.is_urgent ? '#FF9F0A' : 'rgba(0,0,0,0.13)',
          transition: 'background 0.2s ease',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)',
        }}>
          <div style={{
            position: 'absolute', width: 22, height: 22,
            background: '#fff', borderRadius: 11, top: 2,
            boxShadow: '0 1px 4px rgba(0,0,0,0.22)',
            transform: data.is_urgent ? 'translateX(20px)' : 'translateX(2px)',
            transition: 'transform 0.2s ease',
          }} />
        </div>
      </button>

    </div>
  )
}
