// src/modules/orders/types.ts

export type OrderStatus = 'pending' | 'assigned' | 'active' | 'delivered' | 'feedback' | 'done'
export type OrderPriority = 'normal' | 'high' | 'urgent'

export interface Order {
  id: string
  order_number: string
  task_name: string
  orderer_id: string
  orderer_person_id: string
  team_id: string
  designer_id?: string
  product_type_id: string
  product_size_label: string
  brief: string
  style_description: string
  color_palette: string[]
  reference_image_urls: string[]
  status: OrderStatus
  priority: OrderPriority
  is_urgent: boolean
  is_overdue: boolean
  has_red_flag: boolean
  has_warn_flag: boolean
  revision_count: number
  milestone_progress: number
  deadline: string             // YYYY-MM-DD (date-only intentional)
  last_checkin_at?: string
  created_at: string
  updated_at: string
}
