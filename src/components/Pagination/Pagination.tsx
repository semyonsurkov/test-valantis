import React, { useState } from 'react';
import styles from './Pagination.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [inputPage, setInputPage] = useState(currentPage.toString());

  // @ts-ignore
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value);
  };

  const handleGoClick = () => {
    const page = Number(inputPage);
    if (page !== currentPage && page > 0 && page <= totalPages) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // @ts-ignore
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGoClick();
    }
  };

  console.log(currentPage);
  return (
    <div>
      <div className={styles.buttonsContainer}>
        <button
          onClick={() => {
            onPageChange(currentPage - 1);
            {
              console.log(currentPage);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          disabled={currentPage === 1}
        >
          Предыдущая
        </button>
        <button
          onClick={() => {
            onPageChange(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          disabled={currentPage === totalPages}
        >
          Следующая
        </button>
      </div>
    </div>
  );
};

export default Pagination;
