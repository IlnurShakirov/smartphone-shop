# backend/app/main.py
import os
import shutil
from typing import List
from fastapi import FastAPI, HTTPException, status, Depends, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

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
# Выведен на независимый префикс /media, чтобы не конфликтовать со слоями /items
@app.post("/media/upload")
def upload_product_image(file: UploadFile = File(...)):
    try:
        filename_orig = file.filename.lower().replace(' ', '_')
        safe_filename = f"upload_{filename_orig}"

        file_path = os.path.join(react_public_path, "images", "items", safe_filename)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return {"imageUrl": f"static/images/items/{safe_filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка сохранения файла: {str(e)}")


@app.get("/items", response_model=List[ItemSchema])
def get_all_items(service: ItemService = Depends(get_item_service)):
    return service.get_all_items()


@app.get("/items/{item_id}", response_model=ItemSchema)
def get_single_item(item_id: str, service: ItemService = Depends(get_item_service)):
    item = service.get_item_by_id(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return item


@app.post("/items", response_model=ItemSchema, status_code=status.HTTP_201_CREATED)
def create_item(item: ItemCreateSchema, service: ItemService = Depends(get_item_service)):
    return service.create_new_item(item.model_dump())


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
    return {"message": "Товар успешно удален"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)















