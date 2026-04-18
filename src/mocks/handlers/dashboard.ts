// src/mocks/handlers/dashboard.ts
import { http, HttpResponse } from 'msw'
import { getCurrentMockPerson, unauthorized, forbidden } from '../config'
import { MOCK_DASHBOARD_STATS, MOCK_WORKLOAD } from '../data/dashboard'

const leaderOnly = (roles: string[]) => roles.some(r => ['design_leader', 'co_leader'].includes(r))

export const dashboardHandlers = [
  http.get('*/api/dashboard/stats', async () => {
    const p = await getCurrentMockPerson()
    if (!p) return unauthorized()
    if (!leaderOnly(p.roles)) return forbidden('leader only')
    return HttpResponse.json({
      data: MOCK_DASHBOARD_STATS[p.id] ?? Object.values(MOCK_DASHBOARD_STATS)[0]
    })
  }),

  http.get('*/api/dashboard/workload', async () => {
    const p = await getCurrentMockPerson()
    if (!p) return unauthorized()
    if (!leaderOnly(p.roles)) return forbidden('leader only')
    return HttpResponse.json({ data: MOCK_WORKLOAD })
  }),

  // Legacy v1 aliases
  http.get('*/api/v1/dashboard/stats', async () => {
    const p = await getCurrentMockPerson()
    if (!p) return unauthorized()
    if (!leaderOnly(p.roles)) return forbidden('leader only')
    return HttpResponse.json({
      data: MOCK_DASHBOARD_STATS[p.id] ?? Object.values(MOCK_DASHBOARD_STATS)[0]
    })
  }),
  http.get('*/api/v1/dashboard/workload', async () => {
    const p = await getCurrentMockPerson()
    if (!p) return unauthorized()
    if (!leaderOnly(p.roles)) return forbidden('leader only')
    return HttpResponse.json({ data: MOCK_WORKLOAD })
  }),
]
