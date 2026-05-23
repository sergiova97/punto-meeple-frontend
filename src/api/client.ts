import axios from 'axios'
import {logger} from "../utils/logger.ts";
import {translateError} from "../utils/errorMessages.ts";

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

        if (status === 401 && window.location.pathname !== '/login') {
            localStorage.removeItem('pm_token')
            window.location.href = '/login'
        }

        if (error.response?.data?.message) {
            error.response.data.message = translateError(error.response.data.message)
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