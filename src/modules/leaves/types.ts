// src/modules/leaves/types.ts

export type LeaveReason = 'annual_leave' | 'sick_leave' | 'wedding_leave'
export type HandoverStatus = 'pending' | 'partial' | 'complete' | 'standby'

export interface Leave {
  id: string
  designer_id: string
  reason: LeaveReason
  start_date: string
  end_date: string
  handover_to_id?: string
  handover_status: HandoverStatus
  created_at: string
  updated_at: string
}
