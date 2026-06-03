import os
import datetime
import shutil
from typing import List
from fastapi import FastAPI, HTTPException, status, Depends, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import requests  # ⚡ Добавлено для отправки логов по сети Docker в Seq

# Импортируем схемы и зависимости
from app.schemas import ItemSchema, ItemCreateSchema, SiteDataSchema
from app.services import ItemService
from app.dependencies import get_item_service

app = FastAPI(title="Smartphone Shop API (Layered Architecture)")

# --- НАСТРОЙКА CORS ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🌟 ЛОГИРОВАНИЕ В СЕРВЕР СТРУКТУРИРОВАННЫХ ЛОГОВ (SEQ) 🌟
SEQ_URL = os.getenv("SEQ_SERVER_URL", "http://shop_seq:5341") + "/api/events/raw?clef"


def log_to_seq(level: str, message: str, properties: dict = None):
    """Отправляет структурированный лог в контейнер Seq по сети Docker"""
    payload = {
        "@t": datetime.datetime.utcnow().isoformat() + "Z",  # Метка времени UTC
        "@l": level,  # Уровень лога (Information/Error)
        "@m": message,  # Текст сообщения
        "Application": "SmartphoneShopBackend",  # Свойство: Имя приложения
        **(properties or {})  # Динамические свойства JSON
    }
    try:
        requests.post(SEQ_URL, json=payload, timeout=0.5)
    except Exception:
        pass  # Игнорируем сбои сети, чтобы логирование не ломало работу сайта


# ⚡ MIDDLEWARE ДЛЯ АВТОМАТИЧЕСКОГО СБОРА HTTP-ЛОГОВ
@app.middleware("http")
async def http_logging_middleware(request: Request, call_next):
    start_time = datetime.datetime.utcnow()

    # Обрабатываем сам запрос
    response = await call_next(request)

    # Рассчитываем время выполнения
    duration = (datetime.datetime.utcnow() - start_time).total_seconds() * 1000.0

    # Формируем свойства структурированного лога
    log_properties = {
        "Method": request.method,
        "Path": request.url.path,
        "StatusCode": response.status_code,
        "ClientIP": request.client.host if request.client else "unknown",
        "DurationMs": round(duration, 2)
    }

    # Выбираем уровень лога в зависимости от HTTP-статуса
    log_level = "Information" if response.status_code < 400 else "Warning"

    # Отправляем структурированное событие в Seq
    log_to_seq(
        level=log_level,
        message=f"HTTP {request.method} {request.url.path} returned {response.status_code} in {round(duration, 2)}ms",
        properties=log_properties
    )

    return response


# --- ДИНАМИЧЕСКОЕ ПОДКЛЮЧЕНИЕ ПАПКИ PUBLIC ---
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))  # папка app
BACKEND_DIR = os.path.dirname(CURRENT_DIR)  # папка backend
react_public_path = os.path.join(BACKEND_DIR, "public").replace("\\", "/")

if os.path.exists(react_public_path):
    app.mount("/static", StaticFiles(directory=react_public_path), name="static")
    print(f"\n✅ СТАТИКА ПОДКЛЮЧЕНА ИЗ:\n👉 {react_public_path}\n")
else:
    print(f"\n❌ ОШИБКА: Папка со статикой не найдена по пути: {react_public_path}\n")

# --- ДАННЫЕ САЙТА ---
fake_site_data = {
    "logo": "static/images/site/mobile-logo.png",
    "background": "static/images/site/smartphone-background.jpg",
}


# --- ЭНДПОИНТЫ API ---

@app.get("/site", response_model=SiteDataSchema)
def get_site_data():
    return fake_site_data


# 🌟 ИЗОЛИРОВАННЫЙ ЭНДПОИНТ ДЛЯ ЗАГРУЗКИ КАРТИНКИ
@app.post("/media/upload")
def upload_product_image(file: UploadFile = File(...)):
    try:
        filename_orig = file.filename.lower().replace(' ', '_')
        safe_filename = f"upload_{filename_orig}"

        file_path = os.path.join(react_public_path, "images", "items", safe_filename)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Логируем успешное сохранение файла
        log_to_seq("Information", f"Файл {safe_filename} успешно сохранен на сервере", {"Filename": safe_filename})

        return {"imageUrl": f"static/images/items/{safe_filename}"}
    except Exception as e:
        log_to_seq("Error", f"Ошибка сохранения файла: {str(e)}", {"Exception": str(e)})
        raise HTTPException(status_code=500, detail=f"Ошибка сохранения файла: {str(e)}")


@app.get("/items", response_model=List[ItemSchema])
def get_all_items(service: ItemService = Depends(get_item_service)):
    return service.get_all_items()


@app.get("/items/{item_id}", response_model=ItemSchema)
def get_single_item(item_id: str, service: ItemService = Depends(get_item_service)):
    item = service.get_item_by_id(item_id)
    if not item:
        log_to_seq("Warning", f"Запрошен несуществующий товар с ID: {item_id}", {"ItemId": item_id})
        raise HTTPException(status_code=404, detail="Товар не найден")
    return item


@app.post("/items", response_model=ItemSchema, status_code=status.HTTP_201_CREATED)
def create_item(item: ItemCreateSchema, service: ItemService = Depends(get_item_service)):
    created_item = service.create_new_item(item.model_dump())
    # Логируем создание нового устройства
    log_to_seq("Information", f"Создан новый товар: {item.name}", {"ItemName": item.name, "Price": item.price})
    return created_item


@app.put("/items/{item_id}", response_model=ItemSchema)
def update_item(item_id: str, updated_item: ItemSchema, service: ItemService = Depends(get_item_service)):
    item = service.update_smartphone(item_id, updated_item.model_dump())
    if not item:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return updated_item


@app.delete("/items/{item_id}")
def delete_item(item_id: str, service: ItemService = Depends(get_item_service)):
    success = service.delete_smartphone(item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Товар не найден")
    log_to_seq("Information", f"Товар удален из базы данных", {"DeletedItemId": item_id})
    return {"message": "Товар успешно удален"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
















