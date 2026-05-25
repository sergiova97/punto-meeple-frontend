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

export type MembershipFeeStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'IN_REVIEW'

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

export interface MembershipFeeDto {
    id: number
    userId: number
    userName: string
    period: string
    price: number
    status: MembershipFeeStatus
}

export type PaymentStatus = 'IN_REVIEW' | 'ACCEPTED' | 'DENIED'

export interface PaymentDto {
    id: number
    userName: string
    amount: number
    method: string
    reference: string
    status: PaymentStatus
    periods: string[]
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
}

export type GameType = 'BOARD_GAME' | 'ROLE_PLAYING_GAME'

export interface GameCategory {
    id: number
    name: string
}

export interface GameMechanic {
    id: number
    name: string
}

export interface Game {
    id: number
    name: string
    description: string
    duration: number | null
    minPlayers: number | null
    maxPlayers: number | null
    publisher: string
    type: GameType
    image: string | null
    categories: GameCategory[]
    mechanics: GameMechanic[]
}

export type LoanStatus = 'PENDING' | 'ACTIVE' | 'RETURNED' | 'OVERDUE' | 'CANCELLED'

export interface LoanDto {
    id: number
    userId: number
    userName: string
    gameId: number
    gameName: string
    startDate: string
    endDate: string
    returnDate: string | null
    status: LoanStatus
}

export type EventStatus = 'OPEN' | 'FULL' | 'CANCELLED' | 'FINISHED'

export interface EventParticipant {
    id: number
    name: string
    surname: string
}

export interface EventDto {
    id: number
    title: string
    gameId: number | null
    gameName: string | null
    minPlayers: number
    maxPlayers: number
    dateTime: string
    description: string | null
    status: EventStatus
    creatorId: number
    creatorName: string
    participants: EventParticipant[]
    participantCount: number
}