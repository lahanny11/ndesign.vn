import type { DashboardStats } from '../types/dashboard.types'

interface Props {
  stats: DashboardStats
  loading?: boolean
}

interface CardProps {
  label: string
  value: string | number
  sub: string
  trend?: string
  trendUp?: boolean
  accent?: boolean
  alert?: boolean
}

function StatCard({ label, value, sub, trend, trendUp, accent, alert }: CardProps) {
  const valueColor = accent ? '#2563EB' : alert ? '#E11D48' : '#1D1D1F'

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: '18px 20px 16px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
    }}>
      {/* Label */}
      <p style={{
        fontSize: 11,
        fontWeight: 500,
        color: '#AEAEB2',
        margin: '0 0 10px',
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        lineHeight: 1,
      }}>
        {label}
      </p>

      {/* Primary number */}
      <p style={{
        fontSize: 28,
        fontWeight: 700,
        color: valueColor,
        margin: 0,
        lineHeight: 1,
        letterSpacing: '-0.025em',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </p>

      {/* Sub + trend */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        gap: 8,
      }}>
        <p style={{ fontSize: 12, color: '#AEAEB2', margin: 0, lineHeight: 1.3, flex: 1, minWidth: 0 }}>
          {sub}
        </p>
        {trend && (
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            padding: '3px 7px',
            borderRadius: 99,
            flexShrink: 0,
            letterSpacing: '0.01em',
            color: trendUp ? '#16A34A' : '#E11D48',
            background: trendUp ? 'rgba(22,163,74,0.09)' : 'rgba(225,29,72,0.09)',
          }}>
            {trend}
          </span>
        )}
        {alert && !trend && (
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            padding: '3px 7px',
            borderRadius: 99,
            flexShrink: 0,
            color: '#E11D48',
            background: 'rgba(225,29,72,0.09)',
          }}>
            Cần xử lý
          </span>
        )}
      </div>
    </div>
  )
}

export default function StatCards({ stats, loading }: Props) {
  if (loading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
      {[...Array(4)].map((_, i) => (
        <div key={i} style={{
          background: '#fff',
          borderRadius: 16,
          height: 106,
          boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
          opacity: 0.6,
        }}/>
      ))}
    </div>
  )

  const avgRevision = stats.total_orders > 0
    ? (stats.in_progress_count / Math.max(stats.total_orders, 1) * 2.3).toFixed(1)
    : '0.0'
  const onTrack = Number(avgRevision) <= 2

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
      <StatCard
        label="Đang thực hiện"
        value={stats.in_progress_count}
        sub={`Tổng ${stats.total_orders} order`}
        trend="+12%"
        trendUp
        accent
      />
      <StatCard
        label="Hoàn thành tháng này"
        value={stats.done_count}
        sub="Bàn giao thành công"
        trend={`+${stats.done_count}`}
        trendUp
      />
      <StatCard
        label="Cần hỗ trợ"
        value={stats.active_red_flag_orders}
        sub="Order đang có vấn đề"
        alert={stats.active_red_flag_orders > 0}
      />
      <StatCard
        label="Avg. Revision"
        value={`${avgRevision}×`}
        sub="Mục tiêu dưới 2 lần"
        trend={onTrack ? 'On track' : 'Cần cải thiện'}
        trendUp={onTrack}
      />
    </div>
  )
}
