import type { AnalyticsData } from '../types/analytics.types'
import KPIStat from './KPIStat'
import BarChart from './BarChart'

interface Group2QualityProps {
  data: AnalyticsData
}

function revisionStatus(avg: number) {
  if (avg <= 1) return 'good' as const
  if (avg <= 2) return 'warn' as const
  return 'bad' as const
}

function qaStatus(rate: number) {
  if (rate >= 80) return 'good' as const
  if (rate >= 65) return 'warn' as const
  return 'bad' as const
}

export default function Group2Quality({ data }: Group2QualityProps) {
  const sortedDesigners = [...data.revision_by_designer].sort((a, b) => b.avg_revisions - a.avg_revisions)

  const barItems = sortedDesigners.map(d => ({
    label: d.name,
    value: d.avg_revisions,
    color: '#2563EB',
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Row 1 — 3 KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <KPIStat
          label="Vòng revise trung bình"
          value={data.avg_revision_rounds.toFixed(1)}
          unit="vòng"
          status={revisionStatus(data.avg_revision_rounds)}
          hint="Mục tiêu: ≤ 1.5 vòng"
        />
        <KPIStat
          label="Task > 2 vòng revise"
          value={data.tasks_over_2_revisions}
          unit="tasks"
          status={data.tasks_over_2_revisions > 0 ? 'warn' : 'good'}
          hint="Cần review quy trình"
        />
        <KPIStat
          label="QA pass lần đầu"
          value={data.qa_pass_rate_first_time}
          unit="%"
          status={qaStatus(data.qa_pass_rate_first_time)}
          hint="Tỉ lệ giao đúng ngay lần 1"
        />
      </div>

      {/* Row 2 — Designer revision bar chart */}
      <div style={{
        background: '#fff',
        borderRadius: 14,
        padding: 20,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#1D1D1F', marginBottom: 4 }}>
          Vòng revise theo Designer
        </div>
        <div style={{ fontSize: 11, color: '#AEAEB2', marginBottom: 16 }}>
          Bar đỏ = vượt ngưỡng 2.0 vòng
        </div>

        <BarChart
          items={barItems}
          max={4}
          unit=" vòng"
          threshold={2}
        />

        {/* Secondary info: task count */}
        <div style={{
          marginTop: 16,
          paddingTop: 14,
          borderTop: '1px solid rgba(0,0,0,0.06)',
          display: 'grid',
          gridTemplateColumns: `repeat(${sortedDesigners.length}, 1fr)`,
          gap: 8,
        }}>
          {sortedDesigners.map((d) => (
            <div key={d.name} style={{
              textAlign: 'center',
              padding: '8px 0',
              background: 'rgba(0,0,0,0.02)',
              borderRadius: 8,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#1D1D1F' }}>{d.name}</div>
              <div style={{ fontSize: 10, color: '#6E6E73', marginTop: 2 }}>
                {d.done_count}/{d.task_count} done
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
