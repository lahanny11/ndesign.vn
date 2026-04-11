import type { OrderCard as OrderCardType } from '../types/dashboard.types'
import OrderCard from './OrderCard'

interface Props {
  orders: OrderCardType[]
  loading?: boolean
  onTrack: (id: string) => void
  onSelfAssign?: (id: string) => void
  selfAssigningId?: string | null
}

export default function OrderGrid({ orders, loading, onTrack, onSelfAssign, selfAssigningId }: Props) {
  if (loading) return (
    <div className="grid grid-cols-4 gap-2.5">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-[#E4E0EF] h-52 animate-pulse" />
      ))}
    </div>
  )

  if (orders.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 text-[#A89EC0]">
      <svg className="w-10 h-10 stroke-current fill-none stroke-1 mb-3" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
      <p className="text-[13px] font-medium">Không có order nào</p>
    </div>
  )

  return (
    <div className="grid grid-cols-4 gap-2.5 pb-5 items-start">
      {orders.map((order, i) => (
        <OrderCard
          key={order.id}
          order={order}
          onTrack={onTrack}
          index={i}
          onSelfAssign={onSelfAssign}
          selfAssigning={selfAssigningId === order.id}
        />
      ))}
    </div>
  )
}
