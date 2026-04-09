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
  designer_name: null
  designer_avatar: null
  product_type_name: string
  product_size_name: string
  created_at: string
  done_at: null
  progress: number
}

export const mockOrders: MockOrder[] = [
  {
    id: '1', order_number: 'ND-20260401-0001',
    task_name: 'Banner Mạng xã hội Xuân 2025',
    status: 'assigned', deadline: '2026-04-15', is_urgent: true,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 0, team_name: 'Admin Nhile', team_id: 'team-1',
    orderer_name: 'Felix', designer_name: null, designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Social Media', product_size_name: 'Feed Post',
    created_at: '2026-04-01T09:00:00Z', done_at: null, progress: 4,
  },
  {
    id: '2', order_number: 'ND-20260404-0002',
    task_name: 'Bộ Avatar Nhân viên mới Q2',
    status: 'pending', deadline: '2026-04-20', is_urgent: false,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 0, team_name: 'Nedu', team_id: 'team-2',
    orderer_name: 'Ms. Hồng', designer_name: null, designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Social Media', product_size_name: 'Story',
    created_at: '2026-04-04T10:00:00Z', done_at: null, progress: 1,
  },
  {
    id: '3', order_number: 'ND-20260320-0003',
    task_name: 'Slide bài giảng tháng 4',
    status: 'feedback', deadline: '2026-04-10', is_urgent: true,
    is_overdue: true, has_warn_flag: false, has_red_flag: true,
    revision_rounds: 3, team_name: 'Edit', team_id: 'team-3',
    orderer_name: 'Nhi Le', designer_name: null, designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Print', product_size_name: 'A4',
    created_at: '2026-03-20T08:00:00Z', done_at: null, progress: 6,
  },
  {
    id: '4', order_number: 'ND-20260310-0004',
    task_name: 'Poster Tuyển dụng IT',
    status: 'done', deadline: '2026-03-20', is_urgent: false,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 1, team_name: 'IT', team_id: 'team-4',
    orderer_name: 'Anh Tech', designer_name: null, designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Print', product_size_name: 'A3',
    created_at: '2026-03-10T00:00:00Z', done_at: '2026-03-19T00:00:00Z', progress: 7,
  },
  {
    id: '5', order_number: 'ND-20260401-0005',
    task_name: 'Ảnh Quote Motivation Daily',
    status: 'in_progress', deadline: '2026-04-18', is_urgent: false,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 0, team_name: 'Ms Nhi', team_id: 'team-5',
    orderer_name: 'Ms Nhi', designer_name: null, designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Social Media', product_size_name: 'Feed Post',
    created_at: '2026-04-01T00:00:00Z', done_at: null, progress: 3,
  },
  {
    id: '6', order_number: 'ND-20260328-0006',
    task_name: 'Thumbnail Youtube Series mới',
    status: 'pending', deadline: '2026-04-22', is_urgent: true,
    is_overdue: false, has_warn_flag: true, has_red_flag: false,
    revision_rounds: 0, team_name: 'NLT', team_id: 'team-7',
    orderer_name: 'Content', designer_name: null, designer_avatar: null, orderer_avatar: null,
    product_type_name: 'YouTube', product_size_name: 'Thumbnail',
    created_at: '2026-03-28T00:00:00Z', done_at: null, progress: 1,
  },
  {
    id: '7', order_number: 'ND-20260405-0007',
    task_name: 'Standee Workshop tháng 4',
    status: 'in_progress', deadline: '2026-04-25', is_urgent: false,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 0, team_name: 'Nedu', team_id: 'team-2',
    orderer_name: 'Manager', designer_name: null, designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Print', product_size_name: 'A3',
    created_at: '2026-04-05T00:00:00Z', done_at: null, progress: 3,
  },
]

// Map: team-id → team-name (dùng khi tạo order mới)
export const TEAM_MAP: Record<string, string> = {
  'team-1': 'Admin Nhile',
  'team-2': 'Nedu',
  'team-3': 'Edit',
  'team-4': 'IT',
  'team-5': 'Ms Nhi',
  'team-6': 'Content',
  'team-7': 'NLT',
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

let _counter = 8
export function nextOrderNumber() {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const num = String(_counter++).padStart(4, '0')
  return `ND-${today}-${num}`
}
