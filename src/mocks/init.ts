// src/mocks/init.ts
export async function enableMocking() {
  // Hỗ trợ cả NEXT_PUBLIC_ (Next.js) và VITE_ (Vite)
  const enabled =
    process.env.NEXT_PUBLIC_ENABLE_MOCKING === 'true' ||
    (typeof import.meta !== 'undefined' &&
      (import.meta as { env?: Record<string, string> }).env?.VITE_ENABLE_MOCKING === 'true')
  if (!enabled) return
  const { worker } = await import('./browser')
  return worker.start({ onUnhandledRequest: 'bypass' })
}
