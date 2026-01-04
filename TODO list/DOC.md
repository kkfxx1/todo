# TODO List 项目说明文档

## 1. 技术选型
- **后端技术栈**：  
Java：企业级开发的标准，生态成熟稳定。  
Spring Boot：简化配置，快速构建生产级应用。  
MyBatis: 更灵活的 SQL 控制。  
MySQL: 成熟可靠的关系型数据库。  
JWT: 无状态认证，适合前后端分离架构。  
- **前端技术栈**：  
TypeScript: 提供类型安全，减少运行时错误。  
Vue 3: 组合式 API，逻辑复用性强。  
Element Plus: 提供了丰富的 UI 组件。  
Vite: 提供极速的开发体验。  


## 2. 项目结构设计
- 本项目采用前后端分离架构。  
- 目录结构示例：  
  ```
  TODO list/
    todolist/ #后端
        src/
            main/
                java/com/example/todolist/
                    controller/ #控制器层
                    service/  #服务层
                    model/ #定义数据模型
                    mapper/
                    config/
                resources/
                    application.yml #应用配置
                    mapper/  #MyBatis XML 映射文件
            test/
        pom.xml
    frontend/ #前端
        src/
            api/ # API 接口封装
            components/ # 组件
            stores/  # Pinia 状态管理,封装 API 调用和业务逻辑
            types/ # TypeScript 类型定义
            utils/ # 工具函数
            main.ts
        package.json

  ```  



## 3. 需求细节与决策
- 描述是否必填？如何处理空输入？  
 标题: 必填项，前端有非空校验
 描述: 可选项，允许为空。
- 已完成的任务在 UI 或 CLI 中如何显示？  
 已完成任务在表格中显示为灰色并移至底部，在卡片视图中透明度降低并带有删除线。
- 任务排序逻辑:默认按创建时间，用户可选择按优先级或截止日期排序。  
- 如果涉及扩展功能（例如同步/提醒），简述设计思路。  
登录功能，保护个人信息以及数据，通过JWT

## 4. AI 使用说明
- 是否使用 AI 工具？（ChatGPT / Copilot / Cursor / 其他）  
是，ChatGPT
- 使用 AI 的环节：  
  - 代码片段生成  
  - 复杂 Bug 诊断
  - 文档初稿编写  
- AI 输出如何修改： AI 提供的代码有部分漏洞以及逻辑不严谨的地方修改。

## 5. 运行与测试方式
- 本地运行方式（安装依赖、启动命令）。  
后端：
```
   mvn clean install
   mvn spring-boot:run
```
前端：
```
   npm install
   npm run dev
```
- 已测试过的环境：Windows 10。  
- 已知问题与不足。  


## 6. 总结与反思
- 如果有更多时间，你会如何改进？  
任务提醒：使用 Web Push API 或 Server-Sent Events 实现。  
离线支持：使用 Service Worker + IndexedDB 实现离线访问能力。  
可以引入 Redis 缓存热点数据，减少数据库访问。
以及各类细节的优化和ui界面的改进    
- 你觉得这个实现的最大亮点是什么？  
前后端分离，职责明确。  
响应式设计，加载状态和错误处理完善。 

## 7. 项目预览

TODO list\images  中可预览基本界面情况


