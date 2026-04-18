// src/mocks/handlers/media.ts
import { http, HttpResponse } from 'msw'
import { getCurrentMockUserId, unauthorized } from '../config'

export const mediaHandlers = [
  http.post('*/api/media/upload-url', async ({ request }) => {
    const id = await getCurrentMockUserId()
    if (!id) return unauthorized()
    const body = await request.json() as { filename?: string; content_type?: string; order_id?: string }
    const errors: string[] = []
    if (!body.filename)     errors.push('filename should not be empty')
    if (!body.content_type) errors.push('content_type should not be empty')
    if (!body.order_id)     errors.push('order_id should not be empty')
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (body.content_type && !allowed.includes(body.content_type))
      errors.push('content_type must be image/jpeg, image/png, image/webp, or image/gif')
    if (errors.length)
      return HttpResponse.json({ statusCode: 400, message: errors, error: 'Bad Request' }, { status: 400 })
    const fileKey = `orders/${body.order_id}/${crypto.randomUUID()}-${body.filename}`
    return HttpResponse.json({
      data: {
        upload_url: `https://mock-r2.nquoc.vn/${fileKey}?presigned=mock`,
        file_key: fileKey,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      },
    }, { status: 201 })
  }),
]
