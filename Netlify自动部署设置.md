# Netlify 自动部署设置指南

## 概述

通过连接 Git 仓库（GitLab、GitHub、Bitbucket），实现代码推送后自动部署，无需手动上传。

---

## 方法一：使用 GitLab（推荐）

### 步骤 1：初始化 Git 仓库（如果还没有）

```bash
# 在项目根目录执行
git init
git add .
git commit -m "Initial commit"
```

### 步骤 2：创建 GitLab 仓库

1. 访问 https://gitlab.com（或国内镜像）
2. 点击右上角 "+" → "New project / repository"
3. 选择 "Create blank project"
4. 输入项目名称（如：`blockchain-storage`）
5. 选择 **Public** 或 **Private**
6. **不要**勾选 "Initialize repository with a README"
7. 点击 "Create project"

### 步骤 3：推送代码到 GitLab

```bash
# 添加远程仓库（替换 YOUR_USERNAME 和 REPO_NAME）
git remote add origin https://gitlab.com/YOUR_USERNAME/REPO_NAME.git

# 推送代码
git branch -M main
git push -u origin main
```

**如果使用 Gitee（码云）：**
```bash
# Gitee 的地址格式
git remote add origin https://gitee.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

### 步骤 4：在 Netlify 连接 GitLab

1. **登录 Netlify**
   - 访问 https://app.netlify.com
   - 登录你的账户

2. **添加新站点**
   - 点击右上角 "Add new site" → "Import an existing project"
   - 选择 "GitLab"（Netlify 原生支持）

3. **授权 Netlify 访问**
   - 点击 "Authorize Netlify"
   - 选择你的 GitLab 账户
   - 授权访问仓库

4. **选择仓库**
   - 在仓库列表中找到你的项目
   - 点击选择

5. **配置构建设置**
   - **Build command（构建命令）**：`npm run build`
   - **Publish directory（发布目录）**：`dist`
   - **Base directory（基础目录）**：留空或填写 `.`

6. **部署站点**
   - 点击 "Deploy site"
   - Netlify 会自动构建并部署

### 步骤 5：完成！

现在，每次你推送代码到 GitLab，Netlify 会自动：
1. 检测到代码变更
2. 自动运行 `npm run build`
3. 自动部署到网站

---

## 方法二：使用 Gitee（码云，国内推荐）

### 步骤 1：创建 Gitee 仓库

1. 访问 https://gitee.com
2. 登录账户
3. 点击右上角 "+" → "新建仓库"
4. 输入仓库名称
5. 选择 "公开" 或 "私有"
6. **不要**勾选 "使用Readme文件初始化这个仓库"
7. 点击 "创建"

### 步骤 2：推送代码到 Gitee

```bash
# 添加 Gitee 远程仓库
git remote add origin https://gitee.com/YOUR_USERNAME/REPO_NAME.git

# 推送代码
git branch -M main
git push -u origin main
```

### 步骤 3：在 Netlify 连接 Gitee

**重要提示**：Netlify 默认不支持 Gitee，需要使用以下方案之一：

#### 方案 A：同时使用 GitLab 和 Gitee（推荐）

```bash
# 添加两个远程仓库
git remote add gitlab https://gitlab.com/YOUR_USERNAME/REPO_NAME.git
git remote add gitee https://gitee.com/YOUR_USERNAME/REPO_NAME.git

# 推送代码到两个仓库
git push -u gitlab main
git push -u gitee main
```

然后在 Netlify 连接 GitLab 仓库。

#### 方案 B：使用 Netlify CLI（见方法三）

如果只想使用 Gitee，可以使用 Netlify CLI 手动部署。

---

## 方法三：使用 Netlify CLI（本地部署）

如果你不想使用 Git 仓库，可以使用 Netlify CLI：

### 安装 Netlify CLI

```bash
npm install -g netlify-cli
```

### 登录 Netlify

```bash
netlify login
```

### 初始化并部署

```bash
# 在项目根目录
netlify init

