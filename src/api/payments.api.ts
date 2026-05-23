import apiClient from './client'

export const paymentsApi = {
    create: (data: { reference: string; membershipFeeIds: number[] }) =>
        apiClient.post('/payments', data).then((r) => r.data),
}