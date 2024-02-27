import React, { useState } from 'react';
import ProductList from './components/ProductList/ProductList';
import styles from './App.module.scss';

const App: React.FC = () => {
  const [filter, setFilter] = useState<{ [key: string]: any }>({});

  const handleFilterChange = (newFilter: { [key: string]: any }) => {
    setFilter(newFilter);
  };

  return (
    <div className={styles.App}>
      <div className={styles.productListContainer}>
        <ProductList filter={filter} setFilter={setFilter} />
      </div>
    </div>
  );
};

export default App;
