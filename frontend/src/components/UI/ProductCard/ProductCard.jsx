import { useState } from 'react'
import { BsTrash3Fill } from 'react-icons/bs'
import { FaEdit } from "react-icons/fa"
import { Link } from 'react-router-dom'

import EditItem from '@components/UI/Forms/EditProduct'
import styles from './ProductCard.module.css'

const API_URL = import.meta.env.VITE_API_URL

const ProductCard = ({ item, onEdit, onDelete }) => {
    const [editFormVisible, setEditFormVisible] = useState(false)

    return (
     <li className={styles.cardItem}>
        <div className={styles.controls}>
            {/* Иконка удаления с подтверждением */}
            <BsTrash3Fill
              title="Удалить"
              className={styles.deleteIcon}
              onClick={() => confirm("Вы уверены, что хотите удалить эту вещь?") && onDelete(item.id)}
              size={24}
              color="#ff3860"
            />
            {/* Иконка переключения формы редактирования */}
            <FaEdit
              title="Редактировать"
              className={styles.editIcon}
              onClick={() => setEditFormVisible(!editFormVisible)}
              size={24}
              color="#00d1b2"
            />
            <Link to={`/items/${item.id}`} className={styles.itemLink}>
              <strong>{item.name}</strong>
            </Link>
        </div>

        <div className={styles.imgContainer}>
            <img
              className={styles.itemImg}
              src={item.imageUrl ? `${API_URL}/${item.imageUrl}` : `${API_URL}/static/no-image.jpg`}
              alt={item.imageUrl ? "Фото вещи" : 'Нет фото'}
            />
        </div>
        <div className={styles.description}>{item.description}</div>
        <div className={styles.price}>Цена: {item.price?.toLocaleString('ru-RU')} ₽</div>
        <div className={styles.availability}>
            {item.isAvailable ? " ✅ (В наличии)" : " ❌ (Нет на складе)"}
        </div>

        {/* Форма редактирования, открывающаяся прямо внутри карточки */}
        {editFormVisible && (
            <div className={styles.editFormWrapper}>
                <EditItem
                   item={item}
                   onEdit={(id, updatedData) => {
                      onEdit(id, updatedData);
                      setEditFormVisible(false); // Закрываем форму после сохранения
                   }}
                   onCancel={() => setEditFormVisible(false)}
                />
            </div>
        )}
     </li>
    )
}

export default ProductCard
