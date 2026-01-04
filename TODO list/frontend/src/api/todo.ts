import axios from 'axios';
import type { Todo, TodoForm } from '@/types/todo';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
});

api.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token');
    // 如果 token 存在，则将其添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response;
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response) {
      if (error.response.status === 401) {
        // 如果是 401 错误，说明 token 无效或过期
        // 清除本地 token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // 跳转到登录页
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const todoApi = {
  getAllTodos: () => api.get<Todo[]>('/todos'),
  getTodoById: (id: number) => api.get<Todo>(`/todos/${id}`),
  searchTodos: (keyword: string) => api.get<Todo[]>(`/todos/search?keyword=${keyword}`),
  createTodo: (todo: TodoForm) => api.post<Todo>('/todos', todo),
  updateTodo: (id: number, todo: Partial<Todo>) => api.put<Todo>(`/todos/${id}`, todo),
  deleteTodo: (id: number) => api.delete(`/todos/${id}`)
};