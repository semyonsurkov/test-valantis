import md5 from 'md5';
const API_URL = 'http://api.valantis.store:40000/';
const PASSWORD = 'Valantis';

const generateAuthHeader = (): string => {
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const authString = `${PASSWORD}_${timestamp}`;
  return md5(authString);
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

export const fetchProducts = async (
  pageNumber: number = 1,
  pageSize: number
) => {
  const offset = (pageNumber - 1) * pageSize;
  const authHeader = generateAuthHeader();
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth': authHeader,
    },
    body: JSON.stringify({
      action: 'get_ids',
      params: { offset, limit: pageSize },
    }),
  };

  const response = await fetch(API_URL, requestOptions);
  return handleResponse(response);
};

export const fetchDetailedProducts = async (ids: string[]) => {
  const authHeader = generateAuthHeader();
  let result = [];

  for (let i = 0; i < ids.length; i += 100) {
    const chunkIds = ids.slice(i, i + 100);
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth': authHeader,
      },
      body: JSON.stringify({
        action: 'get_items',
        params: { ids: chunkIds },
      }),
    };

    const response = await fetch(API_URL, requestOptions);
    const data = await handleResponse(response);
    result = result.concat(data.result);
  }

  return result;
};

export const filterProducts = async (filters: { [key: string]: any }) => {
  const authHeader = generateAuthHeader();
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth': authHeader,
    },
    body: JSON.stringify({
      action: 'filter',
      params: filters,
    }),
  };

  try {
    const response = await fetch(API_URL, requestOptions);
    const filteredProducts = await handleResponse(response);

    const detailedProducts = await fetchDetailedProducts(
      filteredProducts.result
    );

    return detailedProducts;
  } catch (error) {
    throw new Error('Ошибка при фильтрации продуктов: ' + error.message);
  }
};

console.log(filterProducts({ brand: 'Van Cleef & Arpels' }));
