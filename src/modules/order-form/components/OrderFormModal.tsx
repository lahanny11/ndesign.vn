import { useState, useEffect } from 'react'
import type { OrderFormData, OrderFormStep1, OrderFormStep2, OrderFormStep3 } from '../types/order-form.types'
import Step1BasicInfo from './Step1BasicInfo'
import Step2ProductType from './Step2ProductType'
import Step3Brief from './Step3Brief'
import Step4Confirm from './Step4Confirm'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../../shared/config/api-client'
import { useCurrentUser } from '../../../shared/hooks/useCurrentUser'

interface Props {
  open: boolean
  onClose: () => void
}

const STEPS = ['Thông tin', 'Loại sản phẩm', 'Moodboard', 'Xác nhận']

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

  const { data: productTypes = [] } = useQuery({
    queryKey: ['product-types'],
    queryFn: () => apiClient.get<{ id: string; name: string; slug: string; standard_sizes: { name: string; width: number; height: number; unit: 'px'|'mm' }[] }[]>('/api/v1/meta/product-types'),
  })

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: () => apiClient.get<{ id: string; name: string; slug: string }[]>('/api/v1/meta/teams'),
  })

  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        step1: {
          ...f.step1,
          orderer_name: user.display_name,
          team_id: user.team?.id ?? '',
        },
      }))
    }
  }, [user])

  const submitMutation = useMutation({
    mutationFn: () => apiClient.post<{ order_number: string }>('/api/v1/orders', {
      ...form.step1,
      ...form.step2,
      ...form.step3,
      draft_order_id: form.draft_order_id,
      moodboard_id: form.step3.moodboard_id,
    }),
    onSuccess: (res) => {
      setOrderNumber(res.order_number)
      setSubmitted(true)
      qc.invalidateQueries({ queryKey: ['orders'] })
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
    onError: (err: { code?: string; message?: string }) => {
      setError(err?.message ?? 'Có lỗi xảy ra. Vui lòng thử lại.')
    },
  })

  const upd1 = (d: Partial<OrderFormStep1>) => setForm(f => ({ ...f, step1: { ...f.step1, ...d } }))
  const upd2 = (d: Partial<OrderFormStep2>) => setForm(f => ({ ...f, step2: { ...f.step2, ...d } }))
  const upd3 = (d: Partial<OrderFormStep3>) => setForm(f => ({ ...f, step3: { ...f.step3, ...d } }))

  const DEV = import.meta.env.VITE_DEV_BYPASS === 'true'

  const canNext = () => {
    if (step === 0) return !!form.step1.task_name.trim() && !!form.step1.team_id && !!form.step1.deadline
    if (step === 1) return !!form.step2.product_type_id && !!form.step2.product_size_name
    if (step === 2) return form.step3.brief_text.length >= 10 && (DEV || !!form.step3.moodboard_id)
    return true
  }

  const handleNext = () => {
    if (step < 3) setStep(s => s + 1)
    else {
      setError(null)
      submitMutation.mutate()
    }
  }

  const handleClose = () => {
    setStep(0)
    setSubmitted(false)
    setError(null)
    setForm({ ...EMPTY, draft_order_id: crypto.randomUUID() })
    onClose()
  }

  const teamName = teams.find(t => t.id === form.step1.team_id)?.name ?? ''

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-[rgba(100,90,140,0.35)] z-[80] flex items-start justify-center px-4 py-6 overflow-y-auto">
      <div className="bg-white rounded-[20px] w-full max-w-[620px] overflow-hidden shadow-[0_28px_72px_rgba(0,0,0,0.22)] my-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-[22px] py-[17px] border-b border-[#E4E0EF]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#7B8EF7]"/>
            <span className="text-[15px] font-bold tracking-tight">Order Design</span>
          </div>
          <button onClick={handleClose} className="w-[29px] h-[29px] rounded-full border border-[#E4E0EF] flex items-center justify-center text-[#A89EC0] hover:bg-[#F2F0F7] hover:text-[#2D2D3A] transition-all">
            <svg className="w-3.5 h-3.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        {!submitted && (
          <div className="h-[2px] bg-[#F2F0F7]">
            <div className="h-full bg-[#7B8EF7] transition-all duration-400" style={{ width: `${((step + 1) / 4) * 100}%` }}/>
          </div>
        )}

        {/* Step indicator */}
        {!submitted && (
          <div className="flex px-[22px] py-2.5 border-b border-[#E4E0EF] overflow-x-auto gap-0">
            {STEPS.map((label, i) => (
              <div
                key={i}
                className={`flex items-center gap-[5px] px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap shrink-0
                  ${i === step ? 'bg-[#EEF0FE] text-[#7B8EF7]' : i < step ? 'text-[#6E6488]' : 'text-[#A89EC0]'}`}
              >
                <div className={`w-[17px] h-[17px] rounded-full border-[1.5px] flex items-center justify-center text-[8px] font-bold shrink-0
                  ${i === step ? 'bg-[#7B8EF7] border-[#7B8EF7] text-white' : i < step ? 'bg-[#6C6BAE] border-[#2D2D3A] text-white' : 'border-current'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                {label}
              </div>
            ))}
          </div>
        )}

        {/* Body */}
        {submitted ? (
          <div className="flex flex-col items-center px-[22px] py-11 text-center">
            <div className="w-14 h-14 rounded-full bg-[#EEF0FE] border border-[rgba(123,142,247,0.2)] flex items-center justify-center mb-3.5">
              <svg className="w-6 h-6 stroke-[#7B8EF7] fill-none stroke-[2.5]" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 className="text-[19px] font-bold tracking-tight mb-1">Order đã được gửi! 🎉</h3>
            <p className="text-[12px] text-[#A89EC0] leading-relaxed max-w-[300px]">
              Designer sẽ nhận task và liên hệ xác nhận brief sớm nhất.
            </p>
            <div className="mt-3 text-[11px] text-[#7B8EF7] px-3.5 py-1.5 rounded-full border border-[rgba(123,142,247,0.2)] bg-[#EEF0FE] font-bold font-mono">
              {orderNumber}
            </div>
            <button
              onClick={handleClose}
              className="mt-[18px] px-[22px] py-2.5 bg-[#7B8EF7] text-white rounded-[9px] text-[13px] font-bold hover:opacity-85 transition-opacity"
            >
              + Tạo order mới
            </button>
          </div>
        ) : (
          <div className="px-[22px] py-5 max-h-[60vh] overflow-y-auto">
            {step === 0 && <Step1BasicInfo data={form.step1} onChange={upd1} teams={teams} currentUserName={user?.display_name ?? ''} />}
            {step === 1 && <Step2ProductType data={form.step2} onChange={upd2} productTypes={productTypes} />}
            {step === 2 && <Step3Brief data={form.step3} onChange={upd3} draftOrderId={form.draft_order_id} />}
            {step === 3 && <Step4Confirm data={form} teamName={teamName} />}
          </div>
        )}

        {/* Footer */}
        {!submitted && (
          <div className="flex gap-2 px-[22px] py-3.5 border-t border-[#E4E0EF] bg-[#FAF9FC]">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="px-4 h-[38px] bg-white border-[1.5px] border-[#E4E0EF] rounded-[9px] text-[13px] font-bold text-[#6E6488] hover:border-[#A89EC0] hover:text-[#2D2D3A] transition-all"
              >
                ← Quay lại
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canNext() || submitMutation.isPending}
              className="flex-1 h-[38px] bg-[#7B8EF7] text-white rounded-[9px] text-[13px] font-bold flex items-center justify-center gap-1.5 hover:opacity-88 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {submitMutation.isPending ? (
                <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"/> Đang gửi...</>
              ) : step === 3 ? (
                <>Gửi order <svg className="w-3.5 h-3.5 stroke-white fill-none stroke-[2.5]" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></>
              ) : (
                <>Tiếp theo <svg className="w-3 h-3 stroke-white fill-none stroke-[2.5]" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>
              )}
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mx-[22px] mb-3 px-3 py-2 bg-[#FDEEEE] border border-[#FECACA] rounded-lg text-[11px] text-[#E07A7A]">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
