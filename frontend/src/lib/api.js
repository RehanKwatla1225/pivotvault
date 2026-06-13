import axios from 'axios';

export const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:4000';

const TOKEN_KEY = 'pivotvault-token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
};

const api = axios.create({ baseURL: `${API_URL}/api` });

// Attach Bearer token on every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Broadcast 401s so AuthContext can log the user out
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('pv-unauthorized'));
    }
    return Promise.reject(err);
  }
);

export default api;
