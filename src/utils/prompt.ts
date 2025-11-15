import type { NamingRequest } from '@/types/name'

/**
 * 生成AI提示词
 */
export function generatePrompt(request: NamingRequest): string {
  if (request.mode === 'surname') {
    return generateSurnamePrompt(request)
  } else {
    return generateBaziPrompt(request)
  }
}

/**
 * 按姓氏起名的Prompt
 */
function generateSurnamePrompt(request: NamingRequest): string {
  const { surname, gender, count = 10 } = request

  const genderText = gender === 'male' ? '男孩' : gender === 'female' ? '女孩' : '中性'

  return `
你是一位精通中国古典文学和传统文化的起名大师。请为姓"${surname}"的${genderText}推荐${count}个富有诗意的名字。

【重要要求】：
1. 名字必须真实来源于以下典籍：
   - 《诗经》（国风、小雅、大雅、颂）
   - 《楚辞》（离骚、九歌、九章等）
   - 唐诗（李白、杜甫、王维等名家作品）
   - 宋词（苏轼、辛弃疾、李清照等名家作品）
   - 其他经典：《周易》《论语》《孟子》《老子》等

2. 每个名字必须包含：
   - 准确的典籍出处（书名、篇章名）
   - 完整的原文诗句
   - 详细的寓意解释
   - 每个字的五行属性和字义

3. 名字质量标准：
   - 音韵优美，读起来顺口
   - 寓意美好，富有文化内涵
   - 字形优美，适合书写
   - 避免生僻字，要能在现代使用
   - ${gender === 'male' ? '男孩名字应阳刚大气' : gender === 'female' ? '女孩名字应婉约优雅' : '名字应中性适用'}

【严格的JSON格式输出】：
请直接返回JSON数据，不要有任何其他文字说明。

{
  "names": [
    {
      "givenName": "清照",
      "pinyin": "qīng zhào",
      "source": {
        "book": "诗经·大雅·烝民",
        "chapter": "大雅",
        "verse": "吉甫作颂，穆如清风",
        "interpretation": "美好的诗歌如清风般温和美好"
      },
      "meaning": "名字寓意纯洁明亮，如清风明月般高洁，象征着纯净的心灵和光明的前程",
      "characters": [
        {
          "char": "清",
          "meaning": "清澈、纯洁、清明",
          "wuxing": "水",
          "stroke": 11
        },
        {
          "char": "照",
          "meaning": "照耀、明亮、光明",
          "wuxing": "火",
          "stroke": 13
        }
      ],
      "score": {
        "culture": 5,
        "harmony": 5,
        "wuxing": 4,
        "overall": 95
      }
    }
  ]
}

请确保每个名字都有真实可靠的出处，不要编造典籍或诗句。
`.trim()
}

/**
 * 按八字起名的Prompt
 */
function generateBaziPrompt(request: NamingRequest): string {
  const { surname, gender, bazi, count = 10 } = request

  if (!bazi?.bazi) {
    throw new Error('八字信息不完整')
  }

  const { yearGanZhi, monthGanZhi, dayGanZhi, hourGanZhi, wuxingCount, xiyongshen } = bazi.bazi

  const genderText = gender === 'male' ? '男孩' : gender === 'female' ? '女孩' : '中性'

  // 五行统计文本
  const wuxingText = Object.entries(wuxingCount)
    .map(([wx, count]) => `${wx}:${count}个`)
    .join('，')

  // 喜用神文本
  const xiyongshenText = xiyongshen.join('、')

  return `
你是一位精通中国古典文学、传统文化和五行八字的起名大师。请为姓"${surname}"的${genderText}推荐${count}个名字，需要结合生辰八字。

【生辰八字信息】：
- 年柱：${yearGanZhi}
- 月柱：${monthGanZhi}
- 日柱：${dayGanZhi}
- 时柱：${hourGanZhi}
- 五行统计：${wuxingText}
- 喜用神：${xiyongshenText}

【起名要求】：
1. 五行要求（最重要）：
   - 名字的五行属性必须包含喜用神：${xiyongshenText}
   - 优先选择能补充五行缺失的字
   - 五行之间要相生，避免相克
   - wuxing评分要特别考虑与八字的匹配度

2. 来源要求：
   - 严格来源于《诗经》、《楚辞》、唐诗、宋词等古典文献
   - 必须有明确的典籍出处和原文诗句

3. 名字要求：
   - 音韵优美，寓意美好
   - 适合现代使用，避免生僻字
   - ${gender === 'male' ? '男孩名字应阳刚大气' : gender === 'female' ? '女孩名字应婉约优雅' : '名字应中性适用'}

【严格的JSON格式输出】：
请直接返回JSON数据，格式同上。每个字必须标注正确的五行属性。

请确保名字的五行属性与八字喜用神高度匹配，同时不失文化内涵和美感。
`.trim()
}
