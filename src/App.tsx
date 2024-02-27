// App.tsx
import React, { useState } from 'react';
import ProductList from './components/ProductList';
import Filter from './components/Filter';

const App: React.FC = () => {
  const [filter, setFilter] = useState<{ [key: string]: any }>({});

  const handleFilterChange = (newFilter: { [key: string]: any }) => {
    setFilter(newFilter);
  };

  return (
    <div>
      <Filter onFilterChange={handleFilterChange} />
      <ProductList filter={filter} />
    </div>
  );
};

export default App;
