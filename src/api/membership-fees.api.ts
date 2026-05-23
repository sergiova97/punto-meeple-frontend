import apiClient from './client'
import type { MembershipFeeDto, MembershipFeeStatus, PaginatedResponse } from '../types'

export const membershipFeesApi = {
    getAll: (params: { userId?: number; status?: string; period?: string; page?: number; limit?: number }) =>
        apiClient.get<PaginatedResponse<MembershipFeeDto>>('/membership-fees', { params }).then((r) => r.data),

    getById: (id: number) =>
        apiClient.get<MembershipFeeDto>(`/membership-fees/${id}`).then((r) => r.data),

    updateStatus: (ids: number[], status: MembershipFeeStatus) =>
        apiClient.patch('/membership-fees/status', { ids, status }).then((r) => r.data),

    generateFees: (data: { userIds: number[]; periods: string[]; price: number }) =>
        apiClient.post('/membership-fees/generate-fees', data).then((r) => r.data),
}