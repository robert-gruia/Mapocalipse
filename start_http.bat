REM Activation of the virtual environment
REM cd /d %~dp0
call .venv\Scripts\activate

REM Start the server
cd Mapocalipse
python manage.py runserver