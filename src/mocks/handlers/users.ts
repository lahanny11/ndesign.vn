// src/mocks/handlers/users.ts
import { http, HttpResponse } from 'msw'
import { getCurrentMockPerson, unauthorized, forbidden } from '../config'
import { MOCK_PERSONS_IDS } from '../data/persons'

export const userHandlers = [
  http.get('*/api/users/designers', async ({ request }) => {
    const p = await getCurrentMockPerson()
    if (!p) return unauthorized()
    if (!p.roles.some(r => ['design_leader', 'co_leader'].includes(r)))
      return forbidden('leader only')
    const availableOnly = new URL(request.url).searchParams.get('available_only') === 'true'
    const all = [
      { person_id: MOCK_PERSONS_IDS.designer_01, full_name: 'Designer 01', active_task_count: 5, is_on_leave: false, member_status: 'regular' },
      { person_id: MOCK_PERSONS_IDS.designer_02, full_name: 'Designer 02', active_task_count: 4, is_on_leave: false, member_status: 'new_member' },
      { person_id: 'g7h8i9j0-k1l2-3456-mabc-789012345678', full_name: 'Designer 03', active_task_count: 3, is_on_leave: true, member_status: 'regular' },
    ]
    return HttpResponse.json({
      data: availableOnly ? all.filter(d => !d.is_on_leave && d.active_task_count < 7) : all
    })
  }),
]
