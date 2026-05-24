import apiClient from './client';
import type { EventDto, PaginatedResponse } from '../types';

export const eventsApi = {
    getAll: (params: { title?: string; creatorId?: number; page?: number; limit?: number }) =>
        apiClient.get<PaginatedResponse<EventDto>>('/events', { params }).then((r) => r.data),

    getById: (id: number) =>
        apiClient.get<EventDto>(`/events/${id}`).then((r) => r.data),

    create: (data: {
        userId: number
        title: string
        gameId?: number
        gameName?: string
        minPlayers: number
        maxPlayers: number
        dateTime: string
        description?: string
    }) => apiClient.post<EventDto>('/events', data).then((r) => r.data),

    update: (data: {
        id: number
        userId: number
        title?: string
        gameId?: number
        gameName?: string
        minPlayers?: number
        maxPlayers?: number
        dateTime?: string
        description?: string
    }) => apiClient.put<EventDto>('/events', data).then((r) => r.data),

    delete: (id: number, userId: number) =>
        apiClient.delete(`/events/${id}`, { data: { userId } }).then((r) => r.data),

    join: (id: number, userId: number) =>
        apiClient.patch(`/events/${id}/join`, { userId }).then((r) => r.data),

    leave: (id: number, userId: number) =>
        apiClient.patch(`/events/${id}/leave`, { userId }).then((r) => r.data),
}