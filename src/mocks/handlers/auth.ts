// src/mocks/handlers/auth.ts
import { http, HttpResponse } from 'msw'
import { getCurrentMockPerson, unauthorized } from '../config'
import { MOCK_PERSONS_IDS } from '../data/persons'
import type { Role } from '@shared/types/auth'

const TEAM_MAP: Record<string, string> = {
  [MOCK_PERSONS_IDS.design_leader]: 'design',
  [MOCK_PERSONS_IDS.designer_01]:   'design',
  [MOCK_PERSONS_IDS.orderer_01]:    'it',
  [MOCK_PERSONS_IDS.co_leader]:     'design',
  [MOCK_PERSONS_IDS.designer_02]:   'design',
  [MOCK_PERSONS_IDS.orderer_02]:    'academy',
}

export const authHandlers = [
  http.get('*/api/auth/me', async () => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    return HttpResponse.json({ data: {
      person_id:    person.id,
      email:        person.email,
      full_name:    person.full_name,
      avatar_url:   person.avatar_url,
      roles:        person.roles,
      primary_role: person.primary_role,
      team_slug:    TEAM_MAP[person.id] ?? 'it',
      ...(person.primary_role === 'designer' && { member_status: 'regular' }),
    }})
  }),

  // Internal provision — Central Auth calls this on first login
  http.post('*/api/internal/users/provision', async ({ request }) => {
    if (request.headers.get('X-Internal-Secret') !== 'mock-internal-secret') {
      return HttpResponse.json(
        { statusCode: 401, message: 'Invalid X-Internal-Secret', error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const body = await request.json() as { person_id?: string; email?: string; full_name?: string }
    const errors: string[] = []
    if (!body.person_id) errors.push('person_id should not be empty')
    if (!body.email)     errors.push('email should not be empty')
    if (!body.full_name) errors.push('full_name should not be empty')
    if (errors.length)   return HttpResponse.json({ statusCode: 400, message: errors, error: 'Bad Request' }, { status: 400 })
    const now = new Date().toISOString()
    return HttpResponse.json({
      data: { user_id: crypto.randomUUID(), person_id: body.person_id!, default_role: 'orderer' as Role, created_at: now }
    }, { status: 201 })
  }),
]
