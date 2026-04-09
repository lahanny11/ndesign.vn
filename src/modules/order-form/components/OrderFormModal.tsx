import { useState, useEffect } from 'react'
import type { OrderFormData, OrderFormStep1, OrderFormStep2, OrderFormStep3 } from '../types/order-form.types'
import Step1BasicInfo from './Step1BasicInfo'
import Step2ProductType from './Step2ProductType'
import Step3Brief from './Step3Brief'
import Step4Confirm from './Step4Confirm'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../../shared/config/api-client'
import { useCurrentUser } from '../../../shared/hooks/useCurrentUser'

interface Props { open: boolean; onClose: () => void }

const STEPS = [
  { label: 'Thông tin',      sub: 'Thông tin cơ bản về dự án' },
  { label: 'Sản phẩm',       sub: 'Loại thiết kế cần thực hiện' },
  { label: 'Brief',          sub: 'Mô tả yêu cầu chi tiết' },
  { label: 'Xác nhận',       sub: 'Kiểm tra và gửi' },
]

const EMPTY: OrderFormData = {
  draft_order_id: crypto.randomUUID(),
  step1: { orderer_name: '', team_id: '', task_name: '', deadline: '', is_urgent: false },
  step2: { product_type_id: '', product_type_name: '', product_size_name: '' },
  step3: { brief_text: '', style_reference: '', primary_colors: [], media_cloudflare_uids: [], moodboard_id: null, style_description: '' },
}

