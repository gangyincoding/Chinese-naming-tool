import type { WuXing } from './name'

// 生辰八字信息
export interface BaziInfo {
  year: number // 出生年
  month: number // 出生月
  day: number // 出生日
  hour: number // 出生时
  gender: 'male' | 'female' // 性别
  lunar?: LunarDate // 农历日期
  bazi?: BaziResult // 八字结果
}

// 农历日期
export interface LunarDate {
  year: string // 农历年（如：甲子）
  month: string // 农历月
  day: string // 农历日
}

// 八字计算结果
export interface BaziResult {
  yearGanZhi: string // 年柱（如：甲子）
  monthGanZhi: string // 月柱
  dayGanZhi: string // 日柱
  hourGanZhi: string // 时柱
  wuxingCount: WuXingCount // 五行统计
  xiyongshen: WuXing[] // 喜用神
  jinji: WuXing[] // 忌神
}

// 五行统计
export interface WuXingCount {
  金: number
  木: number
  水: number
  火: number
  土: number
}

// 时辰选项
export interface HourOption {
  value: number
  label: string
  timeRange: string
}
