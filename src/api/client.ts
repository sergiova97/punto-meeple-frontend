import axios from 'axios'
import {logger} from "../utils/logger.ts";

const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('pm_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error),
)

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status
        const url = error.config?.url
        const method = error.config?.method?.toUpperCase()
        console.log('Interceptor ejecutado:', method, url, status)

        if (status === 401) {
            localStorage.removeItem('pm_token')
            window.location.href = '/login'
        }

        logger.error(
            `${method} ${url} - ${status ?? 'Network Error'}`,
            'API',
            JSON.stringify(error.response?.data ?? error.message),
        )

        return Promise.reject(error)
    },
)

export default apiClient