/**
 * LocalStorage封装工具
 */

/**
 * 保存数据到localStorage
 */
export function saveToStorage<T>(key: string, data: T): void {
  try {
    const jsonStr = JSON.stringify(data)
    localStorage.setItem(key, jsonStr)
  } catch (error) {
    console.error('保存到localStorage失败:', error)
  }
}

/**
 * 从localStorage读取数据
 */
export function getFromStorage<T>(key: string): T | null {
  try {
    const jsonStr = localStorage.getItem(key)
    if (!jsonStr) return null
    return JSON.parse(jsonStr) as T
  } catch (error) {
    console.error('从localStorage读取失败:', error)
    return null
  }
}

/**
 * 从localStorage删除数据
 */
export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('从localStorage删除失败:', error)
  }
}

/**
 * 清空localStorage
 */
export function clearStorage(): void {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('清空localStorage失败:', error)
  }
}
