// src/mocks/handlers/meta.ts
import { http, HttpResponse } from 'msw'
import { getCurrentMockUserId, unauthorized } from '../config'

const MOCK_PRODUCT_TYPES = [
  {
    id: 'pt-quote-square', group_name: 'Ảnh Quote / Hình vuông', group_icon: '📐', allows_custom: false,
    sizes: [
      { id: 'sz-ig-feed',  label: 'Instagram Feed',           dimensions: '1200 × 1200 px', platforms: ['Instagram'] },
      { id: 'sz-li-fb',    label: 'LinkedIn / Facebook Post',  dimensions: '1200 × 1200 px', platforms: ['LinkedIn', 'Facebook'] },
      { id: 'sz-pinterest',label: 'Pinterest Pin',             dimensions: '1000 × 1500 px', platforms: ['Pinterest'] },
    ],
  },
  {
    id: 'pt-banner-cover', group_name: 'Banner / Cover', group_icon: '🖼', allows_custom: false,
    sizes: [
      { id: 'sz-fb-cover', label: 'Facebook Cover',    dimensions: '1640 × 924 px',   platforms: ['Facebook'] },
      { id: 'sz-yt-banner',label: 'YouTube Banner',     dimensions: '2560 × 1440 px',  platforms: ['YouTube'] },
    ],
  },
  {
    id: 'pt-poster', group_name: 'Poster / Dọc', group_icon: '📜', allows_custom: false,
    sizes: [
      { id: 'sz-poster-a3', label: 'Poster Dọc A3',       dimensions: '297 × 420 mm',   platforms: ['Print'] },
      { id: 'sz-ig-story',  label: 'Instagram Story',      dimensions: '1080 × 1920 px', platforms: ['Instagram'] },
    ],
  },
  {
    id: 'pt-thumbnail', group_name: 'Thumbnail', group_icon: '🎬', allows_custom: false,
    sizes: [
      { id: 'sz-yt-thumb', label: 'YouTube Thumbnail', dimensions: '1280 × 720 px', platforms: ['YouTube'] },
    ],
  },
  {
    id: 'pt-mailing', group_name: 'Mailing List', group_icon: '📧', allows_custom: false,
    sizes: [
      { id: 'sz-email-header', label: 'Email Header', dimensions: '600 × 200 px', platforms: ['Email'] },
    ],
  },
  {
    id: 'pt-custom', group_name: 'Custom / Tuỳ chỉnh', group_icon: '⚙', allows_custom: true, sizes: [],
  },
]

export const metaHandlers = [
  http.get('*/api/meta/product-types', async () => {
    const id = await getCurrentMockUserId()
    if (!id) return unauthorized()
    return HttpResponse.json({ data: MOCK_PRODUCT_TYPES })
  }),

  // Legacy v1
  http.get('*/api/v1/meta/product-types', async () => {
    const id = await getCurrentMockUserId()
    if (!id) return unauthorized()
    return HttpResponse.json({ data: MOCK_PRODUCT_TYPES })
  }),
  http.get('*/api/v1/meta/teams', () => {
    return HttpResponse.json([
      { id: 'team-academy', name: 'Academy',       slug: 'academy' },
      { id: 'team-admin',   name: 'Admin',          slug: 'admin' },
      { id: 'team-design',  name: 'Design',         slug: 'design' },
      { id: 'team-edit',    name: 'Edit',           slug: 'edit' },
      { id: 'team-hr',      name: 'HR',             slug: 'hr' },
      { id: 'team-it',      name: 'IT',             slug: 'it' },
      { id: 'team-ndata',   name: 'N-Data',         slug: 'n-data' },
      { id: 'team-social',  name: 'Social Content', slug: 'social-content' },
      { id: 'team-nedu',    name: 'N-Education',    slug: 'n-education' },
    ])
  }),
  http.get('*/api/v1/me', async ({ request }) => {
    const id = await getCurrentMockUserId()
    if (!id) return unauthorized()
    const url  = new URL(request.url)
    const role = url.searchParams.get('role') ?? 'design_leader'
    const users: Record<string, object> = {
      design_leader: { id, email: 'design-leader-01@ndesign.nquoc.vn', display_name: 'Design Leader 01', role: 'design_leader', team: { id: 'team-design', name: 'Design', slug: 'design' }, is_active: true },
      co_leader:     { id, email: 'co-leader-01@ndesign.nquoc.vn',     display_name: 'Co-Leader 01',     role: 'co_leader',     team: { id: 'team-design', name: 'Design', slug: 'design' }, is_active: true },
      designer:      { id, email: 'designer-01@ndesign.nquoc.vn',      display_name: 'Designer 01',      role: 'designer',      team: { id: 'team-design', name: 'Design', slug: 'design' }, is_active: true },
      orderer:       { id, email: 'orderer-01@ndesign.nquoc.vn',       display_name: 'Orderer 01',       role: 'orderer',       team: { id: 'team-it',     name: 'IT',     slug: 'it'     }, is_active: true },
    }
    return HttpResponse.json(users[role] ?? users['design_leader'])
  }),
  http.get('*/api/v1/users/designers', async () => {
    const id = await getCurrentMockUserId()
    if (!id) return unauthorized()
    return HttpResponse.json([
      { id: 'u-de-1', display_name: 'Lê Văn A',   role: 'designer', team_id: 'team-design' },
      { id: 'u-de-2', display_name: 'Trần Thị B', role: 'designer', team_id: 'team-design' },
      { id: 'u-de-3', display_name: 'Nguyễn C',   role: 'designer', team_id: 'team-design' },
    ])
  }),
  http.get('*/api/v1/users/orderers', async () => {
    const id = await getCurrentMockUserId()
    if (!id) return unauthorized()
    return HttpResponse.json([])
  }),
  http.get('*/health', () => HttpResponse.json({ status: 'ok' })),
]
