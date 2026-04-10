import type { OrderFormStep2, ProductType, ProductSize } from '../types/order-form.types'

interface Props {
  data: OrderFormStep2
  onChange: (data: Partial<OrderFormStep2>) => void
  productTypes: ProductType[]
}

// Product type card accent color (dot style như cũ)
const TYPE_COLORS: Record<string, string> = {
  'quote-square':  '#E1306C',
  'banner-cover':  '#1877F2',
  'poster-doc':    '#E1306C',
  'thumbnail':     '#FF0000',
  'custom':        '#6B7280',
  'mailing-list':  '#2563EB',
}

const TYPE_LABELS: Record<string, string> = {
  'quote-square':  'Feed · Post vuông',
  'banner-cover':  'Cover · Profile · Channel',
  'poster-doc':    'Story · Reel · Shorts',
  'thumbnail':     'YouTube · Reels · TikTok',
  'custom':        'Tuỳ chỉnh kích thước',
  'mailing-list':  'Email template design',
}

// ── Platform-aware size illustration ──────────────────────────────────────────
function SizeIllustration({ sz }: { sz: ProductSize }) {
  const pc = sz.platform_color ?? '#6B7280'
  const name = sz.name.toLowerCase()
  const platform = (sz.platform ?? '').toLowerCase()

  // ── TALL PHONE (Story / Reel / Shorts / TikTok / Poster dọc) ──
  const isTallPhone = sz.height && sz.width && sz.height > sz.width && sz.unit === 'px'
    && !name.includes('pinterest') && !name.includes('header') && !name.includes('footer')
    && !name.includes('full template') && !name.includes('section')

  if (isTallPhone) {
    const isYT = platform.includes('youtube')
    const isTT = platform.includes('tiktok')
    const isFB = platform.includes('facebook')
    return (
      <svg viewBox="0 0 72 68" fill="none" style={{ width: 72, height: 68 }}>
        {/* Phone frame */}
        <rect x="18" y="2" width="36" height="64" rx="6"
          fill={isTT ? '#010101' : isFB ? '#1877F2' : isYT ? '#1D1D1F' : pc}
          stroke={isTT ? '#333' : 'rgba(0,0,0,0.15)'} strokeWidth="1"/>
        <rect x="30" y="4" width="12" height="2" rx="1"
          fill={isTT ? '#333' : 'rgba(255,255,255,0.3)'}/>
        {/* Screen */}
        <rect x="20" y="8" width="32" height="54" rx="3"
          fill={isTT ? '#1a1a1a' : 'rgba(255,255,255,0.95)'}/>

        {isYT && <>
          {/* YouTube Shorts */}
          <rect x="20" y="8" width="32" height="54" rx="3" fill="#111"/>
          <circle cx="36" cy="32" r="8" fill="#FF0000" opacity="0.9"/>
          <polygon points="33.5,28 33.5,36 40.5,32" fill="white"/>
          <rect x="22" y="50" width="14" height="2" rx="1" fill="white" opacity="0.6"/>
          <rect x="22" y="54" width="10" height="1.5" rx="0.75" fill="white" opacity="0.4"/>
          <rect x="40" y="48" width="10" height="12" rx="2" fill="rgba(255,255,255,0.1)"/>
          <circle cx="45" cy="52" r="3" fill="rgba(255,255,255,0.5)"/>
          <rect x="42" y="57" width="6" height="1" rx="0.5" fill="rgba(255,255,255,0.4)"/>
        </>}

        {isTT && <>
          {/* TikTok Cover */}
          <rect x="20" y="8" width="32" height="54" rx="3" fill="#111"/>
          <circle cx="36" cy="30" r="7" fill={pc} opacity="0.8"/>
          <polygon points="33.5,26.5 33.5,33.5 40,30" fill="white"/>
          <rect x="22" y="47" width="18" height="2" rx="1" fill="white" opacity="0.7"/>
          <rect x="22" y="51" width="12" height="1.5" rx="0.75" fill="white" opacity="0.4"/>
          {/* TikTok right actions */}
          <circle cx="46" cy="45" r="3.5" fill="rgba(255,255,255,0.2)"/>
          <circle cx="46" cy="52" r="3.5" fill="rgba(255,255,255,0.2)"/>
          <circle cx="46" cy="59" r="3.5" fill="rgba(255,255,255,0.2)"/>
        </>}

        {isFB && <>
          {/* Facebook Story */}
          <rect x="20" y="8" width="32" height="54" rx="3" fill={pc} opacity="0.15"/>
          <circle cx="26" cy="14" r="4" fill={pc} stroke="white" strokeWidth="1"/>
          <rect x="32" y="12.5" width="12" height="1.5" rx="0.75" fill={pc} opacity="0.7"/>
          <rect x="32" y="15.5" width="8" height="1.2" rx="0.6" fill={pc} opacity="0.4"/>
          <rect x="22" y="20" width="28" height="26" rx="2" fill={pc} opacity="0.25"/>
          <circle cx="36" cy="33" r="6" fill={pc} opacity="0.6"/>
          <rect x="22" y="50" width="28" height="3" rx="1.5" fill={pc} opacity="0.4"/>
          <rect x="24" y="55" width="24" height="5" rx="2.5" fill={pc} opacity="0.7"/>
          <rect x="26" y="57" width="20" height="1.5" rx="0.75" fill="white" opacity="0.9"/>
        </>}

        {!isYT && !isTT && !isFB && <>
          {/* Instagram / Generic story */}
          <rect x="20" y="8" width="32" height="54" rx="3"
            fill="url(#ig-grad)" opacity="0.9"/>
          <defs>
            <linearGradient id="ig-grad" x1="20" y1="8" x2="52" y2="62" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={pc} stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#833AB4" stopOpacity="0.2"/>
            </linearGradient>
          </defs>
          <circle cx="26" cy="14" r="4" fill={pc} stroke="white" strokeWidth="1.2"/>
          <rect x="32" y="12.5" width="12" height="1.5" rx="0.75" fill="#1D1D1F" opacity="0.6"/>
          <rect x="32" y="15.5" width="8" height="1.2" rx="0.6" fill="#9CA3AF"/>
          <circle cx="36" cy="34" r="9" fill={pc} opacity="0.3"/>
          <circle cx="36" cy="34" r="5" fill={pc} opacity="0.6"/>
          <rect x="22" y="52" width="20" height="2" rx="1" fill="#1D1D1F" opacity="0.5"/>
          <rect x="22" y="56" width="14" height="1.5" rx="0.75" fill="#9CA3AF"/>
        </>}
      </svg>
    )
  }

  // ── SQUARE POST (1:1) ──────────────────────────────────────
  if (sz.width === sz.height && sz.unit === 'px') {
    const isLI = platform.includes('linkedin') || platform.includes('facebook')
    return (
      <svg viewBox="0 0 72 64" fill="none" style={{ width: 72, height: 64 }}>
        {/* Phone frame */}
        <rect x="16" y="2" width="34" height="60" rx="6" fill="#1D1D1F" stroke="#3A3A3C" strokeWidth="1"/>
        <rect x="28" y="4" width="10" height="2" rx="1" fill="#3A3A3C"/>
        <rect x="18" y="8" width="30" height="50" rx="2" fill="white"/>
        {/* Top bar */}
        {isLI ? <>
          <circle cx="24" cy="14" r="3.5" fill={pc} opacity="0.6"/>
          <rect x="29" y="12.5" width="12" height="1.5" rx="0.75" fill="#E5E7EB"/>
          <rect x="29" y="15.5" width="8" height="1.2" rx="0.6" fill="#F3F4F6"/>
        </> : <>
          <circle cx="24" cy="13" r="3" fill={pc} opacity="0.5"/>
          <rect x="29" y="11.5" width="10" height="1.5" rx="0.75" fill="#F3F4F6"/>
          <circle cx="45" cy="13" r="2" fill="#F3F4F6"/>
        </>}
        {/* Square post */}
        <rect x="18" y="18" width="30" height="26" fill={pc} opacity="0.2"/>
        <rect x="18" y="18" width="30" height="26" stroke={pc} strokeWidth="0.6" opacity="0.4"/>
        <circle cx="33" cy="31" r="5" fill={pc} opacity="0.45"/>
        <path d="M18 37l7-5 5 4 5-3 8 5" stroke={pc} strokeWidth="1" opacity="0.5"/>
        {/* Like bar */}
        <circle cx="21" cy="48" r="2" fill="#E5E7EB"/>
        <circle cx="26" cy="48" r="2" fill="#E5E7EB"/>
        <rect x="31" y="47" width="10" height="1.5" rx="0.75" fill="#F3F4F6"/>
        {/* Caption */}
        <rect x="19" y="52" width="22" height="1.5" rx="0.75" fill="#E5E7EB"/>
        <rect x="19" y="55" width="15" height="1.2" rx="0.6" fill="#F3F4F6"/>
      </svg>
    )
  }

  // ── PINTEREST PIN (portrait ~2:3) ─────────────────────────
  if (platform.includes('pinterest')) {
    return (
      <svg viewBox="0 0 72 64" fill="none" style={{ width: 72, height: 64 }}>
        {/* Pin card */}
        <rect x="14" y="3" width="34" height="52" rx="6" fill="#E60023" opacity="0.12"/>
        <rect x="14" y="3" width="34" height="52" rx="6" stroke="#E60023" strokeWidth="1" opacity="0.5"/>
        {/* Image area */}
        <rect x="14" y="3" width="34" height="36" rx="6" fill="#E60023" opacity="0.25"/>
        <circle cx="31" cy="21" r="7" fill="#E60023" opacity="0.45"/>
        {/* Save button */}
        <rect x="36" y="7" width="10" height="6" rx="3" fill="#E60023" opacity="0.9"/>
        <rect x="37.5" y="9" width="7" height="1.5" rx="0.75" fill="white" opacity="0.9"/>
        {/* Bottom info */}
        <rect x="18" y="43" width="26" height="2" rx="1" fill="#1D1D1F" opacity="0.3"/>
        <rect x="18" y="47" width="18" height="1.5" rx="0.75" fill="#9CA3AF"/>
        <circle cx="18" cy="55" r="4" fill="#E60023" opacity="0.3"/>
        <rect x="25" y="53.5" width="18" height="1.5" rx="0.75" fill="#E5E7EB"/>
        <rect x="25" y="56.5" width="12" height="1.2" rx="0.6" fill="#F3F4F6"/>
      </svg>
    )
  }

  // ── WIDE BANNER / COVER (landscape) ──────────────────────
  if (sz.width && sz.height && sz.width > sz.height && sz.unit === 'px') {
    const isYT = platform.includes('youtube')
    const isLI = platform.includes('linkedin')

    if (isYT) return (
      <svg viewBox="0 0 72 52" fill="none" style={{ width: 72, height: 52 }}>
        {/* Monitor */}
        <rect x="3" y="3" width="66" height="38" rx="3" fill="#1D1D1F" stroke="#3A3A3C" strokeWidth="1"/>
        <rect x="5" y="5" width="62" height="34" rx="2" fill="#FF0000" opacity="0.18"/>
        <rect x="5" y="5" width="62" height="34" rx="2" stroke="#FF0000" strokeWidth="0.8" opacity="0.4"/>
        {/* Safe zone guides */}
        <rect x="13" y="10" width="46" height="24" stroke="#FF0000" strokeWidth="0.7"
          strokeDasharray="2 1.5" rx="1" opacity="0.45"/>
        <rect x="22" y="17" width="28" height="3" rx="1.5" fill="#FF0000" opacity="0.45"/>
        <rect x="26" y="22" width="20" height="2" rx="1" fill="#FF0000" opacity="0.25"/>
        {/* Stand */}
        <rect x="34" y="41" width="4" height="5" rx="1" fill="#3A3A3C"/>
        <rect x="28" y="46" width="16" height="2" rx="1" fill="#3A3A3C"/>
      </svg>
    )

    if (isLI) return (
      <svg viewBox="0 0 72 52" fill="none" style={{ width: 72, height: 52 }}>
        {/* LinkedIn profile layout */}
        <rect x="5" y="3" width="62" height="46" rx="3" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
        {/* Cover banner */}
        <rect x="5" y="3" width="62" height="20" rx="3" fill={pc} opacity="0.2"/>
        <rect x="5" y="3" width="62" height="20" rx="3" stroke={pc} strokeWidth="0.8" opacity="0.4"/>
        <rect x="22" y="9" width="28" height="2.5" rx="1.25" fill={pc} opacity="0.4"/>
        <rect x="27" y="13" width="18" height="1.5" rx="0.75" fill={pc} opacity="0.2"/>
        {/* Avatar */}
        <circle cx="18" cy="25" r="8" fill="white" stroke="white" strokeWidth="2"/>
        <circle cx="18" cy="25" r="6" fill={pc} opacity="0.4"/>
        {/* Name */}
        <rect x="30" y="26" width="28" height="2.5" rx="1.25" fill="#1D1D1F" opacity="0.25"/>
        <rect x="30" y="31" width="20" height="1.5" rx="0.75" fill="#E5E7EB"/>
        <rect x="44" y="37" width="16" height="6" rx="3" fill={pc} opacity="0.6"/>
        <rect x="46" y="39.5" width="12" height="1.5" rx="0.75" fill="white" opacity="0.9"/>
        <rect x="7" y="43" width="50" height="1.5" rx="0.75" fill="#F3F4F6"/>
      </svg>
    )

    // Facebook Cover
    return (
      <svg viewBox="0 0 72 52" fill="none" style={{ width: 72, height: 52 }}>
        <rect x="3" y="3" width="66" height="46" rx="3" fill="#F5F5F7" stroke="#E5E7EB" strokeWidth="1"/>
        <rect x="3" y="3" width="66" height="8" rx="3" fill="white"/>
        <circle cx="9" cy="7" r="1.5" fill="#FF5F56"/>
        <circle cx="14" cy="7" r="1.5" fill="#FFBD2E"/>
        <circle cx="19" cy="7" r="1.5" fill="#27C93F"/>
        <rect x="24" y="5" width="32" height="4" rx="2" fill="#F3F4F6"/>
        {/* Cover */}
        <rect x="5" y="13" width="62" height="22" rx="2" fill={pc} opacity="0.2"/>
        <rect x="5" y="13" width="62" height="22" rx="2" stroke={pc} strokeWidth="0.8" opacity="0.4"/>
        <rect x="20" y="22" width="32" height="2" rx="1" fill={pc} opacity="0.35"/>
        {/* Profile */}
        <circle cx="16" cy="38" r="7" fill="#E5E7EB" stroke="white" strokeWidth="1.5"/>
        <rect x="27" y="36" width="20" height="2" rx="1" fill="#E5E7EB"/>
        <rect x="27" y="40" width="14" height="1.5" rx="0.75" fill="#F3F4F6"/>
        <rect x="52" y="36" width="14" height="8" rx="4" fill={pc} opacity="0.5"/>
      </svg>
    )
  }

  // ── YOUTUBE THUMBNAIL (16:9) ──────────────────────────────
  if (name.includes('youtube thumbnail') || (platform.includes('youtube') && sz.width === 1280)) {
    return (
      <svg viewBox="0 0 72 56" fill="none" style={{ width: 72, height: 56 }}>
        <rect x="2" y="3" width="68" height="46" rx="3" fill="#1D1D1F" stroke="#3A3A3C" strokeWidth="1"/>
        <rect x="4" y="5" width="64" height="42" rx="2" fill="#111"/>
        {/* Thumbnail */}
        <rect x="4" y="5" width="64" height="42" rx="2" fill="#FF0000" opacity="0.1"/>
        <circle cx="36" cy="26" r="9" fill="#FF0000" opacity="0.85"/>
        <polygon points="33.5,22.5 33.5,29.5 40.5,26" fill="white"/>
        {/* Duration */}
        <rect x="54" y="38" width="12" height="6" rx="1" fill="rgba(0,0,0,0.8)"/>
        <rect x="55.5" y="40.5" width="9" height="1.5" rx="0.75" fill="white" opacity="0.9"/>
        {/* YT bottom bar */}
        <rect x="2" y="49" width="68" height="4" rx="2" fill="white"/>
        <rect x="4" y="50.5" width="40" height="1" rx="0.5" fill="#E5E7EB"/>
        <rect x="56" y="49.5" width="12" height="5" rx="2.5" fill="#FF0000" opacity="0.8"/>
        <rect x="57" y="51" width="10" height="1.5" rx="0.75" fill="white" opacity="0.9"/>
      </svg>
    )
  }

  // ── MAILING LIST sizes ─────────────────────────────────────
  if (name.includes('header banner')) return (
    <svg viewBox="0 0 72 52" fill="none" style={{ width: 72, height: 52 }}>
      <rect x="5" y="4" width="62" height="44" rx="3" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
      <rect x="5" y="4" width="62" height="8" rx="3" fill="#E5E7EB"/>
      <circle cx="11" cy="8" r="1.5" fill="#9CA3AF"/>
      <rect x="16" y="6" width="24" height="4" rx="2" fill="white" opacity="0.8"/>
      <rect x="13" y="15" width="46" height="14" rx="2" fill={pc} opacity="0.2"/>
      <rect x="13" y="15" width="46" height="14" rx="2" stroke={pc} strokeWidth="0.8" opacity="0.5"/>
      <rect x="20" y="19.5" width="32" height="2" rx="1" fill={pc} opacity="0.5"/>
      <rect x="24" y="23" width="24" height="1.5" rx="0.75" fill={pc} opacity="0.25"/>
      <rect x="10" y="33" width="52" height="1.5" rx="0.75" fill="#E5E7EB"/>
      <rect x="10" y="37" width="38" height="1.5" rx="0.75" fill="#F3F4F6"/>
      <rect x="10" y="41" width="44" height="1.5" rx="0.75" fill="#F3F4F6"/>
    </svg>
  )

  if (name.includes('full template')) return (
    <svg viewBox="0 0 72 56" fill="none" style={{ width: 72, height: 56 }}>
      <rect x="18" y="2" width="36" height="52" rx="3" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
      <rect x="18" y="2" width="36" height="10" rx="3" fill={pc} opacity="0.3"/>
      <rect x="22" y="5" width="20" height="2" rx="1" fill={pc} opacity="0.6"/>
      <rect x="25" y="8.5" width="14" height="1.2" rx="0.6" fill={pc} opacity="0.3"/>
      <rect x="20" y="14" width="32" height="12" rx="1.5" fill={pc} opacity="0.12"/>
      <circle cx="36" cy="20" r="4" fill={pc} opacity="0.25"/>
      <rect x="20" y="29" width="32" height="1.5" rx="0.75" fill="#E5E7EB"/>
      <rect x="20" y="33" width="24" height="1.5" rx="0.75" fill="#E5E7EB"/>
      <line x1="20" y1="38" x2="52" y2="38" stroke="#E5E7EB" strokeWidth="0.8"/>
      <rect x="20" y="41" width="28" height="1.5" rx="0.75" fill="#E5E7EB"/>
      <rect x="20" y="45" width="20" height="1.5" rx="0.75" fill="#F3F4F6"/>
      <rect x="26" y="49" width="20" height="4" rx="2" fill={pc} opacity="0.5"/>
    </svg>
  )

  if (name.includes('section')) return (
    <svg viewBox="0 0 72 52" fill="none" style={{ width: 72, height: 52 }}>
      <rect x="8" y="4" width="56" height="44" rx="3" fill="white" stroke={pc} strokeWidth="1.5" opacity="0.5"/>
      <circle cx="19" cy="16" r="5" fill={pc} opacity="0.2"/>
      <rect x="27" y="13.5" width="30" height="2" rx="1" fill="#1D1D1F" opacity="0.2"/>
      <rect x="27" y="17.5" width="22" height="1.5" rx="0.75" fill="#E5E7EB"/>
      <line x1="12" y1="25" x2="60" y2="25" stroke="#E5E7EB" strokeWidth="0.8"/>
      <rect x="12" y="28" width="20" height="14" rx="2" fill={pc} opacity="0.15"/>
      <rect x="35" y="29.5" width="22" height="2" rx="1" fill="#1D1D1F" opacity="0.2"/>
      <rect x="35" y="34" width="16" height="1.5" rx="0.75" fill="#E5E7EB"/>
      <rect x="35" y="37" width="18" height="1.5" rx="0.75" fill="#F3F4F6"/>
      <line x1="12" y1="45" x2="60" y2="45" stroke="#E5E7EB" strokeWidth="0.8"/>
    </svg>
  )

  if (name.includes('footer')) return (
    <svg viewBox="0 0 72 52" fill="none" style={{ width: 72, height: 52 }}>
      <rect x="5" y="4" width="62" height="44" rx="3" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
      <rect x="8" y="7" width="56" height="22" rx="2" fill="#F3F4F6"/>
      <rect x="12" y="10" width="36" height="1.5" rx="0.75" fill="#E5E7EB"/>
      <rect x="12" y="14" width="28" height="1.5" rx="0.75" fill="#E5E7EB"/>
      <rect x="12" y="18" width="30" height="1.5" rx="0.75" fill="#E5E7EB"/>
      <rect x="26" y="23" width="20" height="5" rx="2.5" fill={pc} opacity="0.4"/>
      {/* Footer highlighted */}
      <rect x="5" y="33" width="62" height="15" rx="3" fill={pc} opacity="0.12"/>
      <rect x="5" y="33" width="62" height="15" rx="3" stroke={pc} strokeWidth="1" opacity="0.4"/>
      <rect x="18" y="36" width="36" height="1.5" rx="0.75" fill={pc} opacity="0.35"/>
      <circle cx="27" cy="43" r="2.5" fill={pc} opacity="0.3"/>
      <circle cx="33" cy="43" r="2.5" fill={pc} opacity="0.3"/>
      <circle cx="39" cy="43" r="2.5" fill={pc} opacity="0.3"/>
      <circle cx="45" cy="43" r="2.5" fill={pc} opacity="0.3"/>
    </svg>
  )

  // ── CUSTOM ────────────────────────────────────────────────
  return (
    <svg viewBox="0 0 72 56" fill="none" style={{ width: 72, height: 56 }}>
      <rect x="10" y="8" width="52" height="40" rx="4" fill="#F9FAFB"
        stroke="#D1D5DB" strokeWidth="1.5" strokeDasharray="4 2.5"/>
      <line x1="36" y1="21" x2="36" y2="35" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
      <line x1="29" y1="28" x2="43" y2="28" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
      <rect x="14" y="12" width="8" height="8" rx="2" fill="#E5E7EB" opacity="0.8"/>
      <rect x="50" y="12" width="8" height="8" rx="2" fill="#E5E7EB" opacity="0.8"/>
      <rect x="14" y="40" width="8" height="8" rx="2" fill="#E5E7EB" opacity="0.8"/>
      <rect x="50" y="40" width="8" height="8" rx="2" fill="#E5E7EB" opacity="0.8"/>
    </svg>
  )
}

