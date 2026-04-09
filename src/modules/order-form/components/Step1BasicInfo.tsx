import type { OrderFormStep1 } from '../types/order-form.types'

interface Team { id: string; name: string; slug: string }
interface Props {
  data: OrderFormStep1
  onChange: (data: Partial<OrderFormStep1>) => void
  teams: Team[]
  currentUserName: string
}

const fieldCls = `w-full text-[13px] text-[#1D1D1F] outline-none rounded-[10px] px-3.5 py-2.5
  transition-all placeholder:text-[#AEAEB2] font-[inherit]`

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-[#6E6E73] mb-1.5 tracking-wide uppercase" style={{ letterSpacing: '0.04em' }}>
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-[#AEAEB2] mt-1">{hint}</p>}
    </div>
  )
}

const inputStyle = {
  base: { background: 'rgba(0,0,0,0.04)', border: '1px solid transparent' },
  focus: { background: '#fff', border: '1px solid rgba(94,92,230,0.5)', boxShadow: '0 0 0 3px rgba(94,92,230,0.1)' },
  done: { background: 'rgba(52,199,89,0.05)', border: '1px solid rgba(52,199,89,0.2)' },
}

export default function Step1BasicInfo({ data, onChange, teams, currentUserName }: Props) {
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Người gửi">
          <input type="text" value={currentUserName} readOnly
            className={fieldCls}
            style={{ ...inputStyle.base, opacity: 0.6, cursor: 'not-allowed' }}
            placeholder="Đang tải..." />
        </Field>
        <Field label="Team">
          <div className="relative">
            <select value={data.team_id}
              onChange={e => onChange({ team_id: e.target.value })}
              className={fieldCls}
              style={data.team_id ? inputStyle.done : inputStyle.base}
              onFocus={e => Object.assign(e.target.style, inputStyle.focus)}
              onBlur={e => Object.assign(e.target.style, data.team_id ? inputStyle.done : inputStyle.base)}>
              <option value="">Chọn team...</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </Field>
      </div>

      <Field label="Tên dự án" hint={data.task_name.length >= 3 ? '' : 'Đặt tên cụ thể để designer hiểu ngay mục đích'}>
        <input type="text" value={data.task_name}
          onChange={e => onChange({ task_name: e.target.value })}
          placeholder="VD: Banner Tết 2026 — fanpage Admin Nhile"
          className={fieldCls} maxLength={200}
          style={data.task_name.length >= 3 ? inputStyle.done : inputStyle.base}
          onFocus={e => Object.assign(e.target.style, inputStyle.focus)}
          onBlur={e => Object.assign(e.target.style, data.task_name.length >= 3 ? inputStyle.done : inputStyle.base)}
        />
        <div className="flex justify-end mt-1">
          <span className="text-[10px] text-[#AEAEB2]">{data.task_name.length}/200</span>
        </div>
      </Field>

      <Field label="Deadline">
        <input type="date" value={data.deadline} min={today}
          onChange={e => onChange({ deadline: e.target.value })}
          className={fieldCls}
          style={data.deadline ? inputStyle.done : inputStyle.base}
          onFocus={e => Object.assign(e.target.style, inputStyle.focus)}
          onBlur={e => Object.assign(e.target.style, data.deadline ? inputStyle.done : inputStyle.base)}
        />
        {data.deadline && (
          <p className="text-[11px] mt-1" style={{ color: '#34C759' }}>
            Design team sẽ cố hoàn thành trước ngày này
          </p>
        )}
      </Field>

      {/* Urgent toggle — Apple style */}
      <button type="button" onClick={() => onChange({ is_urgent: !data.is_urgent })}
        className="flex items-center justify-between rounded-[12px] p-4 w-full text-left transition-all"
        style={{
          background: data.is_urgent ? 'rgba(255,159,10,0.06)' : 'rgba(0,0,0,0.03)',
          border: `1px solid ${data.is_urgent ? 'rgba(255,159,10,0.25)' : 'rgba(0,0,0,0.06)'}`,
        }}>
        <div>
          <p className="text-[13px] font-semibold text-[#1D1D1F]">Yêu cầu gấp</p>
          <p className="text-[11px] text-[#6E6E73] mt-0.5">
            {data.is_urgent ? 'Designer sẽ ưu tiên nhận task này trước' : 'Bật nếu cần giao sớm hơn thông thường'}
          </p>
        </div>
        {/* iOS switch */}
        <div className="relative w-[44px] h-[26px] rounded-full transition-all duration-200 shrink-0"
          style={{ background: data.is_urgent ? '#FF9F0A' : 'rgba(0,0,0,0.15)' }}>
          <div className="absolute w-[22px] h-[22px] bg-white rounded-full top-[2px] shadow-sm transition-transform duration-200"
            style={{ transform: data.is_urgent ? 'translateX(20px)' : 'translateX(2px)' }}/>
        </div>
      </button>
    </div>
  )
}
