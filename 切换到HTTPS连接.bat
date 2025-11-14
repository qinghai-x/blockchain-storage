@echo off
chcp 65001 >nul
echo ========================================
echo 切换到 HTTPS 连接 GitHub
echo ========================================
echo.

echo 如果 SSH 配置困难，可以切换到 HTTPS 连接
echo.

echo 当前远程地址：
git remote -v
echo.

echo 是否切换到 HTTPS？(y/n)
set /p change=: 

if /i "%change%"=="y" (
    echo.
    echo 请输入 GitHub 用户名：
    set /p username=用户名: 
    echo.
    echo 请输入仓库名称：
    set /p repo=仓库名: 
    echo.
    echo 正在切换到 HTTPS...
    git remote set-url origin https://github.com/%username%/%repo%.git
    echo.
    echo [✓] 已切换到 HTTPS
    echo.
    echo 新的远程地址：
    git remote -v
    echo.
    echo ========================================
    echo 下一步：推送代码
    echo ========================================
    echo.
    echo 推送代码时：
    echo   用户名：输入你的 GitHub 用户名
    echo   密码：输入 Personal Access Token（不是登录密码）
    echo.
    echo 如果还没有 Token：
    echo   1. 访问：https://github.com/settings/tokens
    echo   2. 点击 "Generate new token (classic)"
    echo   3. 选择 repo 权限
    echo   4. 生成并复制 token
    echo.
    echo 现在可以推送：
    echo   git push -u origin main
    echo.
)

pause

