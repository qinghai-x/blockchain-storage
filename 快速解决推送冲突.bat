@echo off
chcp 65001 >nul
echo ========================================
echo 解决 Git 推送冲突
echo ========================================
echo.

echo 检测到远程仓库包含本地没有的提交。
echo 需要先合并远程更改，然后再推送。
echo.

echo 请选择操作：
echo.
echo [1] 合并远程更改（推荐，保留远程所有内容）
echo [2] 强制推送（会覆盖远程，谨慎使用）
echo.

set /p choice=请输入选项 (1 或 2): 

if "%choice%"=="1" (
    echo.
    echo 正在拉取并合并远程更改...
    git pull origin main --allow-unrelated-histories
    echo.
    echo 如果出现冲突，请手动解决后执行：
    echo   git add .
    echo   git commit -m "解决合并冲突"
    echo.
    echo 然后推送：
    echo   git push -u origin main
) else if "%choice%"=="2" (
    echo.
    echo ⚠️  警告：强制推送会覆盖远程仓库的所有内容！
    echo.
    set /p confirm=确定要继续吗？(yes/no): 
    if /i "%confirm%"=="yes" (
        echo.
        echo 正在强制推送...
        git push -u origin main --force-with-lease
        echo.
        echo 推送完成！
    ) else (
        echo 已取消操作。
    )
) else (
    echo 无效选项！
)

echo.
pause

