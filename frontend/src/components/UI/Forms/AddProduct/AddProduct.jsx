import React, { useState, useRef } from 'react';
import axios from 'axios';
import classes from './AddProduct.module.css';

const API_URL = 'http://localhost:8000';

const AddProduct = ({ onAdd }) => {
  const itemAddForm = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const form = itemAddForm.current;
    const rawFormData = new FormData(form);

    const name = rawFormData.get('name');
    const price = rawFormData.get('price');
    const file = rawFormData.get('file');

    if (!name || !price || !file || file.size === 0) {
      setError("Пожалуйста, заполните название, цену и выберите фото устройства!");
      return;
    }

    setIsSubmitting(true);

    try {
      // ЭТАП 1: Загрузка картинки
      const fileFormData = new FormData();
      fileFormData.append('file', file);

      const uploadResponse = await axios.post(`${API_URL}/media/upload`, fileFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const serverImageUrl = uploadResponse.data.imageUrl;

      // ЭТАП 2: Создание JSON товара
      const newItemJson = {
        name: name,
        price: parseFloat(price),
        brand: rawFormData.get('brand') || "Смартфон",
        description: rawFormData.get('description') || "",
        imageUrl: serverImageUrl,
        isAvailable: rawFormData.get('isAvailable') === "on" || rawFormData.get('isAvailable') === true
      };

      const itemResponse = await axios.post(`${API_URL}/items`, newItemJson, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (itemResponse.status === 201 || itemResponse.status === 200) {
        setSuccess("Товар и изображение успешно добавлены!");
        if (typeof onAdd === 'function') {
          onAdd(itemResponse.data);
        }
        form.reset();
        setPreviewUrl(null);
      }

    } catch (err) {
      console.error("Ошибка добавления:", err);
      const serverError = err.response?.data?.detail || "Не удалось сохранить товар.";
      setError(`Ошибка: ${serverError}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={classes.formContainer}>
      <h2 className={classes.formTitle}>Добавление нового товара</h2>

      {success && <div className={classes.successMessage}>{success}</div>}
      {error && <div className={classes.errorMessage}>{error}</div>}

      <form ref={itemAddForm} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        <div className={classes.formElement}>
          <label className={classes.fileLabel}>Название устройства *</label>
          <input type="text" name="name" required placeholder="Например: iPhone 15 Pro" className={classes.inputField} />
        </div>

        <div className={classes.formGrid}>
          <div className={classes.formElement}>
            <label className={classes.fileLabel}>Цена (руб.) *</label>
            <input type="number" name="price" step="0.01" required placeholder="0.00" className={classes.inputField} />
          </div>

          <div className={classes.formElement}>
            <label className={classes.fileLabel}>Бренд</label>
            <input type="text" name="brand" placeholder="Например: Apple" className={classes.inputField} />
          </div>
        </div>

        <div className={classes.formElement}>
          <label className={classes.fileLabel}>Описание устройства</label>
          <textarea name="description" rows="4" placeholder="Характеристики смартфона..." className={classes.textareaField}></textarea>
        </div>

        <div className={classes.checkboxBlock}>
          <input type="checkbox" name="isAvailable" id="isAvailable" defaultChecked className={classes.checkboxInput} />
          <label htmlFor="isAvailable">Товар доступен для продажи</label>
        </div>

        <div className={classes.fileUploadBlock}>
          <label className={classes.fileLabel}>Фотография устройства *</label>
          <input type="file" name="file" accept="image/*" onChange={handleFileChange} />

          {previewUrl && (
            <div className={classes.previewBlock}>
              <p className={classes.previewTitle}>Предпросмотр:</p>
              <img src={previewUrl} alt="Превью" className={classes.previewImage} />
            </div>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} className={classes.submitButton}>
          {isSubmitting ? 'Сохранение...' : 'Добавить товар'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;


