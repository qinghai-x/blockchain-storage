# 自动部署设置指南

## 🚀 推荐方案：使用 Git + GitLab + Netlify 自动部署（完全自动化）

### 为什么推荐这个方案？
- ✅ **完全自动化**：代码推送后自动部署，无需手动操作
- ✅ **版本控制**：所有代码变更都有记录
- ✅ **团队协作**：多人可以同时开发
- ✅ **部署历史**：可以回滚到任意版本
- ✅ **国内访问友好**：GitLab 在国内访问速度更快

---

## 📋 快速设置步骤（5分钟）

### 第一步：安装 Git（如果还没有）

1. 下载 Git：https://git-scm.com/download/win
2. 安装时选择默认选项
3. 安装完成后重启终端

### 第二步：初始化 Git 仓库

在项目根目录打开终端，执行：

```bash
# 初始化 Git
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit"
```

### 第三步：创建 GitLab 仓库

1. 访问 https://gitlab.com 并登录（或使用国内镜像 https://gitee.com）
2. 点击右上角 "+" → "New project / repository"
3. 选择 "Create blank project"
4. 输入项目名称（如：`blockchain-storage`）
5. 选择 **Public**（公开）或 **Private**（私有）
6. **不要**勾选 "Initialize repository with a README"
7. 点击 "Create project"

### 第四步：推送代码到 GitLab

```bash
# 添加远程仓库（替换 YOUR_USERNAME 和 REPO_NAME）
git remote add origin https://gitlab.com/YOUR_USERNAME/REPO_NAME.git

# 设置主分支
git branch -M main

# 推送代码
git push -u origin main
```

**如果使用 Gitee（国内 GitLab 替代）：**
```bash
# Gitee 的地址格式
git remote add origin https://gitee.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

### 第五步：在 Netlify 连接 GitLab

1. **登录 Netlify**
   - 访问 https://app.netlify.com
   - 登录你的账户

2. **导入项目**
   - 点击右上角 "Add new site" → "Import an existing project"
   - 选择 "GitLab"（或 "GitHub" 如果使用 Gitee，需要特殊配置）
   - 点击 "Authorize Netlify" 授权访问

3. **选择仓库**
   - 在列表中找到你的项目
   - 点击选择

4. **配置构建设置**
   - **Build command（构建命令）**：`npm run build`
   - **Publish directory（发布目录）**：`dist`
   - 其他保持默认

5. **部署**
   - 点击 "Deploy site"
   - 等待构建完成（约 1-2 分钟）

### 完成！🎉

现在，每次你修改代码后：

```bash
# 1. 提交更改
git add .
git commit -m "更新描述"

# 2. 推送到 GitLab
git push origin main

# 3. Netlify 自动检测并部署
# 等待 1-2 分钟，网站自动更新！
```

---

## 🔄 日常开发流程

```bash
# 修改代码后...

# 1. 查看更改
git status

# 2. 添加更改
git add .

# 3. 提交更改
git commit -m "更新功能描述"

# 4. 推送到 GitHub（自动触发 Netlify 部署）
git push origin main
```

---

## 🛠️ 备选方案：使用 Netlify CLI（半自动）

如果你不想使用 Git，可以使用 Netlify CLI：

### 安装 Netlify CLI

```bash
npm install -g netlify-cli
```

### 登录 Netlify

```bash
netlify login
```

### 使用部署脚本

运行项目根目录的 `快速部署.bat`：

```bash
快速部署.bat
```

这个脚本会：
1. 自动构建项目
2. 自动部署到 Netlify

**注意**：这仍然需要手动运行脚本，不是完全自动的。

---

## 📝 配置文件说明

项目已包含 `netlify.toml` 配置文件，Netlify 会自动读取：

- **构建命令**：`npm run build`
- **发布目录**：`dist`
- **路由配置**：单页应用路由重定向

---

## ❓ 常见问题

### Q: 推送代码后，Netlify 没有自动部署？
**A:** 检查以下几点：
1. Netlify 是否已连接 GitHub 仓库
2. 是否推送到 `main` 分支
3. Netlify 控制台 → Site settings → Build & deploy → Continuous Deployment 是否启用

### Q: 构建失败怎么办？
**A:** 
1. 查看 Netlify 的构建日志
2. 确保 `package.json` 中有 `build` 脚本
3. 检查依赖是否正确

### Q: 如何回滚到之前的版本？
**A:** 
1. 登录 Netlify 控制台
2. 进入 Deploys 页面
3. 找到之前的部署
4. 点击 "Publish deploy"

### Q: 可以使用 Gitee（码云）吗？
**A:** Netlify 默认支持 GitHub、GitLab、Bitbucket。如果使用 Gitee：
- **方案1（推荐）**：使用 GitLab.com（官方 GitLab，Netlify 原生支持）
- **方案2**：同时推送到 GitLab 和 Gitee，Netlify 连接 GitLab
- **方案3**：使用 Netlify CLI 手动部署

---

## 🎯 推荐工作流程

1. **开发**：在本地修改代码
2. **测试**：运行 `npm run dev` 本地测试
3. **提交**：`git add .` → `git commit -m "描述"`
4. **推送**：`git push origin main`
5. **自动部署**：Netlify 自动构建和部署
6. **完成**：1-2 分钟后网站自动更新

---

## 📚 更多资源

- [Netlify 官方文档](https://docs.netlify.com/)
- [Git 入门教程](https://git-scm.com/book/zh/v2)
- [GitLab 使用指南](https://docs.gitlab.com/)
- [Gitee 使用指南](https://gitee.com/help)

---

## 🌐 GitLab vs Gitee 选择

### GitLab.com（推荐）
- ✅ Netlify 原生支持
- ✅ 功能完整
- ✅ 全球访问
- ⚠️ 国内访问可能较慢

### Gitee（码云）
- ✅ 国内访问速度快
- ✅ 中文界面
- ⚠️ Netlify 不直接支持（需要特殊配置或使用 CLI）

**建议**：优先使用 GitLab.com，如果访问困难再考虑 Gitee + Netlify CLI 方案。

---

**提示**：推荐使用 Git + GitLab + Netlify 的方案，这是最专业、最自动化的方式！

