// Shared in-memory store — dùng chung cho tất cả mock handlers
// Khi POST /orders tạo order mới → push vào đây → GET /orders sẽ thấy ngay

export interface MockOrder {
  id: string
  order_number: string
  task_name: string
  status: string
  deadline: string
  is_urgent: boolean
  is_overdue: boolean
  has_warn_flag: boolean
  has_red_flag: boolean
  revision_rounds: number
  team_name: string
  team_id: string
  orderer_name: string
  orderer_avatar: null
  designer_name: string | null
  designer_avatar: null
  product_type_name: string
  product_size_name: string
  created_at: string
  done_at: string | null
  progress: number
}

export const mockOrders: MockOrder[] = [
  {
    id: '1', order_number: 'ND-20260401-0001',
    task_name: 'Banner Mạng xã hội Xuân 2025',
    status: 'assigned', deadline: '2026-04-15', is_urgent: true,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 1, team_name: 'Admin Nhile', team_id: 'team-admin',
    orderer_name: 'Felix', designer_name: 'Lê Văn A', designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Social Media', product_size_name: 'Feed Post',
    created_at: '2026-04-01T09:00:00Z', done_at: null, progress: 4,
  },
  {
    id: '2', order_number: 'ND-20260404-0002',
    task_name: 'Bộ Avatar Nhân viên mới Q2',
    status: 'pending', deadline: '2026-04-20', is_urgent: false,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 0, team_name: 'Social Content', team_id: 'team-social',
    orderer_name: 'Hải Yến', designer_name: null, designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Social Media', product_size_name: 'Story',
    created_at: '2026-04-04T10:00:00Z', done_at: null, progress: 1,
  },
  {
    id: '3', order_number: 'ND-20260320-0003',
    task_name: 'Slide bài giảng tháng 4',
    status: 'feedback', deadline: '2026-04-10', is_urgent: true,
    is_overdue: true, has_warn_flag: false, has_red_flag: true,
    revision_rounds: 3, team_name: 'Edit', team_id: 'team-edit',
    orderer_name: 'Nhi Le', designer_name: 'Trần Thị B', designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Print', product_size_name: 'A4',
    created_at: '2026-03-20T08:00:00Z', done_at: null, progress: 6,
  },
  {
    id: '4', order_number: 'ND-20260310-0004',
    task_name: 'Poster Tuyển dụng IT',
    status: 'done', deadline: '2026-03-20', is_urgent: false,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 1, team_name: 'IT', team_id: 'team-it',
    orderer_name: 'Anh Tech', designer_name: 'Lê Văn A', designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Print', product_size_name: 'A3',
    created_at: '2026-03-10T00:00:00Z', done_at: '2026-03-19T00:00:00Z', progress: 7,
  },
  {
    id: '5', order_number: 'ND-20260401-0005',
    task_name: 'Ảnh Quote Motivation Daily',
    status: 'in_progress', deadline: '2026-04-18', is_urgent: false,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 0, team_name: 'Social Content', team_id: 'team-social',
    orderer_name: 'Hải Yến', designer_name: 'Lê Văn A', designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Social Media', product_size_name: 'Feed Post',
    created_at: '2026-04-01T00:00:00Z', done_at: null, progress: 3,
  },
  {
    id: '6', order_number: 'ND-20260328-0006',
    task_name: 'Thumbnail Youtube Series mới',
    status: 'pending', deadline: '2026-04-22', is_urgent: true,
    is_overdue: false, has_warn_flag: true, has_red_flag: false,
    revision_rounds: 2, team_name: 'Social Content', team_id: 'team-social',
    orderer_name: 'Khánh Linh', designer_name: null, designer_avatar: null, orderer_avatar: null,
    product_type_name: 'YouTube', product_size_name: 'Thumbnail',
    created_at: '2026-03-28T00:00:00Z', done_at: null, progress: 1,
  },
  {
    id: '7', order_number: 'ND-20260405-0007',
    task_name: 'Standee Workshop tháng 4',
    status: 'in_progress', deadline: '2026-04-25', is_urgent: false,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 0, team_name: 'N-Education', team_id: 'team-nedu',
    orderer_name: 'Văn Khoa', designer_name: 'Lê Văn A', designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Print', product_size_name: 'A3',
    created_at: '2026-04-05T00:00:00Z', done_at: null, progress: 3,
  },
]

