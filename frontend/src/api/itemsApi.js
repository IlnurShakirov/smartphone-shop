import axios from 'axios'

// Заменяем жесткий адрес на динамическую переменную окружения Vite
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Чистые стрелочные функции без лишних слэшей
export const getAllItemsApi = () => axios.get(`${API_URL}/items`)
export const getItemApi = (id) => axios.get(`${API_URL}/items/${id}`)
export const createItemApi = (newItem) => axios.post(`${API_URL}/items`, newItem)
export const updateItemApi = (id, editedItem) => axios.put(`${API_URL}/items/${id}`, editedItem)
export const deleteItemApi = (id) => axios.delete(`${API_URL}/items/${id}`)


