const fs = require('fs');
const path = require('path');
const https = require('https');

// GitHub raw 文件 URL
const SHIJING_URL = 'https://raw.githubusercontent.com/chinese-poetry/chinese-poetry/master/shijing/shijing.json';
const CHUCI_URL = 'https://raw.githubusercontent.com/chinese-poetry/chinese-poetry/master/chuci/chuci.json';

// 输出目录
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data');
const SHIJING_OUTPUT = path.join(OUTPUT_DIR, 'shijing.json');
const CHUCI_OUTPUT = path.join(OUTPUT_DIR, 'chuci.json');

/**
 * 下载文件
 */
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    console.log(`正在下载: ${url}`);

    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // 处理重定向
        return downloadFile(response.headers.location, outputPath)
          .then(resolve)
          .catch(reject);
      }

      if (response.statusCode !== 200) {
        reject(new Error(`下载失败，状态码: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(outputPath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✓ 下载完成: ${outputPath}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(outputPath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * 转换数据格式为适合起名的格式
 */
function transformShijingData(data) {
  const poems = Array.isArray(data) ? data : [];

  return {
    name: '诗经',
    description: '中国古代诗歌开端，收录西周至春秋中期诗歌',
    total: poems.length,
    poems: poems.map(poem => ({
      title: poem.title || '',
      chapter: poem.chapter || '',
      section: poem.section || '',
      content: Array.isArray(poem.content) ? poem.content.join('\n') : poem.content || '',
      keywords: extractKeywords(Array.isArray(poem.content) ? poem.content.join('') : poem.content || '')
    }))
  };
}

/**
 * 转换楚辞数据格式
 */
function transformChuciData(data) {
  const poems = Array.isArray(data) ? data : [];

  return {
    name: '楚辞',
    description: '战国时期楚国诗歌总集，以屈原作品为主',
    total: poems.length,
    poems: poems.map(poem => ({
      title: poem.title || '',
      author: poem.author || '佚名',
      section: poem.section || '',
      content: Array.isArray(poem.content) ? poem.content.join('\n') : poem.content || '',
      keywords: extractKeywords(Array.isArray(poem.content) ? poem.content.join('') : poem.content || '')
    }))
  };
}

/**
 * 提取关键词（提取两字词组）
 */
function extractKeywords(content) {
  const keywords = new Set();

  // 移除标点符号和空白字符
  const cleanContent = content.replace(/[，。！？；：""''、\s\n]/g, '');

  // 提取两字词组
  for (let i = 0; i < cleanContent.length - 1; i++) {
    const word = cleanContent.substr(i, 2);
    // 过滤一些常见的虚词
    if (!isCommonWord(word) && isValidWord(word)) {
      keywords.add(word);
    }
  }

  return Array.from(keywords).slice(0, 30); // 限制关键词数量
}

/**
 * 判断是否为常见虚词
 */
function isCommonWord(word) {
  const commonWords = ['之乎', '者也', '而已', '以为', '所以', '可以', '不可', '何以', '之于', '于是', '是以'];
  return commonWords.includes(word);
}

/**
 * 判断是否为有效词组（都是汉字）
 */
function isValidWord(word) {
  return /^[\u4e00-\u9fa5]{2}$/.test(word);
}

/**
 * 主函数
 */
async function main() {
  console.log('开始从 GitHub 下载诗经和楚辞数据...\n');

  try {
    // 确保输出目录存在
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // 下载诗经
    console.log('=== 下载诗经 ===');
    await downloadFile(SHIJING_URL, SHIJING_OUTPUT);

    // 读取并转换诗经数据
    const shijingRawData = JSON.parse(fs.readFileSync(SHIJING_OUTPUT, 'utf-8'));
    const shijingData = transformShijingData(shijingRawData);
    fs.writeFileSync(SHIJING_OUTPUT, JSON.stringify(shijingData, null, 2), 'utf-8');
    console.log(`✓ 诗经数据处理完成: ${shijingData.total} 篇\n`);

    // 下载楚辞
    console.log('=== 下载楚辞 ===');
    await downloadFile(CHUCI_URL, CHUCI_OUTPUT);

    // 读取并转换楚辞数据
    const chuciRawData = JSON.parse(fs.readFileSync(CHUCI_OUTPUT, 'utf-8'));
    const chuciData = transformChuciData(chuciRawData);
    fs.writeFileSync(CHUCI_OUTPUT, JSON.stringify(chuciData, null, 2), 'utf-8');
    console.log(`✓ 楚辞数据处理完成: ${chuciData.total} 篇\n`);

    // 输出预览
    console.log('=== 数据预览 ===\n');
    console.log('诗经示例:');
    if (shijingData.poems.length > 0) {
      const sample = shijingData.poems[0];
      console.log(`  标题: ${sample.title}`);
      console.log(`  章节: ${sample.chapter} - ${sample.section}`);
      console.log(`  内容预览: ${sample.content.substring(0, 50)}...`);
      console.log(`  关键词: ${sample.keywords.slice(0, 10).join(', ')}\n`);
    }

    console.log('楚辞示例:');
    if (chuciData.poems.length > 0) {
      const sample = chuciData.poems[0];
      console.log(`  标题: ${sample.title}`);
      console.log(`  作者: ${sample.author}`);
      console.log(`  内容预览: ${sample.content.substring(0, 50)}...`);
      console.log(`  关键词: ${sample.keywords.slice(0, 10).join(', ')}\n`);
    }

    console.log('✓ 全部完成！');
    console.log(`\n数据已保存到:\n  - ${SHIJING_OUTPUT}\n  - ${CHUCI_OUTPUT}`);

  } catch (error) {
    console.error('下载失败:', error.message);
    console.log('\n提示: 如果无法访问 GitHub，你可以：');
    console.log('  1. 使用代理');
    console.log('  2. 手动从 https://github.com/chinese-poetry/chinese-poetry 下载数据');
    console.log('  3. 使用镜像站点');
    process.exit(1);
  }
}

main();
