import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
});

// Request Interceptor: Inject JWT token into Authorization header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Capture global 401 Unauthorized errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            // Notify AuthProvider to synchronize application state
            window.dispatchEvent(new Event("auth-unauthorized"));
        }
        return Promise.reject(error);
    }
);

export default api;