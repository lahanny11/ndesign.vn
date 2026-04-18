// src/mocks/handlers/flags.ts
import { http, HttpResponse } from 'msw'
import { getCurrentMockPerson, unauthorized, forbidden, notFound } from '../config'
import { MOCK_ORDERS_ALL } from '../data/orders'

export const flagHandlers = [
  http.patch('*/api/orders/:id/flags/:flag_id/resolve', async ({ params }) => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    if (!person.roles.some(r => ['design_leader', 'co_leader'].includes(r)))
      return forbidden('leader only')
    const order = MOCK_ORDERS_ALL.find(o => o.id === params.id)
    if (!order) return notFound()
    const now = new Date().toISOString()
    order.has_red_flag = false
    order.has_warn_flag = false
    order.updated_at = now
    return HttpResponse.json({
      data: { flag_id: params.flag_id, is_resolved: true, resolved_by: person.id, resolved_at: now }
    })
  }),
]
