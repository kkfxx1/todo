<script setup lang="ts">
import { Calendar } from '@element-plus/icons-vue'
import type { Todo } from '@/types/todo'
import {
  getCategoryLabel,
  getCategoryType,
  getPriorityLabel,
  getPriorityType,
  formatDate,
} from '@/utils/todoHelpers'

defineProps<{
  todos: Todo[]
}>()

const emit = defineEmits<{
  (e: 'update-status', id: number, status: boolean): void
  (e: 'edit', todo: Todo): void
  (e: 'delete', id: number): void
}>()

const handleEdit = (todo: Todo) => {
  emit('edit', todo)
}

const handleDelete = (todo: Todo) => {
  emit('delete', todo.id!)
}
</script>

<template>
  <div class="todo-card-list">
    <el-card
      v-for="todo in todos"
      :key="todo.id"
      class="todo-card"
      :class="{ 'is-completed': todo.completed }"
    >
      <template #header>
        <div class="card-header">
          <el-checkbox
            :model-value="todo.completed"
            @change="(val: boolean) => emit('update-status', todo.id!, val)"
            size="large"
          />
          <span class="card-title">{{ todo.title }}</span>
          <div class="card-actions">
            <el-button size="small" text @click="handleEdit(todo)">编辑</el-button>
            <el-button size="small" text type="danger" @click="handleDelete(todo)">删除</el-button>
          </div>
        </div>
      </template>

      <div class="card-content">
        <p v-if="todo.description">{{ todo.description }}</p>
        <div class="card-meta">
          <el-tag :type="getCategoryType(todo.category)" size="small">
            {{ getCategoryLabel(todo.category) }}
          </el-tag>
          <el-tag :type="getPriorityType(todo.priority)" size="small">
            {{ getPriorityLabel(todo.priority) }}
          </el-tag>
          <span v-if="todo.dueDate" class="due-date">
            <el-icon><Calendar /></el-icon>
            {{ formatDate(todo.dueDate) }}
          </span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.todo-card-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.todo-card {
  transition: all 0.3s ease;
}

.todo-card.is-completed {
  opacity: 0.7;
  background-color: #f9f9f9;
}

.todo-card.is-completed .card-title {
  text-decoration: line-through;
  color: #999;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-title {
  flex-grow: 1;
  font-weight: bold;
  font-size: 16px;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.card-content p {
  margin: 0 0 16px 0;
  color: #666;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 14px;
  color: #777;
}

.due-date {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
