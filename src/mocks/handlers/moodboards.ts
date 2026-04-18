// src/mocks/handlers/moodboards.ts
import { http, HttpResponse } from 'msw'
import { getCurrentMockPerson, unauthorized, forbidden, notFound } from '../config'
import { MOCK_ORDERS_ALL } from '../data/orders'

export const moodboardHandlers = [
  http.post('*/api/orders/:id/moodboard', async ({ params, request }) => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    if (!person.roles.includes('orderer')) return forbidden('orderer only')
    const body = await request.json() as { style_description?: string }
    const errors: string[] = []
    if (!body.style_description || body.style_description.length < 20)
      errors.push('style_description must be at least 20 characters')
    if (body.style_description && body.style_description.length > 500)
      errors.push('style_description must not exceed 500 characters')
    if (errors.length)
      return HttpResponse.json({ statusCode: 400, message: errors, error: 'Bad Request' }, { status: 400 })
    const order = MOCK_ORDERS_ALL.find(o => o.id === params.id)
    if (!order) return notFound()

    // Set aiTimedOut = true to test the fallback path (FE unlocks Step 4 anyway)
    const aiTimedOut = false
    if (aiTimedOut) {
      return HttpResponse.json(
        { data: null, fallback: true, message: 'AI timeout — Step 4 vẫn unlock.' },
        { status: 200 }
      )
    }
    const now = new Date().toISOString()
    return HttpResponse.json({ data: {
      id: crypto.randomUUID(),
      order_id: params.id as string,
      style_summary: 'Tối giản chuyên nghiệp, tone tím xanh NhiLe, typography mạnh.',
      color_palette: ['#6C6BAE', '#1D1D1F', '#F5F5F7', '#A89FD4', '#E8E8F0'],
      font_suggestions: ['Playfair Display (heading)', 'Inter (body)', 'JetBrains Mono (accent)'],
      design_tips: [
        'White space rộng → premium feel.',
        'Heading to + bold → hierarchy.',
        '≤3 màu chính → đồng nhất brand.',
      ],
      visual_preview_url: undefined,
      fallback: false,
      generated_at: now,
      created_at: now,
      updated_at: now,
    }}, { status: 201 })
  }),
]
