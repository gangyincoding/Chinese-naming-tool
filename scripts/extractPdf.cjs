const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse-fork');

// PDF文件路径
const SHIJING_PDF = path.join(__dirname, '..', '诗经.pdf');
const CHUCI_PDF = path.join(__dirname, '..', '楚辞.pdf');

// 输出JSON文件路径
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data');
const SHIJING_JSON = path.join(OUTPUT_DIR, 'shijing.json');
const CHUCI_JSON = path.join(OUTPUT_DIR, 'chuci.json');

/**
 * 提取PDF文本内容
 */
async function extractPdfText(pdfPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error(`提取PDF失败: ${pdfPath}`, error);
    throw error;
  }
}

/**
 * 解析诗经内容
 * 诗经结构：风、雅、颂，每篇有标题和诗句
 */
function parseShijing(text) {
  const poems = [];

  // 按行分割
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);

  let currentPoem = null;
  let currentContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 简单的规则：如果行很短且没有标点，可能是标题
    // 这个需要根据实际PDF格式调整
    if (line.length < 10 && !line.match(/[，。！？；：""'']/)) {
      // 保存上一首诗
      if (currentPoem && currentContent.length > 0) {
        currentPoem.content = currentContent.join('\n');
        poems.push(currentPoem);
      }

      // 开始新的诗
      currentPoem = {
        title: line,
        content: '',
        category: detectCategory(line),
        keywords: []
      };
      currentContent = [];
    } else if (currentPoem) {
      // 诗句内容
      currentContent.push(line);
    }
  }

  // 保存最后一首诗
  if (currentPoem && currentContent.length > 0) {
    currentPoem.content = currentContent.join('\n');
    poems.push(currentPoem);
  }

  // 提取关键词
  poems.forEach(poem => {
    poem.keywords = extractKeywords(poem.content);
  });

  return {
    name: '诗经',
    description: '中国古代诗歌开端，收录西周至春秋中期诗歌',
    total: poems.length,
    poems: poems
  };
}

/**
 * 解析楚辞内容
 */
function parseChuci(text) {
  const poems = [];

  const lines = text.split('\n').map(line => line.trim()).filter(line => line);

  let currentPoem = null;
  let currentContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 检测标题（楚辞的标题通常包含"·"或较短）
    if (line.length < 10 && !line.match(/[，。！？；：""'']/)) {
      if (currentPoem && currentContent.length > 0) {
        currentPoem.content = currentContent.join('\n');
        poems.push(currentPoem);
      }

      currentPoem = {
        title: line,
        content: '',
        author: detectAuthor(line),
        keywords: []
      };
      currentContent = [];
    } else if (currentPoem) {
      currentContent.push(line);
    }
  }

  if (currentPoem && currentContent.length > 0) {
    currentPoem.content = currentContent.join('\n');
    poems.push(currentPoem);
  }

  poems.forEach(poem => {
    poem.keywords = extractKeywords(poem.content);
  });

  return {
    name: '楚辞',
    description: '战国时期楚国诗歌总集，以屈原作品为主',
    total: poems.length,
    poems: poems
  };
}

/**
 * 检测诗经分类（风、雅、颂）
 */
function detectCategory(title) {
  if (title.includes('风')) return '风';
  if (title.includes('雅')) return '雅';
  if (title.includes('颂')) return '颂';
  return '其他';
}

/**
 * 检测作者
 */
function detectAuthor(title) {
  if (title.includes('离骚') || title.includes('九歌') || title.includes('九章')) {
    return '屈原';
  }
  if (title.includes('九辩')) return '宋玉';
  return '佚名';
}

/**
 * 提取关键词（提取两字词组）
 */
function extractKeywords(content) {
  const keywords = new Set();

  // 移除标点符号
  const cleanContent = content.replace(/[，。！？；：""''、\s]/g, '');

  // 提取两字词组
  for (let i = 0; i < cleanContent.length - 1; i++) {
    const word = cleanContent.substr(i, 2);
    // 过滤一些常见的虚词
    if (!isCommonWord(word)) {
      keywords.add(word);
    }
  }

  return Array.from(keywords).slice(0, 20); // 限制关键词数量
}

/**
 * 判断是否为常见虚词
 */
function isCommonWord(word) {
  const commonWords = ['之乎', '者也', '而已', '以为', '所以', '可以', '不可', '何以'];
  return commonWords.includes(word);
}

/**
 * 主函数
 */
async function main() {
  console.log('开始提取PDF内容...\n');

  try {
    // 确保输出目录存在
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // 提取诗经
    console.log('正在提取《诗经》...');
    const shijingText = await extractPdfText(SHIJING_PDF);
    console.log(`提取到文本长度: ${shijingText.length} 字符`);

    const shijingData = parseShijing(shijingText);
    fs.writeFileSync(SHIJING_JSON, JSON.stringify(shijingData, null, 2), 'utf-8');
    console.log(`✓ 《诗经》提取完成: ${shijingData.total} 篇`);
    console.log(`  保存到: ${SHIJING_JSON}\n`);

    // 提取楚辞
    console.log('正在提取《楚辞》...');
    const chuciText = await extractPdfText(CHUCI_PDF);
    console.log(`提取到文本长度: ${chuciText.length} 字符`);

    const chuciData = parseChuci(chuciText);
    fs.writeFileSync(CHUCI_JSON, JSON.stringify(chuciData, null, 2), 'utf-8');
    console.log(`✓ 《楚辞》提取完成: ${chuciData.total} 篇`);
    console.log(`  保存到: ${CHUCI_JSON}\n`);

    // 输出预览
    console.log('=== 数据预览 ===\n');
    console.log('诗经示例:');
    if (shijingData.poems.length > 0) {
      const sample = shijingData.poems[0];
      console.log(`  标题: ${sample.title}`);
      console.log(`  分类: ${sample.category}`);
      console.log(`  内容预览: ${sample.content.substring(0, 50)}...`);
      console.log(`  关键词: ${sample.keywords.slice(0, 5).join(', ')}\n`);
    }

    console.log('楚辞示例:');
    if (chuciData.poems.length > 0) {
      const sample = chuciData.poems[0];
      console.log(`  标题: ${sample.title}`);
      console.log(`  作者: ${sample.author}`);
      console.log(`  内容预览: ${sample.content.substring(0, 50)}...`);
      console.log(`  关键词: ${sample.keywords.slice(0, 5).join(', ')}\n`);
    }

    console.log('✓ 全部完成！');
    console.log('\n提示: 请检查生成的JSON文件，根据实际PDF格式调整解析规则。');

  } catch (error) {
    console.error('提取失败:', error);
    process.exit(1);
  }
}

main();
