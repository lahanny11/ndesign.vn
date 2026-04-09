import { http, HttpResponse } from 'msw'

const BASE = 'http://localhost:3000'

let orderCounter = 8

export const orderHandlers = [
  http.post(`${BASE}/api/v1/orders`, async ({ request }) => {
    await request.json()
    // Dev mode: accept order without moodboard_id for easy testing
    const num = String(orderCounter++).padStart(4, '0')
    return HttpResponse.json({
      id: crypto.randomUUID(),
      order_number: `ND-20260409-${num}`,
      message: 'Order created successfully',
    }, { status: 201 })
  }),

  http.post(`${BASE}/api/v1/orders/:id/moodboard`, async ({ request }) => {
    const body = await request.json() as { style_description?: string }
    const style = body.style_description ?? 'Minimalist'

    // Simulate AI delay
    await new Promise(r => setTimeout(r, 800))

    return HttpResponse.json({
      data: {
        id: crypto.randomUUID(),
        style_summary: `Phong cách ${style} — kết hợp giữa sự tinh tế và hiện đại, tạo ấn tượng mạnh mẽ nhưng không mất đi sự thanh lịch.`,
        color_palette: [
          { hex: '#7B8EF7', name: 'Indigo Blue',   role: 'primary' },
          { hex: '#2D2D3A', name: 'Deep Navy',      role: 'secondary' },
          { hex: '#EEF0FE', name: 'Lavender Mist',  role: 'accent' },
          { hex: '#FFFEFE', name: 'Pure White',      role: 'neutral' },
        ],
        font_suggestions: [
          { name: 'Inter',            type: 'sans-serif', use: 'body' },
          { name: 'Playfair Display', type: 'serif',      use: 'heading' },
        ],
        design_tips: [
          'Sử dụng nhiều khoảng trắng để tạo cảm giác thoáng đãng',
          'Hạn chế màu sắc — tối đa 3 màu chính trong một layout',
          'Typography là yếu tố visual chủ đạo, chọn font có cá tính',
        ],
        layout_config: {
          grid_columns: 3,
          primary_color: '#7B8EF7',
          accent_color: '#EEF0FE',
          layout_type: 'grid',
        },
        is_selected: false,
        generation_index: 1,
      },
    })
  }),

  http.post(`${BASE}/api/v1/media/upload-url`, async ({ request }) => {
    const body = await request.json() as { files?: unknown[] }
    const files = body.files ?? [{}]
    return HttpResponse.json({
      data: files.map(() => ({
        upload_url: 'https://upload.example.com/mock',
        cloudflare_uid: crypto.randomUUID(),
      })),
    })
  }),
]
