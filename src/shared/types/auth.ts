// src/shared/types/auth.ts

export type Role = 'orderer' | 'designer' | 'design_leader' | 'co_leader'

export type TeamSlug =
  | 'academy'
  | 'admin'
  | 'edit'
  | 'hr'
  | 'it'
  | 'n-data'
  | 'social-content'
  | 'n-education'
  | 'design'

export type MemberStatus = 'new_member' | 'regular'

export interface AuthUser {
  person_id: string       // UUID = persons.id (Central Auth)
  email: string
  full_name: string
  avatar_url?: string
  roles: Role[]
  primary_role: Role
  team_slug: TeamSlug
  member_status?: MemberStatus  // chỉ có nếu primary_role === 'designer'
}
