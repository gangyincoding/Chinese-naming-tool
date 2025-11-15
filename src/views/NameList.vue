<template>
  <div class="name-list-page">
    <div class="container">
      <h1 class="title-chinese">推荐名字</h1>

      <div v-if="namingStore.loading" class="loading-container">
        <div class="ink-loading"></div>
        <p>AI正在为您生成富有诗意的名字...</p>
      </div>

      <div v-else-if="namingStore.error" class="error-container">
        <el-alert type="error" :title="namingStore.error" show-icon />
        <el-button @click="router.push('/')" style="margin-top: 20px">
          返回首页
        </el-button>
      </div>

      <div v-else-if="namingStore.names.length > 0" class="names-content">
        <p class="result-info">
          为您推荐了 <strong>{{ namingStore.names.length }}</strong> 个名字
        </p>

        <div class="names-grid">
          <div
            v-for="name in namingStore.sortedNames"
            :key="name.id"
            class="name-card-simple chinese-card"
          >
            <h3 class="name-title">{{ name.fullName }}</h3>
            <p class="name-pinyin">{{ name.pinyin }}</p>
            <div class="verse-quote">{{ name.source.verse }}</div>
            <p class="name-source">—— {{ name.source.book }}</p>
            <div class="name-score">
              综合评分：<span class="score-value">{{ name.score.overall }}</span>
            </div>
          </div>
        </div>

        <div class="actions">
          <el-button @click="router.push('/')">重新起名</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useNamingStore } from '@/stores/naming'

const router = useRouter()
const namingStore = useNamingStore()
</script>

<style lang="scss" scoped>
.name-list-page {
  min-height: 100vh;
  padding: 60px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.loading-container {
  text-align: center;
  padding: 60px 20px;

  p {
    margin-top: 20px;
    color: var(--color-light-ink);
  }
}

.error-container {
  text-align: center;
  padding: 60px 20px;
}

.result-info {
  text-align: center;
  color: var(--color-light-ink);
  margin-bottom: var(--spacing-xl);
  font-size: 16px;

  strong {
    color: var(--color-cinnabar-red);
    font-size: 20px;
  }
}

.names-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.name-card-simple {
  padding: var(--spacing-lg);

  .name-title {
    font-family: var(--font-title);
    font-size: 28px;
    color: var(--color-ink-black);
    text-align: center;
    margin-bottom: var(--spacing-sm);
  }

  .name-pinyin {
    text-align: center;
    color: #999;
    font-size: 14px;
    margin-bottom: var(--spacing-md);
  }

  .name-source {
    text-align: right;
    color: #999;
    font-size: 13px;
    margin: var(--spacing-sm) 0;
  }

  .name-score {
    text-align: center;
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--color-light-gray);
    color: #666;

    .score-value {
      color: var(--color-cinnabar-red);
      font-size: 20px;
      font-weight: bold;
      margin-left: 8px;
    }
  }
}

.actions {
  text-align: center;
  margin-top: 40px;
}
</style>
