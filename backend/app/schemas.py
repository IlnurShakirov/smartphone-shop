# backend/app/schemas.py
from typing import Optional
from pydantic import BaseModel

# Схема для отображения товара клиенту (React)
class ItemSchema(BaseModel):
    id: str
    name: str
    price: float
    brand: Optional[str] = None
    imageUrl: Optional[str] = None
    description: Optional[str] = None
    isAvailable: bool = True

    class Config:
        # Позволяет Pydantic автоматически читать данные из ORM-моделей SQLAlchemy
        from_attributes = True

# Схема для создания товара (без ID, его сгенерирует БД)
class ItemCreateSchema(BaseModel):
    name: str
    price: float
    brand: Optional[str] = None
    imageUrl: Optional[str] = "static/no-image.jpg"
    description: Optional[str] = None
    isAvailable: bool = True

# Схема для данных сайта
class SiteDataSchema(BaseModel):
    logo: str
    background: str

    class Config:
        from_attributes = True
