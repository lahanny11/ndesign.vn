// src/mocks/handlers/feedbacks.ts
import { http, HttpResponse } from 'msw'
import { getCurrentMockPerson, unauthorized, forbidden, notFound } from '../config'
import { MOCK_ORDERS_ALL } from '../data/orders'

export const feedbackHandlers = [
  http.post('*/api/orders/:id/feedback', async ({ params, request }) => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    if (!person.roles.includes('orderer')) return forbidden('orderer only')
    const body = await request.json() as { delivery_id?: string; content?: string }
    const errors: string[] = []
    if (!body.delivery_id) errors.push('delivery_id should not be empty')
    if (!body.content || body.content.length < 5) errors.push('content must be at least 5 characters')
    if (errors.length)
      return HttpResponse.json({ statusCode: 400, message: errors, error: 'Bad Request' }, { status: 400 })
    const order = MOCK_ORDERS_ALL.find(o => o.id === params.id)
    if (!order) return notFound()
    const now = new Date().toISOString()
    order.status = 'feedback'
    order.revision_count = (order.revision_count ?? 0) + 1
    order.updated_at = now
    return HttpResponse.json({
      data: {
        id: crypto.randomUUID(),
        order_id: params.id as string,
        delivery_id: body.delivery_id!,
        orderer_id: person.id,
        content: body.content!,
        created_at: now,
        updated_at: now,
      },
    }, { status: 201 })
  }),
]
