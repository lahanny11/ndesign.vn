// src/mocks/data/dashboard.ts
import { MOCK_PERSONS_IDS } from './persons'

export const MOCK_DASHBOARD_STATS = {
  [MOCK_PERSONS_IDS.design_leader]: {
    total_orders: 24,
    active_orders: 8,
    done_this_month: 12,
    avg_revision: 2.1,
    pending_assignment: 2,
    active_red_flag_orders: 1,
    pending_order_names: ['Poster Workshop Tháng 5', 'Thumbnail YouTube Series'],
    red_flag_order_names: ['Slide bài giảng tháng 4'],
  },
  [MOCK_PERSONS_IDS.co_leader]: {
    total_orders: 24,
    active_orders: 8,
    done_this_month: 12,
    avg_revision: 1.4,
    pending_assignment: 0,
    active_red_flag_orders: 0,
    pending_order_names: [],
    red_flag_order_names: [],
  },
}

export const MOCK_WORKLOAD = [
  {
    person_id: MOCK_PERSONS_IDS.designer_01,
    full_name: 'Designer 01',
    member_status: 'regular',
    is_blocked: false,
    active_task_count: 5,
    pending_task_count: 2,
    done_this_week: 3,
    avg_revision: 1.1,
  },
  {
    person_id: MOCK_PERSONS_IDS.designer_02,
    full_name: 'Designer 02',
    member_status: 'new_member',
    is_blocked: true,
    active_task_count: 4,
    pending_task_count: 1,
    done_this_week: 2,
    avg_revision: 2.1,
  },
  {
    person_id: 'g7h8i9j0-k1l2-3456-mabc-789012345678',
    full_name: 'Designer 03',
    member_status: 'regular',
    is_blocked: false,
    active_task_count: 3,
    pending_task_count: 0,
    done_this_week: 0,
    avg_revision: 1.3,
    on_leave: {
      start_date: '2026-04-17',
      end_date: '2026-04-22',
      reason: 'annual_leave',
      handover_to_id: MOCK_PERSONS_IDS.designer_01,
      handover_status: 'partial',
    },
  },
]
