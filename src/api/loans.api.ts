import apiClient from "./client.ts";
import type {LoanDto, LoanStatus, PaginatedResponse} from "../types";

export const loansApi = {
    getAll: (params: {
        userId?: number
        gameId?: number
        gameName?: string
        userName?: string
        startDate?: string
        endDate?: string
        status?: string
        page?: number
        limit?: number
    }) =>
        apiClient.get<PaginatedResponse<LoanDto>>('/loans', { params }).then((r) => r.data),

    create: (data: { userId: number; gameId: number; startDate: string; endDate: string }) =>
        apiClient.post<LoanDto>('/loans', data).then((r) => r.data),

    updateStatus: (id: number, status: LoanStatus) =>
        apiClient.patch(`/loans/${id}/status`, { status }).then((r) => r.data),
}