import apiClient from './client'
import type {PaginatedResponse, User} from '../types'

export const usersApi = {
    getAll: (page: number = 1, limit: number = 10) =>
        apiClient.get<PaginatedResponse<User>>('/users', { params: { page, limit } }).then((r) => r.data),

    getById: (id: number) =>
        apiClient.get<User>(`/users/${id}`).then((r) => r.data),

    create: (data: {
        email: string;
        password: string;
        name: string;
        surname: string;
        birthdate: string
    }) =>
        apiClient.post<User>('/users', data).then((r) => r.data),

    update: (data: {
        id: number;
        email?: string;
        name?: string;
        surname?: string;
        birthdate?: string
    }) =>
        apiClient.put<User>('/users', data).then((r) => r.data),

    remove: (id: number) =>
        apiClient.delete(`/users/${id}`).then((r) => r.data),

    assignRoles: (data: {
        userId: number;
        roleIds: number[]
    }) =>
        apiClient.post('/users/assign-roles', data).then((r) => r.data),
}