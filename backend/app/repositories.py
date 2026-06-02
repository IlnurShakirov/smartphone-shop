# backend/app/repositories.py
import uuid
from typing import List, Optional

# Временная база данных, изолированная внутри слоя данных
_fake_items_db = [
    {
        "id": "1",
        "name": "Xiaomi Redmi 10",
        "price": 14990.0,
        "brand": "Xiaomi",
        "imageUrl": "static/images/items/xiaomi-redmi-10.jpg",
        "description": "64GB, Серый, Экран 90Hz",
        "isAvailable": True
    },
    {
        "id": "2",
        "name": "iPhone 15 Pro (Демо)",
        "price": 99990.0,
        "brand": "Apple",
        "imageUrl": "static/no-image.jpg",
        "description": "128GB, Черный Титан",
        "isAvailable": False
    },
]


class ItemRepository:
    """Репозиторий для управления товарами в базе данных"""

    def get_all(self) -> List[dict]:
        return _fake_items_db

    def get_by_id(self, item_id: str) -> Optional[dict]:
        for item in _fake_items_db:
            if item["id"] == item_id:
                return item
        return None

    def create(self, item_data: dict) -> dict:
        item_data["id"] = str(uuid.uuid4())
        _fake_items_db.append(item_data)
        return item_data

    def update(self, item_id: str, item_data: dict) -> Optional[dict]:
        for index, item in enumerate(_fake_items_db):
            if item["id"] == item_id:
                _fake_items_db[index] = item_data
                return item_data
        return None

    def delete(self, item_id: str) -> bool:
        for index, item in enumerate(_fake_items_db):
            if item["id"] == item_id:
                del _fake_items_db[index]
                return True
        return False
