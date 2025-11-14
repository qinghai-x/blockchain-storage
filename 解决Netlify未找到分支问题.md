# 解决 Netlify "未找到结果" 问题

## 问题描述

在 Netlify 连接 GitHub 时，"要部署的分支"（Branch to deploy）字段显示"未找到结果"。

---

## 原因分析

"未找到结果"通常表示：
1. **代码还没有推送到 GitHub**（最常见）
2. **Netlify 无法访问 GitHub 仓库**（网络/权限问题）
3. **仓库为空或没有分支**

---

## 解决方案

### 方案一：先推送代码到 GitHub（必须）

**这是最重要的步骤！** Netlify 只能检测已经推送到 GitHub 的分支。

#### 步骤 1：检查代码是否已推送

```bash
# 检查远程仓库状态
git ls-remote origin

# 如果显示错误或为空，说明代码还没有推送
```

#### 步骤 2：推送代码到 GitHub

```bash
# 确保所有更改已提交
git add .
git commit -m "准备部署到 Netlify"

# 推送到 GitHub
git push -u origin main
```

**如果遇到连接问题：**
- 如果有代理，运行 `配置Git代理.bat`
- 如果使用 SSH，运行 `切换到SSH连接.bat`
- 查看 `解决GitHub连接问题.md` 获取详细解决方案

#### 步骤 3：验证推送成功

```bash
# 检查远程分支
git ls-remote origin

# 应该能看到 main 分支
```

#### 步骤 4：在 Netlify 中刷新

1. 返回 Netlify 配置页面
2. 点击"要部署的分支"字段
3. 应该能看到 `main` 分支了
4. 选择 `main` 分支

---

### 方案二：检查 Netlify 权限

如果代码已推送但 Netlify 仍无法检测：

1. **检查 GitHub 授权**
   - 在 Netlify 中，点击右上角头像 → "User settings"
   - 进入 "Connected accounts"
   - 确认 GitHub 已连接
   - 如果没有，点击 "Connect to GitHub" 重新授权

2. **检查仓库权限**
   - 确保 Netlify 有权限访问你的仓库
   - 如果是私有仓库，需要授权 Netlify 访问

3. **重新选择仓库**
   - 在 Netlify 配置页面
   - 尝试重新选择仓库
   - 或点击 "Change site source" 重新连接

---

### 方案三：手动输入分支名称

如果 Netlify 无法自动检测，可以手动输入：

1. 在"要部署的分支"字段中
2. 直接输入 `main`（或你的主分支名称）
3. 继续配置其他设置
4. 点击 "Deploy site"

---

### 方案四：使用 Netlify CLI（如果网页无法连接）

如果网页端一直无法检测到分支，可以使用 CLI：

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录 Netlify
netlify login

# 初始化站点（会自动检测分支）
netlify init

# 或直接部署
netlify deploy --prod
```

---

## 完整操作流程

### 第一步：确保代码已推送到 GitHub

```bash
# 1. 检查状态
git status

# 2. 如果有未提交的更改
git add .
git commit -m "准备部署"

# 3. 推送到 GitHub
git push origin main

# 4. 验证推送成功
git ls-remote origin
```

### 第二步：在 Netlify 中配置

1. **刷新页面**
   - 返回 Netlify 配置页面
   - 刷新浏览器（F5）

2. **选择分支**
   - 点击"要部署的分支"字段
   - 应该能看到 `main` 分支
   - 如果还是没有，手动输入 `main`

3. **配置其他设置**
   - 构建命令：`npm run build`
   - 发布目录：`dist`
   - 基本目录：留空

4. **部署**
   - 点击 "Deploy site"
   - 等待构建完成

---

## 快速检查清单

在 Netlify 配置前，确认：

- [ ] 代码已推送到 GitHub（`git push origin main` 成功）
- [ ] GitHub 仓库中有 `main` 分支
- [ ] Netlify 已授权访问 GitHub
- [ ] 网络连接正常（可以访问 GitHub）

---

## 如果仍然无法解决

### 临时方案：手动部署

如果自动连接一直有问题，可以手动部署：

```bash
# 1. 构建项目
npm run build

# 2. 使用 Netlify CLI 部署
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

### 或者使用拖拽部署

1. 运行 `npm run build`
2. 在 Netlify 控制台，选择 "Sites"
3. 将 `dist` 文件夹拖拽到部署区域
4. 完成部署

---

## 常见错误

### 错误 1：`git push` 失败

**原因**：网络无法连接 GitHub

**解决**：
- 使用代理（运行 `配置Git代理.bat`）
- 使用 SSH（运行 `切换到SSH连接.bat`）
- 或切换到 Gitee（运行 `快速切换到Gitee.bat`）

### 错误 2：Netlify 授权失败

**原因**：GitHub 授权过期或权限不足

**解决**：
- Netlify → User settings → Connected accounts
- 断开 GitHub 连接
- 重新连接并授权

### 错误 3：找不到仓库

**原因**：仓库名称错误或权限不足

**解决**：
- 确认仓库名称正确
- 确认仓库是公开的，或已授权 Netlify 访问私有仓库

---

## 推荐操作顺序

1. **先推送代码**（最重要！）
   ```bash
   git push origin main
   ```

2. **验证推送成功**
   ```bash
   git ls-remote origin
   ```

3. **在 Netlify 中刷新并选择分支**

4. **如果还是不行，手动输入 `main`**

5. **完成配置并部署**

---

**提示**：大多数情况下，问题是因为代码还没有推送到 GitHub。先完成 `git push`，然后再在 Netlify 中配置。

