import { http, HttpResponse } from 'msw'
import { mockOrders, mockDeliveries, designerMetas } from '../store'

const BASE = 'http://localhost:3000'

// ─── Delivery helpers ─────────────────────────────────────────────────────────
function detectLinkType(url: string) {
  if (url.includes('drive.google.com')) return { link_type: 'google_drive', link_label: 'Google Drive' }
  if (url.includes('canva.com'))        return { link_type: 'canva',        link_label: 'Canva' }
  if (url.includes('figma.com'))        return { link_type: 'figma',        link_label: 'Figma' }
  return { link_type: 'other', link_label: 'Link' }
}

const MOCK_ORDER_DETAILS: Record<string, object> = {
  '1': {
    id: '1', title: 'Banner Mạng xã hội Xuân 2025', type: 'Banner', team: 'Admin Nhile',
    designer: 'Lê Văn A', deadline: '2026-04-15', status: 'ASSIGNED', flag: null,
    metrics: { rounds: 0, ontime: 'Sớm 10 ngày', comms: 3, briefCheck: true },
    steps: [
      { id: 's1', name: 'Order được gửi', state: 'done', time: '01/04 09:00', desc: 'Felix gửi order từ team Admin Nhile.', checks: [{ ok: true, text: 'Brief đính kèm đầy đủ' }, { ok: true, text: 'Deadline rõ ràng: 15/04' }], actions: [] },
      { id: 's2', name: 'Designer nhận task', state: 'done', time: '01/04 10:30', desc: 'Lê Văn A nhận, hỏi làm rõ 2 điểm.', checks: [{ ok: true, text: 'Double-check brief với orderer' }, { ok: true, text: 'Confirm hiểu yêu cầu màu sắc' }], actions: [] },
      { id: 's3', name: 'Designer đang làm', state: 'done', time: '01/04 – 05/04', desc: 'Gửi draft sơ bộ ngày 03/04.', checks: [{ ok: true, text: 'Gửi draft confirm hướng ngày 03/04' }, { ok: true, text: 'Check-in với orderer ngày 04/04' }], actions: [] },
      { id: 's4', name: 'Giao sản phẩm lần đầu', state: 'done', time: '05/04 16:00', timeClass: 'early', desc: 'Giao bản hoàn thiện đúng format.', checks: [{ ok: true, text: 'Bản hoàn thiện — không phải draft' }, { ok: true, text: 'Đính kèm đủ file gốc (.ai, .png)' }], actions: [] },
      { id: 's5', name: 'Feedback & Chờ phản hồi', state: 'active', time: '06/04 – đang chờ', desc: 'Đã giao, chờ orderer review.', checks: [{ ok: null, text: 'Orderer xem và cho feedback' }, { ok: null, text: 'Designer double-check feedback' }], actions: ['Đã nhận feedback', 'Yêu cầu làm rõ'] },
      { id: 's6', name: 'Chỉnh sửa (nếu cần)', state: 'pending', time: '', desc: '', checks: [], actions: [] },
      { id: 's7', name: 'Hoàn thành & Bàn giao', state: 'pending', time: '', desc: '', checks: [], actions: [] },
    ],
  },
  '3': {
    id: '3', title: 'Slide bài giảng tháng 4', type: 'Thumbnail', team: 'Edit',
    designer: 'Trần Thị B', deadline: '2026-04-10', status: 'FEEDBACK', flag: 'red',
    metrics: { rounds: 3, ontime: 'Trễ 3 ngày', comms: 1, briefCheck: false },
    redFlags: ['Không double-check brief khi nhận task', 'Giao bản thảo sơ bộ thay vì bản hoàn thiện', 'Đã 3 revision rounds nhưng vẫn chưa done'],
    steps: [
      { id: 's1', name: 'Order được gửi', state: 'done', time: '20/03 08:00', desc: 'Nhi Le gửi order.', checks: [{ ok: true, text: 'Brief đính kèm' }, { ok: false, text: 'Deadline quá gấp — chỉ 21 ngày' }], actions: [] },
      { id: 's2', name: 'Designer nhận task', state: 'done', time: '20/03 14:00', desc: 'Không hỏi gì khi nhận.', checks: [{ ok: false, text: 'Không double-check brief' }, { ok: false, text: 'Không hỏi về style, template' }], actions: [] },
      { id: 's3', name: 'Designer đang làm', state: 'done', time: '20/03 – 08/04', desc: '19 ngày không check-in.', checks: [{ ok: false, text: 'Không check-in giữa chừng' }, { ok: false, text: 'Không gửi draft confirm hướng' }], actions: [] },
      { id: 's4', name: 'Giao sản phẩm lần đầu', state: 'done', time: '08/04 · trễ 3 ngày', timeClass: 'late', desc: 'Giao bản thảo sơ bộ, thiếu file gốc.', checks: [{ ok: false, text: 'Giao bản thảo sơ bộ' }, { ok: false, text: 'Thiếu file source gốc' }], actions: [] },
      { id: 's5', name: 'Feedback Round 1', state: 'done', time: '09/04', desc: 'Orderer gửi 8 điểm feedback.', checks: [{ ok: false, text: 'Chỉnh sai 3/8 điểm' }], actions: [] },
      { id: 's6', name: 'Chỉnh sửa Round 2', state: 'done', time: '10/04', desc: 'Vẫn sai các điểm từ round 1.', checks: [{ ok: false, text: '3 điểm từ round 1 vẫn sai' }], actions: [] },
      { id: 's7', name: 'Chỉnh sửa Round 3', state: 'active', time: '11/04 – đang thực hiện', desc: 'Round 3 — cần leader theo dõi sát.', checks: [{ ok: null, text: 'Confirm từng điểm với orderer' }, { ok: null, text: 'Leader review trước khi gửi' }], actions: ['Đã chỉnh xong Round 3', 'Báo Leader can thiệp'] },
      { id: 's8', name: 'Hoàn thành & Bàn giao', state: 'pending', time: '', desc: '', checks: [], actions: [] },
    ],
  },
}

