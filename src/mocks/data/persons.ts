// src/mocks/data/persons.ts
import type { Role } from '@shared/types/auth'

export interface MockPerson {
  id: string; email: string; full_name: string
  avatar_url?: string; roles: Role[]; primary_role: Role
}

export const MOCK_PERSONS: MockPerson[] = [
  { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', email: 'design-leader-01@ndesign.nquoc.vn', full_name: 'Design Leader 01', roles: ['design_leader'] as Role[], primary_role: 'design_leader' as Role },
  { id: 'b2c3d4e5-f6a7-8901-bcde-f23456789012', email: 'designer-01@ndesign.nquoc.vn',      full_name: 'Designer 01',      roles: ['designer']      as Role[], primary_role: 'designer'      as Role },
  { id: 'c3d4e5f6-a7b8-9012-cdef-345678901234', email: 'orderer-01@ndesign.nquoc.vn',       full_name: 'Orderer 01',       roles: ['orderer']       as Role[], primary_role: 'orderer'       as Role },
  { id: 'd4e5f6a7-b8c9-0123-defa-456789012345', email: 'co-leader-01@ndesign.nquoc.vn',     full_name: 'Co-Leader 01',     roles: ['co_leader']     as Role[], primary_role: 'co_leader'     as Role },
  { id: 'e5f6a7b8-c9d0-1234-efab-567890123456', email: 'designer-02@ndesign.nquoc.vn',      full_name: 'Designer 02',      roles: ['designer']      as Role[], primary_role: 'designer'      as Role },
  { id: 'f6a7b8c9-d0e1-2345-fabc-678901234567', email: 'orderer-02@ndesign.nquoc.vn',       full_name: 'Orderer 02',       roles: ['orderer']       as Role[], primary_role: 'orderer'       as Role },
]

export const MOCK_PERSONS_IDS = {
  design_leader: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  designer_01:   'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  orderer_01:    'c3d4e5f6-a7b8-9012-cdef-345678901234',
  co_leader:     'd4e5f6a7-b8c9-0123-defa-456789012345',
  designer_02:   'e5f6a7b8-c9d0-1234-efab-567890123456',
  orderer_02:    'f6a7b8c9-d0e1-2345-fabc-678901234567',
}
