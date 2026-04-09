import type { OrderFormStep2, ProductType } from '../types/order-form.types'

interface Props {
  data: OrderFormStep2
  onChange: (data: Partial<OrderFormStep2>) => void
  productTypes: ProductType[]
}

const TYPE_ICONS: Record<string, string> = {
  'social-media': '📱',
  'linkedin':     '💼',
  'youtube':      '▶️',
  'print':        '🖨️',
  'email':        '📧',
  'custom':       '✏️',
}

const TYPE_GRADIENTS: Record<string, [string, string]> = {
  'social-media': ['#C4A8D4', '#B89CC8'],
  'linkedin':     ['#A8B8F4', '#8FA6EF'],
  'youtube':      ['#F4B08A', '#E8925A'],
  'print':        ['#8FAAC4', '#7A98B8'],
  'email':        ['#F5E6C8', '#D4A853'],
  'custom':       ['#EEF0FE', '#DDE0FC'],
}

const TYPE_DESCRIPTIONS: Record<string, string> = {
  'social-media': 'Facebook, Instagram, TikTok',
  'linkedin':     'Post & banner chuyên nghiệp',
  'youtube':      'Thumbnail & channel art',
  'print':        'Poster, standee, tờ rơi',
  'email':        'Newsletter & email header',
  'custom':       'Kích thước theo yêu cầu',
}

export default function Step2ProductType({ data, onChange, productTypes }: Props) {
  const selected = productTypes.find(t => t.id === data.product_type_id)

  return (
    <div className="flex flex-col gap-4">
      {/* Type selection */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#A89EC0] mb-2">
          Loại sản phẩm cần thiết kế
        </label>
        <div className="grid grid-cols-3 gap-2">
          {productTypes.map(pt => {
            const isActive = data.product_type_id === pt.id
            const [c1, c2] = TYPE_GRADIENTS[pt.slug] ?? ['#F2F0F7', '#E4E0EF']
            return (
              <button
                key={pt.id}
                type="button"
                onClick={() => onChange({ product_type_id: pt.id, product_type_name: pt.name, product_size_name: '' })}
                className={`border-[2px] rounded-xl overflow-hidden cursor-pointer transition-all text-left group
                  ${isActive
                    ? 'border-[#7B8EF7] shadow-[0_0_0_3px_rgba(123,142,247,0.15)] -translate-y-0.5'
                    : 'border-[#E4E0EF] hover:border-[#B8AEE0] hover:-translate-y-0.5 hover:shadow-md'
                  }`}
              >
                <div className="h-14 flex items-center justify-center text-2xl relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                  {TYPE_ICONS[pt.slug] ?? '📄'}
                  {isActive && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-white flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 stroke-[#7B8EF7] fill-none stroke-[2.5]" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  )}
                </div>
                <div className="px-2.5 py-2 bg-white">
                  <p className={`text-[11px] font-bold transition-colors ${isActive ? 'text-[#7B8EF7]' : 'text-[#2D2D3A]'}`}>
                    {pt.name}
                  </p>
                  <p className="text-[9px] text-[#A89EC0] mt-0.5 leading-tight">
                    {TYPE_DESCRIPTIONS[pt.slug] ?? `${pt.standard_sizes.length} kích thước`}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Size selection */}
      {selected && selected.standard_sizes.length > 0 && (
        <div className="animate-[fadeIn_0.2s_ease]">
          <label className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#A89EC0] mb-2">
            Chọn kích thước cho {selected.name}
          </label>
          <div className="flex flex-wrap gap-2">
            {selected.standard_sizes.map(sz => {
              const isSelected = data.product_size_name === sz.name
              return (
                <button
                  key={sz.name}
                  type="button"
                  onClick={() => onChange({ product_size_name: sz.name })}
                  className={`px-3.5 py-2.5 rounded-xl border-[2px] text-left transition-all
                    ${isSelected
                      ? 'border-[#7B8EF7] bg-[#EEF0FE] shadow-[0_0_0_2px_rgba(123,142,247,0.12)] -translate-y-0.5'
                      : 'border-[#E4E0EF] hover:border-[#B8AEE0] bg-white hover:bg-[#F8F7FD]'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <svg className="w-3 h-3 stroke-[#7B8EF7] fill-none stroke-[2.5] shrink-0" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                    <div>
                      <p className={`text-[12px] font-bold ${isSelected ? 'text-[#7B8EF7]' : 'text-[#2D2D3A]'}`}>{sz.name}</p>
                      {sz.width && (
                        <p className="text-[9px] text-[#A89EC0] font-mono mt-0.5">
                          {sz.width} × {sz.height} {sz.unit}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Custom size input */}
      {selected?.slug === 'custom' && (
        <div className="animate-[fadeIn_0.2s_ease]">
          <label className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#A89EC0] mb-1.5">
            Mô tả kích thước tuỳ chỉnh
          </label>
          <input type="text" value={data.product_size_name}
            onChange={e => onChange({ product_size_name: e.target.value })}
            placeholder="VD: 1920×1080px, A4 ngang, 60×90cm..."
            className="w-full bg-[#FAFAF9] border-[1.5px] border-[#E4E0EF] rounded-xl px-3.5 py-2.5 text-[13px] text-[#2D2D3A]
              outline-none transition-all focus:border-[#7B8EF7] focus:bg-white focus:shadow-[0_0_0_3px_rgba(123,142,247,0.08)]"
          />
          <p className="text-[9px] text-[#C4BEDD] mt-1">Nhập kích thước hoặc mô tả format bạn cần</p>
        </div>
      )}

      {/* Selected summary */}
      {data.product_type_id && data.product_size_name && (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-[#F0FDF7] border border-[#BBF0DA] rounded-xl
          animate-[fadeIn_0.2s_ease]">
          <svg className="w-4 h-4 stroke-[#5BB89A] fill-none stroke-[2.5] shrink-0" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <div>
            <p className="text-[11px] font-bold text-[#2D6A4F]">Đã chọn xong!</p>
            <p className="text-[10px] text-[#5BB89A]">{data.product_type_name} — {data.product_size_name}</p>
          </div>
        </div>
      )}

      {/* Guide */}
      {!data.product_type_id && (
        <div className="flex items-center gap-2 px-4 py-3 bg-[#F8F7FD] rounded-xl border border-[#EDEAF7]">
          <span className="text-sm">💡</span>
          <p className="text-[10px] text-[#8B82C4]">
            Không chắc chọn loại nào? Chọn <strong>Custom</strong> rồi mô tả kích thước — designer sẽ tư vấn thêm!
          </p>
        </div>
      )}
    </div>
  )
}
