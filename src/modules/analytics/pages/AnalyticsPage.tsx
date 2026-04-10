import { useState } from 'react'
import AppLayout from '../../../shared/layouts/AppLayout'
import TimeFilter from '../components/TimeFilter'
import Group1Production from '../components/Group1Production'
import Group2Quality from '../components/Group2Quality'
import Group3Brief from '../components/Group3Brief'
import DailyChecklist from '../components/DailyChecklist'
import WeeklyChecklist from '../components/WeeklyChecklist'
import { useAnalytics } from '../hooks/useAnalytics'
import type { AnalyticsPeriod, AnalyticsAlert } from '../types/analytics.types'

// ─── Section Header ─────────────────────────────────────────────────────────
interface SectionHeaderProps {
  label: string
  badge?: string
}

function SectionHeader({ label, badge }: SectionHeaderProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 14,
      marginTop: 4,
    }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#1D1D1F', whiteSpace: 'nowrap' }}>
        {label}
      </span>
      {badge && (
        <span style={{
          padding: '2px 8px',
          borderRadius: 6,
          background: 'rgba(94,92,230,0.10)',
          color: '#2563EB',
          fontSize: 10,
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}>
          {badge}
        </span>
      )}
      <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.06)' }} />
    </div>
  )
}

// ─── Alert Row ────────────────────────────────────────────────────────────────
function AlertRow({ alert }: { alert: AnalyticsAlert }) {
  const isRed = alert.type === 'red'
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 14px',
      borderRadius: 10,
      background: isRed ? 'rgba(255,59,48,0.07)' : 'rgba(255,159,10,0.07)',
      border: `1px solid ${isRed ? 'rgba(255,59,48,0.2)' : 'rgba(255,159,10,0.2)'}`,
    }}>
      <svg viewBox="0 0 20 20" width="14" height="14" style={{ flexShrink: 0, color: isRed ? '#FF3B30' : '#FF9F0A' }}>
        <path
          d="M10 2L2 16h16L10 2z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="10" y1="9" x2="10" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="10" cy="14.5" r="0.8" fill="currentColor"/>
      </svg>
      <span style={{
        fontSize: 12,
        fontWeight: 500,
        color: isRed ? '#FF3B30' : '#CC7A00',
        lineHeight: 1.4,
      }}>
        {alert.message}
      </span>
    </div>
  )
}

// ─── Skeleton loader ─────────────────────────────────────────────────────────
function SkeletonCard({ height = 80 }: { height?: number }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 14,
      height,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.04) 50%, transparent 100%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-sweep 1.4s infinite',
      }} />
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <style>{`
        @keyframes skeleton-sweep {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[1,2,3,4].map(i => <SkeletonCard key={i} height={90} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 12 }}>
        <SkeletonCard height={200} />
        <SkeletonCard height={200} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[1,2,3].map(i => <SkeletonCard key={i} height={90} />)}
      </div>
      <SkeletonCard height={180} />
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsPeriod>('month')
  const [customFrom, setCustomFrom] = useState<string | undefined>()
  const [customTo, setCustomTo] = useState<string | undefined>()

  const { data, isLoading, isError, refetch } = useAnalytics(period, customFrom, customTo)

  function handleFilterChange(p: AnalyticsPeriod, from?: string, to?: string) {
    setPeriod(p)
    setCustomFrom(from)
    setCustomTo(to)
  }

  return (
    <AppLayout activeNav="analytics" title="Analytics">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Page header */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1D1D1F', margin: 0, letterSpacing: '-0.3px' }}>
            Analytics & Reports
          </h1>
          <p style={{ fontSize: 13, color: '#6E6E73', margin: '4px 0 0' }}>
            Tracking KPI Design Team — Co-Leader Dashboard
          </p>
        </div>

        {/* Time filter */}
        <div style={{ marginBottom: 20 }}>
          <TimeFilter
            period={period}
            from={customFrom}
            to={customTo}
            onChange={handleFilterChange}
          />
        </div>

        {/* Error state */}
        {isError && (
          <div style={{
            padding: '24px',
            textAlign: 'center',
            background: '#fff',
            borderRadius: 14,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            marginBottom: 24,
          }}>
            <div style={{ fontSize: 14, color: '#FF3B30', fontWeight: 600, marginBottom: 8 }}>
              Không thể tải dữ liệu
            </div>
            <button
              onClick={() => void refetch()}
              style={{
                padding: '8px 20px',
                borderRadius: 10,
                border: 'none',
                background: '#2563EB',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Loading */}
        {isLoading && <LoadingSkeleton />}

        {/* Content */}
        {data && !isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Alerts */}
            {data.alerts.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {data.alerts.map((alert, i) => (
                  <AlertRow key={i} alert={alert} />
                ))}
              </div>
            )}

            {/* Group 1 — Production */}
            <section>
              <SectionHeader label="Nhóm 1 — Sản xuất & Tiến độ" badge="Thu hàng ngày" />
              <Group1Production data={data} />
            </section>

            {/* Group 2 — Quality */}
            <section>
              <SectionHeader label="Nhóm 2 — Chất lượng & Revise" badge="Thu hàng ngày" />
              <Group2Quality data={data} />
            </section>

            {/* Group 3 — Brief Quality */}
            <section>
              <SectionHeader label="Nhóm 3 — Brief Quality" badge="Thu hàng tuần" />
              <Group3Brief data={data} />
            </section>

            {/* Checklists */}
            <section>
              <SectionHeader label="Checklists vận hành" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <DailyChecklist />
                <WeeklyChecklist />
              </div>
            </section>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
