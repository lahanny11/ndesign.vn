import { useState } from 'react'
import AppLayout from '../../../shared/layouts/AppLayout'
import StatCards from '../components/StatCards'
import AlertBanner from '../components/AlertBanner'
import FilterTabs from '../components/FilterTabs'
import OrderGrid from '../components/OrderGrid'
import WorkloadPanel from '../components/WorkloadPanel'
import TrackingPanel from '../../tracking/components/TrackingPanel'
import OrderFormModal from '../../order-form/components/OrderFormModal'
import { useDashboardStore } from '../stores/dashboard.store'
import { useOrders } from '../hooks/useOrders'
import { useDashboardStats } from '../hooks/useDashboardStats'
import { useSelfAssign } from '../hooks/useSelfAssign'
import { useOrderDetail } from '../../tracking/hooks/useOrderDetail'
import { useCurrentUser } from '../../../shared/hooks/useCurrentUser'
import { useRoleStore } from '../../../shared/stores/role.store'
import type { FilterTab } from '../types/dashboard.types'

// Orderer-specific simple stat cards
interface SimpleStatCardProps {
  label: string
  value: number | string
  color?: string
  sub?: string
  badge?: string
  badgeColor?: string
  badgeBg?: string
}

function SimpleStatCard({ label, value, color, sub, badge, badgeColor, badgeBg }: SimpleStatCardProps) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: '18px 20px 16px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
      display: 'flex', flexDirection: 'column',
    }}>
      <p style={{ fontSize: 11, fontWeight: 500, color: '#AEAEB2', margin: '0 0 10px', letterSpacing: '0.02em', textTransform: 'uppercase', lineHeight: 1 }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 700, color: color ?? '#1D1D1F', margin: 0, lineHeight: 1, letterSpacing: '-0.025em', fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </p>
      {(sub || badge) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, gap: 8 }}>
          {sub && <p style={{ fontSize: 12, color: '#AEAEB2', margin: 0, lineHeight: 1.3, flex: 1, minWidth: 0 }}>{sub}</p>}
          {badge && (
            <span style={{
              fontSize: 10, fontWeight: 600, padding: '3px 7px', borderRadius: 99,
              flexShrink: 0, color: badgeColor, background: badgeBg,
            }}>
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// Designer-specific stat cards
interface DesignerStatCardsProps {
  stats: { active: number; pending: number; done: number; avgRevision: string }
}

function DesignerStatCards({ stats }: DesignerStatCardsProps) {
  const cards = [
    { label: 'Task đang làm', value: stats.active, color: '#2563EB' },
    { label: 'Task cần làm', value: stats.pending, color: '#FF9F0A' },
    { label: 'Done tuần này', value: stats.done, color: '#16A34A' },
    { label: 'Revise TB của tôi', value: stats.avgRevision, color: '#1D1D1F' },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
      {cards.map(c => (
        <div key={c.label} style={{
          background: '#fff', borderRadius: 16, padding: '18px 20px 16px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
        }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#AEAEB2', margin: '0 0 10px', letterSpacing: '0.02em', textTransform: 'uppercase', lineHeight: 1 }}>{c.label}</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: c.color, margin: 0, lineHeight: 1, letterSpacing: '-0.025em', fontVariantNumeric: 'tabular-nums' }}>{c.value}</p>
        </div>
      ))}
    </div>
  )
}

// Orderer filter tabs — simplified
const ORDERER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'active', label: 'Đang xử lý' },
  { key: 'done', label: 'Hoàn thành' },
]

// Designer filter tabs
const DESIGNER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all',     label: 'Tất cả' },
  { key: 'pending', label: 'Chờ nhận' },   // pool order có thể self-assign
  { key: 'active',  label: 'Đang làm' },
  { key: 'done',    label: 'Done' },
]

interface SimplifiedTabsProps {
  tabs: { key: FilterTab; label: string }[]
  active: FilterTab
  onChange: (tab: FilterTab) => void
  total: number
  title: string
}

