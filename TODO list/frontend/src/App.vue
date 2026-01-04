<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="app">
    <el-container v-if="authStore.isAuthenticated">
      <el-header>
        <h1>TODO List</h1>
        <div class="user-info">
          <el-tag>{{ authStore.user?.username }}</el-tag>
          <el-button text @click="handleLogout">退出</el-button>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
    <router-view v-else />
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
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #409eff;
  color: white;
  padding: 0 20px;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
