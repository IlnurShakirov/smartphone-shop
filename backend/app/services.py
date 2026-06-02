# backend/app/services.py
from typing import List, Optional
from app.repositories import ItemRepository


class ItemService:
    """Слой бизнес-логики для обработки данных о смартфонах"""

    def __init__(self, item_repository: ItemRepository):
        # Внедряем репозиторий через конструктор (Dependency Injection)
        self.repository = item_repository

    def get_all_items(self) -> List[dict]:
        # Просто запрашиваем список у репозитория
        return self.repository.get_all()

    def get_item_by_id(self, item_id: str) -> Optional[dict]:
        return self.repository.get_by_id(item_id)

    def create_new_item(self, item_data: dict) -> dict:
        # Здесь в будущем можно добавить проверки (например, не занято ли имя)
        return self.repository.create(item_data)

    def update_smartphone(self, item_id: str, item_data: dict) -> Optional[dict]:
        return self.repository.update(item_id, item_data)

    def delete_smartphone(self, item_id: str) -> bool:
        return self.repository.delete(item_id)
