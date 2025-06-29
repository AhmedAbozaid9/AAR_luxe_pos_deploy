import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Axios from "axios";
import Cookies from "js-cookie";

export const axios = Axios.create({
  baseURL: "https://beta.aarluxe.ae/api",
  timeout: 10000,
});

// Request interceptor to add authentication
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Get token from cookie instead of localStorage
    const token = Cookies.get("aar_luxe_token");
    config.headers["business-id"] = "1";
    if (token) {
      // Add the token to Authorization header
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["Content-Type"] = "application/json";
      config.headers["Accept"] = "application/json";
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

// Response interceptor for error handling
axios.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError): Promise<AxiosError> => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      // Handle unauthorized access
      Cookies.remove("aar_luxe_token");
      localStorage.removeItem("aar_luxe_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Default export for easier imports
export default axios;
