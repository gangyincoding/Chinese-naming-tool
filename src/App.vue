<template>
  <div id="app" class="ink-background">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCollectionStore } from '@/stores/collection'

const collectionStore = useCollectionStore()

// 初始化收藏数据
onMounted(() => {
  collectionStore.init()
})
</script>

<style lang="scss">
@import '@/assets/styles/reset.scss';
@import '@/assets/styles/chinese-style.scss';
</style>
