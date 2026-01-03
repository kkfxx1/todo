<script setup lang="ts">
import TodoList from './components/TodoList.vue'
</script>

<template>
  <div class="app">
    <el-container>
      <el-header>
        <h1>TODO List</h1>
      </el-header>
      <el-main>
        <TodoList />
      </el-main>
    </el-container>
  </div>
</template>

<style>
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.el-container {
  height: 100%;
}

.el-header {
  background-color: #409eff;
  color: white;
  text-align: center;
  line-height: 60px;
  flex-shrink: 0;
}

.el-main {
  background-color: #f5f7fa;
  padding: 20px;
  flex: 1;
  overflow: auto;
  display: flex;
  justify-content: center;
}

/* 表格行完成状态样式 */
.el-table .is-completed {
  color: #999;
  background-color: #f5f5f5;
}

.el-table .is-completed .el-tag {
  opacity: 0.7;
}
</style>
