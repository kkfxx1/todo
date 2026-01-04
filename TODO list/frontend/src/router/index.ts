import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import TodoList from '@/components/TodoList.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
    {
      path: '/',
      name: 'App',
      component: TodoList, // 暂时将 TodoList 作为主页面
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // 如果目标路由需要认证且用户未登录，则跳转到登录页
    next('/login')
  } else {
    // 否则，正常放行
    next()
  }
})

export default router
