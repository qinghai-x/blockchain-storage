# 使用 Gitee（码云）替代 GitHub

如果 GitHub 无法访问，可以使用 Gitee（码云）作为替代方案。

---

## 步骤一：在 Gitee 创建仓库

1. **访问 Gitee**
   - 访问：https://gitee.com
   - 登录你的账户（如果没有，先注册）

2. **创建新仓库**
   - 点击右上角 "+" → "新建仓库"
   - 输入仓库名称（如：`blockchain-storage`）
   - 选择**公开**或**私有**
   - **不要**勾选 "使用 Readme 文件初始化这个仓库"
   - 点击 "创建"

---

## 步骤二：修改本地 Git 远程地址

```bash
# 查看当前远程地址
git remote -v

# 删除 GitHub 远程仓库
git remote remove origin

# 添加 Gitee 远程仓库（替换 YOUR_USERNAME 和 REPO_NAME）
git remote add origin https://gitee.com/YOUR_USERNAME/REPO_NAME.git

# 推送到 Gitee
git push -u origin main
```

---

## 步骤三：在 Netlify 连接 Gitee

### 方法一：使用 Netlify CLI 手动部署（推荐）

1. **安装 Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **登录 Netlify**
   ```bash
   netlify login
   ```

3. **初始化站点**
   ```bash
   netlify init
   ```
   - 选择 "Create & configure a new site"
   - 输入站点名称
   - 构建命令：`npm run build`
   - 发布目录：`dist`

4. **部署**
   ```bash
   netlify deploy --prod
   ```

5. **以后每次更新**
   ```bash
   # 推送到 Gitee
   git push origin main
   
   # 部署到 Netlify
   netlify deploy --prod
   ```

### 方法二：使用 GitHub Actions + Gitee 镜像（高级）

如果你有 GitHub 账户但无法直接访问，可以：
1. 在 Gitee 设置中启用 "GitHub 仓库镜像"
2. 自动同步到 GitHub
3. 在 Netlify 连接 GitHub（通过镜像）

---

## 方法三：使用 GitLab（如果 Gitee 也不可用）

GitLab 也支持 Netlify 自动部署：

1. **创建 GitLab 仓库**
   - 访问：https://gitlab.com（或国内镜像）
   - 创建新项目

2. **推送代码**
   ```bash
   git remote set-url origin https://gitlab.com/YOUR_USERNAME/REPO_NAME.git
   git push -u origin main
   ```

3. **在 Netlify 连接 GitLab**
   - Netlify → Add new site → Import from Git → GitLab
   - 授权并选择仓库

---

## 快速切换脚本

创建一个批处理文件来快速切换：

```batch
@echo off
chcp 65001 >nul
echo 切换到 Gitee
echo.
echo 请输入 Gitee 用户名：
set /p username=用户名: 
echo.
echo 请输入仓库名称：
set /p repo=仓库名: 
echo.
git remote remove origin
git remote add origin https://gitee.com/%username%/%repo%.git
echo.
echo [✓] 已切换到 Gitee
echo.
echo 现在可以推送：
echo   git push -u origin main
pause
```

---

## 注意事项

1. **Gitee 限制**
   - 免费版仓库有大小限制
   - 某些功能可能需要付费

2. **Netlify 支持**
   - Netlify 主要支持 GitHub、GitLab、Bitbucket
   - 对 Gitee 的直接支持有限
   - 推荐使用 Netlify CLI 手动部署

3. **自动部署**
   - 使用 Netlify CLI 可以实现半自动部署
   - 每次推送后运行 `netlify deploy --prod`

---

## 推荐方案

1. **如果有代理/VPN**：继续使用 GitHub + Netlify 自动部署
2. **如果没有代理**：
   - 使用 Gitee + Netlify CLI 手动部署
   - 或使用 GitLab + Netlify 自动部署

---

**提示**：如果选择 Gitee，我可以帮你设置 Netlify CLI 自动部署脚本。

