import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useRoleStore, type AppRole } from '../stores/role.store'

interface AppLayoutProps {
  children: React.ReactNode
  onCreateOrder?: () => void
  activeNav?: string
  title?: string
}

// Apple-style SVG icons — no emoji
const Icons = {
  orders: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),
  analytics: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  tools: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  moodboard: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  feedback: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" className="w-[14px] h-[14px]">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  chevronDown: (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: 12, height: 12 }}>
      <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  // Role icons
  star: (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  pen: (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

interface NavItem {
  label: string
  key: string
  icon: React.ReactNode
  route: string
}

const navItems: NavItem[] = [
  { label: 'Order',      key: 'orders',    icon: Icons.orders,    route: '/dashboard' },
  { label: 'Analytics',  key: 'analytics', icon: Icons.analytics, route: '/analytics' },
  { label: 'Tools',      key: 'tools',     icon: Icons.tools,     route: '/tools' },
  { label: 'Moodboard',  key: 'moodboard', icon: Icons.moodboard, route: '/moodboard' },
  { label: 'Feedback',   key: 'feedback',  icon: Icons.feedback,  route: '/feedback' },
]

interface RoleOption {
  value: AppRole
  label: string
  icon: React.ReactNode
}

const ROLE_OPTIONS: RoleOption[] = [
  { value: 'design_leader', label: 'Design Leader', icon: Icons.star },
  { value: 'designer',      label: 'Designer',      icon: Icons.pen },
  { value: 'orderer',       label: 'Người order',   icon: Icons.user },
]

function RoleSwitcher() {
  const { role, setRole } = useRoleStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const current = ROLE_OPTIONS.find(r => r.value === role) ?? ROLE_OPTIONS[0]

  function handleSelect(r: AppRole) {
    setRole(r)
    setOpen(false)
    // Navigate to same path with new role param
    const url = new URL(window.location.href)
    url.searchParams.set('role', r)
    navigate(location.pathname + '?' + url.searchParams.toString(), { replace: true })
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 20,
          padding: '4px 12px 4px 8px',
          fontSize: 12,
          fontWeight: 600,
          color: '#1D1D1F',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ color: '#1D1D1F', display: 'flex', alignItems: 'center' }}>{current.icon}</span>
        {current.label}
        <span style={{ color: '#AEAEB2', display: 'flex', alignItems: 'center' }}>{Icons.chevronDown}</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          background: 'white',
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          minWidth: 160,
          padding: 6,
          zIndex: 100,
        }}>
          {ROLE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: 13,
                cursor: 'pointer',
                border: 'none',
                textAlign: 'left',
                background: role === opt.value ? 'rgba(0,0,0,0.07)' : 'transparent',
                color: role === opt.value ? '#000' : '#1D1D1F',
                fontWeight: role === opt.value ? 600 : 400,
              }}
              onMouseEnter={e => {
                if (role !== opt.value) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.04)'
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = role === opt.value ? 'rgba(0,0,0,0.07)' : 'transparent'
              }}
            >
              <span style={{ color: role === opt.value ? '#000' : '#6E6E73', display: 'flex', alignItems: 'center' }}>{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AppLayout({ children, onCreateOrder, activeNav, title }: AppLayoutProps) {
  const { data: user } = useCurrentUser()
  const [notifOpen, setNotifOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Detect active nav from pathname if not provided
  const currentNav = activeNav ?? (() => {
    const path = location.pathname
    if (path.startsWith('/analytics')) return 'analytics'
    if (path.startsWith('/tools')) return 'tools'
    if (path.startsWith('/moodboard')) return 'moodboard'
    if (path.startsWith('/feedback')) return 'feedback'
    return 'orders'
  })()

  const pageTitle = title ?? 'Quản lý Order'

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F5F5F7' }}>

      {/* Sidebar — icon-only, Apple macOS style */}
      <aside className="w-[68px] bg-white flex flex-col items-center py-4 gap-0 shrink-0"
        style={{ borderRight: '1px solid rgba(0,0,0,0.07)' }}>
        {/* Logo */}
        <div className="w-8 h-8 rounded-[9px] flex items-center justify-center mb-6 shrink-0"
          style={{ background: '#000' }}>
          <span className="text-white font-bold"
            style={{ fontSize: 14, fontFamily: 'Georgia, serif', letterSpacing: '-0.5px' }}>N</span>
        </div>

        {/* Nav icons */}
        <nav className="flex flex-col gap-0.5 flex-1 w-full px-2">
          {navItems.map((item) => {
            const isActive = currentNav === item.key
            return (
              <div key={item.label} className="relative group">
                <button
                  onClick={() => navigate(item.route)}
                  className="w-full rounded-[9px] flex items-center justify-center transition-all duration-150"
                  style={{
                    height: 44,
                    background: isActive ? '#000' : 'transparent',
                    color: isActive ? '#fff' : '#AEAEB2',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.05)'
                      ;(e.currentTarget as HTMLButtonElement).style.color = '#3A3A3C'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                      ;(e.currentTarget as HTMLButtonElement).style.color = '#AEAEB2'
                    }
                  }}
                >
                  {item.icon}
                </button>
                {/* Tooltip */}
                <div className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#1D1D1F] text-white
                  text-[11px] font-semibold rounded-[8px] whitespace-nowrap opacity-0 group-hover:opacity-100
                  pointer-events-none transition-opacity z-50"
                  style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-[4px] border-transparent border-r-[#1D1D1F]"/>
                </div>
              </div>
            )
          })}
        </nav>

        {/* User avatar */}
        <div className="relative group mt-auto mb-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer"
            style={{ fontSize: 12, background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)' }}>
            {user?.display_name?.[0] ?? 'U'}
          </div>
          <div className="absolute left-full ml-2.5 bottom-0 px-2.5 py-1.5 bg-[#1D1D1F] text-white
            text-[11px] font-semibold rounded-[8px] whitespace-nowrap opacity-0 group-hover:opacity-100
            pointer-events-none transition-opacity z-50"
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            {user?.display_name ?? 'Demo User'}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-[50px] flex items-center px-5 gap-3 shrink-0"
          style={{
            background: 'rgba(255,255,255,0.85)',
            borderBottom: '1px solid rgba(0,0,0,0.07)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}>
          {/* Page title */}
          <h1 style={{
            fontSize: 15,
            fontWeight: 600,
            color: '#1D1D1F',
            letterSpacing: '-0.02em',
            flexShrink: 0,
            margin: 0,
          }}>
            {pageTitle}
          </h1>

          {/* Search */}
          <div style={{ flex: 1, maxWidth: 280, margin: '0 8px' }}>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                color: '#AEAEB2', display: 'flex', alignItems: 'center',
              }}>
                {Icons.search}
              </span>
              <input type="text" placeholder="Tìm kiếm..."
                style={{
                  width: '100%',
                  paddingLeft: 30, paddingRight: 10, paddingTop: 6, paddingBottom: 6,
                  fontSize: 12,
                  borderRadius: 8,
                  border: '1px solid transparent',
                  background: 'rgba(0,0,0,0.05)',
                  color: '#1D1D1F',
                  outline: 'none',
                  transition: 'all 0.15s',
                  fontFamily: 'inherit',
                }}
                onFocus={e => {
                  e.target.style.background = '#fff'
                  e.target.style.border = '1px solid rgba(0,0,0,0.25)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.05)'
                }}
                onBlur={e => {
                  e.target.style.background = 'rgba(0,0,0,0.05)'
                  e.target.style.border = '1px solid transparent'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            {/* Role Switcher */}
            <RoleSwitcher />

            {/* Bell */}
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              style={{
                position: 'relative',
                width: 36, height: 36,
                borderRadius: 9,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', background: 'transparent', cursor: 'pointer',
                color: '#6E6E73', transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.05)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {Icons.bell}
              <span style={{
                position: 'absolute', top: 8, right: 8,
                width: 6, height: 6, borderRadius: '50%',
                background: '#E11D48',
              }}/>
            </button>

            {/* Create order */}
            {onCreateOrder && (
              <button
                onClick={onCreateOrder}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  height: 34, paddingLeft: 14, paddingRight: 14,
                  borderRadius: 9,
                  fontSize: 12, fontWeight: 600, color: '#fff',
                  border: 'none', background: '#000', cursor: 'pointer',
                  transition: 'opacity 0.15s',
                  letterSpacing: '-0.01em',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                {Icons.plus}
                Tạo order
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto" style={{ padding: 20 }}>
          {children}
        </main>
      </div>
    </div>
  )
}
