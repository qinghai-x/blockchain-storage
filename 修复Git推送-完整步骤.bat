@echo off
chcp 65001 >nul
echo ========================================
echo Git 推送问题修复脚本
echo ========================================
echo.

echo [步骤 1] 检查 Git 状态...
git status
echo.

echo [步骤 2] 检查当前分支...
git branch
echo.

echo [步骤 3] 检查是否有提交记录...
git log --oneline -5
echo.

echo ========================================
echo 如果上面显示 "fatal: your current branch 'xxx' has no commits yet"
echo 说明还没有提交过代码，需要先提交
echo ========================================
echo.

echo 请按照以下步骤操作：
echo.
echo 1. 如果有未提交的更改，执行：
echo    git add .
echo    git commit -m "Initial commit"
echo.
echo 2. 检查分支名称：
echo    git branch
echo.
echo 3. 如果分支是 master，重命名为 main：
echo    git branch -M main
echo.
echo 4. 如果还没有分支，创建 main 分支：
echo    git checkout -b main
echo.
echo 5. 推送到远程仓库：
echo    git push -u origin main
echo.

pause

