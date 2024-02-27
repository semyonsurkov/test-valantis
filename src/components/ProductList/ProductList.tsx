import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import {
  fetchDetailedProducts,
  fetchProducts,
  filterProducts,
} from '../../api/api';
import Pagination from '../Pagination/Pagination';
import styles from './ProductList.module.scss';
import Filter from '../Filter/Filter';

interface ProductListProps {
  filter: { [key: string]: any };
  setFilter: (filter: { [key: string]: any }) => void;
}

const ProductList: React.FC<ProductListProps> = ({ filter, setFilter }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    while (true) {
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
        break;
      } catch (error) {
        const typedError = error as {
          response?: { status: number };
          message?: string;
        };
        if (typedError.response && typedError.response.status === 500) {
          console.error('Ошибка 500. Повторная попытка запроса...');
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } else {
          console.error('Ошибка при загрузке товаров:', error);
          setError(
            'Ошибка при загрузке товаров. Пожалуйста, попробуйте еще раз.'
          );
          break;
        }
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filterParams: { [key: string]: any }) => {
    setCurrentPage(1);
    setFilter(filterParams);
  };

  const handleClearFilter = () => {
    setCurrentPage(1);
    setFilter({});
  };

  if (loading)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <ClipLoader color="#007bff" size={160} />
      </div>
    );
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.productListContainer}>
      <Filter onFilterChange={handleFilterChange} onClear={handleClearFilter} />
      {products.length > 0 ? (
        <React.Fragment>
          <ul className={styles.productList}>
            {products.map((product: any, index: number) => (
              <li key={index} className={styles.productItem}>
                <p>ID: {product.id}</p>
                <p className={styles.productName}>
                  Название: {product.product}
                </p>
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
        </React.Fragment>
      ) : (
        <div>Список товаров пуст</div>
      )}
    </div>
  );
};

export default ProductList;
