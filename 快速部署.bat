@echo off
chcp 65001 >nul
echo ========================================
echo Netlify 快速部署脚本
echo ========================================
echo.

echo [1/3] 构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo 构建失败！
    pause
    exit /b 1
)

echo.
echo [2/3] 检查 Netlify CLI...
where netlify >nul 2>&1
if %errorlevel% neq 0 (
    echo Netlify CLI 未安装，正在安装...
    call npm install -g netlify-cli
    if %errorlevel% neq 0 (
        echo 安装失败！请手动运行: npm install -g netlify-cli
        pause
        exit /b 1
    )
)

echo.
echo [3/3] 部署到 Netlify...
echo 提示：如果是第一次部署，请先运行: netlify login
echo.
call netlify deploy --prod

echo.
echo ========================================
echo 部署完成！
echo ========================================
pause

