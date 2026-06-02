import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // Добавили роутер
import 'bootstrap/dist/css/bootstrap.min.css'    // Ваш Bootstrap
import './index.css'                            // Ваши стили
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Обязательно оборачиваем App в BrowserRouter для работы ссылок и страниц */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
