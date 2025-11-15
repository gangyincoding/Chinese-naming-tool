import axios from 'axios'
import type { Name, NamingRequest } from '@/types/name'
import { generatePrompt } from '@/utils/prompt'

const API_BASE_URL = import.meta.env.VITE_AI_API_URL
const API_KEY = import.meta.env.VITE_AI_API_KEY
const MODEL = import.meta.env.VITE_AI_MODEL || 'deepseek-chat'

// 创建axios实例
const aiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000, // 增加到90秒，因为AI生成需要较长时间
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
})

/**
 * 调用DeepSeek生成名字
 */
export async function generateNames(request: NamingRequest): Promise<Name[]> {
  try {
    const prompt = generatePrompt(request)

    const response = await aiClient.post('/v1/chat/completions', {
      model: MODEL,
      messages: [
        {
          role: 'system',
          content:
            '你是一个精通中国古典文学的起名专家，擅长从诗经、楚辞、唐诗宋词等典籍中挑选优美的名字。你精通五行八字理论，能够根据生辰八字推荐合适的名字。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    })

    const content = response.data.choices[0].message.content
    const names = parseAIResponse(content, request.surname)

    return names
  } catch (error: any) {
    console.error('DeepSeek生成名字失败:', error)

    // 错误处理
    if (error.response?.status === 401) {
      throw new Error('API密钥无效，请检查配置')
    } else if (error.response?.status === 429) {
      throw new Error('请求过于频繁，请稍后再试')
    } else if (error.response?.status === 500) {
      throw new Error('服务器错误，请稍后再试')
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('请求超时，请检查网络连接')
    } else {
      throw new Error(error.response?.data?.message || '名字生成失败，请稍后重试')
    }
  }
}

/**
 * 带重试的API调用
 */
export async function generateNamesWithRetry(
  request: NamingRequest,
  maxRetries = 2
): Promise<Name[]> {
  let lastError: any

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await generateNames(request)
    } catch (error: any) {
      lastError = error
      console.log(`第${i + 1}次尝试失败${i < maxRetries - 1 ? '，重试中...' : ''}`)

      // 如果不是最后一次，等待后重试
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
  }

  throw lastError
}

/**
 * 解析AI返回的JSON数据
 */
function parseAIResponse(content: string, surname: string): Name[] {
  try {
    // DeepSeek返回的可能是纯JSON，也可能包含markdown代码块
    let jsonStr = content.trim()

    // 移除可能的markdown代码块标记
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?$/g, '')
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```\n?/g, '')
    }

    const data = JSON.parse(jsonStr)

    if (!data.names || !Array.isArray(data.names)) {
      throw new Error('返回数据格式错误')
    }

    return data.names.map((item: any) => ({
      ...item,
      id: generateId(),
      surname,
      fullName: surname + item.givenName,
      createdAt: Date.now()
    }))
  } catch (error) {
    console.error('解析AI响应失败:', error)
    console.log('原始响应:', content)
    throw new Error('数据解析失败，请重试')
  }
}

/**
 * 生成唯一ID
 */
function generateId(): string {
  return `name_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
