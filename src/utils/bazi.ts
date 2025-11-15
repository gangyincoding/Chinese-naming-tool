import { Lunar, Solar } from 'lunar-javascript'
import type { BaziInfo, BaziResult, WuXingCount } from '@/types/bazi'
import type { WuXing } from '@/types/name'

/**
 * 计算生辰八字
 */
export function calculateBazi(info: BaziInfo): BaziResult {
  // 转换为solar对象
  const solar = Solar.fromYmdHms(info.year, info.month, info.day, info.hour, 0, 0)

  // 获取农历对象
  const lunar = solar.getLunar()

  // 获取八字
  const baziObj = lunar.getEightChar()

  // 年月日时四柱
  const yearGanZhi = baziObj.getYearInGanZhi()
  const monthGanZhi = baziObj.getMonthInGanZhi()
  const dayGanZhi = baziObj.getDayInGanZhi()
  const hourGanZhi = baziObj.getTimeInGanZhi()

  // 计算五行统计
  const wuxingCount = calculateWuXingCount(baziObj)

  // 计算喜用神和忌神
  const { xiyongshen, jinji } = calculateXiYongShen(wuxingCount, info.gender)

  return {
    yearGanZhi,
    monthGanZhi,
    dayGanZhi,
    hourGanZhi,
    wuxingCount,
    xiyongshen,
    jinji
  }
}

/**
 * 统计五行数量
 */
function calculateWuXingCount(baziObj: any): WuXingCount {
  const count: WuXingCount = {
    金: 0,
    木: 0,
    水: 0,
    火: 0,
    土: 0
  }

  // 天干五行映射
  const ganWuXing: Record<string, WuXing> = {
    甲: '木',
    乙: '木',
    丙: '火',
    丁: '火',
    戊: '土',
    己: '土',
    庚: '金',
    辛: '金',
    壬: '水',
    癸: '水'
  }

  // 地支五行映射
  const zhiWuXing: Record<string, WuXing> = {
    子: '水',
    丑: '土',
    寅: '木',
    卯: '木',
    辰: '土',
    巳: '火',
    午: '火',
    未: '土',
    申: '金',
    酉: '金',
    戌: '土',
    亥: '水'
  }

  // 获取八字的天干地支
  const ganList = [
    baziObj.getYearGan(),
    baziObj.getMonthGan(),
    baziObj.getDayGan(),
    baziObj.getTimeGan()
  ]

  const zhiList = [
    baziObj.getYearZhi(),
    baziObj.getMonthZhi(),
    baziObj.getDayZhi(),
    baziObj.getTimeZhi()
  ]

  // 统计天干五行
  ganList.forEach(gan => {
    const wx = ganWuXing[gan]
    if (wx) count[wx]++
  })

  // 统计地支五行
  zhiList.forEach(zhi => {
    const wx = zhiWuXing[zhi]
    if (wx) count[wx]++
  })

  return count
}

/**
 * 计算喜用神和忌神
 */
function calculateXiYongShen(
  wuxingCount: WuXingCount,
  gender: 'male' | 'female'
): { xiyongshen: WuXing[]; jinji: WuXing[] } {
  // 找出最少和最多的五行
  const sorted = Object.entries(wuxingCount).sort((a, b) => a[1] - b[1])

  // 缺失或最少的作为喜用神
  const xiyongshen: WuXing[] = []
  const jinji: WuXing[] = []

  sorted.forEach((item, index) => {
    if (index < 2) {
      xiyongshen.push(item[0] as WuXing)
    } else if (index >= sorted.length - 2) {
      jinji.push(item[0] as WuXing)
    }
  })

  return { xiyongshen, jinji }
}

/**
 * 获取五行相生关系
 */
export function getWuXingSheng(wuxing: WuXing): WuXing {
  const shengMap: Record<WuXing, WuXing> = {
    金: '水',
    水: '木',
    木: '火',
    火: '土',
    土: '金'
  }
  return shengMap[wuxing]
}

/**
 * 获取五行相克关系
 */
export function getWuXingKe(wuxing: WuXing): WuXing {
  const keMap: Record<WuXing, WuXing> = {
    金: '木',
    木: '土',
    土: '水',
    水: '火',
    火: '金'
  }
  return keMap[wuxing]
}

/**
 * 获取时辰选项列表
 */
export function getHourOptions() {
  return [
    { value: 0, label: '子时', timeRange: '23:00-00:59' },
    { value: 1, label: '丑时', timeRange: '01:00-02:59' },
    { value: 3, label: '寅时', timeRange: '03:00-04:59' },
    { value: 5, label: '卯时', timeRange: '05:00-06:59' },
    { value: 7, label: '辰时', timeRange: '07:00-08:59' },
    { value: 9, label: '巳时', timeRange: '09:00-10:59' },
    { value: 11, label: '午时', timeRange: '11:00-12:59' },
    { value: 13, label: '未时', timeRange: '13:00-14:59' },
    { value: 15, label: '申时', timeRange: '15:00-16:59' },
    { value: 17, label: '酉时', timeRange: '17:00-18:59' },
    { value: 19, label: '戌时', timeRange: '19:00-20:59' },
    { value: 21, label: '亥时', timeRange: '21:00-22:59' }
  ]
}
