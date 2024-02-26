import React, { useState } from 'react';

interface FilterProps {
  onFilterChange: (filterParams: { [key: string]: any }) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
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
    if (!filterField || !filterValue) return;

    const isNumericFilter = filterField === 'price';
    const formattedValue = isNumericFilter
      ? parseFloat(filterValue)
      : filterValue;

    onFilterChange({ [filterField]: formattedValue });
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={filterField} onChange={handleFieldChange}>
        <option value="">Select field</option>
        <option value="product">Name</option>
        <option value="price">Price</option>
        <option value="brand">Brand</option>
      </select>
      <input
        type="text"
        value={filterValue}
        onChange={handleValueChange}
        placeholder="Enter filter value"
      />
      <button type="submit">Filter</button>
    </form>
  );
};

export default Filter;
