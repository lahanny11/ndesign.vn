import { http, HttpResponse } from 'msw'

const BASE = 'http://localhost:3000'

export const metaHandlers = [
  http.get(`${BASE}/api/v1/meta/product-types`, () => {
    return HttpResponse.json([
      {
        id: 'pt-1',
        name: 'Social Media',
        slug: 'social-media',
        standard_sizes: [
          { name: 'Feed Post', width: 1080, height: 1080, unit: 'px' },
          { name: 'Story', width: 1080, height: 1920, unit: 'px' },
          { name: 'Reels Cover', width: 1080, height: 1080, unit: 'px' },
        ],
      },
      {
        id: 'pt-2',
        name: 'LinkedIn',
        slug: 'linkedin',
        standard_sizes: [
          { name: 'Post', width: 1200, height: 627, unit: 'px' },
          { name: 'Banner', width: 1584, height: 396, unit: 'px' },
        ],
      },
      {
        id: 'pt-3',
        name: 'YouTube',
        slug: 'youtube',
        standard_sizes: [
          { name: 'Thumbnail', width: 1280, height: 720, unit: 'px' },
          { name: 'Banner', width: 2560, height: 1440, unit: 'px' },
        ],
      },
      {
        id: 'pt-4',
        name: 'Print',
        slug: 'print',
        standard_sizes: [
          { name: 'A4', width: 210, height: 297, unit: 'mm' },
          { name: 'A3', width: 297, height: 420, unit: 'mm' },
          { name: 'Business Card', width: 90, height: 55, unit: 'mm' },
        ],
      },
      {
        id: 'pt-5',
        name: 'Email',
        slug: 'email',
        standard_sizes: [
          { name: 'Email Header', width: 600, height: 200, unit: 'px' },
          { name: 'Newsletter', width: 600, height: 900, unit: 'px' },
        ],
      },
      {
        id: 'pt-6',
        name: 'Custom',
        slug: 'custom',
        standard_sizes: [],
      },
    ])
  }),

  http.get(`${BASE}/api/v1/meta/teams`, () => {
    return HttpResponse.json([
      { id: 'team-1', name: 'Admin Nhile', slug: 'admin-nhile' },
      { id: 'team-2', name: 'Nedu', slug: 'nedu' },
      { id: 'team-3', name: 'Edit', slug: 'edit' },
      { id: 'team-4', name: 'IT', slug: 'it' },
      { id: 'team-5', name: 'Ms Nhi', slug: 'ms-nhi' },
      { id: 'team-6', name: 'Content', slug: 'content' },
      { id: 'team-7', name: 'NLT', slug: 'nlt' },
    ])
  }),

  http.get(`${BASE}/api/v1/me`, () => {
    return HttpResponse.json({
      id: 'user-test-1',
      email: 'test@nhileholdings.com',
      display_name: 'Nhi Le',
      avatar_url: null,
      role: 'design_leader',
      team: { id: 'team-1', name: 'Admin Nhile', slug: 'admin-nhile' },
      is_active: true,
    })
  }),

  http.get(`${BASE}/health`, () => {
    return HttpResponse.json({ status: 'ok' })
  }),
]
