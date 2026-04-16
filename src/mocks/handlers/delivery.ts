import { http, HttpResponse } from 'msw'
import { mockOrders, mockDeliveries, type MockDelivery } from '../store'

const BASE = 'http://localhost:3000'

function detectLinkType(url: string): Pick<MockDelivery, 'link_type' | 'link_label'> {
  if (url.includes('drive.google.com')) return { link_type: 'google_drive', link_label: 'Google Drive' }
  if (url.includes('canva.com'))        return { link_type: 'canva',        link_label: 'Canva' }
  if (url.includes('figma.com'))        return { link_type: 'figma',        link_label: 'Figma' }
  return { link_type: 'other', link_label: 'Link' }
}

export const deliveryHandlers = [

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
    const round = existing.length + 1
    const { link_type, link_label } = detectLinkType(body.link_url ?? '')

    const newDelivery: MockDelivery = {
      id: crypto.randomUUID(),
      order_id: orderId,
      round,
      link_url: body.link_url ?? '',
      link_type,
      link_label,
      note: body.note ?? null,
      delivered_by: 'Lê Văn A',
      delivered_at: new Date().toISOString(),
      is_confirmed: false,
      confirmed_at: null,
    }

    mockDeliveries.push(newDelivery)

    // Cập nhật trạng thái order → delivered
    order.status = 'delivered'
    order.progress = 5

    return HttpResponse.json(newDelivery, { status: 201 })
  }),

  // ─── PATCH /orders/:id/deliveries/:dId/confirm — orderer xác nhận ────────
  http.patch(`${BASE}/api/v1/orders/:id/deliveries/:dId/confirm`, ({ params }) => {
    const delivery = mockDeliveries.find(d => d.id === params.dId)
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
    await request.json() // consume body
    const order = mockOrders.find(o => o.id === params.id as string)
    if (!order) return HttpResponse.json({ message: 'Order not found' }, { status: 404 })

    order.status = 'feedback'
    order.revision_rounds = (order.revision_rounds ?? 0) + 1
    order.progress = 6

    // Auto-flag khi revision ≥ 2
    if (order.revision_rounds >= 3) {
      order.has_red_flag = true
      order.has_warn_flag = false
    } else if (order.revision_rounds >= 2) {
      order.has_warn_flag = true
    }

    return HttpResponse.json({
      success: true,
      revision_round: order.revision_rounds,
    })
  }),
]
