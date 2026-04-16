'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/config/api-client'
import { useRoleStore } from '@/shared/stores/role.store'
import type { Delivery } from '../types/delivery.types'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function detectLink(url: string) {
  if (url.includes('drive.google.com')) return { emoji: '📁', label: 'Google Drive' }
  if (url.includes('canva.com'))        return { emoji: '🎨', label: 'Canva' }
  if (url.includes('figma.com'))        return { emoji: '🖼️', label: 'Figma' }
  return { emoji: '🔗', label: 'Link' }
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')} · ${d.getDate()}/${d.getMonth()+1}`
}

const BTN_BASE: React.CSSProperties = {
  borderRadius: 8, fontSize: 11, fontWeight: 600,
  cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.15s',
  border: 'none',
}

// ─── History accordion ────────────────────────────────────────────────────────
function HistorySection({ deliveries }: { deliveries: Delivery[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ marginTop: 6 }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{ ...BTN_BASE, background: 'none', color: '#AEAEB2', padding: '4px 0', fontSize: 10, fontWeight: 500 }}
      >
        {open ? '▲' : '▶'} Lịch sử giao hàng ({deliveries.length} lần trước)
      </button>
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
          {[...deliveries].reverse().map(d => {
            const { emoji, label } = detectLink(d.link_url)
            return (
              <div key={d.id} style={{
                background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.07)',
                borderRadius: 8, padding: '8px 12px',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontSize: 16 }}>{emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 10, fontWeight: 600, color: '#6E6E73', margin: 0 }}>
                    {label} · Lần {d.round}
                    {d.is_confirmed && <span style={{ color: '#16A34A', marginLeft: 6 }}>✓ Đã xác nhận</span>}
                  </p>
                  <p style={{ fontSize: 10, color: '#AEAEB2', margin: '2px 0 0' }}>{fmtDate(d.delivered_at)}</p>
                </div>
                <a href={d.link_url} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 10, color: '#2563EB', textDecoration: 'none', flexShrink: 0 }}>
                  Mở ↗
                </a>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DeliverySection({ orderId, orderStatus }: {
  orderId: string
  orderStatus: string
}) {
  const role = useRoleStore(s => s.role)
  const qc = useQueryClient()

  // Designer form state
  const [link, setLink] = useState('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [linkError, setLinkError] = useState('')

  // Orderer action state
  const [confirming, setConfirming] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  const [sendingFeedback, setSendingFeedback] = useState(false)
  const [completing, setCompleting] = useState(false)

  const { data: deliveries = [] } = useQuery<Delivery[]>({
    queryKey: ['deliveries', orderId],
    queryFn: () => apiClient.get(`/api/v1/orders/${orderId}/deliveries`),
    enabled: !!orderId,
  })

  const latest = deliveries[deliveries.length - 1] ?? null
  const history = deliveries.length > 1 ? deliveries.slice(0, -1) : []
  const nextRound = deliveries.length + 1

  function refresh() {
    qc.invalidateQueries({ queryKey: ['deliveries', orderId] })
    qc.invalidateQueries({ queryKey: ['order-detail', orderId] })
    qc.invalidateQueries({ queryKey: ['orders'] })
  }

  const isDesigner = role === 'designer'
  const canSee = role === 'orderer' || role === 'design_leader' || role === 'co_leader'
  const canSubmit = isDesigner && ['assigned', 'in_progress', 'feedback'].includes(orderStatus)
  const isDone = orderStatus === 'done'

  // Ẩn section nếu pending và chưa có delivery nào
  if (orderStatus === 'pending' && deliveries.length === 0) return null

  async function submitDelivery() {
    if (!link.trim()) return setLinkError('Vui lòng paste link sản phẩm')
    try { new URL(link.trim()) } catch { return setLinkError('Link không hợp lệ') }
    setLinkError('')
    setSubmitting(true)
    try {
      await apiClient.post(`/api/v1/orders/${orderId}/deliveries`, {
        link_url: link.trim(), note: note.trim() || null,
      })
      setLink(''); setNote('')
      refresh()
    } finally { setSubmitting(false) }
  }

  async function confirmDelivery() {
    if (!latest) return
    setConfirming(true)
    try {
      await apiClient.patch(`/api/v1/orders/${orderId}/deliveries/${latest.id}/confirm`, {})
      refresh()
    } finally { setConfirming(false) }
  }

  async function sendFeedback() {
    if (!feedbackText.trim()) return
    setSendingFeedback(true)
    try {
      await apiClient.post(`/api/v1/orders/${orderId}/feedback`, { feedback_text: feedbackText.trim() })
      setFeedbackText(''); setShowFeedback(false)
      refresh()
    } finally { setSendingFeedback(false) }
  }

  async function confirmDone() {
    setCompleting(true)
    try {
      await apiClient.post(`/api/v1/orders/${orderId}/confirm-done`, {})
      refresh()
    } finally { setCompleting(false) }
  }

  const { emoji, label } = latest ? detectLink(latest.link_url) : { emoji: '🔗', label: '' }

  return (
    <>
      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(0,0,0,0.07)', margin: '16px 0' }} />

      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: '#AEAEB2', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Giao sản phẩm
        </span>
        <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.07)' }} />
        {deliveries.length > 0 && (
          <span style={{ fontSize: 10, color: '#AEAEB2', background: 'rgba(0,0,0,0.06)', borderRadius: 99, padding: '2px 8px' }}>
            Lần {deliveries.length}
          </span>
        )}
      </div>

      {/* ── DESIGNER: form giao hàng ── */}
      {canSubmit && (
        <div style={{
          marginBottom: 14, background: 'rgba(37,99,235,0.04)',
          border: '1px solid rgba(37,99,235,0.14)', borderRadius: 12, padding: '14px 16px',
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#2563EB', margin: '0 0 10px' }}>
            📦 Giao sản phẩm · Lần {nextRound}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              <input
                type="text"
                placeholder="Paste link Google Drive / Canva / Figma..."
                value={link}
                onChange={e => { setLink(e.target.value); setLinkError('') }}
                style={{
                  width: '100%', boxSizing: 'border-box', fontFamily: 'inherit',
                  border: linkError ? '1.5px solid #E11D48' : '1.5px solid rgba(0,0,0,0.14)',
                  borderRadius: 8, padding: '8px 12px', fontSize: 12,
                  background: '#fff', color: '#1D1D1F', outline: 'none',
                }}
              />
              {linkError && <p style={{ fontSize: 10, color: '#E11D48', margin: '4px 0 0' }}>{linkError}</p>}
            </div>
            <textarea
              placeholder="Ghi chú cho orderer (tuỳ chọn)..."
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={2}
              style={{
                width: '100%', boxSizing: 'border-box', fontFamily: 'inherit',
                border: '1.5px solid rgba(0,0,0,0.14)', borderRadius: 8,
                padding: '8px 12px', fontSize: 12, resize: 'none',
                background: '#fff', color: '#1D1D1F', outline: 'none',
              }}
            />
            <button
              onClick={submitDelivery}
              disabled={submitting || !link.trim()}
              style={{
                ...BTN_BASE, alignSelf: 'flex-start', padding: '7px 18px',
                background: submitting || !link.trim() ? '#E5E7EB' : '#2563EB',
                color: submitting || !link.trim() ? '#9CA3AF' : '#fff',
                cursor: submitting || !link.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? 'Đang giao...' : 'Giao ngay →'}
            </button>
          </div>
        </div>
      )}

      {/* ── ORDERER / LEADER: xem và xác nhận ── */}
      {canSee && latest && (
        <div style={{
          marginBottom: 14,
          background: isDone ? 'rgba(22,163,74,0.04)' : 'rgba(0,0,0,0.02)',
          border: isDone ? '1px solid rgba(22,163,74,0.2)' : '1px solid rgba(0,0,0,0.09)',
          borderRadius: 12, padding: '14px 16px',
        }}>
          {/* Link row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 22, lineHeight: 1, marginTop: 1 }}>{emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#1D1D1F', margin: '0 0 2px' }}>
                {label} · Lần {latest.round}
              </p>
              <a href={latest.link_url} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 11, color: '#2563EB', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {latest.link_url}
              </a>
              <p style={{ fontSize: 10, color: '#AEAEB2', margin: '3px 0 0' }}>
                {fmtDate(latest.delivered_at)} · bởi {latest.delivered_by}
              </p>
            </div>
            <a href={latest.link_url} target="_blank" rel="noopener noreferrer"
              style={{ flexShrink: 0, padding: '6px 12px', borderRadius: 8, background: 'rgba(37,99,235,0.08)', color: '#2563EB', fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>
              Mở ↗
            </a>
          </div>

          {/* Note của designer */}
          {latest.note && (
            <p style={{ fontSize: 11, color: '#6E6E73', background: 'rgba(0,0,0,0.03)', borderRadius: 8, padding: '8px 10px', margin: '0 0 10px', lineHeight: 1.5 }}>
              💬 {latest.note}
            </p>
          )}

          {/* Actions */}
          {!isDone && (
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.07)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {!latest.is_confirmed ? (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={confirmDelivery} disabled={confirming} style={{ ...BTN_BASE, flex: 1, padding: '8px 12px', background: '#16A34A', color: '#fff', cursor: confirming ? 'wait' : 'pointer' }}>
                    {confirming ? '...' : '✓ Xác nhận đã nhận'}
                  </button>
                  <button onClick={() => setShowFeedback(v => !v)} style={{ ...BTN_BASE, padding: '8px 14px', background: showFeedback ? 'rgba(37,99,235,0.08)' : 'transparent', border: '1.5px solid rgba(0,0,0,0.12)', color: '#1D1D1F', cursor: 'pointer' }}>
                    💬 Feedback
                  </button>
                </div>
              ) : (
                <p style={{ fontSize: 11, color: '#16A34A', fontWeight: 600, margin: 0 }}>
                  ✅ Đã xác nhận nhận hàng · {fmtDate(latest.confirmed_at!)}
                </p>
              )}

              {showFeedback && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <textarea
                    placeholder="Mô tả những điểm cần chỉnh sửa..."
                    value={feedbackText}
                    onChange={e => setFeedbackText(e.target.value)}
                    rows={3}
                    autoFocus
                    style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid rgba(0,0,0,0.14)', borderRadius: 8, padding: '8px 12px', fontSize: 12, resize: 'none', fontFamily: 'inherit', outline: 'none' }}
                  />
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={sendFeedback} disabled={sendingFeedback || !feedbackText.trim()}
                      style={{ ...BTN_BASE, flex: 1, padding: '7px', background: feedbackText.trim() ? '#1D1D1F' : '#E5E7EB', color: feedbackText.trim() ? '#fff' : '#9CA3AF', cursor: feedbackText.trim() ? 'pointer' : 'not-allowed' }}>
                      {sendingFeedback ? 'Đang gửi...' : 'Gửi feedback →'}
                    </button>
                    <button onClick={() => { setShowFeedback(false); setFeedbackText('') }}
                      style={{ ...BTN_BASE, padding: '7px 14px', background: 'transparent', border: '1.5px solid rgba(0,0,0,0.12)', color: '#6E6E73', cursor: 'pointer' }}>
                      Huỷ
                    </button>
                  </div>
                </div>
              )}

              {latest.is_confirmed && !showFeedback && (
                <button onClick={confirmDone} disabled={completing}
                  style={{ ...BTN_BASE, width: '100%', padding: '10px', background: '#16A34A', color: '#fff', fontSize: 13, cursor: completing ? 'wait' : 'pointer', letterSpacing: '-0.01em' }}>
                  {completing ? 'Đang xử lý...' : '🎉 Hoàn thành order'}
                </button>
              )}
            </div>
          )}

          {isDone && (
            <div style={{ borderTop: '1px solid rgba(22,163,74,0.15)', paddingTop: 10, textAlign: 'center' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#16A34A', margin: 0 }}>🎉 Order hoàn thành!</p>
              <p style={{ fontSize: 11, color: '#AEAEB2', margin: '4px 0 0' }}>Bàn giao thành công</p>
            </div>
          )}
        </div>
      )}

      {/* History */}
      {history.length > 0 && <HistorySection deliveries={history} />}
    </>
  )
}
