import React, { useState, useEffect } from 'react';
import { fetchProducts, fetchDetailedProducts } from '../api';
import Pagination from './Pagination';

interface ProductListProps {
  filter: string;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  filter,
  currentPage,
  onPageChange,
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const pageSize = 50;
        const totalData = await fetchProducts(1, Number.MAX_SAFE_INTEGER);
        const totalProducts = totalData.result.length;
        const totalPagesCalc = Math.ceil(totalProducts / pageSize);
        setTotalPages(totalPagesCalc);

        const currentPageData = await fetchProducts(currentPage, pageSize);
        if (currentPageData.result && currentPageData.result.length > 0) {
          const detailedData = await fetchDetailedProducts(
            currentPageData.result
          );

          const uniqueProducts = detailedData.filter(
            (product, index, self) =>
              index === self.findIndex((p) => p.id === product.id)
          );

          setProducts(uniqueProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        if (error.message === 'HTTP error! status: 500') {
          console.log('Retrying request...');
          fetchData();
          return;
        }
        setError('Failed to fetch products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter, currentPage]);

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Product List</h1>
      <ul>
        {products.map((product: any) => (
          <li key={product.id}>
            <p>ID: {product.id}</p>
            <p>Name: {product.product}</p> <p>Price: {product.price}</p>
            <p>Brand: {product.brand}</p>
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
