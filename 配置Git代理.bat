@echo off
chcp 65001 >nul
echo ========================================
echo 配置 Git 使用代理
echo ========================================
echo.

echo 这个脚本将帮助配置 Git 使用代理来访问 GitHub
echo.

echo 请选择代理类型：
echo [1] HTTP/HTTPS 代理（如：127.0.0.1:7890）
echo [2] SOCKS5 代理（如：127.0.0.1:1080）
echo [3] 取消代理设置
echo [4] 查看当前代理设置
echo.

set /p choice=请输入选项 (1-4): 

if "%choice%"=="1" (
    echo.
    set /p proxy_host=请输入代理地址（如：127.0.0.1）: 
    set /p proxy_port=请输入代理端口（如：7890）: 
    echo.
    echo 正在配置 HTTP/HTTPS 代理...
    git config --global http.proxy http://%proxy_host%:%proxy_port%
    git config --global https.proxy http://%proxy_host%:%proxy_port%
    echo.
    echo [✓] 代理配置完成！
    echo.
    echo 测试连接：
    echo   git ls-remote https://github.com/qinghai-x/blockchain-storage.git
    echo.
) else if "%choice%"=="2" (
    echo.
    set /p proxy_host=请输入代理地址（如：127.0.0.1）: 
    set /p proxy_port=请输入代理端口（如：1080）: 
    echo.
    echo 正在配置 SOCKS5 代理...
    git config --global http.proxy socks5://%proxy_host%:%proxy_port%
    git config --global https.proxy socks5://%proxy_host%:%proxy_port%
    echo.
    echo [✓] 代理配置完成！
    echo.
    echo 测试连接：
    echo   git ls-remote https://github.com/qinghai-x/blockchain-storage.git
    echo.
) else if "%choice%"=="3" (
    echo.
    echo 正在取消代理设置...
    git config --global --unset http.proxy
    git config --global --unset https.proxy
    echo.
    echo [✓] 代理设置已取消
    echo.
) else if "%choice%"=="4" (
    echo.
    echo 当前代理设置：
    echo.
    git config --global --get http.proxy
    git config --global --get https.proxy
    echo.
) else (
    echo.
    echo [错误] 无效的选项
    echo.
)

pause

