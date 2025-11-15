<template>
  <div class="guide-page">
    <div class="container">
      <h1 class="title-chinese">使用说明</h1>

      <div class="guide-content chinese-card">
        <h2>关于诗韵取名阁</h2>
        <p>
          诗韵取名阁是一个基于中国古典文化的智能宝宝起名工具。我们致力于传承中华传统文化，
          为每一个新生命赋予富有诗意和美好寓意的名字。
        </p>

        <h2>功能介绍</h2>
        <h3>1. 按姓氏起名</h3>
        <p>
          输入宝宝的姓氏和性别，AI将从《诗经》、《楚辞》、唐诗、宋词等古典文献中，
          为您推荐10个富有文化底蕴的名字。每个名字都包含：
        </p>
        <ul>
          <li>完整的典籍出处和原文诗句</li>
          <li>详细的寓意解释</li>
          <li>每个字的五行属性和字义</li>
          <li>综合评分和各项指标</li>
        </ul>

        <h3>2. 按生辰八字起名（开发中）</h3>
        <p>
          输入宝宝的出生年月日时，系统将计算生辰八字和五行属性，
          结合传统命理学，推荐符合五行补缺的名字。
        </p>

        <h2>使用建议</h2>
        <ul>
          <li>建议多次生成，从中选择最喜欢的名字</li>
          <li>可以参考名字的综合评分，但最重要的是父母的喜好</li>
          <li>生成的名字仅供参考，最终决定权在父母</li>
          <li>如需更专业的起名建议，建议咨询专业的命名师</li>
        </ul>

        <h2>技术说明</h2>
        <p>
          本工具使用DeepSeek AI模型，通过精心设计的提示词（Prompt），
          确保生成的名字都来源于真实的古典文献，绝不编造出处。
        </p>

        <h2>联系我们</h2>
        <p>
          如有任何问题或建议，欢迎联系我们。
        </p>
      </div>

      <div class="actions">
        <el-button type="primary" @click="router.push('/')">
          开始起名
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style lang="scss" scoped>
.guide-page {
  min-height: 100vh;
  padding: 60px 20px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.guide-content {
  padding: var(--spacing-xl);
  line-height: 1.8;

  h2 {
    font-family: var(--font-title);
    font-size: 24px;
    color: var(--color-ink-black);
    margin: var(--spacing-xl) 0 var(--spacing-md);
    padding-bottom: var(--spacing-sm);
    border-bottom: 2px solid var(--color-cinnabar-red);

    &:first-child {
      margin-top: 0;
    }
  }

  h3 {
    font-size: 18px;
    color: var(--color-light-ink);
    margin: var(--spacing-lg) 0 var(--spacing-sm);
  }

  p {
    color: var(--color-light-ink);
    margin-bottom: var(--spacing-md);
  }

  ul {
    padding-left: 24px;
    margin-bottom: var(--spacing-md);

    li {
      list-style: disc;
      color: var(--color-light-ink);
      margin-bottom: var(--spacing-sm);
    }
  }
}

.actions {
  text-align: center;
  margin-top: var(--spacing-xl);
}
</style>
