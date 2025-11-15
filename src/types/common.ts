// API响应基础结构
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 分页参数
export interface Pagination {
  page: number
  pageSize: number
  total: number
}

// 加载状态
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// 典籍选项
export interface BookOption {
  value: string
  label: string
  description?: string
}

// 典籍分类
export const BOOK_CATEGORIES: BookOption[] = [
  { value: '诗经', label: '诗经', description: '中国最早的诗歌总集' },
  { value: '楚辞', label: '楚辞', description: '战国时期楚国的诗歌总集' },
  { value: '唐诗', label: '唐诗', description: '唐代诗歌作品' },
  { value: '宋词', label: '宋词', description: '宋代词作' },
  { value: '周易', label: '周易', description: '儒家经典之一' },
  { value: '论语', label: '论语', description: '儒家经典著作' }
]
