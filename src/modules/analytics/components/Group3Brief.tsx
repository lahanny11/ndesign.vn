import type { AnalyticsData } from '../types/analytics.types'
import KPIStat from './KPIStat'
import BarChart from './BarChart'
import DonutChart from './DonutChart'
import LineChart from './LineChart'

interface Group3BriefProps {
  data: AnalyticsData
}

const DESIGNER_COLORS = ['#2563EB', '#007AFF', '#34C759']

export default function Group3Brief({ data }: Group3BriefProps) {
  const sortedTeams = [...data.revision_by_team].sort((a, b) => b.avg_revisions - a.avg_revisions)
  const topTeam = sortedTeams[0]

  const teamBarItems = sortedTeams.map(t => ({
    label: t.team,
    value: t.avg_revisions,
    color: '#2563EB',
  }))

  const lineSeries = data.done_by_designer_monthly.map((d, i) => ({
    name: d.name,
    color: DESIGNER_COLORS[i % DESIGNER_COLORS.length],
    data: d.months,
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Row 1 — 2 KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        <KPIStat
          label="Task brief bị trả lại"
          value={data.tasks_brief_returned}
          unit="tasks"
          status={data.tasks_brief_returned > 0 ? 'warn' : 'good'}
          hint="Brief thiếu thông tin, cần bổ sung"
        />
        <KPIStat
          label="Team revise cao nhất"
          value={topTeam ? topTeam.team : '—'}
          unit=""
          status={topTeam && topTeam.avg_revisions > 2 ? 'bad' : topTeam && topTeam.avg_revisions > 1.5 ? 'warn' : 'neutral'}
          hint={topTeam ? `TB ${topTeam.avg_revisions} vòng · ${topTeam.task_count} tasks` : ''}
        />
      </div>

      {/* Row 2 — Team bar + Donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
        {/* Team revision bar */}
        <div style={{
          background: '#fff',
          borderRadius: 14,
          padding: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#1D1D1F', marginBottom: 4 }}>
            Vòng revise theo Team
          </div>
          <div style={{ fontSize: 11, color: '#AEAEB2', marginBottom: 16 }}>
            Sắp xếp giảm dần
          </div>
          <BarChart
            items={teamBarItems}
            max={3}
            unit=" vòng"
            threshold={2}
          />
        </div>

        {/* Task type donut */}
        <div style={{
          background: '#fff',
          borderRadius: 14,
          padding: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#1D1D1F', marginBottom: 16 }}>
            Phân bổ loại task
          </div>
          <DonutChart items={data.tasks_by_type} />
        </div>
      </div>

      {/* Row 3 — Monthly trend full width */}
      <div style={{
        background: '#fff',
        borderRadius: 14,
        padding: 20,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#1D1D1F', marginBottom: 4 }}>
          Xu hướng hoàn thành theo tháng
        </div>
        <div style={{ fontSize: 11, color: '#AEAEB2', marginBottom: 16 }}>
          Số lượng task done mỗi tháng theo designer
        </div>
        <LineChart series={lineSeries} height={140} />
      </div>
    </div>
  )
}
