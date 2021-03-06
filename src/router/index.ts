import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/xxl',
      name: 'xxl',
      component: () => import('@/views/xxl/xxl.vue')
    },
    {
      path: '/fishing',
      name: 'fishing',
      component: () => import('@/views/fishing/fishing.vue')
    },
    {
      path: '/snake',
      name: 'snake',
      component: () => import('@/views/snake/snake.vue')
    }
  ]
})
router.beforeEach(to => {
  document.title = String(to.name)
})

export default router
