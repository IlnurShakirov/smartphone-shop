import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';

import HomePage from '@pages/HomePage'
import ProductDetailPage from '@pages/ProductDetailPage';
import NotFoundPage from '@pages/NotFoundPage';
import ProfilePage from '@pages/ProfilePage';
import AboutPage from '@pages/AboutPage';

import { getAllItemsApi, createItemApi, updateItemApi, deleteItemApi } from './api/itemsApi.js';

const API_URL = import.meta.env.VITE_API_URL

function App() {
  const [items, setItems] = useState([])
  const [siteData, setSiteData] = useState(null)
  const [itemsLoading, setItemsLoading] = useState(true)
  const [itemsError, setItemsError] = useState(null)

  useEffect(() => {
    getAllItemsApi()
      .then(response => {
        setItems(response.data)
        setItemsLoading(false)
      })
      .catch(error => {
        console.error("Ошибка при получении данных:", error)
        setItemsLoading(false)
        const errMsg =
          error.message === "Network Error" ? "Ошибка сети" :
          error.response?.status === 404 ? "Ресурс не найден" :
          "Повторите попытку позже"
        setItemsError(`Ошибка загрузки вещей: ${errMsg}`)
      })

    axios.get(`${API_URL}/site`)
      .then(response => setSiteData(response.data))
      .catch(err => console.error("Ошибка загрузки настроек сайта:", err))
  }, [])

  // Принимаем готовый валидный JSON-объект, содержащий уже созданный путь картинки
  const addProduct = (newProduct) => {
    createItemApi(newProduct)
      .then(response => {
        setItems(prevItems => [...prevItems, response.data])
      })
      .catch(error => {
        console.error("Ошибка добавления товара на сервер:", error)
        alert("Не удалось сохранить товар на сервере.")
      })
  }

  const editItem = (id, editedItem) => {
    updateItemApi(id, editedItem)
      .then(response => {
        setItems(prevItems => prevItems.map(item => item.id === id ? response.data : item))
      })
      .catch(error => {
        console.error("Ошибка обновления товара на сервере:", error)
        alert("Не удалось обновить данные на сервере.")
      })
  }

  const deleteItem = async (id) => {
    try {
      await deleteItemApi(id)
      setItems(prevItems => prevItems.filter(item => item.id !== id))
    }
    catch (error) {
      alert(`Ошибка удаления: ${error.message}`)
    }
  }

  const backgroundStyle = siteData?.background
    ? {
        backgroundImage: `url(${API_URL}/${siteData.background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh'
      }
    : { minHeight: '100vh' }

  return (
   <div style={backgroundStyle}>
      <Routes>
        <Route path="/" element={
          <HomePage
            items={items}
            siteData={siteData}
            itemsLoading={itemsLoading}
            itemsError={itemsError}
            onAdd={addProduct}
            onEdit={editItem}
            onDelete={deleteItem}
          />
        } />
        <Route path="/items/:id" element={<ProductDetailPage />} />
        <Route path="/profile" element={<ProfilePage siteData={siteData} />} />
        <Route path="/about" element={<AboutPage siteData={siteData} />} />
        <Route path="*" element={<NotFoundPage siteData={siteData} />} />
      </Routes>
   </div>
  )
}

export default App






