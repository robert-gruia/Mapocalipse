# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /code

# Copy the requirements file into the container
COPY requirements.txt .

# Install any necessary dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /code
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Set environment variables (optional)
ENV PYTHONUNBUFFERED=1

# Run the command to start Gunicorn with Uvicorn workers
CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && gunicorn -k uvicorn.workers.UvicornWorker Mapocalipse.asgi:application --bind 0.0.0.0:8000"]