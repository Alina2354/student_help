import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let accessToken = localStorage.getItem("accessToken") || "";

export function setAccessToken(newAccessToken) {
  accessToken = newAccessToken;

  if (newAccessToken) {
    localStorage.setItem("accessToken", newAccessToken);
  } else {
    localStorage.removeItem("accessToken");
  }
}

// Добавляем access token в каждый запрос
axiosInstance.interceptors.request.use((config) => {
  if (!config.headers.authorization) {
    config.headers.authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;

// Ответ
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const prevRequest = error.config;

    // Если refresh упал — прекращаем попытки
    if (prevRequest.url.includes("/auth/refreshTokens")) {
      setAccessToken("");
      return Promise.reject(error);
    }

    // Если 403 и ещё не обновляли токен
    if (error.response?.status === 403 && !prevRequest._retry) {
      if (isRefreshing) return Promise.reject(error);

      prevRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axiosInstance.get("/auth/refreshTokens");
        const newAccessToken = response.data.data.accessToken;

        setAccessToken(newAccessToken);

        prevRequest.headers.authorization = `Bearer ${newAccessToken}`;
        isRefreshing = false;

        return axiosInstance(prevRequest);

      } catch (err) {
        // refresh НЕ сработал → удаляем токены
        setAccessToken("");
        isRefreshing = false;

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
