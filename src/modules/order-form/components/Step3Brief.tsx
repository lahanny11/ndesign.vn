import { useState, useRef } from 'react'
import type { OrderFormStep3, MoodboardResult } from '../types/order-form.types'
import MoodboardPreview from './MoodboardPreview'
import { apiClient } from '../../../shared/config/api-client'

interface Props {
  data: OrderFormStep3
  onChange: (data: Partial<OrderFormStep3>) => void
  draftOrderId: string
}

const STYLE_EXAMPLES = [
  { label: 'Tối giản đen trắng', emoji: '⬛', desc: 'Minimalist, clean' },
  { label: 'Vintage retro màu ấm', emoji: '🟤', desc: 'Retro, earthy tones' },
  { label: 'Hiện đại corporate', emoji: '🔷', desc: 'Professional, bold' },
  { label: 'Pastel nhẹ nhàng', emoji: '🩷', desc: 'Soft, feminine' },
  { label: 'Bold & colorful', emoji: '🌈', desc: 'Vibrant, energetic' },
]

const COLOR_PRESETS = [
  { hex: '#7B8EF7', name: 'Indigo' },
  { hex: '#E07A7A', name: 'Coral' },
  { hex: '#5BB89A', name: 'Mint' },
  { hex: '#E8925A', name: 'Orange' },
  { hex: '#B89CC8', name: 'Lavender' },
  { hex: '#F4D03F', name: 'Yellow' },
  { hex: '#2D2D3A', name: 'Dark' },
  { hex: '#F5F3EF', name: 'Cream' },
]

const inputCls = `w-full bg-[#FAFAF9] border-[1.5px] border-[#E4E0EF] rounded-xl px-3.5 py-2.5
  text-[13px] text-[#2D2D3A] font-[inherit] outline-none transition-all
  focus:border-[#7B8EF7] focus:bg-white focus:shadow-[0_0_0_3px_rgba(123,142,247,0.08)]`

type Tab = 'ai' | 'upload' | 'color'

