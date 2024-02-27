import React, { useState } from 'react';
import ProductList from './components/ProductList/ProductList';
import Filter from './components/Filter/Filter';
import styles from './App.module.scss';

const App: React.FC = () => {
  const [filter, setFilter] = useState<{ [key: string]: any }>({});

  const handleFilterChange = (newFilter: { [key: string]: any }) => {
    setFilter(newFilter);
  };

  return (
    <div className={styles.App}>
      <div className={styles.productListContainer}>
        <Filter onFilterChange={handleFilterChange} />
        <ProductList filter={filter} />
      </div>
    </div>
  );
};

export default App;