export default function OrderFormModal({ open, onClose }: Props) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<OrderFormData>({ ...EMPTY, draft_order_id: crypto.randomUUID() })
  const [submitted, setSubmitted] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { data: user } = useCurrentUser()
  const qc = useQueryClient()
  const DEV = import.meta.env.VITE_DEV_BYPASS === 'true'

  const { data: productTypes = [] } = useQuery({
    queryKey: ['product-types'],
    queryFn: () => apiClient.get<{ id: string; name: string; slug: string; standard_sizes: { name: string; width: number; height: number; unit: 'px'|'mm' }[] }[]>('/api/v1/meta/product-types'),
  })
  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: () => apiClient.get<{ id: string; name: string; slug: string; group?: string }[]>('/api/v1/meta/teams'),
  })

  const { data: orderers = [] } = useQuery({
    queryKey: ['orderers'],
    queryFn: () => apiClient.get<{ id: string; display_name: string; team_id: string; team_name: string; role: string }[]>('/api/v1/users/orderers'),
  })

  useEffect(() => {
    if (user) setForm(f => ({ ...f, step1: { ...f.step1, orderer_name: user.display_name, team_id: user.team?.id ?? '' } }))
  }, [user])

  const submitMutation = useMutation({
    mutationFn: () => apiClient.post<{ order_number: string }>('/api/v1/orders', {
      ...form.step1, ...form.step2, ...form.step3, draft_order_id: form.draft_order_id,
    }),
    onSuccess: (res) => {
      setOrderNumber(res.order_number)
      setSubmitted(true)
      qc.invalidateQueries({ queryKey: ['orders'] })
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
    onError: (err: { message?: string }) => setError(err?.message ?? 'Có lỗi xảy ra.'),
  })

  const upd1 = (d: Partial<OrderFormStep1>) => setForm(f => ({ ...f, step1: { ...f.step1, ...d } }))
  const upd2 = (d: Partial<OrderFormStep2>) => setForm(f => ({ ...f, step2: { ...f.step2, ...d } }))
  const upd3 = (d: Partial<OrderFormStep3>) => setForm(f => ({ ...f, step3: { ...f.step3, ...d } }))

  const getValidation = () => {
    if (step === 0) {
      if (!form.step1.task_name.trim() || form.step1.task_name.length < 3) return { ok: false, hint: 'Nhập tên dự án để tiếp tục' }
      if (!form.step1.team_id) return { ok: false, hint: 'Chọn team của bạn' }
      if (!form.step1.deadline) return { ok: false, hint: 'Chọn deadline cho dự án' }
      return { ok: true, hint: '' }
    }
    if (step === 1) {
      if (!form.step2.product_type_id) return { ok: false, hint: 'Chọn loại sản phẩm' }
      if (!form.step2.product_size_name) return { ok: false, hint: 'Chọn kích thước' }
      return { ok: true, hint: '' }
    }
    if (step === 2) {
      if (form.step3.brief_text.length < 10) return { ok: false, hint: `Cần thêm ${10 - form.step3.brief_text.length} ký tự cho brief` }
      if (!DEV && !form.step3.moodboard_id) return { ok: false, hint: 'Tạo AI Moodboard trước khi tiếp tục' }
      return { ok: true, hint: '' }
    }
    return { ok: true, hint: '' }
  }

  const { ok: canNext, hint } = getValidation()

  const handleNext = () => {
    if (step < 3) setStep(s => s + 1)
    else { setError(null); submitMutation.mutate() }
  }

  const handleClose = () => {
    setStep(0); setSubmitted(false); setError(null)
    setForm({ ...EMPTY, draft_order_id: crypto.randomUUID() })
    onClose()
  }

  const teamName = teams.find(t => t.id === form.step1.team_id)?.name ?? ''
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
      <div className="bg-white rounded-2xl w-full max-w-[560px] overflow-hidden flex flex-col"
        style={{
          boxShadow: '0 24px 64px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.08)',
          maxHeight: 'calc(100vh - 48px)',
        }}>

        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between shrink-0"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          {submitted ? (
            <p className="text-[15px] font-semibold text-[#1D1D1F]">Đã gửi thành công</p>
          ) : (
            <div>
              <p className="text-[15px] font-semibold text-[#1D1D1F]">{STEPS[step].label}</p>
              <p className="text-[12px] text-[#AEAEB2] mt-0.5">{STEPS[step].sub}</p>
            </div>
          )}
          <button onClick={handleClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#AEAEB2] hover:text-[#6E6E73] transition-colors"
            style={{ background: 'rgba(0,0,0,0.06)' }}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Step indicator */}
        {!submitted && (
          <div className="px-6 py-3 flex items-center gap-2 shrink-0"
            style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(0,0,0,0.02)' }}>
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-bold transition-all
                    ${i === step ? 'text-white' : i < step ? 'text-white' : 'text-[#AEAEB2]'}`}
                    style={{
                      background: i === step ? '#5E5CE6' : i < step ? '#34C759' : 'rgba(0,0,0,0.08)',
                    }}>
                    {i < step ? (
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                    ) : i + 1}
                  </div>
                  <span className={`text-[11px] font-medium transition-all
                    ${i === step ? 'text-[#1D1D1F]' : i < step ? 'text-[#34C759]' : 'text-[#AEAEB2]'}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-6 h-px" style={{ background: 'rgba(0,0,0,0.1)' }}/>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Progress bar */}
        {!submitted && (
          <div className="h-[2px] shrink-0" style={{ background: 'rgba(0,0,0,0.06)' }}>
            <div className="h-full transition-all duration-500"
              style={{ width: `${((step + 1) / 4) * 100}%`, background: '#5E5CE6' }}/>
          </div>
        )}

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          {submitted ? (
            <div className="flex flex-col items-center px-6 py-12 text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(52,199,89,0.1)' }}>
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-[20px] font-bold text-[#1D1D1F] tracking-tight">Order đã được gửi</p>
              <p className="text-[13px] text-[#6E6E73] mt-2 max-w-[260px] leading-relaxed">
                Design team đã nhận được yêu cầu và sẽ xác nhận trong vòng 2–4 giờ.
              </p>
              <div className="mt-5 px-5 py-3 rounded-xl"
                style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}>
                <p className="text-[10px] text-[#AEAEB2] mb-1">Mã order</p>
                <p className="text-[15px] font-bold text-[#1D1D1F] font-mono tracking-widest">{orderNumber}</p>
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={handleClose}
                  className="px-4 py-2 rounded-[10px] text-[13px] font-medium text-[#6E6E73] transition-colors"
                  style={{ background: 'rgba(0,0,0,0.06)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.1)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.06)')}>
                  Về dashboard
                </button>
                <button onClick={() => { setStep(0); setSubmitted(false); setForm({ ...EMPTY, draft_order_id: crypto.randomUUID() }) }}
                  className="px-4 py-2 rounded-[10px] text-[13px] font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: '#5E5CE6' }}>
                  Tạo order mới
                </button>
              </div>
            </div>
          ) : (
            <div className="px-6 py-5">
              {step === 0 && <Step1BasicInfo data={form.step1} onChange={upd1} teams={teams} orderers={orderers} />}
              {step === 1 && <Step2ProductType data={form.step2} onChange={upd2} productTypes={productTypes} />}
              {step === 2 && <Step3Brief data={form.step3} onChange={upd3} draftOrderId={form.draft_order_id} />}
              {step === 3 && <Step4Confirm data={form} teamName={teamName} />}
            </div>
          )}
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="px-6 py-4 shrink-0"
            style={{ borderTop: '1px solid rgba(0,0,0,0.08)', background: 'rgba(0,0,0,0.02)' }}>
            {!canNext && hint && (
              <p className="text-[11px] text-[#AEAEB2] mb-3 text-center">{hint}</p>
            )}
            <div className="flex gap-2">
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)}
                  className="px-4 h-10 rounded-[10px] text-[13px] font-medium text-[#1D1D1F] transition-colors"
                  style={{ background: 'rgba(0,0,0,0.06)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.1)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.06)')}>
                  Quay lại
                </button>
              )}
              <button onClick={handleNext} disabled={!canNext || submitMutation.isPending}
                className="flex-1 h-10 rounded-[10px] text-[13px] font-semibold text-white flex items-center justify-center gap-2
                  transition-all active:scale-[0.98]"
                style={{
                  background: canNext && !submitMutation.isPending ? '#5E5CE6' : 'rgba(0,0,0,0.12)',
                  cursor: canNext && !submitMutation.isPending ? 'pointer' : 'not-allowed',
                }}>
                {submitMutation.isPending ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Đang gửi...</>
                ) : step === 3 ? 'Gửi order' : 'Tiếp theo'}
              </button>
            </div>
            {error && (
              <p className="text-[11px] mt-2 text-center" style={{ color: '#FF3B30' }}>{error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
