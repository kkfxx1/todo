import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { todoApi } from '@/api/todo'
import type { Todo, TodoForm } from '@/types/todo'

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const completedCount = computed(() => todos.value.filter((todo) => todo.completed).length)
  const uncompletedCount = computed(() => todos.value.filter((todo) => !todo.completed).length)
  const totalCount = computed(() => todos.value.length)

  const categoryStats = computed(() => {
    const stats: Record<string, number> = {}
    todos.value.forEach((todo) => {
      const category = todo.category || 'other'
      stats[category] = (stats[category] || 0) + 1
    })
    return Object.entries(stats).map(([name, value]) => ({ name, value }))
  })

  const priorityStats = computed(() => {
    const stats = { low: 0, medium: 0, high: 0 }
    todos.value.forEach((todo) => {
      if (todo.priority === 1) stats.low++
      else if (todo.priority === 2) stats.medium++
      else if (todo.priority === 3) stats.high++
    })
    return [
      { name: '低优先级', value: stats.low },
      { name: '中优先级', value: stats.medium },
      { name: '高优先级', value: stats.high },
    ]
  })

  const completionTrend = computed(() => {
    const trend = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      const completedOnDay = todos.value.filter((todo) => {
        if (!todo.completed || !todo.updatedAt) return false
        return todo.updatedAt.startsWith(dateStr)
      }).length

      trend.push({ date: dateStr.substring(5), completed: completedOnDay })
    }
    return trend
  })

  const fetchTodos = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await todoApi.getAllTodos()
      todos.value = response.data
    } catch {
      error.value = '获取待办事项失败'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const searchTodos = async (keyword: string) => {
    if (!keyword.trim()) {
      await fetchTodos()
      return
    }
    loading.value = true
    error.value = null
    try {
      const response = await todoApi.searchTodos(keyword)
      todos.value = response.data
      if (todos.value.length === 0) {
        ElMessage.warning('未找到匹配的待办事项')
      }
    } catch {
      error.value = '搜索失败'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const createTodo = async (todoForm: TodoForm) => {
    error.value = null
    try {
      const response = await todoApi.createTodo(todoForm)
      todos.value.unshift(response.data) // 将新任务添加到列表顶部
      ElMessage.success('添加成功')
      return true
    } catch {
      error.value = '添加失败'
      ElMessage.error(error.value)
      return false
    }
  }

  const updateTodo = async (id: number, updatedTodo: Partial<Todo>) => {
    error.value = null
    try {
      await todoApi.updateTodo(id, updatedTodo)

      const todoToUpdate = todos.value.find((todo) => todo.id === id)
      if (todoToUpdate) {
        Object.assign(todoToUpdate, updatedTodo)
      }

      ElMessage.success('更新成功')
      return true
    } catch {
      error.value = '更新失败'
      ElMessage.error(error.value)
      return false
    }
  }
  const deleteTodo = async (id: number) => {
    error.value = null
    try {
      await todoApi.deleteTodo(id)
      todos.value = todos.value.filter((todo) => todo.id !== id)
      ElMessage.success('删除成功')
      return true
    } catch {
      error.value = '删除失败'
      ElMessage.error(error.value)
      return false
    }
  }

  // 返回所有需要在组件中使用的状态和方法
  return {
    // State
    todos,
    loading,
    error,
    // Getters
    totalCount,
    completedCount,
    uncompletedCount,
    categoryStats,
    priorityStats,
    completionTrend,
    // Actions
    fetchTodos,
    searchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
  }
})
