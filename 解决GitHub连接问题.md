# 解决 GitHub 连接问题

## 问题描述

```
fatal: unable to access 'https://github.com/...': Failed to connect to github.com port 443
```

这通常是因为网络无法访问 GitHub（可能被防火墙阻止或网络限制）。

---

## 解决方案

### 方案一：使用代理（推荐，如果你有 VPN/代理）

如果你有 VPN 或代理服务：

1. **启用代理**
   - 确保 VPN/代理已连接并正常工作

2. **配置 Git 使用代理**
   ```bash
   # HTTP/HTTPS 代理（替换为你的代理地址和端口）
   git config --global http.proxy http://127.0.0.1:7890
   git config --global https.proxy http://127.0.0.1:7890
   
   # 如果使用 SOCKS5 代理
   git config --global http.proxy socks5://127.0.0.1:1080
   git config --global https.proxy socks5://127.0.0.1:1080
   ```

3. **测试连接**
   ```bash
   git push -u origin main
   ```

4. **如果不再需要代理，取消设置**
   ```bash
   git config --global --unset http.proxy
   git config --global --unset https.proxy
   ```

---

### 方案二：使用 SSH 代替 HTTPS（可能更稳定）

SSH 连接有时比 HTTPS 更稳定：

1. **生成 SSH 密钥**（如果还没有）
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   # 按 Enter 使用默认路径
   # 可以设置密码，也可以直接按 Enter 跳过
   ```

2. **复制公钥**
   ```bash
   # Windows PowerShell
   cat ~/.ssh/id_ed25519.pub | clip
   
   # 或手动打开文件复制
   notepad ~/.ssh/id_ed25519.pub
   ```

3. **添加到 GitHub**
   - 访问：https://github.com/settings/keys
   - 点击 "New SSH key"
   - Title：输入名称（如：`我的电脑`）
   - Key：粘贴刚才复制的公钥
   - 点击 "Add SSH key"

4. **修改远程仓库地址为 SSH**
   ```bash
   # 查看当前远程地址
   git remote -v
   
   # 修改为 SSH 地址（替换 YOUR_USERNAME 和 REPO_NAME）
   git remote set-url origin git@github.com:YOUR_USERNAME/REPO_NAME.git
   
   # 测试连接
   ssh -T git@github.com
   # 应该看到：Hi YOUR_USERNAME! You've successfully authenticated...
   
   # 推送
   git push -u origin main
   ```

---

### 方案三：使用 Gitee（国内替代方案）

如果 GitHub 无法访问，可以使用 Gitee（码云）：

1. **在 Gitee 创建仓库**
   - 访问：https://gitee.com
   - 登录并创建新仓库

2. **修改远程地址为 Gitee**
   ```bash
   # 删除 GitHub 远程仓库
   git remote remove origin
   
   # 添加 Gitee 远程仓库
   git remote add origin https://gitee.com/YOUR_USERNAME/REPO_NAME.git
   
   # 推送
   git push -u origin main
   ```

3. **在 Netlify 连接 Gitee**
   - Netlify 也支持 Gitee（需要手动配置）
   - 或者使用 Netlify CLI 手动部署

---

### 方案四：使用 GitHub 镜像（临时方案）

某些 GitHub 镜像可能可用：

```bash
# 使用镜像地址（不推荐，可能不稳定）
git remote set-url origin https://github.com.cnpmjs.org/YOUR_USERNAME/REPO_NAME.git
```

---

### 方案五：检查网络和 DNS

1. **测试网络连接**
   ```bash
   # 测试 GitHub 连接
   ping github.com
   
   # 测试 DNS 解析
   nslookup github.com
   ```

2. **修改 DNS**
   - 使用公共 DNS（如：8.8.8.8, 114.114.114.114）
   - 在 Windows 网络设置中修改 DNS 服务器

3. **检查防火墙**
   - 确保防火墙没有阻止 Git
   - 检查公司/学校网络是否有限制

---

## 推荐方案

### 如果你有 VPN/代理：
使用**方案一（代理）**，这是最稳定的方案。

### 如果你没有代理：
1. 先尝试**方案二（SSH）**，SSH 连接有时更稳定
2. 如果 SSH 也不行，使用**方案三（Gitee）**作为替代

---

## 快速测试脚本

创建一个测试脚本来检查连接：

```bash
# 测试 GitHub HTTPS 连接
curl -I https://github.com

# 测试 GitHub SSH 连接
ssh -T git@github.com
```

---

## 注意事项

1. **代理设置**：如果使用代理，确保代理服务正常运行
2. **SSH 密钥**：SSH 密钥一旦添加到 GitHub，就可以永久使用
3. **Gitee 限制**：Gitee 免费版有一些限制，但基本功能足够
4. **Netlify 支持**：Netlify 主要支持 GitHub、GitLab、Bitbucket，对 Gitee 支持有限

---

## 如果所有方案都不行

可以考虑：
1. 使用手机热点（可能网络环境不同）
2. 在朋友/同事的网络环境下操作
3. 使用云服务器（如阿里云、腾讯云）作为中转
4. 联系网络管理员检查网络限制

---

**提示**：如果选择使用 Gitee，我可以帮你配置 Netlify 与 Gitee 的连接（虽然支持有限）。

