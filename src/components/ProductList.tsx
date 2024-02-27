import React, { useState, useEffect } from 'react';
import { fetchDetailedProducts, fetchProducts, filterProducts } from '../api';
import Pagination from './Pagination';

interface ProductListProps {
  filter?: { [key: string]: any };
}

const ProductList: React.FC<ProductListProps> = ({ filter }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let fetchedProducts;
        if (!filter || Object.keys(filter).length === 0) {
          const pageNumber = 1;
          const pageSize = 50;
          const productsData = await fetchProducts(pageNumber, pageSize);
          const ids = productsData.result;
          fetchedProducts = await fetchDetailedProducts(ids);
        } else {
          fetchedProducts = await filterProducts(filter);
        }
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Ошибка при загрузке продуктов:', error);
        setError(
          'Ошибка при загрузке продуктов. Пожалуйста, попробуйте еще раз.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Список продуктов</h1>
      <ul>
        {products.map((product: any) => (
          <li key={product.id}>
            <p>ID: {product.id}</p>
            <p>Название: {product.product}</p>
            <p>Цена: {product.price}</p>
            <p>Бренд: {product.brand}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
