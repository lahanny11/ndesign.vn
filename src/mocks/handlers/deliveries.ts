// src/mocks/handlers/deliveries.ts
import { http, HttpResponse } from 'msw'
import { getCurrentMockPerson, unauthorized, forbidden, notFound } from '../config'
import { MOCK_ORDERS_ALL } from '../data/orders'

export const deliveryHandlers = [
  http.post('*/api/orders/:id/deliveries', async ({ params, request }) => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    if (!person.roles.includes('designer')) return forbidden('designer only')
    const order = MOCK_ORDERS_ALL.find(o => o.id === params.id)
    if (!order) return notFound()
    const body = await request.json() as { delivery_url?: string; note?: string }
    if (!body.delivery_url)
      return HttpResponse.json({ statusCode: 400, message: ['delivery_url should not be empty'], error: 'Bad Request' }, { status: 400 })
    const detect = (u: string) =>
      u.includes('drive.google.com') ? 'google_drive'
      : u.includes('canva.com') ? 'canva'
      : u.includes('figma.com') ? 'figma'
      : 'other'
    const now = new Date().toISOString()
    const delivery = {
      id: crypto.randomUUID(),
      order_id: params.id as string,
      round: (order.revision_count ?? 0) + 1,
      designer_id: person.id,
      delivery_url: body.delivery_url,
      platform_type: detect(body.delivery_url),
      note: body.note,
      confirmed_at: undefined,
      created_at: now,
      updated_at: now,
    }
    order.status = 'delivered'
    order.updated_at = now
    return HttpResponse.json({ data: delivery }, { status: 201 })
  }),

  http.patch('*/api/orders/:id/deliveries/:delivery_id/confirm', async ({ params }) => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    if (!person.roles.includes('orderer')) return forbidden('orderer only')
    const order = MOCK_ORDERS_ALL.find(o => o.id === params.id)
    if (!order) return notFound()
    const now = new Date().toISOString()
    return HttpResponse.json({ data: { delivery_id: params.delivery_id, confirmed_at: now } })
  }),
]
