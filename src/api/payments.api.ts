import apiClient from './client'
import type { PaymentDto, PaginatedResponse } from '../types'

export const paymentsApi = {
    getAll: (params: { userId?: number; status?: string; method?: string; reference?: string; page?: number; limit?: number }) =>
        apiClient.get<PaginatedResponse<PaymentDto>>('/payments', { params }).then((r) => r.data),

    create: (data: { reference: string; membershipFeeIds: number[] }) =>
        apiClient.post('/payments', data).then((r) => r.data),

    accept: (id: number) =>
        apiClient.patch(`/payments/${id}/accept`).then((r) => r.data),

    deny: (id: number) =>
        apiClient.patch(`/payments/${id}/deny`).then((r) => r.data),
}