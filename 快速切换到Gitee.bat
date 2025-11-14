@echo off
chcp 65001 >nul
echo ========================================
echo 快速切换到 Gitee（码云）
echo ========================================
echo.

echo 如果 GitHub 无法访问，可以使用 Gitee 作为替代方案
echo.

echo 请确保：
echo [1] 已在 Gitee 创建仓库（https://gitee.com）
echo [2] 已登录 Gitee 账户
echo.

echo 请输入 Gitee 用户名：
set /p username=用户名: 

echo.
echo 请输入仓库名称：
set /p repo=仓库名: 

echo.
echo 正在切换远程仓库地址...
git remote remove origin 2>nul
git remote add origin https://gitee.com/%username%/%repo%.git

echo.
echo [✓] 已切换到 Gitee
echo.
echo 当前远程地址：
git remote -v
echo.

echo ========================================
echo 下一步操作
echo ========================================
echo.
echo 1. 推送代码到 Gitee：
echo    git push -u origin main
echo.
echo 2. 部署到 Netlify：
echo    由于 Netlify 对 Gitee 支持有限，推荐使用 Netlify CLI：
echo.
echo    npm install -g netlify-cli
echo    netlify login
echo    netlify init
echo    netlify deploy --prod
echo.
echo 详细说明请查看：使用Gitee替代方案.md
echo.

pause

