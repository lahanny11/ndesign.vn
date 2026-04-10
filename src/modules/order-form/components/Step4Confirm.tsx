import type { OrderFormData } from '../types/order-form.types'

interface Props {
  data: OrderFormData
  teamName: string
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      border: '1px solid rgba(0,0,0,0.08)',
      borderRadius: '12px',
      overflow: 'hidden',
      background: '#fff',
    }}>
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        background: 'rgba(0,0,0,0.02)',
      }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#6E6E73', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', gap: '16px',
      padding: '10px 16px',
      borderBottom: '1px solid rgba(0,0,0,0.04)',
    }}
      className="last:border-b-0"
    >
      <span style={{ fontSize: '12px', color: '#AEAEB2', minWidth: '100px', flexShrink: 0, fontWeight: 500, paddingTop: '1px' }}>
        {label}
      </span>
      <span style={{ fontSize: '13px', color: '#1D1D1F', fontWeight: 500, flex: 1 }}>{value}</span>
    </div>
  )
}

export default function Step4Confirm({ data, teamName }: Props) {
  const { step1, step2, step3 } = data

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* Info banner */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '10px',
        padding: '12px 14px',
        background: 'rgba(94,92,230,0.06)',
        borderRadius: '12px',
        border: '1px solid rgba(94,92,230,0.12)',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5E5CE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '1px', flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#000', margin: 0 }}>Kiểm tra lần cuối</p>
          <p style={{ fontSize: '12px', color: '#6E6E73', margin: '2px 0 0' }}>
            Sau khi gửi, Design Team sẽ xác nhận trong 2–4 giờ làm việc.
          </p>
        </div>
      </div>

      <Section title="Thông tin cơ bản">
        <Row label="Người gửi" value={step1.orderer_name} />
        <Row label="Team" value={teamName} />
        <Row label="Tên dự án" value={step1.task_name} />
        <Row label="Deadline" value={step1.deadline ? new Date(step1.deadline).toLocaleDateString('vi-VN') : '—'} />
        <Row label="Độ ưu tiên" value={
          step1.is_urgent
            ? (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                fontSize: '12px', fontWeight: 600, color: '#FF9F0A',
                background: 'rgba(255,159,10,0.1)', padding: '2px 8px', borderRadius: '6px',
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#FF9F0A">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                Gấp
              </span>
            )
            : <span style={{ color: '#6E6E73' }}>Bình thường</span>
        } />
      </Section>

      <Section title="Loại sản phẩm">
        <Row label="Nhóm" value={step2.product_type_name || '—'} />
        <Row label="Kích thước" value={step2.product_size_name || '—'} />
      </Section>

      <Section title="Brief & Phong cách">
        <Row label="Mô tả" value={
          <span style={{ fontSize: '12px', color: '#6E6E73', lineHeight: '1.6', fontWeight: 400, whiteSpace: 'pre-wrap', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {step3.brief_text || '—'}
          </span>
        } />
        {step3.style_reference && <Row label="Style ref" value={step3.style_reference} />}
        {step3.primary_colors.length > 0 && (
          <Row label="Màu sắc" value={
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {step3.primary_colors.map(c => (
                <div
                  key={c}
                  title={c}
                  style={{
                    width: '20px', height: '20px', borderRadius: '6px',
                    background: c, border: '1px solid rgba(0,0,0,0.08)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                />
              ))}
            </div>
          } />
        )}
        <Row label="AI Moodboard" value={
          step3.moodboard_id
            ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: '#34C759' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Đã phân tích
              </span>
            )
            : <span style={{ fontSize: '12px', color: '#AEAEB2' }}>Chưa phân tích</span>
        } />
      </Section>

      {/* Trust signal */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '12px 14px',
        background: 'rgba(52,199,89,0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(52,199,89,0.15)',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <polyline points="9 12 11 14 15 10"/>
        </svg>
        <p style={{ fontSize: '12px', color: '#34C759', margin: 0, fontWeight: 500 }}>
          Design Team cam kết phản hồi trong 2–4 giờ làm việc.
        </p>
      </div>

    </div>
  )
}
