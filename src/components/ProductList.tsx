// src/components/ProductList.tsx
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let fetchedProducts;
      let totalProductsCount = 0;

      if (!filter || Object.keys(filter).length === 0) {
        const pageNumber = currentPage;
        const pageSize = 50;
        const productsData = await fetchProducts(pageNumber, pageSize);
        totalProductsCount = productsData.totalCount;
        const ids = productsData.result;
        fetchedProducts = await fetchDetailedProducts(ids);
      } else {
        const filteredProducts = await filterProducts(filter);
        totalProductsCount = filteredProducts.length;
        fetchedProducts = filteredProducts.slice(
          (currentPage - 1) * 50,
          currentPage * 50
        );
      }

      setProducts(fetchedProducts);
      setTotalPages(Math.ceil(totalProductsCount / 50));
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке продуктов:', error);
      setError(
        'Ошибка при загрузке продуктов. Пожалуйста, попробуйте еще раз.'
      );
      setTimeout(fetchData, 1000);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductList;
