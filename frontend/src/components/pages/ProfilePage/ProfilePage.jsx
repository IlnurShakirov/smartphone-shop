import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@components/UI/Header';
import styles from './ProfilePage.module.css';

const ProfilePage = ({ siteData }) => {
  return (
    <div className={styles.pageWrapper}>
      {/* Динамический логотип из FastAPI */}
      <Header logo={siteData?.logo} />

      <main className={styles.container}>
        <h1 className={styles.title}>Мой профиль</h1>
        <p className={styles.description}>Добро пожаловать в личный кабинет!</p>

        <div className={styles.navigation}>
          <Link to="/" className={styles.homeLink}>← Вернуться на главную</Link>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
