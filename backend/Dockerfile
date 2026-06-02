FROM python:3.11-slim

WORKDIR /app

# Добавляем python-multipart и aiofiles в список установки
RUN pip install --no-cache-dir uvicorn fastapi pydantic sqlalchemy psycopg2-binary python-multipart aiofiles

COPY . .

CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

