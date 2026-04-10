export interface OrderFormStep1 {
  orderer_name: string
  team_id: string
  task_name: string
  deadline: string
  is_urgent: boolean
}

export interface OrderFormStep2 {
  product_type_id: string
  product_type_name: string
  product_size_name: string
}

export interface OrderFormStep3 {
  brief_text: string
  style_reference: string
  primary_colors: string[]
  media_cloudflare_uids: string[]
  moodboard_id: string | null
  style_description: string
}

export interface OrderFormData {
  step1: OrderFormStep1
  step2: OrderFormStep2
  step3: OrderFormStep3
  draft_order_id: string
}

export interface ProductSize {
  name: string
  width: number | null
  height: number | null
  unit: 'px' | 'mm' | null
  platform?: string
  platform_color?: string
}

export interface ProductType {
  id: string
  name: string
  slug: string
  standard_sizes: ProductSize[]
}

export interface MoodboardResult {
  id: string
  style_summary: string
  color_palette: { hex: string; name: string; role: string }[]
  font_suggestions: { name: string; type: string; use: string }[]
  design_tips: string[]
  layout_config: {
    grid_columns: number
    primary_color: string
    accent_color: string
    layout_type: 'grid' | 'masonry' | 'horizontal'
  }
  is_selected: boolean
  generation_index: number
}
