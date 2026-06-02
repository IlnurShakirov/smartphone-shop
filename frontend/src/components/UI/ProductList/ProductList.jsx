import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductList.module.css';

const ProductList = ({ items, itemsLoading, itemsError, onEdit, onDelete }) => {
  return (
    <div className={styles.listWrapper}>
      <h1 className={styles.listTitle}>Список вещей</h1>

      {itemsError && <div className={styles.errorMessage}>{itemsError}</div>}

      <ul className={styles.ulList}>
        {
          itemsLoading ? (
            <div className={styles.loadingBlock}>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Загрузка вещей...</span>
              </div>
            </div>
          ) : (
            !itemsError && items.length > 0 ? (
              items.map(item => (
                   <ProductCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
              ))
            ) : (
              !itemsError && <div className={styles.emptyMessage}>Список пуст</div>
            )
          )
        }
      </ul>
    </div>
  )
}

export default ProductList;






