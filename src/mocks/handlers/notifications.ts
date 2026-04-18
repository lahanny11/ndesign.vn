// src/mocks/handlers/notifications.ts
import { http, HttpResponse } from 'msw'
import { getCurrentMockUserId, unauthorized, notFound } from '../config'
import { MOCK_NOTIFICATIONS } from '../data/notifications'

export const notificationHandlers = [
  http.get('*/api/notifications', async ({ request }) => {
    const id = await getCurrentMockUserId()
    if (!id) return unauthorized()
    const url = new URL(request.url)
    const page  = Number(url.searchParams.get('page')  ?? '1')
    const limit = Number(url.searchParams.get('limit') ?? '20')
    const items = MOCK_NOTIFICATIONS[id] ?? []
    const paged = items.slice((page - 1) * limit, page * limit)
    return HttpResponse.json({ data: paged, meta: { page, limit, total: items.length } })
  }),

  http.patch('*/api/notifications/:id/read', async ({ params }) => {
    const personId = await getCurrentMockUserId()
    if (!personId) return unauthorized()
    const notif = (MOCK_NOTIFICATIONS[personId] ?? []).find(n => n.id === params.id)
    if (!notif) return notFound()
    notif.is_read = true
    const now = new Date().toISOString()
    return HttpResponse.json({ data: { id: notif.id, is_read: true, updated_at: now } })
  }),
]
