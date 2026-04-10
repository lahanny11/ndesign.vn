import { useState, useRef, useEffect } from 'react'
import { useCurrentUser } from '../../../shared/hooks/useCurrentUser'
import { useRoleStore, type AppRole } from '../../../shared/stores/role.store'

interface ChatMessage {
  id: string
  sender_name: string
  sender_role: AppRole
  content: string
  timestamp: string  // ISO string
  is_own: boolean
}

// Initial mock messages per order id
const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  '1': [
    {
      id: 'm1', sender_name: 'Felix', sender_role: 'orderer',
      content: 'Anh ơi, màu banner cần đổi về #FF6B35 theo brand guide mới nhé. File brand guide em đã upload.',
      timestamp: '2026-04-05T09:15:00Z', is_own: false,
    },
    {
      id: 'm2', sender_name: 'Lê Văn A', sender_role: 'designer',
      content: 'Ok em nhận rồi ạ. Em sẽ update màu và gửi lại trước 3h chiều hôm nay.',
      timestamp: '2026-04-05T09:28:00Z', is_own: false,
    },
    {
      id: 'm3', sender_name: 'Nhi Le', sender_role: 'design_leader',
      content: 'Lê Văn A lưu ý thêm: check kích thước story 1080x1920 chưa nhé, lần trước thiếu.',
      timestamp: '2026-04-05T10:00:00Z', is_own: true,
    },
  ],
  '3': [
    {
      id: 'm1', sender_name: 'Nhi Le', sender_role: 'design_leader',
      content: 'Slide này đã revise 3 lần rồi. Em cần đọc kỹ feedback từng điểm trước khi sửa.',
      timestamp: '2026-04-09T08:00:00Z', is_own: true,
    },
    {
      id: 'm2', sender_name: 'Trần Thị B', sender_role: 'designer',
      content: 'Dạ em hiểu rồi ạ. Em sẽ list từng điểm ra và confirm với anh/chị trước khi làm.',
      timestamp: '2026-04-09T08:30:00Z', is_own: false,
    },
    {
      id: 'm3', sender_name: 'Nhi Le', sender_role: 'design_leader',
      content: 'Tốt. Sau khi list xong gửi vào đây cho mình check trước nhé.',
      timestamp: '2026-04-09T08:35:00Z', is_own: true,
    },
  ],
}

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 'dm1', sender_name: 'System', sender_role: 'design_leader',
    content: 'Order được tạo. Bắt đầu trao đổi tại đây.',
    timestamp: new Date().toISOString(), is_own: false,
  },
]

const ROLE_BADGE: Record<AppRole, { label: string; color: string }> = {
  design_leader: { label: 'Leader', color: '#000' },
  designer:      { label: 'Designer', color: '#34C759' },
  orderer:       { label: 'Orderer', color: '#FF9F0A' },
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const today = new Date()
  if (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  ) {
    return `Hôm nay ${formatTime(iso)}`
  }
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) + ' ' + formatTime(iso)
}

interface Props {
  orderId: string
}

export default function OrderChat({ orderId }: Props) {
  const { data: user } = useCurrentUser()
  const role = useRoleStore(s => s.role)
  const storageKey = `ndesign_chat_${orderId}`

  // Merge initial messages + localStorage messages
  function loadMessages(): ChatMessage[] {
    const base = INITIAL_MESSAGES[orderId] ?? DEFAULT_MESSAGES
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed: ChatMessage[] = JSON.parse(saved)
        // Dedup by id
        const ids = new Set(base.map(m => m.id))
        const extra = parsed.filter(m => !ids.has(m.id))
        return [...base, ...extra].sort((a, b) => a.timestamp.localeCompare(b.timestamp))
      }
    } catch { /* ignore */ }
    return base
  }

  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages)
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  // Auto-grow textarea
  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px'
  }

  function sendMessage() {
    const content = input.trim()
    if (!content) return

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender_name: user?.display_name ?? 'Bạn',
      sender_role: role,
      content,
      timestamp: new Date().toISOString(),
      is_own: true,
    }

    const updated = [...messages, newMsg]
    setMessages(updated)

    // Persist only non-initial messages
    const initialIds = new Set((INITIAL_MESSAGES[orderId] ?? DEFAULT_MESSAGES).map(m => m.id))
    const toSave = updated.filter(m => !initialIds.has(m.id))
    try {
      localStorage.setItem(storageKey, JSON.stringify(toSave))
    } catch { /* ignore */ }

    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, color: '#AEAEB2',
          textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>
          Trao đổi
        </span>
        <span style={{
          fontSize: 10, fontWeight: 600, color: '#6E6E73',
          background: 'rgba(0,0,0,0.07)', padding: '1px 7px', borderRadius: 20,
        }}>
          {messages.length}
        </span>
        <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.07)' }}/>
      </div>

      {/* Message list */}
      <div
        ref={listRef}
        style={{
          maxHeight: 300, overflowY: 'auto', display: 'flex',
          flexDirection: 'column', gap: 10, marginBottom: 12,
          paddingRight: 2,
        }}
      >
        {messages.map((msg, idx) => {
          const isFirst = idx === 0 || messages[idx - 1].sender_name !== msg.sender_name
          const roleBadge = ROLE_BADGE[msg.sender_role] ?? ROLE_BADGE.orderer

          return (
            <div key={msg.id} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.is_own ? 'flex-end' : 'flex-start',
            }}>
              {/* Sender info — show on first message in group */}
              {isFirst && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3,
                  flexDirection: msg.is_own ? 'row-reverse' : 'row',
                }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#1D1D1F' }}>
                    {msg.sender_name}
                  </span>
                  <span style={{
                    fontSize: 9, fontWeight: 600, padding: '1px 5px', borderRadius: 4,
                    background: `${roleBadge.color}18`, color: roleBadge.color,
                  }}>
                    {roleBadge.label}
                  </span>
                </div>
              )}

              {/* Bubble */}
              <div style={{
                maxWidth: '80%',
                background: msg.is_own ? '#000' : 'rgba(0,0,0,0.06)',
                color: msg.is_own ? '#fff' : '#1D1D1F',
                borderRadius: msg.is_own ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                padding: '8px 12px',
                fontSize: 12,
                lineHeight: 1.5,
                wordBreak: 'break-word',
              }}>
                {msg.content}
              </div>

              {/* Timestamp */}
              <span style={{
                fontSize: 9, color: '#AEAEB2', marginTop: 3,
              }}>
                {formatDate(msg.timestamp)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Input area */}
      <div style={{
        display: 'flex', gap: 8, alignItems: 'flex-end',
        background: 'rgba(0,0,0,0.04)', borderRadius: 12, padding: '8px 10px',
        border: '1px solid rgba(0,0,0,0.07)',
      }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Nhắn tin..."
          rows={1}
          style={{
            flex: 1, border: 'none', background: 'transparent', outline: 'none',
            fontSize: 12, color: '#1D1D1F', resize: 'none', lineHeight: 1.5,
            fontFamily: 'inherit', overflow: 'hidden', minHeight: 20, maxHeight: 80,
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          style={{
            width: 30, height: 30, borderRadius: 8, border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed',
            background: input.trim() ? '#000' : 'rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'background 0.15s',
          }}
        >
          {/* Paper plane icon */}
          <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }}>
            <path d="M22 2L11 13" stroke={input.trim() ? 'white' : '#AEAEB2'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke={input.trim() ? 'white' : '#AEAEB2'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <p style={{ fontSize: 9, color: '#AEAEB2', marginTop: 4, textAlign: 'center' }}>
        Enter để gửi · Shift+Enter xuống dòng
      </p>
    </div>
  )
}
