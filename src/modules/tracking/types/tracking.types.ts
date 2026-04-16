import type { Delivery } from './delivery.types'
export type { Delivery }

export type StepState = 'done' | 'active' | 'flagged' | 'pending'

export interface CheckItem {
  ok: boolean | null
  text: string
}

export interface TimelineStep {
  id: string
  name: string
  state: StepState
  time: string
  timeClass?: 'late' | 'early'
  desc: string
  checks: CheckItem[]
  actions?: string[]
}

export interface OrderMetrics {
  rounds: number
  ontime: string
  comms: number
  briefCheck: boolean
}

export interface OrderDetail {
  id: string
  title: string
  type: string
  team: string
  designer: string | null
  deadline: string
  status: string
  flag: 'red' | 'warn' | null
  metrics: OrderMetrics
  redFlags?: string[]
  steps: TimelineStep[]
  deliveries?: Delivery[]
}
