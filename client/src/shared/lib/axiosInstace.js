import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
    headers: { 'Content-Type': 'application/json' },
  withCredentials: true, //запросы должны быть авторизованы
});

let accessToken = localStorage.getItem('accessToken') || '';

export function setAccessToken(newAccessToken) {
  accessToken = newAccessToken;
  if (newAccessToken) {
    localStorage.setItem('accessToken', newAccessToken);
  } else {
    localStorage.removeItem('accessToken');
  }
}

axiosInstance.interceptors.request.use((config) => {
  if (!config.headers.authorization) {
    config.headers.authorization = `Bearer ${accessToken}`; // это жаргон - носить наш запрос является носителем акссес токена 
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error.config;

    if (error.response?.status === 403 && !prevRequest.sent) {
      const response = await axiosInstance.get('/auth/refreshTokens');
      const newAccessToken = response.data.data.accessToken;
      setAccessToken(newAccessToken);
      prevRequest.sent = true;
      prevRequest.headers.authorization = `Bearer ${newAccessToken}`;
      return axiosInstance(prevRequest);
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;