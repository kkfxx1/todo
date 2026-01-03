export interface Todo {
  id?: number;
  title: string;
  description?: string;
  completed: boolean;
  category: string;
  priority: number;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TodoForm {
  title: string;
  description: string;
  category: string;
  priority: number;
  dueDate: string;
}