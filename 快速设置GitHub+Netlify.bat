@echo off
chcp 65001 >nul
echo ========================================
echo GitHub + Netlify 自动部署快速设置
echo ========================================
echo.

echo 这个脚本将帮助你完成以下步骤：
echo.
echo [1] 检查 Git 是否已安装
echo [2] 初始化 Git 仓库（如果还没有）
echo [3] 提供 GitHub 仓库创建和推送命令
echo [4] 提供 Netlify 连接指南
echo.

echo ========================================
echo 步骤 1: 检查 Git 状态
echo ========================================
echo.

where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] Git 未安装！
    echo.
    echo 请先安装 Git：
    echo 1. 访问：https://git-scm.com/download/win
    echo 2. 下载并安装
    echo 3. 安装完成后重启终端
    echo.
    pause
    exit /b 1
) else (
    echo [✓] Git 已安装
    git --version
)

echo.
echo ========================================
echo 步骤 2: 检查 Git 仓库状态
echo ========================================
echo.

if exist ".git" (
    echo [✓] Git 仓库已初始化
    echo.
    echo 当前分支：
    git branch 2>nul
    echo.
    echo 远程仓库：
    git remote -v 2>nul
    if %errorlevel% neq 0 (
        echo [提示] 还没有添加远程仓库
    )
) else (
    echo [提示] Git 仓库未初始化
    echo.
    set /p init=是否现在初始化？(y/n): 
    if /i "%init%"=="y" (
        echo.
        echo 正在初始化 Git 仓库...
        git init
        git add .
        git commit -m "Initial commit"
        echo.
        echo [✓] Git 仓库初始化完成
    )
)

echo.
echo ========================================
echo 步骤 3: GitHub 仓库设置
echo ========================================
echo.

echo 请按照以下步骤操作：
echo.
echo 1. 访问 https://github.com 并登录
echo 2. 点击右上角 "+" → "New repository"
echo 3. 输入仓库名称（如：blockchain-storage）
echo 4. 选择 Public 或 Private
echo 5. 不要勾选 "Initialize this repository with a README"
echo 6. 点击 "Create repository"
echo.

echo 创建仓库后，执行以下命令：
echo.
echo   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
echo   git branch -M main
echo   git push -u origin main
echo.

echo [重要] 如果推送时提示需要认证：
echo   1. GitHub → Settings → Developer settings → Personal access tokens
echo   2. 创建新 token，选择 repo 权限
echo   3. 推送时，密码输入 token（不是登录密码）
echo.
echo [重要] 如果遇到连接问题（Failed to connect to github.com）：
echo   1. 运行 "配置Git代理.bat" 配置代理（如果有 VPN/代理）
echo   2. 运行 "切换到SSH连接.bat" 尝试使用 SSH 连接
echo   3. 查看 "解决GitHub连接问题.md" 获取详细解决方案
echo   4. 或使用 "使用Gitee替代方案.md" 切换到 Gitee
echo.

echo ========================================
echo 步骤 4: Netlify 连接指南
echo ========================================
echo.

echo 推送代码到 GitHub 后：
echo.
echo 1. 访问 https://app.netlify.com 并登录
echo 2. 点击 "Add new site" → "Import an existing project"
echo 3. 选择 "GitHub"
echo 4. 授权 Netlify 访问
echo 5. 选择你的仓库
echo 6. 配置：
echo    - Build command: npm run build
echo    - Publish directory: dist
echo 7. 点击 "Deploy site"
echo.

echo ========================================
echo 完成！
echo ========================================
echo.

echo 设置完成后，以后只需：
echo   git add .
echo   git commit -m "更新描述"
echo   git push origin main
echo.
echo Netlify 会自动检测并部署！
echo.

pause

