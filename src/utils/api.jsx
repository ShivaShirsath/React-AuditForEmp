import axios from 'axios';

const apiUrl = 'https://localhost:7031/api';

const api = axios.create({
  baseURL: apiUrl,
});

export default api;
