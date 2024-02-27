import React, { useState } from 'react';
import styles from './Filter.module.scss';

interface FilterProps {
  onFilterChange: (filterParams: { [key: string]: any }) => void;
  onClear: () => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange, onClear }) => {
  const [filterField, setFilterField] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const handleFieldChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterField(event.target.value);
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!filterField || !filterValue) {
      alert('Выберите фильтр и введите значение');
      return;
    }

    const isNumericFilter = filterField === 'price';
    const formattedValue = isNumericFilter
      ? parseFloat(filterValue)
      : filterValue;

    onFilterChange({ [filterField]: formattedValue });
  };

  const handleClear = () => {
    setFilterField('');
    setFilterValue('');
    onClear();
  };

  return (
    <div className={styles['form-container']}>
      <form onSubmit={handleSubmit}>
        <select
          id="filterField"
          value={filterField}
          onChange={handleFieldChange}
          className={`${styles['select']}`}
        >
          <option value="" disabled hidden>
            Фильтр
          </option>
          <option value="product">Имя</option>
          <option value="price">Цена</option>
          <option value="brand">Бренд</option>
        </select>
        <input
          type="text"
          id="filterValue"
          value={filterValue}
          onChange={handleValueChange}
          placeholder="Значение"
          className={`${styles['input-field']} ${styles['input']}`}
        />
        <button
          type="submit"
          className={`${styles['button']} ${styles['filter']} ${
            !filterField || !filterValue ? styles['disabled'] : ''
          }`}
          disabled={!filterField || !filterValue}
        >
          Фильтровать
        </button>

        <button
          type="button"
          onClick={handleClear}
          className={styles['button']}
        >
          Сбросить запрос
        </button>
      </form>
    </div>
  );
};

export default Filter;
