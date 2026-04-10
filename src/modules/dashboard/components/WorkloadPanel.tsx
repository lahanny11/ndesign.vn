import { useState } from 'react'

interface DesignerTask {
  id: string
  task_name: string
  status: string
  has_red_flag: boolean
  deadline: string
}

interface DesignerWorkload {
  id: string
  name: string
  active_tasks: number
  pending_tasks: number
  done_this_week: number
  avg_revisions: number
  has_blocked: boolean
  tasks: DesignerTask[]
}

const DESIGNER_WORKLOAD: DesignerWorkload[] = [
  {
    id: 'u-de-1', name: 'Lê Văn A', active_tasks: 4, pending_tasks: 1,
    done_this_week: 3, avg_revisions: 1.1, has_blocked: false,
    tasks: [
      { id: '1', task_name: 'Banner Mạng xã hội Xuân 2025', status: 'assigned', has_red_flag: false, deadline: '2026-04-15' },
    ],
  },
  {
    id: 'u-de-2', name: 'Trần Thị B', active_tasks: 6, pending_tasks: 0,
    done_this_week: 1, avg_revisions: 2.1, has_blocked: true,
    tasks: [
      { id: '3', task_name: 'Slide bài giảng tháng 4', status: 'feedback', has_red_flag: true, deadline: '2026-04-10' },
    ],
  },
  {
    id: 'u-de-3', name: 'Nguyễn C', active_tasks: 3, pending_tasks: 2,
    done_this_week: 2, avg_revisions: 1.3, has_blocked: false,
    tasks: [],
  },
]

const MAX_CAPACITY = 7

// Simple name-to-color hash
function nameToColor(name: string): string {
  const COLORS = ['#2563EB', '#16A34A', '#FF9F0A', '#E11D48', '#AF52DE', '#00C7BE', '#FF6B35']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffffff
  return COLORS[Math.abs(hash) % COLORS.length]
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Chờ nhận',
  assigned: 'Đã nhận',
  in_progress: 'Đang làm',
  delivered: 'Đã giao',
  feedback: 'Feedback',
  done: 'Hoàn thành',
}

interface DesignerCardProps {
  designer: DesignerWorkload
}

function DesignerCard({ designer }: DesignerCardProps) {
  const [expanded, setExpanded] = useState(false)
  const avatarColor = nameToColor(designer.name)
  const total = designer.active_tasks + designer.pending_tasks
  const capPct = Math.min((total / MAX_CAPACITY) * 100, 100)
  const capColor = total >= MAX_CAPACITY ? '#E11D48' : total >= 5 ? '#FF9F0A' : '#16A34A'

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 14,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        padding: '14px 16px',
        minWidth: 175,
        maxWidth: 210,
        flex: '0 0 auto',
        cursor: 'pointer',
        border: designer.has_blocked ? '1px solid rgba(255,59,48,0.2)' : '1px solid rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.2s',
      }}
      onClick={() => setExpanded(v => !v)}
      onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)')}
      onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)')}
    >
      {/* Header: avatar + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: avatarColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ color: 'white', fontSize: 13, fontWeight: 700 }}>{designer.name[0]}</span>
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {designer.name}
          </p>
          <p style={{ fontSize: 10, color: '#AEAEB2', margin: 0 }}>Designer</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: '#6E6E73', flex: 1 }}>Đang làm</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1D1D1F' }}>{designer.active_tasks}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: '#6E6E73', flex: 1 }}>Done/tuần</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#16A34A' }}>{designer.done_this_week}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: '#6E6E73', flex: 1 }}>Revise TB</span>
          <span style={{
            fontSize: 12, fontWeight: 700,
            color: designer.avg_revisions > 2 ? '#E11D48' : '#1D1D1F',
          }}>{designer.avg_revisions.toFixed(1)}</span>
        </div>
      </div>

      {/* Capacity bar */}
      <div style={{ marginBottom: designer.has_blocked ? 8 : 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ fontSize: 9, color: '#AEAEB2', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
            Capacity
          </span>
          <span style={{ fontSize: 9, fontWeight: 700, color: capColor }}>{total}/{MAX_CAPACITY}</span>
        </div>
        <div style={{ height: 4, background: 'rgba(0,0,0,0.07)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${capPct}%`, background: capColor, borderRadius: 99, transition: 'width 0.4s' }}/>
        </div>
      </div>

      {/* Blocked badge */}
      {designer.has_blocked && (
        <div style={{
          marginTop: 8,
          background: 'rgba(255,59,48,0.1)', color: '#E11D48',
          fontSize: 10, fontWeight: 600,
          padding: '3px 8px', borderRadius: 6, display: 'inline-block',
        }}>
          Blocked
        </div>
      )}

      {/* Expanded tasks list */}
      {expanded && designer.tasks.length > 0 && (
        <div style={{
          marginTop: 12,
          borderTop: '1px solid rgba(0,0,0,0.07)',
          paddingTop: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}>
          {designer.tasks.map(task => (
            <div key={task.id} style={{
              background: task.has_red_flag ? 'rgba(255,59,48,0.05)' : 'rgba(0,0,0,0.03)',
              borderRadius: 8, padding: '6px 8px',
              border: task.has_red_flag ? '1px solid rgba(255,59,48,0.15)' : '1px solid transparent',
            }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: '#1D1D1F', margin: '0 0 2px', lineHeight: 1.3 }}>
                {task.task_name}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  fontSize: 9, fontWeight: 600,
                  color: task.has_red_flag ? '#E11D48' : '#6E6E73',
                }}>
                  {STATUS_LABEL[task.status] ?? task.status}
                </span>
                <span style={{ fontSize: 9, color: '#AEAEB2' }}>
                  {new Date(task.deadline).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {expanded && designer.tasks.length === 0 && (
        <p style={{ fontSize: 10, color: '#AEAEB2', fontStyle: 'italic', marginTop: 10, marginBottom: 0 }}>
          Không có task nào
        </p>
      )}
    </div>
  )
}

export default function WorkloadPanel() {
  return (
    <div style={{ marginBottom: 4 }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F', margin: 0 }}>
          Workload Designer
        </h3>
        <span style={{
          fontSize: 10, fontWeight: 600, color: '#6E6E73',
          background: 'rgba(0,0,0,0.07)', padding: '2px 8px', borderRadius: 20,
        }}>
          Hôm nay
        </span>
      </div>

      {/* Designer cards — horizontal scroll */}
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
        {DESIGNER_WORKLOAD.map(d => (
          <DesignerCard key={d.id} designer={d} />
        ))}
      </div>
    </div>
  )
}
