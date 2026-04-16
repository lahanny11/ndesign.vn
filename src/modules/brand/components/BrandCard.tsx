'use client'

import { useState } from 'react'
import type { Brand, BrandColor } from '../data/brands.data'

// ── COLOR SWATCH ──────────────────────────────────────────────────────
export function ColorSwatch({ hex, name, border = false, copied, onCopy }: {
  hex: string; name: string; border?: boolean; copied: string | null; onCopy: (h: string) => void
}) {
  const isCopied = copied === hex
  return (
    <button
      onClick={() => onCopy(hex)}
      title={`Copy ${hex}`}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
    >
      <div
        style={{
          width: 52, height: 52, borderRadius: 12,
          backgroundColor: hex,
          border: border ? '1.5px solid rgba(0,0,0,0.15)' : '1.5px solid rgba(255,255,255,0.08)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.1)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.28)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)' }}
      >
        {isCopied && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
      </div>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', textAlign: 'center', maxWidth: 60, lineHeight: 1.3 }}>{name}</span>
      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>{hex}</span>
    </button>
  )
}

// ── FILTER BUTTON ─────────────────────────────────────────────────────
export function FilterBtn({ id, label, active, color, onClick }: {
  id: string; label: string; active: boolean; color: string; onClick: (id: string) => void
}) {
  return (
    <button
      onClick={() => onClick(id)}
      style={{
        background: active ? `${color}22` : 'rgba(255,255,255,0.05)',
        border: active ? `1px solid ${color}66` : '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8, color: active ? color : 'rgba(255,255,255,0.55)',
        fontSize: 12, padding: '7px 14px', cursor: 'pointer',
        transition: 'all 0.15s', fontWeight: active ? 600 : 400,
        fontFamily: 'inherit',
      }}
    >
      {label}
    </button>
  )
}

// ── BRAND CARD ────────────────────────────────────────────────────────
export function BrandCard({ brand, copied, onCopy }: {
  brand: Brand; copied: string | null; onCopy: (h: string) => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden', transition: 'border-color 0.2s' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = `${brand.accentColor}55`)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
    >
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${brand.accentColor}22 0%, transparent 60%)`,
        borderBottom: `1px solid ${brand.accentColor}33`,
        padding: '20px 24px',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: brand.accentColor, boxShadow: `0 0 8px ${brand.accentColor}` }}/>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>{brand.name}</span>
          </div>
          <p style={{ fontSize: 12, color: brand.accentColor, margin: 0, fontStyle: 'italic' }}>{brand.tagline}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '4px 10px', whiteSpace: 'nowrap' }}>
            {brand.founded}
          </div>
          {brand.note && (
            <div style={{ fontSize: 9, color: '#4CAF50', background: 'rgba(76,175,80,0.12)', border: '1px solid rgba(76,175,80,0.25)', borderRadius: 6, padding: '3px 8px', whiteSpace: 'nowrap', fontWeight: 600 }}>
              ✦ {brand.note}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.6 }}>{brand.description}</p>

        {/* Màu chủ đạo */}
        <div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Màu chủ đạo</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {brand.primaryColors.map((c: BrandColor) => <ColorSwatch key={c.hex} {...c} copied={copied} onCopy={onCopy}/>)}
          </div>
        </div>

        {/* Toggle màu phụ */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'none', border: `1px solid ${brand.accentColor}44`, borderRadius: 8,
            color: brand.accentColor, fontSize: 12, padding: '7px 14px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, width: 'fit-content',
            transition: 'background 0.15s', fontFamily: 'inherit',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = `${brand.accentColor}18`)}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >
          <span>{expanded ? '▲' : '▼'}</span>
          {expanded ? 'Ẩn màu phụ' : `Xem màu phụ (${brand.secondaryColors.length})`}
        </button>

        {expanded && (
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Màu bổ trợ</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {brand.secondaryColors.map((c: BrandColor) => <ColorSwatch key={c.hex} {...c} copied={copied} onCopy={onCopy}/>)}
            </div>
          </div>
        )}

        {/* Fonts */}
        <div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Typography</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {brand.fonts.map(f => (
              <div key={f.name} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{f.usage}</div>
                </div>
                <div style={{ fontSize: 10, background: `${brand.accentColor}22`, color: brand.accentColor, borderRadius: 6, padding: '3px 8px', flexShrink: 0 }}>
                  {f.weight}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mascot */}
        {brand.mascot && (
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 6, width: 'fit-content' }}>
            🎭 Mascot: <strong style={{ color: brand.accentColor }}>{brand.mascot}</strong>
          </div>
        )}
      </div>
    </div>
  )
}
