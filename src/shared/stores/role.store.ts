import { create } from 'zustand'

export type AppRole = 'design_leader' | 'co_leader' | 'designer' | 'orderer'

interface RoleStore {
  role: AppRole
  setRole: (role: AppRole) => void
}

// Read from URL param on init
function getRoleFromUrl(): AppRole {
  const params = new URLSearchParams(window.location.search)
  const r = params.get('role')
  if (r === 'designer' || r === 'orderer' || r === 'design_leader' || r === 'co_leader') return r
  return 'design_leader' // default
}

export const useRoleStore = create<RoleStore>((set) => ({
  role: getRoleFromUrl(),
  setRole: (role) => {
    // Update URL param without reload
    const url = new URL(window.location.href)
    url.searchParams.set('role', role)
    window.history.replaceState({}, '', url.toString())
    set({ role })
  },
}))