export default function Step3Brief({ data, onChange, draftOrderId }: Props) {
  const [tab, setTab] = useState<Tab>('ai')
  const [aiInput, setAiInput] = useState(data.style_description)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [moodboard, setMoodboard] = useState<MoodboardResult | null>(null)
  const [uploadedPreviews, setUploadedPreviews] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)
  const DEV = import.meta.env.VITE_DEV_BYPASS === 'true'

  const briefOk = data.brief_text.length >= 10
  const briefPct = Math.min((data.brief_text.length / 10) * 100, 100)

  const handleAnalyze = async () => {
    if (aiInput.trim().length < 5) return
    setAiLoading(true)
    setAiError(null)
    try {
      const res = await apiClient.post<{ data: MoodboardResult }>(`/api/v1/orders/${draftOrderId}/moodboard`, {
        style_description: aiInput,
      })
      const mb = res.data
      setMoodboard(mb)
      onChange({ moodboard_id: mb.id, style_description: aiInput })
    } catch (err: unknown) {
      const e = err as { code?: string }
      if (e?.code === 'AI_RATE_LIMIT_EXCEEDED') {
        setAiError('Bạn đã generate quá 5 lần trong 1 phút. Thử lại sau ít giây.')
      } else {
        setAiError('Dịch vụ AI tạm gián đoạn. Bạn có thể bỏ qua và gửi bước tiếp theo.')
      }
    } finally {
      setAiLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const previews = files.map(f => URL.createObjectURL(f))
    setUploadedPreviews(prev => [...prev, ...previews].slice(0, 8))
    // In real flow: upload to Cloudflare and get UIDs
    onChange({ media_cloudflare_uids: uploadedPreviews })
    e.target.value = ''
  }

  const removeUpload = (i: number) => {
    setUploadedPreviews(prev => prev.filter((_, idx) => idx !== i))
  }

  const toggleColor = (hex: string) => {
    const colors = data.primary_colors.includes(hex)
      ? data.primary_colors.filter(c => c !== hex)
      : data.primary_colors.length < 5
        ? [...data.primary_colors, hex]
        : data.primary_colors
    onChange({ primary_colors: colors })
  }

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'ai',     label: 'AI Moodboard', icon: '✦' },
    { key: 'upload', label: 'Ảnh tham khảo', icon: '🖼️' },
    { key: 'color',  label: 'Màu sắc',       icon: '🎨' },
  ]

  return (
    <div className="flex flex-col gap-4">

      {/* Brief textarea — REQUIRED */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#A89EC0]">
            Brief chi tiết <span className="text-[#E07A7A]">*</span>
          </label>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full transition-all
            ${briefOk ? 'bg-[#E4F5F0] text-[#5BB89A]' : 'bg-[#F2F0F7] text-[#A89EC0]'}`}>
            {briefOk ? '✓ Đủ rồi!' : `Cần thêm ${10 - data.brief_text.length} ký tự`}
          </span>
        </div>
        <textarea
          value={data.brief_text}
          onChange={e => onChange({ brief_text: e.target.value })}
          placeholder="Mô tả chi tiết dự án: mục đích, đối tượng mục tiêu, phong cách, màu sắc mong muốn, nội dung cần có...&#10;&#10;Càng chi tiết → designer hiểu đúng ngay từ đầu → ít revision hơn! 🎯"
          maxLength={2000}
          rows={5}
          className={`${inputCls} resize-none leading-relaxed ${briefOk ? 'border-[#C4E8DA] bg-[#F8FDF9]' : ''}`}
        />
        {/* Progress bar for brief */}
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex-1 h-1 bg-[#F2F0F7] rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-300 ${briefOk ? 'bg-[#5BB89A]' : 'bg-[#7B8EF7]'}`}
              style={{ width: `${briefPct}%` }}/>
          </div>
          <span className="text-[9px] text-[#A89EC0] shrink-0">{data.brief_text.length}/2000</span>
        </div>
      </div>

      {/* Style reference — optional */}
      <div>
        <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#A89EC0] mb-1.5">
          Phong cách tham khảo
          <span className="normal-case font-normal text-[9px] bg-[#F2F0F7] text-[#A89EC0] px-1.5 py-0.5 rounded-full ml-1">Tuỳ chọn</span>
        </label>
        <input type="text" value={data.style_reference}
          onChange={e => onChange({ style_reference: e.target.value })}
          placeholder="VD: Phong cách Apple, minimalist Nhật Bản, vintage 90s..."
          maxLength={500} className={inputCls} />
      </div>

      {/* Optional sections — tabs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#A89EC0]">
            Tham khảo thêm
          </label>
          <span className="text-[9px] text-[#C4BEDD] bg-[#F2F0F7] px-2 py-0.5 rounded-full">Tuỳ chọn — bỏ qua được</span>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 p-1 bg-[#F2F0F7] rounded-xl mb-3">
          {TABS.map(t => (
            <button key={t.key} type="button" onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-semibold transition-all
                ${tab === t.key ? 'bg-white text-[#2D2D3A] shadow-sm' : 'text-[#A89EC0] hover:text-[#6E6488]'}`}>
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* AI Moodboard tab */}
        {tab === 'ai' && (
          <div className="border-[1.5px] border-[#E4E0EF] rounded-xl overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-[#F8F7FD] to-[#F0F0FF] border-b border-[#E4E0EF]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#7B8EF7] to-[#6C6BAE] flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">✦</span>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#2D2D3A]">AI phân tích phong cách</p>
                    <p className="text-[9px] text-[#A89EC0]">Mô tả → palette màu + font + tips tự động</p>
                  </div>
                </div>
                {moodboard && (
                  <span className="text-[9px] font-bold text-[#5BB89A] bg-[#E4F5F0] px-2 py-0.5 rounded-full">
                    ✓ Đã phân tích
                  </span>
                )}
              </div>
            </div>

            {/* Style example chips */}
            <div className="px-4 pt-3 pb-2 border-b border-[#F2F0F7]">
              <p className="text-[9px] text-[#A89EC0] mb-2 font-semibold">CHỌN NHANH:</p>
              <div className="flex gap-1.5 flex-wrap">
                {STYLE_EXAMPLES.map(ex => (
                  <button key={ex.label} type="button"
                    onClick={() => setAiInput(ex.label)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full border transition-all text-[10px] font-semibold
                      ${aiInput === ex.label
                        ? 'border-[#7B8EF7] bg-[#EEF0FE] text-[#7B8EF7]'
                        : 'border-[#E4E0EF] bg-white text-[#6E6488] hover:border-[#7B8EF7] hover:text-[#7B8EF7]'
                      }`}>
                    <span>{ex.emoji}</span>
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input + Analyze */}
            <div className="px-4 py-3 border-b border-[#F2F0F7]">
              <div className="flex gap-2">
                <input type="text" value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && aiInput.trim().length >= 5) handleAnalyze() }}
                  placeholder="Mô tả phong cách bạn muốn... (VD: tối giản đen trắng)"
                  className="flex-1 bg-[#FAFAF9] border-[1.5px] border-[#E4E0EF] rounded-xl px-3 py-2 text-[12px] text-[#2D2D3A]
                    outline-none focus:border-[#7B8EF7] transition-all"
                  maxLength={500} />
                <button type="button" onClick={handleAnalyze}
                  disabled={aiLoading || aiInput.trim().length < 5}
                  className={`px-4 h-10 rounded-xl text-[12px] font-bold transition-all shrink-0
                    ${aiLoading || aiInput.trim().length < 5
                      ? 'bg-[#D4CEEA] text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#7B8EF7] to-[#6C6BAE] text-white hover:shadow-[0_4px_12px_rgba(123,142,247,0.4)] hover:-translate-y-0.5 active:translate-y-0'
                    }`}>
                  {aiLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  ) : '✦ Phân tích'}
                </button>
              </div>
              {aiInput.trim().length > 0 && aiInput.trim().length < 5 && (
                <p className="text-[9px] text-[#A89EC0] mt-1">Nhập thêm vài từ để AI hiểu ý bạn hơn</p>
              )}
            </div>

            {/* AI Result */}
            <div className="px-4 py-3 min-h-[60px]">
              {aiLoading && (
                <div className="flex items-center gap-2.5 text-[#7B8EF7]">
                  <div className="w-3.5 h-3.5 border-2 border-[#7B8EF7] border-t-transparent rounded-full animate-spin"/>
                  <div>
                    <p className="text-[11px] font-semibold">Đang phân tích phong cách...</p>
                    <p className="text-[9px] text-[#A89EC0] mt-0.5">AI đang tạo palette màu và gợi ý font</p>
                  </div>
                </div>
              )}
              {aiError && (
                <div className="flex items-start gap-2 text-[#E07A7A]">
                  <svg className="w-4 h-4 stroke-current fill-none stroke-2 shrink-0 mt-0.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                  </svg>
                  <div>
                    <p className="text-[11px] font-semibold">Không thể phân tích</p>
                    <p className="text-[10px] mt-0.5">{aiError}</p>
                    {DEV && <p className="text-[9px] text-[#A89EC0] mt-1">Dev mode: bạn có thể bỏ qua bước này</p>}
                  </div>
                </div>
              )}
              {!aiLoading && !aiError && !moodboard && (
                <div className="flex items-center gap-2 text-[#C4BEDD]">
                  <span className="text-base">✦</span>
                  <p className="text-[11px]">Nhập mô tả và nhấn <strong className="text-[#7B8EF7]">Phân tích</strong> để AI tạo moodboard tự động</p>
                </div>
              )}
              {moodboard && !aiLoading && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] font-bold text-[#2D2D3A]">Kết quả phân tích</p>
                    <button type="button" onClick={handleAnalyze} disabled={aiLoading}
                      className="text-[10px] px-2.5 py-1 border border-[#E4E0EF] rounded-lg text-[#6E6488] hover:border-[#7B8EF7] hover:text-[#7B8EF7] transition-all">
                      🔄 Tạo lại
                    </button>
                  </div>
                  <MoodboardPreview moodboard={moodboard} />
                </div>
              )}
            </div>

            {/* DEV skip note */}
            {DEV && !moodboard && (
              <div className="px-4 pb-3">
                <p className="text-[9px] text-[#C4BEDD] text-center">
                  💡 Dev mode: có thể bỏ qua moodboard và tiếp tục
                </p>
              </div>
            )}
          </div>
        )}

        {/* Upload tab */}
        {tab === 'upload' && (
          <div>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="relative aspect-square">
                  {uploadedPreviews[i] ? (
                    <div className="w-full h-full rounded-xl overflow-hidden relative group">
                      <img src={uploadedPreviews[i]} className="w-full h-full object-cover"/>
                      <button type="button" onClick={() => removeUpload(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-[9px] font-bold
                          flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        ×
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => fileRef.current?.click()}
                      className="w-full h-full rounded-xl border-2 border-dashed border-[#CEC9E0] bg-[#FAFAF9]
                        flex flex-col items-center justify-center gap-1 cursor-pointer
                        hover:border-[#7B8EF7] hover:bg-[#EEF0FE] transition-all group">
                      <svg className="w-4 h-4 stroke-[#CEC9E0] group-hover:stroke-[#7B8EF7] fill-none stroke-[1.5] transition-colors" viewBox="0 0 24 24">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      <span className="text-[8px] text-[#C4BEDD] group-hover:text-[#7B8EF7] font-semibold transition-colors">
                        {i === 0 ? 'Thêm ảnh' : ''}
                      </span>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <input ref={fileRef} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden" onChange={handleFileChange} />
            <div className="flex items-center justify-between mt-2">
              <p className="text-[9px] text-[#A89EC0]">
                {uploadedPreviews.length > 0
                  ? `${uploadedPreviews.length}/8 ảnh đã chọn`
                  : 'Tối đa 8 ảnh · 10MB/file · jpg/png/webp/gif'}
              </p>
              {uploadedPreviews.length > 0 && (
                <button type="button" onClick={() => setUploadedPreviews([])}
                  className="text-[9px] text-[#E07A7A] hover:underline">
                  Xoá tất cả
                </button>
              )}
            </div>
          </div>
        )}

        {/* Color tab */}
        {tab === 'color' && (
          <div>
            <p className="text-[10px] text-[#A89EC0] mb-3">
              Chọn tối đa 5 màu chủ đạo {data.primary_colors.length > 0 && `(đang chọn ${data.primary_colors.length}/5)`}
            </p>
            <div className="grid grid-cols-4 gap-3">
              {COLOR_PRESETS.map(({ hex, name }) => {
                const isSelected = data.primary_colors.includes(hex)
                return (
                  <button key={hex} type="button" onClick={() => toggleColor(hex)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all
                      ${isSelected
                        ? 'border-[#7B8EF7] bg-[#EEF0FE] -translate-y-0.5 shadow-md'
                        : 'border-[#E4E0EF] hover:border-[#C4BEDD] hover:-translate-y-0.5'
                      }`}>
                    <div className="w-10 h-10 rounded-xl shadow-sm relative flex items-center justify-center border border-black/5"
                      style={{ background: hex }}>
                      {isSelected && (
                        <svg className="w-4 h-4 fill-none stroke-2"
                          style={{ stroke: hex === '#F5F3EF' || hex === '#F4D03F' ? '#2D2D3A' : 'white' }}
                          viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </div>
                    <span className="text-[9px] text-[#6E6488] font-medium">{name}</span>
                  </button>
                )
              })}
            </div>
            {/* Custom color input */}
            <div className="mt-3 flex items-center gap-2">
              <input type="color"
                onChange={e => {
                  if (data.primary_colors.length < 5 && !data.primary_colors.includes(e.target.value)) {
                    onChange({ primary_colors: [...data.primary_colors, e.target.value] })
                  }
                }}
                className="w-8 h-8 rounded-lg border border-[#E4E0EF] cursor-pointer" />
              <span className="text-[10px] text-[#A89EC0]">Hoặc chọn màu tuỳ chỉnh</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
