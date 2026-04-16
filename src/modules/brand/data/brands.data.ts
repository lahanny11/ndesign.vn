export interface BrandColor {
  hex: string
  name: string
  border?: boolean
}

export interface BrandFont {
  name: string
  usage: string
  weight: string
  googleFont: string | null
}

export interface Brand {
  id: string
  name: string
  tagline: string
  founded: string
  description: string
  mascot: string | null
  note?: string
  primaryColors: BrandColor[]
  secondaryColors: BrandColor[]
  fonts: BrandFont[]
  accentColor: string
  bgColor: string
}

export const BRANDS: Brand[] = [
  {
    id: 'nhile-team',
    name: 'NhiLe Team',
    tagline: 'Tâm · Tầm · Đức',
    founded: '08/07/2022',
    description: 'Cộng đồng người Việt chuyên nghiệp — chia sẻ kiến thức thiết kế, marketing, business và thương hiệu cá nhân.',
    mascot: 'Bé Măng',
    primaryColors: [
      { hex: '#dd0023', name: 'Đỏ chủ đạo' },
      { hex: '#000000', name: 'Đen' },
      { hex: '#ffffff', name: 'Trắng', border: true },
    ],
    secondaryColors: [
      { hex: '#660013', name: 'Mận chín' },
      { hex: '#993344', name: 'Đỏ khói' },
      { hex: '#b3666F', name: 'Xám đỏ' },
      { hex: '#FAF3F3', name: 'Kem', border: true },
      { hex: '#F4E3C3', name: 'Beige sáng', border: true },
      { hex: '#B3001C', name: 'Đỏ đậm' },
      { hex: '#4D4D4D', name: 'Xám vừa' },
      { hex: '#FF3B30', name: 'Đỏ cam' },
      { hex: '#F2F1E8', name: 'Off White', border: true },
      { hex: '#E6B6BB', name: 'Be hồng tro', border: true },
      { hex: '#FFE5E3', name: 'Hồng nude lạnh', border: true },
      { hex: '#666063', name: 'Xám ánh đỏ' },
    ],
    fonts: [
      { name: 'Anton', usage: 'Tiêu đề chính', weight: '700', googleFont: 'Anton' },
      { name: 'Helvetica Neue', usage: 'Nội dung, body text', weight: '400/700', googleFont: null },
    ],
    accentColor: '#dd0023',
    bgColor: '#E4E2DD',
  },
  {
    id: 'nhile-foundation',
    name: 'NhiLe Foundation',
    tagline: 'Vì mọi đứa trẻ đều xứng đáng được ước mơ',
    founded: '07/12/2021',
    description: 'Quỹ phi lợi nhuận xây trường học cho trẻ em Việt Nam — đồng hành cùng các em trên hành trình tự tin.',
    mascot: 'Mascot Kiến',
    primaryColors: [
      { hex: '#FFFCDC', name: 'Kem nhạt', border: true },
      { hex: '#C7EC83', name: 'Xanh lá nhạt', border: true },
      { hex: '#D00B00', name: 'Đỏ đậm' },
    ],
    secondaryColors: [
      { hex: '#FFA541', name: 'Cam' },
      { hex: '#9FCA53', name: 'Xanh lá' },
      { hex: '#FF4800', name: 'Cam đỏ' },
      { hex: '#FFD200', name: 'Vàng' },
      { hex: '#04998F', name: 'Teal' },
      { hex: '#FFD3AF', name: 'Peach', border: true },
    ],
    fonts: [
      { name: 'DFVN Gochi Hand', usage: 'Font chủ đạo — thân thiện, trẻ em', weight: '400', googleFont: null },
    ],
    accentColor: '#D00B00',
    bgColor: '#FFF8E7',
  },
  {
    id: 'nhi-le',
    name: 'Nhi Le',
    tagline: 'Hiểu · Yêu · Lãnh đạo chính mình',
    founded: 'Thương hiệu cá nhân',
    description: 'Thương hiệu cá nhân của founder — tập trung vào Leadership, Nuôi dạy con, và Nghệ nhân Việt Nam.',
    mascot: null,
    note: 'Updated 2026 — Playbook v1.0',
    primaryColors: [
      { hex: '#1A1A1A', name: 'Đen sâu (Template A)' },
      { hex: '#6B1010', name: 'Crimson sẫm (Template B)' },
      { hex: '#F8F4EE', name: 'Warm cream (Template C)', border: true },
    ],
    secondaryColors: [
      { hex: '#8B1A1A', name: 'Crimson accent' },
      { hex: '#E8C070', name: 'Gold — label & accent' },
      { hex: '#B7860B', name: 'Gold label (Template C)' },
      { hex: '#FFFFFF', name: 'Trắng text', border: true },
    ],
    fonts: [
      { name: 'Playfair Display', usage: 'Tiêu đề, quote — Bold 38–44pt', weight: '400/700', googleFont: 'Playfair+Display' },
      { name: 'DM Sans', usage: 'Label uppercase, body — 14–16pt', weight: '400/700', googleFont: 'DM+Sans' },
    ],
    accentColor: '#8B1A1A',
    bgColor: '#F2F0EC',
  },
  {
    id: 'spice-nice',
    name: 'Spice & Nice',
    tagline: 'Táo bạo · Quyến rũ · Tự do',
    founded: '14/09/2021',
    description: 'Nơi hai cô nàng Anne & Denise truyền cảm hứng cho phụ nữ phát triển bản thân, tự do tài chính.',
    mascot: null,
    primaryColors: [
      { hex: '#FFDB9D', name: 'Vàng nhạt', border: true },
      { hex: '#DD79FF', name: 'Tím sáng' },
      { hex: '#FFBC00', name: 'Vàng cam' },
    ],
    secondaryColors: [
      { hex: '#F35000', name: 'Đỏ cam' },
      { hex: '#F7B8D2', name: 'Hồng pastel', border: true },
      { hex: '#ffffff', name: 'White', border: true },
    ],
    fonts: [
      { name: 'Bold display', usage: 'Spice — mạnh mẽ, sắc nét', weight: '800', googleFont: null },
      { name: 'Thanh thoát', usage: 'Nice — nhẹ nhàng', weight: '300', googleFont: null },
    ],
    accentColor: '#DD79FF',
    bgColor: '#1A0A2E',
  },
  {
    id: 'n-education',
    name: 'N-Education',
    tagline: 'Người Việt · Làm hàng Việt · Cho người Việt',
    founded: '2023',
    description: 'Nền tảng phát triển bản thân và đào tạo lãnh đạo — trao quyền cho các nhà lãnh đạo Việt Nam.',
    mascot: null,
    primaryColors: [
      { hex: '#F8B516', name: 'Golden Yellow' },
      { hex: '#B16A1E', name: 'Burnt Orange' },
      { hex: '#994C1F', name: 'Rust Brown' },
      { hex: '#F47B20', name: 'Orange Vibrant' },
    ],
    secondaryColors: [
      { hex: '#5A5A5C', name: 'Dark Gray' },
      { hex: '#FFFFFF', name: 'Pure White', border: true },
      { hex: '#A1A1A1', name: 'Ash Gray', border: true },
      { hex: '#4F4F4F', name: 'Neutral Gray' },
    ],
    fonts: [
      { name: 'Inter Black', usage: 'Tiêu đề chính', weight: '900', googleFont: 'Inter' },
      { name: 'Montserrat', usage: 'Body text', weight: '400/700', googleFont: 'Montserrat' },
    ],
    accentColor: '#F8B516',
    bgColor: '#1A1008',
  },
  {
    id: 'ms-nhi-podcast',
    name: 'Ms Nhi Podcast',
    tagline: 'We can learn from anyone and everyone',
    founded: 'YouTube: 05/10/2021 · Fanpage: 18/11/2021',
    description: 'Kênh podcast song ngữ Việt–Anh phỏng vấn khách mời từ nhiều ngành nghề. Gồm 3 nhánh: Ms Nhi Podcast, Peaceful Soul (nghệ nhân Việt), BlackPink Leader Series.',
    mascot: null,
    note: 'Brand riêng — Ms Nhi Podcast 2026',
    primaryColors: [
      { hex: '#8d131a', name: 'Đỏ chủ đạo Ms Nhi' },
      { hex: '#000000', name: 'Đen' },
      { hex: '#ffffff', name: 'Trắng', border: true },
    ],
    secondaryColors: [
      { hex: '#da1c67', name: 'Pink — BlackPink Leader' },
      { hex: '#F2F0EC', name: 'Nền kem', border: true },
    ],
    fonts: [
      { name: 'Oswald', usage: 'Video edit — Short & Long video, subtitle', weight: 'Light/Regular/Bold', googleFont: 'Oswald' },
    ],
    accentColor: '#8d131a',
    bgColor: '#0D0506',
  },
]
