export interface User {
    id: number
    email: string
    name: string
    surname: string
    birthdate: string
    registerDate: string
    profileImage: string | null
    isActive: boolean
    roles: Role[]
}

export interface Role {
    id: number
    name: string
}

export interface LoginDto {
    email: string
    password: string
}

export interface AuthUser {
    id: number
    email: string
    name: string
    surname: string
    roles: Role[]
}

export interface AuthResponse {
    access_token: string
    user: AuthUser
}

export type MembershipFeeStatus = 'PENDING' | 'PAID' | 'OVERDUE'

export type PaymentMethod = 'TRANSFER'

export interface Payment {
    id: number
    date: string
    method: PaymentMethod
    reference: string
}

export interface MembershipFee {
    id: number
    user: User
    period: string
    price: number
    status: MembershipFeeStatus
    payment: Payment | null
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
}