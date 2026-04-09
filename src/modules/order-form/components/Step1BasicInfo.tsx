import type { OrderFormStep1 } from '../types/order-form.types'

interface Team { id: string; name: string; slug: string }

interface Props {
  data: OrderFormStep1
  onChange: (data: Partial<OrderFormStep1>) => void
  teams: Team[]
  currentUserName: string
}

const inputCls = `w-full bg-[#FAFAF9] border-[1.5px] border-[#E4E0EF] rounded-xl px-3.5 py-2.5
  text-[13px] text-[#2D2D3A] font-[inherit] outline-none transition-all
  focus:border-[#7B8EF7] focus:bg-white focus:shadow-[0_0_0_3px_rgba(123,142,247,0.08)]`

function FieldCheck({ ok }: { ok: boolean }) {
  if (!ok) return null
  return (
    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#E4F5F0] ml-1.5">
      <svg className="w-2.5 h-2.5 stroke-[#5BB89A] fill-none stroke-[2.5]" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
    </span>
  )
}

export default function Step1BasicInfo({ data, onChange, teams, currentUserName }: Props) {
  const today = new Date().toISOString().split('T')[0]

  // Fill count for progress indicator
  const filled = [
    !!data.task_name.trim() && data.task_name.length >= 3,
    !!data.team_id,
    !!data.deadline,
  ].filter(Boolean).length

  return (
    <div className="flex flex-col gap-4">
      {/* Progress indicator */}
      <div className="flex items-center gap-3 bg-[#F8F7FD] rounded-xl px-4 py-3 border border-[#EDEAF7]">
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div key={i} className={`w-8 h-1.5 rounded-full transition-all duration-300
              ${i < filled ? 'bg-[#7B8EF7]' : 'bg-[#E4E0EF]'}`}/>
          ))}
        </div>
        <p className="text-[10px] font-semibold text-[#8B82C4]">
          {filled === 3 ? '✓ Đủ thông tin rồi!' : `${filled}/3 thông tin đã điền`}
        </p>
      </div>

      {/* Người order + Team */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="flex items-center text-[10px] font-bold uppercase tracking-[0.08em] text-[#A89EC0] mb-1.5">
            Người gửi yêu cầu
          </label>
          <input type="text" value={currentUserName} readOnly
            className={`${inputCls} opacity-60 cursor-not-allowed`}
            placeholder="Đang tải..." />
          <p className="text-[9px] text-[#C4BEDD] mt-1">Tự động lấy từ tài khoản của bạn</p>
        </div>
        <div>
          <label className="flex items-center text-[10px] font-bold uppercase tracking-[0.08em] text-[#A89EC0] mb-1.5">
            Team của bạn <FieldCheck ok={!!data.team_id} />
          </label>
          <select value={data.team_id} onChange={e => onChange({ team_id: e.target.value })}
            className={`${inputCls} ${data.team_id ? 'border-[#C4E8DA] bg-[#F8FDF9]' : ''}`}
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24'%3E%3Cpolyline points='6 9 12 15 18 9' fill='none' stroke='%23bbb' stroke-width='2'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 30, appearance: 'none' }}>
            <option value="">Chọn team...</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>

      {/* Tên task */}
      <div>
        <label className="flex items-center text-[10px] font-bold uppercase tracking-[0.08em] text-[#A89EC0] mb-1.5">
          Tên dự án / Task <FieldCheck ok={!!data.task_name.trim() && data.task_name.length >= 3} />
        </label>
        <input type="text" value={data.task_name}
          onChange={e => onChange({ task_name: e.target.value })}
          placeholder="VD: Banner Tết 2026 cho fanpage Admin Nhile..."
          className={`${inputCls} ${data.task_name.length >= 3 ? 'border-[#C4E8DA] bg-[#F8FDF9]' : ''}`}
          maxLength={200} />
        <div className="flex items-center justify-between mt-1">
          <p className="text-[9px] text-[#C4BEDD]">
            {data.task_name.length < 3
              ? 'Tên cụ thể giúp designer hiểu ngay mục đích 🎯'
              : '✓ Tên dự án đã rõ ràng!'}
          </p>
          <p className="text-[9px] text-[#A89EC0]">{data.task_name.length}/200</p>
        </div>
      </div>

      {/* Deadline */}
      <div>
        <label className="flex items-center text-[10px] font-bold uppercase tracking-[0.08em] text-[#A89EC0] mb-1.5">
          Deadline mong muốn <FieldCheck ok={!!data.deadline} />
        </label>
        <input type="date" value={data.deadline} min={today}
          onChange={e => onChange({ deadline: e.target.value })}
          className={`${inputCls} ${data.deadline ? 'border-[#C4E8DA] bg-[#F8FDF9]' : ''}`} />
        {data.deadline ? (
          <p className="text-[9px] text-[#5BB89A] mt-1 font-semibold">
            ✓ Design team sẽ cố gắng hoàn thành trước ngày này!
          </p>
        ) : (
          <p className="text-[9px] text-[#C4BEDD] mt-1">Chọn ngày bạn muốn nhận sản phẩm hoàn chỉnh</p>
        )}
      </div>

      {/* Urgent toggle */}
      <button
        type="button"
        onClick={() => onChange({ is_urgent: !data.is_urgent })}
        className={`w-full flex items-center justify-between p-4 rounded-xl border-[1.5px] cursor-pointer transition-all text-left
          ${data.is_urgent
            ? 'border-[#F4B8B8] bg-[#FDF5F5] shadow-[0_0_0_3px_rgba(224,122,122,0.08)]'
            : 'border-[#E4E0EF] hover:border-[#C4BEDD] hover:bg-[#FAFAF9]'
          }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0
            ${data.is_urgent ? 'bg-[#FCEAEA]' : 'bg-[#F2F0F7]'}`}>
            <span className="text-lg">{data.is_urgent ? '⚡' : '🕐'}</span>
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#2D2D3A]">
              {data.is_urgent ? '⚡ Yêu cầu gấp — đã bật' : 'Đây có phải yêu cầu gấp không?'}
            </p>
            <p className="text-[10px] text-[#A89EC0] mt-0.5">
              {data.is_urgent
                ? 'Designer sẽ ưu tiên nhận task của bạn trước tiên'
                : 'Bật nếu bạn cần giao sớm hơn timeline thông thường'}
            </p>
          </div>
        </div>
        {/* iOS toggle */}
        <div className={`w-[40px] h-[22px] rounded-full relative transition-all duration-200 shrink-0
          ${data.is_urgent ? 'bg-[#E07A7A]' : 'bg-[#D4CEEA]'}`}>
          <div className={`absolute w-[18px] h-[18px] bg-white rounded-full top-0.5 shadow-md transition-transform duration-200
            ${data.is_urgent ? 'translate-x-[18px]' : 'translate-x-[2px]'}`}/>
        </div>
      </button>
    </div>
  )
}