// Map: team-id → team-name (dùng khi tạo order mới)
export const TEAM_MAP: Record<string, string> = {
  'team-academy': 'Academy',
  'team-admin':   'Admin',
  'team-design':  'Design',
  'team-edit':    'Edit',
  'team-hr':      'HR',
  'team-it':      'IT',
  'team-ndata':   'N-Data',
  'team-social':  'Social Content',
  'team-nedu':    'N-Education',
}

// Map: product-type-id → name
export const PRODUCT_TYPE_MAP: Record<string, string> = {
  'pt-1': 'Social Media',
  'pt-2': 'LinkedIn',
  'pt-3': 'YouTube',
  'pt-4': 'Print',
  'pt-5': 'Email',
  'pt-6': 'Custom',
}

// ─── Designer metadata (leave + member status) ───────────────────────────────

export interface DesignerMeta {
  id: string
  name: string
  member_status: 'new' | 'regular'
  joined_at: string
  training_note: string | null
  leave: {
    is_on_leave: boolean
    leave_start: string
    leave_end: string
    reason: string
    approved_by: string
    handover_status: 'pending' | 'partial' | 'complete' | 'standby'
    handover_to: string | null
  } | null
}

export const designerMetas: DesignerMeta[] = [
  {
    id: 'u-de-1',
    name: 'Lê Văn A',
    member_status: 'regular',
    joined_at: '2025-06-01',
    training_note: null,
    leave: null,
  },
  {
    id: 'u-de-2',
    name: 'Trần Thị B',
    member_status: 'regular',
    joined_at: '2025-03-15',
    training_note: null,
    // Trần Thị B đang nghỉ phép — thông tin từ HR ghi vào
    leave: {
      is_on_leave: true,
      leave_start: '2026-04-10',
      leave_end: '2026-04-18',
      reason: 'Nghỉ phép năm',
      approved_by: 'Nhi Le',
      handover_status: 'partial',
      handover_to: 'Lê Văn A',
    },
  },
  {
    id: 'u-de-3',
    name: 'Nguyễn C',
    member_status: 'new',               // Thành viên mới — vừa xong training
    joined_at: '2026-03-20',
    training_note: 'Hoàn thành training 15/4. Cần quan sát kỹ ở 2 order đầu tiên. Điểm mạnh: layout. Cần cải thiện: đọc brief kỹ hơn.',
    leave: null,
  },
]

// ─── Deliveries in-memory store ───────────────────────────────────────────────

export interface MockDelivery {
  id: string
  order_id: string
  round: number
  link_url: string
  link_type: string
  link_label: string
  note: string | null
  delivered_by: string
  delivered_at: string
  is_confirmed: boolean
  confirmed_at: string | null
}

// Seed: order '1' (Banner MXH) đã giao lần đầu, đang chờ xác nhận
export const mockDeliveries: MockDelivery[] = [
  {
    id: 'del-1',
    order_id: '1',
    round: 1,
    link_url: 'https://drive.google.com/drive/folders/mock-banner-xuan-2025',
    link_type: 'google_drive',
    link_label: 'Google Drive',
    note: 'Gồm 3 sizes: Feed 1080×1080, Story 1080×1920, Banner web 1200×628. File nguồn .ai trong thư mục Source.',
    delivered_by: 'Lê Văn A',
    delivered_at: '2026-04-05T16:00:00Z',
    is_confirmed: false,
    confirmed_at: null,
  },
]

let _counter = 8
export function nextOrderNumber() {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const num = String(_counter++).padStart(4, '0')
  return `ND-${today}-${num}`
}
