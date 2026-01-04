import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { authApi } from '@/api/auth'
import type { User } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  // 从 localStorage 恢复状态
  const getToken = (): string | null => localStorage.getItem('token')
  const getUser = (): User | null => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }

  const token = ref<string | null>(getToken())
  const user = ref<User | null>(getUser())

  const loading = ref(false)
  // 计算属性
  const isAuthenticated = computed(() => !!token.value)

  // Actions
  const login = async (username: string, password: string) => {
    try {
      loading.value = true

      const response = await authApi.login({ username, password })
      const { token: newToken, ...userData } = response.data

      // 更新状态
      token.value = newToken
      user.value = userData

      // 持久化到 localStorage
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(userData))

      ElMessage.success('登录成功')
      return true
    } catch {
      ElMessage.error('登录失败')
      return false
    } finally {
      loading.value = false
    }
  }

  const register = async (username: string, password: string) => {
    try {
      loading.value = true
      const response = await authApi.register({ username, password })
      const { token: newToken, ...userData } = response.data

      // 更新状态
      token.value = newToken
      user.value = userData

      // 持久化到 localStorage
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(userData))

      ElMessage.success('注册成功')
      return true
    } catch (error: any) {
      ElMessage.error(error.response?.data?.message || '注册失败')
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    const tokenValue = token.value
    const userValue = user.value

    if (tokenValue) {
      localStorage.removeItem('token')
    }
    if (userValue) {
      localStorage.removeItem('user')
    }
    token.value = null
    user.value = null

    ElMessage.success('已退出登录')
  }

  return {
    // State
    token,
    user,
    loading,
    // Getters
    isAuthenticated,
    // Actions
    login,
    register,
    logout,
  }
})
