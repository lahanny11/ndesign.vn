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
  'Tối giản đen trắng',
  'Vintage retro màu ấm',
  'Hiện đại corporate',
  'Pastel nhẹ nhàng',
  'Bold & colorful',
]

const COLOR_PRESETS = [
  { hex: '#000', name: 'Purple' },
  { hex: '#007AFF', name: 'Blue' },
  { hex: '#34C759', name: 'Green' },
  { hex: '#FF9F0A', name: 'Orange' },
  { hex: '#FF3B30', name: 'Red' },
  { hex: '#FF2D55', name: 'Pink' },
  { hex: '#1D1D1F', name: 'Black' },
  { hex: '#F5F5F7', name: 'Silver' },
]

type Tab = 'ai' | 'upload' | 'color'

export default function Step3Brief({ data, onChange, draftOrderId }: Props) {
  const [tab, setTab] = useState<Tab>('ai')
  const [aiInput, setAiInput] = useState(data.style_description)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [moodboard, setMoodboard] = useState<MoodboardResult | null>(null)
  const [uploadedPreviews, setUploadedPreviews] = useState<string[]>([])
  const [briefFocused, setBriefFocused] = useState(false)
  const [styleFocused, setStyleFocused] = useState(false)
  const [aiFocused, setAiFocused] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const DEV = import.meta.env.VITE_DEV_BYPASS === 'true'

  const briefOk = data.brief_text.length >= 10
  const briefCount = data.brief_text.length

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
        setAiError('Quá 5 lần trong 1 phút. Thử lại sau ít giây.')
      } else {
        setAiError('Dịch vụ AI tạm gián đoạn. Bạn có thể bỏ qua bước này.')
      }
    } finally {
      setAiLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const previews = files.map(f => URL.createObjectURL(f))
    setUploadedPreviews(prev => [...prev, ...previews].slice(0, 8))
    onChange({ media_cloudflare_uids: [] })
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

  const TABS: { key: Tab; label: string }[] = [
    { key: 'ai',     label: 'AI Moodboard' },
    { key: 'upload', label: 'Ảnh tham khảo' },
    { key: 'color',  label: 'Màu sắc' },
  ]

  const inputBase: React.CSSProperties = {
    width: '100%',
    background: '#fff',
    border: '1px solid rgba(0,0,0,0.15)',
    borderRadius: 11,
    padding: '10px 14px',
    fontSize: 14,
    color: '#1D1D1F',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all 0.15s ease',
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Brief textarea */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <label style={{
            fontSize: 11, fontWeight: 600, color: '#6E6E73',
            textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>
            Brief chi tiết <span style={{ color: '#E11D48' }}>*</span>
          </label>
          <span style={{
            fontSize: 10, fontWeight: 500,
            color: briefOk ? '#16A34A' : '#AEAEB2',
            fontVariantNumeric: 'tabular-nums',
            transition: 'color 0.2s',
          }}>
            {briefCount}/2000
          </span>
        </div>
        <textarea
          value={data.brief_text}
          onChange={e => onChange({ brief_text: e.target.value })}
          onFocus={() => setBriefFocused(true)}
          onBlur={() => setBriefFocused(false)}
          placeholder="Mô tả mục đích, đối tượng mục tiêu, phong cách, nội dung cần có...&#10;Càng chi tiết, designer hiểu đúng ngay từ đầu."
          maxLength={2000}
          rows={5}
          style={{
            ...inputBase,
            resize: 'none',
            lineHeight: '1.6',
            ...(briefFocused ? inputFocus : briefOk ? inputDone : {}),
          }}
        />
        {/* Progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
          <div style={{ flex: 1, height: '2px', background: 'rgba(0,0,0,0.06)', borderRadius: '1px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              borderRadius: '1px',
              background: briefOk ? '#34C759' : '#000',
              width: `${Math.min((briefCount / 10) * 100, 100)}%`,
              transition: 'width 0.3s ease, background 0.3s ease',
            }} />
          </div>
          {briefOk && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </div>
      </div>

      {/* Style reference */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <label style={{
            fontSize: 11, fontWeight: 600, color: '#6E6E73',
            textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>
            Phong cách tham khảo
          </label>
          <span style={{ fontSize: 10, color: '#AEAEB2' }}>tuỳ chọn</span>
        </div>
        <input
          type="text"
          value={data.style_reference}
          onChange={e => onChange({ style_reference: e.target.value })}
          onFocus={() => setStyleFocused(true)}
          onBlur={() => setStyleFocused(false)}
          placeholder="VD: Phong cách Apple, minimalist Nhật Bản, vintage 90s..."
          maxLength={500}
          style={{ ...inputBase, ...(styleFocused ? inputFocus : {}) }}
        />
      </div>

      {/* Tabs */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{
            fontSize: 11, fontWeight: 600, color: '#6E6E73',
            textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>Tham khảo thêm</span>
          <span style={{ fontSize: 10, color: '#AEAEB2' }}>tuỳ chọn</span>
        </div>

        {/* Segmented control */}
        <div style={{
          display: 'flex',
          background: 'rgba(0,0,0,0.06)',
          borderRadius: '9px',
          padding: '2px',
          marginBottom: '16px',
        }}>
          {TABS.map(t => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              style={{
                flex: 1,
                padding: '6px 0',
                borderRadius: '7px',
                fontSize: '12px',
                fontWeight: tab === t.key ? 600 : 500,
                color: tab === t.key ? '#1D1D1F' : '#6E6E73',
                background: tab === t.key ? '#fff' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                boxShadow: tab === t.key ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* AI Moodboard tab */}
        {tab === 'ai' && (
          <div style={{
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#fff',
          }}>
            {/* Header */}
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '8px',
                  background: '#000',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#1D1D1F', margin: 0 }}>AI phân tích phong cách</p>
                  <p style={{ fontSize: '11px', color: '#6E6E73', margin: 0 }}>Palette màu + font + tips tự động</p>
                </div>
              </div>
              {moodboard && (
                <span style={{
                  fontSize: '11px', fontWeight: 600, color: '#34C759',
                  background: 'rgba(52,199,89,0.1)', padding: '3px 10px', borderRadius: '20px',
                }}>
                  Đã phân tích
                </span>
              )}
            </div>

            {/* Example chips */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
              <p style={{ fontSize: '11px', color: '#AEAEB2', marginBottom: '8px', fontWeight: 500 }}>Chọn nhanh</p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {STYLE_EXAMPLES.map(ex => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => setAiInput(ex)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 500,
                      border: aiInput === ex ? '1px solid #5E5CE6' : '1px solid rgba(0,0,0,0.12)',
                      background: aiInput === ex ? 'rgba(0,0,0,0.06)' : 'transparent',
                      color: aiInput === ex ? '#000' : '#1D1D1F',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            {/* Input + button */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  onFocus={() => setAiFocused(true)}
                  onBlur={() => setAiFocused(false)}
                  onKeyDown={e => { if (e.key === 'Enter' && aiInput.trim().length >= 5) handleAnalyze() }}
                  placeholder="Mô tả phong cách bạn muốn..."
                  maxLength={500}
                  style={{
                    flex: 1,
                    background: 'rgba(0,0,0,0.04)',
                    border: aiFocused ? '1px solid rgba(94,92,230,0.5)' : '1px solid transparent',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    color: '#1D1D1F',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxShadow: aiFocused ? '0 0 0 3px rgba(0,0,0,0.07)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                />
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={aiLoading || aiInput.trim().length < 5}
                  style={{
                    padding: '0 16px',
                    height: '38px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: aiLoading || aiInput.trim().length < 5 ? 'not-allowed' : 'pointer',
                    background: aiLoading || aiInput.trim().length < 5 ? 'rgba(0,0,0,0.12)' : '#000',
                    color: aiLoading || aiInput.trim().length < 5 ? 'rgba(0,0,0,0.3)' : '#fff',
                    transition: 'all 0.15s ease',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {aiLoading ? (
                    <>
                      <div style={{
                        width: '12px', height: '12px',
                        border: '2px solid rgba(0,0,0,0.2)',
                        borderTopColor: 'rgba(0,0,0,0.5)',
                        borderRadius: '50%',
                        animation: 'spin 0.6s linear infinite',
                      }} />
                      Đang phân tích
                    </>
                  ) : 'Phân tích'}
                </button>
              </div>
            </div>

            {/* Result area */}
            <div style={{ padding: '12px 16px', minHeight: '60px' }}>
              {aiLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#000' }}>
                  <div style={{
                    width: '14px', height: '14px',
                    border: '2px solid rgba(94,92,230,0.2)',
                    borderTopColor: '#000',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite',
                  }} />
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, margin: 0 }}>Đang phân tích...</p>
                    <p style={{ fontSize: '11px', color: '#6E6E73', margin: 0 }}>AI đang tạo palette màu và gợi ý font</p>
                  </div>
                </div>
              )}
              {aiError && (
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: '8px',
                  background: 'rgba(255,59,48,0.06)', borderRadius: '8px', padding: '10px 12px',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '1px', flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#FF3B30', margin: 0 }}>Không thể phân tích</p>
                    <p style={{ fontSize: '11px', color: '#6E6E73', margin: '2px 0 0' }}>{aiError}</p>
                    {DEV && <p style={{ fontSize: '11px', color: '#AEAEB2', margin: '4px 0 0' }}>Dev mode: có thể bỏ qua bước này</p>}
                  </div>
                </div>
              )}
              {!aiLoading && !aiError && !moodboard && (
                <p style={{ fontSize: '12px', color: '#AEAEB2', margin: 0 }}>
                  Nhập mô tả và nhấn <strong style={{ color: '#000' }}>Phân tích</strong> để AI tạo moodboard
                </p>
              )}
              {moodboard && !aiLoading && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#1D1D1F', margin: 0 }}>Kết quả phân tích</p>
                    <button
                      type="button"
                      onClick={handleAnalyze}
                      disabled={aiLoading}
                      style={{
                        padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 500,
                        border: '1px solid rgba(0,0,0,0.12)', background: 'transparent',
                        color: '#1D1D1F', cursor: 'pointer',
                      }}
                    >
                      Tạo lại
                    </button>
                  </div>
                  <MoodboardPreview moodboard={moodboard} />
                </div>
              )}
            </div>

            {DEV && !moodboard && (
              <div style={{ padding: '0 16px 12px', textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: '#AEAEB2', margin: 0 }}>Dev mode: có thể bỏ qua moodboard</p>
              </div>
            )}
          </div>
        )}

        {/* Upload tab */}
        {tab === 'upload' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ aspectRatio: '1', position: 'relative' }}>
                  {uploadedPreviews[i] ? (
                    <div style={{ width: '100%', height: '100%', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                      <img src={uploadedPreviews[i]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => removeUpload(i)}
                        style={{
                          position: 'absolute', top: '4px', right: '4px',
                          width: '20px', height: '20px', borderRadius: '50%',
                          background: 'rgba(0,0,0,0.5)', color: '#fff',
                          border: 'none', cursor: 'pointer', fontSize: '12px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      style={{
                        width: '100%', height: '100%', borderRadius: '10px',
                        border: '1.5px dashed rgba(0,0,0,0.15)',
                        background: 'rgba(0,0,0,0.02)',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: '4px',
                        cursor: 'pointer', transition: 'all 0.15s ease',
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AEAEB2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      {i === 0 && <span style={{ fontSize: '10px', color: '#AEAEB2' }}>Thêm</span>}
                    </button>
                  )}
                </div>
              ))}
            </div>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
              <p style={{ fontSize: '11px', color: '#AEAEB2', margin: 0 }}>
                {uploadedPreviews.length > 0
                  ? `${uploadedPreviews.length}/8 ảnh`
                  : 'Tối đa 8 ảnh · 10MB/file · jpg/png/webp'}
              </p>
              {uploadedPreviews.length > 0 && (
                <button
                  type="button"
                  onClick={() => setUploadedPreviews([])}
                  style={{ fontSize: '11px', color: '#FF3B30', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Xoá tất cả
                </button>
              )}
            </div>
          </div>
        )}

        {/* Color tab */}
        {tab === 'color' && (
          <div>
            <p style={{ fontSize: '12px', color: '#6E6E73', marginBottom: '12px' }}>
              Chọn tối đa 5 màu chủ đạo
              {data.primary_colors.length > 0 && ` · ${data.primary_colors.length}/5 đã chọn`}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {COLOR_PRESETS.map(({ hex, name }) => {
                const isSelected = data.primary_colors.includes(hex)
                return (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => toggleColor(hex)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                      padding: '10px 8px', borderRadius: '12px',
                      border: isSelected ? '1.5px solid #5E5CE6' : '1.5px solid transparent',
                      background: isSelected ? 'rgba(94,92,230,0.06)' : 'rgba(0,0,0,0.03)',
                      cursor: 'pointer', transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      background: hex, border: '1px solid rgba(0,0,0,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                    }}>
                      {isSelected && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                          stroke={['#F5F5F7'].includes(hex) ? '#1D1D1F' : '#fff'}>
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </div>
                    <span style={{ fontSize: '10px', color: '#6E6E73', fontWeight: 500 }}>{name}</span>
                  </button>
                )
              })}
            </div>
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="color"
                onChange={e => {
                  if (data.primary_colors.length < 5 && !data.primary_colors.includes(e.target.value)) {
                    onChange({ primary_colors: [...data.primary_colors, e.target.value] })
                  }
                }}
                style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '12px', color: '#6E6E73' }}>Chọn màu tuỳ chỉnh</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
