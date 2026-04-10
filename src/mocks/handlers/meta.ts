import { http, HttpResponse } from 'msw'

const BASE = 'http://localhost:3000'

// ─── Teams theo đúng cơ cấu hệ thống ─────────────────────────────────────────
export const TEAMS = [
  // NhiLe Team
  { id: 'team-academy',  name: 'Academy',       slug: 'academy',       group: 'NhiLe Team' },
  { id: 'team-admin',    name: 'Admin',          slug: 'admin',         group: 'NhiLe Team' },
  { id: 'team-design',   name: 'Design',         slug: 'design',        group: 'NhiLe Team' },
  { id: 'team-edit',     name: 'Edit',           slug: 'edit',          group: 'NhiLe Team' },
  { id: 'team-hr',       name: 'HR',             slug: 'hr',            group: 'NhiLe Team' },
  { id: 'team-it',       name: 'IT',             slug: 'it',            group: 'NhiLe Team' },
  { id: 'team-ndata',    name: 'N-Data',         slug: 'n-data',        group: 'NhiLe Team' },
  { id: 'team-social',   name: 'Social Content', slug: 'social-content', group: 'NhiLe Team' },
  // N-Education
  { id: 'team-nedu',     name: 'N-Education',    slug: 'n-education',   group: 'N-Education' },
]

// ─── Users trong hệ thống (orderers + designers) ──────────────────────────────
export const SYSTEM_USERS = [
  // Academy
  { id: 'u-ac-1', display_name: 'Minh Tú',    email: 'minhtu@nhile.vn',    role: 'orderer', team_id: 'team-academy', team_name: 'Academy' },
  { id: 'u-ac-2', display_name: 'Hồng Ngọc',  email: 'hongngoc@nhile.vn',  role: 'orderer', team_id: 'team-academy', team_name: 'Academy' },
  // Admin
  { id: 'u-ad-1', display_name: 'Nhi Le',     email: 'nhile@nhile.vn',     role: 'design_leader', team_id: 'team-admin', team_name: 'Admin' },
  { id: 'u-ad-2', display_name: 'Felix',       email: 'felix@nhile.vn',     role: 'orderer', team_id: 'team-admin', team_name: 'Admin' },
  { id: 'u-ad-3', display_name: 'Lan Anh',    email: 'lananh@nhile.vn',    role: 'orderer', team_id: 'team-admin', team_name: 'Admin' },
  // Design
  { id: 'u-de-1', display_name: 'Lê Văn A',   email: 'leva@nhile.vn',      role: 'designer', team_id: 'team-design', team_name: 'Design' },
  { id: 'u-de-2', display_name: 'Trần Thị B', email: 'tranthib@nhile.vn',  role: 'designer', team_id: 'team-design', team_name: 'Design' },
  { id: 'u-de-3', display_name: 'Nguyễn C',   email: 'nguyenc@nhile.vn',   role: 'designer', team_id: 'team-design', team_name: 'Design' },
  // Edit
  { id: 'u-ed-1', display_name: 'Thanh Vân',  email: 'thanhvan@nhile.vn',  role: 'orderer', team_id: 'team-edit', team_name: 'Edit' },
  { id: 'u-ed-2', display_name: 'Bảo Châu',   email: 'baochau@nhile.vn',   role: 'orderer', team_id: 'team-edit', team_name: 'Edit' },
  // HR
  { id: 'u-hr-1', display_name: 'Phương Mai', email: 'phuongmai@nhile.vn', role: 'orderer', team_id: 'team-hr', team_name: 'HR' },
  { id: 'u-hr-2', display_name: 'Thu Hà',     email: 'thuha@nhile.vn',     role: 'orderer', team_id: 'team-hr', team_name: 'HR' },
  // IT
  { id: 'u-it-1', display_name: 'Anh Quốc',   email: 'anhquoc@nhile.vn',   role: 'orderer', team_id: 'team-it', team_name: 'IT' },
  { id: 'u-it-2', display_name: 'Minh Đức',   email: 'minhduc@nhile.vn',   role: 'orderer', team_id: 'team-it', team_name: 'IT' },
  // N-Data
  { id: 'u-nd-1', display_name: 'Quỳnh Anh',  email: 'quynhanh@nhile.vn',  role: 'orderer', team_id: 'team-ndata', team_name: 'N-Data' },
  // Social Content
  { id: 'u-sc-1', display_name: 'Hải Yến',    email: 'haiyen@nhile.vn',    role: 'orderer', team_id: 'team-social', team_name: 'Social Content' },
  { id: 'u-sc-2', display_name: 'Khánh Linh', email: 'khanhlinh@nhile.vn', role: 'orderer', team_id: 'team-social', team_name: 'Social Content' },
  // N-Education
  { id: 'u-ne-1', display_name: 'Thúy Nga',   email: 'thuynga@nhile.vn',   role: 'orderer', team_id: 'team-nedu', team_name: 'N-Education' },
  { id: 'u-ne-2', display_name: 'Văn Khoa',   email: 'vankhoa@nhile.vn',   role: 'orderer', team_id: 'team-nedu', team_name: 'N-Education' },
]

