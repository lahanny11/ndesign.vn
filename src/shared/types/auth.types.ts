export type UserRole = 'orderer' | 'designer' | 'design_leader' | 'co_leader'

export interface Team {
  id: string
  name: string
  slug: string
}

export interface UserProfile {
  id: string
  email: string
  display_name: string
  avatar_url: string | null
  role: UserRole
  team: Team
  is_active: boolean
}
