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
  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-3"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }}>
      <div className="flex items-start justify-between">
        <p className="text-[13px] font-medium text-[#6E6E73]">{label}</p>
        {trend && (
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full
            ${trendUp ? 'text-[#34C759] bg-[#34C759]/10' : 'text-[#FF9F0A] bg-[#FF9F0A]/10'}`}>
            {trend}
          </span>
        )}
        {alert && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full text-[#FF3B30] bg-[#FF3B30]/8">
            Cần xử lý
          </span>
        )}
      </div>

      <div>
        <p className={`text-[32px] font-bold tracking-tight leading-none
          ${accent ? 'text-[#5E5CE6]' : alert ? 'text-[#FF3B30]' : 'text-[#1D1D1F]'}`}>
          {value}
        </p>
        <p className="text-[12px] text-[#AEAEB2] mt-1.5">{sub}</p>
      </div>
    </div>
  )
}

export default function StatCards({ stats, loading }: Props) {
  if (loading) return (
    <div className="grid grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl h-[108px] animate-pulse"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}/>
      ))}
    </div>
  )

  const avgRevision = stats.total_orders > 0
    ? (stats.in_progress_count / Math.max(stats.total_orders, 1) * 2.3).toFixed(1)
    : '0.0'

  return (
    <div className="grid grid-cols-4 gap-3">
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
        sub="Đã bàn giao thành công"
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
        value={`${avgRevision}x`}
        sub="Mục tiêu dưới 2 lần"
        trend={Number(avgRevision) <= 2 ? 'On track' : 'Over target'}
        trendUp={Number(avgRevision) <= 2}
      />
    </div>
  )
}
