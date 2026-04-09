import { useState } from 'react'
import { useCurrentUser } from '../hooks/useCurrentUser'

interface AppLayoutProps {
  children: React.ReactNode
  onCreateOrder?: () => void
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
}

const navItems = [
  { label: 'Order',      icon: Icons.orders,    active: true  },
  { label: 'Analytics',  icon: Icons.analytics, active: false },
  { label: 'Tools',      icon: Icons.tools,     active: false },
  { label: 'Moodboard',  icon: Icons.moodboard, active: false },
  { label: 'Feedback',   icon: Icons.feedback,  active: false },
]

export default function AppLayout({ children, onCreateOrder }: AppLayoutProps) {
  const { data: user } = useCurrentUser()
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F5F5F7' }}>

      {/* Sidebar — icon only, Apple macOS style */}
      <aside className="w-[72px] bg-white flex flex-col items-center py-5 gap-1 shrink-0"
        style={{ borderRight: '1px solid rgba(0,0,0,0.08)' }}>
        {/* Logo */}
        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center mb-5 shrink-0"
          style={{ background: '#5E5CE6' }}>
          <span className="text-white text-[15px] font-bold" style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.5px' }}>N</span>
        </div>

        {/* Nav icons */}
        <nav className="flex flex-col gap-1 flex-1 w-full px-2">
          {navItems.map((item) => (
            <div key={item.label} className="relative group">
              <button
                className={`w-full h-11 rounded-[10px] flex items-center justify-center transition-all duration-150
                  ${item.active
                    ? 'text-[#5E5CE6]'
                    : 'text-[#AEAEB2] hover:text-[#3A3A3C] hover:bg-black/[0.04]'
                  }`}
                style={item.active ? { background: 'rgba(94,92,230,0.1)' } : {}}
              >
                {item.icon}
              </button>
              {/* Tooltip */}
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#1D1D1F] text-white
                text-[11px] font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100
                pointer-events-none transition-opacity z-50 shadow-lg">
                {item.label}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1D1D1F]"/>
              </div>
            </div>
          ))}
        </nav>

        {/* User avatar */}
        <div className="relative group mt-auto">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-semibold cursor-pointer"
            style={{ background: '#5E5CE6' }}>
            {user?.display_name?.[0] ?? 'U'}
          </div>
          <div className="absolute left-full ml-3 bottom-0 px-2.5 py-1.5 bg-[#1D1D1F] text-white
            text-[11px] font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100
            pointer-events-none transition-opacity z-50 shadow-lg">
            {user?.display_name ?? 'Demo User'}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-[52px] bg-white/80 flex items-center px-6 gap-4 shrink-0"
          style={{
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}>
          {/* Page title */}
          <h1 className="text-[15px] font-semibold text-[#1D1D1F] tracking-tight shrink-0">
            Quản lý Order
          </h1>

          {/* Search */}
          <div className="flex-1 max-w-[320px] mx-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AEAEB2]">
                {Icons.search}
              </span>
              <input type="text" placeholder="Tìm kiếm..."
                className="w-full pl-8 pr-3 py-[6px] text-[13px] rounded-[8px] outline-none transition-all
                  placeholder:text-[#AEAEB2] text-[#1D1D1F]"
                style={{
                  background: 'rgba(0,0,0,0.05)',
                  border: '1px solid transparent',
                }}
                onFocus={e => {
                  e.target.style.background = '#fff'
                  e.target.style.border = '1px solid rgba(94,92,230,0.4)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(94,92,230,0.1)'
                }}
                onBlur={e => {
                  e.target.style.background = 'rgba(0,0,0,0.05)'
                  e.target.style.border = '1px solid transparent'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Bell */}
            <button onClick={() => setNotifOpen(!notifOpen)}
              className="relative w-9 h-9 rounded-[10px] flex items-center justify-center text-[#6E6E73]
                hover:bg-black/[0.04] transition-colors">
              {Icons.bell}
              <span className="absolute top-2 right-2 w-[6px] h-[6px] rounded-full"
                style={{ background: '#FF3B30' }}/>
            </button>

            {/* Create order */}
            <button onClick={onCreateOrder}
              className="flex items-center gap-1.5 h-9 px-4 rounded-[10px] text-[13px] font-semibold text-white
                transition-all hover:opacity-90 active:scale-[0.97]"
              style={{ background: '#5E5CE6' }}>
              {Icons.plus}
              Tạo order
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
