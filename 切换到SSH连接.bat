@echo off
chcp 65001 >nul
echo ========================================
echo 切换到 SSH 连接 GitHub
echo ========================================
echo.

echo 这个脚本将帮助你：
echo [1] 检查是否已有 SSH 密钥
echo [2] 生成新的 SSH 密钥（如果需要）
echo [3] 显示公钥（添加到 GitHub）
echo [4] 修改远程仓库地址为 SSH
echo.

echo ========================================
echo 步骤 1: 检查 SSH 密钥
echo ========================================
echo.

if exist "%USERPROFILE%\.ssh\id_ed25519.pub" (
    echo [✓] 找到 SSH 密钥：id_ed25519.pub
    echo.
    echo 公钥内容：
    type "%USERPROFILE%\.ssh\id_ed25519.pub"
    echo.
    echo 请复制上面的公钥，然后：
    echo 1. 访问：https://github.com/settings/keys
    echo 2. 点击 "New SSH key"
    echo 3. 粘贴公钥并保存
    echo.
) else if exist "%USERPROFILE%\.ssh\id_rsa.pub" (
    echo [✓] 找到 SSH 密钥：id_rsa.pub
    echo.
    echo 公钥内容：
    type "%USERPROFILE%\.ssh\id_rsa.pub"
    echo.
    echo 请复制上面的公钥，然后：
    echo 1. 访问：https://github.com/settings/keys
    echo 2. 点击 "New SSH key"
    echo 3. 粘贴公钥并保存
    echo.
) else (
    echo [提示] 未找到 SSH 密钥
    echo.
    set /p generate=是否生成新的 SSH 密钥？(y/n): 
    if /i "%generate%"=="y" (
        echo.
        echo 请输入你的邮箱（用于标识密钥）：
        set /p email=邮箱: 
        echo.
        echo 正在生成 SSH 密钥...
        ssh-keygen -t ed25519 -C "%email%"
        echo.
        echo [✓] SSH 密钥生成完成
        echo.
        echo 公钥内容：
        type "%USERPROFILE%\.ssh\id_ed25519.pub"
        echo.
        echo 请复制上面的公钥，然后：
        echo 1. 访问：https://github.com/settings/keys
        echo 2. 点击 "New SSH key"
        echo 3. 粘贴公钥并保存
        echo.
    )
)

echo.
echo ========================================
echo 步骤 2: 测试 SSH 连接
echo ========================================
echo.

echo 正在测试 SSH 连接...
ssh -T git@github.com
echo.

echo ========================================
echo 步骤 3: 修改远程仓库地址
echo ========================================
echo.

echo 当前远程仓库地址：
git remote -v
echo.

echo 是否修改为 SSH 地址？(y/n)
set /p change=: 

if /i "%change%"=="y" (
    echo.
    echo 请输入 GitHub 用户名：
    set /p username=用户名: 
    echo.
    echo 请输入仓库名称：
    set /p repo=仓库名: 
    echo.
    echo 正在修改远程地址...
    git remote set-url origin git@github.com:%username%/%repo%.git
    echo.
    echo [✓] 远程地址已修改为 SSH
    echo.
    echo 新的远程地址：
    git remote -v
    echo.
    echo 现在可以尝试推送：
    echo   git push -u origin main
    echo.
)

pause

