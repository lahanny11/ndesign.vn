// src/mocks/handlers/analytics.ts
import { http, HttpResponse } from 'msw'
import { getCurrentMockPerson, unauthorized, forbidden } from '../config'
import { MOCK_ANALYTICS } from '../data/analytics'

export const analyticsHandlers = [
  http.get('*/api/analytics', async ({ request }) => {
    const p = await getCurrentMockPerson()
    if (!p) return unauthorized()
    if (!p.roles.some(r => ['design_leader', 'co_leader'].includes(r)))
      return forbidden('leader only')
    const period = new URL(request.url).searchParams.get('period') ?? 'month'
    return HttpResponse.json({ data: MOCK_ANALYTICS[period] ?? MOCK_ANALYTICS['month'] })
  }),

  // Legacy v1
  http.get('*/api/v1/analytics', async ({ request }) => {
    const p = await getCurrentMockPerson()
    if (!p) return unauthorized()
    if (!p.roles.some(r => ['design_leader', 'co_leader'].includes(r)))
      return forbidden('leader only')
    const period = new URL(request.url).searchParams.get('period') ?? 'month'
    return HttpResponse.json({ data: MOCK_ANALYTICS[period] ?? MOCK_ANALYTICS['month'] })
  }),
]
