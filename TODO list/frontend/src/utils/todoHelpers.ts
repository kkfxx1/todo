import type { Todo } from '@/types/todo';

// 分类相关
export const getCategoryLabel = (category: string) => {
  const categoryMap: Record<string, string> = {
    work: '工作',
    study: '学习',
    life: '生活',
    other: '其他',
  };
  return categoryMap[category] || category;
};

export const getCategoryType = (category: string) => {
  const categoryTypeMap: Record<string, string> = {
    work: 'primary',
    study: 'success',
    life: 'warning',
    other: 'info',
  };
  return categoryTypeMap[category] || 'info';
};

// 优先级相关
export const getPriorityLabel = (priority: number) => {
  const priorityMap: Record<number, string> = {
    1: '低',
    2: '中',
    3: '高',
  };
  return priorityMap[priority] || priority;
};

export const getPriorityType = (priority: number) => {
  if (priority === 3) return 'danger';
  if (priority === 2) return 'warning';
  return 'info';
};

// 日期格式化
export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString();
};

// 行样式类名
export const getRowClassName = ({ row }: { row: Todo }) => {
  return row.completed ? 'is-completed' : '';
};