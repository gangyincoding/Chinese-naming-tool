import type { ShijingData, ChuciData, NameResult } from '@/types/poetry';
import shijingData from '@/data/shijing.json';
import chuciData from '@/data/chuci.json';

/**
 * 诗经楚辞起名工具类
 */
export class PoetryNaming {
  private shijing: ShijingData;
  private chuci: ChuciData;

  constructor() {
    this.shijing = shijingData as ShijingData;
    this.chuci = chuciData as ChuciData;
  }

  /**
   * 从诗经中搜索起名
   * @param keyword 关键字（可选）
   * @param limit 返回数量限制
   */
  searchFromShijing(keyword?: string, limit: number = 10): NameResult[] {
    const results: NameResult[] = [];

    for (const poem of this.shijing.poems) {
      // 如果有关键字，筛选包含关键字的诗篇
      if (keyword && !poem.content.includes(keyword) && !poem.keywords.includes(keyword)) {
        continue;
      }

      // 从关键词中选取适合的名字
      for (const name of poem.keywords) {
        if (results.length >= limit) {
          return results;
        }

        results.push({
          name,
          source: '诗经',
          quote: this.extractQuote(poem.content, name),
          origin: `《诗经·${poem.chapter}·${poem.section}·${poem.title}》`
        });
      }
    }

    return results;
  }

  /**
   * 从楚辞中搜索起名
   * @param keyword 关键字（可选）
   * @param limit 返回数量限制
   */
  searchFromChuci(keyword?: string, limit: number = 10): NameResult[] {
    const results: NameResult[] = [];

    for (const poem of this.chuci.poems) {
      // 如果有关键字，筛选包含关键字的诗篇
      if (keyword && !poem.content.includes(keyword) && !poem.keywords.includes(keyword)) {
        continue;
      }

      // 从关键词中选取适合的名字
      for (const name of poem.keywords) {
        if (results.length >= limit) {
          return results;
        }

        results.push({
          name,
          source: '楚辞',
          quote: this.extractQuote(poem.content, name),
          origin: `《楚辞·${poem.section}·${poem.title}》 ${poem.author}`
        });
      }
    }

    return results;
  }

  /**
   * 根据性别推荐名字
   * 传统：男楚辞，女诗经
   * @param gender 性别：male | female
   * @param keyword 关键字（可选）
   * @param limit 返回数量限制
   */
  searchByGender(gender: 'male' | 'female', keyword?: string, limit: number = 10): NameResult[] {
    if (gender === 'female') {
      return this.searchFromShijing(keyword, limit);
    } else {
      return this.searchFromChuci(keyword, limit);
    }
  }

  /**
   * 综合搜索（诗经+楚辞）
   * @param keyword 关键字（可选）
   * @param limit 返回数量限制
   */
  searchAll(keyword?: string, limit: number = 20): NameResult[] {
    const shijingResults = this.searchFromShijing(keyword, Math.ceil(limit / 2));
    const chuciResults = this.searchFromChuci(keyword, Math.floor(limit / 2));

    return [...shijingResults, ...chuciResults];
  }

  /**
   * 从诗句中提取包含名字的句子
   * @param content 诗歌内容
   * @param name 名字
   */
  private extractQuote(content: string, name: string): string {
    const lines = content.split('\n');

    for (const line of lines) {
      if (line.includes(name)) {
        return line.trim();
      }
    }

    // 如果没找到，返回第一句
    return lines[0] || '';
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      shijing: {
        name: this.shijing.name,
        description: this.shijing.description,
        total: this.shijing.total
      },
      chuci: {
        name: this.chuci.name,
        description: this.chuci.description,
        total: this.chuci.total
      }
    };
  }
}

// 导出单例
export const poetryNaming = new PoetryNaming();

/**
 * 使用示例：
 *
 * import { poetryNaming } from '@/utils/poetryNaming';
 *
 * // 从诗经搜索
 * const shijingNames = poetryNaming.searchFromShijing('君子', 5);
 *
 * // 从楚辞搜索
 * const chuciNames = poetryNaming.searchFromChuci('芳', 5);
 *
 * // 根据性别搜索
 * const femaleNames = poetryNaming.searchByGender('female', '美', 10);
 * const maleNames = poetryNaming.searchByGender('male', '云', 10);
 *
 * // 综合搜索
 * const allNames = poetryNaming.searchAll('清', 20);
 *
 * // 获取统计信息
 * const stats = poetryNaming.getStats();
 * console.log(stats);
 */
