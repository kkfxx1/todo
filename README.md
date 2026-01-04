# todo list 
## 项目简介
基于 Java Spring Boot 和 Vue3 + TypeScript 的全栈待办事项管理应用
## 功能特性
添加、编辑、删除、标记完成待办事项   
支持分类和优先级设置   
可按关键词搜索、支持优先级、截止日期方式排序  
提供表格和卡片两种视图 
## 技术栈
### 后端
语言: Java  
框架: Spring Boot  
数据访问: MyBatis  
数据库: MySQL 
### 前端
语言: TypeScript  
框架: Vue 3  
状态管理: Pinia  
UI 组件库: Element Plus 
## 安装和运行
### 前提条件
Node.js 16+  
Java 11+  
Maven 3.6+  
MySQL 8.0+  
### 安装步骤
1.克隆项目并进入后端目录  
```
cd todolist
```
2.创建数据库并执行sql/init.sql  
3.修改 src/main/resources/application.yml 中的数据库连接配置  
4.安装依赖并启动  
 ```
mvn clean install
 ```

前端启动  
 ```
1.cd frontend  
2.npm install  
3.npm run dev
 ```








