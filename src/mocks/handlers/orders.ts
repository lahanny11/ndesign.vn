// src/mocks/handlers/orders.ts
import { http, HttpResponse } from 'msw'
import { getCurrentMockPerson, getCurrentMockUserId, unauthorized, forbidden, notFound } from '../config'
import { MOCK_ORDERS, MOCK_ORDERS_ALL } from '../data/orders'
import type { Order } from '@modules/orders/types'

export const orderHandlers = [

  // LIST (role-filtered)
  http.get('*/api/orders', async ({ request }) => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    const url    = new URL(request.url)
    const status = url.searchParams.get('status')
    const page   = Number(url.searchParams.get('page')  ?? '1')
    const limit  = Number(url.searchParams.get('limit') ?? '20')
    let items = MOCK_ORDERS[person.id] ?? MOCK_ORDERS_ALL
    if (status) items = items.filter(o => o.status === status)
    const paged = items.slice((page - 1) * limit, page * limit)
    return HttpResponse.json({ data: paged, meta: { page, limit, total: items.length } })
  }),

  // CREATE (orderer only)
  http.post('*/api/orders', async ({ request }) => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    if (!person.roles.includes('orderer')) return forbidden('orderer only')
    const body = await request.json() as Partial<{
      task_name: string; team_id: string; product_type_id: string
      product_size_label: string; brief: string; deadline: string
      is_urgent: boolean; color_palette: string[]; reference_image_urls: string[]
    }>
    const errors: string[] = []
    if (!body.task_name || body.task_name.length < 3 || body.task_name.length > 200)
      errors.push('task_name must be 3–200 characters')
    if (!body.product_type_id)    errors.push('product_type_id should not be empty')
    if (!body.product_size_label) errors.push('product_size_label should not be empty')
    if (!body.brief || body.brief.length < 30)  errors.push('brief must be at least 30 characters')
    if (body.brief && body.brief.length > 2000) errors.push('brief must not exceed 2000 characters')
    if (!body.deadline) errors.push('deadline should not be empty')
    if (errors.length)  return HttpResponse.json({ statusCode: 400, message: errors, error: 'Bad Request' }, { status: 400 })
    const now     = new Date().toISOString()
    const dateStr = now.slice(0, 10).replace(/-/g, '')
    const created: Order = {
      id: crypto.randomUUID(),
      order_number: `ND-${dateStr}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      task_name: body.task_name!,
      orderer_id: 'user-ord-mock',
      orderer_person_id: person.id,
      team_id: body.team_id ?? 'team-unknown',
      designer_id: undefined,
      product_type_id: body.product_type_id!,
      product_size_label: body.product_size_label!,
      brief: body.brief!,
      style_description: '',
      color_palette: body.color_palette ?? [],
      reference_image_urls: body.reference_image_urls ?? [],
      status: 'pending',
      priority: body.is_urgent ? 'urgent' : 'normal',
      is_urgent: body.is_urgent ?? false,
      is_overdue: false,
      has_red_flag: false,
      has_warn_flag: false,
      revision_count: 0,
      milestone_progress: 0,
      deadline: body.deadline!,
      last_checkin_at: undefined,
      created_at: now,
      updated_at: now,
    }
    ;(MOCK_ORDERS[person.id] ??= []).push(created)
    MOCK_ORDERS_ALL.push(created)
    return HttpResponse.json({ data: created }, { status: 201 })
  }),

  // GET ONE
  http.get('*/api/orders/:id', async ({ params }) => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    const order = MOCK_ORDERS_ALL.find(o => o.id === params.id)
    if (!order) return notFound()
    if (person.roles.includes('orderer') && order.orderer_person_id !== person.id)
      return forbidden('Team access only')
    return HttpResponse.json({ data: order })
  }),

  // START (assigned → active, designer)
  http.post('*/api/orders/:id/start', async ({ params }) => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    if (!person.roles.includes('designer')) return forbidden('designer only')
    const order = MOCK_ORDERS_ALL.find(o => o.id === params.id)
    if (!order) return notFound()
    if (order.status !== 'assigned')
      return HttpResponse.json(
        { statusCode: 422, message: 'Order must be in assigned status', error: 'Unprocessable Entity', code: 'INVALID_STATUS_TRANSITION' },
        { status: 422 }
      )
    order.status = 'active'
    order.updated_at = new Date().toISOString()
    return HttpResponse.json({ data: order })
  }),

  // SELF-ASSIGN (designer)
  http.post('*/api/orders/:id/self-assign', async ({ params }) => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    if (!person.roles.includes('designer')) return forbidden('designer only')
    const order = MOCK_ORDERS_ALL.find(o => o.id === params.id)
    if (!order) return notFound()
    if (order.status !== 'pending')
      return HttpResponse.json(
        { statusCode: 422, message: 'Order đã được nhận', error: 'Unprocessable Entity', code: 'ALREADY_ASSIGNED' },
        { status: 422 }
      )
    const activeCount = (MOCK_ORDERS[person.id] ?? []).filter(o =>
      ['assigned', 'active', 'delivered', 'feedback'].includes(o.status)
    ).length
    if (activeCount >= 7)
      return HttpResponse.json(
        { statusCode: 422, message: 'Đang có 7 task active', error: 'Unprocessable Entity', code: 'CAPACITY_FULL' },
        { status: 422 }
      )
    order.status = 'assigned'
    order.updated_at = new Date().toISOString()
    ;(MOCK_ORDERS[person.id] ??= []).push(order)
    return HttpResponse.json({ data: order })
  }),

  // ASSIGN (leader)
  http.post('*/api/orders/:id/assignments', async ({ params, request }) => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    if (!person.roles.some(r => ['design_leader', 'co_leader'].includes(r)))
      return forbidden('leader only')
    const body = await request.json() as { designer_person_id?: string }
    if (!body.designer_person_id)
      return HttpResponse.json(
        { statusCode: 400, message: ['designer_person_id should not be empty'], error: 'Bad Request' },
        { status: 400 }
      )
    const order = MOCK_ORDERS_ALL.find(o => o.id === params.id)
    if (!order) return notFound()
    order.designer_id  = 'user-des-assigned'
    order.status       = 'assigned'
    order.updated_at   = new Date().toISOString()
    return HttpResponse.json({ data: order })
  }),

  // CONFIRM DONE (orderer)
  http.post('*/api/orders/:id/confirm-done', async ({ params }) => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    if (!person.roles.includes('orderer')) return forbidden('orderer only')
    const order = MOCK_ORDERS_ALL.find(o => o.id === params.id)
    if (!order) return notFound()
    if (order.status !== 'delivered')
      return HttpResponse.json(
        { statusCode: 422, message: 'Order chưa delivered', error: 'Unprocessable Entity', code: 'ORDER_NOT_DELIVERED' },
        { status: 422 }
      )
    const now = new Date().toISOString()
    order.status     = 'done'
    order.updated_at = now
    return HttpResponse.json({ data: { status: 'done', updated_at: now } })
  }),

  // ESCALATE (orderer or designer)
  http.post('*/api/orders/:id/escalate', async ({ params, request }) => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    if (!person.roles.some(r => ['orderer', 'designer'].includes(r)))
      return forbidden('orderer or designer only')
    const order = MOCK_ORDERS_ALL.find(o => o.id === params.id)
    if (!order) return notFound()
    const body = await request.json() as { reason?: string }
    const now = new Date().toISOString()
    order.has_red_flag = true
    order.updated_at   = now
    return HttpResponse.json({
      data: { order_id: params.id, escalated_by: person.id, reason: body.reason, created_at: now }
    })
  }),

  // Legacy v1 aliases — giữ backward compat với component hooks cũ
  http.get('*/api/v1/orders',      async ({ request }) => {
    // redirect về handler mới bằng cách reuse logic
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    const url    = new URL(request.url)
    const status = url.searchParams.get('status')
    const page   = Number(url.searchParams.get('page')  ?? '1')
    const limit  = Number(url.searchParams.get('limit') ?? '20')
    let items = MOCK_ORDERS[person.id] ?? MOCK_ORDERS_ALL
    if (status) items = items.filter(o => o.status === status)
    const paged = items.slice((page - 1) * limit, page * limit)
    return HttpResponse.json({ data: paged, meta: { page, limit, total: items.length } })
  }),
  http.get('*/api/v1/orders/:id',  async ({ params }) => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    const order = MOCK_ORDERS_ALL.find(o => o.id === params.id)
    if (!order) return notFound()
    return HttpResponse.json({ data: order })
  }),
  http.post('*/api/v1/orders',     async ({ request }) => {
    const id = await getCurrentMockUserId()
    if (!id) return unauthorized()
    return HttpResponse.json({ data: { id: crypto.randomUUID(), status: 'pending' } }, { status: 201 })
  }),
]
