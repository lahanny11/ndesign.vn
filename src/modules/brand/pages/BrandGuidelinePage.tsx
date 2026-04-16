'use client'

import { useState } from 'react'
import AppLayout from '@/shared/layouts/AppLayout'
import { BrandCard, FilterBtn } from '../components/BrandCard'
import { BRANDS } from '../data/brands.data'

function useCopyHex() {
  const [copied, setCopied] = useState<string | null>(null)
  const copy = (hex: string) => {
    navigator.clipboard.writeText(hex).catch(() => {})
    setCopied(hex)
    setTimeout(() => setCopied(null), 1500)
  }
  return { copied, copy }
}

export default function BrandGuidelinePage() {
  const { copied, copy } = useCopyHex()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('all')

  const filtered = BRANDS.filter(b => {
    const matchSearch =
      search === '' ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.tagline.toLowerCase().includes(search.toLowerCase())
    const matchFilter = activeFilter === 'all' || b.id === activeFilter
    return matchSearch && matchFilter
  })

  return (
    <AppLayout activeNav="brand" title="Brand Guideline">
      {/* Dark content area — fills edge-to-edge, counteracts AppLayout padding */}
      <div style={{
        margin: -20,
        minHeight: 'calc(100% + 40px)',
        background: '#0F0F10',
        color: '#fff',
        fontFamily: "'Inter', -apple-system, sans-serif",
        padding: '32px 28px',
      }}>

        {/* Copy toast */}
        {copied && (
          <div style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            background: '#1D1D1F', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 10, padding: '10px 20px', fontSize: 13, color: '#fff',
            zIndex: 9999, display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            animation: 'fadeIn 0.2s ease',
          }}>
            <span style={{ color: '#4CAF50' }}>✓</span>
            Copied <code style={{ color: '#aaa' }}>{copied}</code>
          </div>
        )}

        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Page header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #6C6BAE 0%, #4A4990 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
              }}>
                🎨
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', color: '#fff' }}>
                  Brand Guideline
                </h1>
                <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                  NhiLe Holdings · {BRANDS.length} thương hiệu
                </p>
              </div>
            </div>
          </div>

          {/* Search + filter */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Tìm brand..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, padding: '9px 16px',
                color: '#fff', fontSize: 13, outline: 'none', width: 220,
                fontFamily: 'inherit',
              }}
            />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <FilterBtn id="all" label="Tất cả" active={activeFilter === 'all'} color="#6C6BAE" onClick={setActiveFilter}/>
              {BRANDS.map(b => (
                <FilterBtn key={b.id} id={b.id} label={b.name} active={activeFilter === b.id} color={b.accentColor} onClick={setActiveFilter}/>
              ))}
            </div>
          </div>

          {/* Brand grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))', gap: 20 }}>
            {filtered.map(brand => (
              <BrandCard key={brand.id} brand={brand} copied={copied} onCopy={copy}/>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '60px 0', fontSize: 15 }}>
              Không tìm thấy brand nào
            </div>
          )}

          {/* Footer */}
          <div style={{
            marginTop: 40, paddingTop: 20,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center',
          }}>
            Click vào ô màu để copy HEX · NhiLe Holdings Brand System v1.0
          </div>
        </div>

        <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(8px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
          input::placeholder { color: rgba(255,255,255,0.3); }
          @media (max-width: 768px) { .brand-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </div>
    </AppLayout>
  )
}