export default function Step2ProductType({ data, onChange, productTypes }: Props) {
  const selected = productTypes.find(t => t.id === data.product_type_id)

  return (
    <div className="flex flex-col gap-5">
      {/* Product type grid — style cũ (dot tròn) */}
      <div>
        <p className="text-[11px] font-semibold text-[#6E6E73] uppercase tracking-wide mb-3"
          style={{ letterSpacing: '0.04em' }}>Loại sản phẩm</p>
        <div className="grid grid-cols-3 gap-2">
          {productTypes.map(pt => {
            const isActive = data.product_type_id === pt.id
            const color = TYPE_COLORS[pt.slug] ?? '#6B7280'
            return (
              <button key={pt.id} type="button"
                onClick={() => onChange({ product_type_id: pt.id, product_type_name: pt.name, product_size_name: '' })}
                className="rounded-xl p-3 text-left transition-all duration-150 active:scale-[0.97]"
                style={{
                  background: isActive ? `${color}12` : 'rgba(0,0,0,0.03)',
                  border: `1.5px solid ${isActive ? `${color}40` : 'rgba(0,0,0,0.06)'}`,
                  boxShadow: isActive ? `0 0 0 2px ${color}20` : 'none',
                }}>
                <div className="w-8 h-8 rounded-[8px] flex items-center justify-center mb-2"
                  style={{ background: `${color}15` }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: color }}/>
                </div>
                <p className={`text-[12px] font-semibold ${isActive ? 'text-[#1D1D1F]' : 'text-[#3A3A3C]'}`}>
                  {pt.name}
                </p>
                <p className="text-[10px] text-[#AEAEB2] mt-0.5 leading-tight">
                  {TYPE_LABELS[pt.slug]}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Size selection — illustrated 2-column grid */}
      {selected && selected.standard_sizes.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold text-[#6E6E73] uppercase tracking-wide mb-3"
            style={{ letterSpacing: '0.04em' }}>
            Kích thước — {selected.name}
          </p>
          <div className={`grid gap-2 ${selected.standard_sizes.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {selected.standard_sizes.map(sz => {
              const isSelected = data.product_size_name === sz.name
              const color = sz.platform_color ?? TYPE_COLORS[selected.slug] ?? '#6B7280'
              const isCustom = sz.width === null
              return (
                <button key={sz.name} type="button"
                  onClick={() => onChange({ product_size_name: sz.name })}
                  className="rounded-[12px] text-left transition-all duration-150 active:scale-[0.97] overflow-hidden"
                  style={{
                    background: '#fff',
                    border: `1.5px solid ${isSelected ? `${color}55` : 'rgba(0,0,0,0.07)'}`,
                    boxShadow: isSelected ? `0 0 0 2.5px ${color}18` : '0 1px 2px rgba(0,0,0,0.04)',
                  }}>
                  {/* Illustration */}
                  <div style={{
                    background: isSelected ? `${color}07` : 'rgba(0,0,0,0.02)',
                    padding: '10px 6px 6px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderBottom: `1px solid ${isSelected ? `${color}20` : 'rgba(0,0,0,0.05)'}`,
                    minHeight: 76,
                  }}>
                    <SizeIllustration sz={sz} />
                  </div>
                  {/* Label */}
                  <div style={{ padding: '7px 10px 9px' }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: isSelected ? color : '#1D1D1F', margin: 0 }}>
                      {sz.name}
                    </p>
                    {!isCustom && sz.width && (
                      <p style={{ fontSize: 10, color: color, fontFamily: 'monospace', margin: '1px 0 0', fontWeight: 600 }}>
                        {sz.width}×{sz.height} {sz.unit}
                      </p>
                    )}
                    {sz.platform && (
                      <p style={{ fontSize: 9.5, color: '#9CA3AF', margin: '1px 0 0' }}>{sz.platform}</p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Custom text input */}
      {selected?.slug === 'custom' && data.product_size_name === 'Custom / Khác' && (
        <div>
          <p className="text-[11px] font-semibold text-[#6E6E73] uppercase tracking-wide mb-2"
            style={{ letterSpacing: '0.04em' }}>Mô tả kích thước</p>
          <input type="text"
            placeholder="VD: 1920×1080px, A4 ngang, 210×297mm..."
            className="w-full text-[13px] text-[#1D1D1F] outline-none rounded-[10px] px-3.5 py-2.5 placeholder:text-[#9CA3AF] font-[inherit]"
            style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.07)' }}
            onFocus={e => Object.assign(e.target.style, {
              background: '#fff', border: '1px solid rgba(0,0,0,0.3)', boxShadow: '0 0 0 3px rgba(0,0,0,0.07)',
            })}
            onBlur={e => Object.assign(e.target.style, {
              background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.07)', boxShadow: 'none',
            })}
          />
        </div>
      )}

      {/* Confirmation */}
      {data.product_type_id && data.product_size_name && (
        <div className="flex items-center gap-3 rounded-[12px] px-4 py-3"
          style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.2)' }}>
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <p className="text-[12px] font-semibold" style={{ color: '#15803D' }}>
            {data.product_type_name} · {data.product_size_name}
          </p>
        </div>
      )}
    </div>
  )
}
