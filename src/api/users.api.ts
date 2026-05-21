import apiClient from './client';
import type {PaginatedResponse, Role, User} from '../types';

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
        apiClient.post<{ id: number; email: string; roles: Role[]}>('/users/assign-roles', data).then((r) => r.data),

    uploadProfileImage: (id: number, file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        return apiClient
            .post<{ profileImage: string }>(`/users/${id}/profile-image`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            .then((r) => r.data)
    },
}