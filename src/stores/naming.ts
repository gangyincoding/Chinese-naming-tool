import { defineStore } from 'pinia'
import type { Name, NamingRequest, NamingFilter, SortType } from '@/types/name'
import { generateNamesWithRetry } from '@/api/ai'

export const useNamingStore = defineStore('naming', {
  state: () => ({
    // 当前模式
    mode: 'surname' as 'surname' | 'bazi',

    // 起名请求参数
    request: null as NamingRequest | null,

    // 生成的名字列表
    names: [] as Name[],

    // 加载状态
    loading: false,

    // 错误信息
    error: null as string | null,

    // 当前查看的名字
    currentName: null as Name | null,

    // 筛选条件
    filter: null as NamingFilter | null,

    // 排序方式
    sortType: 'overall' as SortType
  }),

  getters: {
    // 过滤后的名字列表
    filteredNames: state => {
      let result = [...state.names]

      if (state.filter) {
        const filter = state.filter

        // 按典籍来源筛选
        if (filter.source && filter.source.length > 0) {
          result = result.filter(name => filter.source?.includes(name.source.book))
        }

        // 按五行筛选
        if (filter.wuxing && filter.wuxing.length > 0) {
          result = result.filter(name =>
            name.characters.some(char => filter.wuxing?.includes(char.wuxing))
          )
        }

        // 按字数筛选
        if (filter.charCount) {
          result = result.filter(name => name.givenName.length === filter.charCount)
        }
      }

      return result
    },

    // 排序后的名字列表
    sortedNames: state => {
      const list = state.filteredNames || state.names
      const sortType = state.sortType

      return [...list].sort((a, b) => {
        switch (sortType) {
          case 'overall':
            return b.score.overall - a.score.overall
          case 'culture':
            return b.score.culture - a.score.culture
          case 'harmony':
            return b.score.harmony - a.score.harmony
          case 'wuxing':
            return b.score.wuxing - a.score.wuxing
          default:
            return 0
        }
      })
    },

    // 名字数量
    nameCount: state => state.names.length
  },

  actions: {
    // 生成名字
    async generateNames(request: NamingRequest) {
      this.loading = true
      this.error = null
      this.request = request
      this.mode = request.mode

      try {
        this.names = await generateNamesWithRetry(request)
      } catch (err: any) {
        this.error = err.message || '生成失败'
        throw err
      } finally {
        this.loading = false
      }
    },

    // 查看名字详情
    viewName(name: Name) {
      this.currentName = name
    },

    // 关闭名字详情
    closeNameDetail() {
      this.currentName = null
    },

    // 清空名字列表
    clearNames() {
      this.names = []
      this.currentName = null
      this.filter = null
      this.error = null
    },

    // 更新筛选条件
    updateFilter(filter: NamingFilter) {
      this.filter = { ...this.filter, ...filter }
    },

    // 清空筛选
    clearFilter() {
      this.filter = null
    },

    // 更新排序方式
    updateSortType(sortType: SortType) {
      this.sortType = sortType
    }
  }
})
