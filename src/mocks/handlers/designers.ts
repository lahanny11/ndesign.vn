// src/mocks/handlers/designers.ts
import { http, HttpResponse } from 'msw'
import { getCurrentMockPerson, unauthorized, forbidden } from '../config'
import type { MemberStatus } from '@modules/designers/types'

export const designerHandlers = [
  http.patch('*/api/designers/:id/member-status', async ({ params, request }) => {
    const p = await getCurrentMockPerson()
    if (!p) return unauthorized()
    if (!p.roles.some(r => ['design_leader', 'co_leader'].includes(r)))
      return forbidden('leader only')
    const body = await request.json() as { member_status?: MemberStatus }
    if (!body.member_status || !['new_member', 'regular'].includes(body.member_status)) {
      return HttpResponse.json(
        { statusCode: 400, message: ['member_status must be new_member or regular'], error: 'Bad Request' },
        { status: 400 }
      )
    }
    return HttpResponse.json({
      data: { person_id: params.id, member_status: body.member_status, updated_at: new Date().toISOString() }
    })
  }),
]
