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

function nameToColor(name: string): string {
  const COLORS = ['#2563EB', '#16A34A', '#FF9F0A', '#E11D48', '#AF52DE', '#00C7BE', '#FF6B35']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffffff
  return COLORS[Math.abs(hash) % COLORS.length]
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Chờ nhận', assigned: 'Đã nhận', in_progress: 'Đang làm',
  delivered: 'Đã giao', feedback: 'Feedback', done: 'Hoàn thành',
}

function DesignerCard({ designer }: { designer: DesignerWorkload }) {
  const [expanded, setExpanded] = useState(false)
  const avatarColor = nameToColor(designer.name)
  const total = designer.active_tasks + designer.pending_tasks
  const capPct = Math.min((total / MAX_CAPACITY) * 100, 100)
  const capColor = total >= MAX_CAPACITY ? '#E11D48' : total >= 5 ? '#FF9F0A' : '#16A34A'
  const reviseAlert = designer.avg_revisions > 2

  return (
    <div
      onClick={() => setExpanded(v => !v)}
      style={{
        background: '#fff',
        borderRadius: 14,
        padding: '16px',
        border: designer.has_blocked
          ? '1px solid rgba(225,29,72,0.18)'
          : '1px solid rgba(0,0,0,0.06)',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      }}
      onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)')}
      onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)')}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%', background: avatarColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{designer.name[0]}</span>
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F', margin: 0, lineHeight: 1.2 }}>
            {designer.name}
          </p>
          <p style={{ fontSize: 11, color: '#AEAEB2', margin: '2px 0 0' }}>Designer</p>
        </div>
        {designer.has_blocked && (
          <span style={{
            fontSize: 10, fontWeight: 600,
            padding: '3px 8px', borderRadius: 6,
            background: 'rgba(225,29,72,0.09)', color: '#E11D48',
            flexShrink: 0,
          }}>
            Blocked
          </span>
        )}
      </div>

      {/* Stats grid — 3 metrics in a row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gap: 1,
        background: 'rgba(0,0,0,0.05)',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 12,
      }}>
        {[
          { label: 'Đang làm', value: designer.active_tasks, color: '#2563EB' },
          { label: 'Done/tuần', value: designer.done_this_week, color: '#16A34A' },
          { label: 'Revise TB', value: designer.avg_revisions.toFixed(1), color: reviseAlert ? '#E11D48' : '#1D1D1F' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: '#fff',
            padding: '10px 0',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: 18,
              fontWeight: 700,
              color: stat.color,
              margin: 0,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {stat.value}
            </p>
            <p style={{
              fontSize: 10,
              color: '#AEAEB2',
              margin: '4px 0 0',
              lineHeight: 1,
            }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Capacity bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
          <span style={{
            fontSize: 10, fontWeight: 600, color: '#AEAEB2',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            Capacity
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: capColor, fontVariantNumeric: 'tabular-nums' }}>
            {total}/{MAX_CAPACITY}
          </span>
        </div>
        {/* Dot-based capacity — Apple-style */}
        <div style={{ display: 'flex', gap: 4 }}>
          {Array.from({ length: MAX_CAPACITY }).map((_, i) => (
            <div key={i} style={{
              flex: 1,
              height: 5,
              borderRadius: 99,
              background: i < total ? capColor : 'rgba(0,0,0,0.08)',
              transition: 'background 0.3s',
            }}/>
          ))}
        </div>
      </div>

      {/* Expanded task list */}
      {expanded && designer.tasks.length > 0 && (
        <div style={{
          marginTop: 12,
          paddingTop: 12,
          borderTop: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}>
          {designer.tasks.map(task => (
            <div key={task.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 10px',
              borderRadius: 8,
              background: task.has_red_flag ? 'rgba(225,29,72,0.04)' : 'rgba(0,0,0,0.02)',
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                background: task.has_red_flag ? '#E11D48' : '#AEAEB2',
              }}/>
              <p style={{
                fontSize: 11, color: '#3A3A3C', margin: 0, flex: 1, minWidth: 0,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {task.task_name}
              </p>
              <span style={{
                fontSize: 10, fontWeight: 500,
                color: task.has_red_flag ? '#E11D48' : '#6E6E73',
                flexShrink: 0,
              }}>
                {STATUS_LABEL[task.status]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function WorkloadPanel() {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: '18px 20px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1D1D1F', margin: 0, letterSpacing: '-0.01em' }}>
            Workload Designer
          </h3>
          <p style={{ fontSize: 12, color: '#AEAEB2', margin: '2px 0 0' }}>
            Click card để xem task chi tiết
          </p>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 500,
          padding: '4px 10px', borderRadius: 99,
          background: 'rgba(0,0,0,0.05)', color: '#6E6E73',
        }}>
          Hôm nay
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {DESIGNER_WORKLOAD.map(d => (
          <DesignerCard key={d.id} designer={d} />
        ))}
      </div>
    </div>
  )
}
