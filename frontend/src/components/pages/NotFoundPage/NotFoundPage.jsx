import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => (
  <div className={styles.wrapper}>
    <div className={styles.centerBlock}>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>Страница не найдена</p>
      {/* Используем Link для мгновенного роутинга без перезагрузки */}
      <Link to="/" className={styles.backLink}>
        ← На главную
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
