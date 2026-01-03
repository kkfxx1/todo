<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Todo, TodoForm } from '@/types/todo'
import { useTodoStore } from '@/stores/todoStore'
import TodoCardList from './TodoCardList.vue'
import {
  getCategoryLabel,
  getCategoryType,
  getPriorityLabel,
  getPriorityType,
  formatDate,
  getRowClassName,
} from '@/utils/todoHelpers'

const todoStore = useTodoStore()

const dialogVisible = ref(false)
const isEdit = ref(false)
const currentTodoId = ref<number | null>(null)
const searchKeyword = ref('')
const sortBy = ref('default')
const emptyText = ref('暂无数据')
const viewMode = ref<'table' | 'card'>('table')

const todos = computed(() => todoStore.todos)

const sortedTodos = computed(() => {
  const list = [...todos.value]
  if (sortBy.value === 'priority') {
    return list.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1
      return b.priority - a.priority
    })
  } else if (sortBy.value === 'dueDate') {
    return list.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })
  }
  return list.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    if (!a.createdAt) return 1
    if (!b.createdAt) return -1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
})

const todoForm = ref<TodoForm>({
  title: '',
  description: '',
  category: 'work',
  priority: 1,
  dueDate: '',
})

onMounted(() => {
  todoStore.fetchTodos()
})

const handleSearch = () => {
  todoStore.searchTodos(searchKeyword.value)
}

const showAddDialog = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

const showEditDialog = (todo: Todo) => {
  isEdit.value = true
  currentTodoId.value = todo.id || null
  todoForm.value = {
    title: todo.title,
    description: todo.description || '',
    category: todo.category,
    priority: todo.priority,
    dueDate: todo.dueDate || '',
  }
  dialogVisible.value = true
}

const resetForm = () => {
  todoForm.value = {
    title: '',
    description: '',
    category: 'work',
    priority: 1,
    dueDate: '',
  }
}

const saveTodo = async () => {
  if (!todoForm.value.title.trim()) {
    ElMessage.warning('请输入标题')
    return
  }

  let success = false
  if (isEdit.value && currentTodoId.value) {
    success = await todoStore.updateTodo(currentTodoId.value, {
      ...todoForm.value,
      completed: false,
    })
  } else {
    success = await todoStore.createTodo(todoForm.value)
  }

  if (success) {
    dialogVisible.value = false
    resetForm()
  }
}

const updateTodoStatus = async (id: number, newCompletedStatus: boolean) => {
  await todoStore.updateTodo(id, { completed: newCompletedStatus })
}

const deleteTodo = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这个待办事项吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await todoStore.deleteTodo(id)
  } catch (error) {
    // 用户取消操作
  }
}

// const getRowClassName = ({ row }: { row: Todo }) => {
//   return row.completed ? 'is-completed' : ''
// }

// const getCategoryLabel = (category: string) => {
//   const categoryMap: Record<string, string> = {
//     work: '工作',
//     study: '学习',
//     life: '生活',
//     other: '其他',
//   }
//   return categoryMap[category] || category
// }

// const getCategoryType = (category: string) => {
//   const categoryTypeMap: Record<string, string> = {
//     work: 'primary',
//     study: 'success',
//     life: 'warning',
//     other: 'info',
//   }
//   return categoryTypeMap[category] || 'info'
// }

// const getPriorityLabel = (priority: number) => {
//   const priorityMap: Record<number, string> = {
//     1: '低',
//     2: '中',
//     3: '高',
//   }
//   return priorityMap[priority] || priority
// }

// const getPriorityType = (priority: number) => {
//   if (priority === 3) return 'danger'
//   if (priority === 2) return 'warning'
//   return 'info'
// }

// const formatDate = (dateString: string | undefined) => {
//   if (!dateString) return ''
//   return new Date(dateString).toLocaleString()
// }
</script>

<template>
  <div class="todo-list">
    <el-loading :active="todoStore.loading" />

    <el-row :gutter="20" class="operations-row">
      <el-col :xs="24" :sm="16">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索待办事项..."
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="8" class="add-button-col">
        <el-button type="primary" @click="showAddDialog" style="width: 100%"
          >添加待办事项</el-button
        >
      </el-col>
    </el-row>

    <div class="stats">
      <el-tag type="info">总计: {{ todoStore.todos.length }}</el-tag>
      <el-tag type="success">已完成: {{ todoStore.completedCount }}</el-tag>
      <el-tag type="danger">未完成: {{ todoStore.uncompletedCount }}</el-tag>
    </div>

    <div class="sort-options">
      <span>排序方式：</span>
      <el-radio-group v-model="sortBy">
        <el-radio label="priority">按优先级</el-radio>
        <el-radio label="dueDate">按截止日期</el-radio>
        <el-radio label="default">默认排序</el-radio>
      </el-radio-group>
    </div>

    <div class="view-toggle">
      <el-radio-group v-model="viewMode">
        <el-radio-button label="table"
          ><el-icon><List /></el-icon
        ></el-radio-button>
        <el-radio-button label="card"
          ><el-icon><Grid /></el-icon
        ></el-radio-button>
      </el-radio-group>
    </div>

    <TransitionGroup name="list" tag="div">
      <el-table
        v-if="viewMode === 'table'"
        key="table"
        :data="sortedTodos"
        style="width: 100%"
        :empty-text="emptyText"
        :row-class-name="getRowClassName"
        row-key="id"
      >
        <el-table-column prop="title" label="标题" width="200" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="category" label="分类" width="100">
          <template #default="scope">
            <el-tag :type="getCategoryType(scope.row.category)">
              {{ getCategoryLabel(scope.row.category) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="100">
          <template #default="scope">
            <el-tag :type="getPriorityType(scope.row.priority)">
              {{ getPriorityLabel(scope.row.priority) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="dueDate" label="截止日期" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.dueDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="completed" label="状态" width="100">
          <template #default="scope">
            <el-checkbox
              :model-value="scope.row.completed"
              @change="(val: boolean) => updateTodoStatus(scope.row.id, val)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="showEditDialog(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteTodo(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <TodoCardList
        v-else
        key="card"
        :todos="sortedTodos"
        @update-status="updateTodoStatus"
        @edit="showEditDialog"
        @delete="deleteTodo"
      />
    </TransitionGroup>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑待办事项' : '添加待办事项'"
      width="500px"
    >
      <el-form :model="todoForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="todoForm.title" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="todoForm.description" type="textarea" rows="3" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="todoForm.category" placeholder="选择分类">
            <el-option label="工作" value="work" />
            <el-option label="学习" value="study" />
            <el-option label="生活" value="life" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="todoForm.priority" placeholder="选择优先级">
            <el-option label="低" :value="1" />
            <el-option label="中" :value="2" />
            <el-option label="高" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止日期">
          <el-date-picker
            v-model="todoForm.dueDate"
            type="datetime"
            placeholder="选择日期时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveTodo">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.stats {
  margin-bottom: 20px;
}

.stats .el-tag {
  margin-right: 10px;
}
.todo-list {
  max-width: 1200px;
  margin: 0 auto;
}

.todo-operations {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
}

.sort-options {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.sort-options span {
  margin-right: 15px;
  font-weight: bold;
}

:deep(.el-table__row.is-completed) {
  color: #999;
  background-color: #f5f5f5;
}

:deep(.el-table__row.is-completed .el-tag) {
  opacity: 0.7;
}
.operations-row {
  margin-bottom: 20px;
}

.add-button-col {
  display: flex;
  align-items: center;
}

.view-toggle {
  margin-bottom: 20px;
  text-align: right;
}
.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-leave-active {
  position: absolute;
}
</style>
