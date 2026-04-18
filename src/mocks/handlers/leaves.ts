// src/mocks/handlers/leaves.ts
import { http, HttpResponse } from 'msw'
import { getCurrentMockPerson, unauthorized, forbidden, notFound } from '../config'
import type { Leave, LeaveReason, HandoverStatus } from '@modules/leaves/types'

const MOCK_LEAVES: Leave[] = [
  {
    id: 'leave-0001-uuid-abcd-ef12-345678901234',
    designer_id: 'user-des-03',
    reason: 'annual_leave',
    start_date: '2026-04-17',
    end_date: '2026-04-22',
    handover_to_id: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    handover_status: 'partial',
    created_at: '2026-04-16T09:00:00.000Z',
    updated_at: '2026-04-16T09:00:00.000Z',
  },
]

const leaderRoles = ['design_leader', 'co_leader']

export const leaveHandlers = [
  http.post('*/api/leaves', async ({ request }) => {
    const p = await getCurrentMockPerson()
    if (!p) return unauthorized()
    if (!p.roles.some(r => leaderRoles.includes(r))) return forbidden('leader only')
    const body = await request.json() as {
      designer_person_id?: string
      reason?: LeaveReason
      start_date?: string
      end_date?: string
      handover_status?: HandoverStatus
    }
    const errors: string[] = []
    if (!body.designer_person_id) errors.push('designer_person_id should not be empty')
    if (!body.reason)             errors.push('reason should not be empty')
    if (!body.start_date)         errors.push('start_date should not be empty')
    if (!body.end_date)           errors.push('end_date should not be empty')
    if (!body.handover_status)    errors.push('handover_status should not be empty')
    if (errors.length)
      return HttpResponse.json({ statusCode: 400, message: errors, error: 'Bad Request' }, { status: 400 })
    const now = new Date().toISOString()
    const created: Leave = {
      id: crypto.randomUUID(),
      designer_id: body.designer_person_id!,
      reason: body.reason!,
      start_date: body.start_date!,
      end_date: body.end_date!,
      handover_to_id: undefined,
      handover_status: body.handover_status!,
      created_at: now,
      updated_at: now,
    }
    MOCK_LEAVES.push(created)
    return HttpResponse.json({ data: created }, { status: 201 })
  }),

  http.patch('*/api/leaves/:id', async ({ params, request }) => {
    const p = await getCurrentMockPerson()
    if (!p) return unauthorized()
    if (!p.roles.some(r => leaderRoles.includes(r))) return forbidden('leader only')
    const leave = MOCK_LEAVES.find(l => l.id === params.id)
    if (!leave) return notFound()
    const body = await request.json() as Partial<Leave>
    if (body.handover_to_id !== undefined) leave.handover_to_id = body.handover_to_id
    if (body.handover_status !== undefined) leave.handover_status = body.handover_status
    leave.updated_at = new Date().toISOString()
    return HttpResponse.json({ data: leave })
  }),

  http.delete('*/api/leaves/:id', async ({ params }) => {
    const p = await getCurrentMockPerson()
    if (!p) return unauthorized()
    if (!p.roles.some(r => leaderRoles.includes(r))) return forbidden('leader only')
    const idx = MOCK_LEAVES.findIndex(l => l.id === params.id)
    if (idx < 0) return notFound()
    MOCK_LEAVES.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
