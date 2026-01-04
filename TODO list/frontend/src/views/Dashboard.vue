<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { Document, CircleCheck, Clock } from '@element-plus/icons-vue'
import { useTodoStore } from '@/stores/todoStore'

const todoStore = useTodoStore()

// 获取图表 DOM 元素的引用
const categoryChartRef = ref<HTMLElement>()
const priorityChartRef = ref<HTMLElement>()
const trendChartRef = ref<HTMLElement>()

// 存储图表实例，以便后续销毁
let categoryChart: echarts.ECharts | null = null
let priorityChart: echarts.ECharts | null = null
let trendChart: echarts.ECharts | null = null

// 初始化图表
const initCharts = () => {
  // 分类饼图
  if (categoryChartRef.value) {
    categoryChart = echarts.init(categoryChartRef.value)
    categoryChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left' },
      series: [
        {
          name: '分类',
          type: 'pie',
          radius: '50%',
          data: todoStore.categoryStats,
          emphasis: {
            itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
          },
        },
      ],
    })
  }

  // 优先级饼图
  if (priorityChartRef.value) {
    priorityChart = echarts.init(priorityChartRef.value)
    priorityChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left' },
      series: [
        {
          name: '优先级',
          type: 'pie',
          radius: ['40%', '70%'], // 环形图
          data: todoStore.priorityStats,
        },
      ],
    })
  }

  // 趋势折线图
  if (trendChartRef.value) {
    trendChart = echarts.init(trendChartRef.value)
    trendChart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: todoStore.completionTrend.map((item) => item.date) },
      yAxis: { type: 'value' },
      series: [
        {
          name: '完成任务数',
          data: todoStore.completionTrend.map((item) => item.completed),
          type: 'line',
          smooth: true,
          areaStyle: { opacity: 0.3 },
          itemStyle: { color: '#67C23A' },
        },
      ],
    })
  }
}

// 监听窗口大小变化，调整图表大小
const handleResize = () => {
  categoryChart?.resize()
  priorityChart?.resize()
  trendChart?.resize()
}

// 监听数据变化，更新图表
watch(
  () => todoStore.categoryStats,
  (newData) => {
    if (categoryChart) {
      categoryChart.setOption({ series: [{ data: newData }] })
    }
  },
  { deep: true },
)

watch(
  () => todoStore.priorityStats,
  (newData) => {
    if (priorityChart) {
      priorityChart.setOption({ series: [{ data: newData }] })
    }
  },
  { deep: true },
)

watch(
  () => todoStore.completionTrend,
  (newData) => {
    if (trendChart) {
      trendChart.setOption({
        xAxis: { data: newData.map((item) => item.date) },
        series: [{ data: newData.map((item) => item.completed) }],
      })
    }
  },
  { deep: true },
)

onMounted(() => {
  // 初始化图表
  setTimeout(initCharts, 0) // 延迟一帧，确保 DOM 已渲染
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 组件卸载时，销毁图表实例，防止内存泄漏
  categoryChart?.dispose()
  priorityChart?.dispose()
  trendChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <!-- 概览卡片 -->
      <el-col :xs="24" :sm="8">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>总任务数</span>
              <el-icon class="icon"><Document /></el-icon>
            </div>
          </template>
          <div class="card-value">{{ todoStore.totalCount }}</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="8">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>已完成</span>
              <el-icon class="icon success"><CircleCheck /></el-icon>
            </div>
          </template>
          <div class="card-value success">{{ todoStore.completedCount }}</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="8">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>未完成</span>
              <el-icon class="icon danger"><Clock /></el-icon>
            </div>
          </template>
          <div class="card-value danger">{{ todoStore.uncompletedCount }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <!-- 分类饼图 -->
      <el-col :xs="24" :md="12">
        <el-card>
          <template #header>任务分类分布</template>
          <div ref="categoryChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
      <!-- 优先级饼图 -->
      <el-col :xs="24" :md="12">
        <el-card>
          <template #header>任务优先级分布</template>
          <div ref="priorityChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row style="margin-top: 20px">
      <!-- 完成趋势折线图 -->
      <el-col :span="24">
        <el-card>
          <template #header>最近7天完成趋势</template>
          <div ref="trendChartRef" style="height: 350px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 20px;
}

.stat-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-card .icon {
  font-size: 20px;
}

.stat-card .icon.success {
  color: #67c23a;
}
.stat-card .icon.danger {
  color: #f56c6c;
}

.card-value {
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  margin: 20px 0;
}

.card-value.success {
  color: #67c23a;
}
.card-value.danger {
  color: #f56c6c;
}
</style>
