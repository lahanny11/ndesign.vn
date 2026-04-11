import { http, HttpResponse } from 'msw'
import { mockOrders, nextOrderNumber, TEAM_MAP, PRODUCT_TYPE_MAP, type MockOrder } from '../store'

const BASE = 'http://localhost:3000'

interface OrderPayload {
  task_name?: string
  team_id?: string
  deadline?: string
  is_urgent?: boolean
  product_type_id?: string
  product_type_name?: string
  product_size_name?: string
  brief_text?: string
  style_reference?: string
  primary_colors?: string[]
  orderer_name?: string
}

export const orderHandlers = [
  // ─── POST /orders — tạo order mới và lưu vào shared store ───────────────────
  http.post(`${BASE}/api/v1/orders`, async ({ request }) => {
    const body = await request.json() as OrderPayload

    const order_number = nextOrderNumber()
    const newId = crypto.randomUUID()

    const teamName = TEAM_MAP[body.team_id ?? ''] ?? body.team_id ?? 'Không rõ'
    const productTypeName = PRODUCT_TYPE_MAP[body.product_type_id ?? ''] ?? body.product_type_name ?? 'Không rõ'

    const newOrder: MockOrder = {
      id: newId,
      order_number,
      task_name: body.task_name ?? 'Không có tên',
      status: 'pending',
      deadline: body.deadline ?? new Date().toISOString().slice(0, 10),
      is_urgent: body.is_urgent ?? false,
      is_overdue: false,
      has_warn_flag: false,
      has_red_flag: false,
      revision_rounds: 0,
      team_name: teamName,
      team_id: body.team_id ?? '',
      orderer_name: body.orderer_name ?? 'Bạn',
      orderer_avatar: null,
      designer_name: null,
      designer_avatar: null,
      product_type_name: productTypeName,
      product_size_name: body.product_size_name ?? '—',
      created_at: new Date().toISOString(),
      done_at: null,
      progress: 1,
    }

    // Thêm vào đầu mảng để hiện trên cùng
    mockOrders.unshift(newOrder)

    return HttpResponse.json({
      id: newId,
      order_number,
      message: 'Order created successfully',
    }, { status: 201 })
  }),

  // ─── POST /orders/:id/moodboard — AI moodboard mock ─────────────────────────
  http.post(`${BASE}/api/v1/orders/:id/moodboard`, async ({ request }) => {
    const body = await request.json() as { style_description?: string }
    const style = body.style_description ?? 'Minimalist'

    await new Promise(r => setTimeout(r, 800))

    return HttpResponse.json({
      data: {
        id: crypto.randomUUID(),
        style_summary: `Phong cách "${style}" — kết hợp tinh tế và hiện đại, tạo ấn tượng mạnh mẽ nhưng không mất đi sự thanh lịch.`,
        color_palette: [
          { hex: '#000', name: 'Indigo Blue',  role: 'primary' },
          { hex: '#1D1D1F', name: 'Deep Black',   role: 'secondary' },
          { hex: '#F5F5F7', name: 'Silver Light', role: 'accent' },
          { hex: '#FFFFFF', name: 'Pure White',   role: 'neutral' },
        ],
        font_suggestions: [
          { name: 'Inter',            type: 'sans-serif', use: 'body' },
          { name: 'Playfair Display', type: 'serif',      use: 'heading' },
        ],
        design_tips: [
          'Sử dụng nhiều khoảng trắng để tạo cảm giác thoáng đãng và chuyên nghiệp',
          'Giới hạn tối đa 3 màu chính — ít màu hơn tạo sự gắn kết tốt hơn',
          'Typography là ngôn ngữ thị giác chủ đạo, chọn font có cá tính rõ ràng',
        ],
        layout_config: {
          grid_columns: 3,
          primary_color: '#000',
          accent_color: '#F5F5F7',
          layout_type: 'grid',
        },
        is_selected: false,
        generation_index: 1,
      },
    })
  }),

  // ─── POST /orders/:id/self-assign — designer tự nhận task ────────────────────
  http.post(`${BASE}/api/v1/orders/:id/self-assign`, ({ params }) => {
    const id = params.id as string
    const order = mockOrders.find(o => o.id === id)

    if (!order) return HttpResponse.json({ message: 'Order not found' }, { status: 404 })
    if (order.status !== 'pending') {
      return HttpResponse.json({ code: 'ORDER_NOT_PENDING', message: 'Order này không còn ở trạng thái chờ nhận' }, { status: 422 })
    }
    if (order.designer_name !== null) {
      return HttpResponse.json({ code: 'ALREADY_ASSIGNED', message: 'Order này đã được assign cho designer khác' }, { status: 422 })
    }

    // Capacity check: designer 'Lê Văn A' (mock current designer)
    const DESIGNER_NAME = 'Lê Văn A'
    const MAX_CAP = 7
    const activeCount = mockOrders.filter(o =>
      o.designer_name === DESIGNER_NAME &&
      ['assigned', 'in_progress', 'feedback', 'delivered'].includes(o.status)
    ).length
    if (activeCount >= MAX_CAP) {
      return HttpResponse.json({
        code: 'CAPACITY_FULL',
        message: `Bạn đang có ${activeCount}/${MAX_CAP} task. Hoàn thành task hiện tại trước khi nhận thêm.`,
      }, { status: 422 })
    }

    // Assign
    order.designer_name = DESIGNER_NAME
    order.status = 'assigned'
    order.progress = 2

    return HttpResponse.json({ success: true, order_id: id })
  }),

  // ─── POST /media/upload-url — presigned URL mock ─────────────────────────────
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
