import type { BaziInfo } from './bazi'

// 五行枚举
export type WuXing = '金' | '木' | '水' | '火' | '土'

// 性别类型
export type Gender = 'male' | 'female' | 'neutral'

// 名字基本信息
export interface Name {
  id: string
  surname: string // 姓氏
  givenName: string // 名
  fullName: string // 全名
  pinyin: string // 拼音
  source: NameSource // 出处
  meaning: string // 寓意
  characters: Character[] // 字符详情
  score: NameScore // 评分
  createdAt: number // 生成时间
}

// 典籍来源
export interface NameSource {
  book: string // 典籍名称
  chapter?: string // 章节
  verse: string // 原文诗句
  interpretation: string // 诗句释义
}

// 单个字的信息
export interface Character {
  char: string // 汉字
  meaning: string // 字义
  wuxing: WuXing // 五行属性
  stroke: number // 笔画数
}

// 名字评分
export interface NameScore {
  culture: number // 文化底蕴 (1-5)
  harmony: number // 音韵和谐 (1-5)
  wuxing: number // 五行匹配 (1-5)
  overall: number // 综合评分 (0-100)
}

// 起名模式
export type NamingMode = 'surname' | 'bazi'

// 起名请求参数
export interface NamingRequest {
  mode: NamingMode // 起名模式
  surname: string // 姓氏
  gender?: Gender // 性别
  bazi?: BaziInfo // 八字信息（八字模式）
  count?: number // 生成数量，默认10
  filter?: NamingFilter // 筛选条件
}

// 筛选条件
export interface NamingFilter {
  source?: string[] // 典籍来源
  wuxing?: WuXing[] // 五行属性
  charCount?: 1 | 2 // 名字字数
  gender?: Gender // 性别倾向
}

// 排序方式
export type SortType = 'overall' | 'culture' | 'harmony' | 'wuxing'
