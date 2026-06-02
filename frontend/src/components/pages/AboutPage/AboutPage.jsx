import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@components/UI/Header';
import styles from './AboutPage.module.css';

const AboutPage = ({ siteData }) => {
  return (
    <div className={styles.pageWrapper}>
      {/* Динамический логотип из FastAPI */}
      <Header logo={siteData?.logo} />

      <main className={styles.container}>
        <h1 className={styles.title}>О проекте</h1>
        <p className={styles.description}>
          Это современный интернет-магазин смартфонов и гаджетов, разработанный с использованием связки React + Vite на фронтенде и FastAPI на бэкенде.
        </p>

        <div className={styles.features}>
          <div className={styles.featureItem}>⚡ Высокая скорость благодаря Vite</div>
          <div className={styles.featureItem}>🎨 Компоненты на React</div>
          <div className={styles.featureItem}>🐍 Быстрый API на FastAPI</div>
        </div>

        <div className={styles.navigation}>
          <Link to="/" className={styles.homeLink}>← На главную</Link>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;


