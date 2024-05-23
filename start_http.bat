@echo off

if not exist .venv (
    python -m venv .venv
)

call .venv\Scripts\activate

for /f %%i in (requirements.txt) do (
    pip show %%i >nul 2>&1
    if errorlevel 1 pip install %%i
)

cd Mapocalipse
uvicorn Mapocalipse.asgi:application