import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: { title: '首页' }
    },
    {
      path: '/names',
      name: 'names',
      component: () => import('@/views/NameList.vue'),
      meta: { title: '名字列表' }
    },
    {
      path: '/collection',
      name: 'collection',
      component: () => import('@/views/Collection.vue'),
      meta: { title: '我的收藏' }
    },
    {
      path: '/comparison',
      name: 'comparison',
      component: () => import('@/views/Comparison.vue'),
      meta: { title: '名字对比' }
    },
    {
      path: '/guide',
      name: 'guide',
      component: () => import('@/views/Guide.vue'),
      meta: { title: '使用说明' }
    }
  ]
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, _from, next) => {
  const title = to.meta.title as string
  if (title) {
    document.title = `${title} - ${import.meta.env.VITE_APP_TITLE}`
  }
  next()
})

export default router
