import type { AnalyticsData } from '../types/analytics.types'
import KPIStat from './KPIStat'

interface Group1ProductionProps {
  data: AnalyticsData
}

const PRIORITY_CONFIG = {
  HIGH:   { label: 'HIGH',   color: '#FF3B30', bg: 'rgba(255,59,48,0.08)' },
  MEDIUM: { label: 'MEDIUM', color: '#FF9F0A', bg: 'rgba(255,159,10,0.08)' },
  LOW:    { label: 'LOW',    color: '#34C759', bg: 'rgba(52,199,89,0.08)' },
} as const

function slaStatus(rate: number) {
  if (rate >= 90) return 'good' as const
  if (rate >= 80) return 'warn' as const
  return 'bad' as const
}

export default function Group1Production({ data }: Group1ProductionProps) {
  const allLateTasks = [...data.late_tasks, ...data.soon_late_tasks]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Row 1 — 4 KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <KPIStat
          label="Đang thực hiện"
          value={data.total_in_progress}
          unit="tasks"
          status="neutral"
          hint="Order đang trong quy trình"
        />
        <KPIStat
          label="SLA Rate"
          value={data.sla_rate}
          unit="%"
          status={slaStatus(data.sla_rate)}
          hint={data.sla_rate < 90 ? 'Mục tiêu: 90%' : 'Đạt mục tiêu 90%'}
        />
        <KPIStat
          label="Sắp trễ deadline"
          value={data.soon_late_count}
          unit="tasks"
          status={data.soon_late_count > 0 ? 'warn' : 'good'}
          hint="Còn ≤ 2 ngày"
        />
        <KPIStat
          label="Đã trễ deadline"
          value={data.late_count}
          unit="tasks"
          status={data.late_count > 0 ? 'bad' : 'good'}
          hint="Quá hạn giao"
        />
      </div>

      {/* Row 2 — Priority split + task list */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 12 }}>
        {/* Priority breakdown */}
        <div style={{
          background: '#fff',
          borderRadius: 14,
          padding: 18,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#1D1D1F', marginBottom: 14 }}>
            Phân bổ theo độ ưu tiên
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(['HIGH', 'MEDIUM', 'LOW'] as const).map((p) => {
              const cfg = PRIORITY_CONFIG[p]
              const count = data.tasks_by_priority[p]
              const total = data.tasks_by_priority.HIGH + data.tasks_by_priority.MEDIUM + data.tasks_by_priority.LOW
              const pct = total > 0 ? Math.round((count / total) * 100) : 0
              return (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: cfg.bg,
                    color: cfg.color,
                    fontSize: 10,
                    fontWeight: 700,
                    minWidth: 60,
                    textAlign: 'center',
                    letterSpacing: '0.3px',
                  }}>
                    {cfg.label}
                  </div>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: cfg.color, borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1D1D1F', minWidth: 20, textAlign: 'right' }}>
                    {count}
                  </span>
                </div>
              )
            })}
          </div>

          {/* New vs done summary */}
          <div style={{
            marginTop: 16,
            paddingTop: 12,
            borderTop: '1px solid rgba(0,0,0,0.06)',
            display: 'flex',
            gap: 16,
          }}>
            <div>
              <div style={{ fontSize: 10, color: '#AEAEB2', fontWeight: 500 }}>Order mới</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#1D1D1F' }}>{data.new_tasks_count}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#AEAEB2', fontWeight: 500 }}>Hoàn thành</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#34C759' }}>{data.done_count}</div>
            </div>
          </div>
        </div>

        {/* Late / soon-late task list */}
        <div style={{
          background: '#fff',
          borderRadius: 14,
          padding: 18,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#1D1D1F', marginBottom: 14 }}>
            Task cần chú ý
          </div>

          {allLateTasks.length === 0 ? (
            <div style={{ fontSize: 12, color: '#AEAEB2', textAlign: 'center', padding: '16px 0' }}>
              Không có task trễ
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Late tasks */}
              {data.late_tasks.map((t) => (
                <div key={t.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 10px',
                  borderRadius: 10,
                  background: 'rgba(255,59,48,0.05)',
                  border: '1px solid rgba(255,59,48,0.15)',
                }}>
                  <div style={{
                    padding: '2px 6px',
                    borderRadius: 5,
                    background: 'rgba(255,59,48,0.1)',
                    color: '#FF3B30',
                    fontSize: 9,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    TRỄ {t.days_late}N
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1D1D1F', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.task_name}
                    </div>
                    <div style={{ fontSize: 10, color: '#6E6E73' }}>{t.designer}</div>
                  </div>
                  <div style={{
                    padding: '2px 6px',
                    borderRadius: 5,
                    background: t.priority === 'HIGH' ? 'rgba(255,59,48,0.08)' : 'rgba(255,159,10,0.08)',
                    color: t.priority === 'HIGH' ? '#FF3B30' : '#FF9F0A',
                    fontSize: 9,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {t.priority}
                  </div>
                </div>
              ))}

              {/* Soon-late tasks */}
              {data.soon_late_tasks.map((t) => (
                <div key={t.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 10px',
                  borderRadius: 10,
                  background: 'rgba(255,159,10,0.05)',
                  border: '1px solid rgba(255,159,10,0.15)',
                }}>
                  <div style={{
                    padding: '2px 6px',
                    borderRadius: 5,
                    background: 'rgba(255,159,10,0.1)',
                    color: '#FF9F0A',
                    fontSize: 9,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    CÒN {t.days_remaining}N
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1D1D1F', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.task_name}
                    </div>
                    <div style={{ fontSize: 10, color: '#6E6E73' }}>{t.designer}</div>
                  </div>
                  <div style={{
                    padding: '2px 6px',
                    borderRadius: 5,
                    background: t.priority === 'HIGH' ? 'rgba(255,59,48,0.08)' : 'rgba(255,159,10,0.08)',
                    color: t.priority === 'HIGH' ? '#FF3B30' : '#FF9F0A',
                    fontSize: 9,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {t.priority}
                  </div>
                </div>
              ))}

              {/* High priority pending */}
              {data.high_priority_pending.map((t) => (
                <div key={t.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 10px',
                  borderRadius: 10,
                  background: 'rgba(94,92,230,0.05)',
                  border: '1px solid rgba(37,99,235,0.1)',
                }}>
                  <div style={{
                    padding: '2px 6px',
                    borderRadius: 5,
                    background: 'rgba(37,99,235,0.1)',
                    color: '#2563EB',
                    fontSize: 9,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    HIGH
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1D1D1F', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.task_name}
                    </div>
                    <div style={{ fontSize: 10, color: '#6E6E73' }}>{t.step} · {t.days_pending} ngày</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
