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
        id: 'pt-1', name: 'Social Media', slug: 'social-media',
        standard_sizes: [
          { name: 'Feed Post', width: 1080, height: 1080, unit: 'px' },
          { name: 'Story / Reels', width: 1080, height: 1920, unit: 'px' },
          { name: 'Cover Facebook', width: 820, height: 312, unit: 'px' },
          { name: 'Banner Web', width: 1200, height: 400, unit: 'px' },
        ],
      },
      {
        id: 'pt-2', name: 'LinkedIn', slug: 'linkedin',
        standard_sizes: [
          { name: 'Post', width: 1200, height: 627, unit: 'px' },
          { name: 'Banner Profile', width: 1584, height: 396, unit: 'px' },
        ],
      },
      {
        id: 'pt-3', name: 'YouTube', slug: 'youtube',
        standard_sizes: [
          { name: 'Thumbnail', width: 1280, height: 720, unit: 'px' },
          { name: 'Channel Banner', width: 2560, height: 1440, unit: 'px' },
          { name: 'End Card', width: 1920, height: 1080, unit: 'px' },
        ],
      },
      {
        id: 'pt-4', name: 'Print', slug: 'print',
        standard_sizes: [
          { name: 'A4', width: 210, height: 297, unit: 'mm' },
          { name: 'A3', width: 297, height: 420, unit: 'mm' },
          { name: 'A5', width: 148, height: 210, unit: 'mm' },
          { name: 'Business Card', width: 90, height: 55, unit: 'mm' },
          { name: 'Standee 60×160', width: 600, height: 1600, unit: 'mm' },
        ],
      },
      {
        id: 'pt-5', name: 'Email', slug: 'email',
        standard_sizes: [
          { name: 'Email Header', width: 600, height: 200, unit: 'px' },
          { name: 'Newsletter', width: 600, height: 900, unit: 'px' },
        ],
      },
      {
        id: 'pt-6', name: 'Custom', slug: 'custom',
        standard_sizes: [],
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

  // Current user (mặc định là Nhi Le - design_leader có thể thấy tất cả)
  http.get(`${BASE}/api/v1/me`, () => {
    return HttpResponse.json({
      id: 'u-ad-1',
      email: 'nhile@nhile.vn',
      display_name: 'Nhi Le',
      avatar_url: null,
      role: 'design_leader',
      team: { id: 'team-admin', name: 'Admin', slug: 'admin' },
      is_active: true,
    })
  }),

  http.get(`${BASE}/health`, () => {
    return HttpResponse.json({ status: 'ok' })
  }),
]
