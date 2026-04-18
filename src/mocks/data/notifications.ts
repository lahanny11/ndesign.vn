// src/mocks/data/notifications.ts
import { MOCK_PERSONS_IDS } from './persons'

export interface Notification {
  id: string
  person_id: string
  type: string
  title: string
  body: string
  order_id?: string
  is_read: boolean
  created_at: string
  updated_at: string
}

export const MOCK_NOTIFICATIONS: Record<string, Notification[]> = {
  [MOCK_PERSONS_IDS.design_leader]: [
    {
      id: 'notif-0001',
      person_id: MOCK_PERSONS_IDS.design_leader,
      type: 'pending_assignment',
      title: 'Order chưa assign',
      body: 'Poster Workshop Tháng 5 chưa có designer',
      order_id: 'ord-0003-uuid-cdef-3456-789012345678',
      is_read: false,
      created_at: '2026-04-18T06:00:00.000Z',
      updated_at: '2026-04-18T06:00:00.000Z',
    },
  ],
  [MOCK_PERSONS_IDS.designer_01]: [
    {
      id: 'notif-0002',
      person_id: MOCK_PERSONS_IDS.designer_01,
      type: 'order_assigned',
      title: 'Bạn được assign task mới',
      body: 'Banner Mạng xã hội Xuân 2025',
      order_id: 'ord-0001-uuid-abcd-ef12-345678901234',
      is_read: true,
      created_at: '2026-04-15T10:05:00.000Z',
      updated_at: '2026-04-15T10:05:00.000Z',
    },
  ],
  [MOCK_PERSONS_IDS.orderer_01]: [],
}
