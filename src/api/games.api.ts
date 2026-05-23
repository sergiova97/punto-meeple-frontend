import apiClient from './client';
import type { Game, GameType, PaginatedResponse } from '../types';

export const gamesApi = {
    getAll: (params: { type?: GameType; name?: string; page?: number; limit?: number }) =>
        apiClient.get<PaginatedResponse<Game>>('/games', { params }).then((r) => r.data),

    getById: (id: number) =>
        apiClient.get<Game>(`/games/${id}`).then((r) => r.data),

    create: (data: {
        name: string
        description: string
        duration?: number
        minPlayers?: number
        maxPlayers?: number
        publisher: string
        type: GameType
        categoryIds: number[]
        mechanicIds: number[]
    }) => apiClient.post<Game>('/games', data).then((r) => r.data),

    update: (data: {
        id: number
        name?: string
        description?: string
        duration?: number
        minPlayers?: number
        maxPlayers?: number
        publisher?: string
        categoryIds?: number[]
        mechanicIds?: number[]
    }) => apiClient.put<Game>('/games', data).then((r) => r.data),

    remove: (id: number) =>
        apiClient.delete(`/games/${id}`).then((r) => r.data),

    uploadImage: (id: number, file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        return apiClient
            .post<{ image: string }>(`/games/${id}/image`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            .then((r) => r.data)
    },
}