# 按照提示操作：
# 1. 选择 "Create & configure a new site"
# 2. 输入站点名称
# 3. 构建命令：npm run build
# 4. 发布目录：dist

# 部署
netlify deploy --prod
```

### 自动部署脚本

创建 `deploy.bat`（Windows）或 `deploy.sh`（Linux/Mac）：

**Windows (deploy.bat):**
```batch
@echo off
echo 构建项目...
call npm run build
echo 部署到 Netlify...
call netlify deploy --prod
pause
```

**Linux/Mac (deploy.sh):**
```bash
#!/bin/bash
echo "构建项目..."
npm run build
echo "部署到 Netlify..."
netlify deploy --prod
```

---

## 配置 Netlify 自动部署（重要）

### 在 Netlify 控制台设置：

1. **进入站点设置**
   - 选择你的站点
   - 点击 "Site settings" → "Build & deploy"

2. **配置构建命令**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Base directory: `.`（项目根目录）

3. **环境变量（如果需要）**
   - 在 "Environment variables" 中添加
   - 例如：`NODE_VERSION=18`

4. **自动部署设置**
   - 在 "Continuous Deployment" 中
   - 确保 "Auto publish" 已启用
   - 分支设置：`main` 或 `master` 分支自动部署

---

## 工作流程

### 日常开发流程：

```bash
# 1. 修改代码
# 2. 构建测试（可选）
npm run build

# 3. 提交代码
git add .
git commit -m "更新功能描述"

# 4. 推送到远程仓库
git push origin main

# 5. Netlify 自动检测并部署
# 等待几分钟，网站自动更新！
```

---

## 创建 Netlify 配置文件（可选）

在项目根目录创建 `netlify.toml`：

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

这样 Netlify 会自动读取配置，无需在控制台设置。

---

## 常见问题

### Q: 推送代码后，Netlify 没有自动部署？
A: 检查：
- Netlify 是否已连接 Git 仓库
- 是否推送到正确的分支（通常是 `main` 或 `master`）
- Netlify 控制台的 "Deploy settings" 中分支设置是否正确

### Q: 构建失败怎么办？
A: 
- 检查 Netlify 的构建日志
- 确保 `package.json` 中有正确的构建脚本
- 检查依赖是否正确安装

### Q: 如何只部署特定分支？
A: 在 Netlify 设置 → "Deploy settings" → "Branch deploys" 中配置

### Q: 如何回滚到之前的版本？
A: 在 Netlify 控制台 → "Deploys" → 选择之前的部署 → "Publish deploy"

---

## 推荐方案

**最佳实践：**
1. 使用 **GitLab** 作为代码仓库（或 Gitee + GitLab 双仓库）
2. 在 **Netlify** 连接 GitLab 仓库
3. 配置自动部署
4. 每次推送代码，网站自动更新

**优势：**
- ✅ 完全自动化
- ✅ 版本控制
- ✅ 部署历史记录
- ✅ 回滚功能
- ✅ 团队协作友好
- ✅ 国内访问友好（如果使用 Gitee）

**GitLab vs Gitee：**
- **GitLab.com**：Netlify 原生支持，功能完整，全球访问
- **Gitee**：国内访问快，但 Netlify 不直接支持，需要配合 GitLab 或使用 CLI

---

## 快速开始（5分钟设置）

1. **初始化 Git**（如果还没有）
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **创建 GitLab 仓库并推送**
   ```bash
   git remote add origin https://gitlab.com/YOUR_USERNAME/REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

3. **在 Netlify 连接 GitLab**
   - 登录 Netlify
   - Add new site → Import from Git → GitLab
   - 选择仓库
   - 配置：Build command: `npm run build`, Publish: `dist`
   - Deploy

4. **完成！** 以后只需 `git push`，网站自动更新！

**如果使用 Gitee：**
- 同时推送到 GitLab 和 Gitee，Netlify 连接 GitLab
- 或使用 Netlify CLI 手动部署（见方法三）

