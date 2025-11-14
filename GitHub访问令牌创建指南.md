# GitHub 访问令牌（Personal Access Token）创建指南

## 为什么需要访问令牌？

GitHub 从 2021 年 8 月起，不再支持使用密码进行 Git 操作。必须使用：
- **Personal Access Token（个人访问令牌）**（推荐）
- 或 **SSH 密钥**

---

## 创建访问令牌步骤

### 步骤 1：登录 GitHub

1. 访问：https://github.com
2. 登录你的账户

### 步骤 2：进入设置

1. 点击右上角你的头像
2. 选择 **"Settings"**（设置）

### 步骤 3：进入开发者设置

1. 在左侧菜单最下方，找到 **"Developer settings"**
2. 点击进入

### 步骤 4：创建新令牌

1. 在左侧菜单选择 **"Personal access tokens"**
2. 选择 **"Tokens (classic)"**
3. 点击 **"Generate new token"**
4. 选择 **"Generate new token (classic)"**

### 步骤 5：配置令牌

1. **Note（备注）**：输入令牌名称（如：`Netlify Deploy` 或 `本地开发`）

2. **Expiration（过期时间）**：
   - 选择过期时间（如：90 days、1 year）
   - 或选择 "No expiration"（永不过期，不推荐）

3. **Select scopes（选择权限）**：
   - 勾选 **`repo`**（完整仓库访问权限）
     - 这会自动勾选所有子权限
     - 包括：`repo:status`, `repo_deployment`, `public_repo` 等

4. 滚动到页面底部，点击 **"Generate token"**

### 步骤 6：复制令牌

1. **重要**：令牌只显示一次！
2. 立即复制并保存到安全的地方
3. 如果丢失，需要重新创建

---

## 使用访问令牌

### 方法一：推送时输入

```bash
# 推送代码
git push origin main

# 提示输入用户名：输入你的 GitHub 用户名
# 提示输入密码：输入刚才复制的 token（不是登录密码）
```

### 方法二：配置 Git 凭据存储（推荐）

#### Windows：

```bash
# 配置 Git 凭据存储
git config --global credential.helper wincred

# 第一次推送时输入 token
git push origin main
# 用户名：你的 GitHub 用户名
# 密码：你的 token
# 之后 Git 会记住凭据，不需要重复输入
```

#### Linux/Mac：

```bash
# 配置 Git 凭据存储
git config --global credential.helper store

# 第一次推送时输入 token
git push origin main
# 之后 Git 会记住凭据
```

### 方法三：在 URL 中包含 token（不推荐，不安全）

```bash
# 不推荐：token 会显示在命令历史中
git push https://YOUR_TOKEN@github.com/USERNAME/REPO.git main
```

---

## 在 Netlify 中使用访问令牌

### 连接 GitHub 时：

1. 在 Netlify 选择 "Import from Git" → "GitHub"
2. 点击 "Authorize Netlify"
3. 授权后，Netlify 会自动使用你的 GitHub 权限
4. **不需要手动输入 token**，Netlify 会通过 OAuth 自动处理

---

## 安全建议

1. **不要分享你的 token**
   - Token 就像密码，不要分享给他人
   - 不要在代码中硬编码 token

2. **定期更新 token**
   - 建议设置过期时间
   - 定期创建新 token 并删除旧的

3. **最小权限原则**
   - 只授予必要的权限
   - 如果只需要推送代码，只勾选 `repo` 权限

4. **如果 token 泄露**
   - 立即删除泄露的 token
   - 创建新 token
   - 更新所有使用旧 token 的地方

---

## 常见问题

### Q: 忘记保存 token 怎么办？
**A:** 需要重新创建新 token，旧的 token 无法再次查看。

### Q: token 过期了怎么办？
**A:** 创建新 token，更新 Git 凭据或重新输入。

### Q: 可以创建多个 token 吗？
**A:** 可以，建议为不同用途创建不同的 token（如：开发、部署、CI/CD）。

### Q: token 和密码有什么区别？
**A:** 
- Token 可以设置权限和过期时间
- Token 可以随时撤销
- Token 更安全，可以针对特定用途创建

---

## 验证 token 是否有效

```bash
# 测试推送
git push origin main

# 如果成功，说明 token 有效
# 如果失败，检查 token 是否正确或是否过期
```

---

## 删除 token

如果需要删除 token：

1. GitHub → Settings → Developer settings → Personal access tokens
2. 找到要删除的 token
3. 点击右侧的删除按钮
4. 确认删除

---

**提示**：创建 token 后，务必保存到安全的地方（如密码管理器）。

