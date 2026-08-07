@echo off
title Industrial AI Backend Server

echo ============================================
echo       Industrial AI Backend Starting...
echo ============================================
echo.

call venv\Scripts\activate

echo Backend Server Running...
echo.

uvicorn app.main:app --reload

pause