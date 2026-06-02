import { useState, useEffect } from 'react' 
import { useParams, Link } from 'react-router-dom'

import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

import Header from '@components/UI/Header'

import styles from './ProductDetailPage.module.css'

import { getItemApi } from '@/api/itemsApi.js'

const ProductDetailPage = () => {
  const {id} = useParams()

  const [item, setItem] = useState(null)
  const [siteData, setSiteData] = useState(null)
  const [itemLoading, setItemLoading] = useState(true)
  const [itemError, setItemError] = useState(null)
  
  useEffect(() => {

    axios.get(`${API_URL}/site`)
      .then(response => setSiteData(response.data))
      .catch(err => console.error("Ошибка загрузки лого:", err))

    getItemApi(id)
        .then(response => {
          setItem(response.data)
          setItemLoading(false)
        })
        .catch(e => {
          console.error('Ошибка загрузки вещи:', e)
          setItemError('Ошибка! Не удалось загрузить вещь')
          setItemLoading(false)
        })
  }, [id])
  
 
  return (
      <>
         <Header logo={siteData?.logo} />

        {
          itemLoading ? (
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Загрузка вещи...</span>
            </div>
          ) : itemError ? (
              <div>{itemError}</div>
          ) : (    
              <div className={styles.itemDetail}> 
                  <Link to="/"> На главную</Link>
                  <h1>{item.name}</h1>
                  <p>{item.description}</p>
                  <p>ЦЕНА: {item.price} $</p>
                  <div className={styles.availability}>
                     {item.isAvailable ? 'Есть в наличии' : 'Нет в наличии'}
                  </div>
              </div>
          )
        }
      </>      
  )
}

export default ProductDetailPage