export const metaHandlers = [
  http.get(`${BASE}/api/v1/meta/product-types`, () => {
    return HttpResponse.json([
      {
        id: 'pt-1', name: 'Ảnh Quote / Hình vuông', slug: 'quote-square',
        standard_sizes: [
          { name: 'Instagram Feed', width: 1200, height: 1200, unit: 'px', platform: 'Instagram', platform_color: '#E1306C' },
          { name: 'LinkedIn / Facebook Post', width: 1200, height: 1200, unit: 'px', platform: 'LinkedIn · Facebook', platform_color: '#0A66C2' },
          { name: 'Pinterest Pin', width: 1000, height: 1500, unit: 'px', platform: 'Pinterest', platform_color: '#E60023' },
        ],
      },
      {
        id: 'pt-2', name: 'Banner / Cover', slug: 'banner-cover',
        standard_sizes: [
          { name: 'Facebook Cover', width: 820, height: 360, unit: 'px', platform: 'Facebook', platform_color: '#1877F2' },
          { name: 'YouTube Channel Banner', width: 2560, height: 1440, unit: 'px', platform: 'YouTube', platform_color: '#FF0000' },
          { name: 'LinkedIn Profile Cover', width: 1584, height: 396, unit: 'px', platform: 'LinkedIn', platform_color: '#0A66C2' },
          { name: 'LinkedIn Company Banner', width: 1128, height: 191, unit: 'px', platform: 'LinkedIn', platform_color: '#0A66C2' },
        ],
      },
      {
        id: 'pt-3', name: 'Poster / Dọc', slug: 'poster-doc',
        standard_sizes: [
          { name: 'Instagram Story / Reel / TikTok', width: 1080, height: 1920, unit: 'px', platform: 'Instagram · TikTok', platform_color: '#E1306C' },
          { name: 'Facebook Story', width: 1080, height: 1920, unit: 'px', platform: 'Facebook', platform_color: '#1877F2' },
          { name: 'Pinterest Pin Dọc', width: 1000, height: 1500, unit: 'px', platform: 'Pinterest', platform_color: '#E60023' },
          { name: 'YouTube Shorts', width: 1080, height: 1920, unit: 'px', platform: 'YouTube', platform_color: '#FF0000' },
        ],
      },
      {
        id: 'pt-4', name: 'Thumbnail', slug: 'thumbnail',
        standard_sizes: [
          { name: 'YouTube Thumbnail', width: 1280, height: 720, unit: 'px', platform: 'YouTube', platform_color: '#FF0000' },
          { name: 'Reels Thumbnail (Instagram)', width: 1080, height: 1920, unit: 'px', platform: 'Instagram', platform_color: '#E1306C' },
          { name: 'TikTok Cover', width: 1080, height: 1920, unit: 'px', platform: 'TikTok', platform_color: '#010101' },
          { name: 'Facebook Reels Thumbnail', width: 1080, height: 1920, unit: 'px', platform: 'Facebook', platform_color: '#1877F2' },
        ],
      },
      {
        id: 'pt-5', name: 'Custom / Tuỳ chỉnh', slug: 'custom',
        standard_sizes: [
          { name: 'Custom / Khác', width: null, height: null, unit: null, platform: 'Tuỳ chỉnh kích thước', platform_color: '#6B7280' },
        ],
      },
      {
        id: 'pt-6', name: 'Mailing List', slug: 'mailing-list',
        standard_sizes: [
          { name: 'Header Banner', width: 600, height: 200, unit: 'px', platform: 'Email', platform_color: '#2563EB' },
          { name: 'Full Template', width: 600, height: 1200, unit: 'px', platform: 'Email', platform_color: '#2563EB' },
          { name: 'Section Block', width: 600, height: 400, unit: 'px', platform: 'Email', platform_color: '#2563EB' },
          { name: 'Footer', width: 600, height: 150, unit: 'px', platform: 'Email', platform_color: '#2563EB' },
        ],
      },
    ])
  }),

  http.get(`${BASE}/api/v1/meta/teams`, () => {
    return HttpResponse.json(TEAMS)
  }),

  // Danh sách orderers (không bao gồm designers)
  http.get(`${BASE}/api/v1/users/orderers`, () => {
    const orderers = SYSTEM_USERS.filter(u => u.role !== 'designer')
    return HttpResponse.json(orderers)
  }),

  // Danh sách designers (cho Design Leader assign)
  http.get(`${BASE}/api/v1/users/designers`, () => {
    const designers = SYSTEM_USERS.filter(u => u.role === 'designer')
    return HttpResponse.json(designers)
  }),

  // Current user — role-aware via ?role= query param
  http.get(`${BASE}/api/v1/me`, ({ request }) => {
    const url = new URL(request.url)
    const role = url.searchParams.get('role') ?? 'design_leader'

    const users = {
      design_leader: {
        id: 'u-ad-1', email: 'nhile@nhile.vn', display_name: 'Nhi Le',
        avatar_url: null, role: 'design_leader',
        team: { id: 'team-admin', name: 'Admin', slug: 'admin' }, is_active: true,
      },
      designer: {
        id: 'u-de-1', email: 'leva@nhile.vn', display_name: 'Lê Văn A',
        avatar_url: null, role: 'designer',
        team: { id: 'team-design', name: 'Design', slug: 'design' }, is_active: true,
      },
      orderer: {
        id: 'u-sc-1', email: 'haiyen@nhile.vn', display_name: 'Hải Yến',
        avatar_url: null, role: 'orderer',
        team: { id: 'team-social', name: 'Social Content', slug: 'social-content' }, is_active: true,
      },
    }

    const key = (role as keyof typeof users) in users ? (role as keyof typeof users) : 'design_leader'
    return HttpResponse.json(users[key])
  }),

  http.get(`${BASE}/health`, () => {
    return HttpResponse.json({ status: 'ok' })
  }),
]
