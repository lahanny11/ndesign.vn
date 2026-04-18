// src/mocks/handlers/milestones.ts
import { http, HttpResponse } from 'msw'
import { getCurrentMockPerson, unauthorized, forbidden, notFound } from '../config'
import { MOCK_ORDERS_ALL } from '../data/orders'

export const milestoneHandlers = [
  http.patch('*/api/orders/:id/milestones/:mId', async ({ params, request }) => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    if (!person.roles.some(r => ['designer', 'design_leader', 'co_leader'].includes(r)))
      return forbidden('designer or leader only')
    const order = MOCK_ORDERS_ALL.find(o => o.id === params.id)
    if (!order) return notFound()
    const body = await request.json() as { state?: string }
    const now = new Date().toISOString()
    return HttpResponse.json({
      data: { milestone_id: params.mId, state: body.state ?? 'done', updated_at: now }
    })
  }),

  http.patch('*/api/orders/:id/milestones/:mId/checklist/:cId', async ({ params, request }) => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    const body = await request.json() as { state?: 'pass' | 'fail' | 'pending' }
    const now = new Date().toISOString()
    return HttpResponse.json({
      data: { checklist_item_id: params.cId, state: body.state ?? 'pass', updated_at: now }
    })
  }),
]
