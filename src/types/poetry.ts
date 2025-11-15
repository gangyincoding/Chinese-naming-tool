// 诗经和楚辞数据类型定义

/**
 * 诗经诗篇
 */
export interface ShijingPoem {
  /** 篇名 */
  title: string;
  /** 章节（风、雅、颂） */
  chapter: string;
  /** 分类（周南、召南、秦风等） */
  section: string;
  /** 诗歌内容 */
  content: string;
  /** 关键词（适合起名的双字词） */
  keywords: string[];
}

/**
 * 诗经数据集
 */
export interface ShijingData {
  /** 名称 */
  name: string;
  /** 描述 */
  description: string;
  /** 总篇数 */
  total: number;
  /** 诗篇列表 */
  poems: ShijingPoem[];
}

/**
 * 楚辞诗篇
 */
export interface ChuciPoem {
  /** 篇名 */
  title: string;
  /** 作者 */
  author: string;
  /** 章节分类 */
  section: string;
  /** 诗歌内容 */
  content: string;
  /** 关键词（适合起名的双字词） */
  keywords: string[];
}

/**
 * 楚辞数据集
 */
export interface ChuciData {
  /** 名称 */
  name: string;
  /** 描述 */
  description: string;
  /** 总篇数 */
  total: number;
  /** 诗篇列表 */
  poems: ChuciPoem[];
}

/**
 * 起名来源类型
 */
export type NameSource = '诗经' | '楚辞' | '唐诗' | '宋词' | '论语' | '周易';

/**
 * 起名结果
 */
export interface NameResult {
  /** 名字（双字） */
  name: string;
  /** 来源 */
  source: NameSource;
  /** 诗句/原文 */
  quote: string;
  /** 出处（篇名、作者等） */
  origin: string;
  /** 寓意 */
  meaning?: string;
}
