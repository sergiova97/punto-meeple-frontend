import apiClient from './client';
import type { GameMechanic } from '../types';

export const gameMechanicsApi = {
    getAll: () =>
        apiClient.get<GameMechanic[]>('/game-mechanics').then((r) => r.data),

    create: (data: { name: string }) =>
        apiClient.post<GameMechanic>('/game-mechanics', data).then((r) => r.data),

    update: (data: { id: number; name: string }) =>
        apiClient.put<GameMechanic>('/game-mechanics', data).then((r) => r.data),

    remove: (id: number) =>
        apiClient.delete(`/game-mechanics/${id}`).then((r) => r.data),
}