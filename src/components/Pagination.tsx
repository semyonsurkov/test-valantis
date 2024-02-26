import React, { useState } from 'react';

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value);
  };

  const handleGoClick = () => {
    const page = Number(inputPage);
    if (page !== currentPage && page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGoClick();
    }
  };

  return (
    <div>
      <div>
        Страница {currentPage} из {totalPages}
      </div>
      <div>
        <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>
          Первая
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Предыдущая
        </button>
        <input
          type="number"
          value={inputPage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={{ width: '50px' }}
        />
        <button onClick={handleGoClick}>Перейти</button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Следующая
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Последняя
        </button>
      </div>
    </div>
  );
};

export default Pagination;
