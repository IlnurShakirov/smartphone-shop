# backend/app/dependencies.py
from fastapi import Depends
from app.repositories import ItemRepository
from app.services import ItemService

def get_item_repository() -> ItemRepository:
    """Создает и возвращает экземпляр репозитория данных"""
    return ItemRepository()

def get_item_service(
    repository: ItemRepository = Depends(get_item_repository)
) -> ItemService:
    """Создает сервис и автоматически внедряет в него репозиторий через Depends"""
    return ItemService(repository)
