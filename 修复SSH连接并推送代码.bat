@echo off
chcp 65001 >nul
echo ========================================
echo 修复 SSH 连接并推送代码到 GitHub
echo ========================================
echo.

echo 当前问题：SSH 密钥未配置，无法连接到 GitHub
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
    echo 3. Title：输入名称（如：我的电脑）
    echo 4. Key：粘贴公钥
    echo 5. 点击 "Add SSH key"
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
    echo 3. Title：输入名称（如：我的电脑）
    echo 4. Key：粘贴公钥
    echo 5. 点击 "Add SSH key"
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
        ssh-keygen -t ed25519 -C "%email%" -f "%USERPROFILE%\.ssh\id_ed25519" -N ""
        echo.
        echo [✓] SSH 密钥生成完成
        echo.
        echo 公钥内容：
        type "%USERPROFILE%\.ssh\id_ed25519.pub"
        echo.
        echo 请复制上面的公钥，然后：
        echo 1. 访问：https://github.com/settings/keys
        echo 2. 点击 "New SSH key"
        echo 3. Title：输入名称（如：我的电脑）
        echo 4. Key：粘贴公钥
        echo 5. 点击 "Add SSH key"
        echo.
    )
)

echo.
echo ========================================
echo 步骤 2: 测试 SSH 连接
echo ========================================
echo.

echo 添加公钥到 GitHub 后，按任意键继续测试连接...
pause >nul

echo.
echo 正在测试 SSH 连接...
ssh -T git@github.com
echo.

echo ========================================
echo 步骤 3: 推送代码到 GitHub
echo ========================================
echo.

echo 如果 SSH 连接成功，现在可以推送代码：
echo.
set /p push=是否现在推送代码到 GitHub？(y/n): 

if /i "%push%"=="y" (
    echo.
    echo 正在推送代码...
    git push -u origin main
    echo.
    if %errorlevel% equ 0 (
        echo [✓] 代码推送成功！
        echo.
        echo 现在可以返回 Netlify 配置页面：
        echo 1. 刷新页面
        echo 2. 在"要部署的分支"中选择 main
        echo 3. 完成配置
    ) else (
        echo [错误] 推送失败，请检查错误信息
    )
)

echo.
pause

