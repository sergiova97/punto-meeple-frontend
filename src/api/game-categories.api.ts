import apiClient from './client';
import type { GameCategory } from '../types';

export const gameCategoriesApi = {
    getAll: () =>
        apiClient.get<GameCategory[]>('/game-categories').then((r) => r.data),

    create: (data: { name: string }) =>
        apiClient.post<GameCategory>('/game-categories', data).then((r) => r.data),

    update: (data: { id: number; name: string }) =>
        apiClient.put<GameCategory>('/game-categories', data).then((r) => r.data),

    remove: (id: number) =>
        apiClient.delete(`/game-categories/${id}`).then((r) => r.data),
}