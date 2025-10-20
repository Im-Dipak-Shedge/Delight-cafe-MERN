import axios from "axios";

// ✅ Automatically switch baseURL depending on environment
const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL || "http://localhost:3000", // fallback for local
    withCredentials: true, // send cookies
});

// ✅ Optional: Interceptor to handle expired sessions
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("Session expired. Redirecting to login...");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
