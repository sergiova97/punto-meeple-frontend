import apiClient from './client'
import type { AuthResponse, LoginDto } from '../types'

export const authApi = {
    login: (dto: LoginDto) =>
        apiClient.post<AuthResponse>('/auth/login', dto).then((r) => r.data),
}