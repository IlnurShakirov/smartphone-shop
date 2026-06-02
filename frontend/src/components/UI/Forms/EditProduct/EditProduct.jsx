import { useState } from 'react'
import styles from './EditProduct.module.css'

const EditItem = ({ item, onEdit, onCancel }) => {
    // Инициализируем стейты из пропсов выбранного товара
    const [name, setName] = useState(item.name || '')
    const [price, setPrice] = useState(item.price || '')
    const [brand, setBrand] = useState(item.brand || '')
    const [description, setDescription] = useState(item.description || '')
    const [isAvailable, setIsAvailable] = useState(item.isAvailable ?? true)

    const handleSubmit = () => {
        // Конструируем объект для Pydantic-схемы бэкенда
        const updatedFields = {
            id: item.id,
            name,
            price: price ? parseFloat(price) : 0.0, // Переводим в число для FastAPI
            brand,
            imageUrl: item.imageUrl || 'static/no-image.jpg',
            description,
            isAvailable
        }

        // Передаем отдельно ID и объект (так удобнее для axios.put)
        onEdit(item.id, updatedFields)
    }

    return (
        <form className={styles.form}>
            <h3 className={styles.formTitle}>Редактировать товар</h3>

            <input
               type="text"
               value={name}
               placeholder='Название'
               onChange={e => setName(e.target.value)}
               required
            />

            {/* Добавили обязательное поле цены */}
            <input
               type="number"
               value={price}
               placeholder='Цена (₽)'
               min="0"
               step="0.01"
               onChange={e => setPrice(e.target.value)}
               required
            />

            {/* Добавили поле бренда */}
            <input
               type="text"
               value={brand}
               placeholder='Бренд'
               onChange={e => setBrand(e.target.value)}
            />

            <textarea
               placeholder='Описание'
               value={description}
               onChange={e => setDescription(e.target.value)}
               rows="3"
            ></textarea>

            <div className={styles.checkboxContainer}>
              <input
                 type='checkbox'
                 id='editIsAvailable'
                 checked={isAvailable}
                 onChange={e => setIsAvailable(e.target.checked)}
               />
               <label htmlFor='editIsAvailable'>В наличии на складе</label>
            </div>

            <div className={styles.buttonGroup}>
                <button type='button' onClick={handleSubmit} className={styles.saveButton}>
                    Сохранить
                </button>
                {/* Кнопка отмены, если пользователь передумал менять товар */}
                {onCancel && (
                    <button type='button' onClick={onCancel} className={styles.cancelButton}>
                        Отмена
                    </button>
                )}
            </div>
        </form>
    )
}

export default EditItem
