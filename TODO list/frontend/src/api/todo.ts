import axios from 'axios';
import type { Todo, TodoForm } from '@/types/todo';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
});

export const todoApi = {
  getAllTodos: () => api.get<Todo[]>('/todos'),
  getTodoById: (id: number) => api.get<Todo>(`/todos/${id}`),
  searchTodos: (keyword: string) => api.get<Todo[]>(`/todos/search?keyword=${keyword}`),
  createTodo: (todo: TodoForm) => api.post<Todo>('/todos', todo),
  updateTodo: (id: number, todo: Partial<Todo>) => api.put<Todo>(`/todos/${id}`, todo),
  deleteTodo: (id: number) => api.delete(`/todos/${id}`)
};