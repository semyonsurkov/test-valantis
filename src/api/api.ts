import md5 from 'md5';

const API_URL = 'https://api.valantis.store:41000/';
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
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth': authHeader,
    },
    body: JSON.stringify({
      action: 'get_items',
      params: { ids },
    }),
  };

  const response = await fetch(API_URL, requestOptions);
  const data = await handleResponse(response);
  return data.result;
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

  const response = await fetch(API_URL, requestOptions);
  const filteredProducts = await handleResponse(response);

  return fetchDetailedProducts(filteredProducts.result);
};
