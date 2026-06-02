import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const API_URL = import.meta.env.VITE_API_URL;

const Header = ({ logo }) => {
  return (
    <header className={styles.header}>
      <div className={styles.leftSide}>
        {logo && <img src={`${API_URL}/${logo}`} alt="Logo" className={styles.logoImg} />}
        <span>Магазин техники</span>
      </div>

      <nav className={styles.navigation}>
        <Link to="/">Главная</Link>
        <Link to="/profile">Профиль</Link>
        <Link to="/about">О нас</Link>
      </nav>
    </header>
  )
}

export default Header;

