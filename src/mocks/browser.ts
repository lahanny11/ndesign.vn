import { setupWorker } from 'msw/browser'
import { metaHandlers } from './handlers/meta'
import { dashboardHandlers } from './handlers/dashboard'
import { orderHandlers } from './handlers/orders'
import { analyticsHandlers } from './handlers/analytics'

// Delivery handlers đã được merge vào dashboardHandlers
export const worker = setupWorker(
  ...metaHandlers,
  ...dashboardHandlers,
  ...orderHandlers,
  ...analyticsHandlers,
)
