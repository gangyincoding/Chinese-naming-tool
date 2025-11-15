<template>
  <div class="home-page">
    <div class="container">
      <!-- 标题 -->
      <h1 class="title-chinese">诗韵取名阁</h1>
      <p class="subtitle">传承中华文化，赋予美好寓意</p>

      <!-- 起名模式选择 -->
      <div class="mode-selector">
        <el-radio-group v-model="mode" size="large">
          <el-radio-button value="surname">按姓氏起名</el-radio-button>
          <el-radio-button value="bazi">按生辰八字起名</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 姓氏起名表单 -->
      <div v-if="mode === 'surname'" class="form-container chinese-card">
        <el-form :model="surnameForm" label-position="top" size="large">
          <el-form-item label="宝宝姓氏">
            <el-input
              v-model="surnameForm.surname"
              placeholder="请输入姓氏（1-2个汉字）"
              maxlength="2"
              clearable
            />
          </el-form-item>

          <el-form-item label="性别">
            <el-radio-group v-model="surnameForm.gender">
              <el-radio value="male">男孩</el-radio>
              <el-radio value="female">女孩</el-radio>
              <el-radio value="neutral">中性</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              @click="handleGenerateNames"
              style="width: 100%"
            >
              开始起名
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 八字起名表单 -->
      <div v-else class="form-container chinese-card">
        <el-alert
          title="八字起名功能"
          type="info"
          description="该功能将根据宝宝的生辰八字，结合五行理论推荐合适的名字"
          :closable="false"
          style="margin-bottom: 20px"
        />
        <p style="text-align: center; color: #999">
          八字起名表单开发中，敬请期待...
        </p>
      </div>

      <!-- 功能介绍 -->
      <div class="features">
        <div class="feature-item">
          <div class="feature-icon">📚</div>
          <h3>古典文化</h3>
          <p>名字来源于诗经、楚辞等经典文献</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">✨</div>
          <h3>寓意美好</h3>
          <p>每个名字都有详细的出处和寓意解释</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">☯️</div>
          <h3>五行八字</h3>
          <p>结合传统五行理论，平衡命理</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNamingStore } from '@/stores/naming'
import { validateSurname } from '@/utils/validator'
import { ElMessage } from 'element-plus'

const router = useRouter()
const namingStore = useNamingStore()

// 当前模式
const mode = ref<'surname' | 'bazi'>('surname')

// 姓氏表单
const surnameForm = ref({
  surname: '',
  gender: 'neutral' as 'male' | 'female' | 'neutral'
})

// 加载状态
const loading = ref(false)

// 生成名字
const handleGenerateNames = async () => {
  // 验证姓氏
  const validation = validateSurname(surnameForm.value.surname)
  if (!validation.valid) {
    ElMessage.warning(validation.message)
    return
  }

  loading.value = true

  try {
    await namingStore.generateNames({
      mode: 'surname',
      surname: surnameForm.value.surname,
      gender: surnameForm.value.gender,
      count: 10
    })

    // 跳转到名字列表页
    router.push('/names')
  } catch (error: any) {
    ElMessage.error(error.message || '生成失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  padding: 60px 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.subtitle {
  text-align: center;
  color: var(--color-light-ink);
  font-size: 16px;
  margin-bottom: var(--spacing-xl);
}

.mode-selector {
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-xl);
}

.form-container {
  max-width: 600px;
  margin: 0 auto var(--spacing-xl);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin-top: 60px;
}

.feature-item {
  text-align: center;
  padding: var(--spacing-lg);

  .feature-icon {
    font-size: 48px;
    margin-bottom: var(--spacing-md);
  }

  h3 {
    font-family: var(--font-title);
    font-size: 18px;
    color: var(--color-ink-black);
    margin-bottom: var(--spacing-sm);
  }

  p {
    color: var(--color-light-ink);
    font-size: 14px;
    line-height: 1.6;
  }
}
</style>
