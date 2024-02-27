import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import {
  fetchDetailedProducts,
  fetchProducts,
  filterProducts,
} from '../../api/api';
import Pagination from '../Pagination/Pagination';
import styles from './ProductList.module.scss';

const ProductList: React.FC<ProductListProps & { filterVersion: number }> = ({
  filter,
  filterVersion,
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filterError, setFilterError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [retryInterval, setRetryInterval] = useState<number>(3000);
  const [cachedData, setCachedData] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let fetchedProducts;
      let totalProductsCount = 0;

      if (!filter || Object.keys(filter).length === 0) {
        if (cachedData.length > 0 && currentPage === 1) {
          setProducts(cachedData);
          setLoading(false);
          return;
        }

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
        setFilterError(false);
      }

      setProducts(fetchedProducts);
      setTotalPages(Math.ceil(totalProductsCount / 50));
      setLoading(false);
      setRetryCount(0);
      if (currentPage === 1) {
        setCachedData(fetchedProducts);
      }
    } catch (error) {
      console.error('Ошибка при загрузке продуктов:', error);
      setError(
        'Ошибка при загрузке продуктов. Пожалуйста, попробуйте еще раз.'
      );
      setTimeout(fetchData, retryInterval);
      setRetryCount(retryCount + 1);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter, currentPage, retryCount]);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
        <ClipLoader color="#007bff" size={80} />
      </div>
    );
  if (error) return <div>{error}</div>;
  if (filterError) return <div>Товары по данному фильтру не найдены.</div>;

  return (
    <div className={styles.productListContainer}>
      {products.length > 0 ? (
        <React.Fragment>
          <ul className={styles.productList}>
            {products.map((product: any) => (
              <li key={product.id} className={styles.productItem}>
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
