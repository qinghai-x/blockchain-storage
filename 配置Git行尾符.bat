@echo off
chcp 65001 >nul
echo ========================================
echo 配置 Git 自动处理行尾符
echo ========================================
echo.

echo 这些警告是正常的，不会影响功能。
echo 但可以通过配置 Git 自动处理行尾符来消除警告。
echo.

echo 正在配置 Git 自动转换行尾符...
git config core.autocrlf true

echo.
echo 配置完成！
echo.
echo 现在可以继续提交代码：
echo   git commit -m "Initial commit"
echo   git branch -M main
echo   git push -u origin main
echo.

pause

