import apiClient from './client'
import type { Role } from '../types'

export const rolesApi = {
    getAll: () =>
        apiClient.get<Role[]>('/roles').then((r) => r.data),
}