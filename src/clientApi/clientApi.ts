import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!error.response) {
      return Promise.reject({
        message: "Network error",
        status: 0,
      });
    }

    return Promise.reject({
      status: error.response.status,
      message: (error.response.data as any)?.message || "Request failed",
      data: error.response.data,
    });
  }
);

export default api;
