// src/mocks/handlers/checkins.ts
import { http, HttpResponse } from 'msw'
import { getCurrentMockPerson, unauthorized, forbidden, notFound } from '../config'
import { MOCK_ORDERS_ALL } from '../data/orders'

export const checkinHandlers = [
  http.post('*/api/orders/:id/checkin', async ({ params }) => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    if (!person.roles.includes('designer')) return forbidden('designer only')
    const order = MOCK_ORDERS_ALL.find(o => o.id === params.id)
    if (!order) return notFound()
    const now = new Date().toISOString()
    order.last_checkin_at = now
    order.updated_at = now
    return HttpResponse.json({ data: { last_checkin_at: now } })
  }),
]
