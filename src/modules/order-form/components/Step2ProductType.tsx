import type { OrderFormStep2, ProductType } from '../types/order-form.types'

interface Props {
  data: OrderFormStep2
  onChange: (data: Partial<OrderFormStep2>) => void
  productTypes: ProductType[]
}

const TYPE_COLORS: Record<string, string> = {
  'social-media': '#AF52DE',
  'linkedin':     '#5E5CE6',
  'youtube':      '#FF3B30',
  'print':        '#FF9F0A',
  'email':        '#34C759',
  'custom':       '#6E6E73',
}

const TYPE_LABELS: Record<string, string> = {
  'social-media': 'FB · IG · TikTok',
  'linkedin':     'Post & Banner',
  'youtube':      'Thumbnail · Art',
  'print':        'Poster · Standee',
  'email':        'Newsletter',
  'custom':       'Tuỳ kích thước',
}

export default function Step2ProductType({ data, onChange, productTypes }: Props) {
  const selected = productTypes.find(t => t.id === data.product_type_id)

  return (
    <div className="flex flex-col gap-5">
      {/* Type grid */}
      <div>
        <p className="text-[11px] font-semibold text-[#6E6E73] uppercase tracking-wide mb-3"
          style={{ letterSpacing: '0.04em' }}>
          Loại sản phẩm
        </p>
        <div className="grid grid-cols-3 gap-2">
          {productTypes.map(pt => {
            const isActive = data.product_type_id === pt.id
            const color = TYPE_COLORS[pt.slug] ?? '#6E6E73'
            return (
              <button key={pt.id} type="button"
                onClick={() => onChange({ product_type_id: pt.id, product_type_name: pt.name, product_size_name: '' })}
                className="rounded-xl p-3 text-left transition-all duration-150 active:scale-[0.97]"
                style={{
                  background: isActive ? `${color}12` : 'rgba(0,0,0,0.03)',
                  border: `1.5px solid ${isActive ? `${color}40` : 'rgba(0,0,0,0.06)'}`,
                  boxShadow: isActive ? `0 0 0 2px ${color}20` : 'none',
                }}>
                {/* Color dot */}
                <div className="w-8 h-8 rounded-[8px] flex items-center justify-center mb-2"
                  style={{ background: `${color}15` }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: color }}/>
                </div>
                <p className={`text-[12px] font-semibold transition-colors ${isActive ? 'text-[#1D1D1F]' : 'text-[#3A3A3C]'}`}>
                  {pt.name}
                </p>
                <p className="text-[10px] text-[#AEAEB2] mt-0.5">{TYPE_LABELS[pt.slug]}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Size selection */}
      {selected && selected.standard_sizes.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold text-[#6E6E73] uppercase tracking-wide mb-3"
            style={{ letterSpacing: '0.04em' }}>
            Kích thước — {selected.name}
          </p>
          <div className="flex flex-wrap gap-2">
            {selected.standard_sizes.map(sz => {
              const isSelected = data.product_size_name === sz.name
              return (
                <button key={sz.name} type="button"
                  onClick={() => onChange({ product_size_name: sz.name })}
                  className="px-3 py-2.5 rounded-[10px] text-left transition-all duration-150 active:scale-[0.97]"
                  style={{
                    background: isSelected ? 'rgba(94,92,230,0.08)' : 'rgba(0,0,0,0.04)',
                    border: `1.5px solid ${isSelected ? 'rgba(94,92,230,0.35)' : 'rgba(0,0,0,0.06)'}`,
                  }}>
                  <p className={`text-[12px] font-semibold ${isSelected ? 'text-[#5E5CE6]' : 'text-[#1D1D1F]'}`}>
                    {sz.name}
                  </p>
                  {sz.width && (
                    <p className="text-[10px] text-[#AEAEB2] font-mono mt-0.5">
                      {sz.width}×{sz.height} {sz.unit}
                    </p>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Custom size */}
      {selected?.slug === 'custom' && (
        <div>
          <p className="text-[11px] font-semibold text-[#6E6E73] uppercase tracking-wide mb-2"
            style={{ letterSpacing: '0.04em' }}>Mô tả kích thước</p>
          <input type="text" value={data.product_size_name}
            onChange={e => onChange({ product_size_name: e.target.value })}
            placeholder="VD: 1920×1080px, A4 ngang..."
            className="w-full text-[13px] text-[#1D1D1F] outline-none rounded-[10px] px-3.5 py-2.5 placeholder:text-[#AEAEB2] font-[inherit]"
            style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}
            onFocus={e => Object.assign(e.target.style, {
              background: '#fff', border: '1px solid rgba(94,92,230,0.5)', boxShadow: '0 0 0 3px rgba(94,92,230,0.1)',
            })}
            onBlur={e => Object.assign(e.target.style, {
              background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: 'none',
            })}
          />
        </div>
      )}

      {/* Confirmation */}
      {data.product_type_id && data.product_size_name && (
        <div className="flex items-center gap-3 rounded-[12px] px-4 py-3"
          style={{ background: 'rgba(52,199,89,0.06)', border: '1px solid rgba(52,199,89,0.2)' }}>
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <p className="text-[12px] font-semibold" style={{ color: '#1D7A3D' }}>
            {data.product_type_name} · {data.product_size_name}
          </p>
        </div>
      )}
    </div>
  )
}