function SimplifiedTabs({ tabs, active, onChange, total, title }: SimplifiedTabsProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: '#1D1D1F', margin: 0, letterSpacing: '-0.01em' }}>{title}</h2>
          <p style={{ fontSize: 12, color: '#AEAEB2', margin: '2px 0 0' }}>{total} order</p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4, padding: 4,
          background: 'rgba(0,0,0,0.06)', borderRadius: 10,
        }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                background: active === tab.key ? '#fff' : 'transparent',
                color: active === tab.key ? '#1D1D1F' : '#6E6E73',
                boxShadow: active === tab.key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { activeTab, setActiveTab, panelOrderId, openPanel, closePanel } = useDashboardStore()
  const [formOpen, setFormOpen] = useState(false)
  const [selfAssigningId, setSelfAssigningId] = useState<string | null>(null)

  const role = useRoleStore(s => s.role)
  const { data: user } = useCurrentUser()

  const { data: ordersData, isLoading: ordersLoading } = useOrders(activeTab)
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: orderDetail } = useOrderDetail(panelOrderId)
  const selfAssign = useSelfAssign()

  const orders = ordersData?.data ?? []
  const flaggedOrders = orders.filter(o => o.has_red_flag).map(o => o.task_name)

  // isLeader — design_leader hoặc co_leader có cùng quyền quản lý
  const isLeader = role === 'design_leader' || role === 'co_leader'

  // Page title by role
  const pageTitle = role === 'orderer'
    ? 'Order của tôi'
    : role === 'designer'
      ? 'Task của tôi'
      : 'Quản lý Order'

  function handleSelfAssign(orderId: string) {
    setSelfAssigningId(orderId)
    selfAssign.mutate(orderId, {
      onSettled: () => setSelfAssigningId(null),
      onError: (err) => {
        alert(err?.message ?? 'Không thể nhận task. Vui lòng thử lại.')
      },
    })
  }

  // Greeting by role
  const activeOrderCount = orders.filter(o => ['assigned', 'in_progress', 'feedback', 'delivered'].includes(o.status)).length

  // Designer computed stats from orders list
  const designerStats = {
    active: orders.filter(o => ['assigned', 'in_progress'].includes(o.status)).length,
    pending: orders.filter(o => o.status === 'pending').length,
    done: orders.filter(o => o.status === 'done').length,
    avgRevision: orders.length > 0
      ? (orders.reduce((sum, o) => sum + o.revision_rounds, 0) / orders.length).toFixed(1)
      : '0.0',
  }

  return (
    <>
      <AppLayout
        onCreateOrder={role === 'orderer' || role === 'design_leader' || role === 'co_leader' ? () => setFormOpen(true) : undefined}
        title={pageTitle}
      >
        <div className="flex flex-col gap-3.5">

          {/* ── LEADER VIEW (design_leader + co_leader) ── */}
          {isLeader && (
            <>
              <StatCards
                stats={stats ?? {
                  total_orders: 0, in_progress_count: 0, done_count: 0,
                  urgent_count: 0, active_red_flag_orders: 0,
                  active_warn_flag_orders: 0, pending_assignment: 0,
                  avg_revision_rounds: 0,
                }}
                loading={statsLoading}
              />
              <AlertBanner flaggedOrders={flaggedOrders} />
              <WorkloadPanel />
              <FilterTabs
                active={activeTab}
                onChange={setActiveTab}
                total={ordersData?.meta.total ?? 0}
                flagCount={(stats?.active_red_flag_orders ?? 0) + (stats?.active_warn_flag_orders ?? 0)}
              />
            </>
          )}

          {/* ── ORDERER VIEW ── */}
          {role === 'orderer' && (
            <>
              {/* Greeting */}
              <div style={{
                background: '#fff', borderRadius: 16, padding: '16px 20px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #ec4899)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{ color: 'white', fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em' }}>
                    {user?.display_name?.[0] ?? '?'}
                  </span>
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#1D1D1F', margin: 0, letterSpacing: '-0.01em' }}>
                    Xin chào, {user?.display_name ?? 'bạn'}!
                  </p>
                  <p style={{ fontSize: 12, color: '#AEAEB2', margin: '3px 0 0' }}>
                    Bạn có {activeOrderCount} order đang xử lý
                  </p>
                </div>
              </div>

              {/* 3 stat cards — bao gồm revision feedback */}
              {(() => {
                const myOrders = orders
                const doneCount = myOrders.filter(o => o.status === 'done').length
                const myRevOrders = myOrders.filter(o => o.revision_rounds > 0)
                const myAvgRev = myRevOrders.length > 0
                  ? myRevOrders.reduce((s, o) => s + o.revision_rounds, 0) / myRevOrders.length
                  : 0
                const revOk = myAvgRev <= 1.5
                return (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    <SimpleStatCard label="Order đang chạy" value={activeOrderCount} color="#2563EB" sub={`Tổng ${myOrders.length} order`} />
                    <SimpleStatCard label="Hoàn thành" value={doneCount} color="#16A34A" sub="Bàn giao thành công" />
                    <SimpleStatCard
                      label="Brief quality"
                      value={myOrders.length > 0 ? `${myAvgRev.toFixed(1)}×` : '—'}
                      color={myAvgRev > 2 ? '#E11D48' : myAvgRev > 1.5 ? '#FF9F0A' : '#16A34A'}
                      sub="Revise TB từ brief của bạn"
                      badge={myOrders.length > 0 ? (revOk ? 'Brief tốt' : 'Cải thiện brief') : undefined}
                      badgeColor={revOk ? '#16A34A' : '#FF9F0A'}
                      badgeBg={revOk ? 'rgba(22,163,74,0.09)' : 'rgba(255,159,10,0.09)'}
                    />
                  </div>
                )
              })()}

              <SimplifiedTabs
                tabs={ORDERER_TABS}
                active={activeTab}
                onChange={setActiveTab}
                total={ordersData?.meta.total ?? 0}
                title="Danh sách order"
              />
            </>
          )}

          {/* ── DESIGNER VIEW ── */}
          {role === 'designer' && (
            <>
              {/* Greeting */}
              <div style={{
                background: '#fff', borderRadius: 16, padding: '16px 20px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #16A34A, #059669)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{ color: 'white', fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em' }}>
                    {user?.display_name?.[0] ?? '?'}
                  </span>
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#1D1D1F', margin: 0, letterSpacing: '-0.01em' }}>
                    Xin chào, {user?.display_name ?? 'bạn'}!
                  </p>
                  <p style={{ fontSize: 12, color: '#AEAEB2', margin: '3px 0 0' }}>
                    Bạn có {designerStats.active} task đang làm hôm nay
                  </p>
                </div>
              </div>

              {/* Revision quality card — self-feedback loop cho designer (P5) */}
              {(() => {
                const myAvg = parseFloat(designerStats.avgRevision)
                const revWarn = myAvg > 1.5 && myAvg <= 2
                const revBad = myAvg > 2
                const badge = orders.length === 0 ? undefined
                  : revBad  ? 'Cần cải thiện'
                  : revWarn ? 'Chú ý'
                  : 'Tốt'
                const badgeColor = revBad ? '#E11D48' : revWarn ? '#FF9F0A' : '#16A34A'
                const badgeBg = revBad ? 'rgba(225,29,72,0.09)' : revWarn ? 'rgba(255,159,10,0.09)' : 'rgba(22,163,74,0.09)'
                return (
                  <div style={{
                    background: '#fff', borderRadius: 14, padding: '14px 18px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
                    display: 'flex', alignItems: 'center', gap: 16,
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: revBad ? 'rgba(225,29,72,0.07)' : revWarn ? 'rgba(255,159,10,0.07)' : 'rgba(22,163,74,0.07)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: 20 }}>{revBad ? '⚠️' : revWarn ? '🔍' : '✓'}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F', margin: 0 }}>
                        Chất lượng công việc của bạn
                      </p>
                      <p style={{ fontSize: 12, color: '#6E6E73', margin: '3px 0 0' }}>
                        Avg. revision:{' '}
                        <strong style={{ color: revBad ? '#E11D48' : revWarn ? '#FF9F0A' : '#16A34A', fontVariantNumeric: 'tabular-nums' }}>
                          {orders.length > 0 ? `${designerStats.avgRevision}×` : '—'}
                        </strong>
                        {' · '}Mục tiêu ≤ 1.5 vòng
                      </p>
                    </div>
                    {badge && (
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 99,
                        flexShrink: 0, color: badgeColor, background: badgeBg,
                      }}>
                        {badge}
                      </span>
                    )}
                  </div>
                )
              })()}
              <DesignerStatCards stats={designerStats} />

              <SimplifiedTabs
                tabs={DESIGNER_TABS}
                active={activeTab}
                onChange={setActiveTab}
                total={ordersData?.meta.total ?? 0}
                title="Task của tôi"
              />
            </>
          )}

          {/* Order grid — all roles. Designer thấy nút "Nhận task" trên pending orders */}
          <OrderGrid
            orders={orders}
            loading={ordersLoading}
            onTrack={openPanel}
            onSelfAssign={role === 'designer' ? handleSelfAssign : undefined}
            selfAssigningId={selfAssigningId}
          />
        </div>

        <TrackingPanel order={orderDetail ?? null} open={!!panelOrderId} onClose={closePanel} />
      </AppLayout>

      <OrderFormModal open={formOpen} onClose={() => setFormOpen(false)} />
    </>
  )
}
