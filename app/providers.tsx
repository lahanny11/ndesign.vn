'use client'

import { useEffect, useRef } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/shared/config/query-client'

export default function Providers({ children }: { children: React.ReactNode }) {
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const isDev     = process.env.NODE_ENV !== 'production'
    const isBypass  = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true'
    const isMocking = process.env.NEXT_PUBLIC_ENABLE_MOCKING === 'true'

    if (isDev || isBypass || isMocking) {
      import('@/mocks/browser')
        .then(({ worker }) => {
          worker.start({ onUnhandledRequest: 'bypass' }).then(() => {
            console.log('[MSW] Mocking enabled.', worker.listHandlers().length, 'handlers')
          })
        })
        .catch(err => console.error('[MSW] Failed to load browser mock:', err))
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
