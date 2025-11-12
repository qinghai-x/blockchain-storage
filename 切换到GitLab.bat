@echo off
chcp 65001 >nul
echo ========================================
echo 切换到 GitLab 配置脚本
echo ========================================
echo.

echo [步骤 1] 检查当前分支...
git branch
echo.

echo [步骤 2] 重命名分支为 main（如果需要）...
git branch -M main
echo.

echo [步骤 3] 查看当前远程仓库...
git remote -v
echo.

echo [步骤 4] 请手动执行以下命令：
echo.
echo 1. 删除旧的远程仓库（如果存在）:
echo    git remote remove origin
echo.
echo 2. 添加 GitLab 远程仓库（替换 YOUR_USERNAME 和 REPO_NAME）:
echo    git remote add origin https://gitlab.com/YOUR_USERNAME/REPO_NAME.git
echo.
echo 3. 推送到 GitLab:
echo    git push -u origin main
echo.
echo 或者如果你想同时使用 Gitee 和 GitLab:
echo    git remote add gitlab https://gitlab.com/YOUR_USERNAME/REPO_NAME.git
echo    git remote add gitee https://gitee.com/xqh_817/blockchain-cloud-storage.git
echo    git push -u gitlab main
echo    git push -u gitee main
echo.

pause

