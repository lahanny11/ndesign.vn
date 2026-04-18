// src/mocks/browser.ts
import { setupWorker } from 'msw/browser'
import { authHandlers }         from './handlers/auth'
import { orderHandlers }        from './handlers/orders'
import { moodboardHandlers }    from './handlers/moodboards'
import { checkinHandlers }      from './handlers/checkins'
import { deliveryHandlers }     from './handlers/deliveries'
import { feedbackHandlers }     from './handlers/feedbacks'
import { flagHandlers }         from './handlers/flags'
import { dashboardHandlers }    from './handlers/dashboard'
import { metaHandlers }         from './handlers/meta'
import { userHandlers }         from './handlers/users'
import { leaveHandlers }        from './handlers/leaves'
import { designerHandlers }     from './handlers/designers'
import { analyticsHandlers }    from './handlers/analytics'
import { mediaHandlers }        from './handlers/media'
import { notificationHandlers } from './handlers/notifications'
import { milestoneHandlers }    from './handlers/milestones'

export const worker = setupWorker(
  ...authHandlers,
  ...orderHandlers,
  ...moodboardHandlers,
  ...checkinHandlers,
  ...deliveryHandlers,
  ...feedbackHandlers,
  ...flagHandlers,
  ...dashboardHandlers,
  ...metaHandlers,
  ...userHandlers,
  ...leaveHandlers,
  ...designerHandlers,
  ...analyticsHandlers,
  ...mediaHandlers,
  ...notificationHandlers,
  ...milestoneHandlers,
)