export const dashboardHandlers = [
  // ─── GET /orders — trả từ shared store, filter real-time ─────────────────────
  http.get(`${BASE}/api/v1/orders`, ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const hasFlag = url.searchParams.get('has_flag')
    const role = url.searchParams.get('role') ?? 'design_leader'

    let orders = [...mockOrders]

    // Role-based filtering
    if (role === 'designer') {
      // Designer thấy: task của họ + pool pending chưa assign (để self-assign)
      orders = orders.filter(o =>
        o.designer_name === 'Lê Văn A' ||
        (o.status === 'pending' && o.designer_name === null)
      )
    } else if (role === 'orderer') {
      orders = orders.filter(o => o.team_name === 'Social Content' || o.team_id === 'team-social')
    }
    // design_leader + co_leader: sees all — no filter

    if (status) {
      const statuses = status.split(',')
      orders = orders.filter(o => statuses.includes(o.status))
    }
    if (hasFlag === 'true') {
      orders = orders.filter(o => o.has_red_flag || o.has_warn_flag)
    }

    return HttpResponse.json({
      data: orders,
      meta: { total: orders.length, page: 1, per_page: 20, has_next: false, next_cursor: null },
    })
  }),

  // ─── GET /orders/:id — detail view ───────────────────────────────────────────
  http.get(`${BASE}/api/v1/orders/:id`, ({ params }) => {
    const id = params.id as string
    const detail = MOCK_ORDER_DETAILS[id]
    if (detail) return HttpResponse.json(detail)

    const order = mockOrders.find(o => o.id === id)
    if (!order) return HttpResponse.json({ message: 'Not found' }, { status: 404 })

    return HttpResponse.json({
      ...order,
      title: order.task_name,
      type: order.product_type_name,
      team: order.team_name,
      designer: order.designer_name,
      flag: order.has_red_flag ? 'red' : order.has_warn_flag ? 'warn' : null,
      metrics: { rounds: order.revision_rounds, ontime: 'Còn 5 ngày', comms: 0, briefCheck: false },
      steps: [
        {
          id: 's1', name: 'Order được gửi', state: 'done',
          time: new Date(order.created_at).toLocaleDateString('vi-VN'),
          desc: `${order.orderer_name} gửi từ team ${order.team_name}.`,
          checks: [{ ok: true, text: 'Brief đính kèm' }, { ok: true, text: 'Deadline xác nhận' }],
          actions: [],
        },
        {
          id: 's2', name: 'Chờ assign designer', state: 'active',
          time: 'Đang chờ...', desc: 'Design Leader chưa assign designer.',
          checks: [{ ok: null, text: 'Assign designer phù hợp' }],
          actions: ['Assign Designer ngay'],
        },
        { id: 's3', name: 'Designer đang làm', state: 'pending', time: '', desc: '', checks: [], actions: [] },
        { id: 's4', name: 'Hoàn thành & Bàn giao', state: 'pending', time: '', desc: '', checks: [], actions: [] },
      ],
    })
  }),

  // ─── GET /dashboard/stats — tính live từ shared store ────────────────────────
  http.get(`${BASE}/api/v1/dashboard/stats`, () => {
    const total = mockOrders.length
    const inProgress = mockOrders.filter(o => ['in_progress', 'assigned', 'feedback', 'delivered'].includes(o.status)).length
    const done = mockOrders.filter(o => o.status === 'done').length
    const urgent = mockOrders.filter(o => o.is_urgent).length
    const redFlag = mockOrders.filter(o => o.has_red_flag).length
    const warnFlag = mockOrders.filter(o => o.has_warn_flag && !o.has_red_flag).length
    const pending = mockOrders.filter(o => o.status === 'pending').length

    // Tính avg_revision_rounds thật từ dữ liệu — không tự chế công thức
    const ordersWithRevision = mockOrders.filter(o => o.revision_rounds > 0)
    const avgRevision = ordersWithRevision.length > 0
      ? ordersWithRevision.reduce((sum, o) => sum + o.revision_rounds, 0) / ordersWithRevision.length
      : 0

    return HttpResponse.json({
      total_orders: total,
      in_progress_count: inProgress,
      done_count: done,
      urgent_count: urgent,
      active_red_flag_orders: redFlag,
      active_warn_flag_orders: warnFlag,
      pending_assignment: pending,
      avg_revision_rounds: Math.round(avgRevision * 10) / 10,
    })
  }),

  // ─── GET /dashboard/workload — per-designer stats từ shared store ─────────────
  http.get(`${BASE}/api/v1/dashboard/workload`, () => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const workload = designerMetas.map(meta => {
      const myOrders = mockOrders.filter(o => o.designer_name === meta.name)
      const active = myOrders.filter(o =>
        ['assigned', 'in_progress', 'feedback', 'delivered'].includes(o.status)
      ).length
      const pending = myOrders.filter(o => o.status === 'pending').length
      const doneThisWeek = myOrders.filter(o =>
        o.status === 'done' && o.done_at && new Date(o.done_at) >= oneWeekAgo
      ).length
      const ordersWithRevision = myOrders.filter(o => o.revision_rounds > 0)
      const avgRev = ordersWithRevision.length > 0
        ? ordersWithRevision.reduce((sum, o) => sum + o.revision_rounds, 0) / ordersWithRevision.length
        : 0
      const hasBlocked = myOrders.some(o => o.has_red_flag)

      // Nếu đang on_leave: tính số task chưa bàn giao
      const unhandledCount = meta.leave?.is_on_leave
        ? myOrders.filter(o => ['assigned', 'in_progress', 'feedback', 'delivered', 'pending'].includes(o.status)).length
        : 0

      return {
        id: meta.id,
        name: meta.name,
        active_tasks: active,
        pending_tasks: pending,
        done_this_week: doneThisWeek,
        avg_revisions: Math.round(avgRev * 10) / 10,
        has_blocked: hasBlocked,
        leave: meta.leave ? { ...meta.leave, unhandled_tasks: unhandledCount } : null,
        member_status: meta.member_status,
        joined_at: meta.joined_at,
        training_note: meta.training_note,
      }
    })

    return HttpResponse.json(workload)
  }),

  // ─── POST /leaves — HR hoặc Leader ghi nghỉ phép cho designer ────────────────
  http.post(`${BASE}/api/v1/leaves`, async ({ request }) => {
    const body = await request.json() as {
      designer_id: string
      leave_start: string
      leave_end: string
      reason: string
      handover_status: string
      handover_to: string | null
    }
    const meta = designerMetas.find(m => m.id === body.designer_id)
    if (!meta) return HttpResponse.json({ message: 'Designer not found' }, { status: 404 })

    meta.leave = {
      is_on_leave: true,
      leave_start: body.leave_start,
      leave_end: body.leave_end,
      reason: body.reason ?? 'Nghỉ phép',
      approved_by: 'Nhi Le',
      handover_status: (body.handover_status as 'pending'|'partial'|'complete'|'standby') ?? 'pending',
      handover_to: body.handover_to ?? null,
    }
    return HttpResponse.json({ success: true })
  }),

  // ─── DELETE /leaves/:designer_id — Kết thúc nghỉ phép, quay lại làm ─────────
  http.delete(`${BASE}/api/v1/leaves/:designer_id`, ({ params }) => {
    const meta = designerMetas.find(m => m.id === params.designer_id)
    if (!meta) return HttpResponse.json({ message: 'Designer not found' }, { status: 404 })
    meta.leave = null
    return HttpResponse.json({ success: true })
  }),

  // ─── PATCH /designers/:id/member-status — Promote từ new → regular ───────────
  http.patch(`${BASE}/api/v1/designers/:id/member-status`, async ({ params, request }) => {
    const body = await request.json() as { member_status: 'new' | 'regular' }
    const meta = designerMetas.find(m => m.id === params.id)
    if (!meta) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    meta.member_status = body.member_status
    return HttpResponse.json({ success: true })
  }),

  // ═══════════════════════════════════════════════════════════════════════════
  // DELIVERY HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── GET /orders/:id/deliveries ───────────────────────────────────────────
  http.get(`${BASE}/api/v1/orders/:id/deliveries`, ({ params }) => {
    const orderId = params.id as string
    const result = mockDeliveries.filter(d => d.order_id === orderId)
    return HttpResponse.json(result)
  }),

  // ─── POST /orders/:id/deliveries — designer giao link ────────────────────
  http.post(`${BASE}/api/v1/orders/:id/deliveries`, async ({ params, request }) => {
    const orderId = params.id as string
    const body = await request.json() as { link_url?: string; note?: string }
    const order = mockOrders.find(o => o.id === orderId)
    if (!order) return HttpResponse.json({ message: 'Order not found' }, { status: 404 })

    const existing = mockDeliveries.filter(d => d.order_id === orderId)
    const { link_type, link_label } = detectLinkType(body.link_url ?? '')
    const newDelivery = {
      id: crypto.randomUUID(),
      order_id: orderId,
      round: existing.length + 1,
      link_url: body.link_url ?? '',
      link_type, link_label,
      note: body.note ?? null,
      delivered_by: 'Lê Văn A',
      delivered_at: new Date().toISOString(),
      is_confirmed: false,
      confirmed_at: null,
    }
    mockDeliveries.push(newDelivery)
    order.status = 'delivered'
    order.progress = 5
    return HttpResponse.json(newDelivery, { status: 201 })
  }),

  // ─── PATCH /orders/:id/deliveries/:dId/confirm — orderer xác nhận ────────
  http.patch(`${BASE}/api/v1/orders/:id/deliveries/:dId/confirm`, ({ params }) => {
    const delivery = mockDeliveries.find(d => d.id === params.dId as string)
    if (!delivery) return HttpResponse.json({ message: 'Delivery not found' }, { status: 404 })
    delivery.is_confirmed = true
    delivery.confirmed_at = new Date().toISOString()
    return HttpResponse.json({ success: true })
  }),

  // ─── POST /orders/:id/confirm-done — orderer hoàn thành order ────────────
  http.post(`${BASE}/api/v1/orders/:id/confirm-done`, ({ params }) => {
    const order = mockOrders.find(o => o.id === params.id as string)
    if (!order) return HttpResponse.json({ message: 'Order not found' }, { status: 404 })
    order.status = 'done'
    order.done_at = new Date().toISOString()
    order.progress = 7
    return HttpResponse.json({ success: true })
  }),

  // ─── POST /orders/:id/feedback — orderer gửi feedback ───────────────────
  http.post(`${BASE}/api/v1/orders/:id/feedback`, async ({ params, request }) => {
    await request.json()
    const order = mockOrders.find(o => o.id === params.id as string)
    if (!order) return HttpResponse.json({ message: 'Order not found' }, { status: 404 })
    order.status = 'feedback'
    order.revision_rounds = (order.revision_rounds ?? 0) + 1
    order.progress = 6
    if (order.revision_rounds >= 3) { order.has_red_flag = true; order.has_warn_flag = false }
    else if (order.revision_rounds >= 2) { order.has_warn_flag = true }
    return HttpResponse.json({ success: true, revision_round: order.revision_rounds })
  }),
]
