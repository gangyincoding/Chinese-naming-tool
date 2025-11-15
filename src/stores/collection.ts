import { defineStore } from 'pinia'
import type { Name } from '@/types/name'
import { saveToStorage, getFromStorage } from '@/utils/storage'

const COLLECTION_KEY = 'naming_collection'

export const useCollectionStore = defineStore('collection', {
  state: () => ({
    // 收藏的名字列表
    collections: [] as Name[],

    // 对比选中的名字
    comparisonList: [] as Name[]
  }),

  getters: {
    // 是否已收藏
    isCollected: state => (nameId: string) => {
      return state.collections.some(item => item.id === nameId)
    },

    // 收藏数量
    collectionCount: state => state.collections.length,

    // 对比数量
    comparisonCount: state => state.comparisonList.length,

    // 是否在对比列表中
    isInComparison: state => (nameId: string) => {
      return state.comparisonList.some(item => item.id === nameId)
    }
  },

  actions: {
    // 初始化（从localStorage加载）
    init() {
      const data = getFromStorage<Name[]>(COLLECTION_KEY)
      if (data) {
        this.collections = data
      }
    },

    // 添加收藏
    addCollection(name: Name) {
      if (!this.isCollected(name.id)) {
        this.collections.unshift(name)
        this.saveToStorage()
      }
    },

    // 移除收藏
    removeCollection(nameId: string) {
      const index = this.collections.findIndex(item => item.id === nameId)
      if (index > -1) {
        this.collections.splice(index, 1)
        this.saveToStorage()

        // 如果在对比列表中，也要移除
        this.removeFromComparison(nameId)
      }
    },

    // 切换收藏状态
    toggleCollection(name: Name) {
      if (this.isCollected(name.id)) {
        this.removeCollection(name.id)
      } else {
        this.addCollection(name)
      }
    },

    // 清空收藏
    clearCollection() {
      this.collections = []
      this.comparisonList = []
      this.saveToStorage()
    },

    // 添加到对比
    addToComparison(name: Name) {
      if (this.comparisonList.length >= 3) {
        throw new Error('最多只能对比3个名字')
      }
      if (!this.isInComparison(name.id)) {
        this.comparisonList.push(name)
      }
    },

    // 从对比中移除
    removeFromComparison(nameId: string) {
      const index = this.comparisonList.findIndex(item => item.id === nameId)
      if (index > -1) {
        this.comparisonList.splice(index, 1)
      }
    },

    // 清空对比列表
    clearComparison() {
      this.comparisonList = []
    },

    // 保存到localStorage
    saveToStorage() {
      saveToStorage(COLLECTION_KEY, this.collections)
    }
  }
})
