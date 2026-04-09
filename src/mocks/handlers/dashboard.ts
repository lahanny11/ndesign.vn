import { http, HttpResponse } from 'msw'
import { mockOrders } from '../store'

const BASE = 'http://localhost:3000'

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

    let orders = [...mockOrders]

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

    return HttpResponse.json({
      total_orders: total,
      in_progress_count: inProgress,
      done_count: done,
      urgent_count: urgent,
      active_red_flag_orders: redFlag,
      active_warn_flag_orders: warnFlag,
      pending_assignment: pending,
    })
  }),
]
