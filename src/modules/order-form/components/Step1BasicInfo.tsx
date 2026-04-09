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

function Field({ label, required, children, hint }: {
  label: string
  required?: boolean
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: '11px', fontWeight: 600,
        color: '#6E6E73', marginBottom: '6px',
        letterSpacing: '0.04em', textTransform: 'uppercase',
      }}>
        {label}
        {required && <span style={{ color: '#FF3B30', marginLeft: '2px' }}>*</span>}
      </label>
      {children}
      {hint && <p style={{ fontSize: '11px', color: '#AEAEB2', marginTop: '5px' }}>{hint}</p>}
    </div>
  )
}

const inputBase: React.CSSProperties = {
  width: '100%', background: 'rgba(0,0,0,0.04)', border: '1px solid transparent',
  borderRadius: '10px', padding: '10px 14px', fontSize: '13px',
  color: '#1D1D1F', fontFamily: 'inherit', outline: 'none',
  transition: 'all 0.15s ease', appearance: 'none' as const,
}
const inputFocus: React.CSSProperties = {
  background: '#fff', border: '1px solid rgba(94,92,230,0.5)',
  boxShadow: '0 0 0 3px rgba(94,92,230,0.1)',
}
const inputDone: React.CSSProperties = {
  background: 'rgba(52,199,89,0.05)', border: '1px solid rgba(52,199,89,0.2)',
}

export default function Step1BasicInfo({ data, onChange, teams, orderers }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [focusedField, setFocusedField] = useState<string | null>(null)

  // Group teams theo organization
  const grouped = teams.reduce<Record<string, Team[]>>((acc, t) => {
    const g = t.group ?? 'Khác'
    if (!acc[g]) acc[g] = []
    acc[g].push(t)
    return acc
  }, {})

  // Khi chọn người gửi → auto-fill team
  const handleSelectOrderer = (userId: string) => {
    const found = orderers.find(o => o.id === userId)
    if (found) {
      onChange({ orderer_name: found.display_name, team_id: found.team_id })
    } else {
      onChange({ orderer_name: '', team_id: '' })
    }
  }

  const getStyle = (field: string, hasValue: boolean): React.CSSProperties => ({
    ...inputBase,
    ...(focusedField === field ? inputFocus : hasValue ? inputDone : {}),
  })

  const selectedOrderer = orderers.find(o => o.display_name === data.orderer_name)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Người gửi + Team — 2 cột */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

        {/* Người gửi — dropdown */}
        <Field label="Người gửi" required>
          <div style={{ position: 'relative' }}>
            <select
              value={selectedOrderer?.id ?? ''}
              onChange={e => handleSelectOrderer(e.target.value)}
              onFocus={() => setFocusedField('orderer')}
              onBlur={() => setFocusedField(null)}
              style={{
                ...getStyle('orderer', !!data.orderer_name),
                paddingRight: '32px',
                cursor: 'pointer',
              }}
            >
              <option value="">Chọn người gửi...</option>
              {orderers.map(o => (
                <option key={o.id} value={o.id}>
                  {o.display_name} ({o.team_name})
                </option>
              ))}
            </select>
            {/* Chevron icon */}
            <svg
              width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke={data.orderer_name ? '#34C759' : '#AEAEB2'}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
          {selectedOrderer && (
            <p style={{ fontSize: '10px', color: '#6E6E73', marginTop: '4px' }}>
              Team: <strong>{selectedOrderer.team_name}</strong>
            </p>
          )}
        </Field>

        {/* Team — tự động fill, có thể chỉnh tay */}
        <Field label="Team" required>
          <div style={{ position: 'relative' }}>
            <select
              value={data.team_id}
              onChange={e => onChange({ team_id: e.target.value })}
              onFocus={() => setFocusedField('team')}
              onBlur={() => setFocusedField(null)}
              style={{
                ...getStyle('team', !!data.team_id),
                paddingRight: '32px',
                cursor: 'pointer',
              }}
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
            <svg
              width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke={data.team_id ? '#34C759' : '#AEAEB2'}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </Field>
      </div>

      {/* Tên dự án */}
      <Field label="Tên dự án" required hint={data.task_name.length > 0 && data.task_name.length < 3 ? 'Tối thiểu 3 ký tự' : ''}>
        <input
          type="text"
          value={data.task_name}
          onChange={e => onChange({ task_name: e.target.value })}
          onFocus={() => setFocusedField('task')}
          onBlur={() => setFocusedField(null)}
          placeholder="VD: Banner Tết 2026 — fanpage Admin"
          maxLength={200}
          style={getStyle('task', data.task_name.length >= 3)}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
          <span style={{ fontSize: '10px', color: '#AEAEB2' }}>{data.task_name.length}/200</span>
        </div>
      </Field>

      {/* Deadline */}
      <Field label="Deadline" required>
        <input
          type="date"
          value={data.deadline}
          min={today}
          onChange={e => onChange({ deadline: e.target.value })}
          onFocus={() => setFocusedField('deadline')}
          onBlur={() => setFocusedField(null)}
          style={getStyle('deadline', !!data.deadline)}
        />
        {data.deadline && (
          <p style={{ fontSize: '11px', color: '#34C759', marginTop: '4px' }}>
            Design team sẽ hoàn thành trước ngày này
          </p>
        )}
      </Field>

      {/* Urgent toggle */}
      <button
        type="button"
        onClick={() => onChange({ is_urgent: !data.is_urgent })}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderRadius: '12px', padding: '14px 16px', width: '100%',
          textAlign: 'left', transition: 'all 0.15s ease', cursor: 'pointer',
          background: data.is_urgent ? 'rgba(255,159,10,0.06)' : 'rgba(0,0,0,0.03)',
          border: `1px solid ${data.is_urgent ? 'rgba(255,159,10,0.25)' : 'rgba(0,0,0,0.06)'}`,
        }}
      >
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#1D1D1F', margin: 0 }}>Yêu cầu gấp</p>
          <p style={{ fontSize: '11px', color: '#6E6E73', margin: '3px 0 0' }}>
            {data.is_urgent ? 'Designer sẽ ưu tiên nhận task này trước' : 'Bật nếu cần giao sớm hơn thông thường'}
          </p>
        </div>
        {/* iOS switch */}
        <div style={{
          position: 'relative', width: '44px', height: '26px',
          borderRadius: '13px', flexShrink: 0,
          background: data.is_urgent ? '#FF9F0A' : 'rgba(0,0,0,0.15)',
          transition: 'background 0.2s ease',
        }}>
          <div style={{
            position: 'absolute', width: '22px', height: '22px',
            background: '#fff', borderRadius: '11px', top: '2px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            transform: data.is_urgent ? 'translateX(20px)' : 'translateX(2px)',
            transition: 'transform 0.2s ease',
          }} />
        </div>
      </button>
    </div>
  )
}
